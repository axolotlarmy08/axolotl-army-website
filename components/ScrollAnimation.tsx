"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react";

const TOTAL_FRAMES = 91;
const FRAME_PATH = "/frames/frame-";
const MOBILE_VIDEO_SRC = "/videos/scroll-sequence.mp4";

const textOverlays = [
  { text: "Generate stunning AI videos in seconds", start: 0.1, end: 0.35 },
  { text: "Publish across TikTok, Instagram, YouTube & X", start: 0.4, end: 0.65 },
  { text: "Your brand. Your characters. Your content.", start: 0.7, end: 0.95 },
];

function padNumber(n: number, width: number) {
  return String(n).padStart(width, "0");
}

// Shared fade-in/out logic: given a normalized progress [0..1] and a
// start/end window, return the styling for an overlay so it smoothly fades
// in at `start`, stays visible, and fades out by `end`.
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

/**
 * Mobile version: regular autoplay looping <video> in normal flow, back-to-back
 * with the Hero. Text overlays fade in/out based on video currentTime so the
 * experience matches the desktop scroll-driven version but without the huge
 * dark void a full-viewport sticky creates on narrow screens.
 */
function MobileVideoAnimation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration > 0 && Number.isFinite(video.duration)) {
        setProgress(video.currentTime / video.duration);
      }
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, []);

  return (
    <section className="relative w-full scroll-anim-canvas">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full aspect-video object-cover"
        style={{ filter: "brightness(1.2)" }}
      >
        <source src={MOBILE_VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Text overlays fade in/out based on video progress */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {textOverlays.map((overlay, i) => (
          <div
            key={i}
            style={getTextStyle(progress, overlay.start, overlay.end)}
            className="absolute inset-0 flex items-center justify-center px-6"
          >
            <h2 className="text-2xl font-bold tracking-tighter text-center text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {overlay.text}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Desktop version: scroll-driven frame-by-frame animation in a full-viewport
 * sticky container with atmospheric fade masks. Pre-loads all 91 JPG frames.
 */
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

      // Desktop-only (mobile uses MobileVideoAnimation). Cover-scale.
      const scale = Math.max(cw / iw, ch / ih);
      const x = (cw - iw * scale) / 2;
      const y = (ch - ih * scale) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, iw * scale, ih * scale);
    }
  }, [progress, framesLoaded]);

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
            style={{ filter: "brightness(1.2)" }}
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
  // null until we detect the viewport on the client. Rendering nothing until
  // then avoids hydration mismatch and prevents the mobile path from
  // preloading 91 desktop JPG frames (and vice versa).
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [hasFrames, setHasFrames] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Only probe the desktop frames when on desktop; mobile doesn't need them.
  useEffect(() => {
    if (isMobile !== false) return;
    const testImg = new Image();
    testImg.src = `${FRAME_PATH}${padNumber(1, 4)}.jpg`;
    testImg.onload = () => setHasFrames(true);
    testImg.onerror = () => setHasFrames(false);
  }, [isMobile]);

  if (isMobile === null) return null;
  if (isMobile) return <MobileVideoAnimation />;
  if (hasFrames === null) return null;
  return hasFrames ? <ActiveScrollAnimation /> : <ScrollPlaceholder />;
}
