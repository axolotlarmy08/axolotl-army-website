import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AxoExperience from "@/components/axo/AxoExperience";

export const metadata = {
  title: "Talk to AXO — Axolotl Army",
  description:
    "Chat with AXO, the Axolotl Army assistant. Ask about the portal, tiers, tools, and merch — get early access or a discount on the spot.",
};

export default function AxoPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <AxoExperience />
      </main>
      <Footer />
    </>
  );
}
