"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  sku: string;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((x) => x.id === item.id);
          if (existing) {
            return {
              items: state.items.map((x) =>
                x.id === item.id ? { ...x, qty: x.qty + qty } : x
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((x) => x.id !== id)
              : state.items.map((x) => (x.id === id ? { ...x, qty } : x)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, x) => s + x.qty, 0),
      subtotal: () => get().items.reduce((s, x) => s + x.price * x.qty, 0),
    }),
    { name: "simex-cart" }
  )
);

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface WishlistState {
  ids: string[]; // kept for backward-compat badge count
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.ids.includes(item.id);
          return {
            ids: exists ? state.ids.filter((x) => x !== item.id) : [...state.ids, item.id],
            items: exists ? state.items.filter((x) => x.id !== item.id) : [...state.items, item],
          };
        }),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [], items: [] }),
    }),
    { name: "simex-wishlist" }
  )
);

interface UIState {
  cartOpen: boolean;
  wishlistOpen: boolean;
  authOpen: boolean;
  searchOpen: boolean;
  toast: { msg: string; icon?: string } | null;
  setCart: (v: boolean) => void;
  setWishlist: (v: boolean) => void;
  setAuth: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  showToast: (msg: string, icon?: string) => void;
  hideToast: () => void;
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  authOpen: false,
  searchOpen: false,
  toast: null,
  setCart: (v) => set({ cartOpen: v }),
  setWishlist: (v) => set({ wishlistOpen: v }),
  setAuth: (v) => set({ authOpen: v }),
  setSearch: (v) => set({ searchOpen: v }),
  showToast: (msg, icon = "✓") => {
    set({ toast: { msg, icon } });
    setTimeout(() => set({ toast: null }), 2800);
  },
  hideToast: () => set({ toast: null }),
}));

// ---------------------------------------------------------------------------
// Discount / coupon store
// ---------------------------------------------------------------------------

export interface CouponState {
  code: string | null;
  promoId: string | null;
  discountType: "pct" | null;
  discountValue: number;
  label: string | null;
  apply: (code: string) => Promise<{ ok: boolean; msg: string }>;
  remove: () => void;
  compute: (subtotal: number) => number; // returns amount saved
}

export const useCoupon = create<CouponState>((set, get) => ({
  code: null,
  promoId: null,
  discountType: null,
  discountValue: 0,
  label: null,
  apply: async (raw) => {
    try {
      const res = await fetch("/api/promo/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: raw.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!data.ok) return { ok: false, msg: data.msg };
      set({ code: data.promo.code, promoId: data.promo.id, discountType: "pct", discountValue: data.promo.value, label: data.promo.label });
      return { ok: true, msg: data.msg };
    } catch {
      return { ok: false, msg: "Erreur réseau, réessayez." };
    }
  },
  remove: () => set({ code: null, promoId: null, discountType: null, discountValue: 0, label: null }),
  compute: (subtotal) => {
    const { discountType, discountValue } = get();
    if (!discountType) return 0;
    return Math.round(subtotal * discountValue) / 100;
  },
}));

// ---------------------------------------------------------------------------
// Theme store
// ---------------------------------------------------------------------------

interface ThemeState {
  theme: "dark" | "pearl";
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => set({ theme: get().theme === "dark" ? "pearl" : "dark" }),
    }),
    { name: "simex-theme" }
  )
);
