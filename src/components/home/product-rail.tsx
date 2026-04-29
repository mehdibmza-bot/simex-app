"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { Reveal } from "@/components/ui/reveal";
import { BESTSELLERS, PROMOS } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ProductRail({
  bestsellers,
  promos,
  blackFriday = [],
  lastCall = [],
}: {
  bestsellers: any[];
  promos: any[];
  blackFriday?: any[];
  lastCall?: any[];
}) {
  const t = useI18n((s) => s.t);
  const [tab, setTab] = useState<"all" | "promo" | "bf" | "lastcall">("all");

  const allList: ProductCardData[] = bestsellers.length > 0 ? bestsellers : BESTSELLERS;
  const promoList: ProductCardData[] = promos.length > 0 ? promos : PROMOS;
  const bfList: ProductCardData[] = blackFriday;
  const lastCallList: ProductCardData[] = lastCall;

  const list =
    tab === "all" ? allList
    : tab === "promo" ? promoList
    : tab === "bf" ? bfList
    : lastCallList;

  return (
    <section className="py-24 bg-brand-cream">
      <div className="container">
        <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
              {t("prod_eb")}
            </span>
            <h2 className="display text-4xl md:text-5xl text-brand-black">{t("prod_t")}</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* TOUS */}
            <button
              onClick={() => setTab("all")}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200",
                tab === "all"
                  ? "bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-brand-red hover:text-brand-red"
              )}
            >
              Tous
            </button>

            {/* EN PROMO — gold gradient */}
            {promoList.length > 0 && (
              <button
                onClick={() => setTab("promo")}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 overflow-hidden",
                  tab === "promo"
                    ? "text-brand-black shadow-lg shadow-amber-400/40 scale-105"
                    : "text-amber-700 hover:scale-105"
                )}
                style={
                  tab === "promo"
                    ? { background: "linear-gradient(135deg, #F6C64C 0%, #D4A24C 50%, #F6C64C 100%)" }
                    : { background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", border: "1.5px solid #D4A24C" }
                }
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="text-[10px]">★</span>
                  En Promo
                </span>
                {tab === "promo" && (
                  <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                )}
              </button>
            )}

            {/* BLACK FRIDAY — dark with red glow */}
            {bfList.length > 0 && (
              <button
                onClick={() => setTab("bf")}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 overflow-hidden",
                  tab === "bf"
                    ? "bg-brand-black text-white scale-105"
                    : "bg-brand-black/90 text-white/80 hover:scale-105 hover:text-white"
                )}
                style={
                  tab === "bf"
                    ? { boxShadow: "0 0 0 2px #E1252A, 0 8px 24px rgba(225,37,42,0.35)" }
                    : { boxShadow: "0 0 0 1.5px rgba(225,37,42,0.4)" }
                }
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="text-brand-red text-[10px]">♥</span>
                  Black Friday
                </span>
                {tab === "bf" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-red/10 via-transparent to-brand-red/10 animate-shimmer" />
                )}
              </button>
            )}

            {/* DERNIÈRE CHANCE — purple */}
            {lastCallList.length > 0 && (
              <button
                onClick={() => setTab("lastcall")}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 overflow-hidden",
                  tab === "lastcall"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-400/40 scale-105"
                    : "bg-purple-50 border border-purple-300 text-purple-700 hover:scale-105"
                )}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="text-[10px]">⏳</span>
                  Dernière Chance
                </span>
              </button>
            )}
          </div>
        </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {list.slice(0, 8).map((p, i) => (
            <Reveal key={p.id} delay={i * 55} direction="scale" className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-black text-white font-semibold text-sm hover:bg-brand-red transition-all hover:gap-3"
          >
            {t("see_all")}
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
