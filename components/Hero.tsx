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
    <>
      {/* ── Video hero (full viewport, nothing over the video) ── */}
      <section className="relative min-h-[100dvh] overflow-hidden">
        {/* Video — oversized container (-15% top/bottom) so nothing clips
            during the 3D rotation. object-cover fills the viewport. */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "-25%",
            bottom: "-25%",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 6%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 6%, black 90%, transparent 100%)",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(1.6) contrast(1.05)",
            }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Spotlight glow — radial highlight at center so the 3D text pops */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(34,211,238,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Scroll indicator */}
        <motion.div
          initial={mounted ? { opacity: 0 } : false}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={20} className="text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Hero text (below video, on solid bg) ── */}
      <section className="py-16 md:py-24 px-6">
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
