import type { Metadata } from "next";
import {
  CCPA_METADATA,
  COMPANY_NAME,
  COMPANY_WEBSITE,
  DATA_CATEGORIES,
  EU_REPRESENTATIVE,
  GOOGLE_LIMITED_USE_DISCLOSURE,
  LEGAL_EFFECTIVE_DATE_HUMAN,
  PORTAL_DOMAIN,
  POSTAL_ADDRESS_LINES,
  PRIVACY_EMAIL,
  SECURITY_EMAIL,
  SUB_PROCESSORS,
  SUPPORT_EMAIL,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Privacy Policy — Axolotl Army Portal",
  description:
    "How Axolotl Army collects, uses, shares, and protects personal data, including disclosures required by GDPR, the UK GDPR, CCPA/CPRA, and the Google API Services User Data Policy.",
};

/**
 * Privacy Policy — production document.
 *
 * Source of truth for company name, sub-processors, data categories, and the
 * Google Limited Use disclosure is `lib/legalContent.ts`. Update that file
 * when adding/removing vendors or shifting retention rules; never hardcode
 * those values here.
 *
 * The "Google API Services — Limited Use Disclosure" section uses the exact
 * wording required by Google's review team for sensitive scopes (Gmail
 * gmail.send, Calendar calendar.events, Drive drive.file). Do not paraphrase.
 */
