"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUI } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const POPULAR = [
  "charnière clip-on",
  "glissière 450mm",
  "poignée noire",
  "ruban LED 5m",
  "vis confiat",
  "amortisseur tiroir",
];

export function SearchDialog() {
  const t = useI18n((s) => s.t);
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearch);
  const [q, setQ] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden top-[15%] translate-y-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_ph")}
            className="flex-1 outline-none text-base bg-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && q.trim()) {
                window.location.href = `/products?q=${encodeURIComponent(q.trim())}`;
              }
            }}
          />
          <kbd className="text-[10px] bg-neutral-100 px-2 py-1 rounded font-mono">ESC</kbd>
        </div>
        <div className="p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            {t("sm_pop")}
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((p) => (
              <Link
                key={p}
                href={`/products?q=${encodeURIComponent(p)}`}
                onClick={() => setOpen(false)}
                className="px-3.5 py-1.5 rounded-full bg-brand-cream text-sm hover:bg-brand-black hover:text-white transition-colors"
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
