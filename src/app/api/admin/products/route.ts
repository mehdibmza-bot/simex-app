import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const cat = searchParams.get("cat");
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = 20;

  try {
    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (cat) where.category = { slug: cat };
    if (q) {
      where.OR = [
        { nameFr: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch {
    return NextResponse.json({ products: [], total: 0, page, limit });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, categoryId, ...data } = body;

    const product = await db.product.create({
      data: {
        ...data,
        category: { connect: { id: categoryId } },
        images: images?.length
          ? { create: images.map((url: string, i: number) => ({ url, order: i })) }
          : undefined,
      },
      include: { images: true, category: true },
    });
    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, images, categoryId, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Update scalar fields first, then handle images in a separate step to avoid
    // nested deleteMany+create constraint issues in SQLite
    const product = await db.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          ...data,
          ...(categoryId && { category: { connect: { id: categoryId } } }),
        },
      });

      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((url: string, i: number) => ({ url, order: i, productId: id })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { images: { orderBy: { order: "asc" } }, category: true },
      });
    });

    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.product.update({ where: { id }, data: { status: "archived" } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}
