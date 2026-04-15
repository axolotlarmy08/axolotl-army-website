import Nav from "@/components/Nav";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Features — Axolotl Army",
  description:
    "Everything the Axolotl Army platform does — from a 40-agent AI pipeline to multi-platform publishing, brand consistency, and analytics.",
};

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="pt-32 pb-8 px-6">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-accent font-mono text-sm tracking-wider uppercase mb-4">
              Platform
            </p>
            <h1 className="text-4xl md:text-6xl tracking-tighter leading-none font-bold text-foreground mb-6 max-w-3xl">
              Everything you need to scale video content
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-[60ch]">
              A full AI video pipeline — scripting, generation, quality
              review, and distribution — packaged for creators, agencies,
              and brand teams.
            </p>
          </div>
        </section>
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
