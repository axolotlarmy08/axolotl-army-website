import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/merch/ProductDetail";

export const metadata = {
  title: "Axolotl Army Merch",
  description: "Official Axolotl Army gear. Free shipping worldwide.",
};

export default async function MerchProductPage({
  params,
}: {
  params: Promise<{ syncProductId: string }>;
}) {
  const { syncProductId } = await params;
  const id = parseInt(syncProductId, 10);

  return (
    <>
      <Nav />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {Number.isFinite(id) ? (
            <ProductDetail syncProductId={id} />
          ) : (
            <div className="text-center py-20">
              <p className="text-muted">Invalid product.</p>
              <a href="/merch" className="text-accent text-sm hover:underline mt-4 inline-block">
                Back to merch
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
