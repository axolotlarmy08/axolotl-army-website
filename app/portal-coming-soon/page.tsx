"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle, Rocket } from "@phosphor-icons/react";

export default function PortalComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "already" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/signups/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "portal-coming-soon" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
      } else if (data.alreadySubscribed) {
        setStatus("already");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-900/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-xl w-full text-center">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground text-sm mb-12 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-8">
          <Rocket size={36} weight="duotone" className="text-accent" />
        </div>

        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-accent text-xs font-mono uppercase tracking-widest">
            In Development
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-6">
          Portal Coming Soon
        </h1>

        <p className="text-muted text-lg leading-relaxed max-w-lg mx-auto mb-10">
          The Axolotl Army Portal — where you&apos;ll generate AI videos, manage
          your brand, and publish to every platform — is almost ready. Get on the
          list to be first in when we launch.
        </p>

        {/* Signup form */}
        {status === "success" ? (
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-accent/10 border border-accent/30">
            <CheckCircle size={24} weight="fill" className="text-accent" />
            <div className="text-left">
              <p className="text-accent font-medium text-sm">You&apos;re on the list</p>
              <p className="text-muted text-xs">We&apos;ll email you when the portal is ready</p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full bg-surface border border-border/50 text-foreground text-sm placeholder:text-muted/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-accent text-background font-medium px-6 py-3 rounded-full text-sm hover:bg-accent-dim transition-colors active:scale-[0.98] disabled:opacity-50"
            >
              <Bell size={16} weight="fill" />
              {submitting ? "Saving..." : "Notify Me"}
            </button>
          </form>
        )}

        {status === "already" && (
          <p className="text-accent text-sm mt-4">
            You&apos;re already on the list — we&apos;ll be in touch.
          </p>
        )}

        {status === "error" && (
          <p className="text-red-400 text-sm mt-4">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-muted/50 text-xs mt-8">
          No spam. One email when the portal opens. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
