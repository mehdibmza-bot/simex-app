"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/store";

export function Logo({ className }: { className?: string; dark?: boolean }) {
  const theme = useTheme((s) => s.theme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isPearl = mounted && theme === "pearl";

  return (
    <Link href="/" className={cn("flex items-center group", className)}>
      <div
        className={cn(
          "relative h-12 w-[190px] transition-all duration-300",
          "group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_12px_rgba(225,37,42,0.45)]"
        )}
      >
        <Image
          src={isPearl ? "/Logosimex.png" : "/Simexlogo.png"}
          alt="SIMEX Furniture Hardware"
          fill
          sizes="200px"
          className="object-contain object-left"
          priority
        />
      </div>
    </Link>
  );
}
