import { HeroSlider } from "@/components/home/hero-slider";
import { HappyHour } from "@/components/home/happy-hour";
import { PromotionsStorySlider } from "@/components/home/promotions-story-slider";
import { LiveTicker } from "@/components/home/live-ticker";
import { BlackFriday } from "@/components/home/black-friday";
import { DailyDeal } from "@/components/home/daily-deal";
import { Personas } from "@/components/home/personas";
import { Categories } from "@/components/home/categories";
import { ProductRail } from "@/components/home/product-rail";
import { Builder } from "@/components/home/builder";
import { Mission } from "@/components/home/mission";
import { ProBanner } from "@/components/home/pro-banner";
import { VideoShowcase } from "@/components/home/video-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { TrustBar } from "@/components/home/trust-bar";
import { Faq } from "@/components/home/faq";
import { Newsletter } from "@/components/home/newsletter";
import { db } from "@/lib/db";
import type { SlideData } from "@/components/home/hero-slider";

export const revalidate = 60;

async function getHomeData() {
  try {
    const [
      categories, bestsellers, promos, blackFriday, lastCall, activePromos, rawSlides, homeSections,
      rawTestimonials, rawFaqItems, rawTickerEvents, rawVideoItems, rawSiteContent,
    ] = await Promise.all([
      db.category.findMany({ orderBy: { order: "asc" }, take: 8 }),
      db.product.findMany({
        where: { isHot: true, status: "active" },
        include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
        take: 8,
      }),
      db.product.findMany({
        where: { comparePrice: { not: null }, status: "active" },
        include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
        take: 8,
      }),
      db.product.findMany({
        where: { isBlackFriday: true, status: "active" },
        include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
        take: 8,
      }),
      db.product.findMany({
        where: { stock: { gt: 0, lte: 5 }, status: "active" },
        include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
        orderBy: { stock: "asc" },
        take: 8,
      }),
      db.promotion.findMany({
        where: { isActive: true, endsAt: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
      }),
      db.sliderSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.homepageSection.findMany({ orderBy: { order: "asc" } }),
      db.testimonial.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.faqItem.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.tickerEvent.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.videoItem.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.siteContent.findMany(),
    ]);

    const serializeProduct = (p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    });

    const slides: SlideData[] = rawSlides.map((s: any) => ({
      id: s.id, eyebrow: s.eyebrow, titleLine1: s.titleLine1, titleLine2: s.titleLine2,
      titleLine3: s.titleLine3, description: s.description, imageUrl: s.imageUrl,
      btn1Label: s.btn1Label, btn1Href: s.btn1Href, btn2Label: s.btn2Label, btn2Href: s.btn2Href,
    }));

    const sectionMap: Record<string, boolean> = {};
    for (const sec of homeSections) sectionMap[sec.key] = sec.isVisible;

    // Parse site content
    const siteContent: Record<string, any> = {};
    for (const row of rawSiteContent) {
      try { siteContent[row.key] = JSON.parse(row.value); } catch { siteContent[row.key] = {}; }
    }

    // Resolve daily_deal product from DB if configured
    let dailyDeal = undefined;
    const ddConfig = siteContent["daily_deal"];
    if (ddConfig?.productId) {
      const p = await db.product.findUnique({
        where: { id: ddConfig.productId },
        include: { images: { take: 1, orderBy: { order: "asc" } } },
      });
      if (p) {
        dailyDeal = {
          id: p.id,
          name: p.nameFr,
          category: ddConfig.category ?? "",
          originalPrice: Number(p.comparePrice ?? p.price),
          dealPrice: ddConfig.dealPrice ? Number(ddConfig.dealPrice) : Number(p.price),
          sku: p.sku ?? "",
          image: (p.images[0]?.url) ?? "",
          totalStock: ddConfig.totalStock ?? 100,
          sold: ddConfig.sold ?? 53,
          rating: ddConfig.rating ?? 4.9,
          reviews: ddConfig.reviews ?? 0,
          features: ddConfig.features ?? [],
        };
      }
    }

    return {
      categories,
      bestsellers: bestsellers.map(serializeProduct),
      promos: promos.map(serializeProduct),
      blackFriday: blackFriday.map(serializeProduct),
      lastCall: lastCall.map(serializeProduct),
      activePromos: activePromos.map((p: any) => ({
        ...p,
        value: Number(p.value),
        startsAt: p.startsAt instanceof Date ? p.startsAt.toISOString() : p.startsAt,
        endsAt: p.endsAt instanceof Date ? p.endsAt.toISOString() : p.endsAt,
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
        updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
      })),
      slides,
      show: sectionMap,
      testimonials: rawTestimonials,
      faqItems: rawFaqItems,
      tickerEvents: rawTickerEvents.map((e: any) => ({ icon: e.icon, message: e.message, time: e.time })),
      videoItems: rawVideoItems.map((v: any) => ({ id: v.id, title: v.title, duration: v.duration, thumbUrl: v.thumbUrl, videoUrl: v.videoUrl })),
      siteContent,
      dailyDeal,
    };
  } catch {
    return { categories: [], bestsellers: [], promos: [], blackFriday: [], lastCall: [], activePromos: [], slides: [], show: {}, testimonials: [], faqItems: [], tickerEvents: [], videoItems: [], siteContent: {}, dailyDeal: undefined };
  }
}

export default async function HomePage() {
  const { categories, bestsellers, promos, blackFriday, lastCall, activePromos, slides, show, testimonials, faqItems, tickerEvents, videoItems, siteContent, dailyDeal } = await getHomeData();

  const vis = (key: string) => show[key] !== false;
  const hh = siteContent["happy_hour"] ?? {};
  const bf = siteContent["black_friday"] ?? undefined;
  const proBanner = siteContent["pro_banner"] ?? undefined;
  const mission = siteContent["mission"] ?? undefined;
  const builder = siteContent["builder"] ?? undefined;
  const personas = siteContent["personas"] ?? undefined;
  const trustItems = siteContent["trust_bar"] ?? undefined;
  const newsletter = siteContent["newsletter"] ?? {};

  return (
    <>
      <HeroSlider slides={slides.length ? slides : undefined} />
      <LiveTicker events={tickerEvents.length ? tickerEvents : undefined} />
      {vis("happy_hour") && (
        <HappyHour
          title={hh.title}
          subtitle={hh.subtitle}
          ctaText={hh.ctaText}
          ctaLink={hh.ctaLink}
        />
      )}
      {vis("promotions") && <PromotionsStorySlider promotions={activePromos} />}
      {vis("personas") && <Personas cms={personas?.title || personas?.personas ? personas : undefined} />}
      {vis("categories") && <Categories categories={categories} />}
      {vis("products") && <ProductRail bestsellers={bestsellers} promos={promos} blackFriday={blackFriday} lastCall={lastCall} />}
      {vis("daily_deal") && <DailyDeal deal={dailyDeal} />}
      {vis("black_friday") && <BlackFriday cms={bf} />}
      {vis("builder") && <Builder cms={builder} />}
      {vis("pro_banner") && <ProBanner cms={proBanner} />}
      {vis("mission") && <Mission cms={mission} />}
      {vis("video") && <VideoShowcase videos={videoItems.length ? videoItems : undefined} />}
      {vis("testimonials") && <Testimonials reviews={testimonials.length ? testimonials : undefined} />}
      {vis("trust") && <TrustBar items={trustItems?.items} />}
      {vis("faq") && <Faq faqItems={faqItems.length ? faqItems : undefined} />}
      {vis("newsletter") && <Newsletter title={newsletter.title} subtitle={newsletter.subtitle} />}
    </>
  );
}

