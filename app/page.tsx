import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ScrollAnimation from "@/components/ScrollAnimation";
import OutputFormats from "@/components/home/OutputFormats";
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
        <OutputFormats />
        <Characters />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
