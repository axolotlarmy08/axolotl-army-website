import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ScrollAnimation from "@/components/ScrollAnimation";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Characters from "@/components/Characters";
import Merch from "@/components/Merch";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ScrollAnimation />
        <Features />
        <HowItWorks />
        <Characters />
        <Merch />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
