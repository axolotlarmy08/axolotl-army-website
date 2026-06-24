"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

// Videos rotated counter-clockwise one position relative to the original
// mapping so each role visually matches its description:
//   Prime (Commander)   → the black/shadow-looking axolotl
//   Neon  (Hype Creator)→ the pink/shorts character
//   Shadow (Strategist) → the blue commanding axolotl
//   Bloom (Creative)    → the paint-splattered artist
type Character = {
  name: string;
  role: string;
  description: string;
  /** Small preview clip shown inside the character card. */
  video: string;
  /**
   * Optional featured clip displayed below the card. Add a file path
   * here once a character-specific showcase video is ready. If omitted,
   * a "coming soon" placeholder renders in its place.
   */
  featuredVideo?: string;
  /**
   * Set when featuredVideo is vertical (9:16) so it renders upright in a
   * portrait frame instead of being cropped inside the 16:9 box.
   */
  featuredVideoPortrait?: boolean;
};

const characters: Character[] = [
  {
    name: "Axo Prime",
    role: "The Commander",
    description:
      "The face of the Army. Leads every campaign from the front lines with unwavering resolve.",
    video: "/videos/axo-neon.mp4",
    featuredVideo: "/videos/axo-prime-featured.mp4",
    featuredVideoPortrait: true,
  },
  {
    name: "Axo Flash",
    role: "The Hype Creator",
    description:
      "Electrifies every platform with high-energy content, trend-jacking, and hooks that stop the scroll.",
    video: "/videos/axo-bloom.mp4",
    featuredVideo: "/videos/axo-flash-featured.mp4",
    featuredVideoPortrait: true,
  },
  {
    name: "Axo Edge",
    role: "The Strategist",
    description:
      "The tactical mind behind every move. Turns data into decisions and analytics into action.",
    video: "/videos/axo-prime.mp4",
    featuredVideo: "/videos/axo-edge-featured.mp4",
    featuredVideoPortrait: true,
  },
  {
    name: "Axo Dream",
    role: "The Creative",
    description:
      "Brings the vision to life. Every story, every frame, every feeling — crafted with artistic precision.",
    video: "/videos/axo-shadow.mp4",
    featuredVideo: "/videos/axo-dream-featured.mp4",
    featuredVideoPortrait: true,
  },
];

/**
 * Small character-reference clip (the character's turntable/preview) shown
 * next to the name. Autoplays muted + looped when scrolled into view.
 */
