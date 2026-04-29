import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const q = searchParams.get("q");
  const limit = Math.min(60, Number(searchParams.get("limit") || 24));
  const offset = Math.max(0, Number(searchParams.get("offset") || 0));

  const where: any = { status: "active" };
  if (cat) where.category = { slug: cat };
  if (q)
    where.OR = [
      { nameFr: { contains: q, mode: "insensitive" } },
      { nameEn: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
    ];

  try {
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
          category: { select: { slug: true, nameFr: true } },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      db.product.count({ where }),
    ]);
    return NextResponse.json({ products, total, limit, offset });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}
