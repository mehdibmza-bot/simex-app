"use client";

import { useState, useEffect } from "react";
import {
  Users, Plus, Trash2, Pencil, ShieldCheck, Eye, Check, X,
  Search, Key, Phone, Mail, Crown, UserCog, Headphones, RefreshCw,
  Truck, Lock, Unlock, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ROLE_CONFIG: Record<string, {
  label: string; desc: string; color: string; badge: string; icon: React.ElementType; accent: string;
}> = {
  SUPER_ADMIN:    { label: "Super Admin",     desc: "Accès total, irréversible",            color: "bg-red-50 text-red-700 border-red-200",        badge: "bg-red-600 text-white",       icon: Crown,       accent: "#dc2626" },
  ADMIN:          { label: "Administrateur",  desc: "Toutes les sections admin",            color: "bg-orange-50 text-orange-700 border-orange-200", badge: "bg-orange-500 text-white",  icon: ShieldCheck, accent: "#f97316" },
  MANAGER:        { label: "Manager",         desc: "Commandes, produits, clients",         color: "bg-blue-50 text-blue-700 border-blue-200",     badge: "bg-blue-600 text-white",      icon: UserCog,     accent: "#2563eb" },
  SUPPORT:        { label: "Support",         desc: "Commandes & clients uniquement",       color: "bg-violet-50 text-violet-700 border-violet-200", badge: "bg-violet-600 text-white", icon: Headphones,  accent: "#7c3aed" },
  DELIVERY_AGENT: { label: "Agent Livraison", desc: "Suivi & livraison des commandes",      color: "bg-amber-50 text-amber-700 border-amber-200",  badge: "bg-amber-500 text-white",     icon: Truck,       accent: "#d97706" },
  VIEWER:         { label: "Lecteur",         desc: "Consultation seule (aucune édition)", color: "bg-neutral-100 text-neutral-600 border-neutral-200", badge: "bg-neutral-500 text-white", icon: Eye, accent: "#6b7280" },
};

const ALL_SECTIONS = [
  "Tableau de bord", "Commandes", "Produits", "Catégories",
  "Clients", "Promotions", "Analytiques", "Livraison",
  "Comptes Admin", "Configurateur", "Paramètres",
];

const PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN:    [...ALL_SECTIONS],
  ADMIN:          ["Tableau de bord", "Commandes", "Produits", "Catégories", "Clients", "Promotions", "Analytiques", "Livraison", "Configurateur", "Paramètres"],
  MANAGER:        ["Tableau de bord", "Commandes", "Produits", "Catégories", "Clients", "Promotions", "Analytiques", "Livraison"],
  SUPPORT:        ["Tableau de bord", "Commandes", "Clients"],
  DELIVERY_AGENT: ["Tableau de bord", "Commandes", "Livraison"],
  VIEWER:         ["Tableau de bord"],
};

function pwStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Faible",  color: "bg-red-500" };
  if (score <= 3) return { level: 2, label: "Moyen",   color: "bg-amber-500" };
  return              { level: 3, label: "Fort",    color: "bg-emerald-500" };
}

type Account = {
  id: string; email: string; name: string; phone?: string; role: string;
  createdAt: string; updatedAt: string;
};

const EMPTY_FORM = { name: "", email: "", phone: "", role: "MANAGER", password: "", confirmPassword: "" };

