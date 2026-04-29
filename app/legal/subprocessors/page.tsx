import type { Metadata } from "next";
import {
  COMPANY_NAME,
  LEGAL_EFFECTIVE_DATE_HUMAN,
  LEGAL_EMAIL,
  PORTAL_DOMAIN,
  PRIVACY_EMAIL,
  SECURITY_EMAIL,
  SUB_PROCESSORS,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Sub-processors — Axolotl Army Portal",
  description:
    "Current list of third-party sub-processors used by Axolotl Army to operate the Portal Service. Mirrors Annex III of our Data Processing Agreement and is provided for procurement, vendor risk, and GDPR compliance review.",
  robots: { index: true, follow: true },
};

/**
 * Sub-processor list — production document.
 *
 * Customer-facing stand-alone page that mirrors Annex III of the DPA at
 * /legal/dpa. Both pages render from the same `SUB_PROCESSORS` array in
 * `lib/legalContent.ts`, so adding or removing a vendor in one place
 * propagates everywhere automatically.
 *
 * When the list changes, also update CLAUDE.md Lab Notes so the next
 * session knows the policies were rev'd, and notify Enterprise customers
 * by email per the 30-day notice promise in the DPA.
 */
export default function SubprocessorsPage() {
  return (
    <>
      <h1>Sub-processors</h1>
      <p>
        <em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em>
      </p>

      <h2>1. Overview</h2>
      <p>
        These are the third-party Sub-processors {COMPANY_NAME} uses to operate
        the Service. The list is incorporated into our Data Processing
        Agreement at{" "}
        <a href={`${PORTAL_DOMAIN}/legal/dpa`}>{PORTAL_DOMAIN}/legal/dpa</a>{" "}
        as <strong>Annex III</strong>. The list is rendered from our internal
        configuration, so what you see below is the canonical list as of the
        effective date above.
      </p>
      <p>
        Each Sub-processor is contractually bound by data protection
        obligations substantially equivalent to those in our DPA, including (a)
        confidentiality, (b) the appropriate technical and organizational
        measures required by Article 32 GDPR, and (c) — for transfers outside
        the European Economic Area, the United Kingdom, or Switzerland — the
        European Commission&apos;s Standard Contractual Clauses (Implementing
        Decision (EU) 2021/914), the UK International Data Transfer Addendum
        where applicable, and the Swiss FADP adaptations. {COMPANY_NAME}{" "}
        remains fully liable to the Customer for the performance of every
        Sub-processor.
      </p>
      <p>
        For background on how data flows through the Service, see our{" "}
        <a href={`${PORTAL_DOMAIN}/legal/privacy`}>Privacy Policy</a>; for the
        full data protection contract terms, see our{" "}
        <a href={`${PORTAL_DOMAIN}/legal/dpa`}>Data Processing Agreement</a>.
      </p>

      <h2>2. Effective date</h2>
      <p>
        This list is effective from <strong>{LEGAL_EFFECTIVE_DATE_HUMAN}</strong>{" "}
        and supersedes any prior version of the Sub-processor list previously
        published or distributed. The next scheduled review of this list is at
        the next revision of {COMPANY_NAME}&apos;s legal documents; the list
        may be updated earlier in line with the notice obligations in
        Section 4 below.
      </p>

      <h2>3. Current Sub-processors</h2>
      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-portal-line-soft text-left text-[#bbb]">
              <th className="py-2 pr-3 font-semibold">Name</th>
              <th className="py-2 pr-3 font-semibold">Purpose</th>
              <th className="py-2 pr-3 font-semibold">Location</th>
              <th className="py-2 pr-3 font-semibold">
                Categories of Personal Data
              </th>
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
      <p>
        Vendors not listed above either (a) do not process Customer Personal
        Data, or (b) are integrated only at the Customer&apos;s direct election
        through OAuth or API key (in which case the Customer&apos;s contract
        with that vendor governs the processing). For a list of optional
        integrations the Customer may enable, see the &ldquo;Connected
        accounts&rdquo; section of the portal.
      </p>

      <h2>4. Notification of changes</h2>
      <p>
        We will provide at least <strong>thirty (30) days&apos; notice</strong>{" "}
        of any addition or material change to this list, by:
      </p>
      <ul>
        <li>updating this page with the new effective date;</li>
        <li>
          sending email notice to the primary administrator on every active
          customer account; and
        </li>
        <li>displaying an in-portal banner during the notice period.</li>
      </ul>
      <p>
        Customers may object to a proposed change on reasonable data
        protection grounds during the notice period by emailing{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. The objection
        process and remedies (including pro-rata refund where the parties
        cannot resolve the objection) are set out in Section 5 of the{" "}
        <a href={`${PORTAL_DOMAIN}/legal/dpa`}>Data Processing Agreement</a>.
      </p>
      <p>
        To subscribe to Sub-processor change notifications without holding an
        active customer account — for example, as part of an enterprise
        procurement evaluation — email{" "}
        <a
          href={`mailto:${LEGAL_EMAIL}?subject=${encodeURIComponent(
            "Sub-processor change notifications"
          )}`}
        >
          {LEGAL_EMAIL}
        </a>{" "}
        with the subject line <em>&ldquo;Sub-processor change
        notifications&rdquo;</em>. We will add you to the notification list and
        confirm by reply. We notify subscribers at least 30 days before adding
        a Sub-processor that processes a new category of Customer Personal
        Data.
      </p>

      <h2>5. Contact</h2>
      <ul>
        <li>
          <strong>Privacy questions and Data Subject requests:</strong>{" "}
          <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
        </li>
        <li>
          <strong>Sub-processor change notifications, DPA execution, and
          procurement enquiries:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
        </li>
        <li>
          <strong>Security incidents and breach notification:</strong>{" "}
          <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>.
        </li>
      </ul>
    </>
  );
}
