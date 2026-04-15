"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play } from "@phosphor-icons/react";

const TOTAL_FRAMES = 91;
const FRAME_PATH = "/frames/frame-";

const textOverlays = [
  { text: "Generate stunning AI videos in seconds", start: 0.1, end: 0.35 },
  { text: "Publish across TikTok, Instagram, YouTube & X", start: 0.4, end: 0.65 },
  { text: "Your brand. Your characters. Your content.", start: 0.7, end: 0.95 },
];

function padNumber(n: number, width: number) {
  return String(n).padStart(width, "0");
}

function ScrollPlaceholder() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative rounded-[2.5rem] bg-surface border border-border/50 overflow-hidden aspect-video max-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-emerald-900/5" />
          <div className="relative text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <Play size={32} weight="fill" className="text-accent ml-1" />
            </div>
            <p className="text-foreground text-xl font-semibold tracking-tight mb-2">
              Scroll Animation
            </p>
            <p className="text-muted text-sm max-w-[40ch] mx-auto">
              Video frames will be extracted and synced to scroll position here
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActiveScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Native scroll listener instead of framer-motion useScroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height - window.innerHeight;

      if (sectionHeight <= 0) return;

      const p = Math.max(0, Math.min(1, -sectionTop / sectionHeight));
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Preload frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${padNumber(i, 4)}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) setFramesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) setFramesLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Draw frame based on progress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !framesLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.min(
      Math.floor(progress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );
    const img = imagesRef.current[frameIndex];

    if (img && img.complete && img.naturalWidth > 0) {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const x = (cw - iw * scale) / 2;
      const y = (ch - ih * scale) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, iw * scale, ih * scale);
    }
  }, [progress, framesLoaded]);

  // Text overlay visibility based on progress
  const getTextStyle = (start: number, end: number) => {
    const fadeIn = start + 0.05;
    const fadeOut = end - 0.05;

    let opacity = 0;
    let translateY = 30;

    if (progress >= start && progress <= end) {
      if (progress < fadeIn) {
        const t = (progress - start) / (fadeIn - start);
        opacity = t;
        translateY = 30 * (1 - t);
      } else if (progress > fadeOut) {
        const t = (progress - fadeOut) / (end - fadeOut);
        opacity = 1 - t;
        translateY = -30 * t;
      } else {
        opacity = 1;
        translateY = 0;
      }
    }

    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      transition: "opacity 0.1s, transform 0.1s",
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${TOTAL_FRAMES * 28}px` }}
    >
      <div
        className="sticky top-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ filter: "brightness(1.2)" }} />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12">
          {textOverlays.map((overlay, i) => (
            <div
              key={i}
              style={getTextStyle(overlay.start, overlay.end)}
              className="absolute inset-0 flex items-center justify-center px-6 pt-16"
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {overlay.text}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ScrollAnimation() {
  const [hasFrames, setHasFrames] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const testImg = new Image();
    testImg.src = `${FRAME_PATH}${padNumber(1, 4)}.jpg`;
    testImg.onload = () => {
      setHasFrames(true);
      setChecked(true);
    };
    testImg.onerror = () => {
      setHasFrames(false);
      setChecked(true);
    };
  }, []);

  if (!checked) return null;

  return hasFrames ? <ActiveScrollAnimation /> : <ScrollPlaceholder />;
}
