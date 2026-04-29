import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "MANAGER", "SUPPORT", "VIEWER", "DELIVERY_AGENT"];
const MIN_PASSWORD_LENGTH = 8;

export async function GET() {
  try {
    const accounts = await db.user.findMany({
      where: { role: { in: ADMIN_ROLES } },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "Failed to load accounts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, role, password } = body;

    if (!email || !name || !role || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json({ error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères` }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const account = await db.user.create({
      data: { email, name, phone: phone || null, role, password: hashed },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, phone, role, password } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const data: any = {};
    if (name) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (role && ADMIN_ROLES.includes(role)) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 12);

    const account = await db.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ account });
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Prevent deleting the last super admin
    const superAdmins = await db.user.count({ where: { role: "SUPER_ADMIN" } });
    const target = await db.user.findUnique({ where: { id } });
    if (target?.role === "SUPER_ADMIN" && superAdmins <= 1) {
      return NextResponse.json({ error: "Cannot delete the last Super Admin" }, { status: 403 });
    }

    await db.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
