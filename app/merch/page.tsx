import Nav from "@/components/Nav";
import Merch from "@/components/Merch";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Merch — Axolotl Army",
  description:
    "Axolotl Army merchandise — coming soon. Drop your email and we'll let you know the moment it launches.",
};

export default function MerchPage() {
  return (
    <>
      <Nav />
      <main className="pt-24">
        <Merch />
      </main>
      <Footer />
    </>
  );
}
