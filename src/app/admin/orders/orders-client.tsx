"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Search, Filter, ChevronLeft, ChevronRight, Eye, Truck,
  CheckCircle, XCircle, Clock, Package, RefreshCw, MoreVertical,
  Download, Phone, Mail, MapPin, CreditCard, ShoppingCart,
  Printer, Check, User, Plus, Trash2, X, UserCheck, ChevronDown,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:   { label: "En attente",  color: "bg-amber-100 text-amber-700 border-amber-200",   icon: Clock },
  CONFIRMED: { label: "Confirmée",   color: "bg-blue-100 text-blue-700 border-blue-200",       icon: CheckCircle },
  PREPARING: { label: "En prépa.",   color: "bg-purple-100 text-purple-700 border-purple-200", icon: Package },
  SHIPPED:   { label: "Expédiée",    color: "bg-cyan-100 text-cyan-700 border-cyan-200",        icon: Truck },
  DELIVERED: { label: "Livrée",      color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Annulée",     color: "bg-rose-100 text-rose-700 border-rose-200",        icon: XCircle },
  RETURNED:  { label: "Retournée",   color: "bg-neutral-200 text-neutral-600 border-neutral-300", icon: RefreshCw },
};

const PAYMENT_MAP: Record<string, string> = {
  CARD: "CB", D17: "D17", KONNECT: "Konnect", COD: "Espèces", TRANSFER: "Virement", PRO_NET30: "Pro Net30",
};

const STATUS_FLOW = ["PENDING","CONFIRMED","PREPARING","SHIPPED","DELIVERED"];

// Demo data for when DB is unavailable
function mkOrder(i: number): any {
  const statuses = Object.keys(STATUS_MAP);
  const status = statuses[i % statuses.length];
  const d = new Date(); d.setDate(d.getDate() - i * 2);
  return {
    id: `ord-${i}`,
    number: `SX-2026-${String(i + 1).padStart(6,"0")}`,
    email: `client${i}@example.com`,
    phone: `+216 ${50 + (i % 50)} ${String(i * 7 % 1000).padStart(3,"0")} ${String(i * 13 % 1000).padStart(3,"0")}`,
    status,
    paymentMethod: ["CARD","COD","KONNECT","D17"][i % 4],
    total: (80 + i * 37.5).toFixed(3),
    subtotal: (70 + i * 33).toFixed(3),
    shipping: "7.000",
    discount: i % 5 === 0 ? "10.000" : "0.000",
    trackingCode: status === "SHIPPED" || status === "DELIVERED" ? `TN${100000 + i}` : null,
    notes: i % 7 === 0 ? "Livraison urgente SVP" : null,
    createdAt: d.toISOString(),
    shippingAddress: { street: `Rue ${i + 1} des Fleurs`, city: ["Tunis","Sfax","Sousse","Nabeul","Bizerte"][i % 5], postalCode: `${1000 + i * 11}` },
    user: { name: `Client Demo ${i + 1}`, email: `client${i}@example.com` },
    items: [
      { id: `item-${i}-1`, name: "Charnière soft-close 35mm", sku: "CHN-001", quantity: 2, unitPrice: "15.500", total: "31.000" },
      { id: `item-${i}-2`, name: "Glissière billes 450mm", sku: "GLI-045", quantity: 1, unitPrice: "38.500", total: "38.500" },
    ],
  };
}
const DEMO_ORDERS = Array.from({ length: 48 }, (_, i) => mkOrder(i));

interface OrdersClientProps {
  initialOrders: any[];
  initialTotal: number;
}

