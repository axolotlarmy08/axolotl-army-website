import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { COMPANY_NAME, LEGAL_NAV_LINKS } from "@/lib/legalContent";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

/**
 * Public legal/policy pages on the marketing site (axolotlarmy.net).
 *
 * Mirrors the portal's legal layout — same nav links + same shared content
 * source (`lib/legalContent.ts`) — but uses the marketing site's design
 * tokens (bg-surface, text-foreground, etc.) and wraps every page in the
 * site's standard <Nav /> + <Footer /> chrome so visitors can navigate back
 * to the home page without losing context.
 *
 * Deliberately the same component used for the portal: when we add a new
 * doc to LEGAL_NAV_LINKS in lib/legalContent.ts, both surfaces pick it up
 * with no further work.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 text-foreground">
        <nav className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span aria-hidden>·</span>
          {LEGAL_NAV_LINKS.map((link, i) => (
            <span key={link.href} className="contents">
              <Link href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </Link>
              {i < LEGAL_NAV_LINKS.length - 1 ? <span aria-hidden>·</span> : null}
            </span>
          ))}
        </nav>
        <article className="legal-prose max-w-none">{children}</article>
        <p className="mt-16 border-t border-border/50 pt-6 text-xs text-muted/70">
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
      </main>
      <Footer />
    </>
  );
}
