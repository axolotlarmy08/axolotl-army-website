# Merch Margins — Axolotl Army

> Last reviewed: 2026-04-17. Re-run this math any time Printful bumps product
> costs or Stripe changes their fee schedule. Source of truth for prices is
> each sync product's `retail_price` in the **Printful dashboard** — not this
> file and not `lib/printful.ts`.

## Pricing model

- **Customer pays:** `retail_price` (set in Printful) + sales tax.
- **Website charges $0 shipping.** Shipping cost is baked into every
  `retail_price` so the checkout only ever shows one line.
- This keeps us from double-charging shipping (the old `SHIPPING_CONFIG`
  flat rate has been removed from the site).

## Cost stack per order line

For every unit sold we pay:

1. **Printful product cost** — what Printful bills us to print and manufacture.
2. **Printful shipping cost** — what Printful bills us to deliver to the
   customer. Varies by destination.
3. **Stripe fee** — 2.9% + $0.30 on US cards, 3.9% + $0.30 on international.
4. **Sales tax** — passed through to the state. Not a margin hit, not shown here.

Code source of truth: [`lib/margins.ts`](lib/margins.ts) — estimates per
catalog variant id, and `computeMinViableRetail` which enforces a
**$2 minimum net profit** per unit.

## Per-product P&L (USD)

Assumes the floor Printful retail price set in the dashboard. If the real
retail is higher, net margin goes up by the delta.

### Bella+Canvas 3001 Tee (catalog id 71)

| Destination | Retail | − Printful product | − Printful ship | − Stripe fee | **Net** |
|---|---|---|---|---|---|
| US          | $29.00 | $13.00 | $4.69 | $1.14 | **$10.17** |
| US          | $34.00 | $13.00 | $4.69 | $1.29 | **$15.02** |
| Intl (EU/CA/AU) | $29.00 | $13.00 | $9.50 | $1.43 | **$5.07** |
| Intl (EU/CA/AU) | $34.00 | $13.00 | $9.50 | $1.63 | **$9.87** |

**Minimum viable retail** (keeps ≥ $2 net after all costs):
- US: **$22.08**
- International: **$27.13**

### Gildan 18500 Hoodie (catalog id 146)

| Destination | Retail | − Printful product | − Printful ship | − Stripe fee | **Net** |
|---|---|---|---|---|---|
| US | $58.00 | $26.00 | $4.69 | $1.98 | **$25.33** |
| US | $65.00 | $26.00 | $4.69 | $2.19 | **$32.12** |
| Intl | $58.00 | $26.00 | $11.00 | $2.56 | **$18.44** |
| Intl | $65.00 | $26.00 | $11.00 | $2.84 | **$25.16** |

**Minimum viable retail:**
- US: **$34.93**
- International: **$41.52**

### Yupoong 6245CM Dad Cap (catalog id 206)

| Destination | Retail | − Printful product | − Printful ship | − Stripe fee | **Net** |
|---|---|---|---|---|---|
| US | $24.00 | $14.00 | $4.69 | $1.00 | **$4.31** |
| US | $28.00 | $14.00 | $4.69 | $1.11 | **$8.20** |
| Intl | $24.00 | $14.00 | $9.50 | $1.24 | **–$0.74**  ⚠ loss |
| Intl | $28.00 | $14.00 | $9.50 | $1.39 | **$3.11** |

**Minimum viable retail:**
- US: **$23.14**
- International: **$28.17**

> ⚠ **Caps are the tightest margin.** At <$28 retail, an international sale
> can net near zero. Two options: bump cap retail price to $29–32, or
> restrict international sales on caps only. The margin guard in
> `lib/margins.ts` will reject the sale automatically if retail falls below
> the minimum for the buyer's destination.

## How the margin guard works

- Every time `/api/printful/products` loads the catalog, each sync variant
  is run through `assertRetailCoversCosts`. Variants below the viable floor
  **don't appear on the site** — they get logged (`console.warn`) instead
  of shown to buyers.
- Every time `/api/checkout` creates a PaymentIntent, it re-runs
  `assertRetailCoversCosts` against the buyer's destination (US vs. intl).
  If any line would lose money, the API returns a 400 before charging.

This gives you two layers of protection:

1. UI filter — a mispriced product never shows up in the grid.
2. API filter — even if a stale cart/URL points to a mispriced variant,
   checkout refuses the sale.

## How to fix a mispriced product in Printful

1. Open Printful dashboard → **Stores → Your store → edit that product**.
2. Under **Retail pricing**, raise the price to at least the "Minimum
   viable retail" row above (use the international row if you sell
   worldwide — which the site currently does).
3. Save. Website cache is 5 minutes — visit `/merch` after that to confirm
   the product reappears (if it was filtered out).

## What's intentionally NOT in this model

- **Refunds / returns** — Printful refund policy varies. Budget for ~1–2%
  of gross revenue in return shipping.
- **Multi-item discounts** — not implemented; every line stands alone.
- **Payment method surcharges** (ACH, digital wallets) — fees are
  marginally different from cards but we use the conservative card number.
- **Currency conversion** — the site is USD-only. If we add multi-currency
  later, FX spread is another ~1% hit.
