"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneTilt, Sparkle, X, CheckCircle } from "@phosphor-icons/react";
import { AXO_TIERS, AXO_ADDONS, AXO_CREDIT_PACKS } from "@/lib/axo/offerings";

type Msg = { role: "user" | "assistant"; content: string };

type LeadCaptured = {
  email: string;
  name?: string;
  interest?: string;
};

type MerchProduct = {
  syncProductId: number;
  name: string;
  thumbnail: string;
  startingPrice: number;
};

export default function AxoExperience() {
  const [opened, setOpened] = useState(false);
  const [merch, setMerch] = useState<MerchProduct[] | null>(null);
  const merchSectionRef = useRef<HTMLElement>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey — I'm AXO 🦎\n\nBefore I show you anything, who am I chatting with? Just a first name's fine. And what kind of business or creative work are you running?",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [leads, setLeads] = useState<LeadCaptured[]>([]);
  const [focus, setFocus] = useState<{ section: string; id: string } | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const tierRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const addonRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const packRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const merchRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Lazy-load merch only after the user opens the experience — no need to
  // hit Printful for visitors who never click Try AXO.
  useEffect(() => {
    if (!opened || merch !== null) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/printful/products");
        if (!res.ok) return;
        const data = (await res.json()) as {
          products: Array<{
            syncProductId: number;
            name: string;
            thumbnail: string;
            startingPrice: number;
          }>;
        };
        if (!cancelled) setMerch(data.products ?? []);
      } catch {
        if (!cancelled) setMerch([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [opened, merch]);

  // Scroll the spotlighted item into view whenever the model focuses
  // something new. The model drives this via the show_preview tool.
  useEffect(() => {
    if (!focus) return;
    let el: HTMLElement | null = null;
    if (focus.section === "tier") el = tierRefs.current[focus.id] ?? null;
    else if (focus.section === "addon") el = addonRefs.current[focus.id] ?? null;
    else if (focus.section === "credit_pack")
      el = packRefs.current[focus.id] ?? null;
    else if (focus.section === "merch")
      el = merchRefs.current[focus.id] ?? null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focus]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/axo/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        const errMsg =
          (errBody as { error?: string }).error || `Error ${res.status}`;
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: `(${errMsg})`,
          };
          return copy;
        });
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          const lines = part.split("\n");
          let event = "message";
          let data = "";
          for (const line of lines) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (!data) continue;
          let payload: unknown = null;
          try {
            payload = JSON.parse(data);
          } catch {
            continue;
          }
          if (event === "text") {
            const delta = (payload as { delta?: string }).delta ?? "";
            setMessages((m) => {
              const copy = [...m];
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: last.content + delta,
                };
              }
              return copy;
            });
          } else if (event === "focus") {
            const p = payload as { section?: string; id?: string };
            if (p.section && p.id) {
              setFocus({ section: p.section, id: p.id });
            }
          } else if (event === "lead") {
            const p = payload as {
              ok: boolean;
              email?: string;
              name?: string;
              interest?: string;
            };
            if (p.ok && p.email) {
              setLeads((l) => [
                ...l,
                { email: p.email!, name: p.name, interest: p.interest },
              ]);
            }
          } else if (event === "error") {
            const msg = (payload as { message?: string }).message ?? "error";
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = {
                role: "assistant",
                content: `(error: ${msg})`,
              };
              return copy;
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="w-full">
      {!opened ? (
        <IntroCard onOpen={() => setOpened(true)} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6"
        >
          {/* Chat column */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] min-h-[560px] max-h-[80vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white/5">
                  <Image
                    src="/images/logo-axolotl-sm.png"
                    alt="AXO"
                    fill
                    sizes="28px"
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-white">AXO</span>
                <span className="text-xs text-white/40">· lightweight</span>
              </div>
              <button
                onClick={() => setOpened(false)}
                className="text-white/40 hover:text-white transition"
                aria-label="Close AXO"
              >
                <X size={18} />
              </button>
            </div>
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap leading-relaxed text-[15px] ${
                      m.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/90 border border-white/10"
                    }`}
                  >
                    {m.content || (
                      <span className="inline-flex gap-1">
                        <Dot /> <Dot delay={120} /> <Dot delay={240} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AXO about tiers, tools, or merch..."
                disabled={streaming}
                className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none px-2"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="rounded-xl bg-white text-black px-3 py-2 disabled:opacity-40 hover:bg-white/90 transition"
                aria-label="Send"
              >
                <PaperPlaneTilt size={18} weight="fill" />
              </button>
            </form>
          </div>

          {/* Preview column */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 min-h-[560px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-sm uppercase tracking-widest text-white/40 mb-4">
              What we offer
            </h2>

            <AnimatePresence>
              {leads.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-2 text-emerald-300 text-sm"
                >
                  <CheckCircle weight="fill" size={18} />
                  <span>
                    Thanks{leads[leads.length - 1]?.name ? `, ${leads[leads.length - 1]!.name}` : ""}
                    {" — we'll be in touch at "}
                    <strong>{leads[leads.length - 1]!.email}</strong>.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <section className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
                Tiers
              </h3>
              <div className="space-y-2">
                {AXO_TIERS.map((t) => {
                  const active =
                    focus?.section === "tier" && focus.id === t.name;
                  return (
                    <div
                      key={t.name}
                      ref={(el) => {
                        tierRefs.current[t.name] = el;
                      }}
                      className={`rounded-xl border p-3 transition ${
                        active
                          ? "border-white bg-white/[0.08] ring-2 ring-white/30"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="font-medium text-white">{t.name}</div>
                        <div className="text-white/70 text-sm whitespace-nowrap">
                          {t.monthlyPrice === 0 ? "Free" : `$${t.monthlyPrice}/mo`}
                        </div>
                      </div>
                      <div className="text-sm text-white/50 mt-1">{t.tagline}</div>
                      {active && (
                        <ul className="mt-2 text-sm text-white/70 list-disc list-inside space-y-0.5">
                          {t.highlights.slice(0, 6).map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
                Add-ons
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {AXO_ADDONS.map((a) => {
                  const active =
                    focus?.section === "addon" && focus.id === a.name;
                  return (
                    <div
                      key={a.name}
                      ref={(el) => {
                        addonRefs.current[a.name] = el;
                      }}
                      className={`rounded-lg border p-3 flex justify-between gap-3 transition ${
                        active
                          ? "border-white bg-white/[0.08] ring-2 ring-white/30"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div>
                        <div className="text-sm text-white">{a.name}</div>
                        <div className="text-xs text-white/50 mt-0.5">
                          {a.blurb}
                        </div>
                      </div>
                      <div className="text-sm text-white/70 whitespace-nowrap">
                        ${a.monthlyPrice}/mo
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mb-6 rounded-xl transition">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
                Merch
              </h3>
              {merch === null ? (
                <div className="text-sm text-white/40">Loading merch…</div>
              ) : merch.length === 0 ? (
                <div className="text-sm text-white/40">No merch live right now.</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {merch.map((p) => {
                    const active =
                      focus?.section === "merch" && focus.id === p.name;
                    return (
                      <a
                        key={p.syncProductId}
                        href="/merch"
                        ref={(el) => {
                          merchRefs.current[p.name] = el;
                        }}
                        className={`group rounded-lg border overflow-hidden transition ${
                          active
                            ? "border-white bg-white/[0.06] ring-2 ring-white/30 scale-[1.02]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/30"
                        }`}
                      >
                      <div className="relative aspect-square bg-white/5">
                        {p.thumbnail && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.thumbnail}
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-xs text-white/90 line-clamp-2">
                          {p.name}
                        </div>
                        <div className="text-xs text-white/50 mt-0.5">
                          from ${p.startingPrice}
                        </div>
                      </div>
                    </a>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
                Credit packs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {AXO_CREDIT_PACKS.map((p) => {
                  const active =
                    focus?.section === "credit_pack" && focus.id === p.name;
                  return (
                    <div
                      key={p.name}
                      ref={(el) => {
                        packRefs.current[p.name] = el;
                      }}
                      className={`rounded-lg border p-3 transition ${
                        active
                          ? "border-white bg-white/[0.08] ring-2 ring-white/30"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div className="text-sm text-white">{p.name}</div>
                      <div className="text-xs text-white/50 mt-0.5">
                        {p.credits.toLocaleString()} credits · ${p.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function IntroCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] to-[#141414] p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden bg-white/5">
        <Image
          src="/images/logo-axolotl-sm.png"
          alt="AXO"
          fill
          sizes="(min-width: 640px) 144px, 112px"
          className="object-contain p-2"
        />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/50 mb-2">
          <Sparkle size={14} weight="fill" /> Try it out
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2">
          Talk to AXO
        </h1>
        <p className="text-white/60 mb-5 max-w-xl">
          Friendly axolotl assistant. Ask about the portal, the tiers, the tools, or the merch — AXO knows it all and can hook you up with early access or a discount.
        </p>
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 py-3 font-medium hover:bg-white/90 transition"
        >
          <Sparkle size={16} weight="fill" />
          Try AXO
        </button>
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
