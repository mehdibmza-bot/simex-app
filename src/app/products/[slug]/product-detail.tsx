"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Truck, Shield, Plus, Minus, Star, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { useCart, useWishlist, useUI } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatPrice, cn } from "@/lib/utils";
import { StoryVideoModal } from "@/components/story-video-modal";

export function ProductDetail({
  product,
  related,
}: {
  product: any;
  related: ProductCardData[];
}) {
  const t = useI18n((s) => s.t);
  const lang = useI18n((s) => s.lang);
  const cartAdd = useCart((s) => s.add);
  const wishToggle = useWishlist((s) => s.toggle);
  const inWish = useWishlist((s) => s.has(product.id));
  const showToast = useUI((s) => s.showToast);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [videoOpen, setVideoOpen] = useState(false);

  const name =
    lang === "ar"
      ? product.nameAr || product.nameFr
      : lang === "en"
      ? product.nameEn || product.nameFr
      : product.nameFr;
  const desc =
    lang === "ar"
      ? product.descAr || product.descriptionAr || product.descFr
      : lang === "en"
      ? product.descEn || product.descriptionEn || product.descFr
      : product.descFr || product.descriptionFr;
  const price = Number(product.price);
  const compareSrc = product.compareAt ?? product.comparePrice;
  const compareAt = compareSrc ? Number(compareSrc) : null;
  const reviewsCount = product.reviewsCount ?? product.reviewCount ?? 0;
  const discount = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const handleAdd = () => {
    cartAdd(
      {
        id: product.id,
        name,
        price,
        sku: product.sku,
        image: product.images?.[0]?.url,
      },
      qty
    );
    showToast(t("toast_cart"), "🛒");
  };

  return (
    <div className="bg-white">
      {videoOpen && product.videoUrl && (
        <StoryVideoModal
          videoUrl={product.videoUrl}
          productName={name}
          productPrice={price}
          productSlug={product.slug}
          productImage={product.images?.[0]?.url}
          onClose={() => setVideoOpen(false)}
        />
      )}
      <div className="container py-6 text-xs text-neutral-500">
        <Link href="/" className="hover:text-brand-red">
          Accueil
        </Link>{" "}
        ›{" "}
        <Link href="/products" className="hover:text-brand-red">
          Produits
        </Link>
        {product.category && (
          <>
            {" "}
            ›{" "}
            <Link
              href={`/products?cat=${product.category.slug}`}
              className="hover:text-brand-red"
            >
              {product.category.nameFr}
            </Link>
          </>
        )}
      </div>

      <div className="container pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative aspect-square bg-brand-cream rounded-2xl overflow-hidden mb-4">
            {product.images?.[imgIdx]?.url ? (
              <Image
                src={product.images[imgIdx].url}
                alt={name}
                fill
                sizes="(max-width:1024px)100vw,600px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">📦</div>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isNew && <Badge variant="new">NEW</Badge>}
              {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
              {product.isHot && <Badge variant="hot">★ HOT</Badge>}
            </div>
            {/* Video button */}
            {product.videoUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl border border-white/20 group"
              >
                <div className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/50 group-hover:scale-110 transition-transform shrink-0">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                Voir la vidéo
              </button>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden bg-brand-cream border-2 transition-all",
                    i === imgIdx ? "border-brand-red" : "border-transparent hover:border-neutral-300"
                  )}
                >
                  <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-brand-red uppercase tracking-widest font-bold mb-2">
            {product.category?.nameFr || "Quincaillerie"} · SKU {product.sku}
          </p>
          <h1 className="display text-3xl md:text-5xl text-brand-black leading-tight mb-4">
            {name}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.round(Number(product.rating || 4.7))
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-300"
                  )}
                />
              ))}
              <span className="text-sm text-neutral-600 ml-1.5">
                {Number(product.rating || 4.7).toFixed(1)} ({reviewsCount} avis)
              </span>
            </div>
            <span className="text-emerald-600 text-xs font-semibold">
              ● {(product.stock ?? 10) > 5 ? t("in_stock") : t("low_stock")}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="display text-5xl text-brand-red">{formatPrice(price)}</span>
            {compareAt && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(compareAt)}
              </span>
            )}
            {discount > 0 && <Badge variant="sale">Économisez {discount}%</Badge>}
          </div>

          <p className="text-neutral-600 leading-relaxed mb-8">
            {desc || "Produit de qualité professionnelle, garanti 2 ans."}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center bg-brand-cream rounded-full p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={handleAdd} size="lg" className="flex-1">
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t("add_cart")}
            </Button>
            <Button
              onClick={() => {
                wishToggle(product.id);
                showToast(inWish ? t("toast_wish_off") : t("toast_wish"));
              }}
              variant="outline"
              size="icon"
              className={cn("w-14 h-14", inWish && "bg-brand-red text-white border-brand-red")}
            >
              <Heart className={cn("w-5 h-5", inWish && "fill-current")} />
            </Button>
            <Button variant="outline" size="icon" className="w-14 h-14">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-4 bg-brand-cream rounded-xl">
              <Truck className="w-5 h-5 text-brand-red" />
              <div>
                <p className="text-sm font-semibold">Livraison 24-48h</p>
                <p className="text-xs text-neutral-500">Toute la Tunisie</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-brand-cream rounded-xl">
              <Shield className="w-5 h-5 text-brand-red" />
              <div>
                <p className="text-sm font-semibold">Garantie 2 ans</p>
                <p className="text-xs text-neutral-500">Échange ou refund</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-brand-cream py-16">
          <div className="container">
            <h2 className="display text-3xl text-brand-black mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
