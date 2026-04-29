"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/store";

export default function AccountPage() {
  const setAuth = useUI((s) => s.setAuth);

  useEffect(() => {
    setAuth(true);
  }, [setAuth]);

  return (
    <div className="container py-32 text-center">
      <h1 className="display text-4xl mb-4">Mon compte</h1>
      <p className="text-neutral-500">Connectez-vous pour accéder à vos commandes et préférences.</p>
    </div>
  );
}
