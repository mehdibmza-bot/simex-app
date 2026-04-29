"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  Package, Star, Zap, Leaf, ToggleLeft, ToggleRight, X, Upload,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Demo catalog as fallback
function mkProduct(i: number): any {
  const cats = [
    { id: "c1", slug: "charnieres", nameFr: "Charnières" },
    { id: "c2", slug: "glissieres", nameFr: "Glissières" },
    { id: "c3", slug: "poignees", nameFr: "Poignées" },
    { id: "c4", slug: "led", nameFr: "Éclairage LED" },
    { id: "c5", slug: "vis", nameFr: "Vis & Fixations" },
  ];
  const cat = cats[i % cats.length];
  return {
    id: `p${i}`, slug: `produit-${i}`, sku: `SKU-${String(i + 1).padStart(4, "0")}`,
    nameFr: `Produit ${i + 1} - ${cat.nameFr}`,
    nameEn: `Product ${i + 1}`, nameAr: `منتج ${i + 1}`,
    descFr: "Description complète du produit en français.",
    descEn: "Full product description in English.",
    descAr: "وصف المنتج بالعربية.",
    price: (9.9 + i * 7.5).toFixed(3),
    comparePrice: i % 4 === 0 ? ((9.9 + i * 7.5) * 1.2).toFixed(3) : null,
    stock: i % 6 === 0 ? 0 : 3 + (i * 7) % 100,
    brand: ["Blum","Grass","Hettich","Hafele","Simex"][i % 5],
    status: i % 10 === 9 ? "archived" : "active",
    isNew: i % 7 === 0, isHot: i % 5 === 0, isEco: i % 8 === 0,
    rating: (3 + (i % 20) / 10).toFixed(1),
    reviewCount: (i * 3) % 200,
    category: cat,
    images: [{ id: `img-${i}`, url: `https://images.unsplash.com/photo-1590321820422-200a2eefa4a9?w=200&h=200&fit=crop`, order: 0 }],
    createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  };
}
const DEMO_PRODUCTS = Array.from({ length: 60 }, (_, i) => mkProduct(i));
const DEMO_CATS = [
  { id: "c1", slug: "charnieres", nameFr: "Charnières" },
  { id: "c2", slug: "glissieres", nameFr: "Glissières" },
  { id: "c3", slug: "poignees", nameFr: "Poignées" },
  { id: "c4", slug: "led", nameFr: "Éclairage LED" },
  { id: "c5", slug: "vis", nameFr: "Vis & Fixations" },
  { id: "c6", slug: "cuisine", nameFr: "Cuisine" },
  { id: "c7", slug: "dressing", nameFr: "Dressing" },
];

const EMPTY_FORM = {
  nameFr: "", nameEn: "", nameAr: "",
  descFr: "", descEn: "", descAr: "",
  sku: "", brand: "", categoryId: "",
  price: "", comparePrice: "",
  stock: "0", status: "active",
  isNew: false, isHot: false, isEco: false,
  images: [] as string[],
};

interface ProductsClientProps {
  initialProducts: any[];
  initialTotal: number;
  categories: any[];
}

