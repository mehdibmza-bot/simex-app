"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCoupon, useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface BFDeal { label: string; discount: string; emoji: string; bg: string; href: string; }
export interface BlackFridayData {
  date?: string;         // ISO date string
  couponCode?: string;
  subtitle?: string;
  badge?: string;
  deals?: BFDeal[];
}

// Black Friday 2026 — Nov 27
const BF_DATE_DEFAULT = "2026-11-27T00:00:00";

function bfCountdown(dateStr?: string) {
  const now = new Date();
  const diff = Math.max(0, new Date(dateStr ?? BF_DATE_DEFAULT).getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { days, h, m, s };
}

const BF_DEALS = [
  {
    label: "Charnières",
    discount: "-40%",
    emoji: "🔩",
    bg: "from-red-900 to-red-950",
    href: "/products?cat=charnieres&promo=bf",
  },
  {
    label: "Glissières",
    discount: "-35%",
    emoji: "📏",
    bg: "from-neutral-900 to-neutral-950",
    href: "/products?cat=glissieres&promo=bf",
  },
  {
    label: "Poignées",
    discount: "-45%",
    emoji: "✨",
    bg: "from-amber-900 to-amber-950",
    href: "/products?cat=poignees&promo=bf",
  },
  {
    label: "Éclairage LED",
    discount: "-30%",
    emoji: "💡",
    bg: "from-yellow-900 to-yellow-950",
    href: "/products?cat=led&promo=bf",
  },
];

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[72px] text-center backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/30" />
        <span className="display text-4xl md:text-5xl font-black text-white leading-none relative z-10">
          {value}
        </span>
      </div>
      <span className="text-[10px] text-white/50 font-bold tracking-[0.2em] uppercase mt-2">{label}</span>
    </div>
  );
}

export function BlackFriday({ cms }: { cms?: BlackFridayData }) {
  const t = useI18n((s) => s.t);
  const coupon = cms?.couponCode ?? "BF2026";
  const deals = cms?.deals ?? BF_DEALS;
  const applyCoupon = useCoupon((s) => s.apply);
  const couponCode = useCoupon((s) => s.code);
  const showToast = useUI((s) => s.showToast);
  const setCartOpen = useUI((s) => s.setCart);

  const [time, setTime] = useState({ days: 0, h: 0, m: 0, s: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTime(bfCountdown(cms?.date));
    const id = setInterval(() => setTime(bfCountdown(cms?.date)), 1000);
    return () => clearInterval(id);
  }, [cms?.date]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const handleActivate = async () => {
    if (couponCode === coupon) {
      showToast(`Code ${coupon} déjà appliqué !`, "🖤");
      setCartOpen(true);
      return;
    }
    const res = await applyCoupon(coupon);
    showToast(res.msg, "🖤");
    if (res.ok) setCartOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="relative bg-brand-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-red-900/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-red-950/30 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative container py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-800/50 rounded-full px-5 py-2 mb-6">
            <Flame className="w-4 h-4 text-brand-red animate-pulse" />
            <span className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase">
              {t("bf_badge")}
            </span>
          </div>

          <h2 className="display text-[56px] sm:text-[80px] lg:text-[110px] leading-[0.88] text-white mb-4">
            <span className="block">BLACK</span>
            <span className="block text-brand-red">FRIDAY</span>
            <span className="block text-white/40 text-[0.5em]">{cms?.date ? new Date(cms.date).getFullYear() : 2026}</span>
          </h2>

          <p className="text-neutral-400 text-lg max-w-xl mx-auto mt-6">{cms?.subtitle ?? t("bf_sub")}</p>
        </div>

        {/* Countdown */}
        <div className="flex justify-center gap-3 md:gap-5 mb-14">
          <TimeBlock value={pad(time.days)} label={t("days")} />
          <span className="display text-4xl text-white/20 self-center pb-6">:</span>
          <TimeBlock value={pad(time.h)} label={t("hr")} />
          <span className="display text-4xl text-white/20 self-center pb-6">:</span>
          <TimeBlock value={pad(time.m)} label={t("min")} />
          <span className="display text-4xl text-white/20 self-center pb-6">:</span>
          <TimeBlock value={pad(time.s)} label={t("sec")} />
        </div>

        {/* Deal cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {deals.map((deal) => (
            <Link
              key={deal.label}
              href={deal.href}
              className={cn(
                "group relative bg-gradient-to-br rounded-2xl p-6 overflow-hidden border border-white/5 hover:border-brand-red/40 transition-all hover:scale-[1.02]",
                deal.bg
              )}
            >
              <div className="text-4xl mb-3">{deal.emoji}</div>
              <div className="text-white/60 text-sm font-semibold mb-1">{deal.label}</div>
              <div className="display text-4xl font-black text-white">{deal.discount}</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-brand-red" />
              </div>
            </Link>
          ))}
        </div>

        {/* Coupon activation */}
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-brand-red" />
              <span className="text-white font-bold text-sm uppercase tracking-widest">{t("bf_code_title")}</span>
            </div>

            {/* Code display */}
            <button
              onClick={handleCopy}
              className="group flex items-center justify-center gap-3 mx-auto mb-5"
              title="Copier le code"
            >
              <span className="display text-5xl font-black text-white tracking-widest group-hover:text-brand-red transition-colors">
                {coupon}
              </span>
              <span className="text-xs text-white/40 group-hover:text-brand-red transition-colors font-mono">
                {copied ? "✓ copié" : "copier"}
              </span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleActivate}
                className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-bold px-7 py-3 rounded-full hover:bg-red-700 transition-colors text-sm uppercase tracking-wide"
              >
                <ShoppingBag className="w-4 h-4" />
                {couponCode === coupon ? t("bf_activated") : t("bf_activate")}
              </button>
              <Link
                href="/products?promo=bf"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-7 py-3 rounded-full hover:bg-white/20 transition-colors text-sm uppercase tracking-wide border border-white/10"
              >
                {t("bf_browse")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-white/30 mt-4">{t("bf_terms")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
