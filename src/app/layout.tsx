import type { Metadata } from "next";
import { Inter, Bebas_Neue, Cairo } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { Topbar } from "@/components/layout/topbar";
import { Header } from "@/components/layout/header";
import { MegaNav } from "@/components/layout/mega-nav";
import { Footer } from "@/components/layout/footer";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { CartDrawer } from "@/components/cart-drawer";
import { WishlistDrawer } from "@/components/wishlist-drawer";
import { AuthModal } from "@/components/auth-modal";
import { SearchDialog } from "@/components/search-dialog";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://simex.tn"),
  title: "SIMEX · Quincaillerie pour meubles · Tunisie",
  description:
    "5 000+ références de quincaillerie pour meubles : charnières, glissières, poignées, éclairage LED. Livraison 24-48h partout en Tunisie.",
  keywords: [
    "simex",
    "quincaillerie meubles",
    "charnières",
    "glissières",
    "poignées",
    "tunisie",
    "menuiserie",
    "cuisine",
    "dressing",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "SIMEX · La référence quincaillerie pour meubles",
    description:
      "5 000+ références sélectionnées, testées, livrées en Tunisie sous 24-48h.",
    type: "website",
    locale: "fr_TN",
    images: [{ url: "/logo.png", width: 800, height: 300 }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/simexdash");

  // Fetch CMS contact + nav categories from DB (safe — falls back gracefully)
  let contact = {};
  let navLinks: { href: string; label: string; emoji?: string; highlight?: boolean; pro?: boolean; }[] | undefined;
  try {
    const [contactRow, menuCats] = await Promise.all([
      db.siteContent.findUnique({ where: { key: "contact" } }),
      db.category.findMany({ where: { showInMenu: true }, orderBy: { order: "asc" } }),
    ]);
    if (contactRow?.value) contact = JSON.parse(contactRow.value);
    navLinks = [
      { href: "/products", label: "Tous les produits", labelEn: "All products", labelAr: "كل المنتجات" },
      ...menuCats.map((c: any) => ({
        href: `/products?cat=${c.slug}`,
        label: c.nameFr,
        labelEn: c.nameEn || c.nameFr,
        labelAr: c.nameAr || c.nameFr,
      })),
      { href: "/builder", label: "Configurateur", labelEn: "Builder", labelAr: "المُكوِّن", highlight: true },
      { href: "/pro", label: "Espace Pro", labelEn: "Pro Hub", labelAr: "فضاء المحترفين", pro: true },
    ];
  } catch {/* DB not available — use defaults */}

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bebas.variable} ${cairo.variable} font-sans bg-brand-black text-white antialiased`}
      >
        <Providers>
          {!isAdmin && <Topbar phone={(contact as any).phone} email={(contact as any).email} />}
          {!isAdmin && <Header navLinks={navLinks} phone={(contact as any).phone} />}
          {!isAdmin && <MegaNav navLinks={navLinks} />}
          <main className={cn(
            isAdmin ? "bg-neutral-50 text-neutral-900" : "bg-white text-brand-black min-h-[60vh]"
          )}>
            {children}
          </main>
          {!isAdmin && <Footer contact={contact as any} />}
          {!isAdmin && <WhatsappFab />}
          <CartDrawer />
          <WishlistDrawer />
          <AuthModal />
          <SearchDialog />
        </Providers>
      </body>
    </html>
  );
}
