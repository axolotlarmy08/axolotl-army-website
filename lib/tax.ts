/**
 * Tax rate lookup by country + state/province.
 * These are standard sales tax rates for clothing/apparel.
 * Some US states exempt clothing from sales tax.
 *
 * IMPORTANT: Consult an accountant for your specific tax obligations.
 * These rates are approximate and should be verified.
 */

// Canadian provinces — GST (5%) + PST varies
const canadaTax: Record<string, { rate: number; label: string }> = {
  AB: { rate: 0.05, label: "GST (5%)" },
  BC: { rate: 0.12, label: "GST + PST (12%)" },
  MB: { rate: 0.12, label: "GST + PST (12%)" },
  NB: { rate: 0.15, label: "HST (15%)" },
  NL: { rate: 0.15, label: "HST (15%)" },
  NS: { rate: 0.15, label: "HST (15%)" },
  NT: { rate: 0.05, label: "GST (5%)" },
  NU: { rate: 0.05, label: "GST (5%)" },
  ON: { rate: 0.13, label: "HST (13%)" },
  PE: { rate: 0.15, label: "HST (15%)" },
  QC: { rate: 0.14975, label: "GST + QST (14.975%)" },
  SK: { rate: 0.11, label: "GST + PST (11%)" },
  YT: { rate: 0.05, label: "GST (5%)" },
};

// US states — sales tax on clothing (some states exempt clothing)
const usTax: Record<string, { rate: number; label: string }> = {
  AL: { rate: 0.04, label: "Sales Tax (4%)" },
  AK: { rate: 0, label: "No Sales Tax" },
  AZ: { rate: 0.056, label: "Sales Tax (5.6%)" },
  AR: { rate: 0.065, label: "Sales Tax (6.5%)" },
  CA: { rate: 0.0725, label: "Sales Tax (7.25%)" },
  CO: { rate: 0.029, label: "Sales Tax (2.9%)" },
  CT: { rate: 0.0635, label: "Sales Tax (6.35%)" },
  DE: { rate: 0, label: "No Sales Tax" },
  FL: { rate: 0.06, label: "Sales Tax (6%)" },
  GA: { rate: 0.04, label: "Sales Tax (4%)" },
  HI: { rate: 0.04, label: "Sales Tax (4%)" },
  ID: { rate: 0.06, label: "Sales Tax (6%)" },
  IL: { rate: 0.0625, label: "Sales Tax (6.25%)" },
  IN: { rate: 0.07, label: "Sales Tax (7%)" },
  IA: { rate: 0.06, label: "Sales Tax (6%)" },
  KS: { rate: 0.065, label: "Sales Tax (6.5%)" },
  KY: { rate: 0.06, label: "Sales Tax (6%)" },
  LA: { rate: 0.0445, label: "Sales Tax (4.45%)" },
  ME: { rate: 0.055, label: "Sales Tax (5.5%)" },
  MD: { rate: 0.06, label: "Sales Tax (6%)" },
  MA: { rate: 0, label: "No Tax (clothing exempt)" }, // Clothing under $175 exempt
  MI: { rate: 0.06, label: "Sales Tax (6%)" },
  MN: { rate: 0, label: "No Tax (clothing exempt)" }, // Clothing exempt
  MS: { rate: 0.07, label: "Sales Tax (7%)" },
  MO: { rate: 0.04225, label: "Sales Tax (4.225%)" },
  MT: { rate: 0, label: "No Sales Tax" },
  NE: { rate: 0.055, label: "Sales Tax (5.5%)" },
  NV: { rate: 0.0685, label: "Sales Tax (6.85%)" },
  NH: { rate: 0, label: "No Sales Tax" },
  NJ: { rate: 0, label: "No Tax (clothing exempt)" }, // Clothing exempt
  NM: { rate: 0.05125, label: "Sales Tax (5.125%)" },
  NY: { rate: 0, label: "No Tax (clothing exempt)" }, // Clothing under $110 exempt
  NC: { rate: 0.0475, label: "Sales Tax (4.75%)" },
  ND: { rate: 0.05, label: "Sales Tax (5%)" },
  OH: { rate: 0.0575, label: "Sales Tax (5.75%)" },
  OK: { rate: 0.045, label: "Sales Tax (4.5%)" },
  OR: { rate: 0, label: "No Sales Tax" },
  PA: { rate: 0, label: "No Tax (clothing exempt)" }, // Clothing exempt
  RI: { rate: 0, label: "No Tax (clothing exempt)" }, // Clothing exempt
  SC: { rate: 0.06, label: "Sales Tax (6%)" },
  SD: { rate: 0.042, label: "Sales Tax (4.2%)" },
  TN: { rate: 0.07, label: "Sales Tax (7%)" },
  TX: { rate: 0.0625, label: "Sales Tax (6.25%)" },
  UT: { rate: 0.061, label: "Sales Tax (6.1%)" },
  VT: { rate: 0.06, label: "Sales Tax (6%)" },
  VA: { rate: 0.053, label: "Sales Tax (5.3%)" },
  WA: { rate: 0.065, label: "Sales Tax (6.5%)" },
  WV: { rate: 0.06, label: "Sales Tax (6%)" },
  WI: { rate: 0.05, label: "Sales Tax (5%)" },
  WY: { rate: 0.04, label: "Sales Tax (4%)" },
  DC: { rate: 0.06, label: "Sales Tax (6%)" },
};

// Other countries — VAT/GST rates (simplified)
const otherTax: Record<string, { rate: number; label: string }> = {
  GB: { rate: 0.20, label: "VAT (20%)" },
  DE: { rate: 0.19, label: "VAT (19%)" },
  FR: { rate: 0.20, label: "VAT (20%)" },
  AU: { rate: 0.10, label: "GST (10%)" },
  JP: { rate: 0.10, label: "Consumption Tax (10%)" },
  MX: { rate: 0.16, label: "IVA (16%)" },
  NL: { rate: 0.21, label: "VAT (21%)" },
  ES: { rate: 0.21, label: "VAT (21%)" },
  IT: { rate: 0.22, label: "VAT (22%)" },
  SE: { rate: 0.25, label: "VAT (25%)" },
  NO: { rate: 0.25, label: "VAT (25%)" },
  DK: { rate: 0.25, label: "VAT (25%)" },
  NZ: { rate: 0.15, label: "GST (15%)" },
  IE: { rate: 0.23, label: "VAT (23%)" },
  BR: { rate: 0, label: "Tax included" },
};

export interface TaxResult {
  rate: number;
  label: string;
  amount: number;
}

export function calculateTax(
  subtotal: number,
  countryCode: string,
  stateCode: string
): TaxResult {
  let taxInfo: { rate: number; label: string } | undefined;

  if (countryCode === "CA") {
    taxInfo = canadaTax[stateCode];
  } else if (countryCode === "US") {
    taxInfo = usTax[stateCode];
  } else {
    taxInfo = otherTax[countryCode];
  }

  if (!taxInfo) {
    return { rate: 0, label: "Tax", amount: 0 };
  }

  const amount = Math.round(subtotal * taxInfo.rate * 100) / 100;

  return {
    rate: taxInfo.rate,
    label: taxInfo.label,
    amount,
  };
}
