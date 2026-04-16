"use client";

/**
 * ScrollRow — Higgsfield-style horizontal-scrolling row of small square
 * video cards. Users can drag / swipe / scroll-wheel through the row.
 * Each card autoplays when visible.
 */

import { useEffect, useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export interface ScrollRowItem {
  title: string;
  tag?: string;
  videoSrc: string;
}

function Card({ item }: { item: ScrollRowItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35, root: v.closest(".scroll-row") as Element | null }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="shrink-0 w-[220px] md:w-[260px] group">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-border/60 hover:border-accent/40 transition-colors">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        >
          <source src={item.videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        {item.tag && (
          <span className="absolute top-3 left-3 text-[10px] font-mono tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
            {item.tag}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p className="text-foreground text-sm font-medium tracking-tight">
            {item.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ScrollRow({
  label,
  title,
  items,
}: {
  label?: string;
  title: string;
  items: ScrollRowItem[];
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    rowRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            {label && (
              <p className="text-accent font-mono text-xs tracking-wider uppercase mb-2">
                {label}
              </p>
            )}
            <h2 className="text-2xl md:text-4xl tracking-tight leading-tight font-bold text-foreground">
              {title}
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollBy(-300)}
              className="w-10 h-10 rounded-full border border-border/60 hover:border-accent/40 hover:bg-surface flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <CaretLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(300)}
              className="w-10 h-10 rounded-full border border-border/60 hover:border-accent/40 hover:bg-surface flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <CaretRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={rowRef}
        className="scroll-row flex gap-4 overflow-x-auto pb-4 pl-6 pr-6"
      >
        {items.map((it, i) => (
          <Card key={it.title + i} item={it} />
        ))}
        {/* Tail spacer so the last card can scroll-snap to start */}
        <div className="shrink-0 w-2" />
      </div>
    </section>
  );
}
