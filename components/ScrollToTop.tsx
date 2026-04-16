"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Force every page load — including refresh — to start at the top.
 *
 * Hash-based scrolling (e.g. /#characters) is handled ONLY by the Nav
 * component's onClick when the user explicitly clicks a link. On refresh
 * we always go to the top, even if the URL contains a hash, because the
 * user expects "refresh = start over" not "refresh = jump to a section".
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // On every route change or initial load: strip hash + scroll to top.
  useEffect(() => {
    // Strip hash from URL silently so future refreshes don't re-anchor.
    if (window.location.hash) {
      window.history.replaceState(null, "", pathname);
    }

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
