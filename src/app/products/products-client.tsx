"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATALOG } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
}

interface Props {
  initialProducts: ProductCardData[];
  categories: Category[];
  initialCat: string;
  initialQuery: string;
}

const SORT_OPTIONS = [
  { value: "newest", labelFr: "Plus récents" },
  { value: "price-asc", labelFr: "Prix croissant" },
  { value: "price-desc", labelFr: "Prix décroissant" },
  { value: "rating", labelFr: "Mieux notés" },
];

export function ProductsClient({
  initialProducts,
  categories,
  initialCat,
  initialQuery,
}: Props) {
  const t = useI18n((s) => s.t);
  // Use shared catalog as fallback when DB returns nothing
  const products = initialProducts.length > 0 ? initialProducts : CATALOG;
  // Build sidebar category list from DB or derive from products
  const sidebarCategories: Category[] =
    categories.length > 0
      ? categories
      : Array.from(
          new Map(
            products
              .map((p: any) => p.category)
              .filter(Boolean)
              .map((c: any) => [c.slug, { id: c.slug, slug: c.slug, nameFr: c.nameFr, nameEn: c.nameFr, nameAr: c.nameFr }])
          ).values()
        );
  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat) list = list.filter((p) => (p as any).category?.slug === cat);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.nameFr.toLowerCase().includes(needle) ||
          p.sku.toLowerCase().includes(needle)
      );
    }
    list = list.filter((p) => Number(p.price) <= maxPrice);
    if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, cat, q, sort, maxPrice]);

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="bg-brand-black text-white py-10">
        <div className="container">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">
            <Link href="/" className="hover:text-brand-red">
              Accueil
            </Link>{" "}
            · Catalogue
          </p>
          <h1 className="display text-4xl md:text-6xl">{t("nav_all")}</h1>
          <p className="text-sm text-neutral-400 mt-2">
            {filtered.length} produits trouvés
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside
            className={cn(
              "lg:block",
              showFilters
                ? "fixed inset-0 z-40 bg-white p-6 overflow-y-auto"
                : "hidden"
            )}
          >
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="display text-2xl">Filtres</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-7">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                  Recherche
                </h3>
                <Input
                  placeholder={t("search_ph")}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                  Catégorie
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setCat("")}
                    className={cn(
                      "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      cat === ""
                        ? "bg-brand-black text-white"
                        : "hover:bg-white text-neutral-700"
                    )}
                  >
                    Toutes
                  </button>
                  {sidebarCategories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setCat(c.slug)}
                      className={cn(
                        "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        cat === c.slug
                          ? "bg-brand-black text-white"
                          : "hover:bg-white text-neutral-700"
                      )}
                    >
                      {c.nameFr}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                  Prix max : {maxPrice} TND
                </h3>
                <input
                  type="range"
                  min={5}
                  max={500}
                  step={5}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-red"
                />
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-3 px-4">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>
              <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-600">
                <SlidersHorizontal className="w-4 h-4" />
                Trier par
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.labelFr}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="display text-2xl mb-2">Aucun produit trouvé</h3>
                <p className="text-neutral-500 mb-5">
                  Essayez d&apos;ajuster vos filtres ou votre recherche.
                </p>
                <Button
                  onClick={() => {
                    setCat("");
                    setQ("");
                    setMaxPrice(500);
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
