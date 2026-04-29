"use client";

import { useState } from "react";
import {
  Search, Truck, CheckCircle, XCircle, Clock, Package, RefreshCw,
  MapPin, Phone, Mail, ChevronRight, X, Save, Navigation,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  PENDING:   { label: "En attente",  color: "text-amber-700",   bg: "bg-amber-100 border-amber-200",   icon: Clock },
  CONFIRMED: { label: "Confirmée",   color: "text-blue-700",    bg: "bg-blue-100 border-blue-200",     icon: CheckCircle },
  PREPARING: { label: "En prépara.", color: "text-purple-700",  bg: "bg-purple-100 border-purple-200", icon: Package },
  SHIPPED:   { label: "En route",    color: "text-amber-700",   bg: "bg-amber-100 border-amber-200",   icon: Truck },
  DELIVERED: { label: "Livrée ✓",   color: "text-emerald-700", bg: "bg-emerald-100 border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Annulée",     color: "text-rose-700",    bg: "bg-rose-100 border-rose-200",     icon: XCircle },
  RETURNED:  { label: "Retournée",   color: "text-neutral-600", bg: "bg-neutral-200 border-neutral-300", icon: RefreshCw },
};

// Status transitions allowed for delivery agent
const DELIVERY_TRANSITIONS: Record<string, string | null> = {
  SHIPPED: "DELIVERED",
  DELIVERED: null,
  RETURNED: null,
};

interface DeliveryOrdersClientProps {
  initialOrders: any[];
  agentName: string;
}

