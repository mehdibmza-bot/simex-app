"use client";

import { useEffect, useState } from "react";
import { Flame, Clock, Eye, ShoppingCart, Zap, Star } from "lucide-react";
import { useCart } from "@/lib/store";
import { Reveal } from "@/components/ui/reveal";

export interface DealData {
  id?: string;
  name: string;
  category: string;
  originalPrice: number;
  dealPrice: number;
  sku: string;
  image: string;
  totalStock: number;
  sold: number;
  rating: number;
  reviews: number;
  features: string[];
}

const DEFAULT_DEAL: DealData = {
  name: "Glissière à billes soft-close 500mm",
  category: "Glissières premium",
  originalPrice: 38,
  dealPrice: 19.9,
  sku: "GLS-500SC",
  image:
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=85&auto=format&fit=crop",
  totalStock: 100,
  sold: 53,
  rating: 4.9,
  reviews: 128,
  features: [
    "Sortie totale 100%",
    "Fermeture amortie",
    "Charge 35 kg",
    "Finition nickel mat",
  ],
};

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = Math.max(0, midnight.getTime() - now.getTime());
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function DailyDeal({ deal: dealProp }: { deal?: DealData }) {
  const DEAL = dealProp ?? DEFAULT_DEAL;
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const [watchers, setWatchers] = useState(DEAL.sold + 20);
  const [added, setAdded] = useState(false);
  const addToCart = useCart((s) => s.add);

  useEffect(() => {
    setTime(getTimeUntilMidnight());
    const tid = setInterval(() => setTime(getTimeUntilMidnight()), 1000);
    const wid = setInterval(
      () =>
        setWatchers((w) =>
          Math.max(25, Math.min(70, w + (Math.random() > 0.45 ? 1 : -1)))
        ),
      3800
    );
    return () => {
      clearInterval(tid);
      clearInterval(wid);
    };
  }, []);

  const handleAdd = () => {
    addToCart(
      {
        id: dealProp?.id ?? "daily-gls500sc",
        name: DEAL.name,
        price: DEAL.dealPrice,
        image: DEAL.image,
        sku: DEAL.sku,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const stockLeft = DEAL.totalStock - DEAL.sold;
  const soldPct = Math.round((DEAL.sold / DEAL.totalStock) * 100);
  const discount = Math.round((1 - DEAL.dealPrice / DEAL.originalPrice) * 100);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0e0000] via-brand-black to-brand-black">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-red/6 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-brand-red/4 blur-[80px] rounded-full pointer-events-none" />

      <div className="container relative">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <div className="flex items-center gap-2 bg-brand-red text-white rounded-full px-5 py-2 shadow-lg shadow-brand-red/30">
              <Flame className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-widest">
                Affaire du Jour
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Eye className="w-4 h-4 text-brand-red" />
              <span className="text-white font-bold">{Math.round(watchers)}</span>
              <span className="text-neutral-500">personnes regardent en ce moment</span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* ── Product image ── */}
          <Reveal direction="left">
            <div className="relative group cursor-pointer">
              {/* Glow ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-brand-red/30 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative rounded-3xl overflow-hidden bg-neutral-900 aspect-square shadow-2xl">
                <img
                  src={DEAL.image}
                  alt={DEAL.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Discount badge */}
                <div className="absolute top-5 left-5 w-20 h-20 bg-brand-red text-white font-black text-xl leading-none rounded-full flex flex-col items-center justify-center shadow-xl shadow-brand-red/50">
                  <span>−{discount}%</span>
                </div>

                {/* Rating pill */}
                <div className="absolute bottom-5 left-5 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full px-3 py-1.5 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {DEAL.rating} · {DEAL.reviews} avis
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Info ── */}
          <div className="space-y-6">
            <Reveal delay={80}>
              <p className="text-brand-red text-xs font-bold uppercase tracking-[0.2em]">
                {DEAL.category}
              </p>
              <h2 className="display text-4xl md:text-5xl text-white mt-2 leading-tight">
                {DEAL.name}
              </h2>
            </Reveal>

            {/* Features */}
            <Reveal delay={140}>
              <div className="flex flex-wrap gap-2">
                {DEAL.features.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-neutral-300 rounded-full px-3 py-1 text-xs"
                  >
                    <Zap className="w-3 h-3 text-brand-gold" />
                    {f}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Price */}
            <Reveal delay={200}>
              <div className="flex items-baseline gap-4">
                <span className="display text-6xl text-white tabular-nums">
                  {DEAL.dealPrice.toFixed(2)}
                </span>
                <span className="display text-2xl text-brand-gold">DT</span>
                <span className="text-neutral-500 line-through text-xl">
                  {DEAL.originalPrice} DT
                </span>
                <span className="ml-auto bg-brand-red/15 text-brand-red border border-brand-red/20 text-xs font-bold rounded-full px-3 py-1">
                  Économisez {(DEAL.originalPrice - DEAL.dealPrice).toFixed(2)} DT
                </span>
              </div>
            </Reveal>

            {/* Stock bar */}
            <Reveal delay={260}>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white font-semibold">
                    🔥 {DEAL.sold} déjà vendus aujourd'hui
                  </span>
                  <span className="text-neutral-500">
                    Plus que{" "}
                    <span className="text-brand-red font-bold">{stockLeft}</span>{" "}
                    en stock
                  </span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-red2 to-brand-red rounded-full"
                    style={{ width: `${soldPct}%` }}
                  />
                </div>
              </div>
            </Reveal>

            {/* Countdown */}
            <Reveal delay={320}>
              <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-2xl px-5 py-4">
                <Clock className="w-5 h-5 text-brand-red shrink-0" />
                <span className="text-neutral-400 text-sm">
                  Cette offre expire dans
                </span>
                <div className="flex items-center gap-1 ml-auto">
                  {[time.h, time.m, time.s].map((v, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="bg-white/10 text-white font-mono font-bold text-lg px-3 py-1.5 rounded-xl tabular-nums min-w-[46px] text-center">
                        {pad(v)}
                      </span>
                      {i < 2 && (
                        <span className="text-brand-red font-black text-lg">:</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={380}>
              <button
                onClick={handleAdd}
                className={`group w-full flex items-center justify-between gap-3 px-6 font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                  added
                    ? "bg-emerald-500 text-white"
                    : "bg-brand-red text-white hover:bg-red-700 hover:shadow-xl hover:shadow-brand-red/25"
                }`}
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 shrink-0" />
                  {added ? "✓ Ajouté au panier !" : "Ajouter au panier"}
                </span>
                {!added && (
                  <span className="text-xs opacity-75 font-normal tabular-nums whitespace-nowrap">
                    {DEAL.dealPrice.toFixed(2)} DT
                  </span>
                )}
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
