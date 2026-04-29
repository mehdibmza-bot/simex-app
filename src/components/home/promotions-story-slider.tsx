"use client";

import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX, Copy, Check, ChevronLeft, ChevronRight, Zap, Tag, Gift, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Color themes for story cards
const THEMES: Record<string, { bg: string; card: string; accent: string }> = {
  red:     { bg: "from-red-600 via-rose-700 to-red-900",   card: "border-red-400/30",   accent: "bg-red-500" },
  purple:  { bg: "from-purple-600 via-violet-700 to-purple-900", card: "border-purple-400/30", accent: "bg-purple-500" },
  blue:    { bg: "from-blue-600 via-cyan-600 to-blue-900", card: "border-blue-400/30",   accent: "bg-blue-500" },
  amber:   { bg: "from-amber-500 via-orange-600 to-amber-800", card: "border-amber-400/30", accent: "bg-amber-500" },
  emerald: { bg: "from-emerald-500 via-teal-600 to-emerald-900", card: "border-emerald-400/30", accent: "bg-emerald-500" },
  dark:    { bg: "from-neutral-700 via-neutral-800 to-black", card: "border-neutral-500/30", accent: "bg-neutral-600" },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  flash: Zap, happy_hour: Zap, bundle: Gift, tier: Tag, coupon: Tag,
};

function timeLeft(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Expiré";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 48) return `${Math.floor(h / 24)}j restants`;
  if (h > 0) return `${h}h ${m}m restant`;
  return `${m}m restant`;
}

interface Promotion {
  id: string;
  code: string;
  type: string;
  value: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  description?: string;
  bannerVideoUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerCta?: string;
  bannerColor?: string;
}

