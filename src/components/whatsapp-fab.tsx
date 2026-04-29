"use client";

import { MessageCircle } from "lucide-react";

export function WhatsappFab() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "21697730083";
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] z-40 hover:scale-110 transition-transform"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-60" />
    </a>
  );
}
