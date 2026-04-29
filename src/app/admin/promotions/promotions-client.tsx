"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Copy, ToggleLeft, ToggleRight, Zap, Tag, Gift, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TYPE_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  flash:     { label: "Flash Sale", icon: Zap, color: "bg-amber-100 text-amber-700" },
  happy_hour:{ label: "Happy Hour", icon: Zap, color: "bg-purple-100 text-purple-700" },
  bundle:    { label: "Bundle", icon: Gift, color: "bg-blue-100 text-blue-700" },
  tier:      { label: "Tier Pro", icon: Tag, color: "bg-rose-100 text-rose-700" },
  coupon:    { label: "Code promo", icon: Tag, color: "bg-emerald-100 text-emerald-700" },
};

function mkPromo(i: number): any {
  const types = Object.keys(TYPE_MAP);
  const type = types[i % types.length];
  const now = new Date();
  const start = new Date(now); start.setDate(start.getDate() - i);
  const end = new Date(now); end.setDate(end.getDate() + (10 - i * 2));
  return {
    id: `pr${i}`,
    code: `${["SOLDES","FLASH","VIP","SIMEX","PROMO"][i % 5]}${10 + i}`,
    type,
    value: [5, 10, 15, 20, 25, 30][i % 6],
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    isActive: i % 3 !== 2,
    description: `Promotion ${i + 1} — offre spéciale`,
    usageCount: (i * 7) % 150,
    usageLimit: i % 2 === 0 ? 100 : null,
  };
}
const DEMO_PROMOS = Array.from({ length: 12 }, (_, i) => mkPromo(i));

const EMPTY = { code: "", type: "coupon", value: "10", description: "", startsAt: "", endsAt: "", isActive: true, usageLimit: "" };

interface PromosClientProps { initialPromos: any[] }