export function OrdersClient({ initialOrders, initialTotal }: OrdersClientProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders.length ? initialOrders : DEMO_ORDERS);
  const total = initialTotal || DEMO_ORDERS.length;

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [editTracking, setEditTracking] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [agents, setAgents] = useState<{ id: string; name: string; email: string }[]>([]);
  const [assigningAgent, setAssigningAgent] = useState(false);
  const [agentPickerOpen, setAgentPickerOpen] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    name: "", email: "", phone: "",
    street: "", city: "", postalCode: "",
    paymentMethod: "COD",
    items: [{ name: "", quantity: 1, unitPrice: "" }],
  });
  const [newOrderSaving, setNewOrderSaving] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Load delivery agents once
  useEffect(() => {
    fetch("/api/admin/delivery-agents")
      .then(r => r.json())
      .then(d => setAgents(d.agents || []))
      .catch(() => {});
  }, []);

  const assignAgent = async (agentId: string | null, agentName: string | null) => {
    if (!selected) return;
    setAssigningAgent(true);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, deliveryAgentId: agentId, deliveryAgentName: agentName }),
      });
      setSelected((prev: any) => ({ ...prev, deliveryAgentId: agentId, deliveryAgentName: agentName }));
      setOrders((prev: any[]) => prev.map(o => o.id === selected.id ? { ...o, deliveryAgentId: agentId, deliveryAgentName: agentName } : o));
      setAgentPickerOpen(false);
      showToast(agentName ? `Assigné à ${agentName} ✓` : "Agent retiré ✓");
    } catch { showToast("Erreur d'assignation"); }
    setAssigningAgent(false);
  };

  const filtered = orders.filter(o => {
    const matchQ = !q || o.number.includes(q) || o.email.includes(q) || o.user?.name?.toLowerCase().includes(q.toLowerCase());
    const matchS = statusFilter === "ALL" || o.status === statusFilter;
    return matchQ && matchS;
  });

  const pageSize = 15;
  const pages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
  const pending = orders.filter((o: any) => o.status === "PENDING").length;
  const shipped = orders.filter((o: any) => o.status === "SHIPPED").length;

  const openOrder = (o: any) => {
    // shippingAddress may be a JSON string (from DB) or object (demo data)
    const addr = typeof o.shippingAddress === "string"
      ? (() => { try { return JSON.parse(o.shippingAddress); } catch { return {}; } })()
      : o.shippingAddress;
    setSelected({ ...o, shippingAddress: addr });
    setEditTracking(o.trackingCode || "");
    setEditNotes(o.notes || "");
  };

  const saveOrder = async (updates: any) => {
    setSaving(true);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, ...updates }),
      });
      setSelected((prev: any) => ({ ...prev, ...updates }));
      showToast("Commande mise à jour ✓");
    } catch { showToast("Erreur de sauvegarde"); }
    setSaving(false);
  };

  const advanceStatus = () => {
    const idx = STATUS_FLOW.indexOf(selected.status);
    if (idx < STATUS_FLOW.length - 1) saveOrder({ status: STATUS_FLOW[idx + 1] });
  };

  const exportCSV = () => {
    const rows = [
      ["N° Commande", "Client", "Email", "Téléphone", "État", "Paiement", "Total", "Date"],
      ...filtered.map(o => [
        o.number,
        o.user?.name || "Invité",
        o.email,
        o.phone || "",
        STATUS_MAP[o.status]?.label || o.status,
        PAYMENT_MAP[o.paymentMethod] || o.paymentMethod,
        o.total,
        new Date(o.createdAt).toLocaleDateString("fr-FR"),
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes-simex-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateOrder = async () => {
    const { name, email, phone, street, city, postalCode, paymentMethod, items } = newOrderForm;
    if (!name || !email || !street || !city) return showToast("Remplissez les champs obligatoires");
    if (items.some(it => !it.name || !it.unitPrice)) return showToast("Remplissez tous les articles");
    setNewOrderSaving(true);
    const total = items.reduce((s, it) => s + (Number(it.unitPrice) * it.quantity), 0);
    try {
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name, email, phone,
          shippingAddress: JSON.stringify({ street, city, postalCode }),
          paymentMethod,
          total: total.toFixed(3),
          items: items.map(it => ({
            name: it.name, quantity: it.quantity,
            unitPrice: Number(it.unitPrice).toFixed(3),
            total: (Number(it.unitPrice) * it.quantity).toFixed(3),
          })),
        }),
      });
      showToast("Commande créée avec succès ✓");
      setNewOrderOpen(false);
      setNewOrderForm({ name: "", email: "", phone: "", street: "", city: "", postalCode: "", paymentMethod: "COD", items: [{ name: "", quantity: 1, unitPrice: "" }] });
    } catch { showToast("Erreur lors de la création"); }
    setNewOrderSaving(false);
  };

  const nof = newOrderForm;
  const setNof = setNewOrderForm;

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-neutral-50/50">
      {/* Header section with refined topography */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="display text-4xl text-neutral-900 tracking-tight uppercase">Commandes</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYNCHRO LIVE
            </span>
            <p className="text-neutral-500 text-sm">{total} commandes enregistrées</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportCSV} className="h-11 px-5 rounded-xl border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 transition-all gap-2 text-neutral-700">
            <Download className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Exporter CSV</span>
          </Button>
          <Button onClick={() => setNewOrderOpen(true)} className="h-11 px-6 rounded-xl bg-brand-red hover:bg-brand-red2 text-white shadow-lg shadow-brand-red/20 transition-all gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Nouveau Panier</span>
          </Button>
        </div>
      </div>

      {/* Modern Status Notifications */}
      {toast && (
        <div className="fixed top-8 right-8 z-[100] bg-neutral-900 text-white text-sm px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium tracking-tight">{toast}</span>
          </div>
        </div>
      )}

      {/* KPI Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Chiffre d'Affaires", value: formatPrice(totalRevenue), color: "text-neutral-900", bg: "bg-white", icon: CreditCard, iconColor: "text-neutral-400" },
          { label: "En Attente", value: pending, color: "text-amber-600", bg: "bg-amber-50/40", icon: Clock, iconColor: "text-amber-500" },
          { label: "En Préparation", value: orders.filter((o: any) => o.status === "PREPARING").length, color: "text-purple-600", bg: "bg-purple-50/40", icon: Package, iconColor: "text-purple-500" },
          { label: "Expédiées", value: shipped, color: "text-cyan-600", bg: "bg-cyan-50/40", icon: Truck, iconColor: "text-cyan-500" },
        ].map(k => (
          <div key={k.label} className={cn("group rounded-[2rem] border border-neutral-200/60 p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1", k.bg)}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <k.icon className={cn("w-6 h-6", k.iconColor)} />
              </div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[2px]">{k.label}</p>
            </div>
            <p className={cn("text-3xl font-black tracking-tighter", k.color)}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar with Search Integration */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par client, email ou commande..."
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              className="w-full pl-14 pr-6 py-4 bg-neutral-50/50 border-none rounded-[1.5rem] text-sm focus:ring-2 focus:ring-neutral-100 transition-all outline-none placeholder:text-neutral-400 font-medium"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center px-2">
            {["ALL", "PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  statusFilter === s
                    ? "bg-brand-black text-white shadow-lg shadow-black/10 scale-105"
                    : "bg-white text-neutral-400 border border-neutral-100 hover:border-neutral-200 hover:text-neutral-600"
                )}
              >
                {s === "ALL" ? "TOUT" : STATUS_MAP[s]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest">N° Commande</th>
                <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest hidden md:table-cell">Client & Contact</th>
                <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest hidden lg:table-cell">Date</th>
                <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest">État</th>
                <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest hidden sm:table-cell">Paiement</th>
                <th className="text-right px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest">Total TTC</th>
                <th className="px-8 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {paged.map(o => {
                const S = STATUS_MAP[o.status] || STATUS_MAP.PENDING;
                const SIcon = S.icon;
                return (
                  <tr key={o.id} className="group hover:bg-neutral-50/80 transition-all duration-300 cursor-pointer" onClick={() => openOrder(o)}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono font-black text-neutral-900 text-sm group-hover:text-brand-red transition-colors">#{o.number}</span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Référence Directe</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-black text-xs uppercase">
                          {(o.user?.name || o.email || "A").substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-sm leading-tight">{o.user?.name || "Invité"}</p>
                          <p className="text-neutral-400 text-xs">{o.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden lg:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-600">{new Date(o.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })}</span>
                        <span className="text-[11px] text-neutral-400">{new Date(o.createdAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors",
                        S.color === "bg-amber-100 text-amber-600 border-amber-200" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        S.color === "bg-emerald-100 text-emerald-600 border-emerald-200" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        "bg-neutral-50 text-neutral-600 border-neutral-100"
                      )}>
                        <SIcon className="w-3.5 h-3.5" />
                        {S.label}
                      </span>
                    </td>
                    <td className="px-8 py-6 hidden sm:table-cell">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[11px] font-black text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md uppercase tracking-tight">
                          {PAYMENT_MAP[o.paymentMethod] || o.paymentMethod}
                        </span>
                        {o.paymentMethod === "COD" && <span className="text-[10px] text-neutral-400 italic">À l'expédition</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-lg font-black text-neutral-900 tracking-tighter">{formatPrice(Number(o.total))}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-red group-hover:text-white transition-all shadow-sm">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-[2rem] bg-neutral-50 flex items-center justify-center">
                        <Search className="w-8 h-8 text-neutral-200" />
                      </div>
                      <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Aucun résultat trouvé pour votre recherche</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 border-t border-neutral-100 bg-neutral-50/30 gap-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Affichage de {paged.length} sur {filtered.length} résultats</p>
          {pages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setPage(p => Math.max(1, p - 1)); }}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-neutral-200 bg-white disabled:opacity-30 hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <span className="text-xs font-black text-neutral-900">{page}</span>
                <span className="text-[10px] font-bold text-neutral-300 uppercase">/</span>
                <span className="text-xs font-bold text-neutral-400">{pages}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setPage(p => Math.min(pages, p + 1)); }}
                disabled={page === pages}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-neutral-200 bg-white disabled:opacity-30 hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (() => {
        const S = STATUS_MAP[selected.status] || STATUS_MAP.PENDING;
        const SIcon = S.icon;
        const currentIdx = STATUS_FLOW.indexOf(selected.status);
        const canAdvance = currentIdx < STATUS_FLOW.length - 1;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.15)] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="bg-neutral-900 text-white p-8 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black tracking-tighter uppercase">Commande #{selected.number}</h2>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] border transition-all shadow-lg",
                        currentIdx >= 4 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      )}>
                        {S.label}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-sm flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      Enregistrée le {new Date(selected.createdAt).toLocaleDateString("fr-FR", { day: 'long', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase transition-all">
                      <Printer className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    {canAdvance && (
                      <Button
                        onClick={advanceStatus}
                        disabled={saving}
                        className="h-12 px-8 rounded-2xl bg-brand-red hover:bg-brand-red2 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-red/20 transition-all"
                      >
                        {saving ? "MAJ en cours..." : "Passer à l'étape suivante"}
                      </Button>
                    )}
                    <button onClick={() => setSelected(null)} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-white p-8 space-y-8">
                {/* Progress Stepper */}
                <div className="relative pt-4 pb-12">
                  <div className="absolute top-8 left-0 w-full h-1 bg-neutral-100 rounded-full" />
                  <div
                    className="absolute top-8 left-0 h-1 bg-brand-red rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    style={{ width: `${(currentIdx / (STATUS_FLOW.length - 1)) * 100}%` }}
                  />
                  <div className="relative flex justify-between">
                    {STATUS_FLOW.map((s, i) => {
                      const active = i <= currentIdx;
                      const SM = STATUS_MAP[s];
                      return (
                        <div key={s} className="flex flex-col items-center gap-3 group">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all duration-300",
                            active ? "bg-brand-red text-white scale-110 shadow-lg" : "bg-white border-2 border-neutral-100 text-neutral-300"
                          )}>
                            {active ? <Check className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />}
                          </div>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest transition-colors",
                            active ? "text-neutral-900" : "text-neutral-300"
                          )}>
                            {SM?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Items Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <p className="font-black text-neutral-900 uppercase tracking-widest text-xs">Articles du Panier</p>
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full">{selected.items?.length || 0} ARTICLES</span>
                    </div>
                    <div className="space-y-3">
                      {selected.items?.map((item: any) => (
                        <div key={item.id} className="group flex items-center gap-4 p-4 rounded-3xl bg-neutral-50 hover:bg-neutral-100/50 transition-all border border-transparent hover:border-neutral-100">
                          <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                            <Package className="w-6 h-6 text-neutral-200" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-neutral-900 text-sm truncate">{item.name || item.product?.nameFr || item.product?.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Quantité:</span>
                              <span className="text-sm font-black text-brand-red">{item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-neutral-900 text-sm">{formatPrice(Number(item.total))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Totals */}
                    <div className="mt-8 p-7 rounded-[2rem] bg-neutral-900 text-white space-y-4">
                      <div className="flex justify-between text-neutral-400 text-[10px] font-black uppercase tracking-[2px]">
                        <span>Sous-total</span>
                        <span className="text-white">{formatPrice(Number(selected.subtotal || selected.total))}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400 text-[10px] font-black uppercase tracking-[2px]">
                        <span>Expédition</span>
                        <span className="text-emerald-400">OFFERTE</span>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                        <span className="text-sm font-black uppercase tracking-[3px]">Total Net</span>
                        <span className="text-3xl font-black text-brand-red tracking-tighter">{formatPrice(Number(selected.total))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Logistics Section */}
                  <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-white border border-neutral-200/60 shadow-sm space-y-8">
                      {/* Recipient */}
                      <div className="space-y-4">
                        <p className="font-black text-neutral-900 uppercase tracking-widest text-xs border-b border-neutral-50 pb-2">Destinataire</p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-neutral-900">{selected.user?.name || "Client Invité"}</p>
                            <p className="text-xs text-neutral-400 font-bold">{selected.email}</p>
                          </div>
                        </div>
                        <a href={`tel:${selected.phone}`} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors text-sm font-black text-neutral-700">
                          <Phone className="w-4 h-4 text-brand-red" /> {selected.phone}
                        </a>
                      </div>
                      {/* Address */}
                      <div className="space-y-4">
                        <p className="font-black text-neutral-900 uppercase tracking-widest text-xs border-b border-neutral-50 pb-2">Point de Livraison</p>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            {selected.shippingAddress ? (
                              <p className="text-sm font-bold text-neutral-700 leading-relaxed uppercase tracking-tight">
                                {selected.shippingAddress.street}<br />
                                {selected.shippingAddress.city}, {selected.shippingAddress.postalCode}<br />
                                Tunisia
                              </p>
                            ) : <p className="text-sm italic text-neutral-400">Adresse inconnue</p>}
                          </div>
                        </div>
                      </div>
                      {/* Payment */}
                      <div className="space-y-4">
                        <p className="font-black text-neutral-900 uppercase tracking-widest text-xs border-b border-neutral-50 pb-2">Règlement</p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500 shrink-0 border border-cyan-100 text-lg font-black">
                            {selected.paymentMethod === "COD" ? "⟳" : "💳"}
                          </div>
                          <div>
                            <p className="text-sm font-black text-neutral-900 uppercase tracking-tighter">
                              {PAYMENT_MAP[selected.paymentMethod] || selected.paymentMethod}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Transaction Certifiée</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Delivery Agent Assignment ── */}
                    <div className="p-6 rounded-[2rem] bg-neutral-50 border border-neutral-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="font-black text-neutral-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-brand-red" />
                          Agent Livraison
                        </p>
                        {selected.deliveryAgentName && (
                          <button
                            onClick={() => assignAgent(null, null)}
                            disabled={assigningAgent}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-700 uppercase tracking-wider transition-colors disabled:opacity-50"
                          >
                            Retirer
                          </button>
                        )}
                      </div>

                      {selected.deliveryAgentName ? (
                        <div className="flex items-center gap-3 bg-white rounded-2xl border border-neutral-200 px-4 py-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-sm shrink-0">
                            {selected.deliveryAgentName.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-neutral-900 text-sm truncate">{selected.deliveryAgentName}</p>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Agent assigné</p>
                          </div>
                          <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-400 italic">Aucun agent assigné</p>
                      )}

                      {/* Agent picker */}
                      <div className="relative">
                        <button
                          onClick={() => setAgentPickerOpen(v => !v)}
                          className="w-full h-10 rounded-xl border border-neutral-200 bg-white flex items-center justify-between px-4 text-sm font-bold text-neutral-600 hover:border-brand-red/30 hover:text-brand-red transition-all"
                        >
                          <span className="text-xs uppercase tracking-wider">
                            {agents.length === 0 ? "Aucun agent disponible" : "Choisir un agent..."}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {agentPickerOpen && agents.length > 0 && (
                          <div className="absolute top-12 left-0 w-full bg-white rounded-2xl border border-neutral-200 shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            {agents.map(agent => (
                              <button
                                key={agent.id}
                                onClick={() => assignAgent(agent.id, agent.name)}
                                disabled={assigningAgent}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left disabled:opacity-50"
                              >
                                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-xs shrink-0">
                                  {agent.name.substring(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-neutral-900 text-sm truncate">{agent.name}</p>
                                  <p className="text-xs text-neutral-400 truncate">{agent.email}</p>
                                </div>
                                {selected.deliveryAgentId === agent.id && <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="p-7 rounded-[2.5rem] bg-neutral-50 border border-neutral-100 space-y-4">
                      <div className="space-y-2">
                        <p className="font-black text-neutral-900 uppercase tracking-widest text-[10px]">Notes Internes</p>
                        <textarea
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          placeholder="Ajouter une instruction pour l'équipe..."
                          className="w-full rounded-2xl border-neutral-200 bg-white p-4 text-xs font-bold focus:ring-2 focus:ring-brand-red/10 transition-all outline-none resize-none h-24"
                        />
                        <Button variant="ghost" size="sm" onClick={() => saveOrder({ notes: editNotes })} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-brand-red">
                          Sauvegarder les notes
                        </Button>
                      </div>
                    </div>

                    {/* Cancel */}
                    <div className="pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => saveOrder({ status: "CANCELLED" })}
                        disabled={saving || selected.status === "CANCELLED"}
                        className="w-full h-14 rounded-2xl text-neutral-400 hover:text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] transition-all"
                      >
                        Révoquer ou Annuler la Commande
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* ── Nouveau Panier Modal ── */}
      {newOrderOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setNewOrderOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-neutral-900 text-white px-8 py-7 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Créer une Commande</h2>
                <p className="text-neutral-400 text-sm font-medium mt-0.5">Saisie manuelle par l'équipe admin</p>
              </div>
              <button onClick={() => setNewOrderOpen(false)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-8 space-y-6">
              {/* Client */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Client <span className="text-brand-red">*</span></p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Nom complet</label>
                    <input value={nof.name} onChange={e => setNof(f => ({ ...f, name: e.target.value }))} placeholder="Ahmed Ben Ali" autoComplete="off"
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Email</label>
                    <input type="email" value={nof.email} onChange={e => setNof(f => ({ ...f, email: e.target.value }))} placeholder="ahmed@mail.com" autoComplete="off"
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Téléphone</label>
                    <input type="tel" value={nof.phone} onChange={e => setNof(f => ({ ...f, phone: e.target.value }))} placeholder="+216 XX XXX XXX"
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Paiement</label>
                    <select value={nof.paymentMethod} onChange={e => setNof(f => ({ ...f, paymentMethod: e.target.value }))}
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all">
                      <option value="COD">Espèces (COD)</option>
                      <option value="CARD">Carte Bancaire</option>
                      <option value="D17">D17</option>
                      <option value="KONNECT">Konnect</option>
                      <option value="TRANSFER">Virement</option>
                      <option value="PRO_NET30">Pro Net30</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Adresse de livraison <span className="text-brand-red">*</span></p>
                <div className="space-y-3">
                  <input value={nof.street} onChange={e => setNof(f => ({ ...f, street: e.target.value }))} placeholder="Rue et numéro" autoComplete="off"
                    className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={nof.city} onChange={e => setNof(f => ({ ...f, city: e.target.value }))} placeholder="Ville" autoComplete="off"
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                    <input value={nof.postalCode} onChange={e => setNof(f => ({ ...f, postalCode: e.target.value }))} placeholder="Code postal" autoComplete="off"
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Articles <span className="text-brand-red">*</span></p>
                  <button onClick={() => setNof(f => ({ ...f, items: [...f.items, { name: "", quantity: 1, unitPrice: "" }] }))}
                    className="text-[10px] font-black uppercase tracking-widest text-brand-red flex items-center gap-1 hover:text-brand-red2 transition-colors">
                    <Plus className="w-3 h-3" /> Ajouter
                  </button>
                </div>
                <div className="space-y-2">
                  {nof.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input value={item.name} onChange={e => setNof(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, name: e.target.value } : it) }))}
                        placeholder="Désignation article" autoComplete="off"
                        className="flex-1 h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                      <input type="number" min="1" value={item.quantity} onChange={e => setNof(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, quantity: Number(e.target.value) } : it) }))}
                        className="w-16 h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm font-black text-neutral-900 text-center focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                      <input type="number" min="0" step="0.001" value={item.unitPrice} onChange={e => setNof(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, unitPrice: e.target.value } : it) }))}
                        placeholder="Prix DT" autoComplete="off"
                        className="w-28 h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                      {nof.items.length > 1 && (
                        <button onClick={() => setNof(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))}
                          className="w-11 h-11 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total estimé</p>
                    <p className="text-2xl font-black text-neutral-900 tracking-tighter">
                      {formatPrice(nof.items.reduce((s, it) => s + (Number(it.unitPrice || 0) * it.quantity), 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/60 flex gap-3 shrink-0">
              <Button variant="outline" onClick={() => setNewOrderOpen(false)} className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-wider">Annuler</Button>
              <Button onClick={handleCreateOrder} disabled={newOrderSaving} className="flex-1 h-12 rounded-2xl bg-brand-red hover:bg-brand-red2 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/20">
                {newOrderSaving ? "Création..." : "Créer la Commande"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
