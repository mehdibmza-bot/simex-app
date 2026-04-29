"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useUI } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Newsletter({ title, subtitle }: { title?: string; subtitle?: string }) {
  const t = useI18n((s) => s.t);
  const showToast = useUI((s) => s.showToast);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => null);
      showToast(t("toast_news"), "📧");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-brand-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-red blur-[160px]" />
      </div>
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex w-14 h-14 rounded-full bg-brand-red items-center justify-center mb-6 shadow-red">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="display text-4xl md:text-6xl mb-4">{title ?? t("n_t")}</h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto leading-relaxed">{subtitle ?? t("n_p")}</p>
          <form
            onSubmit={submit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("n_ph")}
              className="flex-1 h-13 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-red transition-colors"
            />
            <Button type="submit" disabled={loading} size="lg" className="rounded-full px-8">
              {loading ? "..." : t("n_btn")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