export function DeliveryOrdersClient({ initialOrders, agentName }: DeliveryOrdersClientProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<any>(null);
  const [editTracking, setEditTracking] = useState("");
  const [editDeliveryNotes, setEditDeliveryNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = orders.filter((o) => {
    const matchQ = !q || o.number.includes(q) || o.email?.includes(q) || o.user?.name?.toLowerCase().includes(q.toLowerCase()) || o.phone?.includes(q);
    const matchS = statusFilter === "ALL" || o.status === statusFilter;
    return matchQ && matchS;
  });

  const openOrder = (o: any) => {
    const addr =
      typeof o.shippingAddress === "string"
        ? (() => { try { return JSON.parse(o.shippingAddress); } catch { return {}; } })()
        : o.shippingAddress;
    setSelected({ ...o, shippingAddress: addr });
    setEditTracking(o.trackingCode || "");
    setEditDeliveryNotes(o.deliveryNotes || "");
  };

  const saveOrder = async (updates: any) => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/delivery/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, ...updates }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || "Erreur");
        setSaving(false);
        return;
      }
      // Update local state
      const updated = { ...selected, ...updates };
      setSelected(updated);
      setOrders((prev) => prev.map((o) => (o.id === selected.id ? { ...o, ...updates } : o)));
      showToast("Commande mise à jour ✓");
    } catch {
      showToast("Erreur réseau");
    }
    setSaving(false);
  };

  const markDelivered = () => saveOrder({ status: "DELIVERED" });
  const markReturned = () => saveOrder({ status: "RETURNED" });
  const saveTracking = () => saveOrder({ trackingCode: editTracking, deliveryNotes: editDeliveryNotes });

  // KPIs
  const shipped = orders.filter((o) => o.status === "SHIPPED").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const returned = orders.filter((o) => o.status === "RETURNED").length;
  const pending = orders.filter((o) => ["PENDING", "CONFIRMED", "PREPARING"].includes(o.status)).length;

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-neutral-50/50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-8 right-8 z-[100] bg-neutral-900 text-white text-sm px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-medium tracking-tight">{toast}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-neutral-900 tracking-tight uppercase">Mes Commandes</h1>
        <p className="text-neutral-500 text-sm">{orders.length} commandes assignées à votre tournée</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "En Route", value: shipped, color: "text-amber-600", bg: "bg-amber-50/60", icon: Truck, iconColor: "text-amber-500" },
          { label: "Livrées", value: delivered, color: "text-emerald-600", bg: "bg-emerald-50/60", icon: CheckCircle, iconColor: "text-emerald-500" },
          { label: "Retournées", value: returned, color: "text-rose-600", bg: "bg-rose-50/60", icon: RefreshCw, iconColor: "text-rose-500" },
          { label: "En Attente", value: pending, color: "text-neutral-700", bg: "bg-white", icon: Clock, iconColor: "text-neutral-400" },
        ].map((k) => (
          <div key={k.label} className={cn("group rounded-[2rem] border border-neutral-200/60 p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1", k.bg)}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <k.icon className={cn("w-5 h-5", k.iconColor)} />
              </div>
              <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[2px] text-right">{k.label}</p>
            </div>
            <p className={cn("text-3xl font-black tracking-tighter", k.color)}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] border border-neutral-200/60 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher commande, client, téléphone..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["ALL", "SHIPPED", "DELIVERED", "RETURNED", "PENDING"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border",
                  statusFilter === s
                    ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                    : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100"
                )}
              >
                {s === "ALL" ? "Tout" : STATUS_MAP[s]?.label || s}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-neutral-400 font-medium">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Order cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
          <Truck className="w-16 h-16 mb-4 opacity-20" />
          <p className="font-black text-lg uppercase tracking-wider">Aucune commande</p>
          <p className="text-sm mt-1">Aucune commande ne correspond à vos critères</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((order) => {
            const S = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
            const addr =
              typeof order.shippingAddress === "string"
                ? (() => { try { return JSON.parse(order.shippingAddress); } catch { return { city: "—" }; } })()
                : (order.shippingAddress || { city: "—" });
            const canAct = order.status === "SHIPPED";

            return (
              <div
                key={order.id}
                className="bg-white rounded-[2rem] border border-neutral-200/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                  {/* Status indicator */}
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border", S.bg)}>
                    <S.icon className={cn("w-5 h-5", S.color)} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-black text-neutral-900 text-[15px] tracking-tight">{order.number}</span>
                      <span className={cn("text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider", S.bg, S.color)}>
                        {S.label}
                      </span>
                      {order.trackingCode && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 uppercase tracking-wider">
                          {order.trackingCode}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        {order.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {addr.city}{addr.street ? `, ${addr.street}` : ""}
                      </span>
                      <span className="font-bold text-neutral-700">{formatPrice(order.total)}</span>
                    </div>
                    {order.deliveryNotes && (
                      <p className="text-xs text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 inline-block mt-1">
                        {order.deliveryNotes}
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-xs text-neutral-500 italic">{order.notes}</p>
                    )}
                  </div>

                  {/* Quick actions + detail button */}
                  <div className="flex items-center gap-2 shrink-0">
                    {canAct && (
                      <>
                        <button
                          onClick={() => { setSelected({ ...order }); markDelivered(); openOrder(order); }}
                          className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
                          title="Marquer livrée"
                        >
                          Livré ✓
                        </button>
                        <button
                          onClick={() => { setSelected({ ...order }); markReturned(); openOrder(order); }}
                          className="h-9 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600 text-xs font-black uppercase tracking-wider transition-all border border-rose-200"
                          title="Retour"
                        >
                          Retour
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openOrder(order)}
                      className="h-9 w-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.15)] w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal header */}
            <div className="sticky top-0 bg-[#0a0a0a] text-white px-7 py-5 rounded-t-[2.5rem] flex items-center justify-between">
              <div>
                <p className="font-black text-lg tracking-tight">{selected.number}</p>
                <p className="text-xs text-neutral-400 mt-0.5 uppercase tracking-widest">{STATUS_MAP[selected.status]?.label}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-7 space-y-6">
              {/* Address */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-2">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Adresse de livraison</p>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    {selected.shippingAddress?.street && <p className="font-bold text-neutral-800 text-sm">{selected.shippingAddress.street}</p>}
                    <p className="text-neutral-600 text-sm">
                      {selected.shippingAddress?.city}
                      {selected.shippingAddress?.postalCode ? ` — ${selected.shippingAddress.postalCode}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <a href={`tel:${selected.phone}`} className="font-bold text-neutral-800 text-sm hover:text-amber-600 transition-colors">
                    {selected.phone}
                  </a>
                </div>
                {selected.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-neutral-600 text-sm">{selected.email}</span>
                  </div>
                )}
                {/* Open in maps */}
                {selected.shippingAddress?.city && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selected.shippingAddress.street || ""} ${selected.shippingAddress.city} Tunisie`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Ouvrir dans Google Maps
                  </a>
                )}
              </div>

              {/* Articles */}
              <div>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Articles ({selected.items?.length})</p>
                <div className="space-y-2">
                  {selected.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100">
                      <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center text-xs font-black text-neutral-500">
                        {item.quantity}x
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-800 truncate">{item.name}</p>
                        <p className="text-xs text-neutral-400">{item.sku}</p>
                      </div>
                      <span className="text-sm font-black text-neutral-700">{formatPrice(item.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 px-4 py-3 bg-neutral-900 rounded-xl text-white">
                  <span className="text-xs font-black uppercase tracking-widest">Total</span>
                  <span className="font-black text-lg">{formatPrice(selected.total)}</span>
                </div>
              </div>

              {/* Admin notes (read-only) */}
              {selected.notes && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Note admin</p>
                  <p className="text-sm text-blue-800">{selected.notes}</p>
                </div>
              )}

              {/* Tracking & delivery notes — editable */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Suivi & Remarques</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Code de suivi</label>
                    <input
                      type="text"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      placeholder="Ex: TN100042"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Remarques livraison</label>
                    <textarea
                      rows={2}
                      value={editDeliveryNotes}
                      onChange={(e) => setEditDeliveryNotes(e.target.value)}
                      placeholder="Absent, interphone, étage..."
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all bg-neutral-50 resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={saveTracking}
                  disabled={saving}
                  className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Enregistrement..." : "Sauvegarder"}
                </button>
              </div>

              {/* Status actions */}
              {(selected.status === "SHIPPED" || selected.status === "CONFIRMED" || selected.status === "PREPARING") && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={markDelivered}
                    disabled={saving || selected.status === "DELIVERED"}
                    className="h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Livrée ✓
                  </button>
                  <button
                    onClick={markReturned}
                    disabled={saving}
                    className="h-12 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-600 border border-rose-200 font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retour
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
