"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react";

const PORTAL_LINK = "/portal-coming-soon";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-16 sm:pt-0 sm:min-h-[100dvh] sm:flex sm:items-center">
      {/*
        Video.
        - Mobile: in normal flow, natural 16:9 at top of section.
        - Desktop (sm+): absolute-positioned background filling the section,
          with -15% overflow and a vertical fade mask (handled in globals.css).
      */}
      <div className="relative aspect-video w-full sm:absolute sm:inset-x-0 sm:w-auto sm:h-auto sm:aspect-auto hero-bg-desktop">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.35)" }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content — below video on mobile, overlaid on desktop */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 py-10 sm:py-0 sm:pt-20">
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
              href="#features"
              className="inline-flex items-center justify-center border border-border text-foreground font-medium px-8 py-3.5 rounded-full text-base hover:bg-surface-elevated transition-colors active:scale-[0.98]"
            >
              See What We Build
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — desktop only (on mobile content flows naturally) */}
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={mounted ? { opacity: 1 } : undefined}
        transition={{ delay: 1.5 }}
        className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={20} className="text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
