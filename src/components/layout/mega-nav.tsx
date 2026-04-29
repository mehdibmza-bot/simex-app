"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { NavLink } from "./header";

const DEFAULT_ITEMS: NavLink[] = [
  { href: "/products",                label: "Tous les produits", labelEn: "All products",    labelAr: "كل المنتجات" },
  { href: "/products?cat=charnieres", label: "Portes",            labelEn: "Doors",            labelAr: "أبواب" },
  { href: "/products?cat=glissieres", label: "Tiroirs",           labelEn: "Drawers",          labelAr: "أدراج" },
  { href: "/products?cat=led",        label: "Éclairage",         labelEn: "Lighting",         labelAr: "إضاءة" },
  { href: "/builder",                 label: "Configurateur",     labelEn: "Builder",          labelAr: "المُكوِّن", highlight: true },
];

export function MegaNav({ navLinks }: { navLinks?: NavLink[] }) {
  const t    = useI18n((s) => s.t);
  const lang = useI18n((s) => s.lang);

  const getLabel = (l: NavLink) => {
    if (lang === "en") return l.labelEn ?? l.label;
    if (lang === "ar") return l.labelAr ?? l.label;
    return l.label;
  };

  const proLink   = navLinks?.find((l) => l.pro);
  const mainLinks = navLinks?.filter((l) => !l.pro) ?? DEFAULT_ITEMS;

  return (
    <nav className="hidden md:block bg-[#0d0d0d] border-b border-neutral-900 sticky top-20 lg:top-[84px] z-30">
      <div className="container">
        <div className="flex items-center h-[54px] gap-2">

          {/* Scrollable main links */}
          <div className="flex-1 min-w-0 relative">
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
              {mainLinks.map((link) =>
                link.highlight ? (
                  /* ── Configurateur — special design ── */
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group relative flex items-center gap-2 px-4 py-1.5 mx-1 rounded-lg whitespace-nowrap",
                      "bg-gradient-to-r from-red-700 to-red-500",
                      "text-white text-[12px] lg:text-[13px] font-bold uppercase tracking-wide",
                      "shadow-[0_0_16px_rgba(220,38,38,0.3)] hover:shadow-[0_0_22px_rgba(220,38,38,0.55)]",
                      "border border-red-400/30 hover:border-red-400/60",
                      "transition-all duration-200 overflow-hidden"
                    )}
                  >
                    {/* shimmer sweep */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    <Settings2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{getLabel(link)}</span>
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold tracking-widest leading-none">
                      OUTIL
                    </span>
                  </Link>
                ) : (
                  /* ── Regular category link ── */
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1 px-3 lg:px-4 py-2 text-[12px] lg:text-[13px] font-semibold uppercase tracking-wide rounded-lg whitespace-nowrap transition-colors text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    {link.emoji && <span>{link.emoji}</span>}
                    <span>{getLabel(link)}</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Pro CTA — always visible, never clipped */}
          <Link
            href={proLink?.href ?? "/pro"}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-[12px] lg:text-[13px] font-bold uppercase tracking-wide rounded-lg bg-brand-red text-white hover:bg-brand-red/90 transition-colors whitespace-nowrap"
          >
            {proLink?.emoji && <span>{proLink.emoji}</span>}
            <span>{proLink ? getLabel(proLink) : t("nav_pro")}</span>
          </Link>

        </div>
      </div>
    </nav>
  );
}
