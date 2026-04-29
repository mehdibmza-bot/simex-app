"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, User, Search, Menu, X, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { useUI, useCart, useWishlist } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DEFAULT_NAV_LINKS = [
  { href: "/products", label: "Tous les produits", emoji: "🛒" },
  { href: "/products?cat=charnieres", label: "Charnières", emoji: "🔩" },
  { href: "/products?cat=glissieres", label: "Glissières", emoji: "📦" },
  { href: "/products?cat=poignees", label: "Poignées", emoji: "🚩" },
  { href: "/products?cat=led", label: "Éclairage LED", emoji: "💡" },
  { href: "/products?cat=vis", label: "Vis & fixations", emoji: "🔧" },
  { href: "/products?cat=cuisine", label: "Cuisine", emoji: "🍽️" },
  { href: "/products?cat=dressing", label: "Dressing", emoji: "👗" },
  { href: "/builder", label: "Configurateur", emoji: "⚙️", highlight: true },
  { href: "/pro", label: "★ Espace Pro", emoji: "👷", pro: true },
];

export interface NavLink { href: string; label: string; labelEn?: string; labelAr?: string; emoji?: string; highlight?: boolean; pro?: boolean; }

function IconBtn({
  onClick,
  count,
  children,
  label,
}: {
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white hover:bg-neutral-900 hover:text-brand-red transition-all"
    >
      {children}
      {!!count && count > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-black">
          {count}
        </span>
      )}
    </button>
  );
}

function MobileMenu({
  open, onClose, onSearch, navLinks, phone,
}: {
  open: boolean; onClose: () => void; onSearch: () => void;
  navLinks?: NavLink[]; phone?: string;
}) {
  const t = useI18n((s) => s.t);
  const lang = useI18n((s) => s.lang);
  const links = navLinks ?? DEFAULT_NAV_LINKS;
  const tel = phone ?? "+216 97 730 083";
  const waNum = tel.replace(/[^0-9]/g, "");

  const getLabel = (l: NavLink) => {
    if (lang === "en") return l.labelEn ?? l.label;
    if (lang === "ar") return l.labelAr ?? l.label;
    return l.label;
  };

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[85vw] max-w-[340px] z-50 bg-[#0a0a0a] flex flex-col",
          "transition-transform duration-300 ease-out shadow-[4px_0_40px_rgba(0,0,0,0.6)]",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <Logo dark className="h-10" />
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="w-9 h-9 rounded-lg bg-neutral-900 text-neutral-400 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-4">
          <button
            onClick={() => { onClose(); onSearch(); }}
            className="w-full h-11 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm flex items-center px-4 gap-3 hover:border-brand-red transition-colors"
          >
            <Search className="w-4 h-4 shrink-0 text-brand-red" />
            <span className="flex-1 text-left truncate">{t("search_ph")}</span>
          </button>
        </div>

        {/* Nav links — scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          <p className="px-3 py-2 text-[10px] tracking-[2px] uppercase text-neutral-600 font-semibold">Navigation</p>
          <ul className="flex flex-col gap-0.5">
            {links.map((link) => {
              const { href, emoji, highlight, pro } = link;
              const label = getLabel(link);
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                    pro
                      ? "text-brand-gold hover:bg-brand-gold/10"
                      : highlight
                      ? "text-brand-red hover:bg-brand-red/10"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  )}
                >
                  <span className="text-base w-6 text-center">{emoji}</span>
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            )})}
          </ul>

          {/* Divider */}
          <div className="h-px bg-neutral-800 my-4 mx-3" />

          {/* Promos quick links */}
          <p className="px-3 py-2 text-[10px] tracking-[2px] uppercase text-neutral-600 font-semibold">Offres</p>
          <div className="flex flex-col gap-0.5">
            <Link href="/products?promo=1" onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-all group"
            >
              <span className="text-base w-6 text-center">🏷️</span>
              <span className="flex-1">Promotions</span>
              <span className="bg-brand-red text-white text-[10px] px-2 py-0.5 rounded-full font-bold">HOT</span>
            </Link>
            <Link href="/products?new=1" onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-all group"
            >
              <span className="text-base w-6 text-center">✨</span>
              <span className="flex-1">Nouveautés</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>
          </div>
        </nav>

        {/* Bottom contact strip */}
        <div className="border-t border-neutral-800 px-5 py-4 flex flex-col gap-2.5">
          <a href={`tel:${tel.replace(/\s/g,"")}`}
            className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-brand-red" />
            </span>
            {tel}
          </a>
          <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5b] rounded-xl px-4 py-2.5 transition-colors justify-center"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

export function Header({ navLinks, phone }: { navLinks?: NavLink[]; phone?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.ids.length);
  const t = useI18n((s) => s.t);
  const { setCart, setWishlist, setAuth, setSearch } = useUI();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "bg-brand-black text-white sticky top-0 z-40 border-b border-neutral-900 transition-shadow",
          scrolled && "shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        )}
      >
        <div className="container">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8 h-[68px] md:h-20 lg:h-[84px]">

            {/* Left: hamburger (mobile) + logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Ouvrir le menu"
                className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center text-white hover:bg-neutral-900 hover:text-brand-red transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Logo />
            </div>

            {/* Center: search bar (desktop only) */}
            <div className="hidden md:block max-w-xl w-full justify-self-center">
              <button
                onClick={() => setSearch(true)}
                className="w-full h-12 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm flex items-center px-5 hover:border-brand-red transition-colors"
              >
                <span className="flex-1 text-left">{t("search_ph")}</span>
                <span className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center text-white">
                  <Search className="w-4 h-4" />
                </span>
              </button>
            </div>

            {/* Right: icons */}
            <div className="flex items-center gap-0.5 md:gap-1">
              {/* Search icon mobile only */}
              <IconBtn onClick={() => setSearch(true)} label="Rechercher">
                <Search className="w-5 h-5 md:hidden" />
                <span className="hidden md:block" />
              </IconBtn>
              <IconBtn onClick={() => setAuth(true)} label="Mon compte">
                <User className="w-5 h-5" />
              </IconBtn>
              <IconBtn onClick={() => setWishlist(true)} count={mounted ? wishCount : 0} label="Wishlist">
                <Heart className="w-5 h-5" />
              </IconBtn>
              <IconBtn onClick={() => setCart(true)} count={mounted ? cartCount : 0} label="Panier">
                <ShoppingBag className="w-5 h-5" />
              </IconBtn>
            </div>

          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSearch={() => setSearch(true)}
        navLinks={navLinks}
        phone={phone}
      />
    </>
  );
}
