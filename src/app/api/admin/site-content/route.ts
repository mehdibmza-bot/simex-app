import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key) {
    const row = await db.siteContent.findUnique({ where: { key } });
    return NextResponse.json(row ?? { key, value: "{}" });
  }
  const rows = await db.siteContent.findMany();
  return NextResponse.json(rows);
}

// PUT body: { key: string, value: string } or array of those
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const items: { key: string; value: string }[] = Array.isArray(body) ? body : [body];
  const results = await Promise.all(
    items.map((item) =>
      db.siteContent.upsert({
        where:  { key: item.key },
        update: { value: item.value },
        create: { key: item.key, value: item.value },
      })
    )
  );
  return NextResponse.json(results);
}
