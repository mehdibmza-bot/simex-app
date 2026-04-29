"use client";

import Link from "next/link";
import { Home, Wrench, Briefcase, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface PersonaItem { icon: string; title: string; desc: string; href: string; accent: string; }
export interface PersonasData { eyebrow?: string; title?: string; personas?: PersonaItem[]; }

const ICON_MAP: Record<string, any> = { Home, Wrench, Briefcase };

const DEFAULT_PERSONAS = [
  { icon: Home, accent: "from-rose-500 to-brand-red", titleKey: "p1_t", descKey: "p1_d", href: "/products?audience=home" },
  { icon: Wrench, accent: "from-amber-400 to-amber-600", titleKey: "p2_t", descKey: "p2_d", href: "/products?audience=repair" },
  { icon: Briefcase, accent: "from-zinc-700 to-brand-black", titleKey: "p3_t", descKey: "p3_d", href: "/pro" },
] as const;

export function Personas({ cms }: { cms?: PersonasData }) {
  const t = useI18n((s) => s.t);

  const items = cms?.personas
    ? cms.personas.map((p) => ({ icon: ICON_MAP[p.icon] ?? Home, title: p.title, desc: p.desc, href: p.href, accent: p.accent }))
    : DEFAULT_PERSONAS.map((p) => ({ icon: p.icon, title: t(p.titleKey as any), desc: t(p.descKey as any), href: p.href, accent: p.accent }));

  return (
    <section className="py-24 bg-brand-cream">
      <div className="container">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
            {cms?.eyebrow ?? t("per_eb")}
          </span>
          <h2 className="display text-4xl md:text-6xl text-brand-black">{cms?.title ?? t("per_t")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc, href, accent }, i) => (
            <Link
              key={i}
              href={href}
              className="group relative bg-white rounded-2xl p-8 border border-neutral-200 hover:border-brand-red hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div
                className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accent} opacity-10 group-hover:opacity-25 transition-opacity`}
              />
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} text-white flex items-center justify-center mb-5 shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="display text-2xl text-brand-black mb-3">{title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-1.5 text-brand-red text-sm font-semibold group-hover:gap-3 transition-all">
                  {t("explore")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
