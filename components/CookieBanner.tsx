"use client";

/**
 * Marketing-site cookie banner — Phase 71d.
 *
 * The marketing site (axolotlarmy.net) sets only strictly-necessary cookies
 * (CartProvider's localStorage cart state, Stripe checkout cookies on the
 * checkout subdomain). We don't run analytics or advertising trackers.
 *
 * Banner shows on first visit, dismisses on click + remembers via
 * localStorage. State is a localStorage flag, not a cookie, so we don't
 * dogfood our own opt-out.
 *
 * Mounted once at the root of `app/layout.tsx`.
 */

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookieBanner.acknowledged";

export default function CookieBanner() {
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const ack = window.localStorage.getItem(STORAGE_KEY);
      if (!ack) setShown(true);
    } catch {
      /* localStorage blocked — silently no-op so the banner doesn't trap users */
    }
  }, []);

  function dismiss() {
    setShown(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
  }

  if (!mounted || !shown) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-border/70 bg-surface/95 backdrop-blur p-4 shadow-2xl text-sm text-foreground"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 leading-snug text-foreground/85">
          We use strictly-necessary cookies for cart and checkout. We don&apos;t run
          advertising or third-party tracking. See our{" "}
          <Link href="/legal/cookies" className="underline text-accent hover:opacity-80">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 sm:shrink-0">
          <Link
            href="/legal/cookies"
            className="px-3 py-1.5 rounded text-[12px] border border-border text-muted hover:text-foreground hover:border-accent/30 transition-colors"
          >
            Learn more
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="px-3 py-1.5 rounded text-[12px] bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
