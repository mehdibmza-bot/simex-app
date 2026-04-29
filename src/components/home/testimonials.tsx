"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const REVIEWS = [
  {
    name: "Ahmed Benali",
    city: "Tunis",
    initials: "AB",
    color: "from-blue-600 to-blue-400",
    rating: 5,
    product: "Charnières soft-close 110°",
    text: "Qualité impeccable. J'ai équipé toute ma cuisine avec les charnières SIMEX — fermeture en douceur parfaite, aucun claquement. Livraison à Tunis en moins de 24h comme promis. Je recommande à 100%.",
    date: "Mars 2026",
    verified: true,
  },
  {
    name: "Sonia Mejri",
    city: "Sfax",
    initials: "SM",
    color: "from-emerald-600 to-teal-400",
    rating: 5,
    product: "Glissières full-extension 450mm",
    text: "J'ai commandé pour rénover mes tiroirs de cuisine. Montage facile avec les instructions fournies, glissement ultra silencieux. Le prix est imbattable comparé aux magasins locaux. Très satisfaite !",
    date: "Février 2026",
    verified: true,
  },
  {
    name: "Karim Tlili",
    city: "Sousse",
    initials: "KT",
    color: "from-purple-600 to-violet-400",
    rating: 5,
    product: "Ruban LED 5m 3000K",
    text: "Excellent rapport qualité-prix. La lumière est chaleureuse et l'installation est vraiment simple. Mon salon est complètement transformé. J'ai déjà passé une deuxième commande pour la salle à manger.",
    date: "Janvier 2026",
    verified: true,
  },
  {
    name: "Ines Dridi",
    city: "Monastir",
    initials: "ID",
    color: "from-amber-500 to-orange-400",
    rating: 5,
    product: "Poignées aluminium noir mat 128mm",
    text: "Belle finition, très moderne. Les poignées ont complètement changé l'esthétique de mes meubles. J'ai eu peur que la couleur ne corresponde pas, mais c'est parfait. Livraison rapide malgré la distance.",
    date: "Avril 2026",
    verified: true,
  },
  {
    name: "Hamdi Layouni",
    city: "Bizerte",
    initials: "HL",
    color: "from-rose-600 to-pink-400",
    rating: 5,
    product: "Kit amortisseur soft-close",
    text: "Service client au top ! J'avais une question sur la compatibilité, ils ont répondu en 10 minutes sur WhatsApp. Le produit est nickel, mes tiroirs ferment maintenant sans bruit. Merci SIMEX.",
    date: "Mars 2026",
    verified: true,
  },
  {
    name: "Rania Troudi",
    city: "Nabeul",
    initials: "RT",
    color: "from-cyan-600 to-sky-400",
    rating: 4,
    product: "Spots LED encastrés 3W",
    text: "Très bons spots LED, lumière douce et chaleureuse. La pose est simple même pour un non-professionnel. Un seul bémol : j'aurais aimé une notice en arabe, mais le service client a compensé par appel vidéo.",
    date: "Février 2026",
    verified: true,
  },
];

export interface ReviewData {
  id?: string;
  name: string;
  city: string;
  initials: string;
  color: string;
  rating: number;
  product: string;
  body?: string;
  text?: string;
  date: string;
  verified: boolean;
}

export function Testimonials({ reviews }: { reviews?: ReviewData[] }) {
  const data = reviews && reviews.length > 0 ? reviews : REVIEWS;
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(data.length / perPage);
  const visible = data.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-28 bg-brand-cream relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(10,10,10,0.07) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container relative">
        {/* Header */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <span className="inline-block text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Avis vérifiés
              </span>
              <h2 className="display text-4xl md:text-6xl text-brand-black leading-tight">
                Ils nous font{" "}
                <span
                  className="text-stroke"
                  style={{
                    WebkitTextStroke: "2px #E1252A",
                    color: "transparent",
                  }}
                >
                  confiance
                </span>
              </h2>
            </div>

            {/* Global rating badge */}
            <div className="flex flex-col items-end gap-2">
              <div className="inline-flex items-center gap-2 bg-white rounded-2xl px-5 py-3 border border-neutral-200 shadow-sm">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="font-black text-brand-black text-sm">4.8/5</span>
                <span className="text-neutral-400 text-xs border-l border-neutral-200 pl-2">
                  2 348 avis
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                +12 000 clients satisfaits à travers la Tunisie
              </p>
            </div>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[340px]">
          {visible.map((r, i) => (
            <Reveal key={r.name} delay={i * 80} direction="scale">
              <div className="glow-hover h-full bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-7 h-7 text-brand-red/25" />
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-3.5 h-3.5",
                          s <= r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-neutral-200 text-neutral-200"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Text */}
                <p className="text-sm text-neutral-600 leading-relaxed flex-1 mb-5">
                  "{(r as any).body ?? (r as any).text}"
                </p>

                {/* Product tag */}
                <span className="self-start text-xs text-brand-red font-semibold bg-brand-red/8 rounded-full px-3 py-1 mb-5">
                  {r.product}
                </span>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.color} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-brand-black truncate">
                        {r.name}
                      </span>
                      {r.verified && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-0.5 font-medium shrink-0">
                          ✓ vérifié
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {r.city} · {r.date}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === page ? "bg-brand-red w-6" : "bg-neutral-300"
              )}
            />
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page === pages - 1}
            className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
