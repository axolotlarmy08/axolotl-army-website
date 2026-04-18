/**
 * Printful API v2 Client
 * Handles all communication with Printful's REST API for catalog browsing,
 * mockup generation, order creation, and fulfillment.
 */

const PRINTFUL_API = "https://api.printful.com/v2";
const PRINTFUL_API_V1 = "https://api.printful.com";

function getToken(): string {
  const token = process.env.PRINTFUL_API_TOKEN;
  if (!token) throw new Error("PRINTFUL_API_TOKEN is not set");
  return token;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  useV1 = false
): Promise<T> {
  const base = useV1 ? PRINTFUL_API_V1 : PRINTFUL_API;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Printful API ${res.status}: ${body}`);
  }

  return res.json();
}

/* ─── Types ─── */

export interface CatalogProduct {
  id: number;
  type: string;
  name: string;
  brand: string | null;
  model: string;
  image: string;
  variant_count: number;
  description: string;
  sizes: string[];
}

export interface CatalogVariant {
  id: number;
  catalog_product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  image: string;
  price: string;
  in_stock: boolean;
  availability_status: string;
}

export interface MockupTask {
  task_key: string;
  status: string;
  mockups?: Array<{
    placement: string;
    variant_ids: number[];
    mockup_url: string;
    extra: Array<{ url: string; title: string }>;
  }>;
}

export interface ShippingRate {
  id: string;
  name: string;
  rate: string;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export interface OrderRecipient {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  email?: string;
  phone?: string;
}

export interface OrderItem {
  /** Preferred: synced store variant (design already attached in Printful). */
  sync_variant_id?: number;
  /** Fallback: raw catalog variant + design file URL. */
  variant_id?: number;
  quantity: number;
  files?: Array<{
    type: string;
    url: string;
  }>;
}

/* ─── Store Product types (v1 /store/products) ─── */

export interface StoreProductSummary {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface SyncVariantFile {
  /** "default" (the design), "preview" (the design-on-garment mockup), "back", etc. */
  type: string;
  url?: string;
  preview_url?: string;
  /** Printful names preview files like "<product>-<color>-<side>-<hash>.jpg". */
  filename?: string;
  /** Native pixel width of the uploaded design — used to preserve aspect ratio when positioning. */
  width?: number;
  /** Native pixel height of the uploaded design. */
  height?: number;
}

export interface SyncVariant {
  id: number; // sync_variant_id
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number; // catalog variant id
  retail_price: string; // "25.00" — user-set price in Printful dashboard
  currency: string;
  sku: string;
  size: string;
  color: string;
  availability_status: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string; // blank garment — not the design
    name: string;
  };
  /** Array of uploaded design/mockup files. `type: "preview"` is the design-on-garment. */
  files?: SyncVariantFile[];
  is_ignored: boolean;
}

export interface StoreProductDetail {
  sync_product: StoreProductSummary;
  sync_variants: SyncVariant[];
}

/* ─── Catalog ─── */

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const res = await apiFetch<{ data: CatalogProduct[] }>(
    "/catalog-products?selling_region_name=worldwide&limit=100"
  );
  return res.data;
}

export async function getCatalogProduct(
  productId: number
): Promise<CatalogProduct> {
  const res = await apiFetch<{ data: CatalogProduct }>(
    `/catalog-products/${productId}?selling_region_name=worldwide`
  );
  return res.data;
}

export async function getCatalogVariants(
  productId: number
): Promise<CatalogVariant[]> {
  // v1 returns ALL variants in a single response (no pagination), including
  // color_code for every entry. v2's /catalog-variants paginates at 20/page
  // and doesn't surface color_code for every variant we actually need.
  const res = await apiFetch<{
    result: { variants: CatalogVariant[] };
  }>(`/products/${productId}`, {}, true);
  return res.result.variants || [];
}

/* ─── Size charts ─── */

export interface SizeChartMeasurement {
  type_label: string;
  values: Array<{ size: string; value: string }>;
}

export interface SizeTable {
  type: "measure_yourself" | "product_measure" | string;
  unit: string;
  description?: string;
  image_url?: string;
  image_description?: string;
  measurements?: SizeChartMeasurement[];
}

export interface SizeChart {
  catalog_product_id: number;
  available_sizes: string[];
  size_tables: SizeTable[];
}

/**
 * Fetches Printful's per-catalog-product size chart. The `measure_yourself`
 * table is usually the one shoppers want (body measurements to match a size).
 * The `product_measure` table is the flat-garment dimensions.
 */
export async function getSizeChart(
  catalogProductId: number
): Promise<SizeChart | null> {
  try {
    const res = await apiFetch<{ result: SizeChart }>(
      `/products/${catalogProductId}/sizes`,
      {},
      true
    );
    return res.result;
  } catch (err) {
    console.error(`Size chart fetch failed for ${catalogProductId}:`, err);
    return null;
  }
}

/* ─── Store Products (synced products with your designs) ─── */

/**
 * List all synced store products. Uses v1 API — v2 /sync/products shape
 * is still in flux and doesn't return retail_price reliably.
 */
export async function listStoreProducts(): Promise<StoreProductSummary[]> {
  const res = await apiFetch<{ result: StoreProductSummary[] }>(
    "/store/products",
    {},
    true
  );
  return res.result || [];
}

/** Full detail for a single store product, including sync_variants[]. */
export async function getStoreProductDetail(
  syncProductId: number
): Promise<StoreProductDetail> {
  const res = await apiFetch<{ result: StoreProductDetail }>(
    `/store/products/${syncProductId}`,
    {},
    true
  );
  return res.result;
}

/* ─── Mockup Generation (v1 API — v2 mockup endpoint requires store products) ─── */

export async function generateMockup(
  productId: number,
  variantIds: number[],
  imageUrl: string
): Promise<MockupTask> {
  const res = await apiFetch<{ data: { task_key: string } }>(
    "/mockup-generator/create-task/" + productId,
    {
      method: "POST",
      body: JSON.stringify({
        variant_ids: variantIds,
        files: [
          {
            placement: "front",
            image_url: imageUrl,
            position: {
              area_width: 1800,
              area_height: 2400,
              width: 1800,
              height: 1800,
              top: 300,
              left: 0,
            },
          },
        ],
      }),
    },
    true // use v1 for mockup generation
  );

  return { task_key: res.data.task_key, status: "pending" };
}

export async function getMockupTaskResult(
  taskKey: string
): Promise<MockupTask> {
  const res = await apiFetch<{
    data: { status: string; mockups?: MockupTask["mockups"] };
  }>(`/mockup-generator/task?task_key=${taskKey}`, {}, true);

  return {
    task_key: taskKey,
    status: res.data.status,
    mockups: res.data.mockups,
  };
}

export async function waitForMockup(
  taskKey: string,
  maxAttempts = 30
): Promise<MockupTask> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await getMockupTaskResult(taskKey);
    if (result.status === "completed") return result;
    if (result.status === "error") throw new Error("Mockup generation failed");
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Mockup generation timed out");
}

/* ─── Orders (v1 API for simplicity) ─── */

export async function createOrder(
  recipient: OrderRecipient,
  items: OrderItem[],
  draft = true
) {
  // Printful v1 wraps responses as { code, result, ... } — NOT { data }.
  const res = await apiFetch<{ result: { id: number } }>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify({
        recipient,
        items,
        ...(draft ? {} : { confirm: true }),
      }),
    },
    true
  );
  return res.result;
}

export async function confirmOrder(orderId: number) {
  const res = await apiFetch<{ result: unknown }>(
    `/orders/${orderId}/confirm`,
    { method: "POST" },
    true
  );
  return res.result;
}

export async function getShippingRates(
  recipient: OrderRecipient,
  items: Array<{ variant_id: number; quantity: number }>
) {
  const res = await apiFetch<{ data: ShippingRate[] }>(
    "/shipping/rates",
    {
      method: "POST",
      body: JSON.stringify({ recipient, items }),
    },
    true
  );
  return res.data;
}

/* ─── Our product configuration ─── */
/**
 * Catalog-id reference for the product types we actually sell.
 * Prices are no longer stored here — `retail_price` comes from each
 * synced store product in Printful and is the source of truth.
 *
 * Shipping is baked into the Printful retail_price. The website charges
 * no separate shipping line (free shipping worldwide).
 */
export const PRODUCT_CONFIG = {
  tee: {
    printfulId: 71,
    name: "Bella+Canvas 3001",
  },
  hoodie: {
    printfulId: 146,
    name: "Gildan 18500",
  },
  cap: {
    printfulId: 206,
    name: "Yupoong 6245CM",
  },
} as const;

export type ProductType = keyof typeof PRODUCT_CONFIG;
