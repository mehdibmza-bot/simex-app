"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, Tag, X, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, useUI, useCoupon } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer() {
  const t = useI18n((s) => s.t);
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCart);
  const showToast = useUI((s) => s.showToast);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const couponCode = useCoupon((s) => s.code);
  const couponLabel = useCoupon((s) => s.label);
  const applyCoupon = useCoupon((s) => s.apply);
  const removeCoupon = useCoupon((s) => s.remove);
  const compute = useCoupon((s) => s.compute);

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [canUseCoupon, setCanUseCoupon] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        const isAuthed = !!data?.authenticated;
        setCanUseCoupon(isAuthed);
        if (!isAuthed) {
          removeCoupon();
        }
      } catch {
        if (!active) return;
        setCanUseCoupon(false);
        removeCoupon();
      }
    })();
    return () => {
      active = false;
    };
  }, [removeCoupon]);

  const saved = compute(subtotal);
  const total = Math.max(0, subtotal - saved);

  const handleApplyCoupon = async () => {
    if (!canUseCoupon) {
      setCouponError("Connectez-vous pour appliquer un code promo.");
      return;
    }
    const result = await applyCoupon(couponInput);
    if (result.ok) {
      setCouponInput("");
      setCouponError("");
      showToast(result.msg, "🏷️");
    } else {
      setCouponError(result.msg);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-5 py-4 bg-brand-black text-white">
          <SheetTitle className="text-white display tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-red" />
            {t("cart_title")} ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center mb-5">
              <ShoppingBag className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="display text-xl mb-2">{t("cart_empty")}</h3>
            <p className="text-sm text-neutral-500 mb-6">{t("cart_empty_d")}</p>
            <Button onClick={() => setOpen(false)}>{t("cart_continue")}</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((it) => (
                <div key={it.id} className="bg-brand-cream rounded-xl overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                      {it.image ? (
                        <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-500 mb-0.5">{it.sku}</p>
                      <p className="text-sm font-semibold text-brand-black line-clamp-2 mb-1.5">{it.name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-white rounded-full p-0.5 border border-neutral-300">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-neutral-900">{it.qty}</span>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-brand-red">{formatPrice(it.price * it.qty)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      aria-label="Remove"
                      className="text-neutral-400 hover:text-brand-red self-start p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Parts breakdown for configurator bundles */}
                  {it.parts && Object.keys(it.parts).length > 0 && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="bg-white rounded-lg p-3 space-y-2 text-xs border border-neutral-200">
                        <p className="font-semibold text-neutral-600 mb-2">Détails du bundle:</p>
                        {Object.entries(it.parts).map(([key, part]) => (
                          <div key={key} className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-0">
                            <span className="text-neutral-700">
                              <span className="font-medium">{part.qty}</span> × {part.label}
                            </span>
                            <span className="font-semibold text-brand-red">{formatPrice(part.price * part.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Coupon section ── */}
            <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">{couponLabel}</span>
                    <span className="text-xs text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                      {couponCode}
                    </span>
                  </div>
                  <button
                    onClick={() => { removeCoupon(); setCouponError(""); }}
                    className="text-emerald-600 hover:text-red-500 transition-colors"
                    aria-label="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder={canUseCoupon ? t("coupon_ph") : "Connectez-vous pour activer les coupons"}
                      disabled={canUseCoupon === false}
                      className={cn(
                        "w-full pl-9 pr-3 py-2 text-sm border rounded-xl outline-none bg-white font-mono uppercase tracking-widest transition-colors",
                        couponError ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-brand-red",
                        canUseCoupon === false && "opacity-60 cursor-not-allowed"
                      )}
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || canUseCoupon === false}
                    className="px-4 py-2 bg-brand-black text-white text-sm font-semibold rounded-xl hover:bg-brand-red transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {t("coupon_apply")}
                  </button>
                </div>
              )}
              {canUseCoupon === false && !couponError && (
                <p className="text-xs text-neutral-500 mt-1.5">Creez un compte ou connectez-vous pour obtenir des remises.</p>
              )}
              {couponError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <X className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* ── Summary + checkout ── */}
            <div className="border-t border-neutral-200 p-5 bg-white space-y-2">
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>{t("subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {saved > 0 && (
                <div className="flex items-center justify-between text-sm font-semibold text-emerald-600">
                  <span>{t("coupon_saved")}</span>
                  <span>−{formatPrice(saved)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className="text-sm font-bold text-brand-black">{t("total")}</span>
                <span className="display text-3xl text-brand-black">{formatPrice(total)}</span>
              </div>
              <Button asChild size="lg" className="w-full mt-2 group">
                <Link href="/checkout" onClick={() => setOpen(false)}>
                  {t("cart_checkout")}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <p className="text-center text-xs text-neutral-400 mt-1">{t("cart_secure")}</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
