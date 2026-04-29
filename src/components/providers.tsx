"use client";

import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider, ToastViewport, Toast, ToastTitle } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";
import { useUI, useTheme } from "@/lib/store";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
});

function GlobalToast() {
  const toast = useUI((s) => s.toast);
  const hide = useUI((s) => s.hideToast);
  return (
    <ToastProvider>
      {toast && (
        <Toast open onOpenChange={(o) => !o && hide()}>
          <span className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-sm shrink-0">
            {toast.icon}
          </span>
          <ToastTitle>{toast.msg}</ToastTitle>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const lang = useI18n((s) => s.lang);
  const theme = useTheme((s) => s.theme);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <GlobalToast />
    </QueryClientProvider>
  );
}
