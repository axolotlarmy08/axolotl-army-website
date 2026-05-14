import { neon } from "@neondatabase/serverless";

/**
 * Database layer using Neon (Postgres) serverless driver.
 * Works on Vercel, Node.js, and Edge runtimes.
 *
 * Required env var: DATABASE_URL (Neon connection string)
 */

let sqlClient: ReturnType<typeof neon> | null = null;
let schemaInitialized = false;

function getSql() {
  if (sqlClient) return sqlClient;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  sqlClient = neon(url);
  return sqlClient;
}

async function ensureSchema() {
  if (schemaInitialized) return;
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS merch_signups (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      source TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS portal_signups (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      source TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Cache of Printful-generated mockup URLs. Keyed by (sync_product_id, color,
  // placement). Generation is slow (10-30s/task via Printful's Mockup Generator
  // and rate-limited to 10 tasks/min), so sharing this cache across Vercel
  // serverless instances — rather than per-process memory — is essential.
  await sql`
    CREATE TABLE IF NOT EXISTS printful_mockups (
      sync_product_id BIGINT NOT NULL,
      color TEXT NOT NULL,
      placement TEXT NOT NULL,
      url TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (sync_product_id, color, placement)
    )
  `;

  // Catalog color codes, persisted because Printful rate-limits the
  // /catalog-products/:id/catalog-variants endpoint and we don't want swatches
  // to regress to grey on every Vercel cold start.
  await sql`
    CREATE TABLE IF NOT EXISTS printful_catalog_colors (
      catalog_product_id INT NOT NULL,
      catalog_variant_id INT NOT NULL,
      color_code TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (catalog_product_id, catalog_variant_id)
    )
  `;

  // Fulfillment regions per catalog product (e.g. ["US","EU","CA"]). Stored
  // as a comma-joined string for simplicity — product-level data, one row.
  await sql`
    CREATE TABLE IF NOT EXISTS printful_catalog_regions (
      catalog_product_id INT PRIMARY KEY,
      regions TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Returning-visitor memory for AXO chat. Keyed by a salted SHA-256 hash
  // of the visitor's IP so we never store the raw address. Lets AXO greet
  // a returner by name and skip discovery if it already knows their work.
  await sql`
    CREATE TABLE IF NOT EXISTS axo_chat_visitors (
      ip_hash TEXT PRIMARY KEY,
      name TEXT,
      business TEXT,
      interest TEXT,
      last_recommended_tier TEXT,
      captured_email TEXT,
      conversation_count INT DEFAULT 1,
      first_seen TIMESTAMPTZ DEFAULT NOW(),
      last_seen TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Leads captured by the AXO website chat agent. Email is unique so a
  // returning visitor updates the same row instead of duplicating.
  await sql`
    CREATE TABLE IF NOT EXISTS axo_chat_leads (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      interest TEXT,
      transcript_snippet TEXT,
      source TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  schemaInitialized = true;
}

export async function saveAxoChatLead(input: {
  name?: string;
  email: string;
  interest?: string;
  transcriptSnippet?: string;
  source?: string;
}): Promise<{ inserted: boolean }> {
  await ensureSchema();
  const sql = getSql();
  const email = input.email.toLowerCase().trim();
  const rows = (await sql`
    INSERT INTO axo_chat_leads (name, email, interest, transcript_snippet, source)
    VALUES (
      ${input.name ?? null},
      ${email},
      ${input.interest ?? null},
      ${input.transcriptSnippet ?? null},
      ${input.source ?? "axo-chat"}
    )
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, axo_chat_leads.name),
      interest = COALESCE(EXCLUDED.interest, axo_chat_leads.interest),
      transcript_snippet = COALESCE(EXCLUDED.transcript_snippet, axo_chat_leads.transcript_snippet),
      updated_at = NOW()
    RETURNING (xmax = 0) AS inserted
  `) as Array<{ inserted: boolean }>;
  return { inserted: rows[0]?.inserted ?? false };
}

/* ─── AXO chat visitor memory ─── */

export interface AxoVisitorMemory {
  name?: string | null;
  business?: string | null;
  interest?: string | null;
  lastRecommendedTier?: string | null;
  capturedEmail?: string | null;
  conversationCount: number;
  firstSeen: Date;
  lastSeen: Date;
}

export async function getAxoVisitorMemory(
  ipHash: string
): Promise<AxoVisitorMemory | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT name, business, interest, last_recommended_tier, captured_email,
           conversation_count, first_seen, last_seen
    FROM axo_chat_visitors
    WHERE ip_hash = ${ipHash}
  `) as Array<{
    name: string | null;
    business: string | null;
    interest: string | null;
    last_recommended_tier: string | null;
    captured_email: string | null;
    conversation_count: number;
    first_seen: Date;
    last_seen: Date;
  }>;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    name: r.name,
    business: r.business,
    interest: r.interest,
    lastRecommendedTier: r.last_recommended_tier,
    capturedEmail: r.captured_email,
    conversationCount: r.conversation_count,
    firstSeen: r.first_seen,
    lastSeen: r.last_seen,
  };
}

export async function upsertAxoVisitorMemory(
  ipHash: string,
  patch: {
    name?: string | null;
    business?: string | null;
    interest?: string | null;
    lastRecommendedTier?: string | null;
    capturedEmail?: string | null;
  }
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO axo_chat_visitors (
      ip_hash, name, business, interest, last_recommended_tier, captured_email,
      conversation_count, last_seen
    ) VALUES (
      ${ipHash},
      ${patch.name ?? null},
      ${patch.business ?? null},
      ${patch.interest ?? null},
      ${patch.lastRecommendedTier ?? null},
      ${patch.capturedEmail ?? null},
      1,
      NOW()
    )
    ON CONFLICT (ip_hash) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, axo_chat_visitors.name),
      business = COALESCE(EXCLUDED.business, axo_chat_visitors.business),
      interest = COALESCE(EXCLUDED.interest, axo_chat_visitors.interest),
      last_recommended_tier = COALESCE(EXCLUDED.last_recommended_tier, axo_chat_visitors.last_recommended_tier),
      captured_email = COALESCE(EXCLUDED.captured_email, axo_chat_visitors.captured_email),
      conversation_count = axo_chat_visitors.conversation_count + 1,
      last_seen = NOW()
  `;
}

/* ─── Printful mockup cache ─── */

export async function getMockupsFromDb(
  syncProductId: number
): Promise<Array<{ color: string; placement: string; url: string }>> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT color, placement, url
    FROM printful_mockups
    WHERE sync_product_id = ${syncProductId}
  `) as Array<{ color: string; placement: string; url: string }>;
  return rows;
}

