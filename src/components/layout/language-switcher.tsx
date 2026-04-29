"use client";

import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex bg-neutral-900 rounded-full p-[3px]">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={cn(
            "px-2.5 py-1 text-[11px] font-bold rounded-full transition-all tracking-wider",
            lang === l.code ? "bg-brand-red text-white" : "text-neutral-400 hover:text-white"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
