import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { publish } from "@/lib/redis";

const Item = z.object({
  productId: z.string(),
  qty: z.number().int().positive(),
});

const Schema = z.object({
  items: z.array(Item).min(1),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().min(6),
  address: z.object({
    line1: z.string(),
    city: z.string(),
    postalCode: z.string().optional(),
    governorate: z.string().optional(),
  }),
  paymentMethod: z.enum(["COD", "CARD", "D17", "KONNECT", "TRANSFER", "PRO_NET30"]).default("COD"),
  promoCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const data = parsed.data;

    const products = await db.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });
    const subtotal = data.items.reduce((s, i) => {
      const p = products.find((x) => x.id === i.productId);
      return s + (p ? Number(p.price) * i.qty : 0);
    }, 0);

    let discount = 0;
    if (data.promoCode) {
      const promo = await db.promotion.findUnique({ where: { code: data.promoCode } });
      if (promo && promo.isActive) {
        discount = subtotal * (Number(promo.value) / 100);
      }
    }

    const shipping = subtotal > 200 ? 0 : 8;
    const total = subtotal - discount + shipping;

    const order = await db.order.create({
      data: {
        number: generateOrderNumber(),
        email: data.email,
        phone: data.phone,
        shippingAddress: JSON.stringify({
          name: data.name,
          ...data.address,
        }),
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map((i) => {
            const p = products.find((x) => x.id === i.productId)!;
            return {
              productId: p.id,
              sku: p.sku,
              name: p.nameFr,
              quantity: i.qty,
              unitPrice: p.price,
              total: Number(p.price) * i.qty,
            };
          }),
        },
      },
      include: { items: true },
    });

    await publish("orders:new", { id: order.id, total: Number(order.total) });

    return NextResponse.json({ orderNumber: order.number, total: Number(order.total) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
