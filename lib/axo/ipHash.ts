import { createHash } from "crypto";

/**
 * Salted SHA-256 hash of a visitor's IP. We never store the raw IP — this
 * gives us a stable per-visitor identifier for the chat memory table while
 * keeping the database free of PII that would trip GDPR/CCPA obligations.
 *
 * The salt is loaded from AXO_VISITOR_SALT; if missing, we fall back to a
 * compile-time constant so hashing still works in dev. Rotate the env var
 * to invalidate every existing memory row at once.
 */
const FALLBACK_SALT = "axo-default-salt-2026";

export function hashIp(ip: string): string {
  const salt = process.env.AXO_VISITOR_SALT || FALLBACK_SALT;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
