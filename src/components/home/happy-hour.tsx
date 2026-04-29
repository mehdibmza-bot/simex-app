"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function timeLeft() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

export function HappyHour({
  title,
  subtitle,
  ctaText,
  ctaLink = "/products?promo=1",
}: {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}) {
  const t = useI18n((s) => s.t);
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    setTime(timeLeft());
    const id = setInterval(() => setTime(timeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="bg-brand-red text-white py-3 overflow-hidden border-y border-red-900/30">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <div>
              <strong className="block text-sm font-bold tracking-wide uppercase">
                {title ?? t("hh_title")}
              </strong>
              <span className="text-xs opacity-90">{subtitle ?? t("hh_sub")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {[
              { value: pad(time.h), label: t("hr") },
              { value: pad(time.m), label: t("min") },
              { value: pad(time.s), label: t("sec") },
            ].map((u, i) => (
              <div key={i} className="flex items-center">
                <div className="bg-brand-black/40 backdrop-blur rounded-md px-2.5 py-1 min-w-[44px] text-center">
                  <div className="display text-xl leading-none">{u.value}</div>
                  <div className="text-[9px] opacity-75 tracking-widest">{u.label}</div>
                </div>
                {i < 2 && <span className="display text-xl opacity-60 mx-0.5">:</span>}
              </div>
            ))}
            <Link
              href={ctaLink}
              className="ml-3 bg-white text-brand-red text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full hover:bg-brand-black hover:text-white transition-colors"
            >
              {ctaText ?? t("hh_cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
