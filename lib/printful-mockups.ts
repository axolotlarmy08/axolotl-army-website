/**
 * Printful Mockup Generator orchestration.
 *
 * Printful only stores ONE on-garment preview per sync_product — whichever
 * side the user designed. To get BOTH front and back mockups, we ask
 * Printful's /mockup-generator/create-task endpoint to render them
 * explicitly, poll the task to completion, and cache the URLs in Neon.
 *
 * - Tasks take ~10-30 seconds.
 * - Rate limit: 10 tasks/minute per token.
 * - Neon persistence is shared across Vercel serverless instances so we
 *   never regenerate a mockup we've already made.
 * - Colors are generated in parallel (bounded to 5 concurrent) so wall
 *   time stays within Vercel's 60s function ceiling.
 */

import { getStoreProductDetail, type SyncVariant } from "@/lib/printful";
import { getMockupsFromDb, saveMockupsToDb } from "@/lib/db";

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
  placement: string;
  url: string;
}

export interface ProductMockups {
  syncProductId: number;
  byColor: Record<string, PlacementMockup[]>;
  /** True if at least one color didn't get a full set of mockups this run. */
  partial: boolean;
  generatedAt: number;
}

/* ─── Printfile dimensions cache (per catalog product) ─── */

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
  files: Array<{
    placement: string;
    image_url: string;
    printfileWidth: number;
    printfileHeight: number;
  }>
): Promise<string> {
  const res = await pf<TaskResponse>(
    `/mockup-generator/create-task/${catalogProductId}`,
    {
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
    }
  );
  return res.result.task_key;
}

async function pollTask(
  taskKey: string,
  maxAttempts = 18,
  intervalMs = 2500
): Promise<TaskResponse["result"]> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const res = await pf<TaskResponse>(
      `/mockup-generator/task?task_key=${encodeURIComponent(taskKey)}`
    );
    if (
      res.result.status === "completed" ||
      res.result.status === "failed" ||
      res.result.status === "error"
    ) {
      return res.result;
    }
  }
  return { task_key: taskKey, status: "pending" };
}

/* ─── Per-color generation ─── */

function pickFirstVariantPerColor(
  variants: SyncVariant[]
): Map<string, SyncVariant> {
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
  const files: Array<{
    placement: string;
    image_url: string;
    printfileWidth: number;
    printfileHeight: number;
  }> = [];

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
    return result.mockups.map((m) => ({
      placement: m.placement,
      url: m.mockup_url,
    }));
  } catch (err) {
    console.error(
      `Mockup task failed for variant ${variant.variant_id} (${variant.color}):`,
      err
    );
    return [];
  }
}

/* ─── In-flight dedup + top-level orchestration ─── */

const inflight = new Map<number, Promise<ProductMockups>>();

/**
 * Bounded-concurrency helper — runs `items` through `fn` with at most
 * `limit` in flight, accumulating results in order.
 */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

async function fillMissingAndCache(
  syncProductId: number
): Promise<ProductMockups> {
  const detail = await getStoreProductDetail(syncProductId);
  const variants = (detail.sync_variants || []).filter((v) => !v.is_ignored);
  const catalogProductId = variants[0]?.product?.product_id;

  // Start with whatever is already in the DB.
  const cached = await getMockupsFromDb(syncProductId);
  const byColor: Record<string, PlacementMockup[]> = {};
  for (const row of cached) {
    if (!byColor[row.color]) byColor[row.color] = [];
    byColor[row.color].push({ placement: row.placement, url: row.url });
  }

  if (!catalogProductId || variants.length === 0) {
    return { syncProductId, byColor, partial: false, generatedAt: Date.now() };
  }

  // Figure out which colors still need generation (0 or 1 placement cached
  // but the product actually has both a front design file and a back design file).
  const perColor = pickFirstVariantPerColor(variants);
  const toGenerate: Array<{ color: string; variant: SyncVariant }> = [];
  for (const [color, variant] of perColor) {
    const expected = new Set<string>();
    if (
      variant.files?.some((f) => f.type === "front_large" || f.type === "default")
    )
      expected.add("front");
    if (variant.files?.some((f) => f.type === "back")) expected.add("back");

    const have = new Set((byColor[color] || []).map((m) => m.placement));
    const missing = [...expected].filter((p) => !have.has(p));
    if (missing.length > 0) toGenerate.push({ color, variant });
  }

  if (toGenerate.length === 0) {
    return { syncProductId, byColor, partial: false, generatedAt: Date.now() };
  }

  const printfiles = await getPrintfiles(catalogProductId);
  const mainPrintfile = printfiles.sort(
    (a, b) => b.width * b.height - a.width * a.height
  )[0];
  if (!mainPrintfile) {
    return { syncProductId, byColor, partial: true, generatedAt: Date.now() };
  }

  // Parallelize with a soft limit to respect Printful's 10/min rate.
  const CONCURRENCY = 3;
  const results = await mapWithConcurrency(
    toGenerate,
    CONCURRENCY,
    async ({ color, variant }) => ({
      color,
      mockups: await generateForColor(catalogProductId, variant, {
        width: mainPrintfile.width,
        height: mainPrintfile.height,
      }),
    })
  );

  let partial = false;
  const rowsToSave: Array<{ color: string; placement: string; url: string }> = [];
  for (const { color, mockups } of results) {
    if (mockups.length === 0) {
      partial = true;
      continue;
    }
    byColor[color] = mockups;
    for (const m of mockups) {
      rowsToSave.push({ color, placement: m.placement, url: m.url });
    }
  }

  if (rowsToSave.length > 0) {
    try {
      await saveMockupsToDb(syncProductId, rowsToSave);
    } catch (err) {
      console.error("Failed to persist mockups:", err);
    }
  }

  return { syncProductId, byColor, partial, generatedAt: Date.now() };
}

export async function getMockupsForProduct(
  syncProductId: number
): Promise<ProductMockups> {
  // Dedup concurrent requests for the same product.
  const pending = inflight.get(syncProductId);
  if (pending) return pending;

  const promise = fillMissingAndCache(syncProductId).finally(() => {
    inflight.delete(syncProductId);
  });
  inflight.set(syncProductId, promise);
  return promise;
}
