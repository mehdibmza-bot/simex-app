"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const FALLBACK_CATEGORIES = [
  { slug: "portes",      nameFr: "Portes d'entrée & Maison", nameEn: "Doors",             nameAr: "أبواب",   image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&h=600&fit=crop&q=80", count: 320 },
  { slug: "salon",       nameFr: "Salon et Chambre",        nameEn: "Living & Bedroom",  nameAr: "صالون",   image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&q=80", count: 180 },
  { slug: "menuiserie",  nameFr: "Menuiserie & MDF",         nameEn: "Woodwork & MDF",    nameAr: "نجارة",   image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&h=600&fit=crop&q=80", count: 540 },
  { slug: "cuisine",     nameFr: "Cuisine & Dressing",       nameEn: "Kitchen & Closet",  nameAr: "مطبخ",    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&q=80", count: 280 },
  { slug: "glissieres",  nameFr: "Glissières",               nameEn: "Slides",            nameAr: "مزلاجات", image: "https://images.unsplash.com/photo-1724578341766-081a4996a067?w=600&h=600&fit=crop&q=80", count: 180 },
  { slug: "poignees",    nameFr: "Poignées",                 nameEn: "Handles",           nameAr: "مقابض",   image: "https://images.unsplash.com/photo-1583041398200-09b2205f6cf0?w=600&h=600&fit=crop&q=80", count: 540 },
  { slug: "led",         nameFr: "Éclairage LED",            nameEn: "LED Lighting",      nameAr: "إضاءة",   image: "https://images.unsplash.com/photo-1682888818589-404faaa4dbc9?w=600&h=600&fit=crop&q=80", count: 220 },
  { slug: "home",        nameFr: "Simex Home",               nameEn: "Simex Home",        nameAr: "سيمكس",   image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80", count: 410 },
];

interface Category {
  id?: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  emoji?: string | null;
  productCount?: number;
}

export function Categories({ categories }: { categories: Category[] }) {
  const t = useI18n((s) => s.t);
  const lang = useI18n((s) => s.lang);
  const list = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  const labelFor = (c: any) =>
    lang === "ar" ? c.nameAr : lang === "en" ? c.nameEn : c.nameFr;

  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <span className="inline-block text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
              {t("cat_eb")}
            </span>
            <h2 className="display text-4xl md:text-5xl text-brand-black">{t("cat_t")}</h2>
            <p className="text-neutral-500 mt-3 text-sm">{t("cat_sub")}</p>
          </div>
          <Link
            href="/products"
            className="text-brand-red font-semibold text-sm inline-flex items-center gap-1.5 hover:gap-3 transition-all"
          >
            {t("see_all")}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {list.map((c: any, i) => (
            <Link
              key={c.slug}
              href={`/products?cat=${c.slug}`}
              className="group relative aspect-square rounded-2xl overflow-hidden"
            >
              {/* background image */}
              {c.image ? (
                <Image
                  src={c.image}
                  alt={labelFor(c)}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
              )}
              {/* dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/30 to-transparent group-hover:from-brand-black/90 transition-all" />
              {/* content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  <span className="block text-[11px] font-bold text-brand-red tracking-wide uppercase mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display text-xl md:text-2xl text-white leading-tight">
                    {labelFor(c)}
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">
                    {c._count?.products ?? c.productCount ?? c.count ?? 0}+ réf.
                  </span>
                  <span className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
