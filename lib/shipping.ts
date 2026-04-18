/**
 * Shipping time estimator for Printful-fulfilled products.
 *
 * Combines the fulfillment regions Printful exposes for a catalog product
 * with the buyer's destination country to produce a realistic delivery
 * window. Used to flag products that will ship internationally from the
 * destination's perspective and to show a total estimate on checkout.
 *
 * Figures are conservative — Printful quotes 2–5 days for "flat rate"
 * domestic plus 5–10 days for international. We add 2–3 days of production
 * time on top.
 */

export interface ShippingEstimate {
  /** Lower bound in business days. */
  minDays: number;
  /** Upper bound in business days. */
  maxDays: number;
  /** Which Printful region will fulfil this for this destination. */
  fulfillsFrom: string;
  /** True if no fulfillment region is near the destination → international. */
  isInternational: boolean;
  /** Short human-readable blurb we can drop into UI copy. */
  label: string;
}

/**
 * Buckets countries into Printful's fulfillment geography. Each bucket
 * maps to one or more regions that Printful uses ("US", "CA", "EU", "UK",
 * "AU", "JP", "BR"). Countries outside these buckets fall back to "other
 * international".
 */
function destinationBucket(countryCode: string): string[] {
  const c = countryCode.toUpperCase();
  // North America — US facility serves CA/MX/US well; CA facility when present.
  if (c === "US") return ["US"];
  if (c === "CA") return ["CA", "US"]; // CA first (domestic), US second (close intl)
  if (c === "MX") return ["US"]; // Printful Mexico usually fulfils from US
  // UK
  if (c === "GB" || c === "UK") return ["UK", "EU"];
  // EU members (partial list — good enough for routing)
  if (
    [
      "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU",
      "IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
      "NO","CH","IS",
    ].includes(c)
  )
    return ["EU", "UK"];
  // Asia-Pacific
  if (c === "AU" || c === "NZ") return ["AU"];
  if (c === "JP") return ["JP"];
  // South America
  if (c === "BR") return ["BR", "US"];
  return ["US"]; // fallback — ship from the largest facility
}

/** All regions that Printful considers North American for fulfillment. */
const NA_REGIONS = new Set(["US", "CA"]);

/**
 * Best-estimate shipping window for (fulfillmentRegions × destinationCountry).
 * Production is always 2–5 business days; the spread below is shipping only.
 */
export function estimateShipping(
  fulfillmentRegions: string[],
  destinationCountryCode: string
): ShippingEstimate {
  // Normalise Printful's many EU sub-regions (EU_LV, EU_ES…) down to just "EU".
  const regions = new Set(
    fulfillmentRegions.map((r) => (r.startsWith("EU") ? "EU" : r))
  );

  const bucket = destinationBucket(destinationCountryCode);

  // Does the product have ANY facility in the buyer's preferred region?
  const matchedRegion = bucket.find((r) => regions.has(r));

  const c = destinationCountryCode.toUpperCase();

  // Production always takes ~2–5 business days before shipping.
  const productionMin = 2;
  const productionMax = 5;

  if (matchedRegion && matchedRegion === c) {
    // Fulfilled domestically — e.g. US order from US facility
    return {
      minDays: productionMin + 2,
      maxDays: productionMax + 5,
      fulfillsFrom: matchedRegion,
      isInternational: false,
      label: "Domestic shipping",
    };
  }

  if (matchedRegion && NA_REGIONS.has(matchedRegion) && NA_REGIONS.has(c)) {
    // US→CA or CA→US — close neighbour, not quite domestic
    return {
      minDays: productionMin + 3,
      maxDays: productionMax + 7,
      fulfillsFrom: matchedRegion,
      isInternational: true, // customs possible CA→US
      label: "North America",
    };
  }

  if (matchedRegion) {
    // Regional — same continent, e.g. EU→UK or EU country → EU region
    return {
      minDays: productionMin + 4,
      maxDays: productionMax + 8,
      fulfillsFrom: matchedRegion,
      isInternational: false,
      label: "Regional shipping",
    };
  }

  // No match in the buyer's bucket — ships intercontinentally from wherever
  // the product IS available. Prefer US, then EU, then whatever is first.
  const intlFrom =
    (regions.has("US") && "US") ||
    (regions.has("EU") && "EU") ||
    (regions.has("UK") && "UK") ||
    [...regions][0] ||
    "US";

  return {
    minDays: productionMin + 8,
    maxDays: productionMax + 13,
    fulfillsFrom: intlFrom,
    isInternational: true,
    label: `Ships from ${
      intlFrom === "UK" ? "the UK" : intlFrom === "EU" ? "Europe" : intlFrom
    }`,
  };
}

/**
 * Aggregate multiple per-line estimates into one whole-cart window. Min of
 * mins, max of maxes — the buyer waits until the latest item arrives.
 */
export function combineEstimates(
  estimates: ShippingEstimate[]
): { minDays: number; maxDays: number; anyInternational: boolean } {
  if (estimates.length === 0) {
    return { minDays: 0, maxDays: 0, anyInternational: false };
  }
  let minDays = Infinity;
  let maxDays = 0;
  let anyInternational = false;
  for (const e of estimates) {
    if (e.minDays < minDays) minDays = e.minDays;
    if (e.maxDays > maxDays) maxDays = e.maxDays;
    if (e.isInternational) anyInternational = true;
  }
  return { minDays, maxDays, anyInternational };
}

/**
 * Quick "does ANY fulfillment region reach North American customers
 * without crossing the Atlantic?" — used for the merch grid badge.
 */
export function hasNorthAmericaFulfillment(
  fulfillmentRegions: string[]
): boolean {
  return fulfillmentRegions.some((r) => r === "US" || r === "CA");
}
