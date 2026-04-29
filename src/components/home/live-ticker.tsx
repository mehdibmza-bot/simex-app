"use client";

export interface TickerEventData {
  icon: string;
  message: string;
  time?: string;
}

const DEFAULT_EVENTS: TickerEventData[] = [
  { icon: "🛒", message: "Ahmed B. de Tunis vient d'acheter 2× Charnières soft-close 110°", time: "il y a 2 min" },
  { icon: "⭐", message: "Sonia M. laisse 5 étoiles — \"Livraison ultra rapide, merci SIMEX !\"" },
  { icon: "🔥", message: "31 personnes regardent les Glissières full-extension en ce moment" },
  { icon: "🛒", message: "Mohamed K. de Sfax vient d'acheter 1× Ruban LED 5m 3000K", time: "il y a 7 min" },
  { icon: "💬", message: "\"Qualité premium, montage facile\" — Ines R., Sousse" },
  { icon: "🛒", message: "Hamdi L. de Bizerte vient d'acheter 3× Spots LED encastrés 3W", time: "il y a 11 min" },
  { icon: "⚡", message: "Flash Sale active — −30% sur les charnières avec le code SIMEX20" },
  { icon: "🛒", message: "Rania T. de Monastir vient d'acheter 1× Kit amortisseur soft-close", time: "il y a 17 min" },
  { icon: "🎁", message: "Offre bienvenue − code BIENVENU pour −10% sur votre 1ère commande" },
  { icon: "📦", message: "Commande livrée en 20h à Tunis — satisfaction client 100%" },
];

interface Props {
  events?: TickerEventData[];
}

export function LiveTicker({ events }: Props) {
  const EVENTS = events && events.length > 0 ? events : DEFAULT_EVENTS;
  const ALL = [...EVENTS, ...EVENTS];
  return (
    <div className="relative bg-[#0d0d0d] border-b border-white/5 py-2.5 overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {ALL.map((e, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 mx-8"
          >
            <span className="text-sm">{e.icon}</span>
            <span>{e.message}</span>
            {e.time && (
              <span className="text-neutral-600 ml-0.5">· {e.time}</span>
            )}
            <span className="ml-8 text-neutral-700 text-base leading-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
