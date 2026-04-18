"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SpinnerGap, ShoppingBag, CheckCircle } from "@phosphor-icons/react";
import { useCart } from "@/components/CartProvider";
import type { MerchProduct, ProductsApiResponse } from "@/lib/merch-types";

interface Props {
  syncProductId: number;
}

export default function ProductDetail({ syncProductId }: Props) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<MerchProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSyncVariantId, setSelectedSyncVariantId] = useState<
    number | null
  >(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [view, setView] = useState<"front" | "back">("front");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/printful/products");
      if (!res.ok) return setNotFound(true);
      const data: ProductsApiResponse = await res.json();
      const found = data.products.find((p) => p.syncProductId === syncProductId);
      if (!found) return setNotFound(true);
      setProduct(found);
      setSelectedColor(found.colors[0]?.color ?? null);
    })();
  }, [syncProductId]);

  const currentColor = useMemo(() => {
    if (!product || !selectedColor) return null;
    return product.colors.find((c) => c.color === selectedColor) ?? null;
  }, [product, selectedColor]);

  // Reset size selection whenever color changes; also reset to front view.
  useEffect(() => {
    setSelectedSyncVariantId(currentColor?.sizes[0]?.syncVariantId ?? null);
    setView("front");
  }, [currentColor]);

  const hasBack = !!currentColor?.backImage;
  const activeImage =
    view === "back" && currentColor?.backImage
      ? currentColor.backImage
      : currentColor?.image;

  // Human label for the main image's side — the API tells us which side the
  // Printful mockup actually shows (it's not always the front).
  const mainSideLabel = (() => {
    switch (currentColor?.imageSide) {
      case "front":
        return "Front";
      case "back":
        return "Back";
      case "left":
        return "Left";
      case "right":
        return "Right";
      case "sleeve":
        return "Sleeve";
      default:
        return "View";
    }
  })();

  const selectedSize = useMemo(() => {
    if (!currentColor || selectedSyncVariantId == null) return null;
    return currentColor.sizes.find(
      (s) => s.syncVariantId === selectedSyncVariantId
    );
  }, [currentColor, selectedSyncVariantId]);

  if (notFound) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-medium mb-2">
            That product isn&apos;t available.
          </p>
          <a href="/merch" className="text-accent text-sm hover:underline">
            Back to merch
          </a>
        </div>
      </div>
    );
  }

  if (!product || !currentColor) {
    return (
      <div className="flex items-center justify-center py-20">
        <SpinnerGap size={28} className="text-accent animate-spin" />
      </div>
    );
  }

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem({
      id: `${selectedSize.syncVariantId}`,
      characterName: product.name,
      characterImage: currentColor.image,
      productType: product.name,
      productLabel: product.name,
      syncVariantId: selectedSize.syncVariantId,
      variantId: selectedSize.variantId,
      size: selectedSize.size,
      color: currentColor.color,
      price: selectedSize.retailPrice,
      quantity: qty,
      mockupUrl: currentColor.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
      {/* Image + view toggle. Printful only generates one on-garment mockup
          per product (whichever side has the print); the "Back print" thumb
          is the raw back-design artwork, not a photo of the back of the shirt. */}
      <div>
        <div className="aspect-square rounded-3xl overflow-hidden bg-surface border border-border/30 relative">
          <Image
            src={activeImage || currentColor.image}
            alt={`${product.name} in ${currentColor.color} (${view})`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={view === "back" ? "object-contain p-8" : "object-cover"}
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur border border-border/40">
            <span className="text-xs uppercase tracking-wider text-foreground font-medium">
              {view === "back" ? "Back print" : mainSideLabel}
            </span>
          </div>
        </div>

        {hasBack && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setView("front")}
              className={`flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all relative ${
                view === "front" ? "border-accent" : "border-border/30 hover:border-muted"
              }`}
            >
              <Image
                src={currentColor.image}
                alt={`${mainSideLabel} view`}
                fill
                sizes="120px"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur py-1">
                <span className="text-[10px] uppercase tracking-wider text-foreground font-medium">
                  {mainSideLabel}
                </span>
              </div>
            </button>
            <button
              onClick={() => setView("back")}
              className={`flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all relative bg-surface ${
                view === "back" ? "border-accent" : "border-border/30 hover:border-muted"
              }`}
            >
              <Image
                src={currentColor.backImage!}
                alt="Back print design"
                fill
                sizes="120px"
                className="object-contain p-3"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur py-1">
                <span className="text-[10px] uppercase tracking-wider text-foreground font-medium">
                  Back print
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          {product.name}
        </h1>
        <p className="text-2xl font-semibold text-foreground mb-6">
          ${(selectedSize?.retailPrice ?? product.startingPrice).toFixed(2)}
        </p>
        <p className="text-muted text-sm leading-relaxed mb-8">
          Free shipping worldwide. Printed and shipped by Printful from the
          facility nearest you.
        </p>

        {/* Color picker */}
        {product.colors.length > 1 && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-muted mb-3">
              Color: <span className="text-foreground">{currentColor.color}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.color}
                  onClick={() => setSelectedColor(c.color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    c.color === selectedColor
                      ? "border-accent scale-110"
                      : "border-border/40 hover:border-muted"
                  }`}
                  style={{ backgroundColor: c.colorCode }}
                  aria-label={c.color}
                  title={c.color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size picker */}
        {currentColor.sizes.length > 1 && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-muted mb-3">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {currentColor.sizes.map((s) => (
                <button
                  key={s.syncVariantId}
                  onClick={() => setSelectedSyncVariantId(s.syncVariantId)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    s.syncVariantId === selectedSyncVariantId
                      ? "border-accent text-foreground bg-accent/10"
                      : "border-border/40 text-muted hover:border-muted hover:text-foreground"
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-muted mb-3">
            Quantity
          </p>
          <select
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value))}
            className="bg-surface border border-border/30 rounded-xl px-4 py-2 text-sm text-foreground"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={!selectedSize || added}
          className="w-full inline-flex items-center justify-center gap-2 bg-accent text-background font-medium py-3.5 rounded-full text-base hover:bg-accent-dim transition-colors active:scale-[0.98] disabled:opacity-60"
        >
          {added ? (
            <>
              <CheckCircle size={18} weight="fill" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              Add to Cart
            </>
          )}
        </button>
        <a
          href="/merch"
          className="block w-full text-center text-muted hover:text-foreground text-sm py-3 mt-1 transition-colors"
        >
          ← Back to all merch
        </a>
      </div>
    </div>
  );
}
