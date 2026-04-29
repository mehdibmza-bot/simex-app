"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Logo } from "./logo";
import { useI18n } from "@/lib/i18n";

export interface ContactInfo {
  phone?: string; email?: string; address?: string; hours?: string; whatsapp?: string;
  socials?: { facebook?: string; instagram?: string; youtube?: string; tiktok?: string; linkedin?: string; };
  payments?: string[];
}

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, youtube: Youtube, linkedin: Linkedin };

export function Footer({ contact }: { contact?: ContactInfo }) {
  const t = useI18n((s) => s.t);
  const phone   = contact?.phone   ?? "+216 97 730 083";
  const email   = contact?.email   ?? "societesimex@gmail.com";
  const address = contact?.address ?? "Moknine, Tunisie";
  const hours   = contact?.hours   ?? "Lun-Sam \u00b7 9h-18h";
  const socials = contact?.socials ?? {};
  const payments = contact?.payments ?? ["VISA","Mastercard","D17","Konnect","COD"];

  return (
    <footer className="bg-[#050505] text-neutral-400 pt-20 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] gap-12 mb-14">
          <div>
            <Logo className="mb-5" />
            <p className="text-[13px] leading-relaxed text-neutral-500 mb-6">{t("ft_brand")}</p>
            <div className="flex gap-2.5">
              {(["facebook","instagram","youtube","linkedin"] as const).map((net) => {
                const Icon = SOCIAL_ICONS[net];
                const href = socials[net] || "#";
                return (
                  <a key={net} href={href} aria-label={net}
                    className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center hover:bg-brand-red hover:-translate-y-0.5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterCol title={t("ft_shop")}>
            <FooterLink href="/products">{t("nav_all")}</FooterLink>
            <FooterLink href="/products?new=1">Nouveautés</FooterLink>
            <FooterLink href="/products?promo=1">Promotions</FooterLink>
            <FooterLink href="/products?best=1">Best-sellers</FooterLink>
            <FooterLink href="/builder">{t("nav_builder")}</FooterLink>
          </FooterCol>

          <FooterCol title={t("ft_help")}>
            <FooterLink href="/account">Suivi commande</FooterLink>
            <FooterLink href="/shipping">Livraison</FooterLink>
            <FooterLink href="/returns">Retours &amp; garantie</FooterLink>
            <FooterLink href="/#faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterCol>

          <FooterCol title={t("ft_about")}>
            <FooterLink href="/#mission">Notre mission</FooterLink>
            <FooterLink href="/pro">Espace Pro</FooterLink>
            <FooterLink href="/showroom">Showroom</FooterLink>
            <FooterLink href="/careers">Recrutement</FooterLink>
            <FooterLink href="/legal">Mentions légales</FooterLink>
          </FooterCol>

          <div>
            <h5 className="display text-lg tracking-[2px] text-white mb-5">{t("ft_contact")}</h5>
            <div className="flex flex-col gap-3.5">
              <ContactItem icon={Phone} label="Téléphone" value={phone} />
              <ContactItem icon={Mail} label="Email" value={email} />
              <ContactItem icon={MapPin} label="Showroom" value={address} />
              <ContactItem icon={Clock} label="Horaires" value={hours} />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-xs">
          <span>{t("ft_copy")} · Quincaillerie pour meubles · Home Hardware</span>
          <div className="flex gap-2.5 items-center">
            {payments.map((p) => (
              <span key={p} className="bg-neutral-900 px-3 py-1.5 rounded text-[11px] tracking-wide text-neutral-400 font-semibold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="display text-lg tracking-[2px] text-white mb-5">{title}</h5>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[13px] text-neutral-400 hover:text-brand-red hover:translate-x-1 inline-block transition-all">
        {children}
      </Link>
    </li>
  );
}
function ContactItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-[13px]">
      <div className="w-9 h-9 rounded-lg bg-neutral-900 text-brand-red flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="leading-snug">
        <strong className="block text-white font-semibold mb-0.5 text-[13px]">{label}</strong>
        <span className="whitespace-pre-line">{value}</span>
      </div>
    </div>
  );
}
