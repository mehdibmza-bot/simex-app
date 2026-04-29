"use client";

import { Sparkles, ShieldCheck, Palette } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface MissionPillar { icon: string; title: string; desc: string; }
export interface MissionData {
  eyebrow?: string;
  title?: string;
  quote?: string;
  pillars?: MissionPillar[];
}

const ICON_MAP: Record<string, any> = { Sparkles, ShieldCheck, Palette };

export function Mission({ cms }: { cms?: MissionData }) {
  const t = useI18n((s) => s.t);
  const defaultPillars = [
    { icon: Sparkles, title: t("mp1_t"), desc: t("mp1_d") },
    { icon: ShieldCheck, title: t("mp2_t"), desc: t("mp2_d") },
    { icon: Palette, title: t("mp3_t"), desc: t("mp3_d") },
  ];
  const resolvedPillars = cms?.pillars
    ? cms.pillars.map((p) => ({ ...p, icon: ICON_MAP[p.icon] ?? Sparkles }))
    : defaultPillars;

  return (
    <section id="mission" className="py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-14 items-start">
          <div>
            <span className="inline-block text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
              {cms?.eyebrow ?? t("m_eb")}
            </span>
            <h2 className="display text-4xl md:text-6xl text-brand-black leading-tight">
              {cms?.title ?? t("m_t")}
            </h2>
          </div>
          <div>
            <p className="text-lg text-neutral-700 leading-relaxed mb-10 border-l-4 border-brand-red pl-6 italic">
              {cms?.quote ?? t("m_text")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {resolvedPillars.map(({ icon: Icon, title, desc }, idx) => (
                <div
                  key={idx}
                  className="bg-brand-cream rounded-2xl p-6 border border-transparent hover:border-brand-red transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="display text-xl text-brand-black mb-2">{title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
