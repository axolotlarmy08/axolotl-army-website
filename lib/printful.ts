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
  sync_variant_id?: number;
  variant_id: number;
  quantity: number;
  files: Array<{
    type: string;
    url: string;
  }>;
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
  const res = await apiFetch<{ data: CatalogVariant[] }>(
    `/catalog-products/${productId}/catalog-variants?selling_region_name=worldwide`
  );
  return res.data;
}

/* ─── Store Products (synced products with your designs) ─── */

export async function getStoreProducts() {
  const res = await apiFetch<{ data: unknown[] }>("/store/products");
  return res.data;
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
  const res = await apiFetch<{ data: unknown }>(
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
  return res.data;
}

export async function confirmOrder(orderId: number) {
  const res = await apiFetch<{ data: unknown }>(
    `/orders/${orderId}/confirm`,
    { method: "POST" },
    true
  );
  return res.data;
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

export const PRODUCT_CONFIG = {
  tee: {
    printfulId: 71,
    name: "Bella+Canvas 3001",
    basePrice: 39, // $34 + $5 baked-in shipping
  },
  hoodie: {
    printfulId: 146,
    name: "Gildan 18500",
    basePrice: 73, // $68 + $5 baked-in shipping
  },
  cap: {
    printfulId: 206,
    name: "Yupoong 6245CM",
    basePrice: 33, // $28 + $5 baked-in shipping
  },
  sticker: {
    printfulId: 358,
    name: "Kiss-Cut Stickers",
    basePrice: 17, // $12 + $5 baked-in shipping
  },
} as const;

/* ─── Shipping config ─── */
export const SHIPPING_CONFIG = {
  flatRate: 5.00,
  freeThreshold: 150.00,
} as const;

export type ProductType = keyof typeof PRODUCT_CONFIG;
