"use client";

import { ArrowRight } from "@phosphor-icons/react";
import RevealOnScroll from "../RevealOnScroll";
import Showreel, { ShowreelItem } from "../Showreel";

// A compact 4-card showreel with a link to the full /showreel page.
const teaser: ShowreelItem[] = [
  {
    src: "/videos/axo-prime.mp4",
    title: "Character short",
    caption: "8s — TikTok-ready hook.",
    tag: "8s",
  },
  {
    src: "/videos/axolotl-river.mp4",
    title: "Cinematic spot",
    caption: "30s — Veo3 wide-angle hero.",
    tag: "30s",
  },
  {
    src: "/videos/axo-neon.mp4",
    title: "High-energy promo",
    caption: "8s — scroll-stopping hook.",
    tag: "8s",
  },
  {
    src: "/videos/axo-bloom.mp4",
    title: "Story-driven",
    caption: "8s — Creative agent output.",
    tag: "8s",
  },
];

export default function ShowreelTeaser() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-xl">
            <p className="text-accent font-mono text-sm tracking-wider uppercase mb-3">
              What We Build
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground">
              Videos straight from the pipeline
            </h2>
          </div>
          <a
            href="/showreel"
            className="inline-flex items-center gap-2 text-sm text-foreground border border-border/60 hover:border-accent/50 px-5 py-2.5 rounded-full transition-colors"
          >
            Explore showreel <ArrowRight size={16} weight="bold" />
          </a>
        </RevealOnScroll>

        <Showreel items={teaser} columns={4} />
      </div>
    </section>
  );
}
