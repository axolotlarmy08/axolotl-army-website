"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, SpinnerGap, Ruler } from "@phosphor-icons/react";

interface ChartMeasurement {
  type_label: string;
  values: Array<{ size: string; value: string }>;
}
interface SizeTable {
  type: string;
  unit: string;
  description?: string;
  image_url?: string;
  image_description?: string;
  measurements?: ChartMeasurement[];
}
interface SizeChart {
  catalog_product_id: number;
  available_sizes: string[];
  size_tables: SizeTable[];
}

interface Props {
  syncProductId: number;
  productName: string;
  open: boolean;
  onClose: () => void;
}

export default function SizeChartModal({
  syncProductId,
  productName,
  open,
  onClose,
}: Props) {
  const [chart, setChart] = useState<SizeChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Tracks an in-flight fetch so re-renders don't spawn duplicates and
  // we don't accidentally cancel a request we just started.
  const fetchedRef = useRef<{ syncProductId: number } | null>(null);

  // Fetch the chart the first time the modal is opened (cached server-side).
  useEffect(() => {
    if (!open) return;
    // Already fetched for this product — nothing to do.
    if (fetchedRef.current?.syncProductId === syncProductId) return;
    fetchedRef.current = { syncProductId };
    let cancelled = false;
    setLoading(true);
    setError(null);
    setChart(null);
    (async () => {
      try {
        const res = await fetch(`/api/printful/size-chart/${syncProductId}`);
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (!cancelled) setChart(data.chart);
      } catch {
        if (!cancelled) setError("Couldn't load size chart.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally only keyed on open/syncProductId so fetch doesn't re-fire
    // on every state update (setLoading/setChart would otherwise retrigger it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, syncProductId]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = orig;
    };
  }, [open, onClose]);

  if (!open) return null;

  // Prefer "measure_yourself" table — body measurements are what shoppers
  // actually want. Fall back to product_measure, then whatever's first.
  const preferred =
    chart?.size_tables.find((t) => t.type === "measure_yourself") ||
    chart?.size_tables.find((t) => t.type === "product_measure") ||
    chart?.size_tables[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-background border border-border/40 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              Size chart
            </p>
            <h3 className="text-lg font-semibold text-foreground">{productName}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <SpinnerGap size={28} className="text-accent animate-spin" />
            </div>
          )}

          {error && (
            <p className="text-center text-red-400 py-8">{error}</p>
          )}

          {!loading && !error && !preferred && chart && (
            <p className="text-center text-muted py-8">
              No size chart published for this item.
            </p>
          )}

          {preferred && (
            <div className="space-y-6">
              {preferred.image_url && (
                <div className="rounded-2xl overflow-hidden bg-white relative aspect-[3/2]">
                  <Image
                    src={preferred.image_url}
                    alt="Size measurement guide"
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-contain"
                  />
                </div>
              )}

              {preferred.measurements && preferred.measurements.length > 0 && (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border/30">
                        <th className="py-2 pr-4">
                          Size ({preferred.unit})
                        </th>
                        {preferred.measurements.map((m) => (
                          <th key={m.type_label} className="py-2 pr-4">
                            {m.type_label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chart!.available_sizes.map((size) => (
                        <tr
                          key={size}
                          className="border-b border-border/20 last:border-0"
                        >
                          <td className="py-2.5 pr-4 font-medium text-foreground">
                            {size}
                          </td>
                          {preferred.measurements!.map((m) => {
                            const v = m.values.find((x) => x.size === size);
                            return (
                              <td key={m.type_label} className="py-2.5 pr-4 text-muted">
                                {v?.value ?? "—"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {preferred.image_description && (
                <div
                  className="text-xs text-muted leading-relaxed space-y-2 prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-headings:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: preferred.image_description,
                  }}
                />
              )}

              {preferred.description && (
                <p
                  className="text-[11px] text-muted/60 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: preferred.description }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SizeChartButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent hover:text-accent-dim transition-colors ${className}`}
    >
      <Ruler size={14} />
      Size chart
    </button>
  );
}
