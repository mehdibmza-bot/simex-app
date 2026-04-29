import Link from "next/link";
import { Briefcase, Percent, Truck, CalendarClock, Headphones, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

const PERKS = [
  { icon: Percent, t: "Jusqu'à -25%", d: "Tarifs dégressifs sur tout le catalogue selon votre tier (Bronze/Silver/Gold)." },
  { icon: CalendarClock, t: "Paiement à 30 jours", d: "Compte courant facturé en fin de mois pour les Pro vérifiés." },
  { icon: Truck, t: "Livraison prioritaire", d: "Vos commandes Pro passent en tête de file, livraison souvent le jour même Tunis." },
  { icon: Headphones, t: "Conseiller dédié", d: "Une ligne directe WhatsApp pour vos urgences chantier." },
  { icon: FileSpreadsheet, t: "Devis express", d: "Envoyez votre liste, recevez votre devis chiffré sous 1h." },
  { icon: Briefcase, t: "Compte multi-utilisateurs", d: "Donnez accès à vos collaborateurs avec leurs propres identifiants." },
];

export default function ProPage() {
  return (
    <div className="bg-brand-black text-white">
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-red blur-[160px]" />
        </div>
        <div className="container relative text-center max-w-3xl mx-auto">
          <span className="inline-block text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
            Espace Pro
          </span>
          <h1 className="display text-5xl md:text-7xl mb-6 leading-tight">
            Menuisier ?<br />
            <span className="text-brand-red">On vous équipe.</span>
          </h1>
          <p className="text-neutral-400 text-lg mb-10">
            Compte gratuit. Vérification 24h. Tarifs négociés, paiement à 30j, livraison prioritaire.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/account?signup=pro">Devenir Pro · gratuit</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="#perks">Voir les avantages</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="perks" className="bg-white text-brand-black py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="p-6 rounded-2xl border border-neutral-200 hover:border-brand-red hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="display text-2xl mb-2">{t}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
