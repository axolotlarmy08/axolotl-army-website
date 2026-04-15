"use client";

import { VideoCamera, Robot, ShareNetwork, ArrowRight } from "@phosphor-icons/react";
import RevealOnScroll from "../RevealOnScroll";

// Home-page teaser. Three high-signal cards with a link out to the full
// /features page.
const highlights = [
  {
    icon: VideoCamera,
    title: "AI Video Generation",
    description:
      "8-second, 30-second, and 60-second videos — Runway Gen-4 and Google Veo3 under the hood.",
  },
  {
    icon: Robot,
    title: "40-Agent Pipeline",
    description:
      "Scriptwriter, Prompt Engineer, QA, Creative Director — an automated content team per project.",
  },
  {
    icon: ShareNetwork,
    title: "Multi-Platform Publishing",
    description:
      "One-click to TikTok, Instagram, YouTube, and X — each clip auto-formatted for the platform.",
  },
];

export default function FeatureStrip() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-xl">
            <p className="text-accent font-mono text-sm tracking-wider uppercase mb-3">
              Platform
            </p>
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground">
              Built for creators at scale
            </h2>
          </div>
          <a
            href="/features"
            className="inline-flex items-center gap-2 text-sm text-foreground border border-border/60 hover:border-accent/50 px-5 py-2.5 rounded-full transition-colors"
          >
            See all features <ArrowRight size={16} weight="bold" />
          </a>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <RevealOnScroll
                key={h.title}
                delay={i * 0.08}
                className="group p-8 rounded-[2rem] bg-surface/70 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                  <Icon size={20} weight="duotone" className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
                  {h.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {h.description}
                </p>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