export function ProductsClient({ initialProducts, initialTotal, categories: initCats }: ProductsClientProps) {
  const products = initialProducts.length ? initialProducts : DEMO_PRODUCTS;
  const categories = initCats.length ? initCats : DEMO_CATS;

  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [descTab, setDescTab] = useState<"fr" | "en" | "ar">("fr");
  const [newImageUrl, setNewImageUrl] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = products.filter(p => {
    const matchQ = !q || p.nameFr.toLowerCase().includes(q.toLowerCase()) || p.sku.includes(q);
    const matchC = catFilter === "ALL" || p.category?.slug === catFilter;
    const matchS = statusFilter === "ALL" || p.status === statusFilter;
    return matchQ && matchC && matchS;
  });

  const pageSize = 15;
  const pages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({
      nameFr: p.nameFr, nameEn: p.nameEn || "", nameAr: p.nameAr || "",
      descFr: p.descFr || "", descEn: p.descEn || "", descAr: p.descAr || "",
      sku: p.sku, brand: p.brand || "", categoryId: p.category?.id || p.categoryId || "",
      price: String(p.price), comparePrice: p.comparePrice ? String(p.comparePrice) : "",
      stock: String(p.stock), status: p.status,
      isNew: p.isNew, isHot: p.isHot, isEco: p.isEco,
      images: p.images?.map((img: any) => img.url) || [],
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nameFr || !form.sku || !form.price) { showToast("Nom, SKU et prix requis"); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock),
        ...(editProduct ? { id: editProduct.id } : {}),
      };
      await fetch("/api/admin/products", {
        method: editProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showToast(editProduct ? "Produit mis à jour ✓" : "Produit créé ✓");
      setModalOpen(false);
    } catch { showToast("Erreur de sauvegarde"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Archiver ce produit ?")) return;
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    showToast("Produit archivé");
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, newImageUrl.trim()] }));
    setNewImageUrl("");
  };

  const removeImage = (idx: number) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const activeCount = products.filter(p => p.status === "active").length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const promoCount = products.filter(p => p.comparePrice).length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-[100] bg-brand-black text-white text-sm px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">{toast}</div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total produits", value: products.length, color: "text-brand-black" },
          { label: "Actifs", value: activeCount, color: "text-emerald-600" },
          { label: "Rupture de stock", value: outOfStock, color: "text-rose-600" },
          { label: "En promotion", value: promoCount, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">{k.label}</p>
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom ou SKU…"
            className="w-full h-10 rounded-xl bg-neutral-50 border border-neutral-200 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-red"
          />
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl bg-neutral-50 border border-neutral-200 px-3 text-sm focus:outline-none focus:border-brand-red"
        >
          <option value="ALL">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.nameFr}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl bg-neutral-50 border border-neutral-200 px-3 text-sm focus:outline-none focus:border-brand-red"
        >
          <option value="ALL">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="archived">Archivé</option>
        </select>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Ajouter
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left px-5 py-3.5 font-semibold text-neutral-600 text-xs w-12">Image</th>
                <th className="text-left px-5 py-3.5 font-semibold text-neutral-600 text-xs">Produit</th>
                <th className="text-left px-5 py-3.5 font-semibold text-neutral-600 text-xs hidden md:table-cell">Catégorie</th>
                <th className="text-left px-5 py-3.5 font-semibold text-neutral-600 text-xs hidden lg:table-cell">Stock</th>
                <th className="text-left px-5 py-3.5 font-semibold text-neutral-600 text-xs">Prix</th>
                <th className="text-left px-5 py-3.5 font-semibold text-neutral-600 text-xs hidden sm:table-cell">Statut</th>
                <th className="px-5 py-3.5 text-xs" />
              </tr>
            </thead>
            <tbody>
              {paged.map(p => (
                <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} alt={p.nameFr} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300"><Package className="w-5 h-5" /></div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-brand-black text-sm truncate max-w-[200px]">{p.nameFr}</p>
                    <p className="text-xs text-neutral-400 font-mono">{p.sku}</p>
                    <div className="flex gap-1 mt-1">
                      {p.isNew && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">NEW</span>}
                      {p.isHot && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-semibold">HOT</span>}
                      {p.isEco && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">ECO</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-lg">{p.category?.nameFr}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className={cn("font-semibold text-sm", p.stock === 0 ? "text-rose-600" : p.stock < 10 ? "text-amber-600" : "text-emerald-600")}>
                      {p.stock === 0 ? "Rupture" : `${p.stock} unités`}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-bold text-brand-black">{formatPrice(Number(p.price))}</p>
                    {p.comparePrice && <p className="text-xs text-neutral-400 line-through">{formatPrice(Number(p.comparePrice))}</p>}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={cn("text-[11px] px-2 py-1 rounded-full font-semibold border",
                      p.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-neutral-100 text-neutral-500 border-neutral-200"
                    )}>
                      {p.status === "active" ? "Actif" : "Archivé"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-brand-black transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-neutral-400 text-sm">Aucun produit trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100">
            <p className="text-xs text-neutral-500">{filtered.length} produits</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-neutral-200 disabled:opacity-40 hover:border-brand-red"
              ><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs text-neutral-600 px-2">{page} / {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-neutral-200 disabled:opacity-40 hover:border-brand-red"
              ><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-neutral-900 text-white px-8 py-7 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">{editProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
                <p className="text-neutral-400 text-sm font-medium mt-0.5">{editProduct ? editProduct.nameFr : "Créer un nouveau produit"}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shrink-0"><X className="w-5 h-5" /></button>
            </div>
          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
            {/* Names */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">Noms (FR / EN / AR)</p>
              <div className="space-y-2">
                <input value={form.nameFr} onChange={e => set("nameFr", e.target.value)} placeholder="Nom en français *"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                <input value={form.nameEn} onChange={e => set("nameEn", e.target.value)} placeholder="Name in English"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                <input value={form.nameAr} onChange={e => set("nameAr", e.target.value)} placeholder="الاسم بالعربية" dir="rtl"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red text-right" />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-semibold text-neutral-500">Description</p>
                <div className="flex gap-1">
                  {(["fr","en","ar"] as const).map(lang => (
                    <button key={lang} onClick={() => setDescTab(lang)}
                      className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                        descTab === lang ? "bg-brand-red text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      )}
                    >{lang.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              {descTab === "fr" && <textarea value={form.descFr} onChange={e => set("descFr", e.target.value)} rows={3} placeholder="Description en français" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none" />}
              {descTab === "en" && <textarea value={form.descEn} onChange={e => set("descEn", e.target.value)} rows={3} placeholder="Description in English" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none" />}
              {descTab === "ar" && <textarea value={form.descAr} onChange={e => set("descAr", e.target.value)} rows={3} placeholder="الوصف بالعربية" dir="rtl" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none text-right" />}
            </div>

            {/* SKU + Brand + Category */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">SKU *</p>
                <input value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="CHN-001"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm font-mono focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Marque</p>
                <input value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="Blum, Grass…"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Catégorie</p>
                <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
                >
                  <option value="">Choisir…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nameFr}</option>)}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Prix (TND) *</p>
                <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="0.000" type="number" min="0" step="0.001"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Prix barré</p>
                <input value={form.comparePrice} onChange={e => set("comparePrice", e.target.value)} placeholder="0.000" type="number" min="0" step="0.001"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Stock</p>
                <input value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="0" type="number" min="0"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
            </div>

            {/* Badges + Status */}
            <div className="flex flex-wrap gap-3 items-center">
              <p className="text-xs font-semibold text-neutral-500 w-full">Badges & statut</p>
              {[
                { key: "isNew", label: "NEW", color: "bg-blue-100 text-blue-700" },
                { key: "isHot", label: "HOT", color: "bg-rose-100 text-rose-700" },
                { key: "isEco", label: "ECO", color: "bg-emerald-100 text-emerald-700" },
              ].map(b => (
                <button key={b.key} onClick={() => set(b.key, !(form as any)[b.key])}
                  className={cn("flex items-center gap-2 px-3 h-9 rounded-xl border text-xs font-semibold transition-all",
                    (form as any)[b.key] ? `${b.color} border-transparent` : "bg-white border-neutral-200 text-neutral-500"
                  )}
                >
                  {(form as any)[b.key] ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {b.label}
                </button>
              ))}
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="h-9 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
              >
                <option value="active">Actif</option>
                <option value="archived">Archivé</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>

            {/* Images */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">Images (URLs)</p>
              <div className="flex gap-2 mb-2">
                <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                  className="flex-1 h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
                  onKeyDown={e => e.key === "Enter" && addImage()}
                />
                <button onClick={addImage} className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center hover:bg-brand-red2 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? "Sauvegarde…" : editProduct ? "Enregistrer les modifications" : "Créer le produit"}
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
