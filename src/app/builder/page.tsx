"use client";

import { useEffect, useState } from "react";
import { Cpu, Plus, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart, useUI } from "@/lib/store";

const PRESETS = [
  { id: "kitchen", emoji: "🍳", title: "Cuisine", base: { hinges: 16, slides: 12, handles: 14, screws: 1 } },
  { id: "wardrobe", emoji: "🚪", title: "Dressing", base: { hinges: 8, slides: 6, handles: 10, screws: 1 } },
  { id: "bathroom", emoji: "🚿", title: "Salle de bain", base: { hinges: 4, slides: 2, handles: 4, screws: 1 } },
];

const PRICES = { hinges: 8.5, slides: 24, handles: 6.9, screws: 18 };

export default function BuilderPage() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [parts, setParts] = useState(PRESETS[0].base);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const addToCart = useCart((s) => s.add);
  const showToast = useUI((s) => s.showToast);
  const openCart = useUI((s) => s.setCart);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setIsAuthenticated(!!data?.authenticated);
      } catch {
        if (!active) return;
        setIsAuthenticated(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const choose = (p: typeof PRESETS[0]) => {
    setPreset(p);
    setParts(p.base);
  };

  const update = (k: keyof typeof parts, delta: number) =>
    setParts((s) => ({ ...s, [k]: Math.max(0, s[k] + delta) }));

  const subtotal =
    parts.hinges * PRICES.hinges +
    parts.slides * PRICES.slides +
    parts.handles * PRICES.handles +
    parts.screws * PRICES.screws;
  const discount = isAuthenticated ? subtotal * 0.07 : 0;
  const total = subtotal - discount;

  const handleAddBundle = () => {
    addToCart(
      {
        id: `builder-${preset.id}-${parts.hinges}-${parts.slides}-${parts.handles}-${parts.screws}`,
        sku: `BUNDLE-${preset.id.toUpperCase()}`,
        name: `Bundle configurateur ${preset.title}`,
        price: Number(total.toFixed(2)),
        image: "/placeholder.svg",
      },
      1
    );
    showToast("Bundle ajoute au panier", "🧩");
    openCart(true);
  };

  return (
    <div className="bg-brand-cream min-h-screen py-16">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Outil exclusif SIMEX
          </span>
          <h1 className="display text-4xl md:text-6xl text-brand-black">Le configurateur SIMEX</h1>
          <p className="text-neutral-500 mt-3 max-w-2xl mx-auto">
            Choisissez votre projet, ajustez les quantités, recevez votre liste de quincaillerie chiffrée.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="bg-white rounded-2xl p-8 border border-neutral-200">
            <h2 className="display text-2xl mb-5">1. Type de projet</h2>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => choose(p)}
                  className={`p-5 rounded-xl border-2 text-center transition-all ${
                    preset.id === p.id
                      ? "border-brand-red bg-brand-red/5"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="text-4xl mb-2">{p.emoji}</div>
                  <div className="font-bold text-brand-black">{p.title}</div>
                </button>
              ))}
            </div>

            <h2 className="display text-2xl mb-5">2. Ajustez vos quantités</h2>
            <div className="space-y-4">
              {(
                [
                  { k: "hinges" as const, label: "Charnières clip-on" },
                  { k: "slides" as const, label: "Glissières 450mm" },
                  { k: "handles" as const, label: "Poignées" },
                  { k: "screws" as const, label: "Vis (boîte 200pcs)" },
                ]
              ).map(({ k, label }) => (
                <div
                  key={k}
                  className="flex items-center justify-between p-4 bg-brand-cream rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-brand-black">{label}</p>
                    <p className="text-xs text-neutral-500">
                      {formatPrice(PRICES[k])} × {parts[k]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full p-1">
                    <button
                      onClick={() => update(k, -1)}
                      className="w-8 h-8 rounded-full hover:bg-brand-cream flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{parts[k]}</span>
                    <button
                      onClick={() => update(k, 1)}
                      className="w-8 h-8 rounded-full hover:bg-brand-cream flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-brand-black text-white rounded-2xl p-8 sticky top-28 self-start">
            <h2 className="display text-2xl tracking-wider mb-5">Votre bundle</h2>
            <div className="space-y-2 text-sm mb-6">
              <Row label="Sous-total" value={formatPrice(subtotal)} />
              <Row label={isAuthenticated ? "Remise -7%" : "Remise compte"} value={`-${formatPrice(discount)}`} className="text-emerald-400" />
              <div className="border-t border-neutral-800 my-3" />
              <Row label="Total" value={formatPrice(total)} bold />
            </div>
            {!isAuthenticated && (
              <p className="text-xs text-amber-300 mb-3">Connectez-vous pour activer les remises client.</p>
            )}
            <Button size="lg" className="w-full" onClick={handleAddBundle}>
              <Cpu className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
            <p className="text-xs text-neutral-500 mt-4 text-center">
              Livraison 24-48h · Garantie 2 ans · Retour gratuit
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between ${className || ""}`}>
      <span className={bold ? "font-bold" : "text-neutral-400"}>{label}</span>
      <span className={bold ? "display text-2xl text-brand-red" : "font-semibold"}>{value}</span>
    </div>
  );
}
