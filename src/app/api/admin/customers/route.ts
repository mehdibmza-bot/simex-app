import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

const MIN_PW = 8;

const SELECT = {
  id: true, name: true, email: true, phone: true,
  role: true, proTier: true, taxId: true,
  discount: true, notes: true, createdAt: true,
  _count: { select: { orders: true } },
};

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: SELECT,
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ users: [] });
  }
}

export async function POST(req: NextRequest) {
  const { name, email, phone, role, proTier, taxId, discount, notes, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: "Nom, email et mot de passe requis" }, { status: 400 });
  if (password.length < MIN_PW) return NextResponse.json({ error: `Mot de passe minimum ${MIN_PW} caractères` }, { status: 400 });
  try {
    const hashed = await hash(password, 12);
    const user = await db.user.create({
      data: {
        name, email,
        phone: phone || null,
        password: hashed,
        role: role || "CUSTOMER",
        proTier: proTier || null,
        taxId: taxId || null,
        discount: discount ? parseFloat(String(discount)) : 0,
        notes: notes || null,
      },
      select: SELECT,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Email déjà utilisé ou erreur serveur" }, { status: 409 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, role, proTier, taxId, discount, notes } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
  try {
    const user = await db.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        proTier: proTier !== undefined ? (proTier || null) : undefined,
        taxId: taxId !== undefined ? (taxId || null) : undefined,
        discount: discount !== undefined ? parseFloat(String(discount)) : undefined,
        notes: notes !== undefined ? (notes || null) : undefined,
      },
      select: SELECT,
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Mise à jour échouée" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
  try {
    await db.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Suppression échouée" }, { status: 500 });
  }
}
