"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dictionaries, type Lang, type Dict } from "@/data/i18n-dictionaries";

interface I18nState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict) => string;
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: "fr",
      setLang: (lang) => {
        set({ lang });
        if (typeof document !== "undefined") {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        }
      },
      t: (key) => dictionaries[get().lang][key] ?? String(key),
    }),
    {
      name: "simex-lang",
      // New visitors always start in French; only persist if they actively switch
      merge: (persisted: unknown, current) => {
        const saved = persisted as Partial<I18nState> | null;
        if (!saved?.lang) return current;
        return { ...current, lang: saved.lang };
      },
    }
  )
);

export type { Lang };
