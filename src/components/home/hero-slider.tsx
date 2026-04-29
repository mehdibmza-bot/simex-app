"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// i18n fallback slides (used when no DB slides available)
const I18N_SLIDES = [
  {
    eb: "s1_eb", t1: "s1_t1", t2: "s1_t2", t3: "s1_t3", desc: "s1_desc", b1: "s1_b1", b2: "s1_b2",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&auto=format&fit=crop",
    b1Href: "/products", b2Href: "/builder",
  },
  {
    eb: "s2_eb", t1: "s2_t1", t2: "s2_t2", t3: "s2_t3", desc: "s2_desc", b1: "s2_b1", b2: "s2_b2",
    image: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1600&q=80&auto=format&fit=crop",
    b1Href: "/products", b2Href: "/builder",
  },
  {
    eb: "s3_eb", t1: "s3_t1", t2: "s3_t2", t3: "s3_t3", desc: "s3_desc", b1: "s3_b1", b2: "s3_b2",
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1600&q=80&auto=format&fit=crop",
    b1Href: "/products", b2Href: "/builder",
  },
] as const;

export interface SlideData {
  id: string; eyebrow: string; titleLine1: string; titleLine2: string; titleLine3: string;
  description: string; imageUrl: string; btn1Label: string; btn1Href: string; btn2Label: string; btn2Href: string;
}

interface Props { slides?: SlideData[] }

export function HeroSlider({ slides }: Props) {
  const t = useI18n((s) => s.t);
  const [index, setIndex] = useState(0);

  const hasDbSlides = slides && slides.length > 0;
  const count = hasDbSlides ? slides.length : I18N_SLIDES.length;

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6500);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className="relative bg-brand-black text-white overflow-hidden">
      <div className="relative h-[640px] lg:h-[720px]">
        {hasDbSlides ? (
          // DB-managed slides
          slides.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.imageUrl})` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/80 to-brand-black/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(225,37,42,0.15),transparent_50%)]" />
              </div>
              <div className="relative container h-full flex items-center">
                <div className="max-w-2xl">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-bold tracking-widest uppercase mb-6">
                    {s.eyebrow}
                  </span>
                  <h1 className="display text-[64px] sm:text-[80px] lg:text-[110px] leading-[0.92] mb-6">
                    {s.titleLine1}<br />
                    <span className="text-brand-red">{s.titleLine2}</span><br />
                    {s.titleLine3}
                  </h1>
                  <p className="text-base lg:text-lg text-neutral-300 mb-8 max-w-xl leading-relaxed">{s.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg"><Link href={s.btn1Href}>{s.btn1Label}</Link></Button>
                    <Button asChild size="lg" variant="ghost">
                      <Link href={s.btn2Href}><Play className="w-4 h-4 mr-2" />{s.btn2Label}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // i18n fallback slides
          I18N_SLIDES.map((s, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/80 to-brand-black/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(225,37,42,0.15),transparent_50%)]" />
              </div>
              <div className="relative container h-full flex items-center">
                <div className="max-w-2xl">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-bold tracking-widest uppercase mb-6">
                    {t(s.eb as any)}
                  </span>
                  <h1 className="display text-[64px] sm:text-[80px] lg:text-[110px] leading-[0.92] mb-6">
                    {t(s.t1 as any)}<br />
                    <span className="text-brand-red">{t(s.t2 as any)}</span><br />
                    {t(s.t3 as any)}
                  </h1>
                  <p className="text-base lg:text-lg text-neutral-300 mb-8 max-w-xl leading-relaxed">{t(s.desc as any)}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg"><Link href="/products">{t(s.b1 as any)}</Link></Button>
                    <Button asChild size="lg" variant="ghost">
                      <Link href="/builder"><Play className="w-4 h-4 mr-2" />{t(s.b2 as any)}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-1 rounded-full transition-all",
                i === index ? "w-10 bg-brand-red" : "w-6 bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
