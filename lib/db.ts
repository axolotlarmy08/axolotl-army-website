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

  schemaInitialized = true;
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
