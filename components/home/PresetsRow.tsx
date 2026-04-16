"use client";

import ScrollRow, { ScrollRowItem } from "../ScrollRow";

// Horizontal-scroll row of small square video cards representing
// ready-to-go formats / presets the platform supports. Swap sources as
// new preset reel clips are generated.
const items: ScrollRowItem[] = [
  { title: "8s TikTok hook", tag: "TikTok", videoSrc: "/videos/axo-neon.mp4" },
  {
    title: "360° product spin",
    tag: "Commerce",
    videoSrc: "/videos/scroll-sequence.mp4",
  },
  {
    title: "Character spotlight",
    tag: "Character",
    videoSrc: "/videos/axo-prime.mp4",
  },
  {
    title: "Cinematic pan",
    tag: "Cinema",
    videoSrc: "/videos/axolotl-river.mp4",
  },
  {
    title: "Brand promo 30s",
    tag: "Ads",
    videoSrc: "/videos/axo-shadow.mp4",
  },
  {
    title: "Story-driven 60s",
    tag: "Creative",
    videoSrc: "/videos/axo-bloom.mp4",
  },
  {
    title: "Vertical YouTube",
    tag: "Shorts",
    videoSrc: "/videos/axo-neon.mp4",
  },
  {
    title: "Product reveal",
    tag: "Commerce",
    videoSrc: "/videos/axolotl-river.mp4",
  },
];

export default function PresetsRow() {
  return (
    <ScrollRow
      label="Presets"
      title="Drop-in styles & effects"
      items={items}
    />
  );
}
