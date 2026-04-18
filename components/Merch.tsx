import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";
import ProductGrid from "./merch/ProductGrid";

export default function Merch() {
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
                Official Axolotl Army gear. Tees, hoodies, and caps featuring the
                crew. Free shipping worldwide.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Product grid */}
        <RevealOnScroll>
          <ProductGrid />
        </RevealOnScroll>
      </div>
    </section>
  );
}
