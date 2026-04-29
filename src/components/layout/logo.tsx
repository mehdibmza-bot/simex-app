import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, dark = true }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center group", className)}>
      <div
        className={cn(
          "relative transition-all duration-300",
          "group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_12px_rgba(225,37,42,0.45)]",
          dark
            ? "h-12 w-[190px]"
            : "bg-[#0a0a0a] rounded-xl px-3 py-1.5 h-14 w-[200px] shadow-lg"
        )}
      >
        <Image
          src="/Simexlogo.png"
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
