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

  return (
    <RevealOnScroll delay={delay}>
      <Wrapper
        {...wrapperProps}
        className="group relative block rounded-[2rem] border border-border/60 hover:border-accent/40 transition-all duration-300 overflow-hidden bg-surface/50"
      >
        {/* Optional background video — local file or YouTube embed. */}
        {card.videoSrc && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          >
            <source src={card.videoSrc} type="video/mp4" />
          </video>
        )}
        {card.youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${card.youtubeId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=${card.youtubeId}&playsinline=1&modestbranding=1`}
            allow="autoplay; encrypted-media"
            className="absolute inset-0 w-full h-full object-cover scale-[1.35] opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ border: "none" }}
            title="Short-form demo"
          />
        )}

        {/* Animated glow — two layered gradients, one slowly drifting.
            Dimmed further when a video is present so it reads as a tint
            rather than covering the video. */}
        <div
          aria-hidden
          className={`absolute inset-0 transition-opacity duration-700 ${
            card.videoSrc || card.youtubeId
              ? "opacity-30 group-hover:opacity-20"
              : "opacity-80 group-hover:opacity-100"
          }`}
          style={{ background: card.gradient }}
        />
        {!card.videoSrc && !card.youtubeId && (
          <div
            aria-hidden
            className="absolute -inset-24 opacity-60 blur-3xl animate-[formatPulse_12s_ease-in-out_infinite_alternate]"
            style={{ background: card.gradient }}
          />
        )}
        {/* Dark base for legibility. Stronger (more opaque) when a video
            is behind it so the text holds up over motion. */}
        <div
          aria-hidden
          className={`absolute inset-0 ${
            card.videoSrc || card.youtubeId
              ? "bg-gradient-to-t from-background/90 via-background/55 to-background/20"
              : "bg-gradient-to-br from-background/40 via-background/60 to-background/80"
          }`}
        />

        {/* Content */}
        <div className="relative p-7 md:p-10 flex flex-col gap-4 min-h-[340px] md:min-h-[420px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] md:text-xs font-mono tracking-wider uppercase text-foreground/80 bg-background/40 backdrop-blur-sm border border-border/60 px-2.5 py-1 rounded-full">
              {card.label}
            </span>
            {card.href && (
              <span className="w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} weight="bold" className="text-foreground" />
              </span>
            )}
          </div>

          <div className="mt-auto">
            <div className="w-12 h-12 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/60 flex items-center justify-center mb-5">
              <Icon size={24} weight="duotone" className="text-foreground" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight text-foreground mb-3">
              {card.title}
            </h3>
            <p className="text-foreground/75 text-sm md:text-[15px] leading-relaxed">
              {card.description}
            </p>
          </div>
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
