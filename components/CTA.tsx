"use client";

import { ArrowRight } from "@phosphor-icons/react";
import RevealOnScroll from "./RevealOnScroll";

const PORTAL_LINK = "/portal-coming-soon";

export default function CTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="relative rounded-[2.5rem] bg-surface border border-border/50 p-12 md:p-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-xl">
            <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground mb-6">
              Ready to join
              <br />
              the Army?
            </h2>
            <p className="text-muted text-lg leading-relaxed max-w-[45ch] mb-10">
              Start generating AI videos today. No credit card required to
              explore the portal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={PORTAL_LINK}
                className="inline-flex items-center justify-center gap-2 bg-accent text-background font-medium px-8 py-3.5 rounded-full text-base hover:bg-accent-dim transition-colors active:scale-[0.98]"
              >
                Get Started
                <ArrowRight size={16} weight="bold" />
              </a>
              <a
                href={PORTAL_LINK}
                className="inline-flex items-center justify-center border border-border text-foreground font-medium px-8 py-3.5 rounded-full text-base hover:bg-surface-elevated transition-colors active:scale-[0.98]"
              >
                Go to Portal
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
