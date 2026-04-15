"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react";

const TOTAL_FRAMES = 91;
const FRAME_PATH_DESKTOP = "/frames/frame-";
const FRAME_PATH_MOBILE = "/frames-mobile/frame-";

const textOverlays = [
  { text: "Generate stunning AI videos in seconds", start: 0.1, end: 0.35 },
  { text: "Publish across TikTok, Instagram, YouTube & X", start: 0.4, end: 0.65 },
  { text: "Your brand. Your characters. Your content.", start: 0.7, end: 0.95 },
];

function padNumber(n: number, width: number) {
  return String(n).padStart(width, "0");
}

function getTextStyle(progress: number, start: number, end: number) {
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

type Variant = "mobile" | "desktop";

interface ActiveProps {
  variant: Variant;
}

/**
 * Scroll-driven canvas animation. Works for both mobile and desktop:
 * - Desktop: cover-scaled frame fills the sticky viewport as before.
 * - Mobile: contain-scaled sharp frame sits centered, with a blurred+dimmed
 *   cover-scaled copy of the same frame filling the rest of the viewport as
 *   an atmospheric backdrop — so the surrounding area doesn't read as an
 *   empty black void. Still scroll-scrubbed and pinned (sticky 100dvh).
 */
function ActiveScrollAnimation({ variant }: ActiveProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const framePath =
    variant === "mobile" ? FRAME_PATH_MOBILE : FRAME_PATH_DESKTOP;

  // Scroll listener.
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

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Preload frames.
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${framePath}${padNumber(i, 4)}.jpg`;
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
  }, [framePath]);

  // Draw frame based on progress.
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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      ctx.clearRect(0, 0, cw, ch);

      if (variant === "mobile") {
        // 1) Blurred cover-scale backdrop so the viewport isn't empty black.
        const bgScale = Math.max(cw / iw, ch / ih);
        const bgW = iw * bgScale;
        const bgH = ih * bgScale;
        const bgX = (cw - bgW) / 2;
        const bgY = (ch - bgH) / 2;
        ctx.save();
        ctx.filter = "blur(28px) brightness(0.55)";
        ctx.drawImage(img, bgX, bgY, bgW, bgH);
        ctx.restore();

        // 2) Sharp contain-scale frame centered — full axolotl visible.
        const fgScale = Math.min(cw / iw, ch / ih);
        const fgW = iw * fgScale;
        const fgH = ih * fgScale;
        const fgX = (cw - fgW) / 2;
        const fgY = (ch - fgH) / 2;
        ctx.save();
        ctx.filter = "brightness(1.2)";
        ctx.drawImage(img, fgX, fgY, fgW, fgH);
        ctx.restore();
      } else {
        const scale = Math.max(cw / iw, ch / ih);
        const x = (cw - iw * scale) / 2;
        const y = (ch - ih * scale) / 2;
        ctx.save();
        ctx.filter = "brightness(1.2)";
        ctx.drawImage(img, x, y, iw * scale, ih * scale);
        ctx.restore();
      }
    }
  }, [progress, framesLoaded, variant]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${TOTAL_FRAMES * 28}px` }}
    >
      <div className="sticky top-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 scroll-anim-canvas">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12">
          {textOverlays.map((overlay, i) => (
            <div
              key={i}
              style={getTextStyle(progress, overlay.start, overlay.end)}
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
  const [variant, setVariant] = useState<Variant | null>(null);
  const [hasFrames, setHasFrames] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setVariant(mq.matches ? "mobile" : "desktop");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!variant) return;
    const path =
      variant === "mobile" ? FRAME_PATH_MOBILE : FRAME_PATH_DESKTOP;
    const testImg = new Image();
    testImg.src = `${path}${padNumber(1, 4)}.jpg`;
    testImg.onload = () => setHasFrames(true);
    testImg.onerror = () => setHasFrames(false);
  }, [variant]);

  if (!variant || hasFrames === null) return null;
  return hasFrames ? (
    <ActiveScrollAnimation variant={variant} />
  ) : (
    <ScrollPlaceholder />
  );
}
