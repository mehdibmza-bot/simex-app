"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3,
  Settings, LogOut, Truck, FolderOpen, Menu, X, ChevronRight,
  Bell, Search, Star, UserCog, Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Tableau de bord", exact: true },
  { href: "/admin/orders", icon: ShoppingCart, label: "Commandes" },
  { href: "/admin/products", icon: Package, label: "Produits" },
  { href: "/admin/categories", icon: FolderOpen, label: "Catégories" },
  { href: "/admin/customers", icon: Users, label: "Clients" },
  { href: "/admin/promotions", icon: Tag, label: "Promotions" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytiques" },
  { href: "/admin/delivery", icon: Truck, label: "Livraison" },
  { href: "/admin/accounts", icon: UserCog, label: "Comptes Admin" },
  { href: "/admin/configurator", icon: Settings2, label: "Configurateur" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  };
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      {/* Premium Logo Header */}
      <div className="px-8 py-8 border-b border-neutral-800/50 flex items-center justify-between bg-gradient-to-br from-neutral-900 to-black">
        <Link href="/" className="flex flex-col">
          <span className="font-black text-2xl tracking-[5px] text-white leading-none">SIMEX</span>
          <span className="text-[9px] text-brand-red font-black tracking-[3px] uppercase mt-1.5 opacity-80">Industrial Engine</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all border border-neutral-800">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="px-4 py-3 text-[10px] tracking-[3px] uppercase text-neutral-600 font-black italic">Pilotage</p>
        {NAV.slice(0, 2).map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onClose}
              className={cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
                active 
                  ? "bg-brand-red text-white shadow-xl shadow-brand-red/20 scale-[1.02]" 
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-neutral-600 group-hover:text-brand-red")} />
              <span className="flex-1 tracking-tight">{label}</span>
              {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20" />}
              {!active && <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
            </Link>
          );
        })}

        <p className="px-4 pt-8 pb-3 text-[10px] tracking-[3px] uppercase text-neutral-600 font-black italic">Inventaire</p>
        {NAV.slice(2, 5).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onClose}
              className={cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
                active 
                  ? "bg-brand-red text-white shadow-xl shadow-brand-red/20 scale-[1.02]" 
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-neutral-600 group-hover:text-brand-red")} />
              <span className="flex-1 tracking-tight">{label}</span>
              {!active && <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
            </Link>
          );
        })}

        <p className="px-4 pt-8 pb-3 text-[10px] tracking-[3px] uppercase text-neutral-600 font-black italic">Croissance</p>
        {NAV.slice(5, 7).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onClose}
              className={cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
                active 
                  ? "bg-brand-red text-white shadow-xl shadow-brand-red/20 scale-[1.02]" 
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-neutral-600 group-hover:text-brand-red")} />
              <span className="flex-1 tracking-tight">{label}</span>
              {!active && <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
            </Link>
          );
        })}

        <p className="px-4 pt-8 pb-3 text-[10px] tracking-[3px] uppercase text-neutral-600 font-black italic">Configuration</p>
        {NAV.slice(7, 10).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onClose}
              className={cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
                active 
                  ? "bg-brand-red text-white shadow-xl shadow-brand-red/20 scale-[1.02]" 
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-neutral-600 group-hover:text-brand-red")} />
              <span className="flex-1 tracking-tight">{label}</span>
              {!active && <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
            </Link>
          );
        })}

        <p className="px-4 pt-8 pb-3 text-[10px] tracking-[3px] uppercase text-neutral-600 font-black italic">Système</p>
        {NAV.slice(10).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onClose}
              className={cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
                active 
                  ? "bg-brand-red text-white shadow-xl shadow-brand-red/20 scale-[1.02]" 
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-neutral-600 group-hover:text-brand-red")} />
              <span className="flex-1 tracking-tight">{label}</span>
              {!active && <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer */}
      <div className="p-4 border-t border-neutral-800/50 bg-gradient-to-t from-black to-neutral-950/80 space-y-3">
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
          <div className="w-10 h-10 rounded-2xl bg-brand-red flex items-center justify-center font-black text-sm text-white shadow-lg shadow-brand-red/30 shrink-0">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white leading-none truncate">Super Admin</p>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Simex Tunisia</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-lg shadow-emerald-500/50" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href="/" onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] text-[11px] font-black text-neutral-400 hover:text-white transition-all group uppercase tracking-wider"
          >
            <Star className="w-3.5 h-3.5 group-hover:text-brand-red transition-colors" />
            Boutique
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.06] hover:bg-red-500/20 border border-white/[0.06] hover:border-red-500/30 text-[11px] font-black text-neutral-400 hover:text-red-400 transition-all group uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sideOpen, setSideOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = NAV.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href))?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans selection:bg-brand-red/10 selection:text-brand-red">
      {/* Desktop sidebar - High Contrast Professional */}
      <aside className="w-72 fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col border-r border-neutral-200 shadow-2xl">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-md transition-opacity" onClick={() => setSideOpen(false)} />
          <div className="relative w-80 flex flex-col h-full shadow-2xl transition-transform animate-in slide-in-from-left duration-300">
            <Sidebar onClose={() => setSideOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Superior Navigation Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 h-20 flex items-center px-6 lg:px-10 sticky top-0 z-30 gap-6 shadow-sm">
          <button
            onClick={() => setSideOpen(true)}
            className="lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-brand-black transition-all border border-neutral-100 shadow-sm"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex flex-col">
            <h1 className="text-lg font-black text-neutral-900 uppercase tracking-tighter leading-none">{currentPage}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Espace Sécurisé · Admin</p>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200/80 rounded-[1.25rem] px-5 h-11 gap-3 text-sm text-neutral-400 w-72 transition-all group focus-within:ring-2 focus-within:ring-brand-red/10 focus-within:border-brand-red/30">
            <Search className="w-4 h-4 shrink-0 transition-colors group-hover:text-neutral-600" />
            <span className="font-medium">Recherche globale...</span>
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-neutral-100">
            <button className="relative w-11 h-11 rounded-2xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-brand-black transition-all border border-transparent hover:border-neutral-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-3 pl-2">
              <div className="w-11 h-11 rounded-2xl bg-brand-red text-white flex items-center justify-center font-black text-sm shadow-lg shadow-brand-red/20 border-2 border-white">
                S
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-black text-neutral-900 leading-none">Super Admin</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase mt-0.5">Simex Tunisia</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Workspace */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
