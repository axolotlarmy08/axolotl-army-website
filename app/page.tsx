import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ScrollAnimation from "@/components/ScrollAnimation";
import StudioShowcase from "@/components/home/StudioShowcase";
import PresetsRow from "@/components/home/PresetsRow";
import Characters from "@/components/Characters";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ScrollAnimation />
        <StudioShowcase />
        <PresetsRow />
        <Characters />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
