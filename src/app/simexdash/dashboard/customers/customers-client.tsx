"use client";

import { useState } from "react";
import {
  Search, Eye, Star, ChevronLeft, ChevronRight, ShoppingBag,
  Crown, User, Shield, Truck, Plus, Trash2, X, Percent,
  StickyNote, Phone, Mail, Calendar, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<string, { label: string; color: string; accent: string; icon: React.ElementType; desc: string }> = {
  CUSTOMER:       { label: "Client",      color: "bg-neutral-100 text-neutral-700 border-neutral-200", accent: "#6b7280", icon: User,  desc: "Compte standard" },
  PRO:            { label: "Pro",         color: "bg-amber-50 text-amber-700 border-amber-200",        accent: "#d97706", icon: Crown, desc: "Compte professionnel" },
  STAFF:          { label: "Staff",       color: "bg-blue-50 text-blue-700 border-blue-200",           accent: "#2563eb", icon: Shield,desc: "Employé interne" },
  ADMIN:          { label: "Admin",       color: "bg-red-50 text-brand-red border-red-200",            accent: "#e1252a", icon: Shield,desc: "Administrateur" },
  SUPER_ADMIN:    { label: "Super Admin", color: "bg-red-50 text-brand-red border-red-200",            accent: "#e1252a", icon: Shield,desc: "Super Administrateur" },
  DELIVERY_AGENT: { label: "Livreur",     color: "bg-amber-50 text-amber-700 border-amber-200",        accent: "#d97706", icon: Truck, desc: "Agent de livraison" },
};

const PRO_TIERS = [
  { value: "bronze",  label: "Bronze",  color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",      discount: 5,  desc: "−5% sur tous les produits" },
  { value: "silver",  label: "Silver",  color: "text-neutral-500", bg: "bg-neutral-50 border-neutral-300",  discount: 10, desc: "−10% + livraison prioritaire" },
  { value: "gold",    label: "Gold",    color: "text-yellow-600",  bg: "bg-yellow-50 border-yellow-200",    discount: 15, desc: "−15% + paiement 30 jours" },
  { value: "diamond", label: "Diamond", color: "text-cyan-600",    bg: "bg-cyan-50 border-cyan-200",        discount: 25, desc: "−25% + compte dédié" },
];

const EDIT_ROLES = ["CUSTOMER", "PRO", "STAFF"];

const EMPTY_FORM = {
  name: "", email: "", phone: "",
  password: "", confirmPassword: "",
  role: "CUSTOMER", proTier: "", taxId: "",
  discount: "0", notes: "",
};

function mkUser(i: number): any {
  const roles = ["CUSTOMER","CUSTOMER","CUSTOMER","PRO","PRO","STAFF"];
  const role = roles[i % roles.length];
  const d = new Date(); d.setDate(d.getDate() - i * 5);
  const tier = role === "PRO" ? PRO_TIERS[i % 4] : null;
  return {
    id: `u${i}`, name: `Client Demo ${i + 1}`,
    email: `client${i}@example.com`,
    phone: `+216 ${(50 + i) % 99} ${String(i * 7 % 999).padStart(3,"0")} ${String(i * 13 % 999).padStart(3,"0")}`,
    role, proTier: tier?.value ?? null,
    taxId: role === "PRO" ? `TN-${100000 + i}` : null,
    discount: i % 7 === 0 ? 5 : 0,
    notes: i % 9 === 0 ? "Client fidèle - priorité livraison" : null,
    createdAt: d.toISOString(),
    _count: { orders: (i * 3) % 40 },
  };
}
const DEMO_USERS = Array.from({ length: 40 }, (_, i) => mkUser(i));

interface CustomersClientProps { initialUsers: any[]; initialTotal: number }

export function CustomersClient({ initialUsers }: CustomersClientProps) {
  const [users, setUsers] = useState(initialUsers.length ? initialUsers : DEMO_USERS);

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };
  const setF = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = users.filter(u => {
    const matchQ = !q || u.name?.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q) || u.phone?.includes(q);
    const matchR = roleFilter === "ALL" || u.role === roleFilter;
    return matchQ && matchR;
  });
  const pageSize = 15;
  const pages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const proCount = users.filter(u => u.role === "PRO").length;
  const totalOrders = users.reduce((s, u) => s + (u._count?.orders || 0), 0);
  const discountedCount = users.filter(u => (u.discount ?? 0) > 0).length;

  const openCreate = () => { setSelected(null); setForm({ ...EMPTY_FORM }); setModal("create"); };
  const openEdit = (u: any) => {
    setSelected(u);
    setForm({ name: u.name || "", email: u.email || "", phone: u.phone || "", password: "", confirmPassword: "", role: u.role || "CUSTOMER", proTier: u.proTier || "", taxId: u.taxId || "", discount: String(u.discount ?? 0), notes: u.notes || "" });
    setModal("edit");
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return showToast("Nom, email et mot de passe requis", "err");
    if (form.password.length < 8) return showToast("Mot de passe minimum 8 caractères", "err");
    if (form.password !== form.confirmPassword) return showToast("Les mots de passe ne correspondent pas", "err");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role, proTier: form.proTier || null, taxId: form.taxId || null, discount: parseFloat(form.discount) || 0, notes: form.notes || null }) });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || "Erreur création", "err");
      setUsers(u => [{ ...data.user, _count: { orders: 0 } }, ...u]);
      setModal(null); showToast("Client créé avec succès");
    } catch { showToast("Erreur réseau", "err"); }
    setSaving(false);
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/customers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, role: form.role, proTier: form.proTier || null, taxId: form.taxId || null, discount: parseFloat(form.discount) || 0, notes: form.notes || null }) });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || "Erreur mise à jour", "err");
      setUsers(u => u.map(x => x.id === selected.id ? { ...x, ...data.user } : x));
      setModal(null); showToast("Client mis à jour ✓");
    } catch { showToast("Erreur réseau", "err"); }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement ${name} ?`)) return;
    try {
      await fetch("/api/admin/customers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setUsers(u => u.filter(x => x.id !== id)); showToast("Client supprimé");
    } catch { showToast("Erreur suppression", "err"); }
  };

  const tierDiscount = (tier: string | null) => PRO_TIERS.find(t => t.value === tier)?.discount ?? 0;
  const effectiveDiscount = (u: any) => (u.discount ?? 0) > 0 ? u.discount : tierDiscount(u.proTier);

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-8 right-8 z-[200] text-white text-sm px-6 py-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-right-8 duration-300 flex items-center gap-3",
          toast.type === "err" ? "bg-red-600 border-red-500/30" : "bg-neutral-900 border-white/5"
        )}>
          <div className={cn("w-2 h-2 rounded-full shrink-0", toast.type === "err" ? "bg-red-300" : "bg-emerald-400")} />
          <span className="font-medium">{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight uppercase">Clients</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />BASE CLIENTS
            </span>
            <p className="text-neutral-500 text-sm">{users.length} comptes enregistrés</p>
          </div>
        </div>
        <Button onClick={openCreate} className="h-11 px-6 rounded-xl bg-brand-red hover:bg-brand-red2 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/20 gap-2">
          <Plus className="w-4 h-4" /> Nouveau Client
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total clients",     value: users.length,    color: "text-neutral-900", bg: "bg-white",         icon: User,        iconColor: "text-neutral-400" },
          { label: "Comptes Pro",       value: proCount,        color: "text-amber-600",   bg: "bg-amber-50/40",   icon: Crown,       iconColor: "text-amber-500" },
          { label: "Commandes passées", value: totalOrders,     color: "text-emerald-600", bg: "bg-emerald-50/40", icon: ShoppingBag, iconColor: "text-emerald-500" },
          { label: "Avec remise perso", value: discountedCount, color: "text-purple-600",  bg: "bg-purple-50/40",  icon: Percent,     iconColor: "text-purple-500" },
        ].map(k => (
          <div key={k.label} className={cn("group rounded-[2rem] border border-neutral-200/60 p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1", k.bg)}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <k.icon className={cn("w-6 h-6", k.iconColor)} />
              </div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[2px] text-right">{k.label}</p>
            </div>
            <p className={cn("text-3xl font-black tracking-tighter", k.color)}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 pointer-events-none" />
            <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }}
              placeholder="Rechercher par nom, email ou téléphone…"
              className="w-full pl-14 pr-6 py-4 bg-neutral-50/50 rounded-[1.5rem] text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100 border-none" />
          </div>
          <div className="flex flex-wrap gap-2 items-center px-2">
            {["ALL", "CUSTOMER", "PRO", "STAFF"].map(r => (
              <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                className={cn("px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  roleFilter === r ? "bg-neutral-900 text-white shadow-lg scale-105" : "bg-white text-neutral-400 border border-neutral-100 hover:border-neutral-200 hover:text-neutral-600"
                )}>{r === "ALL" ? "TOUS" : ROLE_CONFIG[r]?.label?.toUpperCase() || r}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                {["Client","Email","Rôle","Tier","Remise","Cmdes","Inscrit",""].map((h, i) => (
                  <th key={i} className={cn("text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest",
                    i === 1 ? "hidden md:table-cell" : i === 3 || i === 5 ? "hidden lg:table-cell" : i === 4 ? "hidden sm:table-cell" : i === 6 ? "hidden xl:table-cell" : ""
                  )}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {paged.map(u => {
                const RC = ROLE_CONFIG[u.role] || ROLE_CONFIG.CUSTOMER;
                const RIcon = RC.icon;
                const disc = effectiveDiscount(u);
                const tier = PRO_TIERS.find(t => t.value === u.proTier);
                return (
                  <tr key={u.id} className="group hover:bg-neutral-50/80 transition-all duration-200 cursor-pointer" onClick={() => openEdit(u)}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 border-2"
                          style={{ background: `${RC.accent}15`, color: RC.accent, borderColor: `${RC.accent}30` }}>
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-neutral-900 text-sm group-hover:text-brand-red transition-colors">{u.name || "—"}</p>
                          <p className="text-xs text-neutral-400 md:hidden">{u.email}</p>
                          {u.notes && <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5"><StickyNote className="w-2.5 h-2.5" /> Note</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-neutral-500 hidden md:table-cell">{u.email}</td>
                    <td className="px-8 py-5">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border", RC.color)}>
                        <RIcon className="w-3 h-3" />{RC.label}
                      </span>
                    </td>
                    <td className="px-8 py-5 hidden lg:table-cell">
                      {tier ? <span className={cn("text-xs font-black capitalize", tier.color)}>★ {tier.label}</span> : <span className="text-neutral-300 text-xs">—</span>}
                    </td>
                    <td className="px-8 py-5 hidden sm:table-cell">
                      {disc > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">
                          <Percent className="w-2.5 h-2.5" />−{disc}%
                        </span>
                      ) : <span className="text-neutral-300 text-xs">—</span>}
                    </td>
                    <td className="px-8 py-5 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-600">
                        <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />{u._count?.orders || 0}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-neutral-400 hidden xl:table-cell">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={e => { e.stopPropagation(); openEdit(u); }} className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-brand-red hover:text-white transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(u.id, u.name); }} className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={8} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-neutral-50 flex items-center justify-center"><Search className="w-8 h-8 text-neutral-200" /></div>
                    <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Aucun client trouvé</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 border-t border-neutral-100 bg-neutral-50/30 gap-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{filtered.length} clients · page {page}/{Math.max(1, pages)}</p>
          {pages > 1 && (
            <div className="flex items-center gap-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-neutral-200 bg-white disabled:opacity-30 hover:border-brand-red hover:text-brand-red transition-all shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <span className="text-xs font-black text-neutral-900">{page}</span><span className="text-[10px] font-bold text-neutral-300">/</span><span className="text-xs font-bold text-neutral-400">{pages}</span>
              </div>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-neutral-200 bg-white disabled:opacity-30 hover:border-brand-red hover:text-brand-red transition-all shadow-sm"><ChevronRight className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

            {/* Modal Header */}
            <div className="bg-neutral-900 text-white px-8 py-7 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">{modal === "create" ? "Nouveau Client" : `Modifier — ${selected?.name}`}</h2>
                <p className="text-neutral-400 text-sm font-medium mt-0.5">{modal === "create" ? "Créer un compte client" : selected?.email}</p>
              </div>
              <button onClick={() => setModal(null)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shrink-0"><X className="w-5 h-5" /></button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-8 space-y-6">

              {/* Identité (create only) */}
              {modal === "create" && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Identité <span className="text-brand-red">*</span></p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Nom complet", key: "name", type: "text",     ph: "Ahmed Ben Ali",     ac: "off",          col: "" },
                      { label: "Email",       key: "email",type: "email",    ph: "ahmed@mail.com",    ac: "off",          col: "" },
                      { label: "Téléphone",   key: "phone",type: "tel",      ph: "+216 XX XXX XXX",   ac: "off",          col: "" },
                      { label: "Mot de passe ★", key: "password", type: "password", ph: "Min. 8 caractères", ac: "new-password", col: "" },
                    ].map(f => (
                      <div key={f.key} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{f.label}</label>
                        <input type={f.type} value={(form as any)[f.key]} onChange={e => setF(f.key, e.target.value)} placeholder={f.ph} autoComplete={f.ac}
                          className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                      </div>
                    ))}
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Confirmer le mot de passe</label>
                      <input type="password" value={form.confirmPassword} onChange={e => setF("confirmPassword", e.target.value)} placeholder="Répéter" autoComplete="new-password"
                        className={cn("w-full h-12 rounded-2xl border bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all",
                          form.confirmPassword && form.confirmPassword !== form.password ? "border-red-300 focus:ring-red-100" :
                          form.confirmPassword && form.confirmPassword === form.password ? "border-emerald-300 focus:ring-emerald-100" : "border-neutral-200 focus:ring-brand-red/10"
                        )} />
                    </div>
                  </div>
                </div>
              )}

              {/* Info stats (edit mode) */}
              {modal === "edit" && selected && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Phone,    label: "Téléphone", val: selected.phone || "—" },
                    { icon: Package,  label: "Commandes", val: selected._count?.orders || 0, big: true },
                    { icon: Calendar, label: "Inscrit",   val: new Date(selected.createdAt).toLocaleDateString("fr-FR") },
                  ].map(s => (
                    <div key={s.label} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5"><s.icon className="w-3 h-3" />{s.label}</p>
                      <p className={cn("font-bold text-neutral-900", s.big ? "text-2xl font-black" : "text-sm")}>{s.val}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Rôle */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Rôle & Type de compte</p>
                <div className="grid grid-cols-1 gap-2">
                  {EDIT_ROLES.map(role => {
                    const RC = ROLE_CONFIG[role];
                    const isSelected = form.role === role;
                    return (
                      <label key={role} className={cn("flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        isSelected ? "shadow-sm" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100/60"
                      )} style={isSelected ? { borderColor: RC.accent, backgroundColor: `${RC.accent}0d` } : {}}>
                        <input type="radio" name="role" value={role} checked={isSelected} onChange={() => setF("role", role)} className="hidden" />
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border", RC.color)}><RC.icon className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-neutral-900">{RC.label}</p>
                          <p className="text-[11px] font-bold text-neutral-500">{RC.desc}</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                          style={isSelected ? { borderColor: RC.accent, backgroundColor: RC.accent } : { borderColor: "#e5e7eb" }}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Pro tier */}
              {form.role === "PRO" && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Niveau Pro</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PRO_TIERS.map(t => (
                      <button key={t.value} type="button" onClick={() => setF("proTier", form.proTier === t.value ? "" : t.value)}
                        className={cn("p-4 rounded-2xl border-2 text-left transition-all",
                          form.proTier === t.value ? `${t.bg} shadow-sm` : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                        )}>
                        <p className={cn("font-black text-sm", t.color)}>★ {t.label}</p>
                        <p className="text-[11px] text-neutral-500 font-bold mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Matricule fiscal</label>
                    <input value={form.taxId} onChange={e => setF("taxId", e.target.value)} placeholder="TN-123456" autoComplete="off"
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  </div>
                </div>
              )}

              {/* Remise */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Remise personnalisée</p>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input type="number" min="0" max="100" step="1" value={form.discount} onChange={e => setF("discount", e.target.value)}
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  </div>
                  <div className="text-sm">
                    {parseFloat(form.discount) > 0
                      ? <span className="text-emerald-600 font-black">−{form.discount}% sur toutes les commandes</span>
                      : <span className="text-neutral-400 font-bold">Aucune remise</span>}
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400 font-bold">
                  Remise prioritaire sur les remises de tier.
                  {form.role === "PRO" && form.proTier && ` Tier ${PRO_TIERS.find(t => t.value === form.proTier)?.label} = −${tierDiscount(form.proTier)}%`}
                </p>
              </div>

              {/* Notes internes */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Note interne</p>
                <textarea value={form.notes} onChange={e => setF("notes", e.target.value)} rows={3}
                  placeholder="Note visible uniquement par l'équipe admin…"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all resize-none" />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/60 flex gap-3 shrink-0">
              <Button variant="outline" onClick={() => setModal(null)} className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-wider">Annuler</Button>
              <Button onClick={modal === "create" ? handleCreate : handleEdit} disabled={saving}
                className="flex-1 h-12 rounded-2xl bg-brand-red hover:bg-brand-red2 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/20">
                {saving ? "Enregistrement..." : modal === "create" ? "Créer le Client" : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
