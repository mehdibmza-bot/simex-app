"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist, useUI } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatPrice, cn } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  slug: string;
  sku: string;
  nameFr: string;
  nameEn?: string | null;
  nameAr?: string | null;
  price: number | string;
  compareAt?: number | string | null;
  comparePrice?: number | string | null;
  rating?: number;
  reviewsCount?: number;
  reviewCount?: number;
  stock?: number;
  isNew?: boolean;
  isHot?: boolean;
  isEco?: boolean;
  images?: { url: string; alt?: string | null }[];
  category?: { slug: string; nameFr: string } | null;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const t = useI18n((s) => s.t);
  const lang = useI18n((s) => s.lang);
  const router = useRouter();
  const cartAdd = useCart((s) => s.add);
  const wishToggle = useWishlist((s) => s.toggle);
  const inWishRaw = useWishlist((s) => s.has(product.id));
  const showToast = useUI((s) => s.showToast);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const inWish = mounted && inWishRaw;

  const name =
    lang === "ar"
      ? product.nameAr || product.nameFr
      : lang === "en"
      ? product.nameEn || product.nameFr
      : product.nameFr;

  const price = Number(product.price);
  const compareSrc = product.compareAt ?? product.comparePrice;
  const compareAt = compareSrc ? Number(compareSrc) : null;
  const reviewsCount = product.reviewsCount ?? product.reviewCount ?? 0;
  const discount = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const img = product.images?.[0]?.url;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartAdd({ id: product.id, name, price, sku: product.sku, image: img });
    showToast(t("toast_cart"), "🛒");
  };
  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishToggle({
      id: product.id,
      slug: product.slug,
      name,
      price,
      image: img,
      category: product.category?.nameFr,
    });
    showToast(inWish ? t("toast_wish_off") : t("toast_wish"), inWish ? "♡" : "❤");
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-brand-red hover:shadow-xl transition-all h-full"
    >
      <div className="relative aspect-square bg-neutral-100 overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={product.images?.[0]?.alt || name}
            fill
            sizes="(max-width:768px)50vw,(max-width:1280px)25vw,300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-neutral-300">
            📦
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isNew && <Badge variant="new">NEW</Badge>}
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {product.isHot && <Badge variant="hot">★ HOT</Badge>}
          {product.isEco && <Badge variant="eco">ECO</Badge>}
        </div>

        <button
          onClick={handleWish}
          aria-label="Wishlist"
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center transition-all",
            inWish ? "text-brand-red" : "text-neutral-500 hover:text-brand-red"
          )}
        >
          <Heart className={cn("w-4 h-4", inWish && "fill-current")} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <Button onClick={handleAdd} size="sm" className="flex-1">
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            {t("add_cart")}
          </Button>
          <button
            onClick={(e) => { e.preventDefault(); router.push(`/products/${product.slug}`); }}
            className="w-9 h-9 rounded-md bg-white text-brand-black hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center transition-colors"
            aria-label="Voir le produit"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
          {product.category?.nameFr || product.sku}
        </p>
        <h3 className="text-sm font-semibold text-brand-black line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-brand-red transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-2 text-xs">
          <span className="text-amber-500">★</span>
          <span className="text-neutral-700 font-semibold">
            {Number(product.rating ?? 4.7).toFixed(1)}
          </span>
          <span className="text-neutral-400">({reviewsCount})</span>
          <span className="ml-auto text-emerald-600 font-medium">
            {(product.stock ?? 10) > 5 ? t("in_stock") : t("low_stock")}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="display text-xl text-brand-red">{formatPrice(price)}</span>
          {compareAt && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
