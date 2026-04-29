"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWishlist, useCart, useUI } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

export function WishlistDrawer() {
  const t = useI18n((s) => s.t);
  const open = useUI((s) => s.wishlistOpen);
  const setOpen = useUI((s) => s.setWishlist);
  const items = useWishlist((s) => s.items);
  const wishToggle = useWishlist((s) => s.toggle);
  const cartAdd = useCart((s) => s.add);
  const showToast = useUI((s) => s.showToast);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-5 py-4 bg-brand-black text-white">
          <SheetTitle className="text-white display tracking-wider flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-red fill-brand-red" />
            {t("wish_title")} ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center mb-5">
              <Heart className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="display text-xl mb-2">{t("wish_empty")}</h3>
            <p className="text-sm text-neutral-500 mb-6">{t("wish_empty_d")}</p>
            <Button onClick={() => setOpen(false)}>{t("cart_continue")}</Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 hover:bg-brand-cream/40 transition-colors">
                {/* Image */}
                <Link
                  href={`/products/${item.slug}`}
                  onClick={() => setOpen(false)}
                  className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-neutral-300">
                      📦
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {item.category && (
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
                      {item.category}
                    </p>
                  )}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold text-brand-black line-clamp-2 hover:text-brand-red transition-colors leading-snug"
                  >
                    {item.name}
                  </Link>
                  <p className="display text-brand-red text-base mt-1">
                    {formatPrice(item.price)}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        cartAdd({ id: item.id, name: item.name, price: item.price, sku: item.id, image: item.image });
                        showToast(t("toast_cart"), "🛒");
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-red hover:bg-brand-red2 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      {t("add_cart")}
                    </button>
                    <button
                      onClick={() => wishToggle(item)}
                      aria-label="Retirer"
                      className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-brand-red hover:border-brand-red transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-100 bg-white space-y-3">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm font-semibold bg-brand-black text-white rounded-xl py-3 hover:bg-brand-red transition-colors"
            >
              Voir le catalogue
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
