import { db } from "@/lib/db";
import { ProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

async function getCatalog(searchParams: URLSearchParams) {
  try {
    const cat = searchParams.get("cat");
    const q = searchParams.get("q");
    const promo = searchParams.get("promo");

    const where: any = { status: "active" };
    if (cat) where.category = { slug: cat };
    if (promo) where.comparePrice = { not: null };
    if (q) where.OR = [
      { nameFr: { contains: q } },
      { nameEn: { contains: q } },
      { sku: { contains: q } },
    ];

    const [rawProducts, categories] = await Promise.all([
      db.product.findMany({
        where,
        include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
        take: 60,
        orderBy: { createdAt: "desc" },
      }),
      db.category.findMany({ orderBy: { order: "asc" } }),
    ]);
    const products = rawProducts.map((p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    }));
    return { products, categories };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const params = new URLSearchParams(
    Object.entries(resolved).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((vv) => [k, vv]) : v ? [[k, v]] : []
    ) as [string, string][]
  );
  const { products, categories } = await getCatalog(params);

  return (
    <ProductsClient
      initialProducts={products as any}
      categories={categories as any}
      initialCat={params.get("cat") || ""}
      initialQuery={params.get("q") || ""}
    />
  );
}
