import AxoExperience from "@/components/axo/AxoExperience";

// Chrome-less AXO — the exact same sales assistant as /axo, with no Nav or
// Footer, so it can be framed seamlessly inside the Portal landing page
// (portal.axolotlarmy.net/portal-coming-soon) under the pricing. Same brain,
// same offerings, same lead capture, same merch — one source of truth.
//
// Framing is restricted to the portal + this site via a frame-ancestors CSP
// in next.config.ts. noindex so it doesn't compete with /axo in search.

export const metadata = {
  title: "AXO",
  robots: { index: false, follow: false },
};

export default function AxoEmbedPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-3 py-4 sm:px-4 sm:py-6">
      {/* autoOpen: open straight into the live chat (no "Try AXO" intro card)
          since this is framed into the Portal landing page. */}
      <AxoExperience autoOpen />
    </main>
  );
}
