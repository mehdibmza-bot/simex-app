import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductDetail } from "./product-detail";

export const revalidate = 120;

async function getProduct(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true } } },
        },
      },
    });
    if (!product) return null;
    const related = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: "active",
      },
      include: { images: { take: 1 }, category: true },
      take: 4,
    });
    const serializeProduct = (p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    });
    return { product: serializeProduct(product), related: related.map(serializeProduct) };
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) {
    return (
      <div className="container py-32 text-center">
        <h1 className="display text-4xl mb-4">Produit introuvable</h1>
        <p className="text-neutral-500 mb-6">
          Ce produit n&apos;existe pas encore en base. Lancez{" "}
          <code className="bg-neutral-100 px-2 py-0.5 rounded text-sm">npm run db:seed</code>.
        </p>
        <Link href="/products" className="text-brand-red font-semibold underline">
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  return <ProductDetail product={data.product as any} related={data.related as any} />;
}