export async function saveMockupsToDb(
  syncProductId: number,
  rows: Array<{ color: string; placement: string; url: string }>
): Promise<void> {
  if (rows.length === 0) return;
  await ensureSchema();
  const sql = getSql();
  for (const r of rows) {
    await sql`
      INSERT INTO printful_mockups (sync_product_id, color, placement, url, updated_at)
      VALUES (${syncProductId}, ${r.color}, ${r.placement}, ${r.url}, NOW())
      ON CONFLICT (sync_product_id, color, placement)
      DO UPDATE SET url = EXCLUDED.url, updated_at = NOW()
    `;
  }
}

/* ─── Printful catalog color-code cache ─── */

export async function getCatalogColorsFromDb(
  catalogProductId: number
): Promise<Map<number, string>> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT catalog_variant_id, color_code
    FROM printful_catalog_colors
    WHERE catalog_product_id = ${catalogProductId}
  `) as Array<{ catalog_variant_id: number; color_code: string }>;
  const map = new Map<number, string>();
  for (const r of rows) map.set(r.catalog_variant_id, r.color_code);
  return map;
}

export async function saveCatalogColorsToDb(
  catalogProductId: number,
  entries: Array<{ variantId: number; colorCode: string }>
): Promise<void> {
  if (entries.length === 0) return;
  await ensureSchema();
  const sql = getSql();
  for (const e of entries) {
    await sql`
      INSERT INTO printful_catalog_colors (catalog_product_id, catalog_variant_id, color_code, updated_at)
      VALUES (${catalogProductId}, ${e.variantId}, ${e.colorCode}, NOW())
      ON CONFLICT (catalog_product_id, catalog_variant_id)
      DO UPDATE SET color_code = EXCLUDED.color_code, updated_at = NOW()
    `;
  }
}

/* ─── Printful catalog fulfillment-region cache ─── */

export async function getCatalogRegionsFromDb(
  catalogProductId: number
): Promise<string[] | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT regions FROM printful_catalog_regions
    WHERE catalog_product_id = ${catalogProductId}
  `) as Array<{ regions: string }>;
  if (rows.length === 0) return null;
  return rows[0].regions.split(",").filter(Boolean);
}

export async function saveCatalogRegionsToDb(
  catalogProductId: number,
  regions: string[]
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO printful_catalog_regions (catalog_product_id, regions, updated_at)
    VALUES (${catalogProductId}, ${regions.join(",")}, NOW())
    ON CONFLICT (catalog_product_id)
    DO UPDATE SET regions = EXCLUDED.regions, updated_at = NOW()
  `;
}

/** Delete all cached mockups for a product so the next request regenerates them. */
export async function clearMockupsFromDb(
  syncProductId?: number
): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  const rows = syncProductId
    ? ((await sql`DELETE FROM printful_mockups WHERE sync_product_id = ${syncProductId} RETURNING 1`) as Array<{
        "?column?": number;
      }>)
    : ((await sql`DELETE FROM printful_mockups RETURNING 1`) as Array<{
        "?column?": number;
      }>);
  return rows.length;
}

export async function saveMerchSignup(
  email: string,
  source = "merch-section"
): Promise<{ inserted: boolean }> {
  await ensureSchema();
  const sql = getSql();
  const normalized = email.toLowerCase().trim();

  const rows = (await sql`
    INSERT INTO merch_signups (email, source)
    VALUES (${normalized}, ${source})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `) as Array<{ id: number }>;

  return { inserted: rows.length > 0 };
}

export async function savePortalSignup(
  email: string,
  source = "portal-coming-soon"
): Promise<{ inserted: boolean }> {
  await ensureSchema();
  const sql = getSql();
  const normalized = email.toLowerCase().trim();

  const rows = (await sql`
    INSERT INTO portal_signups (email, source)
    VALUES (${normalized}, ${source})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `) as Array<{ id: number }>;

  return { inserted: rows.length > 0 };
}

export async function getMerchSignups() {
  await ensureSchema();
  const sql = getSql();
  return sql`SELECT id, email, source, created_at FROM merch_signups ORDER BY created_at DESC`;
}

export async function getPortalSignups() {
  await ensureSchema();
  const sql = getSql();
  return sql`SELECT id, email, source, created_at FROM portal_signups ORDER BY created_at DESC`;
}
