"use client";

import { Truck, Shield, Lock, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface TrustItem { icon: string; title: string; desc: string; }

const ICON_MAP: Record<string, any> = { Truck, Shield, Lock, Headphones };

export function TrustBar({ items: propItems }: { items?: TrustItem[] }) {
  const t = useI18n((s) => s.t);
  const defaultItems = [
    { icon: Truck, title: t("t1_t"), desc: t("t1_d") },
    { icon: Shield, title: t("t2_t"), desc: t("t2_d") },
    { icon: Lock, title: t("t3_t"), desc: t("t3_d") },
    { icon: Headphones, title: t("t4_t"), desc: t("t4_d") },
  ];
  const items = propItems
    ? propItems.map((i) => ({ ...i, iconComp: ICON_MAP[i.icon] ?? Truck }))
    : defaultItems.map((i) => ({ icon: i.icon, title: i.title, desc: i.desc, iconComp: i.icon }));

  return (
    <section className="py-16 bg-white border-y border-neutral-100">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ iconComp: Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-5 rounded-xl hover:bg-brand-cream transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-black text-sm mb-1">{title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
