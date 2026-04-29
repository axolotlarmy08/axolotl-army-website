import type { Metadata } from "next";
import {
  COMPANY_NAME,
  LEGAL_EFFECTIVE_DATE_HUMAN,
  LEGAL_EMAIL,
  PORTAL_DOMAIN,
  SUPPORT_EMAIL,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy — Axolotl Army Portal",
  description:
    "How cancellations, refunds, money-back guarantees, dunning, chargebacks, and statutory consumer rights work for the Axolotl Army Portal.",
};

/**
 * Refund + Cancellation Policy — production document.
 *
 * Source of truth for the company name, contact emails, portal domain, and
 * effective date is `lib/legalContent.ts`. Edit that file when those values
 * change instead of patching strings inline here.
 *
 * Scope: applies to all paid plans (Starter, Pro, Premium, Enterprise),
 * add-ons (Editor Add-on, Lead Finder Add-on), and credit top-ups. Annual
 * plans, Enterprise contracts, and consumer-protection statutory rights
 * have specific carve-outs documented below.
 */
export default function RefundsPage() {
  return (
    <>
      <h1>Refund and Cancellation Policy</h1>
      <p>
        <em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em>
      </p>

      <p>
        This policy explains how cancellations, refunds, dunning, and
        chargebacks work for the {COMPANY_NAME} Portal at{" "}
        <a href={PORTAL_DOMAIN}>{PORTAL_DOMAIN.replace(/^https?:\/\//, "")}</a>.
        It is written in plain English first; the more formal language in
        each section is the binding text. Where a national or state consumer
        law gives you stronger rights than the ones described here, those
        statutory rights apply.
      </p>

      <h2>1. Overview and scope</h2>
      <p>
        This policy applies to every paid product offered by {COMPANY_NAME},
        including monthly and annual subscriptions, add-ons, and one-off
        credit top-ups. It governs:
      </p>
      <ul>
        <li>
          Subscription cancellations on the <strong>Starter</strong>,{" "}
          <strong>Pro</strong> ($49/month), <strong>Premium</strong>{" "}
          ($199/month), and <strong>Enterprise</strong> (custom) tiers.
        </li>
        <li>
          Add-on cancellations for the <strong>Editor Add-on</strong> and the{" "}
          <strong>Lead Finder Add-on</strong> ($49/month).
        </li>
        <li>One-off credit top-ups used for AI generation jobs.</li>
        <li>
          When subscription fees are and are not refundable (we do not offer a
          general money-back guarantee — section 3 explains the narrow
          situations in which we will refund anyway).
        </li>
        <li>
          Failed-payment handling, account locking, and chargeback procedures.
        </li>
      </ul>
      <p>
        All billing is processed by Stripe. Refunds are issued back to the
        original payment method via Stripe; we do not offer cash, store
        credit, or alternative-currency refunds.
      </p>

      <h2>2. Subscription cancellation</h2>

      <h3>2.1 How to cancel</h3>
      <p>
        You can cancel any active subscription at any time. There is no
        cancellation fee and you do not need to contact us first. To cancel:
      </p>
      <ul>
        <li>
          In the portal: navigate to <strong>Settings &rarr; Plan</strong> and
          click <strong>Cancel subscription</strong>.
        </li>
        <li>
          Programmatically: send an authenticated <code>POST</code> to{" "}
          <code>/api/client/billing/cancel</code>.
        </li>
        <li>
          By email: write to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the
          email address on the account.
        </li>
      </ul>

      <h3>2.2 Effect of cancellation</h3>
      <p>
        Cancellation is effective at the end of the current paid period. You
        keep access to all features that are part of your plan until that
        date, after which the account moves to the free tier (read-only for
        paid features). We do not pro-rate or refund the unused portion of
        the current period unless one of the carve-outs in section 3 or 4
        applies.
      </p>

      <h3>2.3 No cancellation fees</h3>
      <p>
        We never charge a fee for cancelling. If you see an unexpected charge
        labelled as a cancellation fee, treat it as a billing error and
        contact <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>

      <h3>2.4 Re-enabling a cancelled account — the 30-day grace</h3>
      <p>
        When your last active subscription cancels, your account enters a{" "}
        <strong>30-day grace period</strong>. Your videos, projects,
        brand profile, contacts, leads, templates, and history remain
        on the account during the grace period. If you re-subscribe to
        any tier within those 30 days, the grace timer is cleared
        automatically and you regain access to everything as it was.
      </p>
      <p>
        After the 30-day grace period elapses, your customer content is{" "}
        <strong>permanently deleted</strong> in a daily automated sweep:
        videos, leads, contacts, brand profile, calendar events,
        scheduled posts, templates, AXY conversations, and OAuth refresh
        tokens for your connected mailboxes and calendars are all
        removed. The account row remains as a tombstone (with PII
        nulled) so we can satisfy the legal-hold exception for invoices
        and payment records — those are retained per US tax / SOX rules
        for seven (7) years even after deletion.
      </p>
      <p>
        If you want to remove your data <strong>before</strong> the 30
        days are up, submit a deletion request via Settings &rarr;
        Privacy &amp; Data (or email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>) and an
        operator will process it sooner.
      </p>

      <h2>3. Subscriptions are non-refundable</h2>

      <h3>3.1 No general money-back guarantee</h3>
      <p>
        Subscription fees are <strong>non-refundable</strong>. We do not
        offer a 7-day, 14-day, or 30-day money-back guarantee on any
        monthly or annual subscription tier (Starter, Pro, Premium, or
        Enterprise). If you decide the Service is not for you, you can
        cancel at any time per section 2 above; you will not be billed for
        any period after cancellation, and your existing access continues
        through the end of the period you have already paid for.
      </p>
      <p>
        We take this position deliberately. Subscription fees fund
        ongoing access to AI generation capacity that is reserved for you
        regardless of whether you use it. Pre-loaded credits and add-on
        capacity also incur real upstream costs from our model providers
        the moment you activate them. A blanket money-back guarantee on a
        usage-based AI product creates a meaningful incentive to consume
        the included credits and then claim a refund — which is unfair to
        customers paying their fair share and to us. If you want to try
        the Portal before subscribing, contact{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to ask
        about current trial offers.
      </p>

      <h3>3.2 When we will issue a refund anyway</h3>
      <p>
        We will refund a subscription charge in the following narrow
        circumstances:
      </p>
      <ul>
        <li>
          <strong>Billing error.</strong> You were charged the wrong
          amount, charged twice, or charged after a confirmed cancellation.
          Email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with
          the affected charge details and we will reverse the error.
        </li>
        <li>
          <strong>Service-side failure to deliver.</strong> The Service
          was materially unavailable or substantially broken for the
          period covered by the charge, and the failure was attributable
          to us (not to a third-party API provider, your network, or
          incorrect use). We will refund the affected period, prorated.
          Where an SLA applies, the SLA service-credit calculation in
          section 8 governs and is the exclusive remedy for downtime.
        </li>
        <li>
          <strong>Statutory consumer-protection rights</strong> in your
          jurisdiction (see section 9). Those rights are not waived by
          this policy and override anything inconsistent in this section.
        </li>
        <li>
          <strong>Goodwill, at our sole discretion.</strong> In rare
          cases — for example, a documented support ticket showing you
          were unable to use the Service for reasons we agreed to fix and
          did not fix — we may issue a one-off goodwill refund. Goodwill
          refunds are not a precedent and are not available on demand.
        </li>
      </ul>

      <h3>3.3 What is excluded even from the discretionary refunds above</h3>
      <ul>
        <li>
          <strong>Subscription periods during which credits were
          consumed.</strong> If any AI generation, outreach send, or
          publish action ran on the account during the period, that
          period is treated as delivered. We may refund a prorated
          portion of an unused future period rather than the entire
          charge.
        </li>
        <li>
          <strong>Renewals after cancellation reminders.</strong> Annual
          plans send a 30-day renewal reminder; monthly plans show
          renewal dates in <a href={`${PORTAL_DOMAIN}/portal/plan`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/plan</a>.
          Forgetting to cancel is not by itself a basis for a refund.
        </li>
        <li>
          <strong>Repeat or serial signups.</strong> Where, in our
          reasonable judgement, the same customer has signed up multiple
          times to consume credits and reverse charges, we may decline
          further refund requests and may decline to provide the Service to
          that customer in future.
        </li>
      </ul>

      <h3>3.4 How to request a refund</h3>
      <ol>
        <li>
          Email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> from
          the address on the account.
        </li>
        <li>
          Tell us which charge you are asking about (date and approximate
          amount), why you are requesting the refund (which of the
          categories in section 3.2 applies), and any supporting context
          (support ticket numbers, screenshots, etc.).
        </li>
        <li>
          We confirm receipt within one business day. If the request is
          eligible, we issue the refund via Stripe within{" "}
          <strong>5&ndash;10 business days</strong>. Time to appear on
          your statement depends on your card issuer. If we decline, we
          will explain why.
        </li>
      </ol>

      <h2>4. Annual plans</h2>

      <h3>4.1 Non-refundable</h3>
      <p>
        Annual subscriptions are paid upfront for 12 months and are{" "}
        <strong>non-refundable</strong> in the same way as monthly
        subscriptions (see section 3.1). Discounts on annual plans
        reflect that you are committing to the full 12-month period.
      </p>
      <p>
        The discretionary refund categories in section 3.2 apply to
        annual plans too. The most common path to a refund on an annual
        plan is a material breach of our <a href="/legal/sla">SLA</a> —
        for example, extended downtime — in which case service credits
        (and, where the SLA so provides, prorated cash refunds) are the
        exclusive remedy.
      </p>

      <h3>4.2 Auto-renewal</h3>
      <p>
        Stripe sends invoice and renewal notifications through your billing
        email at intervals controlled by your Stripe customer settings. We
        do not currently send a separate 30-day or 7-day renewal reminder
        from the Portal itself. Annual plans renew on the anniversary of
        purchase unless cancelled at any time before renewal.
      </p>

      <h2>5. Credit top-ups</h2>

      <h3>5.1 Why top-ups are non-refundable once consumed</h3>
      <p>
        AI generation credits are consumed in real time by upstream API
        providers — Kie.ai (Veo 3 video), Runway (Gen-4.5 video), Anthropic
        (Claude), and ElevenLabs (voice). Those providers bill us at the
        moment a generation runs, so once a credit is consumed we cannot
        recover the cost from them and cannot refund it to you.
      </p>

      <h3>5.2 Unused credits</h3>
      <p>
        Unused credits are kept on your account indefinitely while the
        account is active. We reserve the right to expire balances that have
        been unused for more than 12 months on 30 days&apos; written notice,
        but we do not currently apply this rule on a timer &mdash; credits
        remain redeemable until you actively use them or close your account.
      </p>

      <h3>5.3 Refund eligibility for top-ups</h3>
      <p>
        Once you click <em>Buy</em> on a credit top-up the order is
        considered final. We will refund a credit top-up only in these
        narrow circumstances:
      </p>
      <ul>
        <li>
          <strong>Zero credits consumed within 24 hours of purchase.</strong>
          {" "}If you contact us at{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> within 24
          hours and our records confirm the credits are entirely
          unconsumed, we will reverse the charge and remove the unused
          credit balance from your account.
        </li>
        <li>
          <strong>Service-side fault attributable to us.</strong> The
          credits could not be consumed because of a fault on our side
          (not a third-party API provider outage, which is covered by
          the SLA service-credit mechanism instead).
        </li>
        <li>
          <strong>Statutory rights</strong> under your local consumer-protection law (see section 9).
        </li>
      </ul>
      <p>
        Outside these categories, credit top-ups are non-refundable —
        whether or not you have used them yet — because the upstream API
        capacity is reserved for you the moment the top-up clears.
      </p>

      <h3>5.4 Bulk top-ups (Enterprise)</h3>
      <p>
        Bulk credit top-ups purchased by Enterprise customers are governed by
        the applicable order form and may have different expiry, transfer, or
        refund terms than retail top-ups. Where the order form is silent,
        this policy applies.
      </p>

      <h2>6. Failed payment and dunning</h2>
      <p>
        If a scheduled subscription charge fails (expired card, insufficient
        funds, fraud block, etc.) we follow Stripe&apos;s smart-retry
        schedule and step the account through a documented state machine
        until the balance clears. The actual states, timings, and
        capabilities are defined in code and reflected in your{" "}
        <a href={`${PORTAL_DOMAIN}/portal/plan`} target="_blank" rel="noreferrer noopener">portal.axolotlarmy.net/portal/plan</a>{" "}
        page in real time.
      </p>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>When it triggers</th>
            <th>What happens</th>
            <th>Your access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FAILED</td>
            <td>Day 0 — first failed payment</td>
            <td>
              Stripe retries automatically per its smart-retry schedule.
              Banner shown in <code>/portal/plan</code> with a one-click
              link to the Stripe billing portal.
            </td>
            <td>Full access during the grace period.</td>
          </tr>
          <tr>
            <td>LOCKED</td>
            <td>Day 3 of FAILED status</td>
            <td>
              Portal access is blocked. You can still buy credits (i.e.,
              pay the overdue balance) so the account can be restored,
              but generation, publishing, and editor features are paused.
            </td>
            <td>Restricted — only the billing surface remains usable.</td>
          </tr>
          <tr>
            <td>SUSPENDED</td>
            <td>Day 7 of FAILED status</td>
            <td>
              Outbound social publishing is paused (your scheduled slots
              are pulled). Portal access, AI generation, credit top-ups,
              and the editor continue to work, so any further outreach
              must be sent through your own connected mailbox rather than
              through us until the balance clears.
            </td>
            <td>Partial — publishing blocked, everything else works.</td>
          </tr>
          <tr>
            <td>CANCELLED</td>
            <td>Manual cancellation by you, or by us if the balance remains unpaid</td>
            <td>
              Subscription is closed. Access ends and we stop billing.
              Existing data remains on the account; see section 2.4 for
              how to remove it.
            </td>
            <td>None — re-subscribing restores access.</td>
          </tr>
        </tbody>
      </table>

      <p>
        Updating the payment method at any stage (from the Stripe billing
        portal linked inside <code>/portal/plan</code>) clears the failure
        and restores the account to <code>CURRENT</code> within minutes.
        We do not currently auto-cancel subscriptions on extended
        non-payment — accounts can sit in <code>SUSPENDED</code> until you
        either resolve the payment or cancel.
      </p>

      <h2>7. Chargebacks</h2>
      <p>
        Chargebacks are expensive for us and your card issuer alike, and
        the discretionary refund process in section 3.4 is faster and
        cleaner than a chargeback for legitimate disputes. If you believe
        a charge is wrong, please email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>{" "}
        <strong>before</strong> initiating a chargeback. We aim to resolve
        billing disputes within 5 business days.
      </p>
      <ul>
        <li>
          Initiating a chargeback before contacting us results in
          immediate <strong>account suspension</strong> until the
          dispute is resolved.
        </li>
        <li>
          We will dispute chargebacks where we have evidence of
          legitimate use (login records, generation history, publish
          events, outreach sends, IP addresses).
        </li>
        <li>
          A successful chargeback against an account that was using the
          Service in good faith does not by itself end the contract —
          the Stripe chargeback fee and the original charge become a
          debt that must be settled before the account is reactivated.
        </li>
        <li>
          Repeated chargebacks across multiple accounts or payment
          methods are treated as a violation of the Acceptable Use
          Policy and may result in permanent denial of service.
        </li>
      </ul>

      <h2>8. Service-interruption credits (cross-reference: SLA)</h2>
      <p>
        Refunds and service credits are different remedies for different
        problems. Refunds reverse a charge; service credits offset future
        invoices when we miss our uptime commitment.
      </p>
      <ul>
        <li>
          <strong>Enterprise customers with an active SLA:</strong> uptime
          shortfalls are remedied via service credits. See{" "}
          <a href="/legal/sla">/legal/sla</a> for the calculation table and
          how to claim.
        </li>
        <li>
          <strong>Starter, Pro, and Premium:</strong> we operate the Service
          to the same engineering standards and target 99.9% uptime, but
          there is no formal uptime guarantee and no service credits on
          these tiers. If you experience an unusable period attributable
          to us, the discretionary refund path in section 3.2 applies —
          contact <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with
          the affected timeframe.
        </li>
      </ul>

      <h2>9. Statutory consumer rights</h2>
      <p>
        Where you have stronger rights under consumer-protection law in your
        jurisdiction, those rights are not waived by this policy.
      </p>

      <h3>9.1 European Union and United Kingdom</h3>
      <p>
        Consumers (not businesses) resident in the EU or the UK have a{" "}
        <strong>14-day right of withdrawal</strong> under the Consumer
        Rights Directive (and equivalent UK legislation) for distance
        contracts. To exercise this right, email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> within 14
        days of subscribing.
      </p>
      <p>
        Important: under Article 16(m) of the Directive, the right of
        withdrawal for digital content is{" "}
        <strong>extinguished once performance has begun</strong> — that
        is, as soon as you sign a generation, send an outreach email,
        publish a post, or otherwise consume any included credit or
        feature. By signing up and confirming the consent prompt at
        checkout, you agree to immediate performance and acknowledge
        that you lose the right of withdrawal for any portion of the
        Service you have already used. We will refund a prorated portion
        of the period during which performance had not yet begun.
      </p>

      <h3>9.2 California</h3>
      <p>
        California buyers using the Service for personal, family, or
        household purposes have rights under California Civil Code
        &sect; 1750 et seq. Email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with proof of
        purchase to exercise those rights. As with section 9.1, refunds
        do not extend to portions of the Service that have already been
        delivered (credits consumed, sends made, content generated).
      </p>

      <h3>9.3 Other jurisdictions</h3>
      <p>
        Australia, Canada, and other jurisdictions with mandatory
        consumer-protection statutes (for example the Australian Consumer
        Law) override this policy where they offer broader rights. If you
        are unsure whether a statute applies, contact us and we will work
        through it with you.
      </p>

      <h2>10. How to contact us</h2>
      <p>
        For all billing, refund, cancellation, and chargeback questions:
      </p>
      <ul>
        <li>
          Email: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
        <li>
          For account-level support and payment-method updates:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </li>
      </ul>
      <p>
        Please send refund requests from the email address registered on the
        account so we can match you to the Stripe customer record without
        extra verification.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. For{" "}
        <strong>material changes</strong> — anything that reduces your
        refund or cancellation rights — we will give at least{" "}
        <strong>30 days&apos;</strong> advance notice by email and an in-app
        banner. Non-material changes (typo fixes, clarifications, formatting,
        new contact addresses) take effect when published. The effective
        date at the top of this page is updated on every change.
      </p>
    </>
  );
}
