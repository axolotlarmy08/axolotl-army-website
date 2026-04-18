"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SpinnerGap } from "@phosphor-icons/react";
import type { MerchProduct, ProductsApiResponse } from "@/lib/merch-types";

export default function ProductGrid() {
  const [products, setProducts] = useState<MerchProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/printful/products");
        if (!res.ok) throw new Error("Failed to load");
        const data: ProductsApiResponse = await res.json();
        if (!cancelled) setProducts(data.products);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-20 text-muted">
        Couldn&apos;t load products. Try refreshing.
      </div>
    );
  }

  if (!products) {
    return (
      <div className="flex items-center justify-center py-20">
        <SpinnerGap size={28} className="text-accent animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">The store is being stocked. Check back shortly.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <a
          key={p.syncProductId}
          href={`/merch/${p.syncProductId}`}
          className="group rounded-3xl bg-surface border border-border/30 overflow-hidden hover:border-accent/40 transition-colors"
        >
          <div className="aspect-square bg-surface-elevated relative overflow-hidden">
            <Image
              src={p.thumbnail}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            {p.colors.some((c) => c.backImage) && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-border/40">
                <span className="text-[10px] uppercase tracking-wider text-foreground font-medium">
                  Front + Back
                </span>
              </div>
            )}
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-foreground font-medium text-sm truncate">
                {p.name}
              </p>
              <p className="text-muted text-xs mt-0.5">
                {p.colors.length} color{p.colors.length === 1 ? "" : "s"}
              </p>
            </div>
            <p className="text-foreground text-base font-semibold">
              ${p.startingPrice.toFixed(2)}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
