import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ScrollAnimation from "@/components/ScrollAnimation";
import FeatureStrip from "@/components/home/FeatureStrip";
import ShowreelTeaser from "@/components/home/ShowreelTeaser";
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
        <FeatureStrip />
        <ShowreelTeaser />
        <Characters />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
