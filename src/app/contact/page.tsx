import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-brand-cream py-20">
      <div className="container max-w-4xl">
        <h1 className="display text-5xl text-brand-black mb-3">Contact</h1>
        <p className="text-neutral-500 mb-10">
          Notre équipe est joignable du lundi au samedi, 9h–18h.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card icon={Phone} title="Téléphone" value="+216 97 730 083" href="tel:+21697730083" />
          <Card
            icon={Mail}
            title="Email"
            value="societesimex@gmail.com"
            href="mailto:societesimex@gmail.com"
          />
          <Card icon={MapPin} title="Boutique" value={"template-simex\nTunisie"} />
          <Card icon={Clock} title="Horaires" value={"Lun-Sam · 9h - 18h\nDimanche fermé"} />
        </div>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: any;
  title: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200 flex items-start gap-4 hover:border-brand-red transition-colors h-full">
      <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-1">
          {title}
        </p>
        <p className="font-semibold text-brand-black whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{Inner}</a> : Inner;
}
