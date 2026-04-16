"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PORTAL_LINK = "/portal-coming-soon";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* ── MOBILE: video in normal flow at natural aspect, text below ── */}
      <section className="sm:hidden pt-16">
        <div className="relative w-full hero-bg-mobile">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-auto object-cover"
            style={{ filter: "brightness(1.35)" }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ── DESKTOP: full-screen video, unchanged from current ── */}
      <section className="hidden sm:block relative min-h-[100dvh] overflow-hidden bg-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-auto min-h-[100dvh] object-cover"
          style={{ filter: "brightness(1.5)" }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Text below video (both mobile + desktop) */}
      <section className="py-10 sm:py-16 md:py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-2xl">
            <motion.div
              initial={mounted ? { opacity: 0, y: 30 } : false}
              animate={mounted ? { opacity: 1, y: 0 } : undefined}
              transition={{ ...spring, delay: 0.2 }}
            >
              <p className="text-accent font-mono text-sm tracking-wider uppercase mb-6">
                AI Video Generation Platform
              </p>
            </motion.div>

            <motion.h1
              initial={mounted ? { opacity: 0, y: 30 } : false}
              animate={mounted ? { opacity: 1, y: 0 } : undefined}
              transition={{ ...spring, delay: 0.35 }}
              className="text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-none font-bold text-foreground mb-6"
            >
              Create. Publish.
              <br />
              <span className="text-accent">Dominate.</span>
            </motion.h1>

            <motion.p
              initial={mounted ? { opacity: 0, y: 30 } : false}
              animate={mounted ? { opacity: 1, y: 0 } : undefined}
              transition={{ ...spring, delay: 0.5 }}
              className="text-lg md:text-xl text-muted leading-relaxed max-w-[50ch] mb-10"
            >
              Generate stunning AI videos with a 40-agent pipeline, then publish
              across TikTok, Instagram, YouTube and X — all from one portal.
            </motion.p>

            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={mounted ? { opacity: 1, y: 0 } : undefined}
              transition={{ ...spring, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={PORTAL_LINK}
                className="inline-flex items-center justify-center bg-accent text-background font-medium px-8 py-3.5 rounded-full text-base hover:bg-accent-dim transition-colors active:scale-[0.98]"
              >
                Get Started
              </a>
              <a
                href="/showreel"
                className="inline-flex items-center justify-center border border-border text-foreground font-medium px-8 py-3.5 rounded-full text-base hover:bg-surface-elevated transition-colors active:scale-[0.98]"
              >
                See What We Build
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
