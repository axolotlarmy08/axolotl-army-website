/**
 * Margin guard — server-only.
 *
 * Used at checkout time to make sure no product is ever sold below cost
 * (Printful product + shipping + Stripe fee + a small buffer).
 *
 * All figures in USD.
 *
 * Printful cost estimates come from their public pricing pages as of
 * April 2026. They drift — re-check each quarter or when Printful emails
 * a price change. See MERCH_MARGINS.md for methodology.
 */

/** Catalog variant_id → conservative all-in cost (product + fulfillment shipping). */
interface CostEstimate {
  /** Printful product cost (what Printful bills us to make the item). */
  productUsd: number;
  /** Printful shipping to a US address, cheapest region. */
  shippingUsUsd: number;
  /** Printful shipping to an international address (EU/CA/AU average). */
  shippingIntlUsd: number;
}

/**
 * Keyed by Printful *catalog* product id, not sync_variant_id. Every sync
 * variant of the same catalog product shares the same cost floor.
 * Numbers are conservative (high-end of Printful's price range).
 */
export const PRINTFUL_COST_ESTIMATES: Record<number, CostEstimate> = {
  // Bella+Canvas 3001 short-sleeve tee
  71: { productUsd: 13.0, shippingUsUsd: 4.69, shippingIntlUsd: 9.5 },
  // Gildan 18500 heavy-blend hoodie
  146: { productUsd: 26.0, shippingUsUsd: 4.69, shippingIntlUsd: 11.0 },
  // Yupoong 6245CM dad cap
  206: { productUsd: 14.0, shippingUsUsd: 4.69, shippingIntlUsd: 9.5 },
};

/** Stripe standard pricing. */
const STRIPE_FEE_PERCENT_US = 0.029;
const STRIPE_FEE_PERCENT_INTL = 0.039;
const STRIPE_FEE_FIXED_USD = 0.3;

/** Minimum net profit we want to clear on any order, per line. */
const MIN_NET_MARGIN_USD = 2.0;

export function stripeFee(amountUsd: number, intl = false): number {
  const pct = intl ? STRIPE_FEE_PERCENT_INTL : STRIPE_FEE_PERCENT_US;
  return Math.round((amountUsd * pct + STRIPE_FEE_FIXED_USD) * 100) / 100;
}

/**
 * The lowest retail price that still clears MIN_NET_MARGIN_USD after
 * Printful product + Printful shipping + Stripe fees.
 * Use the higher of the US/intl numbers if you sell worldwide.
 */
export function computeMinViableRetail(
  catalogVariantId: number,
  intl = false
): number {
  const cost = PRINTFUL_COST_ESTIMATES[catalogVariantId];
  if (!cost) {
    // Unknown product — require a conservative $25 floor.
    return 25;
  }
  const shipping = intl ? cost.shippingIntlUsd : cost.shippingUsUsd;
  const pct = intl ? STRIPE_FEE_PERCENT_INTL : STRIPE_FEE_PERCENT_US;

  // retail = (product + shipping + fixedFee + minMargin) / (1 - pct)
  const raw =
    (cost.productUsd + shipping + STRIPE_FEE_FIXED_USD + MIN_NET_MARGIN_USD) /
    (1 - pct);
  return Math.ceil(raw * 100) / 100;
}

export interface MarginAssertFailure {
  ok: false;
  catalogVariantId: number;
  retailUsd: number;
  minRetailUsd: number;
  reason: string;
}
export interface MarginAssertPass {
  ok: true;
}
export type MarginAssertResult = MarginAssertPass | MarginAssertFailure;

/**
 * Returns a structured result (never throws) — lets the API route
 * decide whether to 400 the checkout or just log and allow.
 */
export function assertRetailCoversCosts(
  retailUsd: number,
  catalogVariantId: number,
  { intl = false }: { intl?: boolean } = {}
): MarginAssertResult {
  if (!(retailUsd > 0)) {
    return {
      ok: false,
      catalogVariantId,
      retailUsd,
      minRetailUsd: computeMinViableRetail(catalogVariantId, intl),
      reason: "retail price is zero or missing",
    };
  }
  const min = computeMinViableRetail(catalogVariantId, intl);
  if (retailUsd < min) {
    return {
      ok: false,
      catalogVariantId,
      retailUsd,
      minRetailUsd: min,
      reason: `retail $${retailUsd.toFixed(2)} below minimum viable $${min.toFixed(
        2
      )}`,
    };
  }
  return { ok: true };
}

/** Net $ the business keeps on one unit sold at retailUsd. */
export function netMargin(
  retailUsd: number,
  catalogVariantId: number,
  intl = false
): number {
  const cost = PRINTFUL_COST_ESTIMATES[catalogVariantId];
  if (!cost) return -Infinity;
  const shipping = intl ? cost.shippingIntlUsd : cost.shippingUsUsd;
  const fee = stripeFee(retailUsd, intl);
  return Math.round((retailUsd - cost.productUsd - shipping - fee) * 100) / 100;
}
