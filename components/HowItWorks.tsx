"use client";

import {
  UserCirclePlus,
  PencilSimpleLine,
  CheckCircle,
  Megaphone,
} from "@phosphor-icons/react";
import RevealOnScroll from "./RevealOnScroll";

const steps = [
  {
    icon: UserCirclePlus,
    number: "01",
    title: "Set Up Your Brand",
    description:
      "Define your brand profile — characters, colors, personality voice. The system learns your identity.",
  },
  {
    icon: PencilSimpleLine,
    number: "02",
    title: "Describe or Discover",
    description:
      "Tell the pipeline what you want, or let the Orchestrator suggest trending content ideas for your niche.",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Review & Approve",
    description:
      "The QA Agent and Creative Director review every output. You approve with one click.",
  },
  {
    icon: Megaphone,
    number: "04",
    title: "Publish Everywhere",
    description:
      "Hit publish once. Captions, hashtags, and formatting are auto-optimized for each platform.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-16 max-w-xl">
          <p className="text-accent font-mono text-sm tracking-wider uppercase mb-4">
            Workflow
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground mb-4">
            Four steps from idea
            <br />
            to published content
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll key={step.number} delay={i * 0.1}>
                <span className="text-accent/30 font-mono text-xs tracking-widest">
                  {step.number}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border/50 flex items-center justify-center mt-3 mb-5">
                  <Icon size={22} weight="duotone" className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
