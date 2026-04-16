"use client";

import { useEffect, useRef } from "react";
import { DeviceMobile, FilmSlate, UsersThree, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import RevealOnScroll from "../RevealOnScroll";

/**
 * OutputFormats — three large gradient cards representing the real output
 * categories the platform generates. No recycled video clips: each card is
 * an animated colored glow + icon + copy, so it reads as intentional
 * design rather than placeholder filler. Swap individual cards to real
 * video clips later as new reel content is produced.
 */

interface FormatCard {
  icon: React.ComponentType<{ size?: number; weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"; className?: string }>;
  label: string;
  title: string;
  description: string;
  href?: string;
  /** Tailwind/style gradient for the card bg. Use color-mix for axo tokens. */
  gradient: string;
  /**
   * Optional background video source. When set, the card renders the video
   * behind the gradient at reduced opacity so the motion reinforces what
   * the card is about (e.g. character consistency demo).
   */
  videoSrc?: string;
  /**
   * Optional YouTube embed ID. When set, renders a muted autoplay loop
   * iframe instead of a local <video>. Use for clips that live on YouTube
   * and shouldn't be duplicated locally.
   */
  youtubeId?: string;
}

const cards: FormatCard[] = [
  {
    icon: DeviceMobile,
    label: "Short-form",
    title: "Social clips built for the scroll",
    description:
      "Vertical 8s – 30s videos for TikTok, Instagram Reels, and YouTube Shorts. Hooks written by the Scriptwriter agent, generated in Runway Gen-4, QA'd by the Creative Director.",
    href: "/showreel",
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--axo-pink) 45%, transparent) 0%, color-mix(in oklab, var(--axo-gold) 25%, transparent) 60%, transparent 100%)",
    youtubeId: "zq4nyvVuNLY",
  },
  {
    icon: FilmSlate,
    label: "Cinematic",
    title: "Long-form, 30 – 60s, story-driven",
    description:
      "Wide-angle cinematic pieces with Veo3 — the kind of hero spots you'd use to open a campaign, launch a product, or anchor a brand moment. Graded, framed, and delivered finished.",
    href: "/showreel",
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--axo-sky) 45%, transparent) 0%, color-mix(in oklab, var(--accent) 25%, transparent) 60%, transparent 100%)",
    videoSrc: "/videos/cinematic-longform.mp4",
  },
  {
    icon: UsersThree,
    label: "Characters",
    title: "Characters that stay on-brand",
    description:
      "Your IP, locked across every frame. Character anchoring keeps proportions, colors, and personality consistent so the Axolotl Army (or your custom characters) look identical in every clip.",
    href: "/#characters",
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--axo-lavender) 45%, transparent) 0%, color-mix(in oklab, var(--axo-pink) 20%, transparent) 60%, transparent 100%)",
    videoSrc: "/videos/character-consistency.mp4",
  },
];

function Card({ card, delay }: { card: FormatCard; delay: number }) {
  const Icon = card.icon;
  const Wrapper: React.ElementType = card.href ? Link : "div";
  const wrapperProps = card.href ? { href: card.href } : {};

  // Background video plays only while the card is on-screen.
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
      { threshold: 0.25 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  const hasMedia = Boolean(card.videoSrc || card.youtubeId);

  return (
    <RevealOnScroll delay={delay}>
      <Wrapper
        {...wrapperProps}
        className="group block rounded-[2rem] border border-border/60 hover:border-accent/40 transition-all duration-300 overflow-hidden bg-surface/50"
      >
        {/* ── Video area (top) ── */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Local video */}
          {card.videoSrc && (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            >
              <source src={card.videoSrc} type="video/mp4" />
            </video>
          )}

          {/* YouTube embed */}
          {card.youtubeId && (
            <iframe
              src={`https://www.youtube.com/embed/${card.youtubeId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=${card.youtubeId}&playsinline=1&modestbranding=1`}
              allow="autoplay; encrypted-media"
              className="absolute inset-0 w-full h-full scale-[1.4] pointer-events-none"
              style={{ border: "none" }}
              title={card.label}
            />
          )}

          {/* Gradient fallback when no media */}
          {!hasMedia && (
            <>
              <div
                aria-hidden
                className="absolute inset-0 opacity-80"
                style={{ background: card.gradient }}
              />
              <div
                aria-hidden
                className="absolute -inset-24 opacity-60 blur-3xl animate-[formatPulse_12s_ease-in-out_infinite_alternate]"
                style={{ background: card.gradient }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/60 to-background/80"
              />
            </>
          )}

          {/* Badge + arrow hover overlay */}
          <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between z-10">
            <span className="text-[11px] md:text-xs font-mono tracking-wider uppercase text-foreground bg-background/50 backdrop-blur-sm border border-border/60 px-2.5 py-1 rounded-full">
              {card.label}
            </span>
            {card.href && (
              <span className="w-9 h-9 rounded-full bg-background/50 backdrop-blur-sm border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} weight="bold" className="text-foreground" />
              </span>
            )}
          </div>
        </div>

        {/* ── Text area (below video, solid bg) ── */}
        <div className="p-6 md:p-7">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
            <Icon size={20} weight="duotone" className="text-accent" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold tracking-tight leading-tight text-foreground mb-2">
            {card.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed">
            {card.description}
          </p>
        </div>
      </Wrapper>
    </RevealOnScroll>
  );
}

export default function OutputFormats() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-accent font-mono text-xs tracking-wider uppercase mb-3">
            What we make
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tight leading-[1.05] font-bold text-foreground">
            Three output formats, one pipeline
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed mt-4 max-w-[56ch]">
            Every project runs through the same 40-agent pipeline. Brief
            the agents on format, tone, and length — they handle the
            rest.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {cards.map((c, i) => (
            <Card key={c.title} card={c} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
