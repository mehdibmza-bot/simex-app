"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Percent, Truck, PhoneCall } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export interface ProBannerPerk { icon: string; label: string; sub: string; }
export interface ProBannerData {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  whatsappNumber?: string;
  perks?: ProBannerPerk[];
}

const DEFAULT_PERKS = [
  { icon: "Percent", label: "Remises jusqu'à −25%", sub: "sur toutes les commandes pro" },
  { icon: "Truck",   label: "Livraison prioritaire",  sub: "express 24h partout en Tunisie" },
  { icon: "PhoneCall", label: "Conseiller dédié",    sub: "disponible 7j/7 par WhatsApp" },
  { icon: "BadgeCheck", label: "Accès catalogue complet", sub: "+5 000 références pro" },
];

const LOGOS = [
  { name: "Hettich",   bg: "bg-neutral-900" },
  { name: "Grass",     bg: "bg-neutral-900" },
  { name: "Blum",      bg: "bg-neutral-900" },
  { name: "Salice",    bg: "bg-neutral-900" },
  { name: "Häfele",    bg: "bg-neutral-900" },
];

const ICON_MAP: Record<string, any> = { Percent, Truck, PhoneCall, BadgeCheck };

export function ProBanner({ cms }: { cms?: ProBannerData }) {
  const perks = cms?.perks
    ? cms.perks.map((p) => ({ ...p, iconComp: ICON_MAP[p.icon] ?? BadgeCheck }))
    : DEFAULT_PERKS.map((p) => ({ ...p, iconComp: ICON_MAP[p.icon] ?? BadgeCheck }));
  return (
    <section className="relative py-24 bg-brand-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-red/5 to-transparent" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/30 text-brand-gold rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
                ⭐ Espace Professionnel
              </div>
              <h2 className="display text-5xl md:text-7xl text-white leading-[0.92] mb-6">
                {cms?.title ?? "Vous êtes"}{" "}
                <span
                  className="text-stroke"
                  style={{ WebkitTextStroke: "2px #D4A24C", color: "transparent" }}
                >
                  {cms?.title ? "" : "pro ?"}
                </span>
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-8 max-w-md">
                {cms?.description ?? "Menuisiers, architectes d'intérieur, décorateurs — rejoignez le réseau SIMEX Pro et accédez à des tarifs exclusifs, des stocks réservés et un service sur-mesure."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={cms?.ctaLink ?? "/pro"}
                  className="group inline-flex items-center gap-2 bg-brand-gold text-brand-black font-black text-sm uppercase tracking-wider px-7 py-3.5 rounded-full hover:bg-amber-400 transition-all"
                >
                  {cms?.ctaText ?? "Rejoindre l'Espace Pro"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`https://wa.me/${(cms?.whatsappNumber ?? "21697730083").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/15 text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:border-white/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  Contacter un conseiller
                </a>
              </div>
            </Reveal>

            {/* Partner brands marquee */}
            <Reveal delay={200}>
              <div className="mt-10 pt-8 border-t border-white/8">
                <p className="text-xs text-neutral-600 uppercase tracking-widest mb-4">
                  Marques distribuées
                </p>
                <div className="flex items-center gap-4 overflow-hidden">
                  {LOGOS.map((l) => (
                    <div
                      key={l.name}
                      className={`${l.bg} border border-white/8 rounded-xl px-5 py-2.5 text-white/60 text-sm font-bold tracking-wide shrink-0 hover:text-white hover:border-white/20 transition-colors`}
                    >
                      {l.name}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — perks grid */}
          <div className="grid grid-cols-2 gap-4">
            {perks.map(({ iconComp: Icon, label, sub }, i) => (
              <Reveal key={label} delay={i * 80} direction="scale">
                <div className="glow-hover bg-white/4 border border-white/8 rounded-2xl p-6 hover:bg-white/7 transition-colors h-full">
                  <div className="w-11 h-11 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">{label}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
