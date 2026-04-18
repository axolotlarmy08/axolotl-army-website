/**
 * Printful Mockup Generator orchestration.
 *
 * Printful only stores ONE on-garment preview per sync_product — whichever
 * side the user designed. To get BOTH front and back mockups, we have to
 * ask Printful's /mockup-generator/create-task endpoint to render them
 * explicitly, poll the task to completion, and cache the URLs.
 *
 * Tasks take ~10-30 seconds. Rate limit: 10 tasks/minute/token. So we
 * generate lazily (on first product-page view per color), cache in memory
 * for 24h, and serialize requests to avoid tripping the limit.
 */

import { getStoreProductDetail, type SyncVariant } from "@/lib/printful";

const PRINTFUL_API = "https://api.printful.com";

function getToken(): string {
  const t = process.env.PRINTFUL_API_TOKEN;
  if (!t) throw new Error("PRINTFUL_API_TOKEN not set");
  return t;
}

async function pf<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PRINTFUL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Printful ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

/* ─── Types ─── */

export interface PlacementMockup {
  placement: string; // "front" | "back" | "label_inside" | "left" | "right"
  url: string;
}

export interface ProductMockups {
  syncProductId: number;
  /** Keyed by color name, e.g. { "Black": [{ placement: "front", url }, { placement: "back", url }] }. */
  byColor: Record<string, PlacementMockup[]>;
  generatedAt: number;
  partial: boolean; // true if we hit rate limit or task timeout mid-generation
}

/* ─── Printfile dimensions cache ─── */

interface Printfile {
  printfile_id: number;
  width: number;
  height: number;
}

const printfileCache = new Map<number, Printfile[]>();

async function getPrintfiles(catalogProductId: number): Promise<Printfile[]> {
  const cached = printfileCache.get(catalogProductId);
  if (cached) return cached;
  const res = await pf<{
    result: { printfiles: Printfile[] };
  }>(`/mockup-generator/printfiles/${catalogProductId}`);
  const files = res.result.printfiles || [];
  printfileCache.set(catalogProductId, files);
  return files;
}

/* ─── Task creation + polling ─── */

interface TaskResponse {
  result: {
    task_key: string;
    status: "pending" | "completed" | "failed" | "error";
    mockups?: Array<{
      placement: string;
      variant_ids: number[];
      mockup_url: string;
    }>;
  };
}

async function createTask(
  catalogProductId: number,
  variantId: number,
  files: Array<{ placement: string; image_url: string; printfileWidth: number; printfileHeight: number }>
): Promise<string> {
  const res = await pf<TaskResponse>(`/mockup-generator/create-task/${catalogProductId}`, {
    method: "POST",
    body: JSON.stringify({
      variant_ids: [variantId],
      format: "jpg",
      files: files.map((f) => ({
        placement: f.placement,
        image_url: f.image_url,
        position: {
          area_width: f.printfileWidth,
          area_height: f.printfileHeight,
          width: f.printfileWidth,
          height: f.printfileHeight,
          top: 0,
          left: 0,
        },
      })),
    }),
  });
  return res.result.task_key;
}

async function pollTask(
  taskKey: string,
  maxAttempts = 20,
  intervalMs = 3000
): Promise<TaskResponse["result"]> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const res = await pf<TaskResponse>(
      `/mockup-generator/task?task_key=${encodeURIComponent(taskKey)}`
    );
    if (res.result.status === "completed" || res.result.status === "failed" || res.result.status === "error") {
      return res.result;
    }
  }
  // Timed out — return pending so caller can bail gracefully.
  return { task_key: taskKey, status: "pending" };
}

/* ─── Orchestration ─── */

const productCache = new Map<number, ProductMockups>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Serialize generation across the whole process to respect 10 tasks/min. */
let generationChain: Promise<unknown> = Promise.resolve();

