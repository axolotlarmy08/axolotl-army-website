"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "./CartProvider";

const PORTAL_LINK = "/portal-coming-soon";

// Top-level nav: real pages for content-heavy sections so each one can
// stand alone for SEO and direct linking. Characters stays a home-page
// anchor because it's visually core to the brand on the landing page.
const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Showreel", href: "/showreel" },
  { label: "Characters", href: "/#characters" },
  { label: "Merch", href: "/merch" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();

  // Hide nav while scrolling, show when scrolling stops.
  // On reappear, log which section the user was looking at.
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;
    let isScrolling = false;

    const getVisibleSection = (): string => {
      const sections = document.querySelectorAll("section[id]");
      let best = "top";
      let bestDist = Infinity;
      const mid = window.innerHeight / 2;
      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = s.id || "unknown";
        }
      });
      return best;
    };

    const onScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        setVisible(false);
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
        setVisible(true);
        // Track which section the user stopped on
        const section = getVisibleSection();
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "scroll_stop", { section });
        }
        console.log("[nav] user stopped scrolling at:", section);
      }, 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo — goes home from any other page; on home, scrolls to top */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-3 group"
        >
          <Image
            src="/images/logo-axolotl-sm.png"
            alt="Axolotl Army logo"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span className="text-foreground font-semibold tracking-tight text-lg hidden sm:block">
            Axolotl Army
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                // Smooth-scroll within the home page when the link is an
                // anchor there (e.g. "/#characters"). Otherwise let the
                // browser navigate.
                const isHomeAnchor = link.href.startsWith("/#");
                if (isHomeAnchor && window.location.pathname === "/") {
                  e.preventDefault();
                  const el = document.querySelector(link.href.slice(1));
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-muted text-sm hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth + Cart buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 text-muted hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-surface"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            <span className="text-sm">Cart</span>
            {itemCount > 0 && (
              <span className="min-w-[20px] h-5 bg-accent text-background text-[11px] font-bold rounded-full flex items-center justify-center leading-none px-1.5">
                {itemCount}
              </span>
            )}
          </button>
          <a
            href={PORTAL_LINK}
            className="text-sm text-muted hover:text-foreground transition-colors px-4 py-2"
          >
            Log in
          </a>
          <a
            href={PORTAL_LINK}
            className="text-sm bg-accent text-background font-medium px-5 py-2.5 rounded-full hover:bg-accent-dim transition-colors active:scale-[0.98]"
          >
            Get Started
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-muted text-base hover:text-foreground transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
            <a
              href={PORTAL_LINK}
              className="text-sm text-muted text-center py-2.5"
            >
              Log in
            </a>
            <a
              href={PORTAL_LINK}
              className="text-sm bg-accent text-background font-medium text-center px-5 py-2.5 rounded-full"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
