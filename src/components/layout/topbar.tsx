"use client";

import { Phone, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

export function Topbar({ phone: phoneProp, email: emailProp }: { phone?: string; email?: string }) {
  const t = useI18n((s) => s.t);
  const phone = phoneProp ?? "+216 97 730 083";
  const email = emailProp ?? "societesimex@gmail.com";
  return (
    <div className="hidden lg:block bg-brand-black text-brand-cream text-[13px] border-b border-neutral-900">
      <div className="container">
        <div className="flex items-center justify-between h-9 gap-6">
          <div className="flex gap-5 items-center">
            <a href={`tel:${phone.replace(/\s/g,"")}`} className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-brand-red transition-colors">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-brand-red transition-colors">
              <Mail className="w-3 h-3" />
              <span>{email}</span>
            </a>
          </div>
          <div className="flex gap-3 items-center">
            <span className="flex items-center gap-1.5 text-brand-cream">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-pulse-dot" />
              {t("open")}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