export function AccountsClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [modal, setModal] = useState<"create" | "edit" | "delete" | "perms" | null>(null);
  const [selected, setSelected] = useState<Account | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accounts");
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch { showToast("Erreur de chargement", "err"); }
    setLoading(false);
  };

  useEffect(() => { fetchAccounts(); }, []);

  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(q.toLowerCase()) ||
    a.email.toLowerCase().includes(q.toLowerCase()) ||
    a.role.toLowerCase().includes(q.toLowerCase())
  );

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setSelected(null); setModal("create"); };
  const openEdit = (a: Account) => {
    setForm({ name: a.name, email: a.email, phone: a.phone || "", role: a.role, password: "", confirmPassword: "" });
    setSelected(a); setModal("edit");
  };

  const handleSubmitCreate = async () => {
    if (!form.name || !form.email || !form.role || !form.password) return showToast("Remplissez tous les champs requis", "err");
    if (form.password.length < 8) return showToast("Le mot de passe doit contenir au moins 8 caractères", "err");
    if (form.password !== form.confirmPassword) return showToast("Les mots de passe ne correspondent pas", "err");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, role: form.role, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || "Erreur", "err");
      setAccounts(prev => [data.account, ...prev]);
      setModal(null);
      showToast(`Compte créé · ${form.name}`);
    } catch { showToast("Erreur réseau", "err"); }
    setSaving(false);
  };

  const handleSubmitEdit = async () => {
    if (!selected) return;
    if (form.password && form.password !== form.confirmPassword) return showToast("Les mots de passe ne correspondent pas", "err");
    setSaving(true);
    try {
      const body: any = { id: selected.id, name: form.name, phone: form.phone, role: form.role };
      if (form.password) body.password = form.password;
      const res = await fetch("/api/admin/accounts", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || "Erreur", "err");
      setAccounts(prev => prev.map(a => a.id === selected.id ? data.account : a));
      setModal(null);
      showToast("Compte mis à jour");
    } catch { showToast("Erreur réseau", "err"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/accounts?id=${selected.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || "Erreur", "err");
      setAccounts(prev => prev.filter(a => a.id !== selected.id));
      setModal(null);
      showToast("Compte supprimé");
    } catch { showToast("Erreur réseau", "err"); }
    setSaving(false);
  };

  const strength = pwStrength(form.password);

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-neutral-50/50">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-8 right-8 z-[200] text-white text-sm px-6 py-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-right-8 duration-300 flex items-center gap-3",
          toast.type === "ok" ? "bg-neutral-900 border-white/5" : "bg-red-600 border-red-500"
        )}>
          {toast.type === "ok" ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight uppercase">Comptes Admin</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {accounts.length} COMPTE{accounts.length !== 1 ? "S" : ""} ACTIF{accounts.length !== 1 ? "S" : ""}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchAccounts} className="h-11 px-5 rounded-xl border-neutral-200 gap-2 font-bold text-xs uppercase tracking-wider">
            <RefreshCw className="w-4 h-4" /> Actualiser
          </Button>
          <Button onClick={openCreate} className="h-11 px-6 rounded-xl bg-brand-red hover:bg-brand-red2 text-white shadow-lg shadow-brand-red/20 gap-2 font-bold text-xs uppercase tracking-wider">
            <Plus className="w-4 h-4" /> Nouveau Compte
          </Button>
        </div>
      </div>

      {/* Role Legends */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
          const count = accounts.filter(a => a.role === role).length;
          return (
            <div key={role} className={cn("rounded-2xl border p-4 space-y-2", cfg.color)}>
              <div className="flex items-center gap-2">
                <cfg.icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{cfg.label}</span>
              </div>
              <p className="text-[10px] font-bold opacity-70 leading-tight">{cfg.desc}</p>
              <p className="text-[11px] font-black opacity-60 uppercase tracking-widest">
                {count} compte{count !== 1 ? "s" : ""}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-[2rem] border border-neutral-200/60 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Rechercher un compte par nom, email ou rôle..."
            className="w-full pl-14 pr-6 py-4 bg-neutral-50/50 border-none rounded-[1.5rem] text-sm text-neutral-900 focus:ring-2 focus:ring-neutral-100 transition-all outline-none placeholder:text-neutral-400 font-medium"
          />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-[2rem] bg-neutral-50 flex items-center justify-center animate-pulse">
                <Users className="w-8 h-8 text-neutral-200" />
              </div>
              <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Chargement des comptes...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest">Identité</th>
                  <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest hidden md:table-cell">Contact</th>
                  <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest">Rôle & Accès</th>
                  <th className="text-left px-8 py-5 font-black text-neutral-400 text-[10px] uppercase tracking-widest hidden lg:table-cell">Créé le</th>
                  <th className="px-8 py-5 text-right font-black text-neutral-400 text-[10px] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map(a => {
                  const RC = ROLE_CONFIG[a.role] || ROLE_CONFIG.VIEWER;
                  return (
                    <tr key={a.id} className="group hover:bg-neutral-50/80 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-white font-black text-sm shadow-md">
                            {a.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-neutral-900">{a.name}</p>
                            <p className="text-xs text-neutral-400 font-medium">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                            <Mail className="w-3.5 h-3.5 text-neutral-300" /> {a.email}
                          </span>
                          {a.phone && (
                            <span className="flex items-center gap-2 text-xs text-neutral-500">
                              <Phone className="w-3.5 h-3.5 text-neutral-300" /> {a.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <span className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border", RC.color)}>
                            <RC.icon className="w-3.5 h-3.5" /> {RC.label}
                          </span>
                          <button
                            onClick={() => { setSelected(a); setModal("perms"); }}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-brand-red transition-colors"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {PERMISSIONS[a.role]?.length || 0} section{(PERMISSIONS[a.role]?.length || 0) > 1 ? "s" : ""} accessibles
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden lg:table-cell">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-600">{new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span className="text-[11px] text-neutral-400">Dernière MAJ: {new Date(a.updatedAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(a)}
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-brand-black transition-all border border-transparent hover:border-neutral-100"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelected(a); setModal("delete"); }}
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-[2rem] bg-neutral-50 flex items-center justify-center">
                          <Users className="w-8 h-8 text-neutral-200" />
                        </div>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Aucun compte trouvé</p>
                        <Button onClick={openCreate} className="mt-2 bg-brand-red hover:bg-brand-red2 text-white text-xs font-bold uppercase tracking-wider h-11 px-6 rounded-xl gap-2">
                          <Plus className="w-4 h-4" /> Créer le premier compte
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

            {/* Dark header */}
            <div className="bg-neutral-900 text-white px-8 py-7 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {modal === "create" ? "Nouveau Compte" : "Modifier le Compte"}
                </h2>
                <p className="text-neutral-400 text-sm font-medium mt-0.5">
                  {modal === "create" ? "Accès sécurisé au tableau de bord" : `Modification de ${selected?.name}`}
                </p>
              </div>
              <button onClick={() => setModal(null)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-8 space-y-6">

              {/* Identity */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Identité</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Nom complet <span className="text-brand-red">*</span></label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Ahmed Ben Ali" autoComplete="off"
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                  </div>
                  {modal === "create" ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Email <span className="text-brand-red">*</span></label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ahmed@simex.tn" autoComplete="off"
                        className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Email</label>
                      <div className="h-12 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 flex items-center text-sm font-bold text-neutral-500">
                        {selected?.email}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Téléphone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+216 XX XXX XXX" autoComplete="off"
                    className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all" />
                </div>
              </div>

              {/* Role selector */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                  Rôle & Privilèges <span className="text-brand-red">*</span>
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
                    const isSelected = form.role === role;
                    return (
                      <label key={role} className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        isSelected ? "shadow-sm" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100/60"
                      )} style={isSelected ? { borderColor: cfg.accent, backgroundColor: `${cfg.accent}0d` } : {}}>
                        <input type="radio" name="role" value={role} checked={isSelected} onChange={() => setForm(f => ({ ...f, role }))} className="hidden" />
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border", cfg.color)}>
                          <cfg.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-neutral-900">{cfg.label}</p>
                          <p className="text-[11px] font-bold text-neutral-500 mt-0.5">{cfg.desc}</p>
                          <p className="text-[10px] font-semibold text-neutral-400 mt-1 truncate">
                            {PERMISSIONS[role]?.join(" · ")}
                          </p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                          style={isSelected ? { borderColor: cfg.accent, backgroundColor: cfg.accent } : { borderColor: "#e5e7eb" }}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Live privileges preview */}
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Accès accordés avec ce rôle</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SECTIONS.map(section => {
                      const allowed = PERMISSIONS[form.role]?.includes(section);
                      return (
                        <span key={section} className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border",
                          allowed ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-100 text-neutral-400 border-neutral-200 opacity-60"
                        )}>
                          {allowed ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          {section}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                  Sécurité
                  {modal === "edit" && <span className="ml-2 text-neutral-400 font-medium normal-case tracking-normal text-[10px]">— laisser vide pour conserver le mot de passe actuel</span>}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Mot de passe {modal === "create" && <span className="text-brand-red">*</span>}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                      <input
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="Min. 8 caractères"
                        autoComplete="new-password"
                        className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all"
                      />
                    </div>
                    {form.password && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= strength.level ? strength.color : "bg-neutral-200")} />
                          ))}
                        </div>
                        <p className={cn("text-[10px] font-black", strength.level === 1 ? "text-red-500" : strength.level === 2 ? "text-amber-500" : "text-emerald-500")}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Confirmer</label>
                    <input
                      type={showPw ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      placeholder="Répéter le mot de passe"
                      autoComplete="new-password"
                      className={cn(
                        "w-full h-12 rounded-2xl border bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all",
                        form.confirmPassword && form.confirmPassword !== form.password
                          ? "border-red-300 focus:ring-red-100"
                          : form.confirmPassword && form.confirmPassword === form.password
                          ? "border-emerald-300 focus:ring-emerald-100"
                          : "border-neutral-200 focus:ring-brand-red/10 focus:border-brand-red/30"
                      )}
                    />
                    {form.confirmPassword && form.confirmPassword !== form.password && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Mots de passe différents
                      </p>
                    )}
                    {form.confirmPassword && form.confirmPassword === form.password && (
                      <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Mots de passe identiques
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => setShowPw(v => !v)} className="text-[10px] font-bold text-neutral-400 hover:text-brand-red transition-colors flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  {showPw ? "Masquer" : "Afficher"} les mots de passe
                </button>
              </div>
            </div>

            {/* Sticky footer */}
            <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/60 flex gap-3 shrink-0">
              <Button variant="outline" onClick={() => setModal(null)} className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-wider">
                Annuler
              </Button>
              <Button
                onClick={modal === "create" ? handleSubmitCreate : handleSubmitEdit}
                disabled={saving}
                className="flex-1 h-12 rounded-2xl bg-brand-red hover:bg-brand-red2 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/20"
              >
                {saving ? "Enregistrement..." : modal === "create" ? "Créer le Compte" : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permissions Modal ── */}
      {modal === "perms" && selected && (() => {
        const RC = ROLE_CONFIG[selected.role] || ROLE_CONFIG.VIEWER;
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModal(null)} />
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="text-white px-8 py-7 flex items-center justify-between" style={{ background: `linear-gradient(135deg, #0a0a0a 0%, ${RC.accent}40 100%)` }}>
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border-2 shrink-0", RC.color)}>
                    <RC.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tight">{selected.name}</h2>
                    <p className="text-neutral-400 text-sm font-medium mt-0.5">{RC.label} · {PERMISSIONS[selected.role]?.length || 0} sections autorisées</p>
                  </div>
                </div>
                <button onClick={() => setModal(null)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-2">
                {ALL_SECTIONS.map(section => {
                  const allowed = PERMISSIONS[selected.role]?.includes(section);
                  return (
                    <div key={section} className={cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl border", allowed ? "bg-emerald-50/60 border-emerald-100" : "bg-neutral-50 border-neutral-100 opacity-40")}>
                      <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center shrink-0", allowed ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-400")}>
                        {allowed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </div>
                      <span className={cn("text-sm font-black uppercase tracking-tight flex-1", allowed ? "text-neutral-900" : "text-neutral-400")}>{section}</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg", allowed ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-400")}>
                        {allowed ? "AUTORISÉ" : "BLOQUÉ"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Delete Modal ── */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8 space-y-6">
            <div className="w-16 h-16 rounded-[2rem] bg-red-50 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">Supprimer ce compte?</h2>
              <p className="text-neutral-500 text-sm font-medium">
                Vous êtes sur le point de supprimer <strong className="text-neutral-900">{selected.name}</strong> ({selected.email}). Cette action est <strong className="text-red-600">irréversible</strong>.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setModal(null)} className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-wider">
                Annuler
              </Button>
              <Button onClick={handleDelete} disabled={saving} className="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider">
                {saving ? "Suppression..." : "Confirmer la suppression"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
