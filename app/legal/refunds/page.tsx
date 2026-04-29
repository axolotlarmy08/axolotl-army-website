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
          The 7-day money-back guarantee on first-month subscriptions and the
          30-day money-back guarantee on annual signups.
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

      <h3>2.4 Re-enabling a cancelled account</h3>
      <p>
        You can re-subscribe to any tier at any time. If you re-subscribe
        within <strong>30 days</strong> of cancellation we restore your
        existing data (videos, projects, brand profile, contacts, leads,
        templates, history). After 30 days, account data is deleted in
        accordance with our Privacy Policy and cannot be recovered.
      </p>

      <h2>3. 7-day money-back guarantee</h2>

      <h3>3.1 What is covered</h3>
      <p>
        We offer a <strong>7-day money-back guarantee</strong> on the first
        paid month of a Starter, Pro, or Premium subscription. If you decide
        the Portal is not for you within 7 days of your first paid charge, we
        will refund the full amount of that charge.
      </p>

      <h3>3.2 What is not covered</h3>
      <p>
        The 7-day money-back guarantee does <strong>not</strong> apply to:
      </p>
      <ul>
        <li>
          Annual plans purchased at a discount (covered by section 4 instead).
        </li>
        <li>
          Enterprise contracts (those are governed by the order form and
          master services agreement signed at the time of purchase).
        </li>
        <li>The Lead Finder Add-on.</li>
        <li>The Editor Add-on.</li>
        <li>One-off credit top-ups (see section 5).</li>
        <li>
          Renewals — the guarantee is intentionally limited to the first paid
          month so customers cannot &ldquo;reset&rdquo; the window by
          re-subscribing.
        </li>
      </ul>

      <h3>3.3 How to request a refund under the 7-day guarantee</h3>
      <ol>
        <li>
          Email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> within 7
          days of your first paid charge from the email address on the
          account.
        </li>
        <li>
          Include your account email, the approximate date of the charge, and
          the last 4 digits of the card used (so we can match the Stripe
          charge).
        </li>
        <li>
          We confirm receipt within one business day and issue the refund via
          Stripe within <strong>5&ndash;10 business days</strong>. Time to
          appear on your statement depends on your card issuer.
        </li>
      </ol>
      <p>
        Refunds under the 7-day guarantee terminate the subscription
        immediately; access ends on the day the refund is issued.
      </p>

      <h2>4. Annual plans</h2>

      <h3>4.1 30-day money-back guarantee on first signup</h3>
      <p>
        Annual subscriptions are paid upfront for 12 months. The first time
        you purchase an annual plan you get a <strong>30-day</strong>{" "}
        money-back guarantee — full refund, account closed, no questions
        beyond the matching steps in section 3.3.
      </p>

      <h3>4.2 After 30 days</h3>
      <p>
        After the initial 30-day window, annual plans are non-refundable
        except where we materially breach this policy or our SLA. The most
        common example of a material breach is{" "}
        <strong>extended downtime</strong> — see our{" "}
        <a href="/legal/sla">SLA</a> for the exact thresholds and the
        service-credit calculation. Service credits are the exclusive remedy
        for downtime under the SLA; pro-rata cash refunds are available only
        when the SLA itself or applicable law mandates them.
      </p>

      <h3>4.3 Auto-renewal</h3>
      <p>
        Annual plans <strong>auto-renew</strong> for another 12 months at the
        then-current rate unless cancelled at least <strong>7 days</strong>{" "}
        before the renewal date. We send a reminder email 30 days before
        renewal. To cancel an annual plan ahead of renewal, follow the steps
        in section 2.1.
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
        Unused credits remain redeemable for <strong>12 months</strong> from
        the date of purchase. After 12 months, unused credits expire and have
        no cash value. We send an in-app reminder 30 days before expiry.
      </p>

      <h3>5.3 Refund eligibility for top-ups</h3>
      <p>
        We will refund a credit top-up at our discretion if:
      </p>
      <ul>
        <li>
          You request the refund within 7 days of purchase{" "}
          <strong>and</strong> none of the credits have been consumed; or
        </li>
        <li>
          The credits could not be consumed because of a Service-side fault
          attributable to us (not a third-party API provider outage covered
          by the SLA).
        </li>
      </ul>

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
        schedule and lock the account in stages. The schedule below is the
        default; specific timings may differ slightly because Stripe&apos;s
        smart retry adapts to the issuing bank&apos;s historical decline
        signals.
      </p>

      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Timing</th>
            <th>What happens</th>
            <th>Your access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Day 0</td>
            <td>First failed attempt</td>
            <td>
              Stripe retries automatically per its smart-retry schedule
              (typically days 3, 5, and 7 after the first decline).
            </td>
            <td>Full access</td>
          </tr>
          <tr>
            <td>Day 7</td>
            <td>Subscription marked FAILED</td>
            <td>
              Banner shown in <code>/portal/plan</code> with a one-click link
              to the Stripe billing portal.
            </td>
            <td>Full access</td>
          </tr>
          <tr>
            <td>Day 14</td>
            <td>Account locked</td>
            <td>
              Account becomes read-only: existing content is visible, but
              generation, publishing, and outreach are paused.
            </td>
            <td>Read-only</td>
          </tr>
          <tr>
            <td>Day 21</td>
            <td>Access revoked</td>
            <td>
              Subscription is closed. Account data is retained for{" "}
              <strong>30 more days</strong> before deletion to allow recovery
              if you settle the balance.
            </td>
            <td>Locked out</td>
          </tr>
        </tbody>
      </table>

      <p>
        You can update the payment method at any stage from the Stripe
        billing portal linked inside <code>/portal/plan</code>. Once the
        outstanding balance is paid, full access is restored within minutes.
      </p>

      <h2>7. Chargebacks</h2>
      <p>
        Chargebacks are expensive for us and your card issuer alike, and our
        money-back guarantees usually offer a faster, cleaner path to the
        same outcome. If you believe a charge is wrong, please email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>{" "}
        <strong>before</strong> initiating a chargeback. We aim to resolve
        billing disputes within 5 business days.
      </p>
      <ul>
        <li>
          Initiating a chargeback while a refund-eligible window (section 3,
          4, or 5) is still open results in immediate <strong>account
          suspension</strong> until the dispute is resolved.
        </li>
        <li>
          We will dispute chargebacks where we have evidence of legitimate
          use (login records, generation history, publish events, IP
          addresses).
        </li>
        <li>
          A successful chargeback against an account that was using the
          Service in good faith does not by itself end the contract — the
          Stripe fees and the original charge become a debt that must be
          settled before the account is reactivated.
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
          these tiers. We do, however, honor the money-back guarantees in
          sections 3 and 4 for any user who feels we did not deliver during
          the relevant window.
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
        <strong>14-day right of withdrawal</strong> under the Consumer Rights
        Directive (and equivalent UK legislation) for distance contracts.
        Once you actively start using the Service after agreeing to immediate
        performance, the right of withdrawal for digital content may be
        limited under Article 16(m) of the Directive — but our 7-day
        money-back guarantee in section 3 applies regardless of whether the
        statutory right has lapsed, and it gives most users a faster route to
        the same outcome.
      </p>

      <h3>9.2 California</h3>
      <p>
        California buyers using the Service for personal, family, or
        household purposes are entitled to a 30-day refund per California
        Civil Code &sect; 1750 et seq. Email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with proof of
        purchase within 30 days to claim.
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
