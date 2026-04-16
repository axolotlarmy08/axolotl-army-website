"use client";

import { useEffect, useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";

// Videos rotated counter-clockwise one position relative to the original
// mapping so each role visually matches its description:
//   Prime (Commander)   → the black/shadow-looking axolotl
//   Neon  (Hype Creator)→ the pink/shorts character
//   Shadow (Strategist) → the blue commanding axolotl
//   Bloom (Creative)    → the paint-splattered artist
const characters = [
  {
    name: "Axo Prime",
    role: "The Commander",
    description:
      "The face of the Army. Leads every campaign from the front lines with unwavering resolve.",
    video: "/videos/axo-neon.mp4",
  },
  {
    name: "Axo Flash",
    role: "The Hype Creator",
    description:
      "Electrifies every platform with high-energy content, trend-jacking, and hooks that stop the scroll.",
    video: "/videos/axo-bloom.mp4",
  },
  {
    name: "Axo Edge",
    role: "The Strategist",
    description:
      "The tactical mind behind every move. Turns data into decisions and analytics into action.",
    video: "/videos/axo-prime.mp4",
  },
  {
    name: "Axo Dream",
    role: "The Creative",
    description:
      "Brings the vision to life. Every story, every frame, every feeling — crafted with artistic precision.",
    video: "/videos/axo-shadow.mp4",
  },
];

function CharacterCard({
  char,
  delay,
}: {
  char: (typeof characters)[0];
  delay: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mobile: autoplay the card's video when it scrolls into view, pause when
  // it leaves. Desktop keeps the hover-to-play UX below. Detection is via
  // matchMedia on hover capability (no hover = touch device = autoplay).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) return; // desktop — hover handlers take over

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
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

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.5;
    video.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
  };

  return (
    <RevealOnScroll
      delay={delay}
      className="group flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] bg-surface border border-border/50 hover:border-accent/20 transition-colors cursor-pointer"
    >
      <div
        className="w-full sm:w-48 h-56 sm:h-48 rounded-2xl bg-surface-elevated border border-border/30 flex-shrink-0 overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        >
          <source src={char.video} type="video/mp4" />
        </video>
        {/* Subtle play hint on hover */}
        <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <div className="flex flex-col justify-center">
        <span className="text-accent text-xs font-mono tracking-wider uppercase mb-1">
          {char.role}
        </span>
        <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          {char.name}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {char.description}
        </p>
      </div>
    </RevealOnScroll>
  );
}

export default function Characters() {
  return (
    <section id="characters" className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-16 max-w-xl">
          <p className="text-accent font-mono text-sm tracking-wider uppercase mb-4">
            The Squad
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground mb-4">
            Meet the Axolotl Army
          </h2>
          <p className="text-muted text-lg leading-relaxed max-w-[50ch]">
            Each character has a distinct visual identity and personality —
            locked by our character anchoring system for perfect consistency
            across every video.
          </p>
        </RevealOnScroll>

        {/* Video showcase */}
        <RevealOnScroll className="mb-16">
          <div className="rounded-[2rem] overflow-hidden border border-border/30">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-auto"
            >
              <source src="/videos/axolotl-river.mp4" type="video/mp4" />
            </video>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((char, i) => (
            <CharacterCard key={char.name} char={char} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
