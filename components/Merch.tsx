"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Bell, CheckCircle } from "@phosphor-icons/react";
import RevealOnScroll from "./RevealOnScroll";

export default function Merch() {
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
      const res = await fetch("/api/signups/merch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "merch-section" }),
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
    <section id="merch" className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Section header with mascot */}
        <RevealOnScroll className="mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] overflow-hidden border-2 border-accent/30 flex-shrink-0 bg-surface">
              <Image
                src="/merch/mascot.png"
                alt="Axolotl Army Mascot"
                width={176}
                height={176}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-accent font-mono text-sm tracking-wider uppercase mb-3">
                Merch Store
              </p>
              <h2 className="text-3xl md:text-5xl tracking-tighter leading-none font-bold text-foreground mb-4">
                Rep the Army
              </h2>
              <p className="text-muted text-lg leading-relaxed max-w-[50ch]">
                Official Axolotl Army gear is on the way. Tees, hoodies, caps, and more — all featuring our
                axolotl crew.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Coming Soon card */}
        <RevealOnScroll>
          <div className="relative rounded-[2.5rem] bg-surface border border-border/50 overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative px-8 py-20 md:py-28 flex flex-col items-center text-center">
              {/* Icon badge */}
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-8">
                <Package size={28} weight="duotone" className="text-accent" />
              </div>

              {/* Status pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <span className="text-accent text-xs font-mono uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4 max-w-2xl">
                The drop is almost here
              </h3>

              <p className="text-muted text-base md:text-lg leading-relaxed max-w-[55ch] mb-10">
                We&apos;re finalizing the first Axolotl Army collection. Tees, hoodies, caps, stickers,
                and exclusive plushies — each character with their own drop. Be the first to know when
                the store opens.
              </p>

              {/* Notify form */}
              {status === "success" ? (
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-accent/10 border border-accent/30 mb-8">
                  <CheckCircle size={24} weight="fill" className="text-accent" />
                  <div className="text-left">
                    <p className="text-accent font-medium text-sm">You&apos;re on the list</p>
                    <p className="text-muted text-xs">We&apos;ll email you when the store opens</p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-full bg-background border border-border/50 text-foreground text-sm placeholder:text-muted/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
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
                <p className="text-accent text-sm mb-4">
                  You&apos;re already on the list — we&apos;ll be in touch.
                </p>
              )}

              {status === "error" && (
                <p className="text-red-400 text-sm mb-4">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="text-muted/50 text-xs max-w-md mt-4">
                No spam. One email when the store opens. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Preview strip: what's coming */}
        <RevealOnScroll className="mt-16">
          <p className="text-accent font-mono text-xs tracking-widest uppercase mb-6 text-center">
            What&apos;s dropping
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Tees", desc: "Premium cotton" },
              { label: "Hoodies", desc: "Heavyweight fleece" },
              { label: "Caps", desc: "Embroidered" },
              { label: "Plushies", desc: "Limited edition" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl bg-surface/50 border border-border/30 text-center"
              >
                <p className="text-foreground text-sm font-semibold tracking-tight">{item.label}</p>
                <p className="text-muted/50 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
