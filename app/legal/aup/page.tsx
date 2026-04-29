import type { Metadata } from "next";
import Link from "next/link";
import {
  COMPANY_NAME,
  LEGAL_EMAIL,
  SECURITY_EMAIL,
  LEGAL_EFFECTIVE_DATE_HUMAN,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: `Acceptable Use Policy — ${COMPANY_NAME}`,
  description: `What you can and cannot do with the ${COMPANY_NAME} Portal — content rules, conduct rules, cold-email rules for Lead Finder, and AI-specific limits.`,
};

export default function AupPage() {
  return (
    <>
      <h1>Acceptable Use Policy</h1>
      <p>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</p>

      <p>
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) sets the rules for
        anyone using the {COMPANY_NAME} Service. It is part of, and
        incorporated by reference into, our{" "}
        <Link href="/legal/terms">Terms of Service</Link>. Violations of this
        AUP are violations of those Terms and grounds for suspension or
        termination of your account.
      </p>

      <h2>1. Scope</h2>
      <p>
        This AUP applies to every person and team that uses the Service,
        including account owners, invited team members, end recipients of
        outreach you send through the Service, and anyone who accesses our
        APIs or webhooks. You are responsible for the activity of anyone you
        give access to your account, and for the content and effects of
        anything sent or published using the Service on your behalf.
      </p>

      <h2>2. Prohibited content</h2>
      <p>
        You may not create, upload, generate, store, or distribute through
        the Service any content that is, or that is intended to:
      </p>
      <ul>
        <li>
          Illegal under the laws of any jurisdiction where you operate the
          Service or where the content is published or received.
        </li>
        <li>
          Sexually explicit, including any AI-generated child sexual abuse
          material (CSAM). We have zero tolerance. We report suspected CSAM
          to the National Center for Missing &amp; Exploited Children (NCMEC)
          and to law enforcement as required by law.
        </li>
        <li>
          Targeted harassment, doxing (publishing private identifying
          information without consent), or threats of violence against any
          person or group.
        </li>
        <li>
          Hate speech, defined as content that attacks or dehumanizes people
          based on race, ethnicity, national origin, religion, caste, sexual
          orientation, gender, gender identity, disability, or serious
          disease, consistent with U.S. and EU definitions of protected
          classes.
        </li>
        <li>
          Disinformation campaigns, election interference, manipulated media
          designed to mislead, or deepfakes of real people created or
          published without that person&rsquo;s explicit, documented consent.
        </li>
        <li>Promotion or glorification of self-harm or suicide.</li>
        <li>
          Trademark, copyright, or other intellectual-property infringement.
          By uploading or generating content you assert that you have all
          rights you need to do so.
        </li>
        <li>
          Likenesses or voices of real people without their explicit,
          documented consent. This includes synthetic faces, voice clones,
          and any other deepfake of a real individual.
        </li>
      </ul>

      <h2>3. Prohibited conduct</h2>
      <p>You may not:</p>
      <ul>
        <li>
          Reverse-engineer, decompile, scrape, or attempt to extract data
          from the Service except through documented APIs and within their
          rate limits.
        </li>
        <li>
          Probe, scan, or test the security of the Service, attempt
          privilege escalation, or exploit a vulnerability outside our
          published responsible-disclosure process. Researchers acting in
          good faith should follow{" "}
          <Link href="/legal/security">/legal/security</Link>.
        </li>
        <li>
          Use the Service to send spam. Cold outreach is permitted only when
          it follows the rules in Section 4 below. The Lead Finder outreach
          features include built-in CAN-SPAM and GDPR-compliant unsubscribe
          handling, suppression lists, mailbox warmup, domain throttling,
          and circuit breakers; you may not bypass, suppress, or work around
          any of those guardrails.
        </li>
        <li>
          Share login credentials or use one account for multiple humans.
          Use the team-member feature (with OWNER, ADMIN, or MEMBER roles)
          to add collaborators.
        </li>
        <li>
          Resell or redistribute Service-generated content as a stock or
          template library without first confirming that the underlying
          model license permits it. Veo&nbsp;3, Runway Gen-4.5, Anthropic,
          OpenAI, ElevenLabs, and Deepgram each impose their own terms on
          outputs.
        </li>
        <li>
          Circumvent usage limits, rate limits, or tier gates &mdash;
          including by creating multiple accounts, using stolen payment
          credentials, or coordinating across accounts to exceed quotas.
        </li>
        <li>
          Use the Service to build, train, or operate a product that
          competes directly with the Service, including by using its
          outputs as training data for a competing AI agent.
        </li>
        <li>
          Interfere with or disrupt the Service, our infrastructure, or
          other users &mdash; including denial-of-service attacks, sending
          malware, or running stress tests without our written permission.
        </li>
      </ul>

      <h2>4. Outreach and cold-email rules (Lead Finder)</h2>
      <p>
        If you use Lead Finder, the Outreach features, or any other Service
        capability that sends email or messages on your behalf, you are the
        sender of those messages. The Service is an automation tool with
        guardrails; final compliance with applicable law is your
        responsibility. You must:
      </p>
      <ul>
        <li>
          <strong>CAN-SPAM Act (United States).</strong> Identify yourself
          accurately as the sender; include a valid physical postal address
          in the footer of every commercial email; provide a clear and
          conspicuous unsubscribe mechanism that works for at least 30 days;
          do not use deceptive subject lines or headers; and honor opt-outs
          within 10 business days. The Service automates suppression on your
          behalf.
        </li>
        <li>
          <strong>GDPR (EU/EEA) and UK GDPR.</strong> Have a documented
          lawful basis for sending &mdash; typically legitimate interest with
          a documented balancing test, or explicit consent &mdash; honor the
          right to object, the right of access, and the right to erasure;
          and disclose the use of automated outreach to recipients on
          request.
        </li>
        <li>
          <strong>CASL (Canada).</strong> Have express or, where applicable,
          implied consent before sending commercial electronic messages;
          identify yourself accurately; and include a working unsubscribe
          link.
        </li>
        <li>
          <strong>Other jurisdictions.</strong> Comply with any other
          applicable anti-spam, marketing, or data-protection law that
          applies to you or to the recipients you contact (for example,
          Australia&rsquo;s Spam Act, Brazil&rsquo;s LGPD, India&rsquo;s
          DPDP Act).
        </li>
        <li>
          Do not bypass the Service&rsquo;s built-in unsubscribe handling,
          suppression list, mailbox warmup ramp, domain throttle, or
          bounce-rate circuit breaker. These exist to protect your sender
          reputation and the recipients&rsquo; rights and may not be
          disabled.
        </li>
      </ul>

      <h2>5. AI-specific rules</h2>
      <p>
        Beyond the general content rules in Section 2, AI-generated content
        on the Service is subject to these limits:
      </p>
      <ul>
        <li>
          Do not impersonate a real person without their explicit, documented
          consent. This includes voice cloning, face generation, and any
          form of synthetic identity capture.
        </li>
        <li>
          Do not generate content designed to defame, harass, blackmail,
          extort, or commit fraud against any person or organization.
        </li>
        <li>
          Do not generate content meant to deceive about its origin or
          authorship. Examples include fake testimonials presented as real
          customer statements, political deepfakes presented as authentic
          footage, and synthetic news clips presented as journalism.
        </li>
        <li>
          Do not generate content that violates the policies of any platform
          where you intend to publish it. TikTok, YouTube, Instagram, X,
          LinkedIn, Threads, Facebook, and other platforms have their own
          rules &mdash; including AI-disclosure requirements &mdash; and you
          must comply with them as the publisher.
        </li>
        <li>
          Where required by law (for example, the FTC&rsquo;s endorsement
          and AI-disclosure guidance, or Article 50 of the EU AI Act),
          disclose that the content is AI-generated.
        </li>
      </ul>

      <h2>6. Reporting violations</h2>
      <ul>
        <li>
          Security vulnerabilities or active abuse of our infrastructure:
          email{" "}
          <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>.
        </li>
        <li>
          Content abuse, copyright complaints, harassment, or other AUP
          violations: email{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
        </li>
      </ul>
      <p>
        We acknowledge reports within five (5) business days and update you
        on next steps. Please include enough information for us to identify
        the content or account involved (URLs, account names, screenshots,
        timestamps).
      </p>

      <h2>7. Consequences of violations</h2>
      <ul>
        <li>
          <strong>First, non-egregious offense.</strong> We typically issue
          a warning, remove the offending content, and ask you to confirm
          you understand the rule. Repeat or unresolved violations escalate.
        </li>
        <li>
          <strong>Egregious offense.</strong> Conduct including (without
          limitation) CSAM, election manipulation, doxing, threats of
          violence, fraud, malware distribution, or coordinated platform
          abuse will result in immediate termination without notice, no
          refund, and reporting to law enforcement and platform partners
          where required.
        </li>
        <li>
          <strong>Repeated violations.</strong> A pattern of violations,
          even if individually minor, results in termination.
        </li>
        <li>
          <strong>Cooperation.</strong> We cooperate with valid law-
          enforcement requests and with platform partners&rsquo; trust-and-
          safety processes. We may preserve account data when we receive a
          credible legal-hold request.
        </li>
      </ul>

      <h2>8. Changes to this AUP</h2>
      <p>
        We may update this AUP from time to time. For material changes we
        will email you at least 30 days before the changes take effect and
        post a banner in the Portal. Continued use of the Service after the
        effective date constitutes acceptance of the updated AUP.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this AUP:{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </>
  );
}
