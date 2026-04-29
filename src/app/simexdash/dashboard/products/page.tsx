import { db } from "@/lib/db";
import { ProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];
  try {
    const [rawProducts, cats] = await Promise.all([
      db.product.findMany({
        include: { images: { orderBy: { order: "asc" } }, category: true },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      db.category.findMany({ orderBy: { order: "asc" } }),
    ]);
    products = rawProducts.map((p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    }));
    categories = cats;
  } catch { /* demo data */ }

  return <ProductsClient initialProducts={products} initialTotal={products.length} categories={categories} />;
}
