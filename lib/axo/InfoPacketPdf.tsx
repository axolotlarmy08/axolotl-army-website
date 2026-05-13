/**
 * Axolotl Army info-packet PDF. Rendered server-side via @react-pdf/renderer
 * and attached to the AXO chat lead email.
 *
 * Pure JSX/React-PDF — no headless browser, runs cleanly on Vercel.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import { AXO_TIERS, AXO_ADDONS, AXO_CREDIT_PACKS } from "./offerings";

const COLORS = {
  bg: "#0a0a0a",
  card: "#141414",
  border: "#2a2a2a",
  accent: "#7dd3fc",
  text: "#f5f5f5",
  muted: "#9ca3af",
  dim: "#666",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  cover: {
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    padding: 0,
    fontFamily: "Helvetica",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  coverInner: {
    padding: 48,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  characterImg: {
    width: 220,
    height: 220,
    objectFit: "contain",
    marginBottom: 24,
  },
  wordmark: {
    width: 320,
    height: 80,
    objectFit: "contain",
    marginBottom: 16,
  },
  coverEyebrow: {
    fontSize: 9,
    letterSpacing: 3,
    color: COLORS.muted,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 380,
  },
  coverFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    color: COLORS.muted,
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionKicker: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.accent,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  tierCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  tierHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  tierName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
  },
  tierPrice: {
    fontSize: 11,
    color: COLORS.accent,
    fontFamily: "Helvetica-Bold",
  },
  tierTag: {
    fontSize: 9.5,
    color: COLORS.muted,
    marginBottom: 8,
    fontStyle: "italic",
  },
  twoCol: {
    flexDirection: "row",
    gap: 14,
  },
  col: {
    flex: 1,
  },
  colLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 2,
  },
  bulletDot: {
    width: 8,
    color: COLORS.accent,
  },
  bulletDotMuted: {
    width: 8,
    color: COLORS.dim,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: COLORS.text,
  },
  bulletTextMuted: {
    flex: 1,
    fontSize: 9,
    color: COLORS.dim,
  },
  addonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  addonName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
  },
  addonBlurb: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
  },
  addonPrice: {
    fontSize: 11,
    color: COLORS.accent,
    fontFamily: "Helvetica-Bold",
    whiteSpace: "nowrap" as unknown as undefined,
  },
  packGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  packCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
  },
  ctaBox: {
    marginTop: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
  },
  ctaTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 6,
  },
  ctaLine: {
    fontSize: 10,
    color: COLORS.text,
    marginBottom: 4,
  },
  ctaLink: {
    color: COLORS.accent,
    textDecoration: "underline",
  },
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 8,
    color: COLORS.dim,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  highlightBox: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#0a1f2a",
  },
});

interface InfoPacketProps {
  visitorName?: string | null;
  highlightTierName?: string | null;
  baseUrl: string;
}

export function InfoPacketPdf({
  visitorName,
  highlightTierName,
  baseUrl,
}: InfoPacketProps) {
  const firstName = visitorName?.split(/\s+/)[0]?.trim() || null;
  const characterUrl = `${baseUrl}/brand/axolotl-character.png`;
  const wordmarkUrl = `${baseUrl}/brand/axolotl-wordmark.png`;
  const highlightTier = highlightTierName
    ? AXO_TIERS.find(
        (t) => t.name.toLowerCase() === highlightTierName.toLowerCase()
      )
    : null;

  return (
    <Document
      title="Axolotl Army — your full breakdown"
      author="Axolotl Army"
      subject="Tiers, add-ons, credits, and how to get started"
    >
      {/* Cover */}
      <Page size="LETTER" style={styles.cover}>
        <View style={styles.coverInner}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={characterUrl} style={styles.characterImg} />
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={wordmarkUrl} style={styles.wordmark} />
          <Text style={styles.coverEyebrow}>YOUR BREAKDOWN</Text>
          <Text style={styles.coverTitle}>
            {firstName ? `Hey ${firstName} —` : "Welcome."}
          </Text>
          <Text style={styles.coverSubtitle}>
            Everything Axolotl Army offers, in one document. Tiers, add-ons,
            credit packs, and exactly where to start. Built by AXO from the
            chat on axolotlarmy.net.
          </Text>
        </View>
        <View style={styles.coverFooter}>
          <Text>axolotlarmy.net</Text>
          <Text>portal.axolotlarmy.net</Text>
        </View>
      </Page>

      {/* Tiers */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionKicker}>SECTION 01</Text>
        <Text style={styles.sectionTitle}>Tiers</Text>
        <Text style={{ ...styles.tierTag, marginBottom: 14, fontStyle: "normal" }}>
          Subscriptions. Every higher tier includes everything below it.
        </Text>

        {highlightTier && (
          <View style={styles.highlightBox} wrap={false}>
            <Text
              style={{
                fontSize: 9,
                color: COLORS.accent,
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              YOU ASKED ABOUT
            </Text>
            <TierCard tier={highlightTier} />
          </View>
        )}

        {AXO_TIERS.filter((t) => t.name !== highlightTier?.name).map((t) => (
          <TierCard key={t.name} tier={t} />
        ))}

        <FooterText page="01 — Tiers" />
      </Page>

      {/* Add-ons */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionKicker}>SECTION 02</Text>
        <Text style={styles.sectionTitle}>Add-ons</Text>
        <Text style={{ ...styles.tierTag, marginBottom: 14, fontStyle: "normal" }}>
          A-la-carte monthly. Add to any tier. Most are baked into higher
          tiers — see the &quot;Not included&quot; lines under each tier.
        </Text>
        <View
          style={{
            backgroundColor: COLORS.card,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {AXO_ADDONS.map((a, i) => (
            <View
              key={a.name}
              style={[
                styles.addonRow,
                i === AXO_ADDONS.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
              wrap={false}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.addonName}>{a.name}</Text>
                <Text style={styles.addonBlurb}>{a.blurb}</Text>
              </View>
              <Text style={styles.addonPrice}>${a.monthlyPrice}/mo</Text>
            </View>
          ))}
        </View>
        <FooterText page="02 — Add-ons" />
      </Page>

      {/* Credit packs + CTAs */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionKicker}>SECTION 03</Text>
        <Text style={styles.sectionTitle}>Credit packs</Text>
        <Text style={{ ...styles.tierTag, marginBottom: 14, fontStyle: "normal" }}>
          One-time top-ups for any tier. Bigger packs = bigger per-credit
          discount.
        </Text>
        <View style={styles.packGrid}>
          {AXO_CREDIT_PACKS.map((p) => (
            <View key={p.name} style={styles.packCard} wrap={false}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 12 }}>
                {p.name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Helvetica-Bold",
                  color: COLORS.accent,
                  marginVertical: 4,
                }}
              >
                ${p.price}
              </Text>
              <Text style={{ fontSize: 10, marginBottom: 4 }}>
                {p.credits.toLocaleString()} credits
              </Text>
              <Text style={{ fontSize: 9, color: COLORS.muted }}>
                {p.blurb}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{ ...styles.sectionKicker, marginTop: 24 }}>
          SECTION 04
        </Text>
        <Text style={styles.sectionTitle}>When you&apos;re ready</Text>
        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Sign up for the portal</Text>
          <Text style={styles.ctaLine}>
            Create an account on Starter (free) and try the video generators:
            {" "}
            <Link src="https://portal.axolotlarmy.net/register" style={styles.ctaLink}>
              portal.axolotlarmy.net/register
            </Link>
          </Text>
        </View>
        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Browse merch</Text>
          <Text style={styles.ctaLine}>
            Shirts, hats, mugs, posters, water bottles —{" "}
            <Link src="https://www.axolotlarmy.net/merch" style={styles.ctaLink}>
              axolotlarmy.net/merch
            </Link>
          </Text>
        </View>
        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Keep chatting with AXO</Text>
          <Text style={styles.ctaLine}>
            Any other question, even niche ones:{" "}
            <Link src="https://www.axolotlarmy.net/axo" style={styles.ctaLink}>
              axolotlarmy.net/axo
            </Link>
          </Text>
        </View>
        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Reply directly</Text>
          <Text style={styles.ctaLine}>
            Email replies go straight to the team. Real humans, fast turnaround.
          </Text>
        </View>

        <FooterText page="03 — Credits & next steps" />
      </Page>
    </Document>
  );
}

function TierCard({ tier }: { tier: (typeof AXO_TIERS)[number] }) {
  const price =
    tier.monthlyPrice === 0
      ? "Free"
      : `$${tier.monthlyPrice.toLocaleString()}/mo`;
  return (
    <View style={styles.tierCard} wrap={false}>
      <View style={styles.tierHead}>
        <Text style={styles.tierName}>{tier.name}</Text>
        <Text style={styles.tierPrice}>
          {price}
          {tier.creditsUsd ? ` · $${tier.creditsUsd}/mo credits` : ""}
        </Text>
      </View>
      <Text style={styles.tierTag}>{tier.tagline}</Text>
      <View style={styles.twoCol}>
        <View style={styles.col}>
          <Text style={styles.colLabel}>Included</Text>
          {tier.highlights.map((h) => (
            <View key={h} style={styles.bullet}>
              <Text style={styles.bulletDot}>+</Text>
              <Text style={styles.bulletText}>{h}</Text>
            </View>
          ))}
        </View>
        {tier.notIncluded?.length ? (
          <View style={styles.col}>
            <Text style={styles.colLabel}>Not included</Text>
            {tier.notIncluded.map((n) => (
              <View key={n} style={styles.bullet}>
                <Text style={styles.bulletDotMuted}>·</Text>
                <Text style={styles.bulletTextMuted}>{n}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function FooterText({ page }: { page: string }) {
  return (
    <View style={styles.pageFooter} fixed>
      <Text>Axolotl Army · axolotlarmy.net</Text>
      <Text>{page}</Text>
    </View>
  );
}
