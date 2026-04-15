"use client";

import {
  VideoCamera,
  Robot,
  ShareNetwork,
  TextAa,
  ShieldCheck,
  Browser,
  CurrencyDollar,
  Gauge,
} from "@phosphor-icons/react";
import RevealOnScroll from "./RevealOnScroll";

const features = [
  {
    icon: VideoCamera,
    title: "AI Video Generation",
    description:
      "8-second, 30-second, and 60-second videos powered by Runway Gen-4 and Google Veo3.",
    span: "md:col-span-2",
  },
  {
    icon: Robot,
    title: "40-Agent Pipeline",
    description:
      "Orchestrator, Scriptwriter, Prompt Engineer, QA Agent, Creative Director — your automated content team.",
    span: "md:row-span-2",
  },
  {
    icon: ShareNetwork,
    title: "Multi-Platform Publishing",
    description:
      "One-click publish to TikTok, Instagram, YouTube, and X with platform-optimized formatting.",
    span: "",
  },
  {
    icon: TextAa,
    title: "Smart Captions & Hashtags",
    description:
      "AI-generated captions and trending hashtags tailored to each platform's algorithm.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Brand Consistency",
    description:
      "Character anchoring locks your visual identity across every clip. The Creative Director agent reviews everything.",
    span: "md:col-span-2",
  },
  {
    icon: Browser,
    title: "Client Portal",
    description:
      "Full dashboard with video gallery, project management, credit tracking, and team collaboration.",
    span: "",
  },
  {
    icon: CurrencyDollar,
    title: "Pay Per Video",
    description:
      "Credit-based pricing starting at $4 per video. No subscriptions required to get started.",
    span: "",
  },
  {
    icon: Gauge,
    title: "Tiered Access",
    description:
      "Starter to Pro plans with progressive feature unlocks — thumbnails, lead gen, extended video lengths.",
    span: "",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-16 max-w-xl">
          <p className="text-accent font-mono text-sm tracking-wider uppercase mb-4">
            Platform
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground mb-4">
            Everything you need to
            <br />
            scale video content
          </h2>
          <p className="text-muted text-lg leading-relaxed max-w-[50ch]">
            From idea to published video — a full pipeline that handles
            scripting, generation, quality review, and distribution.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <RevealOnScroll
                key={feature.title}
                delay={i * 0.08}
                className={`group relative p-8 rounded-[2rem] bg-surface border border-border/50 hover:border-accent/20 transition-colors ${feature.span}`}
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                  <Icon size={20} weight="duotone" className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
