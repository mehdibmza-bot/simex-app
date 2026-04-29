"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, Plus, Minus, MapPin, Clock, RotateCcw, CreditCard, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ICONS = [Clock, MapPin, RotateCcw, MapPin, CreditCard];

export interface FaqItemData {
  id?: string;
  question: string;
  answer: string;
}

export function Faq({ faqItems }: { faqItems?: FaqItemData[] }) {
  const t = useI18n((s) => s.t);
  const [open, setOpen] = useState<number | null>(null);

  const i18nItems = [
    { q: "fq1", a: "fa1" },
    { q: "fq2", a: "fa2" },
    { q: "fq3", a: "fa3" },
    { q: "fq4", a: "fa4" },
    { q: "fq5", a: "fa5" },
  ] as const;

  const resolvedItems: FaqItemData[] =
    faqItems && faqItems.length > 0
      ? faqItems
      : i18nItems.map((x) => ({ question: t(x.q), answer: t(x.a) }));

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section id="faq" className="relative py-28 bg-brand-black overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-red/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-red/3 blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-20 items-start">

          {/* ── Left column ── */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase">{t("f_eb")}</span>
            </div>

            <h2 className="display text-5xl md:text-7xl text-white leading-[0.9] mb-6">
              {t("f_t").split(" ").slice(0, -1).join(" ")}
              <br />
              <span className="text-stroke" style={{ WebkitTextStroke: "2px #E1252A", color: "transparent" }}>
                {t("f_t").split(" ").slice(-1)[0]}
              </span>
            </h2>

            <p className="text-neutral-400 leading-relaxed mb-10 max-w-sm">{t("f_p")}</p>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {[
                { val: "24h", label: "Grand Tunis" },
                { val: "48h", label: "Reste du pays" },
                { val: "14j", label: "Retours gratuits" },
                { val: "7/7", label: "Support client" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 border border-white/8 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <div className="display text-3xl text-white mb-0.5">{s.val}</div>
                  <div className="text-xs text-neutral-500">{s.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/account"
              className="group inline-flex items-center gap-3 bg-brand-red text-white text-sm font-bold uppercase tracking-wider px-7 py-3.5 rounded-full hover:bg-red-700 transition-all hover:gap-4"
            >
              <Truck className="w-4 h-4" />
              {t("f_cta")}
            </Link>

            {/* WhatsApp nudge */}
            <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Une autre question ?{" "}
                <a
                  href="https://wa.me/21697730083"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  WhatsApp →
                </a>
              </span>
            </div>
          </div>

          {/* ── Right column — accordion ── */}
          <div className="space-y-2">
            {resolvedItems.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              const isOpen = open === i;
              return (
                <div
                  key={item.id ?? i}
                  className={cn(
                    "group rounded-2xl border transition-all duration-300 overflow-hidden",
                    isOpen
                      ? "bg-white border-white/10 shadow-2xl shadow-black/40"
                      : "bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/15"
                  )}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    {/* Icon bubble */}
                    <div
                      className={cn(
                        "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
                        isOpen ? "bg-brand-red text-white" : "bg-white/10 text-neutral-400 group-hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Question */}
                    <span
                      className={cn(
                        "flex-1 text-sm font-semibold leading-snug transition-colors duration-300",
                        isOpen ? "text-brand-black" : "text-white/90"
                      )}
                    >
                      {item.question}
                    </span>

                    {/* Toggle icon */}
                    <div
                      className={cn(
                        "shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300",
                        isOpen
                          ? "border-brand-red bg-brand-red text-white rotate-0"
                          : "border-white/20 text-neutral-400 group-hover:border-white/40 group-hover:text-white"
                      )}
                    >
                      {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pl-20 text-sm text-neutral-500 leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
