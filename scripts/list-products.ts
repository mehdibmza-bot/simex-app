import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
  const products = await db.product.findMany({ select: { slug: true, nameFr: true, categoryId: true } });
  products.forEach(p => console.log(`${p.slug} | ${p.nameFr} | cat:${p.categoryId}`));
  const cats = await db.category.findMany({ select: { id: true, slug: true, nameFr: true } });
  console.log('\n--- CATEGORIES ---');
  cats.forEach(c => console.log(`${c.id} | ${c.slug} | ${c.nameFr}`));
  await db.$disconnect();
}
main();
