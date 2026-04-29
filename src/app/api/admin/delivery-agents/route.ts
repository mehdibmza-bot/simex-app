import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/delivery-agents — list all users with role=DELIVERY
export async function GET(req: NextRequest) {
  try {
    const agents = await db.user.findMany({
      where: { role: "DELIVERY" },
      select: { id: true, name: true, email: true, phone: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ agents });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}
