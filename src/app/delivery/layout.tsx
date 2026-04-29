"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Truck, LogOut, Menu, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { useRouter } from "next/navigation";

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/simexdash");
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="px-8 py-8 border-b border-neutral-800/50 flex items-center justify-between bg-gradient-to-br from-neutral-900 to-black">
        <div className="flex flex-col">
          <span className="font-black text-2xl tracking-[5px] text-white leading-none">SIMEX</span>
          <span className="text-[9px] text-amber-500 font-black tracking-[3px] uppercase mt-1.5 opacity-80">Agent Livraison</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all border border-neutral-800">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
        <p className="px-4 pb-3 text-[10px] tracking-[3px] uppercase text-neutral-600 font-black italic">Mes Tournées</p>
        <Link
          href="/delivery"
          onClick={onClose}
          className={cn(
            "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
            pathname === "/delivery" || pathname.startsWith("/delivery/orders")
              ? "bg-amber-500 text-white shadow-xl shadow-amber-500/20 scale-[1.02]"
              : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
          )}
        >
          <Truck
            className={cn(
              "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
              pathname === "/delivery" || pathname.startsWith("/delivery/orders")
                ? "text-white"
                : "text-neutral-600 group-hover:text-amber-500"
            )}
          />
          <span className="flex-1 tracking-tight">Mes Commandes</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800/50 bg-gradient-to-t from-black to-neutral-950/80 space-y-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-amber-500/30 shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white leading-none truncate">Agent Livraison</p>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Simex Tunisia</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-lg shadow-emerald-500/50" />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.06] hover:bg-red-500/20 border border-white/[0.06] hover:border-red-500/30 text-[11px] font-black text-neutral-400 hover:text-red-400 transition-all group uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const [sideOpen, setSideOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">
      {/* Desktop sidebar */}
      <aside className="w-72 fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col border-r border-neutral-200 shadow-2xl">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-md" onClick={() => setSideOpen(false)} />
          <div className="relative w-80 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar onClose={() => setSideOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 h-20 flex items-center px-6 lg:px-10 sticky top-0 z-30 gap-6 shadow-sm">
          <button
            onClick={() => setSideOpen(true)}
            className="lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-all border border-neutral-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex flex-col">
            <h1 className="text-lg font-black text-neutral-900 uppercase tracking-tighter leading-none">Mes Commandes</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Espace Agent · Livraison</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-11 h-11 rounded-2xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-all border border-transparent hover:border-neutral-100">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-amber-500/20 border-2 border-white">
              A
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