export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>
        <em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em>
      </p>

      <h2>1. Introduction and scope</h2>
      <p>
        This Privacy Policy explains how {COMPANY_NAME} (&ldquo;{COMPANY_NAME}&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses,
        shares, and protects personal data when you use the Axolotl Army Portal
        at <a href={PORTAL_DOMAIN}>{PORTAL_DOMAIN}</a>, our marketing site at{" "}
        <a href={COMPANY_WEBSITE}>{COMPANY_WEBSITE}</a>, or any related
        product, API, integration, or communication (together, the &ldquo;Service&rdquo;).
      </p>
      <p>
        The Service is an AI video generation, social distribution, and lead
        generation platform aimed at small businesses and creators. We operate
        from the United States and accept customers from the European Economic
        Area (EEA), the United Kingdom, Switzerland, and globally.
      </p>
      <p>
        This policy covers people who sign up for an account, team members
        invited to a customer&apos;s account, prospective customers who contact
        us, and visitors to our public pages. It does not cover end-users of
        our customers&apos; own websites or marketing campaigns; for those
        people, our customer is the data controller and we act as a processor.
      </p>

      <h2>2. What data we collect</h2>
      <p>
        The table below lists every category of personal data we hold, why we
        hold it, how long we keep it, and the lawful basis we rely on under
        the GDPR. We do not collect more than we need to run the Service.
      </p>
      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-portal-line-soft text-left text-[#bbb]">
              <th className="py-2 pr-3 font-semibold">Category</th>
              <th className="py-2 pr-3 font-semibold">What it includes</th>
              <th className="py-2 pr-3 font-semibold">Retention</th>
              <th className="py-2 font-semibold">Lawful basis (GDPR)</th>
            </tr>
          </thead>
          <tbody>
            {DATA_CATEGORIES.map((c) => (
              <tr key={c.key} className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
                <td className="py-3 pr-3 font-medium text-white">{c.label}</td>
                <td className="py-3 pr-3">{c.description}</td>
                <td className="py-3 pr-3">{c.retention}</td>
                <td className="py-3">{c.lawfulBasis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        We do not knowingly collect special categories of data (race, religion,
        political opinions, biometric data, health, sexual orientation) or
        children&apos;s data. If you submit such data through prompts or
        uploads, you represent that you have a lawful basis to do so.
      </p>

      <h2>3. How we use your data</h2>
      <p>We use personal data only for these purposes:</p>
      <ul>
        <li>
          <strong>Operate the Service.</strong> Authenticate you, render the
          portal, generate video and audio you request, deliver leads and
          outreach, sync calendars and mailboxes you connect.
        </li>
        <li>
          <strong>Process payments.</strong> Stripe handles card data under
          PCI-DSS; we receive the customer ID, last-4, brand, and transaction
          metadata. We never see or store full card numbers.
        </li>
        <li>
          <strong>Provide support.</strong> Reply to email, investigate bug
          reports, ship security and reliability fixes.
        </li>
        <li>
          <strong>Protect the Service and our users.</strong> Detect abuse,
          prevent fraud, rate-limit, retain audit trails, respond to security
          incidents.
        </li>
        <li>
          <strong>Improve the product.</strong> Aggregate, de-identified usage
          metrics to understand which features matter and to debug regressions.
        </li>
        <li>
          <strong>Send transactional and account communications.</strong>{" "}
          Welcome, security, billing, and onboarding email. You can opt out of
          non-essential email at any time.
        </li>
      </ul>
      <p>
        <strong>We never sell your personal data and we never use it for
        advertising.</strong> We do not run third-party tracking pixels or
        advertising cookies on the portal. We do not allow our AI sub-processors
        (Anthropic, OpenAI, ElevenLabs, Kie.ai, Runway, Deepgram) to retain
        your prompts or content for their own model training.
      </p>

      <h2>4. Google API Services — Limited Use Disclosure</h2>
      <p>
        When you connect a Google account to the Service we request specific
        OAuth scopes. The disclosure below is the exact wording required by
        Google&apos;s API Services User Data Policy:
      </p>
      <blockquote className="border-l-4 border-amber-400 bg-[#0e0e0e] px-4 py-3 italic text-[#ddd]">
        {GOOGLE_LIMITED_USE_DISCLOSURE}
      </blockquote>

      <h3>Which Google scopes we use, and why</h3>
      <ul>
        <li>
          <code>openid</code>, <code>email</code>, <code>profile</code> — sign
          you in with Google and read your email address and display name so we
          can create or match your portal account.
        </li>
        <li>
          <code>https://www.googleapis.com/auth/gmail.send</code> — send
          outreach email through your own Gmail account when you enable Lead
          Finder. We do not read your inbox; we only send messages you compose
          (or ask the assistant to compose) and record delivery metadata. The
          scope is requested only when you connect a mailbox for outreach.
        </li>
        <li>
          <code>https://www.googleapis.com/auth/calendar.events</code> — write
          and update events on the calendar you choose so the portal can
          schedule posts, sync booking links, and surface conflicts. We only
          touch events you create through the portal.
        </li>
        <li>
          <code>https://www.googleapis.com/auth/calendar.readonly</code> —
          read free/busy information so booking links offer real availability.
          Used only when you turn on calendar sync.
        </li>
        <li>
          <code>https://www.googleapis.com/auth/drive.file</code> — upload
          generated video, image, and audio assets to a folder you select. We
          only see files you create or open through the portal; we cannot list
          or read the rest of your Drive.
        </li>
      </ul>

      <h3>Human review of Google user data</h3>
      <p>
        We do not let humans read your Google user data, except (a) with your
        explicit permission (for example, when you ask support to reproduce a
        bug), (b) for security investigations limited to what is strictly
        necessary, or (c) to comply with applicable law or valid legal process.
        Engineering access is gated by single sign-on, scoped to job role, and
        every read is logged.
      </p>
      <p>
        You can disconnect your Google account at any time from the Portal
        (Settings &rarr; Connected accounts), or revoke access directly at{" "}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noreferrer noopener"
        >
          myaccount.google.com/permissions
        </a>
        . When you disconnect, we delete the stored OAuth refresh token within
        24 hours and stop calling Google APIs on your behalf.
      </p>

      <h2>5. Sub-processors</h2>
      <p>
        We use the third-party sub-processors below to deliver the Service.
        Each one is contractually bound to confidentiality, security, and (for
        EEA/UK transfers) Standard Contractual Clauses or an equivalent
        adequacy mechanism. We update this list when vendors change; Enterprise
        customers receive 30 days&apos; notice of material additions.
      </p>
      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-portal-line-soft text-left text-[#bbb]">
              <th className="py-2 pr-3 font-semibold">Vendor</th>
              <th className="py-2 pr-3 font-semibold">Purpose</th>
              <th className="py-2 pr-3 font-semibold">Location</th>
              <th className="py-2 pr-3 font-semibold">Data categories</th>
              <th className="py-2 font-semibold">Privacy policy</th>
            </tr>
          </thead>
          <tbody>
            {SUB_PROCESSORS.map((s) => (
              <tr
                key={s.name}
                className="border-b border-portal-line-soft/40 align-top text-[#ddd]"
              >
                <td className="py-3 pr-3 font-medium text-white">{s.name}</td>
                <td className="py-3 pr-3">{s.purpose}</td>
                <td className="py-3 pr-3">{s.location}</td>
                <td className="py-3 pr-3">{s.dataCategories.join(", ")}</td>
                <td className="py-3">
                  <a href={s.url} target="_blank" rel="noreferrer noopener">
                    Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>6. International data transfers</h2>
      <p>
        {COMPANY_NAME} is based in the United States and most of our
        sub-processors operate in the United States. When personal data of
        people in the EEA, UK, or Switzerland is transferred to the United
        States or another third country, we rely on:
      </p>
      <ul>
        <li>
          <strong>EEA &rarr; US (and other third countries):</strong> the European
          Commission&apos;s Standard Contractual Clauses (Module 2 / Module 3,
          Implementing Decision (EU) 2021/914 of 4 June 2021), executed with
          each sub-processor.
        </li>
        <li>
          <strong>UK &rarr; third countries:</strong> the UK International Data
          Transfer Addendum (IDTA) issued by the Information Commissioner&apos;s
          Office, layered on top of the EU SCCs.
        </li>
        <li>
          <strong>Switzerland:</strong> the Swiss Federal Data Protection Act
          (revFADP) read together with the SCCs, with the Swiss Federal Data
          Protection and Information Commissioner (FDPIC) as the competent
          authority.
        </li>
      </ul>
      <p>
        We perform transfer impact assessments before onboarding any new
        sub-processor and apply supplementary technical measures (encryption
        in transit, encryption at rest, key separation) to mitigate residual
        risk.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live, you have one or more of the rights below.
        We will respond within 30 days of receiving a verifiable request and
        without charge unless your request is repetitive or manifestly
        unfounded. Email <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>{" "}
        to exercise any right.
      </p>

      <h3>EEA, United Kingdom, and Switzerland (GDPR / UK GDPR / FADP)</h3>
      <ul>
        <li>
          <strong>Access</strong> — receive a copy of the personal data we hold
          about you.
        </li>
        <li>
          <strong>Rectification</strong> — correct inaccurate or incomplete
          data.
        </li>
        <li>
          <strong>Erasure (&ldquo;right to be forgotten&rdquo;)</strong> — ask
          us to delete your data, subject to legal retention duties.
        </li>
        <li>
          <strong>Portability</strong> — receive your data in a structured,
          commonly-used, machine-readable format.
        </li>
        <li>
          <strong>Restriction</strong> — limit how we process your data while
          a dispute is resolved.
        </li>
        <li>
          <strong>Objection</strong> — object to processing based on legitimate
          interest, including profiling.
        </li>
        <li>
          <strong>Withdraw consent</strong> — where we rely on consent (for
          example, Google Workspace OAuth), withdraw it at any time without
          affecting prior processing.
        </li>
        <li>
          <strong>Automated decision-making</strong> — we do not subject you
          to decisions that produce legal effects based solely on automated
          processing. AI-generated suggestions in the portal are advisory and
          you remain in control.
        </li>
        <li>
          <strong>Lodge a complaint</strong> — with your supervisory authority
          (for example, the ICO in the UK, the CNIL in France, the
          Datenschutzbehörde in Austria, or the FDPIC in Switzerland).
        </li>
      </ul>

      <h3>California (CCPA / CPRA)</h3>
      <p>
        California residents have the rights to know what personal information
        we collect, to delete it, to correct it, to opt out of any sale or
        sharing, and to limit our use of sensitive personal information. You
        will not be denied service or charged a different price for exercising
        these rights.
      </p>
      <p>
        <strong>Do Not Sell or Share My Personal Information.</strong>{" "}
        {CCPA_METADATA.doNotSellOrShare}
      </p>
      <p>{CCPA_METADATA.sensitiveDataUse}</p>
      <p>
        We have not sold or shared personal information for cross-context
        behavioral advertising in the preceding 12 months and have no plans to
        do so. We do not sell personal information of consumers under 16. The
        CCPA categories of information we collect map to the data categories
        in section 2; the business purposes map to section 3.
      </p>

      <h3>Other US states (Virginia, Colorado, Connecticut, Utah, Texas)</h3>
      <p>
        Residents of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA),
        Utah (UCPA), and Texas (TDPSA) have rights similar to the California
        rights above, including the right to access, delete, correct (where
        provided by state law), obtain a portable copy, and opt out of
        targeted advertising and certain types of profiling. Texas and other
        2024+ regimes are covered as they take effect.
      </p>
      <p>
        To exercise any of the rights in this section, email{" "}
        <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>. You may also
        designate an authorized agent to act on your behalf; we may ask the
        agent for written authorization and may verify your identity directly.
        If we deny a request, you have the right to appeal — reply to our
        decision and we will review.
      </p>

      <h2>8. Children&apos;s privacy</h2>
      <p>
        The Service is not directed to children under 16. We do not knowingly
        collect data from anyone under 16. If you believe a child has given us
        personal data, contact{" "}
        <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a> and we will
        delete the data and close the account promptly.
      </p>

      <h2>9. Security</h2>
      <p>
        We protect personal data with administrative, technical, and physical
        safeguards proportionate to the risk:
      </p>
      <ul>
        <li>
          <strong>Encryption in transit.</strong> TLS 1.2+ for every connection
          between your browser, the portal, and our sub-processors.
        </li>
        <li>
          <strong>Encryption at rest.</strong> OAuth refresh tokens for
          connected Google and Microsoft accounts are encrypted with AES-256-GCM
          before they hit the database; the encryption key is held outside the
          database and rotated. Database-at-rest encryption is provided by
          Neon.
        </li>
        <li>
          <strong>Access controls.</strong> Role-based access for engineering
          (OWNER, ADMIN, MEMBER), single sign-on, hardware-backed 2FA, and
          per-action audit logs.
        </li>
        <li>
          <strong>Vendor due diligence.</strong> We require SOC 2 Type II,
          ISO 27001, or equivalent attestations from sub-processors that handle
          significant personal data, where commercially available.
        </li>
        <li>
          <strong>Incident response.</strong> If a breach affects your data we
          will notify you and the relevant supervisory authorities within the
          timelines required by law (within 72 hours for GDPR notifications).
          Report suspected vulnerabilities to{" "}
          <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>.
        </li>
      </ul>

      <h2>10. Retention</h2>
      <p>
        Retention periods per category are listed in section 2. In summary:
      </p>
      <ul>
        <li>
          <strong>Account data</strong> — life of the account plus 30 days.
        </li>
        <li>
          <strong>Billing records</strong> — 7 years after final invoice (US
          tax and SOX).
        </li>
        <li>
          <strong>Generated and uploaded content</strong> — while the account
          is active; deleted within 30 days of closure.
        </li>
        <li>
          <strong>Operational logs</strong> — 90 days for verbose logs;
          permanent for security audit trails.
        </li>
        <li>
          <strong>Google Workspace data</strong> — until you disconnect or
          delete the related portal record.
        </li>
      </ul>
      <p>
        Where law requires longer retention (for example, defending a legal
        claim, anti-money-laundering checks, or a litigation hold) we keep the
        minimum data needed for the minimum period needed.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy when laws, vendors, or product
        features change. The &ldquo;Effective&rdquo; date at the top of this
        page reflects the most recent revision. For material changes that
        affect your rights or the categories of data we collect we will email
        every account at least 30 days before the change takes effect, so you
        have time to review and, if you wish, close your account before the
        new terms apply.
      </p>

      <h2>12. How to contact us</h2>
      <p>
        Privacy questions, DSARs, or complaints:{" "}
        <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
      </p>
      <p>General support: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      <p>Postal address (service of legal process):</p>
      <address className="not-italic">
        {POSTAL_ADDRESS_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>

      <h2>13. EU/UK representative</h2>
      <p>
        {EU_REPRESENTATIVE.appointed
          ? "Our Article 27 GDPR representative in the European Union is listed below. You may contact them in your local language regarding any GDPR matter."
          : `We do not currently maintain an Article 27 representative in the European Union or United Kingdom. Until one is appointed, EEA and UK data subjects may exercise every GDPR/UK GDPR right by contacting us directly at `}
        {EU_REPRESENTATIVE.appointed ? null : (
          <>
            <a href={`mailto:${EU_REPRESENTATIVE.contact}`}>
              {EU_REPRESENTATIVE.contact}
            </a>
            . We will respond in English; let us know in your message if you
            need a response in another EU/UK official language and we will
            arrange translation.
          </>
        )}
      </p>
    </>
  );
}
