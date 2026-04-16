"use client";

import RevealOnScroll from "../RevealOnScroll";
import StudioGrid, { StudioTile } from "../StudioGrid";

/**
 * Higgsfield-style "what this platform does" grid. Each tile represents
 * a mode / studio the Axolotl Army platform offers. Videos reuse the
 * existing clips as placeholders until bespoke reel footage arrives.
 */
const tiles: StudioTile[] = [
  {
    label: "Cinema",
    title: "Cinema Studio",
    description:
      "Cinematic wide-angle clips with Veo3. 30s to 60s, graded and hero-ready.",
    videoSrc: "/videos/axolotl-river.mp4",
    href: "/showreel",
    badgeColor: "accent",
    span: "md:col-span-2",
    aspect: "16 / 10",
  },
  {
    label: "Social",
    title: "Social Studio",
    description: "TikTok, Reels, and Shorts — 8s hooks that stop the scroll.",
    videoSrc: "/videos/axo-neon.mp4",
    href: "/showreel",
    badgeColor: "pink",
    aspect: "4 / 5",
  },
  {
    label: "Character",
    title: "Character Studio",
    description:
      "Brand-anchored characters. Your IP, consistent across every frame.",
    videoSrc: "/videos/axo-prime.mp4",
    href: "/#characters",
    badgeColor: "lavender",
    aspect: "4 / 5",
  },
  {
    label: "Brand",
    title: "Marketing Studio",
    description: "Product demos, promos, and case-study clips on autopilot.",
    videoSrc: "/videos/axo-shadow.mp4",
    href: "/features",
    badgeColor: "sky",
    aspect: "4 / 5",
  },
  {
    label: "Art",
    title: "Creative Studio",
    description:
      "Story-driven artful clips — every frame crafted by the Creative agent.",
    videoSrc: "/videos/axo-bloom.mp4",
    href: "/showreel",
    badgeColor: "gold",
    aspect: "4 / 5",
  },
];

export default function StudioShowcase() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-accent font-mono text-xs tracking-wider uppercase mb-3">
            Studios
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tight leading-[1.05] font-bold text-foreground">
            One platform. Every kind of video.
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed mt-4 max-w-[56ch]">
            Five purpose-built studios, one 40-agent pipeline. Pick a
            studio, brief the agents, publish — or let the Creative
            Director orchestrate the whole flow.
          </p>
        </RevealOnScroll>

        <StudioGrid tiles={tiles} columns={3} />
      </div>
    </section>
  );
}
