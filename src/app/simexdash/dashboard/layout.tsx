"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3,
  Settings, LogOut, Truck, FolderOpen, Menu, X, ChevronRight,
  Bell, Search, Star, UserCog, Settings2, Home, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LANGS = [
  { code: "FR", label: "Français", flag: "🇫🇷" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "AR", label: "عربي", flag: "🇹🇳" },
];

function LangSwitcher({ sidebar = false }: { sidebar?: boolean }) {
  const [active, setActive] = useState("FR");
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === active)!;

  if (sidebar) {
    return (
      <div className="flex gap-1 px-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setActive(l.code)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
              active === l.code
                ? "bg-brand-red text-white shadow-lg shadow-brand-red/30"
                : "bg-white/[0.06] text-neutral-500 hover:bg-white/[0.12] hover:text-white"
            )}
          >
            <span className="text-sm leading-none">{l.flag}</span>
            <span>{l.code}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-all text-xs font-black text-neutral-700 uppercase tracking-widest"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.code}</span>
        <svg className={cn("w-3 h-3 transition-transform", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setActive(l.code); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all hover:bg-neutral-50",
                active === l.code ? "text-brand-red bg-red-50" : "text-neutral-700"
              )}
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1 text-left uppercase tracking-widest">{l.code}</span>
              {active === l.code && <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const NAV = [
  { href: "/simexdash/dashboard", icon: LayoutDashboard, label: "Tableau de bord", exact: true },
  { href: "/simexdash/dashboard/orders", icon: ShoppingCart, label: "Commandes" },
  { href: "/simexdash/dashboard/products", icon: Package, label: "Produits" },
  { href: "/simexdash/dashboard/categories", icon: FolderOpen, label: "Catégories" },
  { href: "/simexdash/dashboard/homepage", icon: Home, label: "Page d'accueil" },
  { href: "/simexdash/dashboard/content", icon: FileText, label: "Contenu CMS" },
  { href: "/simexdash/dashboard/promotions", icon: Tag, label: "Promotions" },
  { href: "/simexdash/dashboard/customers", icon: Users, label: "Clients" },
  { href: "/simexdash/dashboard/analytics", icon: BarChart3, label: "Analytiques" },
  { href: "/simexdash/dashboard/delivery", icon: Truck, label: "Livraison" },
  { href: "/simexdash/dashboard/accounts", icon: UserCog, label: "Comptes Admin" },
  { href: "/simexdash/dashboard/configurator", icon: Settings2, label: "Configurateur" },
  { href: "/simexdash/dashboard/settings", icon: Settings, label: "Paramètres" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/simexdash");
  };
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      {/* Premium Logo Header */}
      <div className="px-8 py-8 border-b border-neutral-800/50 flex items-center justify-between bg-gradient-to-br from-neutral-900 to-black">
        <Link href="/simexdash/dashboard" className="flex flex-col">
          <span className="font-black text-xl tracking-[4px] text-white leading-none">SIMEX</span>
          <span className="text-[8px] text-brand-red font-black tracking-[2px] uppercase mt-1.5 opacity-90">Dashboard Engine</span>
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

        {/* Language switcher in sidebar */}
        <div className="px-1">
          <LangSwitcher sidebar />
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
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen overflow-x-hidden">
        {/* Topbar */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-neutral-200/60 h-16 lg:h-20 flex items-center px-4 lg:px-10 sticky top-0 z-30 gap-3 lg:gap-6 shadow-sm">
          {/* Hamburger - mobile only */}
          <button
            onClick={() => setSideOpen(true)}
            className="lg:hidden w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200 transition-all border border-neutral-100 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h1 className="text-sm lg:text-lg font-black text-neutral-900 uppercase tracking-tighter leading-none truncate">{currentPage}</h1>
            <div className="hidden sm:flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">SIMEX Dashboard Engine</p>
            </div>
          </div>

          {/* Search - desktop */}
          <div className="hidden md:flex items-center bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200/80 rounded-[1.25rem] px-5 h-11 gap-3 text-sm text-neutral-400 w-64 xl:w-72 transition-all group">
            <Search className="w-4 h-4 shrink-0" />
            <span className="font-medium">Recherche globale...</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 lg:gap-4 lg:pl-4 lg:border-l lg:border-neutral-100">
            {/* Lang - desktop only (mobile: in sidebar) */}
            <LangSwitcher />

            {/* Bell */}
            <button className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-all">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-2xl bg-brand-red text-white flex items-center justify-center font-black text-xs lg:text-sm shadow-lg shadow-brand-red/20 border-2 border-white shrink-0">
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
        <main className="flex-1 overflow-x-hidden px-4 pt-6 pb-24 lg:px-10 lg:pt-8 lg:pb-10">
          {children}
        </main>

        {/* Mobile bottom quick-nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 flex items-center justify-around px-2 h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          {NAV.slice(0, 5).map(({ href, icon: Icon, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all",
                  active ? "text-brand-red" : "text-neutral-400"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", active && "scale-110")} />
                <span className="text-[9px] font-black uppercase tracking-wider leading-none">{label.split(" ")[0]}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSideOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-neutral-400"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider leading-none">Plus</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
