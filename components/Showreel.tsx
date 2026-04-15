"use client";

import { useEffect, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

export interface ShowreelItem {
  src: string;
  title: string;
  caption: string;
  tag?: string;
  /** Layout hint — "tall" renders the card as 2 rows on desktop grids. */
  size?: "tall" | "wide" | "default";
}

/**
 * A grid of AI-generated video examples. Each card autoplays its video
 * muted + looped when it's in view (via IntersectionObserver). When a card
 * leaves the viewport its video pauses so the page isn't decoding 8 videos
 * at once on a mid-range phone.
 */
function ShowreelCard({ item, delay }: { item: ShowreelItem; delay: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay may be blocked; fall back silently.
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const spanClass =
    item.size === "tall"
      ? "md:row-span-2"
      : item.size === "wide"
      ? "md:col-span-2"
      : "";

  return (
    <RevealOnScroll
      delay={delay}
      className={`group relative overflow-hidden rounded-[1.75rem] bg-surface border border-border/50 hover:border-accent/30 transition-colors ${spanClass}`}
    >
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        >
          <source src={item.src} type="video/mp4" />
        </video>
        {/* Bottom gradient for caption legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-foreground font-semibold tracking-tight text-base md:text-lg">
            {item.title}
          </h3>
          <p className="text-muted text-xs md:text-sm leading-snug mt-1 max-w-[32ch]">
            {item.caption}
          </p>
        </div>
        {item.tag && (
          <span className="shrink-0 text-[10px] md:text-xs font-mono tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
            {item.tag}
          </span>
        )}
      </div>
    </RevealOnScroll>
  );
}

export default function Showreel({
  items,
  columns = 3,
}: {
  items: ShowreelItem[];
  columns?: 2 | 3 | 4;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // avoid SSR autoplay mismatch

  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4 md:gap-5 auto-rows-fr`}>
      {items.map((item, i) => (
        <ShowreelCard key={item.src + i} item={item} delay={i * 0.05} />
      ))}
    </div>
  );
}
