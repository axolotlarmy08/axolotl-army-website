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

  schemaInitialized = true;
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