function CharacterReferenceClip({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-border/40 bg-surface-elevated mb-5 mx-auto md:mx-0">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

function CharacterCard({
  char,
  index,
}: {
  char: Character;
  index: number;
}) {
  // Alternate which side the video sits on for visual rhythm.
  const reverse = index % 2 === 1;
  return (
    <RevealOnScroll delay={index * 0.05}>
      <div className="rounded-[2.5rem] bg-surface border border-border/50 hover:border-accent/20 transition-colors p-6 md:p-10">
        <div
          className={`flex flex-col items-center justify-center gap-8 md:gap-14 ${
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          {/* Showcase video (or "coming soon" placeholder) */}
          <div className="w-full md:w-auto flex justify-center shrink-0">
            <FeaturedVideo char={char} />
          </div>

          {/* Name + role + description */}
          <div className="w-full md:w-auto md:max-w-md text-center md:text-left">
            <CharacterReferenceClip src={char.video} />
            <span className="text-accent text-xs md:text-sm font-mono tracking-wider uppercase mb-2 block">
              {char.role}
            </span>
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              {char.name}
            </h3>
            <p className="text-muted text-base md:text-lg leading-relaxed">
              {char.description}
            </p>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}

/**
 * Per-character featured video. Autoplays when scrolled into view
 * (IntersectionObserver). If featuredVideo is missing, renders a
 * "coming soon" placeholder so the layout stays consistent.
 */
function FeaturedVideo({ char }: { char: Character }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muted, toggle, handleEnded } = useUnmuteOnce(videoRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Height that keeps the whole 9:16 clip on screen on any display while
  // sitting comfortably beside the character's name in the side-by-side block.
  const fitHeight = "min(72vh, 620px)";

  if (!char.featuredVideo) {
    return (
      <div
        className="relative aspect-[9/16] rounded-2xl bg-surface/50 border border-dashed border-border/60 flex items-center justify-center max-w-full"
        style={{ height: fitHeight }}
      >
        <div className="text-center px-6">
          <p className="text-muted text-xs font-mono tracking-wider uppercase mb-1">
            {char.name} — Featured Video
          </p>
          <p className="text-muted/60 text-xs">Coming soon</p>
        </div>
      </div>
    );
  }

  const isPortrait = char.featuredVideoPortrait;
  return (
    // Portrait clips are sized by HEIGHT so the WHOLE 9:16 clip fits on screen
    // (nothing cropped, nothing scrolled); the width follows from the height.
    <div
      className={`relative rounded-2xl overflow-hidden border border-border/50 bg-surface ${
        isPortrait ? "aspect-[9/16] max-w-full" : "aspect-video w-full max-w-[560px]"
      }`}
      style={isPortrait ? { height: fitHeight } : undefined}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      >
        <source src={char.featuredVideo} type="video/mp4" />
      </video>
      <MuteToggleButton muted={muted} onClick={toggle} />
    </div>
  );
}

/* ───────────────────── Shared video sound controls ─────────────────────
 * Every showcase video autoplays muted (browser autoplay policy). The corner
 * button turns sound on; the clip then plays through ONCE and re-mutes, so
 * audio never loops and nags. */

function MutedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

/**
 * Play-the-sound-once behavior. Turning sound on restarts the clip and plays
 * it through a single time (loop off); when it ends it re-mutes and resumes
 * the silent loop. The parent's <video> must wire onEnded={handleEnded}.
 */
function useUnmuteOnce(videoRef: { current: HTMLVideoElement | null }) {
  const [muted, setMuted] = useState(true);

  const enableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.loop = false;
    video.currentTime = 0;
    setMuted(false);
    video.play().catch(() => {});
  };

  const disableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    setMuted(true);
    video.play().catch(() => {});
  };

  const toggle = () => {
    if (videoRef.current?.muted === false) disableSound();
    else enableSound();
  };

  return { muted, toggle, handleEnded: disableSound };
}

function MuteToggleButton({
  muted,
  onClick,
}: {
  muted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={muted ? "Unmute video" : "Mute video"}
      aria-pressed={!muted}
      className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-foreground flex items-center justify-center hover:bg-background/80 transition-colors"
    >
      {muted ? <MutedIcon /> : <SoundIcon />}
    </button>
  );
}

/**
 * AXY's vertical showcase clip with a tap-to-unmute control.
 */
function AxyShowcaseVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muted, toggle, handleEnded } = useUnmuteOnce(videoRef);

  return (
    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-border/50 bg-surface-elevated">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      >
        <source src="/videos/axy-water-bottle.mp4" type="video/mp4" />
      </video>
      <MuteToggleButton muted={muted} onClick={toggle} />
    </div>
  );
}

/**
 * The wide cinematic clip at the top of the section, same tap-to-unmute UX.
 */
function SectionShowcaseVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muted, toggle, handleEnded } = useUnmuteOnce(videoRef);

  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-border/30">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onEnded={handleEnded}
        className="w-full h-auto"
      >
        <source src="/videos/axolotl-river.mp4" type="video/mp4" />
      </video>
      <MuteToggleButton muted={muted} onClick={toggle} />
    </div>
  );
}

export default function Characters() {
  return (
    <section id="characters" className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <RevealOnScroll className="mb-16 max-w-xl">
          <p className="text-accent font-mono text-sm tracking-wider uppercase mb-4">
            The Squad
          </p>
          <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground mb-4">
            Meet the Axolotl Army
          </h2>
          <p className="text-muted text-lg leading-relaxed max-w-[50ch]">
            Each character has a distinct visual identity and personality —
            locked by our character anchoring system for perfect consistency
            across every video.
          </p>
        </RevealOnScroll>

        {/* Video showcase */}
        <RevealOnScroll className="mb-16">
          <SectionShowcaseVideo />
        </RevealOnScroll>

        {/* Featured: AXY — the Army's main character. Gets its own block
            above the squad grid. The water-bottle showcase clip is vertical
            (9:16), so it lives in a 9:16 frame here rather than a squad card's
            square/16:9 slots (which would crop it). */}
        <RevealOnScroll className="mb-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface border border-accent/30 p-6 md:p-10">
            <p className="text-accent font-mono text-xs tracking-wider uppercase mb-6">
              Meet AXY
            </p>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Portrait + copy */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-40 h-52 sm:w-44 sm:h-56 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/brand/axolotl-character.png"
                    alt="AXY — the Axolotl Army's main character"
                    width={440}
                    height={671}
                    className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-accent text-xs font-mono tracking-wider uppercase mb-1 block">
                    The Leader
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
                    AXY
                  </h3>
                  <p className="text-muted text-sm md:text-base leading-relaxed max-w-[42ch]">
                    The original — and the face of the whole Army. AXY leads
                    every mission from the front lines, and headlines every
                    drop.
                  </p>
                </div>
              </div>

              {/* Vertical showcase video, shown upright (no crop) with a
                  tap-to-unmute control. */}
              <div className="mx-auto w-full max-w-[280px]">
                <AxyShowcaseVideo />
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col gap-6 md:gap-8">
          {characters.map((char, i) => (
            <CharacterCard key={char.name} char={char} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
