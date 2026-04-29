"use client";

import { useState } from "react";
import {
  Plus, Pencil, Trash2, X,
  Cog, ArrowLeftRight, Grip, Lock, Lightbulb, Wrench, ChefHat, Shirt,
  Home, DoorOpen, Armchair, Hammer, Package, FolderOpen, Tag, Layers,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, LucideIcon> = {
  Cog, ArrowLeftRight, Grip, Lock, Lightbulb, Wrench, ChefHat, Shirt,
  Home, DoorOpen, Armchair, Hammer, Package, FolderOpen, Tag, Layers,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const DEMO_CATS = [
  { id:"c1", slug:"charnieres", nameFr:"Charnières", nameEn:"Hinges", nameAr:"المفصلات", icon:"Cog", image:"", order:1, showInMenu:false, _count:{ products: 3 } },
  { id:"c2", slug:"glissieres", nameFr:"Glissières", nameEn:"Drawer Slides", nameAr:"الأدراج", icon:"ArrowLeftRight", image:"", order:2, showInMenu:false, _count:{ products: 3 } },
  { id:"c3", slug:"poignees", nameFr:"Poignées", nameEn:"Handles", nameAr:"المقابض", icon:"Grip", image:"", order:3, showInMenu:false, _count:{ products: 3 } },
];

const EMPTY = { nameFr:"", nameEn:"", nameAr:"", slug:"", icon:"Package", image:"", order:"", showInMenu: false };

interface CatClientProps { initialCategories: any[] }

function CatIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = name ? (ICON_MAP[name] ?? FolderOpen) : FolderOpen;
  return <Icon className={className ?? "w-5 h-5"} />;
}

export function CategoriesClient({ initialCategories }: CatClientProps) {
  const [cats, setCats] = useState(initialCategories.length ? initialCategories : DEMO_CATS);
  const [modal, setModal] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => { setEditCat(null); setForm({ ...EMPTY }); setModal(true); };
  const openEdit = (c: any) => {
    setEditCat(c);
    setForm({ nameFr: c.nameFr, nameEn: c.nameEn || "", nameAr: c.nameAr || "", slug: c.slug, icon: c.icon || "Package", image: c.image || "", order: String(c.order || ""), showInMenu: c.showInMenu ?? false });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.nameFr || !form.slug) { showToast("Nom et slug requis"); return; }
    setSaving(true);
    try {
      const payload = { ...form, order: form.order ? parseInt(form.order) : 0, showInMenu: form.showInMenu, ...(editCat ? { id: editCat.id } : {}) };
      const res = await fetch("/api/admin/categories", {
        method: editCat ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (editCat) {
          setCats(cs => cs.map(c => c.id === editCat.id ? { ...c, ...data.category } : c));
        } else {
          setCats(cs => [...cs, { ...data.category, _count: { products: 0 } }]);
        }
        showToast(editCat ? "Catégorie mise à jour ✓" : "Catégorie créée ✓");
        setModal(false);
      } else {
        if (editCat) setCats(cs => cs.map(c => c.id === editCat.id ? { ...c, ...payload } : c));
        else setCats(cs => [...cs, { ...payload, id: `c${Date.now()}`, _count: { products: 0 } }]);
        showToast(editCat ? "Catégorie mise à jour ✓" : "Catégorie créée ✓");
        setModal(false);
      }
    } catch { showToast("Erreur"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    await fetch("/api/admin/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setCats(cs => cs.filter(c => c.id !== id));
    showToast("Catégorie supprimée");
  };

  const autoSlug = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-5 right-5 z-[100] bg-brand-black text-white text-sm px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">{toast}</div>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-brand-black">{cats.length} catégories</p>
          <p className="text-sm text-neutral-500">{cats.reduce((s, c) => s + (c._count?.products || 0), 0)} produits au total</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-red hover:bg-brand-red/90 text-white"><Plus className="w-4 h-4 mr-2" /> Nouvelle catégorie</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cats.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-brand-red/40 hover:shadow-lg transition-all group flex flex-col">
            {/* Image / Icon banner */}
            <div className="relative h-36 bg-gradient-to-br from-neutral-100 to-neutral-200 shrink-0 overflow-hidden">
              {c.image ? (
                <img src={c.image} alt={c.nameFr} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CatIcon name={c.icon} className="w-14 h-14 text-neutral-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <CatIcon name={c.icon} className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-xs font-bold drop-shadow">{c._count?.products || 0} produits</span>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-neutral-600 shadow-sm transition-all">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="w-7 h-7 rounded-lg bg-white/90 hover:bg-rose-50 flex items-center justify-center text-neutral-400 hover:text-rose-600 shadow-sm transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {c.showInMenu && (
                <div className="absolute top-2 left-2">
                  <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MENU</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-1 flex-1">
              <p className="font-bold text-brand-black leading-tight">{c.nameFr}</p>
              <p className="text-xs text-neutral-400">{c.nameEn || "—"}</p>
              <div className="mt-auto pt-3">
                <span className="font-mono text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded-lg">{c.slug}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button onClick={openCreate}
          className="bg-white rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:border-brand-red hover:text-brand-red transition-all min-h-[220px]"
        >
          <Plus className="w-8 h-8" />
          <span className="text-sm font-semibold">Ajouter une catégorie</span>
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-neutral-900 text-white px-8 py-7 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">{editCat ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
                <p className="text-neutral-400 text-sm font-medium mt-0.5">{editCat ? editCat.nameFr : "Ajouter une catégorie"}</p>
              </div>
              <button onClick={() => setModal(false)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shrink-0"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-8 py-6 space-y-4">

              {/* Icon picker */}
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-2">Icône</p>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(name => {
                    const Icon = ICON_MAP[name];
                    return (
                      <button key={name} onClick={() => set("icon", name)} title={name}
                        className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          form.icon === name ? "bg-brand-red/10 border-2 border-brand-red text-brand-red" : "bg-neutral-100 border-2 border-transparent hover:bg-neutral-200 text-neutral-600"
                        )}
                      ><Icon className="w-5 h-5" /></button>
                    );
                  })}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Image URL</p>
                {form.image && (
                  <div className="w-full h-28 rounded-xl overflow-hidden mb-2 bg-neutral-100">
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://..."
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Nom français *</p>
                <input value={form.nameFr} onChange={e => { set("nameFr", e.target.value); if (!editCat) set("slug", autoSlug(e.target.value)); }}
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">English</p>
                  <input value={form.nameEn} onChange={e => set("nameEn", e.target.value)}
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">العربية</p>
                  <input value={form.nameAr} onChange={e => set("nameAr", e.target.value)} dir="rtl"
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red text-right" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Slug *</p>
                  <input value={form.slug} onChange={e => set("slug", e.target.value)}
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm font-mono focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Ordre d'affichage</p>
                  <input value={form.order} onChange={e => set("order", e.target.value)} type="number" min="0"
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                </div>
              </div>

              {/* Show in mega menu toggle */}
              <label className="flex items-center gap-3 cursor-pointer py-2 border border-neutral-200 rounded-xl px-3 bg-neutral-50">
                <div
                  onClick={() => set("showInMenu", !form.showInMenu)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors shrink-0",
                    form.showInMenu ? "bg-brand-red" : "bg-neutral-300"
                  )}
                >
                  <span className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                    form.showInMenu ? "translate-x-5" : "translate-x-0"
                  )} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Afficher dans le méga-menu</p>
                  <p className="text-xs text-neutral-400">Visible dans la barre de navigation principale</p>
                </div>
              </label>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white">
                  {saving ? "Sauvegarde…" : editCat ? "Enregistrer" : "Créer"}
                </Button>
                <Button variant="outline" onClick={() => setModal(false)}>Annuler</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}