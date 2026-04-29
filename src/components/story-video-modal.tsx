"use client";

import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX, Play, Pause, ShoppingBag } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Props {
  videoUrl: string;
  productName: string;
  productPrice?: number;
  productSlug?: string;
  productImage?: string;
  onClose: () => void;
}

/** Extract YouTube embed URL from any YouTube URL format */
function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}&playsinline=1&rel=0&controls=1`;
  }
  return null;
}

/** Extract Vimeo embed URL */
function getVimeoEmbedUrl(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1&muted=1&loop=1`;
  return null;
}

export function StoryVideoModal({ videoUrl, productName, productPrice, productSlug, productImage, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  const youtubeUrl = getYouTubeEmbedUrl(videoUrl);
  const vimeoUrl = !youtubeUrl ? getVimeoEmbedUrl(videoUrl) : null;
  const isEmbed = !!(youtubeUrl || vimeoUrl);
  const embedSrc = youtubeUrl ?? vimeoUrl ?? "";

  // Auto-play on mount (native video only)
  useEffect(() => {
    if (isEmbed) return;
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = true;
    v.play().catch(() => {});
  }, [isEmbed]);

  // Progress tracking (native video only)
  useEffect(() => {
    if (isEmbed) return;
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [isEmbed]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const newMuted = !muted;
    v.muted = newMuted;
    if (!newMuted) v.volume = volume;
    setMuted(newMuted);
    setShowVolume(!newMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setMuted(val === 0);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Story container — 9:16 portrait format */}
      <div
        className="relative w-full max-w-sm h-[92vh] max-h-[780px] rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video — iframe for YouTube/Vimeo, native video for direct URLs */}
        {isEmbed ? (
          <iframe
            src={embedSrc}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover"
            onClick={togglePlay}
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

        {/* Progress bar (native only) */}
        {!isEmbed && (
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/20 rounded-full overflow-hidden z-10">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {productImage && (
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-neutral-800">
                <img src={productImage} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <span className="text-white text-xs font-black tracking-wide drop-shadow-lg truncate max-w-[180px]">
              {productName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white backdrop-blur-sm transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center play indicator (native only) */}
        {!isEmbed && !playing && (
          <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </button>
        )}

        {/* Right controls (native only) */}
        {!isEmbed && (
          <div className="absolute right-4 bottom-48 z-10 flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              {showVolume && (
                <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-2 py-3 flex flex-col items-center gap-1">
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={muted ? 0 : volume}
                    onChange={handleVolume}
                    className="h-24 cursor-pointer"
                    style={{ writingMode: "vertical-lr", direction: "rtl", appearance: "slider-vertical" } as any}
                  />
                </div>
              )}
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-all"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Bottom product card */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-4">
            <div className="flex items-start gap-3 mb-3">
              {productImage && (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
                  <img src={productImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm leading-tight line-clamp-2">{productName}</p>
                {productPrice != null && (
                  <p className="text-brand-red font-black text-lg mt-1">{formatPrice(productPrice)}</p>
                )}
              </div>
            </div>
            {productSlug && (
              <Link
                href={`/products/${productSlug}`}
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-brand-red/30"
              >
                <ShoppingBag className="w-4 h-4" />
                Voir le produit
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

