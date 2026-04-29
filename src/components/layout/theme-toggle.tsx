"use client";

import { useEffect, useState } from "react";
import { Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isPearl = theme === "pearl";

  if (compact) {
    // Small icon-only button for header (mobile-friendly)
    return (
      <button
        onClick={toggleTheme}
        aria-label={isPearl ? "Mode Sombre" : "Mode Pearl"}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200",
          isPearl
            ? "bg-[#EDE9E3] border-[#D5CFC6] text-[#1C1917] hover:bg-[#E2DDD5]"
            : "bg-neutral-900 border-neutral-800 text-amber-200 hover:border-amber-300/50 hover:bg-neutral-800"
        )}
      >
        {isPearl ? <Moon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </button>
    );
  }

  // Full pill toggle for topbar
  return (
    <button
      onClick={toggleTheme}
      aria-label={isPearl ? "Passer en mode sombre" : "Passer en mode Pearl"}
      className={cn(
        "group flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border transition-all duration-200",
        isPearl
          ? "bg-[#1C1917] border-[#3C3733] text-neutral-300 hover:text-white hover:border-neutral-500"
          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-amber-300/40"
      )}
    >
      {isPearl ? (
        <>
          <Moon className="w-3 h-3 shrink-0" />
          <span>SOMBRE</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3 h-3 shrink-0 text-amber-300" />
          <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all">
            PEARL
          </span>
        </>
      )}
    </button>
  );
}
