import type { Metadata } from "next";
import {
  COMPANY_NAME,
  DATA_CATEGORIES,
  EU_REPRESENTATIVE,
  LEGAL_EFFECTIVE_DATE_HUMAN,
  LEGAL_EMAIL,
  PORTAL_DOMAIN,
  POSTAL_ADDRESS_LINES,
  PRIVACY_EMAIL,
  SECURITY_EMAIL,
  SUB_PROCESSORS,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Data Processing Agreement — Axolotl Army Portal",
  description:
    "GDPR Article 28-compliant Data Processing Agreement (DPA) for Axolotl Army Portal customers in the EEA, United Kingdom, and Switzerland. Includes EU Standard Contractual Clauses (2021/914) by reference, UK IDTA, and a current sub-processor list.",
  robots: { index: true, follow: true },
};

/**
 * Data Processing Agreement — production document.
 *
 * Source of truth for company, sub-processors, data categories, and contact
 * emails is `lib/legalContent.ts`. This file imports from there so changes
 * propagate automatically across all legal docs (Privacy, DPA, Sub-processor
 * list).
 *
 * Counter-signature workflow: customers requiring a DocuSign envelope email
 * LEGAL_EMAIL. The clickwrap version (this page) binds Customer on signup
 * via the Terms of Service incorporation-by-reference clause.
 */
