import type { Metadata } from "next";
import Link from "next/link";
import {
  COMPANY_NAME,
  COMPANY_WEBSITE,
  PORTAL_DOMAIN,
  LEGAL_EMAIL,
  SUPPORT_EMAIL,
  LEGAL_EFFECTIVE_DATE_HUMAN,
  POSTAL_ADDRESS_LINES,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: `Terms of Service — ${COMPANY_NAME}`,
  description: `The agreement between you and ${COMPANY_NAME} for use of the Portal — AI video generation, social distribution, lead generation, and the AXY/Axo assistants.`,
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement
        between you and {COMPANY_NAME} (&ldquo;{COMPANY_NAME}&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;) and govern your access to and use
        of the {COMPANY_NAME} Portal at{" "}
        <a href={PORTAL_DOMAIN} target="_blank" rel="noreferrer noopener">
          {PORTAL_DOMAIN.replace(/^https?:\/\//, "")}
        </a>{" "}
        and the marketing site at{" "}
        <a href={COMPANY_WEBSITE} target="_blank" rel="noreferrer noopener">
          {COMPANY_WEBSITE.replace(/^https?:\/\//, "")}
        </a>{" "}
        (together, the &ldquo;Service&rdquo;). Please read them carefully.
      </p>

      <h2>1. Introduction and acceptance</h2>
      <p>
        By creating an account, clicking &ldquo;I agree&rdquo;, or using any
        part of the Service, you accept these Terms. If you do not agree, do
        not use the Service.
      </p>
      <p>
        You must be at least 16 years old to use the Service. If you are
        accepting these Terms on behalf of a company, organization, or other
        legal entity, you warrant that you have the authority to bind that
        entity to these Terms, and &ldquo;you&rdquo; refers both to you
        personally and to that entity.
      </p>
      <p>
        These Terms incorporate by reference our{" "}
        <Link href="/legal/privacy">Privacy Policy</Link>, our{" "}
        <Link href="/legal/aup">Acceptable Use Policy</Link>, our{" "}
        <Link href="/legal/refunds">Refund Policy</Link>, our{" "}
        <Link href="/legal/dpa">Data Processing Addendum</Link>, and (for
        Enterprise customers) our{" "}
        <Link href="/legal/sla">Service Level Agreement</Link>.
      </p>

      <h2>2. Description of the Service</h2>
      <p>
        The Service is a software-as-a-service platform that helps you create,
        manage, and distribute video and outreach content. Current capabilities
        include:
      </p>
      <ul>
        <li>
          AI-assisted video generation (short-form clips and multi-clip
          stories) using third-party model providers.
        </li>
        <li>
          Scheduling and publishing to connected social platforms (TikTok,
          Instagram, YouTube, Facebook, X, LinkedIn, Threads).
        </li>
        <li>
          Lead generation features, including ICP-based prospecting, sequenced
          outreach, mailbox warmup, and reply detection.
        </li>
        <li>
          The AXY assistant (a soldier-axolotl character with portal-wide
          awareness) and the Axo back-office assistant.
        </li>
        <li>
          Operational tooling such as calendars, invoicing, contact records,
          analytics, and integrations with Google Workspace, Microsoft Graph,
          and other services you choose to connect.
        </li>
      </ul>
      <p>
        The Service evolves. We may add, change, or remove features over time.
        We will give reasonable notice of changes that materially reduce
        functionality you are paying for.
      </p>

      <h2>3. Account registration</h2>
      <ul>
        <li>
          You must provide accurate, current, and complete information when you
          register, and keep that information up to date.
        </li>
        <li>
          One account per human. You may not share login credentials. If your
          team needs multiple seats, use the team-member feature, which adds
          collaborators to your account under one of three roles &mdash;
          OWNER, ADMIN, or MEMBER &mdash; through the ClientMember model.
        </li>
        <li>
          You are responsible for all activity under your account, including
          activity by team members you invite. Keep credentials confidential
          and notify us promptly at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> if you
          suspect unauthorized access.
        </li>
        <li>
          You may not register on behalf of someone else without authority, use
          a false identity, or evade a previous suspension or termination.
        </li>
      </ul>

      <h2>4. Subscription plans and billing</h2>

      <h3>4.1 Plans and add-ons</h3>
      <p>
        We offer tiered subscription plans (currently Starter, Pro, Premium,
        and Enterprise) and optional add-ons (such as the Editor Add-on and
        the Lead Finder Add-on). Current pricing is shown on the pricing page
        at{" "}
        <a href={COMPANY_WEBSITE} target="_blank" rel="noreferrer noopener">
          {COMPANY_WEBSITE.replace(/^https?:\/\//, "")}
        </a>{" "}
        and inside the Portal. Enterprise pricing is set by written order
        form.
      </p>

      <h3>4.2 Auto-renewal</h3>
      <p>
        Subscriptions renew automatically at the then-current price for the
        same billing interval until you cancel. You may cancel anytime from{" "}
        <a href={`${PORTAL_DOMAIN}/portal/plan`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/plan</a>; cancellation takes
        effect at the end of the current paid period.
      </p>

      <h3>4.3 Payment processor</h3>
      <p>
        Payments are processed by Stripe, Inc. By providing payment
        information you authorize Stripe to charge you on our behalf and
        agree to Stripe&rsquo;s{" "}
        <a
          href="https://stripe.com/legal/consumer"
          target="_blank"
          rel="noreferrer noopener"
        >
          consumer terms
        </a>{" "}
        and{" "}
        <a
          href="https://stripe.com/privacy"
          target="_blank"
          rel="noreferrer noopener"
        >
          privacy policy
        </a>
        . We do not store full payment card numbers; Stripe holds them under
        PCI-DSS.
      </p>

      <h3>4.4 Currency and taxes</h3>
      <p>
        All prices are in United States dollars (USD) unless otherwise stated.
        Prices are exclusive of taxes. You are responsible for any sales,
        VAT, GST, withholding, or other taxes imposed on your purchase by your
        jurisdiction. Where required, we collect and remit applicable taxes
        through Stripe Tax.
      </p>

      <h3>4.5 Credits</h3>
      <p>
        Some Portal features (notably AI video generation) consume credits at
        rates listed in the in-app cost map. Credits granted as part of a paid
        subscription are usable while your subscription is active and for up
        to 12 months after they are issued; after that buffer, unused credits
        expire. Credits granted promotionally or as a courtesy may have
        shorter expiry, which we will note when issued. Credits have no cash
        value and are not redeemable for refunds except where required by law
        or by our{" "}
        <Link href="/legal/refunds">Refund Policy</Link>.
      </p>

      <h3>4.6 Invoices, dunning, and account state</h3>
      <p>
        Invoices are issued at the time of purchase or renewal. If a payment
        fails, we will retry the charge in line with the Portal&rsquo;s
        dunning logic and notify you in-app and by email. The account states
        we use are:
      </p>
      <ul>
        <li>
          <strong>FAILED day 1&ndash;6:</strong> we retry; full access is
          preserved.
        </li>
        <li>
          <strong>SUSPENDED after 7 days of FAILED status:</strong> outbound
          publishing and AI generation are paused; data and exports remain
          available.
        </li>
        <li>
          <strong>LOCKED after 14 days:</strong> only billing actions and data
          export remain available.
        </li>
        <li>
          <strong>REVOKED after 21 days:</strong> Service access is fully
          revoked. Data is retained per Section 15 below for the grace period.
        </li>
      </ul>
      <p>
        You can resolve a failed payment at any time from the billing portal
        in <a href={`${PORTAL_DOMAIN}/portal/plan`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/plan</a>.
      </p>

      <h2>5. Free trial and freemium</h2>
      <p>
        If we offer you a free trial or freemium tier, we will tell you the
        scope and duration before you sign up. We do not charge a paid
        subscription fee while a trial is active. At the end of a trial, your
        plan converts to the paid tier you selected at sign-up unless you
        cancel before the trial ends. You can cancel at any time from{" "}
        <a href={`${PORTAL_DOMAIN}/portal/plan`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/plan</a>.
      </p>

      <h2>6. Cancellation and refunds</h2>
      <ul>
        <li>
          You may cancel your subscription at any time from{" "}
          <a href={`${PORTAL_DOMAIN}/portal/plan`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/plan</a>. Access continues
          through the end of the period you have already paid for, and we
          will not bill you for any subsequent period.
        </li>
        <li>
          <strong>Subscription fees are non-refundable.</strong> We do not
          offer a 7-day, 14-day, or 30-day money-back guarantee on any
          monthly or annual tier. Subscription fees fund AI generation
          capacity that is reserved for you regardless of whether you use
          it; a blanket money-back window on a usage-based AI product
          creates an obvious abuse vector and is unfair to customers
          paying their fair share.
        </li>
        <li>
          We will issue a refund on a discretionary basis for billing
          errors, service-side failures to deliver, or where required by
          statutory consumer-protection law. Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the
          affected charge details. The full criteria are in our{" "}
          <Link href="/legal/refunds">Refund Policy</Link>.
        </li>
        <li>
          Credit top-ups are non-refundable once consumed. Unconsumed
          top-ups are refundable only within 24 hours of purchase, per
          the Refund Policy.
        </li>
        <li>
          The full{" "}
          <Link href="/legal/refunds">Refund Policy</Link> governs any
          case not covered above, and controls if there is any conflict
          with this section.
        </li>
      </ul>

      <h2>7. Customer content and license</h2>
      <p>
        &ldquo;Customer Content&rdquo; means everything you upload, submit, or
        generate using the Service: prompts, reference images, audio, video,
        captions, brand profiles, lead and contact data, outreach copy, and
        the outputs the Service produces in response to your inputs.
      </p>
      <ul>
        <li>
          <strong>Ownership.</strong> You retain all right, title, and interest
          in and to your Customer Content, subject only to the upstream model
          licenses in Section 10.3.
        </li>
        <li>
          <strong>License to us.</strong> You grant {COMPANY_NAME} a
          non-exclusive, worldwide, royalty-free license to host, store, copy,
          process, transmit, display, and modify your Customer Content solely
          to provide, secure, and support the Service. The license terminates
          when you delete the content or the account, subject to backups and
          legal-hold obligations described in our Privacy Policy.
        </li>
        <li>
          <strong>Aggregated, anonymized usage data.</strong> We may compute
          and use aggregated, anonymized statistics about how the Service is
          used (for example, error rates, generation latency, feature
          adoption) to operate, secure, and improve the Service. Such data
          does not identify you or any individual.
        </li>
        <li>
          <strong>Model training.</strong> We do not train AI models on your
          Customer Content. Inference is performed by third-party model
          providers (currently Anthropic, OpenAI, ElevenLabs, Kie.ai, Runway,
          and Deepgram, among others). Their handling of your prompts and
          outputs is governed by their own terms; where the provider offers a
          &ldquo;no-retention&rdquo; or &ldquo;zero data retention&rdquo;
          mode, we use it.
        </li>
      </ul>

      <h2>8. Acceptable use</h2>
      <p>
        You must use the Service lawfully and respectfully. You may not, for
        example, generate sexually explicit content, harass identifiable
        people, deepfake real people without consent, run spam, scrape the
        Service, probe its security, or interfere with other users. The full
        list of prohibitions, plus the cold-email rules that apply when you
        use Lead Finder, is in our{" "}
        <Link href="/legal/aup">Acceptable Use Policy</Link>. Violations of
        the AUP are violations of these Terms.
      </p>

      <h2>9. Third-party services</h2>
      <p>
        The Service interoperates with third-party services that you choose to
        connect, including (without limitation) Google APIs (login, Gmail,
        Calendar, Drive, Maps), Microsoft Graph (Outlook calendar), Stripe,
        the social platforms you publish to, and the AI model providers used
        for generation. Your use of those services is governed by both these
        Terms and the third party&rsquo;s own terms and privacy policies. We
        are not responsible for the availability or behavior of third-party
        services. You can revoke access to any connected account at any time
        from <a href={`${PORTAL_DOMAIN}/portal/settings`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/settings</a> or directly
        with the third-party provider.
      </p>

      <h2>10. Intellectual property</h2>

      <h3>10.1 Our IP</h3>
      <p>
        The Service &mdash; including the Portal source code, design system,
        the AXY and Axo characters, the {COMPANY_NAME} marks, and our
        marketing assets &mdash; is owned by {COMPANY_NAME} or our licensors
        and is protected by copyright, trademark, and other laws. Except for
        the limited rights expressly granted in these Terms, we reserve all
        rights.
      </p>

      <h3>10.2 Restrictions</h3>
      <p>
        You may not copy, reverse-engineer, decompile, disassemble, or create
        derivative works of the Service or its software, except where the
        restriction is prohibited by law. You may not use the Service or its
        outputs to build or train a directly competing product.
      </p>

      <h3>10.3 Generated outputs and upstream licenses</h3>
      <p>
        Subject to your compliance with these Terms and the AUP, you own the
        outputs you generate through the Service. Outputs are also subject to
        the licenses imposed by the upstream model providers (for example,
        Veo&nbsp;3 for Kie.ai-generated clips and Gen-4.5 for Runway-generated
        clips, plus Anthropic, OpenAI, ElevenLabs, and Deepgram terms where
        their models are involved). You are responsible for reviewing and
        complying with those upstream licenses before commercial use,
        republication, or training of any other model.
      </p>

      <h2>11. AI-generated content disclaimers</h2>
      <ul>
        <li>
          AI-generated outputs may be inaccurate, biased, offensive, or
          infringe third-party rights. Review every output before publishing
          it.
        </li>
        <li>
          You are responsible for ensuring you have the rights to any
          reference images, audio, music, or other inputs you provide.
        </li>
        <li>
          You are responsible for compliance with the rules of any platform
          where you publish (for example, TikTok, YouTube, Instagram, X,
          LinkedIn). Some platforms require disclosure when content is AI-
          generated; see also the FTC AI-disclosure guidance and Article 50 of
          the EU AI Act.
        </li>
        <li>
          We provide the generation tool but do not warrant accuracy,
          originality, non-infringement, suitability for any purpose, or that
          outputs will be free of bias or factual error.
        </li>
      </ul>

      <h2>12. Confidentiality</h2>
      <p>
        We treat your business data &mdash; lead lists, brand profile, draft
        content, financial records, internal communications &mdash; as
        confidential and use it only to provide and improve the Service for
        you. You agree to treat our non-public pricing, roadmap, security
        controls, and other confidential information disclosed to you as
        confidential, and to use it only to evaluate and use the Service.
        Confidentiality obligations survive termination for three (3) years,
        or indefinitely for trade secrets.
      </p>

      <h2>13. Privacy</h2>
      <p>
        Our handling of personal data is described in our{" "}
        <Link href="/legal/privacy">Privacy Policy</Link>. Customers acting as
        a controller of personal data of EU/UK data subjects should also
        review our{" "}
        <Link href="/legal/dpa">Data Processing Addendum</Link>.
      </p>

      <h2>14. Service-level agreement</h2>
      <p>
        Enterprise customers receive uptime commitments and support response
        targets under the{" "}
        <Link href="/legal/sla">Service Level Agreement</Link>. Starter, Pro,
        and Premium tiers are provided on a best-effort basis without a
        formal uptime guarantee. We aim to maintain high availability and
        publish status at our status page when one is available.
      </p>

      <h2>15. Suspension and termination</h2>
      <ul>
        <li>
          <strong>By us.</strong> We may suspend or terminate your access for
          (a) violation of these Terms or the AUP, (b) non-payment, (c)
          activity that creates a security or stability risk to us or other
          users, or (d) where required by law or court order. Where
          practicable we will give notice and an opportunity to cure.
        </li>
        <li>
          <strong>By you.</strong> You may terminate at any time by cancelling
          your subscription and deleting your account from{" "}
          <a href={`${PORTAL_DOMAIN}/portal/settings`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/settings</a>.
        </li>
        <li>
          <strong>Effect of termination.</strong> After termination you have a
          30-day grace period to export your data through the in-Portal
          export tools or by emailing{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. After the
          grace period your Customer Content is deleted, subject to backups,
          legal-hold obligations, and the retention windows in our Privacy
          Policy. Provisions that by their nature should survive termination
          (for example, IP, confidentiality, disclaimers, limitation of
          liability, indemnity, and dispute resolution) survive.
        </li>
      </ul>

      <h2>16. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT
        PERMITTED BY LAW, {COMPANY_NAME.toUpperCase()} AND ITS LICENSORS
        DISCLAIM ALL IMPLIED WARRANTIES, INCLUDING WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
        AND ACCURACY OF AI OUTPUT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
        UNINTERRUPTED OR ERROR-FREE OR THAT GENERATED CONTENT WILL BE FREE OF
        BIAS, ERROR, OR INFRINGEMENT.
      </p>

      <h2>17. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR AGGREGATE LIABILITY ARISING
        OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE
        GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS
        PRECEDING THE EVENT GIVING RISE TO THE CLAIM AND (B) ONE HUNDRED U.S.
        DOLLARS ($100).
      </p>
      <p>
        WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS,
        REVENUE, GOODWILL, DATA, OR BUSINESS, EVEN IF WE HAVE BEEN ADVISED OF
        THE POSSIBILITY OF SUCH DAMAGES.
      </p>
      <p>
        Some jurisdictions do not allow the exclusion or limitation of certain
        damages, so some of the limitations above may not apply to you. In
        those jurisdictions, our liability is limited to the maximum extent
        permitted by law.
      </p>

      <h2>18. Indemnification</h2>
      <p>
        <strong>By you.</strong> You agree to defend, indemnify, and hold
        harmless {COMPANY_NAME}, its affiliates, and its personnel from and
        against any third-party claim, loss, or expense (including reasonable
        attorneys&rsquo; fees) arising from (a) your Customer Content, (b)
        your use of the Service, (c) your breach of these Terms or the AUP,
        or (d) your violation of any law or third-party right.
      </p>
      <p>
        <strong>By us.</strong> We will defend you against any third-party
        claim that the Service code itself, as we provide it, infringes a
        valid third-party intellectual-property right, and pay damages
        finally awarded against you on such a claim, provided you give us
        prompt notice and reasonable cooperation. This obligation does not
        apply to (i) generated outputs (which are subject to upstream model
        licenses), (ii) modifications you or a third party make to the
        Service, (iii) combinations of the Service with software or data we
        did not provide, or (iv) your Customer Content. If we believe the
        Service may be subject to such a claim, we may modify it, obtain a
        license, or terminate the affected feature with prorated refund.
        This Section 18 sets out our entire liability for IP infringement.
      </p>

      <h2>19. Dispute resolution</h2>

      <h3>19.1 Governing law</h3>
      <p>
        These Terms are governed by the laws of the State of Delaware, USA,
        without regard to its conflict-of-laws rules.
      </p>

      <h3>19.2 Informal resolution</h3>
      <p>
        Before filing any claim, you agree to try to resolve the dispute by
        contacting us at <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>{" "}
        and engaging in good-faith negotiation for at least 30 days.
      </p>

      <h3>19.3 Binding arbitration; class-action waiver</h3>
      <p>
        Any dispute that is not resolved informally will be settled by binding
        arbitration administered by JAMS in San Francisco, California, under
        the JAMS Streamlined Arbitration Rules. Arbitration will be conducted
        on an individual basis. You and {COMPANY_NAME} each waive any right
        to bring or participate in a class action, collective action, or
        representative proceeding, and waive any right to a jury trial.
      </p>

      <h3>19.4 30-day opt-out</h3>
      <p>
        You may opt out of the arbitration provision in Section 19.3 by
        emailing{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> within 30 days of
        first creating your account, with the subject line &ldquo;Arbitration
        Opt-Out&rdquo; and your account email in the body. Opting out does
        not affect any other part of these Terms.
      </p>

      <h3>19.5 Carve-outs</h3>
      <p>
        Either party may bring an individual action in small-claims court,
        and either party may seek injunctive or equitable relief in a court
        of competent jurisdiction to protect intellectual-property rights
        without first using the informal or arbitration steps above.
      </p>

      <h3>19.6 Consumers in the EU and UK</h3>
      <p>
        If you are a consumer in the European Union or the United Kingdom,
        nothing in these Terms removes mandatory consumer-protection rights
        you have under the law of your country of residence, including the
        right to bring proceedings in your local courts.
      </p>

      <h2>20. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. For material changes we
        will give you at least 30 days&rsquo; notice by email and a banner
        in the Portal before the changes take effect. Continued use of the
        Service after the effective date constitutes acceptance of the
        updated Terms. If you do not agree to the changes, cancel your
        subscription before they take effect.
      </p>

      <h2>21. General</h2>
      <ul>
        <li>
          <strong>Assignment.</strong> You may not assign these Terms without
          our prior written consent. We may assign these Terms to an
          affiliate or in connection with a merger, acquisition, or sale of
          assets.
        </li>
        <li>
          <strong>Severability.</strong> If any provision is held
          unenforceable, the remaining provisions remain in full force and
          effect, and the unenforceable provision will be modified only to
          the extent necessary to make it enforceable.
        </li>
        <li>
          <strong>Entire agreement.</strong> These Terms, together with the
          documents they incorporate by reference and any order form you
          sign with us, are the entire agreement between you and us about
          the Service and supersede prior agreements about the same subject.
        </li>
        <li>
          <strong>No waiver.</strong> Our failure to enforce a provision is
          not a waiver of our right to do so later.
        </li>
        <li>
          <strong>Force majeure.</strong> Neither party is liable for delay
          or failure caused by events beyond its reasonable control,
          including acts of God, war, terrorism, civil disturbance,
          governmental action, internet or third-party cloud-provider
          failures, and labor disputes.
        </li>
        <li>
          <strong>Export controls and sanctions.</strong> You may not use the
          Service in, or export the Service or any output to, any
          jurisdiction subject to comprehensive U.S. trade sanctions
          (currently Cuba, Iran, North Korea, Syria, and the Crimea, Donetsk,
          and Luhansk regions of Ukraine), and you may not be a person on
          any U.S. government denied-party list.
        </li>
        <li>
          <strong>U.S. government end users.</strong> The Service is
          &ldquo;commercial computer software&rdquo; under FAR 12.212 and
          DFARS 227.7202; rights are licensed to U.S. government end users
          only as set out in these Terms.
        </li>
      </ul>

      <h2>22. Contact</h2>
      <p>
        Legal notices and questions about these Terms:{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
      <address className="not-italic">
        {POSTAL_ADDRESS_LINES.map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </address>
    </>
  );
}
