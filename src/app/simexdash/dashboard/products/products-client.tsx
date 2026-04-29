"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  Package, Star, Zap, Leaf, ToggleLeft, ToggleRight, X, Upload, Flame, Snowflake, Clock, Tag,
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
    { id: "c5", slug: "fixations", nameFr: "Vis & Fixations" },
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
    isNew: i % 7 === 0, isHot: i % 5 === 0, isEco: i % 8 === 0, isBlackFriday: i % 9 === 0,
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
  { id: "c5", slug: "fixations", nameFr: "Vis & Fixations" },
  { id: "c6", slug: "cuisine", nameFr: "Cuisine" },
  { id: "c7", slug: "dressing", nameFr: "Dressing" },
];

// Auto-generate slug from French name
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const EMPTY_FORM = {
  slug: "",
  nameFr: "", nameEn: "", nameAr: "",
  descFr: "", descEn: "", descAr: "",
  sku: "", brand: "", categoryId: "",
  price: "", comparePrice: "",
  stock: "0", status: "active",
  isNew: false, isHot: false, isEco: false, isBlackFriday: false,
  images: [] as string[],
  videoUrl: "",
};

interface ProductsClientProps {
  initialProducts: any[];
  initialTotal: number;
  categories: any[];
}

export function ProductsClient({ initialProducts, initialTotal, categories: initCats }: ProductsClientProps) {
  const router = useRouter();
  const [localProducts, setLocalProducts] = useState(initialProducts.length ? initialProducts : DEMO_PRODUCTS);
  const products = localProducts;
  const categories = initCats.length ? initCats : DEMO_CATS;

  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [railFilter, setRailFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [descTab, setDescTab] = useState<"fr" | "en" | "ar">("fr");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) uploaded.push(data.url);
        else showToast(data.error || "Erreur upload");
      } catch { showToast("Erreur upload"); }
    }
    if (uploaded.length) setForm(f => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = products.filter(p => {
    const matchQ = !q || p.nameFr.toLowerCase().includes(q.toLowerCase()) || p.sku.includes(q);
    const matchC = catFilter === "ALL" || p.category?.slug === catFilter;
    const matchS = statusFilter === "ALL" || p.status === statusFilter;
    const matchR = railFilter === "ALL"
      || (railFilter === "hot" && p.isHot)
      || (railFilter === "promo" && p.comparePrice)
      || (railFilter === "bf" && p.isBlackFriday)
      || (railFilter === "lastcall" && p.stock > 0 && p.stock <= 5);
    return matchQ && matchC && matchS && matchR;
  });

  const pageSize = 50;
  const pages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => {
    setEditProduct(null);
    setSlugEdited(false);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setSlugEdited(true); // don't auto-overwrite slug when editing
    setForm({
      slug: p.slug || "",
      nameFr: p.nameFr, nameEn: p.nameEn || "", nameAr: p.nameAr || "",
      descFr: p.descFr || "", descEn: p.descEn || "", descAr: p.descAr || "",
      sku: p.sku, brand: p.brand || "", categoryId: p.category?.id || p.categoryId || "",
      price: String(p.price), comparePrice: p.comparePrice ? String(p.comparePrice) : "",
      stock: String(p.stock), status: p.status,
      isNew: p.isNew, isHot: p.isHot, isEco: p.isEco, isBlackFriday: p.isBlackFriday || false,
      images: p.images?.map((img: any) => img.url) || [],
      videoUrl: p.videoUrl || "",
    });
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    set("nameFr", val);
    if (!slugEdited) set("slug", toSlug(val));
  };

  const handleSave = async () => {
    if (!form.nameFr.trim()) { showToast("Le nom est requis"); return; }
    if (!form.sku.trim()) { showToast("Le SKU est requis"); return; }
    if (!form.price) { showToast("Le prix est requis"); return; }
    if (!form.categoryId) { showToast("Choisissez une catégorie"); return; }
    if (!form.slug.trim()) { showToast("Le slug est requis"); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug.trim(),
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock) || 0,
        descFr: form.descFr || `${form.nameFr} — Quincaillerie premium SIMEX.`,
        descEn: form.descEn || `${form.nameEn || form.nameFr} — Premium SIMEX hardware.`,
        descAr: form.descAr || `${form.nameAr || form.nameFr} — تجهيزات SIMEX.`,
        ...(editProduct ? { id: editProduct.id } : {}),
      };
      const res = await fetch("/api/admin/products", {
        method: editProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Erreur de sauvegarde");
        setSaving(false);
        return;
      }
      const { product: saved } = await res.json();
      // Optimistically update local list
      if (editProduct) {
        setLocalProducts(prev => prev.map(p => p.id === saved.id ? { ...saved, price: Number(saved.price), comparePrice: saved.comparePrice != null ? Number(saved.comparePrice) : null } : p));
      } else {
        setLocalProducts(prev => [{ ...saved, price: Number(saved.price), comparePrice: saved.comparePrice != null ? Number(saved.comparePrice) : null }, ...prev]);
      }
      showToast(editProduct ? "Produit mis à jour ✓" : "Produit créé ✓");
      setModalOpen(false);
      router.refresh();
    } catch { showToast("Erreur de sauvegarde"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Archiver ce produit ?")) return;
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, status: "archived" } : p));
    showToast("Produit archivé");
    router.refresh();
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
  const bfCount = products.filter(p => p.isBlackFriday).length;
  const lastCallCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-[100] bg-brand-black text-white text-sm px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">{toast}</div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total produits", value: products.length, color: "text-brand-black" },
          { label: "Actifs", value: activeCount, color: "text-emerald-600" },
          { label: "Rupture de stock", value: outOfStock, color: "text-rose-600" },
          { label: "En promotion", value: promoCount, color: "text-amber-600" },
          { label: "Black Friday", value: bfCount, color: "text-purple-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 mb-1">{k.label}</p>
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
        {/* Rail filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-neutral-400 font-semibold self-center">Rails :</span>
          {[
            { key: "ALL", label: "Tous", icon: null, cls: "bg-neutral-100 text-neutral-600" },
            { key: "hot", label: "Tops Ventes", icon: <Flame className="w-3.5 h-3.5" />, cls: "bg-rose-50 text-rose-600 border-rose-200" },
            { key: "promo", label: "En Promo", icon: <Tag className="w-3.5 h-3.5" />, cls: "bg-amber-50 text-amber-700 border-amber-200" },
            { key: "bf", label: "Black Friday", icon: <Snowflake className="w-3.5 h-3.5" />, cls: "bg-neutral-900 text-white border-transparent" },
            { key: "lastcall", label: "Dernière Chance", icon: <Clock className="w-3.5 h-3.5" />, cls: "bg-purple-50 text-purple-700 border-purple-200" },
          ].map(f => (
            <button key={f.key} onClick={() => { setRailFilter(f.key); setPage(1); }}
              className={cn(
                "flex items-center gap-1.5 px-3 h-7 rounded-full text-[11px] font-bold border transition-all",
                railFilter === f.key ? f.cls + " ring-2 ring-offset-1 ring-current opacity-100" : f.cls + " opacity-60 hover:opacity-100"
              )}
            >
              {f.icon}{f.label}
            </button>
          ))}
        </div>
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
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {p.isNew && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">NEW</span>}
                      {p.isHot && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-semibold">🔥 TOP</span>}
                      {p.isEco && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">ECO</span>}
                      {p.isBlackFriday && <span className="text-[10px] bg-neutral-900 text-white px-1.5 py-0.5 rounded-full font-semibold">BF</span>}
                      {p.stock > 0 && p.stock <= 5 && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">⏳ LAST</span>}
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
                <input value={form.nameFr} onChange={e => handleNameChange(e.target.value)} placeholder="Nom en français *"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                <input value={form.nameEn} onChange={e => set("nameEn", e.target.value)} placeholder="Name in English"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                <input value={form.nameAr} onChange={e => set("nameAr", e.target.value)} placeholder="الاسم بالعربية" dir="rtl"
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red text-right" />
              </div>
            </div>

            {/* Slug */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-1.5 flex items-center gap-2">
                URL Slug *
                {!editProduct && <span className="text-[10px] text-neutral-400 font-normal">Auto-généré depuis le nom</span>}
              </p>
              <div className="flex gap-2">
                <input value={form.slug} onChange={e => { set("slug", e.target.value); setSlugEdited(true); }}
                  placeholder="mon-produit-exemple"
                  className="flex-1 h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm font-mono focus:outline-none focus:border-brand-red"
                />
                {!editProduct && (
                  <button onClick={() => { set("slug", toSlug(form.nameFr)); setSlugEdited(false); }}
                    className="px-3 h-10 rounded-xl border border-neutral-200 text-xs text-neutral-500 hover:border-brand-red hover:text-brand-red transition-all whitespace-nowrap"
                  >Regénérer</button>
                )}
              </div>
              {form.slug && <p className="text-[11px] text-neutral-400 mt-1 font-mono">/products/{form.slug}</p>}
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
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Catégorie *</p>
                <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)}
                  className={cn(
                    "w-full h-10 rounded-xl border bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red",
                    !form.categoryId ? "border-amber-400 text-neutral-400" : "border-neutral-200 text-neutral-800"
                  )}
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
              <p className="text-xs font-semibold text-neutral-500 w-full">Badges & Rails d'affichage</p>
              {[
                { key: "isHot", label: "🔥 Tops Ventes", color: "bg-rose-100 text-rose-700", desc: "Rail Bestsellers" },
                { key: "isNew", label: "✨ Nouveau", color: "bg-blue-100 text-blue-700", desc: "Badge NEW" },
                { key: "isEco", label: "🌿 Éco", color: "bg-emerald-100 text-emerald-700", desc: "Badge ECO" },
                { key: "isBlackFriday", label: "🖤 Black Friday", color: "bg-neutral-900 text-white", desc: "Rail Black Friday" },
              ].map(b => (
                <button key={b.key} onClick={() => set(b.key, !(form as any)[b.key])}
                  title={b.desc}
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
            {/* Rail info */}
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-700 mb-1.5">Apparition sur la homepage :</p>
              <p><span className="font-semibold text-rose-600">Rail Tops Ventes</span> → activer 🔥 Tops Ventes</p>
              <p><span className="font-semibold text-amber-600">Rail En Promo</span> → renseigner un Prix barré</p>
              <p><span className="font-semibold text-neutral-800">Rail Black Friday</span> → activer 🖤 Black Friday</p>
              <p><span className="font-semibold text-purple-600">Rail Dernière Chance</span> → automatique si stock ≤ 5</p>
            </div>

            {/* Images */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">Images</p>

              {/* File upload drop zone */}
              <label className="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:border-brand-red hover:bg-brand-red/5 transition-all cursor-pointer mb-2 relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => handleFileUpload(e.target.files)}
                />
                {uploading ? (
                  <><div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" /><span className="text-xs text-neutral-500">Upload en cours…</span></>
                ) : (
                  <><Upload className="w-5 h-5 text-neutral-400" /><span className="text-xs text-neutral-500">Glisser ou cliquer pour uploader</span><span className="text-[10px] text-neutral-400">JPG, PNG, WebP · max 5 MB</span></>
                )}
              </label>

              {/* URL input */}
              <div className="flex gap-2 mb-2">
                <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="Ou coller une URL image…"
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

            {/* Video URL */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-red/10 flex items-center justify-center">
                  <Upload className="w-3 h-3 text-brand-red" />
                </span>
                Vidéo Story (URL mp4/webm)
              </p>
              <input
                value={(form as any).videoUrl || ""}
                onChange={e => set("videoUrl", e.target.value)}
                placeholder="https://… (format portrait 9:16 recommandé)"
                className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
              />
              {(form as any).videoUrl && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Vidéo configurée — visible sur la fiche produit
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
