"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderOpen, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ICONS = ["🔩","📦","🚪","💡","🔧","🍽️","👗","🛁","⚙️","🪟","🏠","🛠️","✨","🪞","🔑"];

const DEMO_CATS = [
  { id:"c1", slug:"charnieres", nameFr:"Charnières", nameEn:"Hinges", nameAr:"المفصلات", icon:"🔩", order:1, _count:{ products: 142 } },
  { id:"c2", slug:"glissieres", nameFr:"Glissières", nameEn:"Drawer Slides", nameAr:"الأدراج", icon:"📦", order:2, _count:{ products: 87 } },
  { id:"c3", slug:"poignees", nameFr:"Poignées", nameEn:"Handles", nameAr:"المقابض", icon:"🚪", order:3, _count:{ products: 95 } },
  { id:"c4", slug:"led", nameFr:"Éclairage LED", nameEn:"LED Lighting", nameAr:"إضاءة", icon:"💡", order:4, _count:{ products: 54 } },
  { id:"c5", slug:"vis", nameFr:"Vis & Fixations", nameEn:"Screws & Fixings", nameAr:"البراغي", icon:"🔧", order:5, _count:{ products: 210 } },
  { id:"c6", slug:"cuisine", nameFr:"Cuisine", nameEn:"Kitchen", nameAr:"المطبخ", icon:"🍽️", order:6, _count:{ products: 67 } },
  { id:"c7", slug:"dressing", nameFr:"Dressing", nameEn:"Wardrobe", nameAr:"خزانة", icon:"👗", order:7, _count:{ products: 38 } },
  { id:"c8", slug:"salle-bain", nameFr:"Salle de bain", nameEn:"Bathroom", nameAr:"الحمام", icon:"🛁", order:8, _count:{ products: 29 } },
];

const EMPTY = { nameFr:"", nameEn:"", nameAr:"", slug:"", icon:"🔩", order:"" };

interface CatClientProps { initialCategories: any[] }

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
    setForm({ nameFr: c.nameFr, nameEn: c.nameEn || "", nameAr: c.nameAr || "", slug: c.slug, icon: c.icon || "🔩", order: String(c.order || "") });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.nameFr || !form.slug) { showToast("Nom et slug requis"); return; }
    setSaving(true);
    try {
      const payload = { ...form, order: form.order ? parseInt(form.order) : 0, ...(editCat ? { id: editCat.id } : {}) };
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
        // Demo mode — optimistic update
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
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nouvelle catégorie</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cats.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-brand-red/30 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-3xl border border-neutral-100">
                {c.icon || "📦"}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-brand-black transition-all"
                ><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(c.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                ><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="font-bold text-brand-black mb-0.5">{c.nameFr}</p>
            <p className="text-xs text-neutral-400 mb-3">{c.nameEn || "—"}</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded-lg">{c.slug}</span>
              <span className="text-xs text-neutral-500 font-semibold">{c._count?.products || 0} produits</span>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button onClick={openCreate}
          className="bg-white rounded-2xl border-2 border-dashed border-neutral-200 p-5 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:border-brand-red hover:text-brand-red transition-all min-h-[160px]"
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
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => set("icon", ic)}
                    className={cn("w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all",
                      form.icon === ic ? "bg-brand-red/10 border-2 border-brand-red" : "bg-neutral-100 border-2 border-transparent hover:bg-neutral-200"
                    )}
                  >{ic}</button>
                ))}
              </div>
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

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
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