export default function DPAPage() {
  return (
    <>
      <h1>Data Processing Agreement</h1>
      <p>
        <em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em>
      </p>

      <p>
        This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the
        Terms of Service between {COMPANY_NAME} (&ldquo;Processor&rdquo;) and
        the Customer (&ldquo;Controller&rdquo;). It applies whenever Customer
        Personal Data (as defined below) is processed by {COMPANY_NAME} in the
        course of providing the Service. By using the Service, Customer enters
        into this DPA. Customers requiring a counter-signed copy may email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> to receive a
        DocuSign envelope.
      </p>

      <h2>1. Definitions</h2>
      <p>
        Capitalized terms not defined in this DPA have the meanings given to
        them in the Terms of Service. The following definitions apply:
      </p>
      <ul>
        <li>
          <strong>&ldquo;Data Protection Laws&rdquo;</strong> means all laws
          applicable to the processing of personal data under this DPA,
          including: (a) Regulation (EU) 2016/679 (the &ldquo;GDPR&rdquo;); (b)
          the Data Protection Act 2018 and the GDPR as it forms part of
          retained EU law in the United Kingdom (the &ldquo;UK GDPR&rdquo;); (c)
          the Swiss Federal Act on Data Protection (the &ldquo;FADP&rdquo;); (d)
          the California Consumer Privacy Act of 2018 as amended by the
          California Privacy Rights Act of 2020 (&ldquo;CCPA/CPRA&rdquo;); (e)
          the Virginia Consumer Data Protection Act (&ldquo;VCDPA&rdquo;), the
          Colorado Privacy Act (&ldquo;CPA&rdquo;), the Connecticut Data Privacy
          Act (&ldquo;CTDPA&rdquo;), the Utah Consumer Privacy Act
          (&ldquo;UCPA&rdquo;), the Texas Data Privacy and Security Act
          (&ldquo;TDPSA&rdquo;); and (f) any other applicable data protection
          or privacy law, in each case as updated, amended, or replaced from
          time to time.
        </li>
        <li>
          <strong>&ldquo;Customer Personal Data&rdquo;</strong> means any
          personal data (as defined in Article 4(1) GDPR) that {COMPANY_NAME}{" "}
          processes on behalf of the Customer in the course of providing the
          Service, as further described in Annex I.A.
        </li>
        <li>
          <strong>&ldquo;Controller&rdquo;</strong>, <strong>&ldquo;Processor&rdquo;</strong>,{" "}
          <strong>&ldquo;Sub-processor&rdquo;</strong>,{" "}
          <strong>&ldquo;Data Subject&rdquo;</strong>, and{" "}
          <strong>&ldquo;Personal Data Breach&rdquo;</strong> have the meanings
          given to them in Article 4 GDPR.
        </li>
        <li>
          <strong>&ldquo;Service&rdquo;</strong> means the Axolotl Army Portal
          provided at <a href={PORTAL_DOMAIN}>{PORTAL_DOMAIN}</a> and any
          related products, APIs, integrations, or features, as defined in the
          Terms of Service.
        </li>
        <li>
          <strong>&ldquo;SCCs&rdquo;</strong> means the European Commission&apos;s
          Standard Contractual Clauses for the transfer of personal data to
          third countries pursuant to the GDPR, set out in Implementing
          Decision (EU) 2021/914 of 4 June 2021.
        </li>
        <li>
          <strong>&ldquo;UK IDTA&rdquo;</strong> means the International Data
          Transfer Addendum to the SCCs issued by the United Kingdom
          Information Commissioner&apos;s Office under section 119A of the
          Data Protection Act 2018, in force from 21 March 2022.
        </li>
        <li>
          <strong>&ldquo;Third Country&rdquo;</strong> means a country outside
          the European Economic Area, the United Kingdom, or Switzerland that
          is not the subject of an adequacy decision under the relevant Data
          Protection Law.
        </li>
      </ul>

      <h2>2. Roles and scope</h2>
      <p>
        With respect to Customer Personal Data, the Customer is the Controller
        and {COMPANY_NAME} is the Processor. {COMPANY_NAME} processes Customer
        Personal Data only on behalf of, and under the documented instructions
        of, the Customer.
      </p>
      <p>
        With respect to <em>Customer Account Data</em> — the data
        {" "}{COMPANY_NAME} collects directly from the Customer&apos;s
        administrators to create and maintain the Customer&apos;s account
        (including name, billing email, login timestamps, and audit-log
        metadata of administrator actions) — {COMPANY_NAME} acts as an
        independent Controller. As an independent Controller, {COMPANY_NAME}{" "}
        determines the means and purposes (including retention, security
        measures, and lawful basis) for processing Customer Account Data, and
        publishes those determinations in its Privacy Policy at{" "}
        <a href={`${PORTAL_DOMAIN}/legal/privacy`}>
          {PORTAL_DOMAIN}/legal/privacy
        </a>
        .
      </p>
      <p>
        The processing activities, types of personal data, and categories of
        Data Subjects are described in <strong>Annex I.A</strong> below
        (rendered dynamically from {COMPANY_NAME}&apos;s current Service
        configuration).
      </p>

      <h2>3. Processor obligations</h2>
      <p>
        {COMPANY_NAME} shall, in connection with all Customer Personal Data:
      </p>
      <ul>
        <li>
          <strong>Process only on documented instructions.</strong> Process
          Customer Personal Data only on the documented instructions of the
          Customer, including with regard to transfers of Customer Personal
          Data to a Third Country, unless required to do otherwise by Union or
          Member State law to which {COMPANY_NAME} is subject (in which case{" "}
          {COMPANY_NAME} will inform the Customer of that legal requirement
          before processing, unless that law prohibits such information on
          important grounds of public interest). Customer&apos;s use of the
          Service constitutes its standing instruction; out-of-band instructions
          may be sent to <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
        </li>
        <li>
          <strong>Confidentiality.</strong> Ensure that persons authorized to
          process the Customer Personal Data are bound by written
          confidentiality obligations or are under an appropriate statutory
          obligation of confidentiality, and have received appropriate data
          protection training.
        </li>
        <li>
          <strong>Security (Article 32 GDPR).</strong> Implement and maintain
          the appropriate technical and organizational measures described in{" "}
          <strong>Annex II</strong> to ensure a level of security appropriate
          to the risk, taking into account the state of the art, the costs of
          implementation, and the nature, scope, context, and purposes of
          processing as well as the risk of varying likelihood and severity for
          the rights and freedoms of natural persons.
        </li>
        <li>
          <strong>Sub-processors (Article 28(2)–(4) GDPR).</strong> Engage
          Sub-processors only in accordance with Section 5 of this DPA, and
          impose on every Sub-processor data protection obligations
          substantially equivalent to those imposed on {COMPANY_NAME} under
          this DPA. {COMPANY_NAME} remains fully liable to the Customer for the
          performance of every Sub-processor.
        </li>
        <li>
          <strong>Assistance with Articles 32–36.</strong> Taking into account
          the nature of the processing and the information available to{" "}
          {COMPANY_NAME}, assist the Customer in ensuring compliance with the
          Customer&apos;s obligations under Articles 32 (security), 33 (Personal
          Data Breach notification to the supervisory authority), 34 (Personal
          Data Breach communication to Data Subjects), 35 (data protection
          impact assessments), and 36 (prior consultation) of the GDPR.
        </li>
        <li>
          <strong>Assistance with Data Subject requests.</strong> Taking into
          account the nature of the processing, assist the Customer by
          appropriate technical and organizational measures, insofar as
          possible, to fulfill the Customer&apos;s obligation to respond to
          requests for exercising the Data Subject rights laid down in Chapter
          III GDPR. {COMPANY_NAME} provides self-service tools — including the
          data export endpoint at{" "}
          <code>{PORTAL_DOMAIN}/api/account/export</code> and the deletion
          request endpoint at{" "}
          <code>{PORTAL_DOMAIN}/api/account/delete-request</code> — that the
          Customer may use directly or expose to its own Data Subjects.{" "}
          {COMPANY_NAME} will forward to the Customer any Data Subject request
          it receives directly relating to Customer Personal Data, and will not
          respond to such requests except as instructed by the Customer or as
          required by applicable law.
        </li>
        <li>
          <strong>Deletion or return at end of contract.</strong> At the choice
          of the Customer, delete or return all Customer Personal Data to the
          Customer at the end of the provision of services relating to
          processing, and delete existing copies unless Union or Member State
          law requires storage of the personal data. Per the Terms of Service
          termination clause, the Customer has a 30-day grace period after
          termination to export Customer Personal Data via the export endpoint;
          after the grace period, {COMPANY_NAME} will delete Customer Personal
          Data from active production systems within a further 30 days, and
          purge it from rolling encrypted backups within 90 days. Audit logs of
          security-sensitive administrator actions may be retained on a
          pseudonymized basis as required to demonstrate compliance.
        </li>
        <li>
          <strong>Audit support.</strong> Make available to the Customer all
          information necessary to demonstrate compliance with the obligations
          laid down in Article 28 GDPR and allow for and contribute to audits,
          including inspections, conducted by the Customer or another auditor
          mandated by the Customer, on the terms set out in Section 8 of this
          DPA.
        </li>
        <li>
          <strong>Notification of unlawful instructions.</strong> Immediately
          inform the Customer if, in {COMPANY_NAME}&apos;s opinion, an
          instruction infringes the GDPR or other Union or Member State data
          protection provisions.
        </li>
      </ul>

      <h2>4. Data Subject Rights</h2>
      <p>
        The Customer is responsible for handling Data Subject requests
        (including requests for access, rectification, erasure, restriction,
        portability, and objection) as the Controller of the Customer Personal
        Data. {COMPANY_NAME} provides the following assistance:
      </p>
      <ul>
        <li>
          <strong>Self-service tools.</strong> The data export endpoint
          (machine-readable JSON) and the deletion request endpoint allow the
          Customer to fulfil access, portability, and erasure requests without
          contacting {COMPANY_NAME} support.
        </li>
        <li>
          <strong>Direct requests.</strong> If a Data Subject contacts{" "}
          {COMPANY_NAME} directly to exercise a right, {COMPANY_NAME} will,
          within seven (7) business days, forward the request to the Customer
          and direct the Data Subject to the Customer for substantive response.
        </li>
        <li>
          <strong>Bespoke assistance.</strong> {COMPANY_NAME} will respond to
          bespoke assistance requests from the Customer (for example,
          locating or producing data not surfaced by the export endpoint) within
          seven (7) business days. The first five (5) bespoke assistance
          requests per calendar quarter are provided at no charge. For
          excessive or manifestly unfounded requests, {COMPANY_NAME} may charge
          a reasonable fee at its then-current professional services rate, with
          a written estimate provided in advance.
        </li>
      </ul>

      <h2>5. Sub-processors</h2>
      <p>
        The Customer authorizes {COMPANY_NAME} to engage the Sub-processors
        listed in <strong>Annex III</strong> below for the processing of
        Customer Personal Data. The list in Annex III is rendered dynamically
        from {COMPANY_NAME}&apos;s current configuration and is also published
        at{" "}
        <a href={`${PORTAL_DOMAIN}/legal/subprocessors`}>
          {PORTAL_DOMAIN}/legal/subprocessors
        </a>
        .
      </p>
      <p>
        The Customer grants {COMPANY_NAME} general written authorization to
        engage further Sub-processors. {COMPANY_NAME} will provide at least
        thirty (30) days&apos; notice of any addition or replacement of a
        Sub-processor that processes Customer Personal Data, by (a) updating
        the published Sub-processor list, (b) sending email notice to the
        primary administrator on the Customer&apos;s account, and (c)
        displaying an in-portal banner.
      </p>
      <p>
        During the notice period the Customer may object to the proposed
        change on reasonable data protection grounds by emailing{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. The parties will
        work in good faith to resolve the objection. If the objection cannot
        be resolved within the notice period, the Customer may, as its sole
        and exclusive remedy, terminate the affected Service component on
        written notice to {COMPANY_NAME} and receive a pro-rata refund of
        prepaid fees attributable to the unused portion of the affected Service
        component.
      </p>
      <p>
        {COMPANY_NAME} imposes on every Sub-processor — by written contract —
        data protection obligations substantially equivalent to those imposed
        on {COMPANY_NAME} under this DPA, in particular providing sufficient
        guarantees to implement appropriate technical and organizational
        measures so that the processing meets the requirements of the GDPR.
        {COMPANY_NAME} remains fully liable to the Customer for any failure by
        a Sub-processor to fulfil its data protection obligations.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Where the provision of the Service involves the transfer of Customer
        Personal Data from the European Economic Area, the United Kingdom, or
        Switzerland to a Third Country (including the United States, where{" "}
        {COMPANY_NAME} and many Sub-processors are located), the parties agree
        the following transfer mechanisms apply:
      </p>
      <ul>
        <li>
          <strong>EEA transfers.</strong> The SCCs are incorporated into this
          DPA by reference and apply to such transfers. <strong>Module Two
          (Controller-to-Processor)</strong> applies between the Customer (data
          exporter) and {COMPANY_NAME} (data importer). The optional docking
          clause in Clause 7 is not used. Clause 9(a) Option 2 (general written
          authorization) applies, with the time period set by Section 5 of this
          DPA. Clause 11(a) — the optional independent dispute resolution body
          — is not used. Clause 17 Option 2 applies (the SCCs are governed by
          the law of the EU Member State in which the Customer is established,
          or, where the Customer is not established in an EU Member State, by
          the law of Ireland). Clause 18(b) — the courts of that Member State
          (or Ireland) have exclusive jurisdiction. Annex I.A, Annex I.B,
          Annex II, and Annex III of the SCCs are populated by Annex I.A,
          Annex I.B, Annex II, and Annex III of this DPA respectively.
        </li>
        <li>
          <strong>Onward transfers to Sub-processors in Third Countries.</strong>{" "}
          <strong>Module Three (Processor-to-Processor)</strong> of the SCCs
          applies between {COMPANY_NAME} (data exporter) and the relevant
          Sub-processor (data importer). The Customer authorizes {COMPANY_NAME}{" "}
          to enter into Module Three SCCs with each such Sub-processor on the
          Customer&apos;s behalf.
        </li>
        <li>
          <strong>UK transfers.</strong> The UK IDTA is incorporated into this
          DPA by reference and applies to transfers from the United Kingdom.
          Table 1 (parties): the Customer is the data exporter and{" "}
          {COMPANY_NAME} is the data importer. Table 2 (selected SCCs, modules,
          selected clauses): Module Two of the SCCs as set out above. Table 3
          (Appendix Information): populated by the Annexes to this DPA.
          Table 4 (ending the IDTA): both parties may end the IDTA in
          accordance with Section 19 of the IDTA.
        </li>
        <li>
          <strong>Swiss transfers.</strong> The SCCs apply with the
          modifications recommended by the Swiss Federal Data Protection and
          Information Commissioner (FDPIC), namely: (a) references to the GDPR
          are read as references to the FADP; (b) references to EU Member
          State courts are read as references to the courts of Switzerland;
          (c) the FDPIC is the competent supervisory authority; and (d)
          references to &ldquo;EU&rdquo;, &ldquo;Union&rdquo;, or &ldquo;Member
          State&rdquo; law include FADP and Swiss law as applicable.
        </li>
      </ul>
      <p>
        Where the Sub-processor has executed the SCCs (or an equivalent
        adequacy mechanism such as Binding Corporate Rules or an adequacy
        decision) directly with {COMPANY_NAME}, that mechanism applies in
        addition to the onward transfer arrangements above. {COMPANY_NAME}{" "}
        performs a transfer impact assessment before onboarding any new
        Sub-processor that receives Customer Personal Data in a Third Country
        and applies supplementary technical measures (including encryption in
        transit, encryption at rest, and key separation) where required by the
        risk assessment.
      </p>

      <h2>7. Personal Data Breach</h2>
      <p>
        {COMPANY_NAME} will notify the Customer without undue delay, and where
        feasible within seventy-two (72) hours of confirmation of a
        Personal Data Breach affecting Customer Personal Data. Notification will
        be sent by (a) email to the primary administrator on the
        Customer&apos;s account and (b) an in-portal banner. The notification
        will, taking into account the nature of the processing and the
        information available, include at least:
      </p>
      <ul>
        <li>
          the nature of the Personal Data Breach including, where possible, the
          categories and approximate number of Data Subjects concerned and the
          categories and approximate number of personal data records concerned;
        </li>
        <li>
          the likely consequences of the Personal Data Breach;
        </li>
        <li>
          the measures taken or proposed to be taken by {COMPANY_NAME} to
          address the Personal Data Breach, including, where appropriate,
          measures to mitigate its possible adverse effects;
        </li>
        <li>
          the name and contact details of the {COMPANY_NAME} security contact
          ({SECURITY_EMAIL}) from whom more information can be obtained.
        </li>
      </ul>
      <p>
        Where it is not possible to provide all the information at the same
        time, the information may be provided in phases without further undue
        delay. {COMPANY_NAME} will cooperate in good faith with the Customer&apos;s
        remediation, regulator communication, and Article 33–34 GDPR notification
        obligations. A {COMPANY_NAME} notification of, or response to, a
        Personal Data Breach is not an acknowledgement of fault or liability.
      </p>

      <h2>8. Audit rights</h2>
      <p>
        {COMPANY_NAME} maintains, and provides to the Customer on request,
        evidence of its security and privacy compliance program, which
        includes (i) ongoing SOC 2 readiness work targeting a Type II
        attestation by 2027, (ii) an annual third-party penetration test of
        the production environment, (iii) continuous vulnerability scanning of
        application dependencies, and (iv) the technical and organizational
        measures described in Annex II.
      </p>
      <p>
        On at least thirty (30) days&apos; prior written notice, the Customer
        may audit {COMPANY_NAME}&apos;s compliance with this DPA, no more than
        once per twelve (12) month period, subject to the following:
      </p>
      <ul>
        <li>
          The audit is conducted at the Customer&apos;s expense.
        </li>
        <li>
          The audit is subject to a written non-disclosure agreement protecting
          {COMPANY_NAME}&apos;s and other customers&apos; confidential
          information.
        </li>
        <li>
          The scope of the audit is limited to verifying {COMPANY_NAME}&apos;s
          compliance with this DPA and applicable Data Protection Laws.
        </li>
        <li>
          {COMPANY_NAME} will provide reasonable access to relevant records,
          processes, and personnel during normal business hours.
        </li>
        <li>
          The audit must not unreasonably disrupt the Service, must not
          compromise the security or confidentiality of any other
          customer&apos;s data, and must not include penetration testing of
          the production environment without {COMPANY_NAME}&apos;s prior
          written consent.
        </li>
      </ul>
      <p>
        The Customer may satisfy its audit rights through {COMPANY_NAME}&apos;s
        most recent third-party audit reports, attestations, and penetration
        test summaries (subject to NDA), and only conduct on-site or
        questionnaire-based audits where the available reports are not
        sufficient. For Enterprise customers with a contract of fifty thousand
        US dollars (US $50,000) or more in annual recurring revenue, one (1)
        on-site audit per twelve (12) month period is provided at{" "}
        {COMPANY_NAME}&apos;s reasonable expense.
      </p>
      <p>
        Where required by Data Protection Laws, the Customer&apos;s competent
        supervisory authority has the same audit rights as the Customer under
        this Section 8.
      </p>

      <h2>9. Liability</h2>
      <p>
        Each party&apos;s liability under or in connection with this DPA
        (including the SCCs, the UK IDTA, and the Swiss adaptations) is
        subject to and counts toward the limitations and exclusions of
        liability set out in the Terms of Service. For the avoidance of
        doubt, the parties&apos; aggregate liability for all claims arising out
        of or related to this DPA, the SCCs, and the UK IDTA, taken together
        with all claims under the Terms of Service, is subject to the same
        aggregate cap stated in the Terms of Service.
      </p>
      <p>
        Where regulatory fines under Data Protection Laws are imposed on the
        parties as a result of a breach of this DPA, the parties will allocate
        responsibility for those fines in proportion to each party&apos;s
        respective fault, save that nothing in this DPA limits or excludes
        liability that cannot be limited or excluded by applicable law (for
        example, liability of a data importer to a Data Subject under Clause 12
        of the SCCs).
      </p>

      <h2>10. Term and termination</h2>
      <p>
        This DPA takes effect on the date the Customer accepts the Terms of
        Service (or such earlier date on which the Customer began using the
        Service) and continues for the duration of the Terms of Service. On
        termination of the Terms of Service for any reason, {COMPANY_NAME}{" "}
        will return or delete Customer Personal Data in accordance with the
        last paragraph of Section 3 of this DPA.
      </p>
      <p>
        The following Sections survive termination of this DPA: Section 4
        (Data Subject Rights, with respect to requests received before
        termination), Section 7 (Personal Data Breach, with respect to
        breaches affecting Customer Personal Data still held by{" "}
        {COMPANY_NAME}), Section 8 (Audit rights, for twelve (12) months after
        termination), Section 9 (Liability), and Section 11 (Governing law).
      </p>

      <h2>11. Governing law</h2>
      <p>
        This DPA is governed by the laws of the State of Delaware, United
        States, without regard to its conflict of laws principles.
      </p>
      <p>
        For Customer Personal Data subject to the GDPR or UK GDPR, the SCCs
        and UK IDTA are governed as follows:
      </p>
      <ul>
        <li>
          <strong>SCCs:</strong> per Module Two, Clause 17 Option 2 — the law
          of the EU Member State where the Customer (data exporter) is
          established. Where the Customer is not established in an EU Member
          State, the SCCs are governed by the law of Ireland.
        </li>
        <li>
          <strong>UK IDTA:</strong> the laws of England and Wales, with the
          courts of England and Wales having exclusive jurisdiction.
        </li>
        <li>
          <strong>Swiss adaptation:</strong> Swiss law, with the FDPIC as the
          competent supervisory authority and the courts of Switzerland having
          jurisdiction.
        </li>
      </ul>

      <h2>12. Order of precedence</h2>
      <p>
        In the event of any conflict or inconsistency between the documents
        governing the relationship between the parties, the following order of
        precedence applies (highest first): (1) the SCCs and UK IDTA, where
        they apply; (2) this DPA; (3) the Terms of Service. A document lower
        in the order of precedence applies only to the extent it does not
        conflict with a higher-ranked document.
      </p>

      <h2>13. Counterparts and signatures</h2>
      <p>
        This DPA is incorporated by reference into the Terms of Service. By
        clicking &ldquo;I agree&rdquo; (or any equivalent affirmative
        acceptance) during signup, by continuing to use the Service after this
        DPA takes effect, or by any other means by which the Customer accepts
        the Terms of Service, the Customer is bound by this DPA without the
        need for a wet-ink or electronic signature. Where this DPA is
        incorporated into an enterprise order form or master services
        agreement that itself is signed, that signature also binds the
        Customer to this DPA.
      </p>
      <p>
        Customers requiring a counter-signed copy of this DPA — for example,
        for procurement records or vendor risk management — may email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> requesting a
        DocuSign envelope. {COMPANY_NAME} will return a counter-signed copy
        within five (5) business days at no charge.
      </p>

      <h2>14. Contact</h2>
      <ul>
        <li>
          <strong>Privacy questions and Data Subject requests:</strong>{" "}
          <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
        </li>
        <li>
          <strong>Legal and DPA execution:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
        </li>
        <li>
          <strong>Security incidents and breach notification:</strong>{" "}
          <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>.
        </li>
      </ul>
      <p>Postal address (service of legal process):</p>
      <address className="not-italic">
        {POSTAL_ADDRESS_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
      <p>
        <strong>EU representative (GDPR Article 27).</strong>{" "}
        {EU_REPRESENTATIVE.appointed
          ? "Our Article 27 GDPR representative in the European Union is identified in the Privacy Policy. EU and EEA Data Subjects may contact the representative directly in their local language."
          : `${COMPANY_NAME} has not currently appointed an Article 27 representative in the European Union or United Kingdom. Until a representative is appointed, EU/EEA and UK Data Subjects may exercise every right under the GDPR or UK GDPR by contacting `}
        {EU_REPRESENTATIVE.appointed ? null : (
          <>
            <a href={`mailto:${EU_REPRESENTATIVE.contact}`}>
              {EU_REPRESENTATIVE.contact}
            </a>{" "}
            directly.
          </>
        )}
      </p>

      <hr className="my-10 border-portal-line-soft" />

      <h2>Annex I.A — Description of Processing</h2>
      <dl className="not-prose space-y-4 text-[#ddd]">
        <div>
          <dt className="font-semibold text-white">Subject matter</dt>
          <dd className="mt-1">
            The provision of the Service by {COMPANY_NAME} to the Customer
            under the Terms of Service.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-white">Duration</dt>
          <dd className="mt-1">
            For the term of the Terms of Service, plus the post-termination
            retention periods set out in Section 3 of this DPA (a 30-day
            export grace period, followed by deletion from production systems
            within a further 30 days, and purge from rolling encrypted backups
            within 90 days).
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-white">
            Nature and purpose of processing
          </dt>
          <dd className="mt-1">
            Hosting, transmitting, and storing Customer Personal Data in order
            to deliver the Service&apos;s features, including: AI video
            generation; social-media publishing and scheduling; lead generation,
            enrichment, and outreach; email and calendar synchronization;
            invoicing and payment processing; in-portal AI assistants (AXY,
            Axo) for customer support and content generation; analytics and
            error monitoring; and the related operational, security, and
            compliance activities described in {COMPANY_NAME}&apos;s Privacy
            Policy.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-white">
            Categories of Data Subjects
          </dt>
          <dd className="mt-1">
            <ul className="list-disc pl-5">
              <li>
                The Customer&apos;s authorized users (administrators, team
                members, agents, contractors).
              </li>
              <li>
                The Customer&apos;s end-recipients — including lead targets,
                cold-email recipients, calendar booking attendees, contact
                records, and other natural persons whose personal data the
                Customer uploads to or processes through the Service.
              </li>
              <li>
                Other natural persons whose personal data is incidentally
                included in content the Customer generates or uploads (for
                example, persons depicted in or referenced by user-supplied
                video prompts).
              </li>
            </ul>
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-white">
            Categories of Personal Data
          </dt>
          <dd className="mt-1">
            The following categories of Customer Personal Data are processed,
            corresponding to the data categories disclosed in{" "}
            {COMPANY_NAME}&apos;s Privacy Policy:
          </dd>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-portal-line-soft text-left text-[#bbb]">
                  <th className="py-2 pr-3 font-semibold">Category</th>
                  <th className="py-2 font-semibold">What it includes</th>
                </tr>
              </thead>
              <tbody>
                {DATA_CATEGORIES.map((c) => (
                  <tr
                    key={c.key}
                    className="border-b border-portal-line-soft/40 align-top text-[#ddd]"
                  >
                    <td className="py-3 pr-3 font-medium text-white">
                      {c.label}
                    </td>
                    <td className="py-3">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <dt className="font-semibold text-white">Special categories of data</dt>
          <dd className="mt-1">
            Special categories of personal data (Article 9 GDPR) are not
            intentionally processed by the Service. If the Customer uploads or
            submits special category data through prompts, content, lead lists,
            or contact records, the Customer is responsible for ensuring that
            it has a lawful basis for that processing under Article 9(2) GDPR
            and any applicable Member State law.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-white">Frequency of processing</dt>
          <dd className="mt-1">
            Continuous, for the duration of the Customer&apos;s use of the
            Service.
          </dd>
        </div>
      </dl>

      <h2>Annex I.B — Competent Supervisory Authority</h2>
      <p>
        Pursuant to Clause 13 of the SCCs, the competent supervisory authority
        is identified by reference to the Customer&apos;s establishment, as
        follows:
      </p>
      <ul>
        <li>
          Where the Customer is established in an EU Member State, the
          competent supervisory authority is the data protection authority of
          that Member State.
        </li>
        <li>
          Where the Customer is not established in an EU Member State but has
          appointed a representative under Article 27 GDPR, the competent
          supervisory authority is the authority of the Member State in which
          the representative is established.
        </li>
        <li>
          Where the Customer is not established in an EU Member State and has
          not appointed an Article 27 representative, but Data Subjects whose
          personal data is transferred under the SCCs are in an EU Member
          State, the competent supervisory authority is the authority of that
          Member State.
        </li>
        <li>
          For UK transfers under the UK IDTA, the competent supervisory
          authority is the United Kingdom Information Commissioner&apos;s
          Office (ICO).
        </li>
        <li>
          For Swiss transfers, the competent supervisory authority is the
          Swiss Federal Data Protection and Information Commissioner (FDPIC).
        </li>
      </ul>

      <h2>Annex II — Technical and Organizational Measures (TOMs)</h2>
      <p>
        {COMPANY_NAME} implements and maintains the following technical and
        organizational measures, in accordance with Article 32 GDPR. The
        measures are reviewed at least annually and updated to reflect the
        state of the art and the risk profile of the Service.
      </p>

      <h3>Encryption</h3>
      <ul>
        <li>
          <strong>In transit:</strong> TLS 1.3 (or later) for every connection
          between the user&apos;s browser, the portal, our APIs, and our
          Sub-processors. HTTP Strict Transport Security (HSTS) is enforced
          with preload.
        </li>
        <li>
          <strong>At rest — application secrets:</strong> AES-256-GCM for
          OAuth refresh tokens, mailbox credentials, and other sensitive
          application secrets. Encryption keys are held outside the database
          and rotated; a dual-key rotation mechanism (
          <code>APP_ENCRYPTION_KEY</code> +<code> APP_ENCRYPTION_KEY_OLD</code>
          ) supports zero-downtime key rotation.
        </li>
        <li>
          <strong>At rest — passwords:</strong> bcrypt (with appropriate cost
          factor); plaintext passwords are never stored or logged.
        </li>
        <li>
          <strong>At rest — database:</strong> the production PostgreSQL
          database (Neon) provides encryption at rest at the storage layer.
        </li>
      </ul>

      <h3>Access control</h3>
      <ul>
        <li>
          Role-based access control (RBAC) at the application layer (OWNER,
          ADMIN, MEMBER tiers) with least-privilege defaults.
        </li>
        <li>
          Engineering production access is restricted to named individuals,
          gated by single sign-on, and granted on a least-privilege basis with
          time-bound elevation.
        </li>
        <li>
          <strong>Multi-factor authentication.</strong> Production-engineering
          access at our cloud providers (Vercel, Neon, Cloudflare, Stripe) is
          gated by 2FA enforced by those providers. Customer-facing 2FA on the
          Portal application is on the product roadmap; until shipped, we
          mitigate credential-stuffing with a 5-failure / 15-minute
          login-attempt lockout per email address.
        </li>
        <li>
          <strong>Audit logs.</strong> Privileged administrator actions and
          security-sensitive events (logins, password changes, role changes,
          billing actions, manual data deletions, OAuth grants and
          revocations) are recorded in an <code>AuditLog</code> table stored
          in our managed Postgres database with continuous point-in-time
          recovery. Logs are append-only in operation but are not
          cryptographically tamper-evident.
        </li>
      </ul>

      <h3>Network security</h3>
      <ul>
        <li>
          Production traffic is served over the Vercel edge network. Edge
          rate-limiting (Upstash) protects the application from
          credential-stuffing, scraping, and brute-force attacks.
        </li>
        <li>
          DDoS mitigation is provided by Cloudflare in front of the edge
          network.
        </li>
        <li>
          A login-attempt lockout mechanism (5 failures per 15 minutes,
          per-email, case-insensitive) protects the credentials provider.
        </li>
      </ul>

      <h3>Application security</h3>
      <ul>
        <li>
          Static analysis, type checking (TypeScript strict mode), and
          dependency vulnerability scanning (npm audit) on every change.
        </li>
        <li>
          Secret-scanning hooks and pre-commit checks prevent credentials from
          being committed to source control.
        </li>
        <li>
          Software composition analysis (SCA) flags known-vulnerable packages
          before they reach production.
        </li>
        <li>
          A Content Security Policy (CSP) is enforced; mixed-content is
          blocked; cookies are <code>Secure</code>, <code>HttpOnly</code>, and
          <code> SameSite=Lax</code> by default.
        </li>
        <li>
          All client-controlled HTML is escaped through{" "}
          <code>htmlEscape()</code> before rendering in email templates and
          PDFs to prevent injection attacks. All outbound URLs are validated
          via a scheme allowlist (<code>safeExternalUrl()</code>), and
          server-to-server calls use constant-time secret comparison
          (<code>internalAuth</code>).
        </li>
        <li>
          Input from third-party LLM tool calls and other untrusted sources is
          Zod-validated against authoritative schemas before reaching business
          logic.
        </li>
      </ul>

      <h3>Data minimization and pseudonymization</h3>
      <ul>
        <li>
          We collect only the data needed to operate the Service. New data
          flows pass a data-minimization review before launch.
        </li>
        <li>
          User identifiers are hashed (one-way) before being sent to error
          monitoring tools where the raw identifier is not required.
        </li>
        <li>
          Personally identifiable data is redacted from verbose application
          logs.
        </li>
        <li>
          Aggregate, de-identified analytics are used for product
          decision-making in preference to individual-level analytics.
        </li>
      </ul>

      <h3>Backups and resilience</h3>
      <ul>
        <li>
          Continuous point-in-time recovery (PITR) is provided by the database
          host (Neon). Backup encryption is inherited from the underlying
          storage layer.
        </li>
        <li>
          Restore drills are performed at least quarterly to verify recoverability.
        </li>
        <li>
          Business continuity targets: Recovery Time Objective (RTO) of four
          (4) hours; Recovery Point Objective (RPO) of fifteen (15) minutes —
          as published in the Service Level Agreement at{" "}
          <a href={`${PORTAL_DOMAIN}/legal/sla`}>
            {PORTAL_DOMAIN}/legal/sla
          </a>
          .
        </li>
      </ul>

      <h3>Logging and monitoring</h3>
      <ul>
        <li>
          Structured application logs centralized in a query-able store; PII
          is redacted at the source.
        </li>
        <li>
          Native error monitor (with optional Sentry alongside) aggregates
          exceptions for triage; stack traces are retained, payloads are
          sanitized.
        </li>
        <li>
          Uptime checks (synthetic transactions) run continuously against
          production endpoints and trigger paging on failure.
        </li>
        <li>
          Security events (failed logins, privilege escalations, sensitive
          actions) are written to a tamper-evident audit log.
        </li>
      </ul>

      <h3>Incident response</h3>
      <ul>
        <li>
          A documented incident response runbook with defined severity tiers,
          escalation paths, on-call rotation, and a 72-hour Personal Data
          Breach notification commitment (Section 7).
        </li>
        <li>
          Post-incident reviews are conducted for every Severity 1 incident
          and material near-miss; corrective actions are tracked to closure.
        </li>
        <li>
          Vulnerability reports are accepted at{" "}
          <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>; we honor
          coordinated disclosure timelines.
        </li>
      </ul>

      <h3>Personnel</h3>
      <ul>
        <li>
          Background checks (where lawful) before granting production access.
        </li>
        <li>
          Written confidentiality and acceptable-use commitments for every
          person with access to Customer Personal Data.
        </li>
        <li>
          Annual security and privacy training for all engineering and
          customer-facing staff.
        </li>
        <li>
          Quarterly phishing simulations with remedial training for any
          failure.
        </li>
      </ul>

      <h3>Vendor management</h3>
      <ul>
        <li>
          Every Sub-processor is reviewed against {COMPANY_NAME}&apos;s vendor
          risk standard before onboarding. The minimum baseline is: a
          published privacy policy; a GDPR-compliant DPA available; encryption
          at rest and in transit; a documented incident response process; and
          (where applicable) a recent SOC 2 Type II or ISO 27001 attestation.
        </li>
        <li>
          Sub-processors are reviewed at least annually and on any material
          change to their processing activities.
        </li>
      </ul>

      <h3>Physical security</h3>
      <ul>
        <li>
          Customer Personal Data is hosted in tier-1 cloud data centers
          operated by Sub-processors that maintain SOC 2 Type II, ISO 27001,
          or equivalent attestations covering physical access control,
          environmental safeguards, and media destruction.
        </li>
      </ul>

      <h3>Business continuity and disaster recovery</h3>
      <ul>
        <li>
          Production architecture is multi-region (or multi-AZ as applicable)
          for high availability of stateless components.
        </li>
        <li>
          Documented failover procedures exist for the database and primary
          object store.
        </li>
        <li>
          RTO 4 hours, RPO 15 minutes, as published in the SLA.
        </li>
      </ul>

      <h2>Annex III — List of Sub-processors</h2>
      <p>
        The Sub-processors below are engaged by {COMPANY_NAME} to process
        Customer Personal Data on behalf of the Customer. The list is rendered
        from {COMPANY_NAME}&apos;s current Service configuration and reflects
        the state of processing on the effective date at the top of this DPA.
      </p>
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
        We will provide at least thirty (30) days&apos; notice of any addition
        or material change to this list via email to the primary administrator
        on the Customer&apos;s account and an in-portal banner. The current
        list above is also published as a stand-alone page at{" "}
        <a href={`${PORTAL_DOMAIN}/legal/subprocessors`}>
          {PORTAL_DOMAIN}/legal/subprocessors
        </a>{" "}
        for ease of reference and procurement review.
      </p>
    </>
  );
}
