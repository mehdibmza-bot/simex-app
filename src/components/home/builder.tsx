"use client";

import Link from "next/link";
import { Boxes, Cpu, ListChecks, Percent, Video } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface BuilderFeature { icon: string; text: string; }
export interface BuilderData {
  eyebrow?: string;
  title?: string;
  desc?: string;
  ctaText?: string;
  features?: BuilderFeature[];
}

const ICON_MAP: Record<string, any> = { Boxes, ListChecks, Percent, Video };

export function Builder({ cms }: { cms?: BuilderData }) {
  const t = useI18n((s) => s.t);

  const defaultFeatures = [
    { icon: Boxes, text: t("b_f1") },
    { icon: ListChecks, text: t("b_f2") },
    { icon: Percent, text: t("b_f3") },
    { icon: Video, text: t("b_f4") },
  ];
  const features = cms?.features
    ? cms.features.map((f) => ({ icon: ICON_MAP[f.icon] ?? Boxes, text: f.text }))
    : defaultFeatures;

  return (
    <section className="relative py-24 bg-brand-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-brand-red blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-amber-500 blur-[140px]" />
      </div>
      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
              {cms?.eyebrow ?? t("b_eb")}
            </span>
            <h2 className="display text-4xl md:text-6xl leading-tight mb-6">
              {cms?.title ?? t("b_t")}
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-8 max-w-lg">{cms?.desc ?? t("b_desc")}</p>
            <ul className="space-y-3 mb-10">
              {features.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-9 h-9 rounded-lg bg-brand-red/15 text-brand-red flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm text-neutral-200 pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold text-sm uppercase tracking-wide px-7 py-3.5 rounded-full hover:shadow-red transition-shadow"
            >
              <Cpu className="w-4 h-4" />
              {cms?.ctaText ?? t("b_cta")}
            </Link>
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-br from-neutral-900 to-brand-black2 rounded-3xl p-8 border border-neutral-800 shadow-brand">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs text-neutral-500 font-mono">simex-builder.app</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-brand-black border border-neutral-800 rounded-xl">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Cuisine</p>
                    <p className="font-semibold">8 caissons · 6 tiroirs</p>
                  </div>
                  <span className="text-2xl">🍳</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Charnières", v: "16 pcs", p: "136,00 TND" },
                    { l: "Glissières", v: "12 pcs", p: "288,00 TND" },
                    { l: "Poignées", v: "14 pcs", p: "96,60 TND" },
                    { l: "Vis & fixations", v: "1 boîte", p: "18,00 TND" },
                  ].map((r, i) => (
                    <div
                      key={i}
                      className="p-3 bg-brand-black border border-neutral-900 rounded-lg"
                    >
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wide">
                        {r.l}
                      </p>
                      <p className="text-sm font-semibold text-white mt-0.5">{r.v}</p>
                      <p className="text-xs text-brand-red mt-1">{r.p}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-red/10 border border-brand-red/40 rounded-xl">
                  <div>
                    <p className="text-xs text-brand-red font-semibold uppercase tracking-wide">
                      Total bundle
                    </p>
                    <p className="text-xs text-neutral-400">Remise -7% appliquée</p>
                  </div>
                  <p className="display text-3xl text-white">501,30 TND</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
