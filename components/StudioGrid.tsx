"use client";

/**
 * StudioGrid — Higgsfield-style grid of large "studio" tiles. Each tile is
 * a square video card with a label and a short descriptor overlaid at the
 * bottom. Videos autoplay only when scrolled into view to save bandwidth.
 *
 * Use this for the top-of-home "what this platform does" showcase, where
 * each tile represents a product / mode of the platform (Cinema Studio,
 * Marketing Studio, Character Studio, etc.).
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import RevealOnScroll from "./RevealOnScroll";

export interface StudioTile {
  label: string;
  title: string;
  description: string;
  videoSrc: string;
  href?: string;
  /** Optional — override aspect. Default is 4/5 (slightly portrait). */
  aspect?: string;
  /** Grid span hint for dense grids (e.g. "md:col-span-2"). */
  span?: string;
  /** Small accent badge color override using css var token. */
  badgeColor?: "accent" | "pink" | "gold" | "lavender" | "sky";
}

function Tile({ tile, delay }: { tile: StudioTile; delay: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  const badgeClass = {
    accent: "text-accent bg-accent/10 border-accent/20",
    pink: "text-[var(--axo-pink)] bg-[color:var(--axo-pink)]/10 border-[color:var(--axo-pink)]/20",
    gold: "text-[var(--axo-gold)] bg-[color:var(--axo-gold)]/10 border-[color:var(--axo-gold)]/20",
    lavender:
      "text-[var(--axo-lavender)] bg-[color:var(--axo-lavender)]/10 border-[color:var(--axo-lavender)]/20",
    sky: "text-[var(--axo-sky)] bg-[color:var(--axo-sky)]/10 border-[color:var(--axo-sky)]/20",
  }[tile.badgeColor ?? "accent"];

  const WrapperTag: React.ElementType = tile.href ? Link : "div";
  const wrapperProps = tile.href ? { href: tile.href } : {};

  return (
    <RevealOnScroll
      delay={delay}
      className={`relative ${tile.span ?? ""}`}
    >
      <WrapperTag
        {...wrapperProps}
        className="group block relative w-full overflow-hidden rounded-[1.75rem] bg-surface border border-border/60 hover:border-accent/40 transition-all duration-300"
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: tile.aspect ?? "4 / 5" }}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          >
            <source src={tile.videoSrc} type="video/mp4" />
          </video>

          {/* Gradient scrim for label legibility */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

          {/* Badge */}
          <span
            className={`absolute top-4 left-4 text-[10px] md:text-xs font-mono tracking-wider uppercase border px-2.5 py-1 rounded-full ${badgeClass}`}
          >
            {tile.label}
          </span>

          {/* Hover arrow */}
          {tile.href && (
            <span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} className="text-foreground" />
            </span>
          )}

          {/* Text */}
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <h3 className="text-foreground font-semibold tracking-tight text-xl md:text-2xl mb-1.5 drop-shadow">
              {tile.title}
            </h3>
            <p className="text-white/70 text-sm md:text-[15px] leading-snug max-w-[36ch]">
              {tile.description}
            </p>
          </div>
        </div>
      </WrapperTag>
    </RevealOnScroll>
  );
}

export default function StudioGrid({
  tiles,
  columns = 3,
}: {
  tiles: StudioTile[];
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-4 md:gap-5`}>
      {tiles.map((t, i) => (
        <Tile key={t.title} tile={t} delay={i * 0.05} />
      ))}
    </div>
  );
}