export function PromotionsClient({ initialPromos }: PromosClientProps) {
  const [promos, setPromos] = useState(initialPromos.length ? initialPromos : DEMO_PROMOS);
  const [modal, setModal] = useState(false);
  const [editPromo, setEditPromo] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => { setEditPromo(null); setForm({ ...EMPTY, startsAt: new Date().toISOString().slice(0,16), endsAt: "" }); setModal(true); };
  const openEdit = (p: any) => {
    setEditPromo(p);
    setForm({ code: p.code, type: p.type, value: String(p.value), description: p.description || "", startsAt: p.startsAt?.slice(0,16), endsAt: p.endsAt?.slice(0,16), isActive: p.isActive, usageLimit: p.usageLimit ? String(p.usageLimit) : "" });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.value) { showToast("Code et valeur requis"); return; }
    setSaving(true);
    const payload = { ...form, value: parseFloat(form.value), usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null, ...(editPromo ? { id: editPromo.id } : {}) };
    try {
      const res = await fetch("/api/admin/promotions", {
        method: editPromo ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (editPromo) setPromos(ps => ps.map(p => p.id === editPromo.id ? { ...p, ...payload } : p));
      else setPromos(ps => [...ps, { ...payload, id: `pr${Date.now()}`, usageCount: 0 }]);
      showToast(editPromo ? "Promotion mise à jour ✓" : "Promotion créée ✓");
      setModal(false);
    } catch { showToast("Erreur"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return;
    await fetch("/api/admin/promotions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setPromos(ps => ps.filter(p => p.id !== id));
    showToast("Promotion supprimée");
  };

  const toggleActive = async (p: any) => {
    await fetch("/api/admin/promotions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, isActive: !p.isActive }) });
    setPromos(ps => ps.map(x => x.id === p.id ? { ...x, isActive: !x.isActive } : x));
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); showToast(`Code "${code}" copié`); };

  const active = promos.filter(p => p.isActive).length;
  const expired = promos.filter(p => new Date(p.endsAt) < new Date()).length;

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-5 right-5 z-[100] bg-brand-black text-white text-sm px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">{toast}</div>}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total promotions", value: promos.length, color: "text-brand-black" },
          { label: "Actives", value: active, color: "text-emerald-600" },
          { label: "Expirées", value: expired, color: "text-rose-600" },
          { label: "Utilisations totales", value: promos.reduce((s,p) => s + (p.usageCount||0), 0), color: "text-neutral-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">{k.label}</p>
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-end">
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nouvelle promotion</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map(p => {
          const T = TYPE_MAP[p.type] || TYPE_MAP.coupon;
          const TIcon = T.icon;
          const isExpired = new Date(p.endsAt) < new Date();
          const timeLeft = Math.max(0, Math.ceil((new Date(p.endsAt).getTime() - Date.now()) / 86400000));

          return (
            <div key={p.id} className={cn("bg-white rounded-2xl border p-5 transition-all hover:shadow-md", p.isActive && !isExpired ? "border-neutral-200" : "border-neutral-100 opacity-60")}>
              <div className="flex items-start justify-between mb-3">
                <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold", T.color)}>
                  <TIcon className="w-3 h-3" />{T.label}
                </span>
                <button onClick={() => toggleActive(p)}
                  className={cn("transition-colors", p.isActive ? "text-emerald-500" : "text-neutral-300")}
                >
                  {p.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-neutral-50 rounded-xl px-3 py-2 font-mono font-bold text-brand-black tracking-widest text-lg">
                  {p.code}
                </div>
                <button onClick={() => copyCode(p.code)} className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all">
                  <Copy className="w-4 h-4 text-neutral-500" />
                </button>
              </div>

              <p className="text-2xl font-black text-brand-red mb-1">-{p.value}%</p>
              {p.description && <p className="text-xs text-neutral-500 mb-3">{p.description}</p>}

              <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                <span>{new Date(p.startsAt).toLocaleDateString("fr-FR")} → {new Date(p.endsAt).toLocaleDateString("fr-FR")}</span>
                {isExpired ? (
                  <span className="text-rose-500 font-semibold">Expiré</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">{timeLeft}j restants</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">{p.usageCount || 0}{p.usageLimit ? `/${p.usageLimit}` : ""} utilisations</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-brand-black transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add card */}
        <button onClick={openCreate}
          className="bg-white rounded-2xl border-2 border-dashed border-neutral-200 p-5 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:border-brand-red hover:text-brand-red transition-all min-h-[220px]"
        >
          <Plus className="w-8 h-8" />
          <span className="text-sm font-semibold">Nouvelle promotion</span>
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-neutral-900 text-white px-8 py-7 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">{editPromo ? "Modifier la promotion" : "Nouvelle promotion"}</h2>
                <p className="text-neutral-400 text-sm font-medium mt-0.5">{editPromo ? `Code : ${editPromo.code}` : "Créer un code promotionnel"}</p>
              </div>
              <button onClick={() => setModal(false)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shrink-0"><X className="w-5 h-5" /></button>
            </div>
          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">Type</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TYPE_MAP).map(([k, v]) => {
                  const VIcon = v.icon;
                  return (
                    <button key={k} onClick={() => set("type", k)}
                      className={cn("flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-semibold border transition-all",
                        form.type === k ? "bg-brand-red text-white border-brand-red" : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-red"
                      )}
                    ><VIcon className="w-3.5 h-3.5" />{v.label}</button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Code *</p>
                <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} placeholder="SIMEX10"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Remise (%) *</p>
                <input value={form.value} onChange={e => set("value", e.target.value)} type="number" min="1" max="100" placeholder="10"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-1.5">Description</p>
              <input value={form.description} onChange={e => set("description", e.target.value)} placeholder="Description courte…"
                className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Début</p>
                <input value={form.startsAt} onChange={e => set("startsAt", e.target.value)} type="datetime-local"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Fin</p>
                <input value={form.endsAt} onChange={e => set("endsAt", e.target.value)} type="datetime-local"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Limite d'utilisation</p>
                <input value={form.usageLimit} onChange={e => set("usageLimit", e.target.value)} type="number" min="0" placeholder="Illimité"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div className="flex items-end pb-0.5">
                <button onClick={() => set("isActive", !form.isActive)}
                  className={cn("flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-semibold transition-all w-full justify-center",
                    form.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-neutral-500 border-neutral-200"
                  )}
                >
                  {form.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {form.isActive ? "Actif" : "Inactif"}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">{saving ? "…" : editPromo ? "Enregistrer" : "Créer"}</Button>
              <Button variant="outline" onClick={() => setModal(false)}>Annuler</Button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
