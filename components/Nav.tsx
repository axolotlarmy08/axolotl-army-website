"use client";

import { useState } from "react";
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
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
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
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm tracking-tight group-hover:bg-accent/20 transition-colors">
            AA
          </div>
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
