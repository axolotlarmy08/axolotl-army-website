"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Force every navigation and every page refresh to start at the top
 * (or at the hash target if there is one). Works around:
 *   - Browsers restoring scroll position after refresh.
 *   - Layout shifts from lazy-loaded videos / images pushing the
 *     viewport down after an "instant" scrollTo(0).
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  // Run as early as possible on the client so the first frame is at the top.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Let the DOM settle, then scroll to the hash target.
      const t = window.setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => window.clearTimeout(t);
    }

    // Jump to top immediately, then re-assert after layout has settled
    // (videos autoplaying / images loading can otherwise push the page).
    const jump = () => window.scrollTo(0, 0);
    jump();
    const r1 = requestAnimationFrame(jump);
    const r2 = window.setTimeout(jump, 60);
    const r3 = window.setTimeout(jump, 250);
    return () => {
      cancelAnimationFrame(r1);
      window.clearTimeout(r2);
      window.clearTimeout(r3);
    };
  }, [pathname]);

  return null;
}
