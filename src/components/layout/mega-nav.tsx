"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { NavLink } from "./header";

const DEFAULT_ITEMS = [
  { href: "/products",               labelKey: "nav_all"      as const },
  { href: "/products?cat=charnieres", labelKey: "nav_door"    as const },
  { href: "/products?cat=glissieres", labelKey: "nav_drawer"  as const },
  { href: "/products?cat=led",        labelKey: "nav_lighting" as const },
  { href: "/builder",                 labelKey: "nav_builder"  as const },
];

export function MegaNav({ navLinks }: { navLinks?: NavLink[] }) {
  const t = useI18n((s) => s.t);

  const proLink   = navLinks?.find((l) => l.pro);
  const mainLinks = navLinks?.filter((l) => !l.pro);

  return (
    <nav className="hidden md:block bg-[#0d0d0d] border-b border-neutral-900 sticky top-20 lg:top-[84px] z-30">
      <div className="container">
        <div className="flex items-center h-[54px] gap-2">

          {/* Scrollable main links */}
          <div className="flex-1 min-w-0 relative">
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
              {(mainLinks ?? DEFAULT_ITEMS.map((i) => ({
                  href: i.href, label: t(i.labelKey), emoji: undefined, highlight: false, pro: false,
              }))).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 px-3 lg:px-4 py-2 text-[12px] lg:text-[13px] font-semibold uppercase tracking-wide rounded-lg whitespace-nowrap transition-colors",
                    link.highlight
                      ? "text-brand-red hover:bg-brand-red/10"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  )}
                >
                  {link.emoji && <span>{link.emoji}</span>}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Pro CTA — always visible, never clipped */}
          <Link
            href={proLink?.href ?? "/pro"}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-[12px] lg:text-[13px] font-bold uppercase tracking-wide rounded-lg bg-brand-red text-white hover:bg-brand-red/90 transition-colors whitespace-nowrap"
          >
            {proLink?.emoji && <span>{proLink.emoji}</span>}
            <span>{proLink?.label ?? t("nav_pro")}</span>
          </Link>

        </div>
      </div>
    </nav>
  );
}
