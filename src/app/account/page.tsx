import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("simex_session")?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    return (
      <div className="container py-24">
        <div className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-2xl p-8 text-center">
          <h1 className="display text-4xl text-brand-black mb-3">Mon profil</h1>
          <p className="text-neutral-600 mb-6">
            Connectez-vous pour voir vos details, vos commandes et vos informations de livraison.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand-black text-white font-semibold hover:bg-brand-red transition-colors"
          >
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  if (!user) {
    return (
      <div className="container py-24 text-center">
        <h1 className="display text-4xl mb-3">Profil introuvable</h1>
        <p className="text-neutral-500">Votre session existe, mais le compte n&apos;a pas ete trouve.</p>
      </div>
    );
  }

  const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.total), 0);
  const defaultAddress = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="container space-y-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8">
          <h1 className="display text-4xl md:text-5xl text-brand-black mb-2">Mon profil</h1>
          <p className="text-neutral-500">Toutes vos informations SIMEX, en un seul endroit.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="display text-2xl text-brand-black mb-5">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <ProfileField label="Nom" value={user.name} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Telephone" value={user.phone || "Non renseigne"} />
              <ProfileField label="Role" value={user.role} />
              <ProfileField label="Tier Pro" value={user.proTier || "Aucun"} />
              <ProfileField label="Remise compte" value={`${user.discount || 0}%`} />
              <ProfileField label="Matricule fiscale" value={user.taxId || "Non renseigne"} />
              <ProfileField label="Membre depuis" value={new Date(user.createdAt).toLocaleDateString("fr-FR")} />
            </div>
          </section>

          <section className="bg-brand-black text-white rounded-2xl p-6">
            <h2 className="display text-2xl mb-5">Resume</h2>
            <div className="space-y-3 text-sm">
              <StatRow label="Commandes" value={String(user.orders.length)} />
              <StatRow label="Total depense" value={formatPrice(totalSpent)} />
              <StatRow label="Adresses" value={String(user.addresses.length)} />
              <StatRow label="Adresse par defaut" value={defaultAddress ? defaultAddress.label : "Aucune"} />
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="display text-2xl text-brand-black mb-4">Adresse principale</h2>
            {defaultAddress ? (
              <div className="space-y-1 text-sm text-neutral-700">
                <p className="font-semibold text-brand-black">{defaultAddress.label}</p>
                <p>{defaultAddress.street}</p>
                <p>
                  {defaultAddress.city}
                  {defaultAddress.postalCode ? `, ${defaultAddress.postalCode}` : ""}
                </p>
                <p>Zone: {defaultAddress.zone}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Aucune adresse enregistree pour le moment.</p>
            )}
          </section>

          <section className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="display text-2xl text-brand-black mb-4">Dernieres commandes</h2>
            {user.orders.length === 0 ? (
              <p className="text-sm text-neutral-500">Vous n&apos;avez pas encore passe de commande.</p>
            ) : (
              <div className="space-y-2">
                {user.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-xl bg-brand-cream px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-brand-black">{order.number}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")} · {order.status}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-brand-red">{formatPrice(Number(order.total))}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-brand-cream px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="text-sm font-semibold text-brand-black mt-1">{value}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 pb-2 last:border-b-0 last:pb-0">
      <span className="text-neutral-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
