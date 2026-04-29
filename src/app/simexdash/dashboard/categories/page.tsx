import { db } from "@/lib/db";
import { CategoriesClient } from "./categories-client";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { order: "asc" },
    });
  } catch { /* demo data */ }

  return <CategoriesClient initialCategories={categories} />;
}
