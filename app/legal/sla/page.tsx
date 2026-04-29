import type { Metadata } from "next";
import {
  COMPANY_NAME,
  LEGAL_EFFECTIVE_DATE_HUMAN,
  LEGAL_EMAIL,
  PORTAL_DOMAIN,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Service Level Agreement (SLA) — Axolotl Army Portal",
  description:
    "Uptime commitments, service credits, support response targets, maintenance windows, data durability, disaster-recovery objectives, and security-incident notification timelines for the Axolotl Army Portal.",
};

/**
 * Service Level Agreement (SLA) — production document.
 *
 * Source of truth for the company name, contact email, portal domain, and
 * effective date is `lib/legalContent.ts`. Update that file rather than
 * patching strings inline.
 *
 * Scope: Enterprise subscribers. Starter / Pro / Premium plans receive
 * best-effort service. Custom Enterprise contracts may modify (but not
 * reduce below) the commitments stated here unless explicitly negotiated.
 */
export default function SlaPage() {
  return (
    <>
      <h1>Service Level Agreement (SLA)</h1>
      <p>
        <em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em>
      </p>

      <p>
        This Service Level Agreement (&ldquo;SLA&rdquo;) describes the
        uptime, support, durability, and incident-response commitments that{" "}
        {COMPANY_NAME} makes for the Portal at{" "}
        <a href={PORTAL_DOMAIN}>{PORTAL_DOMAIN.replace(/^https?:\/\//, "")}</a>{" "}
        (&ldquo;the Service&rdquo;). It is written in plain English first;
        the more formal language in each section is the binding text. If
        your Enterprise order form or master services agreement contains
        different terms, the order form governs.
      </p>

      <h2>1. Scope</h2>
      <p>
        This SLA applies to <strong>Enterprise subscribers</strong> of{" "}
        {COMPANY_NAME} during periods in which their account is in good
        standing (paid, not in dunning, and not suspended for breach of the
        Acceptable Use Policy or Terms of Service).
      </p>
      <p>
        Customers on the <strong>Starter</strong>, <strong>Pro</strong>, and{" "}
        <strong>Premium</strong> plans receive best-effort service: we
        operate the Service to the same engineering standards as for
        Enterprise, including the same monitoring, alerting, and on-call
        rotation, and we target the same uptime number. However, those
        plans carry <strong>no formal uptime guarantee</strong> and{" "}
        <strong>no service credits</strong>. Refunds for those plans are
        governed exclusively by our{" "}
        <a href="/legal/refunds">Refund and Cancellation Policy</a>.
      </p>

      <h2>2. Definitions</h2>
      <dl>
        <dt>
          <strong>&ldquo;Service&rdquo;</strong>
        </dt>
        <dd>
          The {COMPANY_NAME} Portal application served at{" "}
          <a href={PORTAL_DOMAIN}>
            {PORTAL_DOMAIN.replace(/^https?:\/\//, "")}
          </a>
          , including its API, dashboard, and background workers. The
          Service expressly excludes:
          <ul>
            <li>
              <strong>Third-party services</strong> we depend on, including
              Stripe, the Google APIs (Workspace / Maps / Calendar / Gmail),
              Microsoft Graph, Anthropic, ElevenLabs, OpenAI, Kie.ai,
              Runway, Deepgram, Cloudflare, Resend, Blotato, Upstash, Sentry,
              and any other sub-processor listed at{" "}
              <a href="/legal/subprocessors">/legal/subprocessors</a>;
            </li>
            <li>
              The customer&apos;s own network, devices, browser
              configuration, or in-house integrations;
            </li>
            <li>
              <strong>Scheduled maintenance</strong> windows announced under
              section 5;
            </li>
            <li>
              <strong>Emergency maintenance</strong> performed for security
              reasons (zero-day patching, credential rotation following a
              vendor incident).
            </li>
          </ul>
        </dd>

        <dt>
          <strong>&ldquo;Uptime&rdquo;</strong>
        </dt>
        <dd>
          The percentage of minutes in a calendar month during which the
          Service Core API responds with HTTP 2xx or 3xx status codes for
          its healthy endpoints, measured from our internal uptime monitor.
        </dd>

        <dt>
          <strong>&ldquo;Downtime&rdquo;</strong>
        </dt>
        <dd>
          A sustained period of <strong>five (5) minutes or more</strong>{" "}
          during which Service Core API endpoints return HTTP 5xx errors or
          time out, excluding events that are Excluded under section 2 (4)
          below. Brief blips under five minutes are not Downtime under this
          SLA but are still tracked for our internal reliability metrics.
        </dd>

        <dt>
          <strong>&ldquo;Service Core API&rdquo;</strong>
        </dt>
        <dd>
          The endpoints whose availability defines the Service for the
          purposes of this SLA:
          <ul>
            <li>Authentication endpoints (sign-in, sign-up, session refresh);</li>
            <li>
              <code>/api/videos</code> status polling for in-progress generations;
            </li>
            <li>
              <code>/api/finance</code> billing and subscription endpoints;
            </li>
            <li>
              <code>/api/leads</code> read endpoints for the Lead Finder pipeline;
            </li>
            <li>
              <code>/api/cron</code> heartbeat and job-dispatch endpoint;
            </li>
            <li>
              The dashboard render at <code>/portal/dashboard</code>.
            </li>
          </ul>
          Other endpoints (admin tools, owner-only routes, experimental
          features) are tracked separately and are not part of the Service
          Core API for SLA purposes.
        </dd>

        <dt>
          <strong>&ldquo;Excluded Event&rdquo;</strong>
        </dt>
        <dd>
          Any of the following:
          <ul>
            <li>
              Scheduled maintenance announced at least <strong>48 hours</strong>{" "}
              in advance;
            </li>
            <li>
              Emergency maintenance reasonably necessary to apply security
              patches, rotate compromised credentials, or respond to an
              ongoing attack;
            </li>
            <li>
              Force majeure events, including: cloud-provider regional
              outages, internet routing failures (BGP, transit-provider
              outages), large-scale DDoS attacks, fiber cuts, natural
              disasters, war, terrorism, government action, and labor action;
            </li>
            <li>
              Outages or degradations of any third-party service the Service
              depends on, where that third party is the root cause and the
              Service itself is responding correctly;
            </li>
            <li>
              Customer-caused issues, including but not limited to
              rate-limit overages, abuse triggering AUP enforcement,
              custom-integration failures, or load tests that have not been
              coordinated with us under section 10.
            </li>
          </ul>
        </dd>
      </dl>

      <h2>3. Uptime commitment</h2>
      <p>
        We commit to <strong>99.9% monthly uptime</strong> for the Service
        Core API. On a 30-day month that allows for approximately{" "}
        <strong>43 minutes</strong> of cumulative Downtime per month before
        a service credit becomes due.
      </p>
      <p>
        <strong>How uptime is measured.</strong> Uptime is measured by
        external monitoring (Vercel&apos;s built-in uptime monitor and our
        edge analytics). On request when a service-credit dispute arises we
        will share the relevant monitoring extracts. Internal models in our
        codebase that reference uptime data exist for forward compatibility
        and do not currently drive credit calculations.
      </p>

      <h2>4. Service credits (Enterprise only)</h2>
      <p>
        If we miss the 99.9% target in a calendar month, Enterprise
        subscribers are entitled to a service credit calculated as a
        percentage of the monthly subscription fee paid for that month
        (excluding usage charges, taxes, and add-ons priced separately).
      </p>

      <table>
        <thead>
          <tr>
            <th>Monthly uptime</th>
            <th>Service credit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              99.0% to less than 99.9%
            </td>
            <td>5% of the monthly subscription fee</td>
          </tr>
          <tr>
            <td>
              95.0% to less than 99.0%
            </td>
            <td>15% of the monthly subscription fee</td>
          </tr>
          <tr>
            <td>Less than 95.0%</td>
            <td>30% of the monthly subscription fee</td>
          </tr>
        </tbody>
      </table>

      <p>
        Service credits are subject to the following rules:
      </p>
      <ul>
        <li>
          Credits are applied to the next invoice issued after the credit
          is approved. Credits do not extend the subscription term and are
          not redeemable for cash.
        </li>
        <li>
          The maximum cumulative credit in any single calendar month is
          capped at <strong>30%</strong> of that month&apos;s subscription fee.
        </li>
        <li>
          Service credits are the customer&apos;s{" "}
          <strong>sole and exclusive remedy</strong> for Downtime under this
          SLA, except where applicable law requires otherwise.
        </li>
        <li>
          Customers must request the credit within <strong>30 days</strong>{" "}
          after the end of the affected month by emailing{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with the
          impacted timeframe (start and end timestamps in UTC) and any
          monitoring evidence available. Requests outside the 30-day window
          are not eligible.
        </li>
        <li>
          A customer in active dunning (FAILED, LOCKED, or SUSPENDED status,
          per section 6 of the Refund and Cancellation Policy) does not
          accrue service credits for the affected month.
        </li>
      </ul>

      <h2>5. Maintenance windows</h2>

      <h3>5.1 Scheduled maintenance</h3>
      <p>
        Scheduled maintenance is performed inside a recurring window of{" "}
        <strong>Sunday 06:00&ndash;10:00 UTC</strong>. Where we plan to use
        the window we announce it through an in-app banner and an email to
        the account owner at least <strong>48 hours</strong> in advance.
        Time inside an announced scheduled-maintenance window does not
        count as Downtime, even if some Service Core API endpoints are
        unavailable during it.
      </p>

      <h3>5.2 Emergency maintenance</h3>
      <p>
        Emergency maintenance is unscheduled work needed to apply security
        patches, rotate compromised credentials, or respond to an ongoing
        attack on the Service or one of its dependencies. We announce
        emergency maintenance as quickly as is reasonable in the
        circumstances — typically by in-app banner once the work is
        underway. Emergency maintenance does not count as Downtime.
      </p>

      <h2>6. Support response targets (Enterprise)</h2>
      <p>
        Enterprise customers receive prioritized support with the following
        first-response targets. &ldquo;First response&rdquo; means a human
        acknowledging the ticket, not a fix.
      </p>

      <table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Definition</th>
            <th>First-response target</th>
            <th>Update cadence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>P0</strong>
            </td>
            <td>Service is unavailable.</td>
            <td>Within 1 hour, 24/7</td>
            <td>Hourly status updates until resolved</td>
          </tr>
          <tr>
            <td>
              <strong>P1</strong>
            </td>
            <td>Major feature is broken with no workaround.</td>
            <td>Within 4 business hours</td>
            <td>Daily status updates</td>
          </tr>
          <tr>
            <td>
              <strong>P2</strong>
            </td>
            <td>Minor issue with a viable workaround.</td>
            <td>Within 1 business day</td>
            <td>As progress is made</td>
          </tr>
          <tr>
            <td>
              <strong>P3</strong>
            </td>
            <td>How-to questions and feature requests.</td>
            <td>Within 3 business days</td>
            <td>As progress is made</td>
          </tr>
        </tbody>
      </table>

      <p>Channels for Enterprise support:</p>
      <ul>
        <li>
          Email: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with{" "}
          <code>[URGENT]</code>, <code>[HIGH]</code>, or{" "}
          <code>[NORMAL]</code> in the subject line. <code>[URGENT]</code>{" "}
          maps to P0; <code>[HIGH]</code> maps to P1; everything else is
          triaged.
        </li>
        <li>
          For Enterprise customers we will set up a shared communication
          channel (Slack Connect or similar) on request during onboarding.
          This is provisioned manually rather than via product-side
          automation.
        </li>
      </ul>
      <p>
        &ldquo;Business hours&rdquo; for the purposes of P1, P2, and P3
        targets are 09:00&ndash;18:00 in the customer&apos;s primary
        contact&apos;s timezone, Monday to Friday, excluding public
        holidays in that location. P0 incidents are handled 24/7.
      </p>

      <h2>7. Data durability and backup</h2>
      <p>
        <strong>Backups and recovery.</strong> The Service runs on
        Neon-managed Postgres with continuous point-in-time recovery
        enabled. Recovery window depends on our Neon plan and applies
        uniformly across customer data &mdash; there is no per-tier
        difference in PITR retention. Operator note: when this contract is
        signed for Enterprise customers, our then-current Neon plan and PITR
        window are disclosed in the order form.
      </p>

      <p>
        We test restore procedures <strong>quarterly</strong> by spinning
        up an isolated copy of the database, verifying schema integrity and
        row counts, and confirming a representative sample of records.
        Restore tests are tracked internally and are summarized for
        Enterprise customers on request under NDA.
      </p>

      <h2>8. Disaster recovery</h2>
      <p>
        In the event of a total regional outage at our primary cloud
        provider, our recovery objectives are:
      </p>

      <table>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Target</th>
            <th>What it means</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>RTO</strong> (Recovery Time Objective)
            </td>
            <td>4 hours</td>
            <td>
              Maximum time we expect to take to fully restore the Service
              after a total regional outage.
            </td>
          </tr>
          <tr>
            <td>
              <strong>RPO</strong> (Recovery Point Objective)
            </td>
            <td>15 minutes</td>
            <td>
              Maximum amount of data that may be lost in the worst-case
              recovery scenario, measured against the wall-clock state at
              the moment of the outage.
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        These are objectives, not guarantees. A regional outage that
        triggers a failover counts as an Excluded Event for SLA
        calculations under section 2, but we still aim to meet the RTO and
        RPO targets above.
      </p>

      <h2>9. Security incidents</h2>
      <p>
        We notify affected customers within <strong>72 hours</strong> of
        confirming unauthorized access to their data, consistent with the
        timeline in <strong>Article 33 of the GDPR</strong>. Notification
        is delivered through:
      </p>
      <ul>
        <li>An in-portal banner visible to the account owner; and</li>
        <li>
          An email to the account owner&apos;s registered contact address.
        </li>
      </ul>
      <p>
        The notification will describe the nature of the incident, the
        categories and approximate volume of data involved, the likely
        consequences, and the measures we have taken or propose to take in
        response. Subsequent updates are issued as the investigation
        progresses. Reports of suspected vulnerabilities should be sent to
        the address listed at <a href="/legal/security">/legal/security</a>.
      </p>

      <h2>10. Customer obligations</h2>
      <p>
        For commitments under this SLA to apply, the customer must:
      </p>
      <ul>
        <li>
          Maintain a valid contact email on the account so that
          maintenance windows, security notifications, and incident updates
          can reach you;
        </li>
        <li>
          Pay invoices on time. Accounts in dunning (FAILED, LOCKED, or
          SUSPENDED status under section 6 of the Refund Policy) do not
          accrue service credits for the affected month;
        </li>
        <li>
          Not artificially induce Downtime — load tests, penetration tests,
          and synthetic high-throughput workloads must be coordinated with
          us at least <strong>5 business days</strong> in advance by email
          to <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>;
        </li>
        <li>
          Operate within the Acceptable Use Policy at{" "}
          <a href="/legal/aup">/legal/aup</a>.
        </li>
      </ul>

      <h2>11. Force majeure</h2>
      <p>
        Neither party is liable for failure or delay in performance to the
        extent caused by circumstances beyond its reasonable control,
        including but not limited to: acts of God, natural disasters
        (earthquake, flood, fire, severe weather), pandemic, war,
        terrorism, civil disturbance, government action, embargo, fiber
        cuts, internet routing failures, regional outages of major cloud
        providers, large-scale DDoS attacks, and labor disputes outside
        the affected party&apos;s direct control. The affected party will
        give prompt written notice and use reasonable efforts to resume
        performance.
      </p>

      <h2>12. Changes to this SLA</h2>
      <p>
        We may update this SLA from time to time. For{" "}
        <strong>material changes</strong> that reduce the service levels
        committed here — including lower uptime targets, longer
        maintenance windows, or smaller service credits — we will give at
        least <strong>30 days&apos;</strong> advance notice by email and an
        in-app banner before the change takes effect. Non-material updates
        (typo fixes, clarifications, formatting, new contact addresses)
        take effect when published. The effective date at the top of this
        page is updated on every change.
      </p>

      <h2>13. How to contact us</h2>
      <p>
        For SLA questions, service-credit requests, scheduled-load-test
        coordination, and disputes:
      </p>
      <ul>
        <li>
          Email: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>
      <p>
        Send service-credit requests from the email address registered on
        the account. Include the impacted timeframe in UTC, the customer
        ID or account email, and any external monitoring evidence
        available so we can match it against our internal{" "}
        <code>UptimeIncident</code> records.
      </p>
    </>
  );
}