function StoryCard({ promo, onClick }: { promo: Promotion; onClick: () => void }) {
  const theme = THEMES[promo.bannerColor || "red"];
  const Icon = TYPE_ICONS[promo.type] || Zap;

  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 w-40 h-64 sm:w-44 sm:h-72 rounded-[1.5rem] overflow-hidden shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Video background */}
      {promo.bannerVideoUrl ? (
        <video
          src={promo.bannerVideoUrl}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-b", theme.bg)} />
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Shine on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/10 to-transparent transition-opacity duration-500" />

      {/* Animated ring (story-style) */}
      <div className={cn(
        "absolute inset-0 rounded-[1.5rem] ring-2 ring-offset-2 ring-offset-transparent transition-all duration-300",
        promo.isActive ? "ring-white/60 group-hover:ring-white" : "ring-neutral-500/40"
      )} />

      {/* Top - Type badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider", theme.accent)}>
          <Icon className="w-3 h-3" />
          {promo.type.replace("_", " ")}
        </div>
        {!promo.isActive && (
          <span className="px-2 py-1 rounded-full bg-black/60 text-[9px] font-black text-neutral-400 uppercase">Inactif</span>
        )}
      </div>

      {/* Center - Big discount */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-1">
        <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-2xl leading-none">
          -{promo.value}%
        </span>
        {promo.bannerTitle && (
          <span className="text-xs font-black text-white/80 uppercase tracking-widest text-center px-4 line-clamp-2 mt-1">
            {promo.bannerTitle}
          </span>
        )}
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
        {promo.bannerSubtitle && (
          <p className="text-[10px] text-white/70 font-semibold mb-1 line-clamp-1">{promo.bannerSubtitle}</p>
        )}
        <div className="flex items-center justify-between gap-1">
          <div className="font-mono text-white font-black text-xs bg-white/15 backdrop-blur-sm px-2 py-1 rounded-lg truncate max-w-[80px]">
            {promo.code}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-white/60 font-semibold">
            <Clock className="w-3 h-3" />
            <span>{timeLeft(promo.endsAt)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function StoryModal({ promos, startIndex, onClose }: { promos: Promotion[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const promo = promos[idx];
  const theme = THEMES[promo?.bannerColor || "red"];
  const Icon = TYPE_ICONS[promo?.type] || Zap;

  // Auto-advance without video: 8 seconds
  useEffect(() => {
    setProgress(0);
    setCopied(false);

    if (!promo?.bannerVideoUrl) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      const start = Date.now();
      const duration = 8000;
      progressInterval.current = setInterval(() => {
        const p = Math.min(((Date.now() - start) / duration) * 100, 100);
        setProgress(p);
        if (p >= 100) {
          clearInterval(progressInterval.current!);
          if (idx < promos.length - 1) setIdx(i => i + 1);
          else onClose();
        }
      }, 50);
    }

    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [idx]);

  // Video progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !promo?.bannerVideoUrl) return;
    v.muted = true;
    v.play().catch(() => {});
    const onTime = () => setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    const onEnd = () => {
      if (idx < promos.length - 1) setIdx(i => i + 1);
      else onClose();
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnd); };
  }, [idx]);

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && idx < promos.length - 1) setIdx(i => i + 1);
      if (e.key === "ArrowLeft" && idx > 0) setIdx(i => i - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx, onClose, promos.length]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(promo.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!promo) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-sm h-[92vh] max-h-[800px] rounded-[2rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Background */}
        {promo.bannerVideoUrl ? (
          <video ref={videoRef} src={promo.bannerVideoUrl} muted={muted} loop={false} playsInline className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-b", theme.bg)} />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/60 pointer-events-none" />

        {/* Progress bars - one per story */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
          {promos.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{ width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%" }}
              />
            </div>
          ))}
        </div>

        {/* Top bar */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
          <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-wider", theme.accent)}>
            <Icon className="w-3.5 h-3.5" />
            <span>SIMEX · Offre Spéciale</span>
          </div>
          <div className="flex items-center gap-2">
            {promo.bannerVideoUrl && (
              <button
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  const nm = !muted;
                  v.muted = nm;
                  if (!nm) v.volume = volume;
                  setMuted(nm);
                }}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all border border-white/10"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all border border-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side nav */}
        {idx > 0 && (
          <button onClick={() => setIdx(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all border border-white/10">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {idx < promos.length - 1 && (
          <button onClick={() => setIdx(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all border border-white/10">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8 gap-3 pointer-events-none">
          <div className="text-center">
            <p className="text-white/60 text-sm font-bold uppercase tracking-[4px] mb-2">Économisez</p>
            <p className="text-8xl font-black text-white drop-shadow-2xl leading-none">-{Math.round(Number(promo.value))}%</p>
            <p className="text-white font-black text-xl tracking-wider mt-3">
              {promo.bannerTitle || promo.description || "Offre limitée"}
            </p>
            {promo.bannerSubtitle && (
              <p className="text-white/60 text-sm mt-1">{promo.bannerSubtitle}</p>
            )}
          </div>
        </div>

        {/* Bottom card */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
          <div className="bg-white/10 backdrop-blur-2xl rounded-[1.5rem] border border-white/20 p-5 space-y-3">
            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-white/70 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft(promo.endsAt)}</span>
            </div>

            {/* Code */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="font-mono font-black text-white text-lg tracking-[4px]">{promo.code}</span>
              </div>
              <button
                onClick={copyCode}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all font-black text-sm shadow-lg",
                  copied
                    ? "bg-emerald-500 text-white shadow-emerald-500/40"
                    : "bg-white text-black hover:bg-neutral-100 shadow-white/20"
                )}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={copyCode}
              className={cn(
                "w-full h-12 rounded-xl font-black text-sm text-white uppercase tracking-widest transition-all shadow-lg",
                theme.accent, "hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              {copied ? "✓ Code copié !" : (promo.bannerCta || "Copier & Profiter")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  promotions?: Promotion[];
}

export function PromotionsStorySlider({ promotions = [] }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = promotions.filter(p => p.isActive && new Date(p.endsAt) > new Date());
  if (active.length === 0) return null;

  return (
    <section className="py-10 bg-brand-black overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-brand-red text-xs font-black uppercase tracking-[4px]">Live</span>
            </div>
            <h2 className="display text-3xl text-white font-black uppercase tracking-tight">Offres Flash</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story cards row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
        >
          {active.map((promo, i) => (
            <div key={promo.id} className="snap-start">
              <StoryCard promo={promo} onClick={() => setActiveIdx(i)} />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "rounded-full transition-all",
                activeIdx === i ? "w-6 h-1.5 bg-brand-red" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </div>

      {/* Story modal */}
      {activeIdx !== null && (
        <StoryModal
          promos={active}
          startIndex={activeIdx}
          onClose={() => setActiveIdx(null)}
        />
      )}
    </section>
  );
}
