import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SIMEX database...");

  // -------- Categories
  const cats = [
    { slug: "charnieres", nameFr: "Charnières", nameEn: "Hinges", nameAr: "مفصلات", icon: "Cog", order: 1, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=360&fit=crop&auto=format" },
    { slug: "glissieres", nameFr: "Glissières", nameEn: "Slides", nameAr: "مزالج", icon: "ArrowLeftRight", order: 2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=360&fit=crop&auto=format" },
    { slug: "poignees", nameFr: "Poignées", nameEn: "Handles", nameAr: "مقابض", icon: "Grip", order: 3, image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=360&fit=crop&auto=format" },
    { slug: "serrures", nameFr: "Serrures", nameEn: "Locks", nameAr: "أقفال", icon: "Lock", order: 4, image: "https://images.unsplash.com/photo-1558002038-1ad5a5c4e9c8?w=600&h=360&fit=crop&auto=format" },
    { slug: "led", nameFr: "Éclairage LED", nameEn: "LED Lighting", nameAr: "إضاءة LED", icon: "Lightbulb", order: 5, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=360&fit=crop&auto=format" },
    { slug: "fixations", nameFr: "Vis & Fixations", nameEn: "Screws & Fixings", nameAr: "براغي وتثبيت", icon: "Wrench", order: 6, image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=360&fit=crop&auto=format" },
    { slug: "cuisine", nameFr: "Cuisine", nameEn: "Kitchen", nameAr: "مطبخ", icon: "ChefHat", order: 7, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=360&fit=crop&auto=format" },
    { slug: "dressing", nameFr: "Dressing", nameEn: "Wardrobe", nameAr: "خزانة", icon: "Shirt", order: 8, image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=360&fit=crop&auto=format" },
    { slug: "home", nameFr: "Simex Home", nameEn: "Simex Home", nameAr: "سيمكس", icon: "Home", order: 9, image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4f8e5?w=600&h=360&fit=crop&auto=format" },
    { slug: "portes", nameFr: "Portes", nameEn: "Doors", nameAr: "أبواب", icon: "DoorOpen", order: 10, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=360&fit=crop&auto=format" },
    { slug: "salon", nameFr: "Salon et Chambre", nameEn: "Living & Bedroom", nameAr: "صالون", icon: "Armchair", order: 11, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=360&fit=crop&auto=format" },
    { slug: "menuiserie", nameFr: "Menuiserie & MDF", nameEn: "Woodwork & MDF", nameAr: "نجارة", icon: "Hammer", order: 12, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=360&fit=crop&auto=format" },
  ];

  const categoryMap: Record<string, string> = {};
  for (const c of cats) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    categoryMap[c.slug] = cat.id;
  }

  // -------- Products — synchronized with src/data/products.ts
  // Delete stale data first to ensure clean state
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});

  const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80&auto=format`;

  const products = [
    // ── Charnières
    { slug: "charniere-clip-on-soft-close-110", sku: "CHR-001", cat: "charnieres", nameFr: "Charnière clip-on soft-close 110°", nameEn: "Soft-close clip-on hinge 110°", nameAr: "مفصلة كليب 110°", price: 8.5, was: 12, stock: 50, isHot: true, rating: 4.8, reviews: 142, brand: "Hettich", img: u("1555877765-05acc97df582") },
    { slug: "charniere-grand-angle-165", sku: "CHR-165", cat: "charnieres", nameFr: "Charnière grand angle 165° inox", nameEn: "Wide-angle hinge 165° stainless", nameAr: "مفصلة زاوية كبيرة 165°", price: 11.9, stock: 4, isNew: true, isBlackFriday: true, rating: 4.7, reviews: 89, brand: "Hettich", img: u("1605819049289-2eaecb7d3491") },
    { slug: "charniere-amortie-meuble-cuisine", sku: "CHR-AMR", cat: "charnieres", nameFr: "Charnière amortie meuble cuisine", nameEn: "Soft-close kitchen cabinet hinge", nameAr: "مفصلة مطبخ مخمدة", price: 6.9, was: 9.5, stock: 120, rating: 4.6, reviews: 210, brand: "Grass", img: u("1587783337870-7df9d763eeaf") },
    // ── Glissières
    { slug: "glissiere-billes-sortie-totale-450mm", sku: "GLS-450", cat: "glissieres", nameFr: "Glissière à billes sortie totale 450mm", nameEn: "Full-extension ball slide 450mm", nameAr: "مزلاج كروي 450 ملم", price: 24, was: 32, stock: 35, isNew: true, isHot: true, isBlackFriday: true, rating: 4.9, reviews: 88, brand: "Blum", img: u("1774578341766-081a4996a067") },
    { slug: "glissiere-soft-close-500mm", sku: "GLS-500SC", cat: "glissieres", nameFr: "Glissière soft-close tandem 500mm", nameEn: "Soft-close tandem slide 500mm", nameAr: "مزلاج تاندم 500 ملم", price: 38, was: 52, stock: 3, isHot: true, rating: 4.9, reviews: 67, brand: "Blum", img: u("1676907228185-6869277a9f8f") },
    { slug: "kit-amortisseur-tiroir-soft-close", sku: "AMR-SC", cat: "glissieres", nameFr: "Kit amortisseur tiroir soft-close", nameEn: "Drawer soft-close damper kit", nameAr: "مجموعة ممتص الصدمات", price: 14.5, stock: 90, isHot: true, rating: 4.8, reviews: 54, brand: "Salice", img: u("1607733067654-364ff90d4866") },
    // ── Poignées
    { slug: "poignee-aluminium-noir-mat-128mm", sku: "POI-128", cat: "poignees", nameFr: "Poignée aluminium noir mat 128mm", nameEn: "Matte black aluminum handle 128mm", nameAr: "مقبض ألومنيوم أسود 128 ملم", price: 6.9, stock: 120, rating: 4.6, reviews: 210, brand: "Häfele", img: u("1583041398200-09b2205f6cf0") },
    { slug: "poignee-inox-brosse-96mm", sku: "POI-096B", cat: "poignees", nameFr: "Poignée inox brossé 96mm", nameEn: "Brushed stainless handle 96mm", nameAr: "مقبض ستانلس مسواك 96 ملم", price: 5.9, was: 8.5, stock: 200, isBlackFriday: true, rating: 4.7, reviews: 156, brand: "Häfele", img: u("1597263087845-882e61a86c0a") },
    { slug: "poignee-t-160mm-chrome", sku: "POI-T160", cat: "poignees", nameFr: "Poignée en T 160mm chromée", nameEn: "Chrome T-bar handle 160mm", nameAr: "مقبض T كروم 160 ملم", price: 7.5, stock: 5, isNew: true, rating: 4.5, reviews: 94, brand: "Häfele", img: u("1566550023687-585a9c11eed0") },
    // ── Éclairage LED
    { slug: "ruban-led-5m-3000k", sku: "LED-5M", cat: "led", nameFr: "Ruban LED 5m 3000K + alimentation", nameEn: "LED strip 5m 3000K + driver", nameAr: "شريط LED 5 متر 3000K", price: 39, was: 55, stock: 18, isEco: true, isBlackFriday: true, rating: 4.7, reviews: 76, brand: "Philips", img: u("1682888818589-404faaa4dbc9") },
    { slug: "spot-led-encastre-3w-blanc-chaud", sku: "SPT-3W", cat: "led", nameFr: "Spot LED encastré 3W blanc chaud", nameEn: "Recessed LED spot 3W warm white", nameAr: "بقعة LED 3W أبيض دافئ", price: 9.5, was: 14, stock: 60, rating: 4.7, reviews: 98, brand: "Philips", img: u("1682888818650-0a7cbb35287d") },
    { slug: "profil-aluminium-led-2m", sku: "LED-PRF", cat: "led", nameFr: "Profilé aluminium LED 2m encastré", nameEn: "LED aluminum profile 2m recessed", nameAr: "بروفيل ألومنيوم LED 2 متر", price: 22, was: 30, stock: 40, isNew: true, rating: 4.8, reviews: 43, brand: "Philips", img: u("1613545564258-4eac439cbdfa") },
    // ── Vis & Fixations
    { slug: "vis-confiat-4x40-200pcs", sku: "VIS-200", cat: "fixations", nameFr: "Vis confiat 4×40mm boîte 200 pcs", nameEn: "Wood screw 4×40mm box 200pcs", nameAr: "براغي خشب 4×40 علبة 200", price: 18, stock: 250, rating: 4.5, reviews: 312, brand: "SIMEX", img: u("1590321820422-200a2eefa4a9") },
    { slug: "serrure-meuble-cylindre-2-cles", sku: "SRR-CY", cat: "fixations", nameFr: "Serrure meuble à cylindre + 2 clés", nameEn: "Cabinet cylinder lock + 2 keys", nameAr: "قفل خزانة أسطواني + مفتاحان", price: 11.9, stock: 2, isNew: true, rating: 4.4, reviews: 41, brand: "Yale", img: u("1591640891024-3ee88673e639") },
    { slug: "pied-meuble-carre-acier-100mm", sku: "PED-100", cat: "fixations", nameFr: "Pied de meuble carré acier 100mm", nameEn: "Square steel furniture leg 100mm", nameAr: "قدم أثاث مربع فولاذ 100 ملم", price: 4.9, was: 7, stock: 300, rating: 4.3, reviews: 78, brand: "SIMEX", img: u("1721396177845-c4dc8a98fdad") },
    // ── Cuisine
    { slug: "coulisse-sous-meuble-invisible-400mm", sku: "COL-400", cat: "cuisine", nameFr: "Coulisse sous-meuble invisible 400mm", nameEn: "Undermount invisible slide 400mm", nameAr: "مزلاج تحت الخزانة 400 ملم", price: 45, was: 62, stock: 15, isHot: true, isBlackFriday: true, rating: 4.9, reviews: 29, brand: "Blum", img: u("1587176789924-4bfaea2aaadc") },
    { slug: "profil-demi-lune-alu-mat-3m", sku: "PRF-3M", cat: "cuisine", nameFr: "Profilé demi-lune aluminium mat 3m", nameEn: "Matte alu half-round profile 3m", nameAr: "بروفيل نصف دائرة ألومنيوم 3 متر", price: 28, stock: 45, rating: 4.4, reviews: 19, brand: "SIMEX", img: u("1607710533910-d7cdffd9e593") },
    { slug: "evier-inox-1-bac-50x40", sku: "EVI-1B", cat: "cuisine", nameFr: "Évier inox 1 bac 50×40cm + bonde", nameEn: "Stainless sink 1 bowl 50×40cm", nameAr: "حوض إنوكس 1 حوض 50×40 سم", price: 89, was: 120, stock: 4, isNew: true, rating: 4.6, reviews: 55, brand: "SIMEX", img: u("1722764386929-e6e1ac43f70a") },
    // ── Dressing
    { slug: "paumelle-acier-zingue-125mm", sku: "PAU-125", cat: "dressing", nameFr: "Paumelle acier zingué 125mm", nameEn: "Zinc plated steel hinge 125mm", nameAr: "مفصلة فولاذ مجلفن 125 ملم", price: 3.5, was: 5, stock: 400, rating: 4.2, reviews: 113, brand: "SIMEX", img: u("1763100351670-756f71d57c9f") },
    { slug: "poignee-ceramique-blanche-32mm", sku: "POI-CER", cat: "dressing", nameFr: "Poignée céramique blanche 32mm", nameEn: "White ceramic knob 32mm", nameAr: "مقبض سيراميك أبيض 32 ملم", price: 4.2, stock: 150, isNew: true, rating: 4.5, reviews: 67, brand: "SIMEX", img: u("1574588822710-475a38fe3371") },
    { slug: "tringle-penderie-ronde-alu-1m", sku: "TRG-1M", cat: "dressing", nameFr: "Tringle penderie ronde alu mat 1m", nameEn: "Round matte alu wardrobe rail 1m", nameAr: "عارضة خزانة ألومنيوم 1 متر", price: 18.5, was: 26, stock: 80, rating: 4.4, reviews: 52, brand: "SIMEX", img: u("1558618666-fcd25c85cd64") },
    { slug: "tiroir-bois-coulissant-450mm", sku: "TIR-450", cat: "dressing", nameFr: "Tiroir bois coulissant complet 450mm", nameEn: "Complete wood sliding drawer 450mm", nameAr: "درج خشبي منزلق 450 ملم", price: 55, was: 75, stock: 22, isHot: true, rating: 4.8, reviews: 38, brand: "Blum", img: u("1555041469-a586a5e9d4d5") },
    // ── Portes
    { slug: "ferme-porte-hydraulique-bras", sku: "FPT-HYD", cat: "portes", nameFr: "Ferme-porte hydraulique à bras", nameEn: "Hydraulic door closer with arm", nameAr: "غلاق باب هيدروليكي", price: 72, was: 98, stock: 25, isHot: true, rating: 4.7, reviews: 63, brand: "Dorma", img: u("1562663474-6df8e4286513") },
    { slug: "pivot-porte-pivotante-60kg", sku: "PIV-60", cat: "portes", nameFr: "Pivot porte pivotante 60kg inox", nameEn: "Pivot door hinge 60kg stainless", nameAr: "محور باب محوري 60 كج", price: 145, was: 195, stock: 12, isNew: true, isHot: true, rating: 4.9, reviews: 27, brand: "FritsJurgens", img: u("1558618666-fcd25c85cd64") },
    { slug: "serrure-multipoints-porte-bois", sku: "SRR-MP", cat: "portes", nameFr: "Serrure multipoints porte bois", nameEn: "Multipoint lock wooden door", nameAr: "قفل متعدد النقاط باب خشبي", price: 89, was: 120, stock: 18, rating: 4.6, reviews: 44, brand: "Yale", img: u("1563013544-824ae1b704d3") },
    { slug: "poignee-porte-longue-plaque-inox", sku: "PPL-INX", cat: "portes", nameFr: "Poignée porte longue plaque inox", nameEn: "Long plate stainless door handle", nameAr: "مقبض باب طويل ستانلس", price: 38, was: 52, stock: 60, isNew: true, rating: 4.5, reviews: 81, brand: "Häfele", img: u("1597149474869-f6cd13b8ceea") },
    // ── Serrures
    { slug: "cadenas-laiton-40mm-2-cles", sku: "CDN-40", cat: "serrures", nameFr: "Cadenas laiton 40mm + 2 clés", nameEn: "Brass padlock 40mm + 2 keys", nameAr: "قفل نحاسي 40 ملم + مفتاحان", price: 14.9, stock: 120, rating: 4.3, reviews: 97, brand: "Yale", img: u("1584438948813-4a98c9f48c8f") },
    { slug: "verrou-de-porte-interieur-chrome", sku: "VRR-INT", cat: "serrures", nameFr: "Verrou de porte intérieur chromé", nameEn: "Chrome interior door bolt", nameAr: "مزلاج باب داخلي كروم", price: 8.5, was: 12, stock: 200, rating: 4.2, reviews: 134, brand: "SIMEX", img: u("1560179707-f14e90ef3623") },
    { slug: "cylindre-europeen-60mm-nickel", sku: "CYL-60", cat: "serrures", nameFr: "Cylindre européen 60mm nickelé", nameEn: "European cylinder 60mm nickel", nameAr: "أسطوانة أوروبية 60 ملم نيكل", price: 29.5, was: 42, stock: 55, isNew: true, rating: 4.6, reviews: 72, brand: "Mul-T-Lock", img: u("1614624532983-4ce71639c5fd") },
    // ── Salon & Chambre
    { slug: "pied-de-lit-reglable-acier-noir", sku: "PLT-RGL", cat: "salon", nameFr: "Pied de lit réglable acier noir 25cm", nameEn: "Adjustable black steel bed leg 25cm", nameAr: "قدم سرير قابل للتعديل فولاذ أسود", price: 12.5, was: 18, stock: 180, isHot: true, rating: 4.6, reviews: 149, brand: "SIMEX", img: u("1555041469-a586a5e9d4d5") },
    { slug: "support-tv-mural-orientable-40-75", sku: "TV-MRL", cat: "salon", nameFr: "Support TV mural orientable 40–75\"", nameEn: "Tilting wall TV bracket 40–75\"", nameAr: "حامل تلفاز جداري قابل للتوجيه", price: 65, was: 89, stock: 35, isNew: true, rating: 4.8, reviews: 203, brand: "Vogel's", img: u("1593784991095-a8c6-17c2-7f1b") },
    { slug: "organisateur-tiroir-extensible", sku: "ORG-EXT", cat: "salon", nameFr: "Organisateur tiroir extensible bambou", nameEn: "Expandable bamboo drawer organiser", nameAr: "منظم درج قابل للتمديد خيزران", price: 22, stock: 90, isEco: true, rating: 4.5, reviews: 87, brand: "SIMEX", img: u("1558618666-fcd25c85cd64") },
    // ── Menuiserie & MDF
    { slug: "cheville-confirmats-5x50-100pcs", sku: "CHV-CF5", cat: "menuiserie", nameFr: "Chevilles confirmats 5×50mm x100", nameEn: "Confirmat screws 5×50mm x100", nameAr: "براغي تأكيد 5×50 ملم x100", price: 9.9, stock: 500, rating: 4.4, reviews: 231, brand: "SIMEX", img: u("1590321820422-200a2eefa4a9") },
    { slug: "tourillon-bois-8x35-50pcs", sku: "TRN-835", cat: "menuiserie", nameFr: "Tourillons bois 8×35mm x50", nameEn: "Wood dowels 8×35mm x50", nameAr: "أوتاد خشب 8×35 ملم x50", price: 5.5, stock: 800, rating: 4.2, reviews: 176, brand: "SIMEX", img: u("1612198188060-45d685e3f538") },
    { slug: "planche-mdf-hydro-19mm-244x122", sku: "MDF-HYD", cat: "menuiserie", nameFr: "Planche MDF hydrofuge 19mm 244×122", nameEn: "Moisture-resistant MDF 19mm 244×122", nameAr: "لوح MDF مقاوم للرطوبة 19 ملم", price: 78, was: 105, stock: 20, isNew: true, isHot: true, rating: 4.7, reviews: 45, brand: "Kronospan", img: u("1558618667-3f0e3b5d3c1a") },
    { slug: "colle-pva-bois-1kg", sku: "COL-PVA", cat: "menuiserie", nameFr: "Colle PVA bois 1kg résistante eau", nameEn: "PVA wood glue 1kg water resistant", nameAr: "غراء PVA خشب 1 كغ مقاوم للماء", price: 11.5, stock: 350, isEco: true, rating: 4.5, reviews: 289, brand: "Titebond", img: u("1526506118085-60d92a4d2bf1") },
    // ── Simex Home
    { slug: "crochet-mural-acier-noir-lot-5", sku: "CRH-5PK", cat: "home", nameFr: "Crochets muraux acier noir lot×5", nameEn: "Black steel wall hooks set×5", nameAr: "خطافات جدارية فولاذ أسود 5 قطع", price: 16.9, was: 24, stock: 250, isHot: true, rating: 4.7, reviews: 318, brand: "SIMEX", img: u("1558618666-fcd25c85cd64") },
    { slug: "equerre-invisible-portante-200mm", sku: "EQR-200", cat: "home", nameFr: "Équerre invisible portante 200mm", nameEn: "Floating shelf bracket 200mm", nameAr: "زاوية خفية حاملة 200 ملم", price: 19.9, was: 28, stock: 120, rating: 4.8, reviews: 156, brand: "SIMEX", img: u("1558618666-fcd25c85cd64") },
  ];

  for (const p of products) {
    const { cat, was, reviews: reviewCount, img, ...data } = p;
    await prisma.product.create({
      data: {
        ...data,
        reviewCount,
        status: "active",
        descFr: `${p.nameFr} — Quincaillerie premium SIMEX. Garantie 2 ans, livraison 24-48h.`,
        descEn: `${p.nameEn} — Premium SIMEX hardware. 2-year warranty, 24-48h delivery.`,
        descAr: `${p.nameAr} — تجهيزات بريميوم SIMEX. ضمان عامين، توصيل 24-48 ساعة.`,
        comparePrice: was ?? undefined,
        categoryId: categoryMap[cat],
        images: {
          create: [{ url: img, alt: p.nameFr, order: 0 }],
        },
      },
    });
  }

  // -------- Users
  const adminPwd = await bcrypt.hash("simex123", 10);
  await prisma.user.upsert({
    where: { email: "admin@simex.tn" },
    update: { password: adminPwd, role: "ADMIN" },
    create: {
      email: "admin@simex.tn",
      name: "SIMEX Admin",
      password: adminPwd,
      role: "ADMIN",
      phone: "+216 97 730 083",
    },
  });

  const proPwd = await bcrypt.hash("pro123", 10);
  await prisma.user.upsert({
    where: { email: "menuisier@example.tn" },
    update: {},
    create: {
      email: "menuisier@example.tn",
      name: "Atelier Bois Pro",
      password: proPwd,
      role: "PRO",
      proTier: "gold",
      phone: "+216 22 000 111",
    },
  });

  // -------- Promotions (all 5 types)
  await prisma.promotion.deleteMany({});
  const now = new Date();
  const d = (offset: number) => { const x = new Date(now); x.setDate(x.getDate() + offset); return x; };
  const promos = [
    { code: "FLASH25",   type: "flash",      value: 25, description: "Flash Sale — ce weekend seulement",  startsAt: d(-1), endsAt: d(9),  usageLimit: 50,  usageCount: 12 },
    { code: "HAPPYHOUR", type: "happy_hour", value: 10, description: "Happy Hour — 18h à 21h",             startsAt: d(-1), endsAt: d(7),  usageLimit: null, usageCount: 7  },
    { code: "BUNDLE20",  type: "bundle",     value: 20, description: "Pack charnières + coulisses -20%",   startsAt: d(-2), endsAt: d(5),  usageLimit: 100, usageCount: 28 },
    { code: "SIMEXPRO",  type: "tier",       value: 15, description: "Tarif Pro — clients vérifiés",       startsAt: d(-3), endsAt: d(2),  usageLimit: null, usageCount: 21 },
    { code: "BF30",      type: "flash",      value: 30, description: "Black Friday — offre limitée",       startsAt: d(-4), endsAt: d(-1), usageLimit: 200, usageCount: 35 }, // expired for demo
    { code: "BIENVENU",  type: "coupon",     value: 10, description: "Code de bienvenue nouveaux clients", startsAt: d(-30), endsAt: d(60), usageLimit: null, usageCount: 0 },
  ];
  for (const p of promos) {
    await prisma.promotion.create({ data: { ...p, isActive: true } });
  }

  // -------- Sample orders for admin charts
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@simex.tn" } });
  const allProducts = await prisma.product.findMany();
  const statuses = ["DELIVERED", "DELIVERED", "DELIVERED", "SHIPPED", "PREPARING", "PENDING"] as const;
  for (let i = 0; i < 30; i++) {
    const items = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const p = allProducts[Math.floor(Math.random() * allProducts.length)];
      const qty = Math.floor(Math.random() * 4) + 1;
      return {
        productId: p.id,
        name: p.nameFr,
        sku: p.sku,
        quantity: qty,
        unitPrice: p.price,
        total: Number(p.price) * qty,
      };
    });
    const subtotal = items.reduce((s, x) => s + Number(x.total), 0);
    const shipping = subtotal > 200 ? 0 : 8;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    await prisma.order.create({
      data: {
        number: `SX-2026-${String(100 + i).padStart(6, "0")}`,
        userId: adminUser!.id,
        email: "demo@simex.tn",
        phone: "+216 22 000 222",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: ["CARD", "D17", "COD", "KONNECT"][Math.floor(Math.random() * 4)] as any,
        subtotal,
        shipping,
        total: subtotal + shipping,
        shippingAddress: JSON.stringify({
          street: "Av. Habib Bourguiba 12",
          city: ["Tunis", "Sousse", "Sfax", "Bizerte", "Ariana"][Math.floor(Math.random() * 5)],
          zone: ["Z1", "Z2", "Z3"][Math.floor(Math.random() * 3)],
        }),
        createdAt: date,
        items: { create: items },
      },
    });
  }

  console.log("✅ Seed completed");

  // -------- siteContent defaults
  const navLinks = {
    links: [
      { href: "/products",                label: "Tous les produits", emoji: "",   highlight: false, pro: false },
      { href: "/products?cat=portes",     label: "Portes",            emoji: "",   highlight: false, pro: false },
      { href: "/products?cat=glissieres", label: "Tiroirs",           emoji: "",   highlight: false, pro: false },
      { href: "/products?cat=led",        label: "Éclairage",         emoji: "",   highlight: false, pro: false },
      { href: "/builder",                 label: "Configurateur",     emoji: "",   highlight: false, pro: false },
      { href: "/pro",                     label: "Espace PRO",        emoji: "★",  highlight: true,  pro: true  },
    ],
  };
  await prisma.siteContent.upsert({
    where: { key: "header_nav" },
    update: { value: JSON.stringify(navLinks) },
    create: { key: "header_nav", value: JSON.stringify(navLinks) },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
