import type { Metadata } from "next";
import {
  COMPANY_NAME,
  PORTAL_DOMAIN,
  SECURITY_EMAIL,
  LEGAL_EFFECTIVE_DATE_HUMAN,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: `Security & Vulnerability Disclosure — ${COMPANY_NAME} Portal`,
  description: `How to report a security vulnerability in the ${COMPANY_NAME} Portal, plus our safe-harbor policy and response targets.`,
  robots: { index: true, follow: true },
};

export default function SecurityPage() {
  return (
    <>
      <h1>Security &amp; Vulnerability Disclosure</h1>
      <p><em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em></p>

      <p>
        We welcome reports from independent security researchers. This page is
        the policy referenced from{" "}
        <a href="/.well-known/security.txt"><code>/.well-known/security.txt</code></a>
        {" "}and is incorporated into our DPA Annex II as part of our incident-response programme.
      </p>

      <h2>Reporting a vulnerability</h2>
      <p>
        Email{" "}
        <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>
        {" "}with a clear description, reproduction steps, and (if possible) a
        proof of concept. Please do not include real user data; if a finding
        requires authenticated access, request a test account first.
      </p>
      <p>
        For findings that contain customer data we ask that you encrypt the
        report. Public PGP key fingerprint: provided on request to {SECURITY_EMAIL}.
      </p>

      <h2>Scope</h2>
      <ul>
        <li><code>{PORTAL_DOMAIN.replace(/^https?:\/\//, "")}</code> and any subdomain we operate.</li>
        <li>REST and webhook endpoints exposed under <code>/api/*</code>.</li>
        <li>The marketing site at <code>www.axolotlarmy.net</code>.</li>
        <li>Public PWA service worker, manifest, and offline assets.</li>
      </ul>

      <h2>Out of scope</h2>
      <ul>
        <li>Third-party services we depend on (Stripe, Vercel, Neon, Cloudflare, Google APIs, ElevenLabs, etc.) — report those to their respective programmes.</li>
        <li>Findings that require physical access, social engineering of our staff, or compromise of an end-user device.</li>
        <li>Reports generated solely by an automated scanner without manual validation, particularly findings from <em>nuclei</em> templates against unrelated cloud-provider banner output.</li>
        <li>Self-XSS, CSRF on logged-out endpoints with no security impact, and best-practice findings without a working exploit (e.g. missing security headers on static assets).</li>
        <li>Denial-of-service via volumetric attacks or rate-limit bypasses.</li>
      </ul>

      <h2>Safe harbour</h2>
      <p>
        We will not pursue legal action against researchers who act in good
        faith, do not access user data beyond what is necessary to demonstrate
        the vulnerability, do not degrade the Service, do not pivot to other
        customers&apos; tenants, and give us a reasonable time to remediate before
        public disclosure. Researchers who follow this policy are authorised to
        access the Service for the limited purpose of testing.
      </p>

      <h2>Response targets</h2>
      <ul>
        <li>Acknowledge receipt: within 3 business days.</li>
        <li>Triage decision (in scope / severity): within 7 business days.</li>
        <li>Fix or mitigation:
          <ul>
            <li>Critical: targeted patch within 7 days.</li>
            <li>High: targeted patch within 30 days.</li>
            <li>Medium / Low: included in next regular release.</li>
          </ul>
        </li>
      </ul>

      <h2>Coordinated disclosure</h2>
      <p>
        We ask researchers to give us 90 days from triage before public
        disclosure, or 30 days for criticals where customers are exposed. We
        are happy to coordinate joint advisories, CVE assignment via MITRE,
        and credit in the Hall of Fame below.
      </p>

      <h2>Hall of fame</h2>
      <p>
        With your permission we will credit you here after the issue is
        resolved. We do not currently run a paid bounty programme; we may
        send swag, write a public thank-you, or both.
      </p>

      <h2>What we do internally</h2>
      <ul>
        <li>Static + dynamic analysis on every PR.</li>
        <li>Dependency vulnerability scanning (npm audit, GitHub Dependabot, custom typosquat checks).</li>
        <li>Annual third-party penetration test (planned).</li>
        <li>Continuous monitoring (uptime, error tracking, security event logs).</li>
        <li>Encryption: TLS 1.2 or higher in transit; AES-256-GCM at rest for OAuth refresh tokens; bcrypt for passwords.</li>
        <li>Incident response runbook with 72-hour breach notification commitment.</li>
        <li>Annual security training for engineers; quarterly phishing simulation.</li>
      </ul>

      <h2>SOC 2</h2>
      <p>
        We are working toward SOC 2 Type II readiness with a target attestation in 2027.
        Enterprise customers can request an Attestation of Compliance (AoC) snapshot under
        NDA before the formal report is published.
      </p>

      <h2>Contact</h2>
      <p>
        Security:{" "}
        <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>
      </p>
    </>
  );
}