function pickFirstVariantPerColor(variants: SyncVariant[]): Map<string, SyncVariant> {
  const m = new Map<string, SyncVariant>();
  for (const v of variants) {
    const key = v.color || "default";
    if (!m.has(key) && !v.is_ignored) m.set(key, v);
  }
  return m;
}

async function generateForColor(
  catalogProductId: number,
  variant: SyncVariant,
  printfileDims: { width: number; height: number }
): Promise<PlacementMockup[]> {
  const files: Array<{ placement: string; image_url: string; printfileWidth: number; printfileHeight: number }> = [];

  // Printful uses type names like "default" / "front_large" for front, "back" for back,
  // and "preview" for the pre-generated single mockup (which we ignore here).
  const front = variant.files?.find(
    (f) => f.type === "front_large" || f.type === "default"
  );
  const back = variant.files?.find((f) => f.type === "back");

  if (front) {
    const url = front.preview_url || front.url;
    if (url)
      files.push({
        placement: "front",
        image_url: url,
        printfileWidth: printfileDims.width,
        printfileHeight: printfileDims.height,
      });
  }
  if (back) {
    const url = back.preview_url || back.url;
    if (url)
      files.push({
        placement: "back",
        image_url: url,
        printfileWidth: printfileDims.width,
        printfileHeight: printfileDims.height,
      });
  }

  if (files.length === 0) return [];

  try {
    const taskKey = await createTask(catalogProductId, variant.variant_id, files);
    const result = await pollTask(taskKey);
    if (result.status !== "completed" || !result.mockups) return [];
    return result.mockups.map((m) => ({ placement: m.placement, url: m.mockup_url }));
  } catch (err) {
    console.error(`Mockup task failed for variant ${variant.variant_id}:`, err);
    return [];
  }
}

export async function getMockupsForProduct(
  syncProductId: number
): Promise<ProductMockups> {
  const cached = productCache.get(syncProductId);
  if (cached && Date.now() - cached.generatedAt < CACHE_TTL_MS) {
    return cached;
  }

  // Fetch sync product detail to learn catalog id + per-color variants + designs
  const detail = await getStoreProductDetail(syncProductId);
  const variants = (detail.sync_variants || []).filter((v) => !v.is_ignored);
  if (variants.length === 0) {
    const empty: ProductMockups = {
      syncProductId,
      byColor: {},
      generatedAt: Date.now(),
      partial: false,
    };
    productCache.set(syncProductId, empty);
    return empty;
  }

  const catalogProductId = variants[0].product?.product_id;
  if (!catalogProductId) {
    throw new Error(`Sync product ${syncProductId} has no catalog product_id`);
  }

  // Pick first printfile — for apparel there's typically one main print area dimension.
  const printfiles = await getPrintfiles(catalogProductId);
  const mainPrintfile = printfiles.sort((a, b) => b.width * b.height - a.width * a.height)[0];
  if (!mainPrintfile) {
    throw new Error(`No printfiles for catalog product ${catalogProductId}`);
  }

  const perColor = pickFirstVariantPerColor(variants);
  const byColor: Record<string, PlacementMockup[]> = {};
  let partial = false;

  // Serialize generation to respect rate limits. Each color is one task.
  for (const [color, variant] of perColor) {
    const prev = generationChain;
    generationChain = prev.then(() =>
      generateForColor(catalogProductId, variant, {
        width: mainPrintfile.width,
        height: mainPrintfile.height,
      }).then((mockups) => {
        byColor[color] = mockups;
        if (mockups.length === 0) partial = true;
      })
    );
  }
  await generationChain;

  const result: ProductMockups = {
    syncProductId,
    byColor,
    generatedAt: Date.now(),
    partial,
  };
  productCache.set(syncProductId, result);
  return result;
}

/** Check cache only; returns null if not generated yet. */
export function getCachedMockups(syncProductId: number): ProductMockups | null {
  const cached = productCache.get(syncProductId);
  if (!cached) return null;
  if (Date.now() - cached.generatedAt >= CACHE_TTL_MS) return null;
  return cached;
}
