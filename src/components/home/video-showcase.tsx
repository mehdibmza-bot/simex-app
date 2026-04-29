"use client";

import { Play } from "lucide-react";

export interface VideoData {
  id?: string;
  title: string;
  duration: string;
  thumbUrl?: string;
  thumb?: string;
  videoUrl?: string;
}

const DEFAULT_VIDEOS: VideoData[] = [
  {
    title: "Installer une charnière clip-on",
    duration: "3:42",
    thumb:
      "https://images.unsplash.com/photo-1556909114-44e3e9c5b8a8?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Régler une glissière soft-close",
    duration: "2:15",
    thumb:
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Brancher un ruban LED 12V",
    duration: "4:08",
    thumb:
      "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&q=80&auto=format&fit=crop",
  },
];

export function VideoShowcase({ videos }: { videos?: VideoData[] }) {
  const VIDEOS = videos && videos.length > 0 ? videos : DEFAULT_VIDEOS;
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-block text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
            SIMEX TV
          </span>
          <h2 className="display text-4xl md:text-5xl text-brand-black">
            Apprenez en 5 minutes.
          </h2>
          <p className="text-neutral-500 mt-3 text-sm">
            Tutoriels vidéos par nos experts pour installer, régler et entretenir.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VIDEOS.map((v, i) => (
            <button
              key={i}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-brand-black"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${v.thumbUrl ?? v.thumb})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-red">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <p className="text-[11px] uppercase tracking-widest text-brand-red font-bold">
                  Tutoriel · {v.duration}
                </p>
                <p className="text-base font-semibold leading-snug mt-1">{v.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
