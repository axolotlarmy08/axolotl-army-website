import type { Metadata } from "next";
import {
  COMPANY_NAME,
  LEGAL_EFFECTIVE_DATE_HUMAN,
  PORTAL_DOMAIN,
  PRIVACY_EMAIL,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Cookie Policy — Axolotl Army Portal",
  description:
    "Which cookies and similar storage technologies the Axolotl Army Portal sets, what they are for, how long they last, and how you can control them.",
};

/**
 * Cookie Policy — production document.
 *
 * The Portal does NOT run third-party analytics or advertising cookies. The
 * cookie set comes almost entirely from NextAuth (session, CSRF, callback)
 * plus theme preference in localStorage. Third-party cookies appear only when
 * you are redirected to Stripe Checkout or Google's OAuth consent screen.
 *
 * If a future change adds analytics or advertising cookies, update both this
 * page AND the consent banner before deploying.
 */
export default function CookiesPage() {
  return (
    <>
      <h1>Cookie Policy</h1>
      <p>
        <em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em>
      </p>

      <p>
        This Cookie Policy explains how {COMPANY_NAME} uses cookies and similar
        local-storage technologies on the Axolotl Army Portal at{" "}
        <a href={PORTAL_DOMAIN}>{PORTAL_DOMAIN}</a>. Read it together with our
        Privacy Policy, which covers everything else we do with personal data.
      </p>

      <h2>1. What cookies are</h2>
      <p>
        Cookies are small text files a website asks your browser to store so
        that the next time you visit, the site can recognize you, remember
        your preferences, or keep you signed in. Cookies set by the site you
        are visiting are called &ldquo;first-party&rdquo; cookies; cookies set
        by other domains loaded on the page are called &ldquo;third-party&rdquo;
        cookies. We also use related browser-storage features (localStorage,
        sessionStorage) which behave like cookies but are not transmitted on
        every request.
      </p>

      <h2>2. Categories of cookies we use</h2>

      <h3>Strictly necessary cookies</h3>
      <p>
        These cookies are required for the portal to work. Without them you
        cannot sign in, stay signed in, or submit forms safely. Under EU
        ePrivacy rules and the UK PECR, strictly-necessary cookies do not
        require consent, so we do not show a consent banner for them.
      </p>

      <h3>Performance and analytics cookies</h3>
      <p>
        <strong>None.</strong> The portal does not run Google Analytics,
        Mixpanel, Amplitude, Segment, or any other third-party analytics
        product, and it does not set any analytics cookies. We collect product
        usage metrics in our own database (no cookies, no third party); see
        the &ldquo;Operational logs&rdquo; entry in the Privacy Policy for
        details.
      </p>

      <h3>Functionality cookies and local storage</h3>
      <p>
        We store a small amount of preference data in your browser&apos;s{" "}
        <code>localStorage</code> — most notably your theme preference (dark
        or light) and the dismiss-state of one-time UI hints. This is not
        strictly a cookie, but we disclose it here for completeness because
        the practical effect (a value held in your browser, readable by our
        JavaScript) is the same. Clearing site data in your browser removes
        these values.
      </p>

      <h3>Advertising and targeting cookies</h3>
      <p>
        <strong>None.</strong> We do not run advertising on the portal and we
        do not set any cookies for cross-context behavioral advertising,
        retargeting, or audience building. We do not allow third parties to
        set advertising cookies through our pages.
      </p>

      <h2>3. Specific cookies we set</h2>
      <p>
        The cookies below are set by the portal during normal use of the
        Service. Names beginning with <code>__Secure-</code> are the
        production-mode equivalents that browsers will only return over HTTPS.
      </p>
      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-portal-line-soft text-left text-[#bbb]">
              <th className="py-2 pr-3 font-semibold">Name</th>
              <th className="py-2 pr-3 font-semibold">Purpose</th>
              <th className="py-2 pr-3 font-semibold">Lifetime</th>
              <th className="py-2 pr-3 font-semibold">Type</th>
              <th className="py-2 font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
              <td className="py-3 pr-3 font-medium text-white">
                <code>next-auth.session-token</code>
              </td>
              <td className="py-3 pr-3">
                Authenticated session. Identifies your signed-in account so
                we can render your portal.
              </td>
              <td className="py-3 pr-3">30 days (sliding)</td>
              <td className="py-3 pr-3">First-party, HttpOnly, Secure, SameSite=Lax</td>
              <td className="py-3">Strictly necessary</td>
            </tr>
            <tr className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
              <td className="py-3 pr-3 font-medium text-white">
                <code>next-auth.csrf-token</code>
              </td>
              <td className="py-3 pr-3">
                Cross-site request forgery defense for sign-in and account
                forms.
              </td>
              <td className="py-3 pr-3">Session (deleted when browser closes)</td>
              <td className="py-3 pr-3">First-party, HttpOnly, Secure, SameSite=Lax</td>
              <td className="py-3">Strictly necessary</td>
            </tr>
            <tr className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
              <td className="py-3 pr-3 font-medium text-white">
                <code>next-auth.callback-url</code>
              </td>
              <td className="py-3 pr-3">
                Remembers the page you were trying to reach so we can return
                you there after sign-in.
              </td>
              <td className="py-3 pr-3">Session</td>
              <td className="py-3 pr-3">First-party, HttpOnly, Secure, SameSite=Lax</td>
              <td className="py-3">Strictly necessary</td>
            </tr>
            <tr className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
              <td className="py-3 pr-3 font-medium text-white">
                <code>__Secure-next-auth.session-token</code>
              </td>
              <td className="py-3 pr-3">
                Production-mode equivalent of the session cookie above. Sent
                only over HTTPS.
              </td>
              <td className="py-3 pr-3">30 days (sliding)</td>
              <td className="py-3 pr-3">First-party, HttpOnly, Secure, SameSite=Lax</td>
              <td className="py-3">Strictly necessary</td>
            </tr>
            <tr className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
              <td className="py-3 pr-3 font-medium text-white">
                <code>__Secure-next-auth.csrf-token</code>
              </td>
              <td className="py-3 pr-3">Production-mode CSRF cookie.</td>
              <td className="py-3 pr-3">Session</td>
              <td className="py-3 pr-3">First-party, HttpOnly, Secure, SameSite=Lax</td>
              <td className="py-3">Strictly necessary</td>
            </tr>
            <tr className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
              <td className="py-3 pr-3 font-medium text-white">
                <code>__Secure-next-auth.callback-url</code>
              </td>
              <td className="py-3 pr-3">
                Production-mode callback URL helper. Sent only over HTTPS.
              </td>
              <td className="py-3 pr-3">Session</td>
              <td className="py-3 pr-3">First-party, HttpOnly, Secure, SameSite=Lax</td>
              <td className="py-3">Strictly necessary</td>
            </tr>
            <tr className="border-b border-portal-line-soft/40 align-top text-[#ddd]">
              <td className="py-3 pr-3 font-medium text-white">
                <code>portal-theme</code> (localStorage)
              </td>
              <td className="py-3 pr-3">
                Remembers your dark/light theme choice between visits.
              </td>
              <td className="py-3 pr-3">Until you clear site data</td>
              <td className="py-3 pr-3">First-party browser storage</td>
              <td className="py-3">Functionality</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>4. Third-party cookies</h2>
      <p>
        We do not embed third-party trackers in the portal. However, two normal
        flows redirect you off our domain to a partner who sets their own
        cookies under their own privacy policy:
      </p>
      <ul>
        <li>
          <strong>Stripe Checkout.</strong> When you start a paid plan or pay
          an invoice we redirect you to <code>checkout.stripe.com</code>.
          Stripe sets cookies there for fraud prevention and session
          continuity. See{" "}
          <a
            href="https://stripe.com/cookies-policy/legal"
            target="_blank"
            rel="noreferrer noopener"
          >
            stripe.com/cookies-policy/legal
          </a>
          .
        </li>
        <li>
          <strong>Google OAuth.</strong> When you connect a Google account we
          redirect you to <code>accounts.google.com</code>, which sets Google
          cookies for sign-in and account-security. See{" "}
          <a
            href="https://policies.google.com/technologies/cookies"
            target="_blank"
            rel="noreferrer noopener"
          >
            policies.google.com/technologies/cookies
          </a>
          .
        </li>
        <li>
          <strong>Microsoft OAuth.</strong> Connecting an Outlook account
          redirects you to <code>login.microsoftonline.com</code>, which sets
          Microsoft sign-in cookies. See{" "}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            target="_blank"
            rel="noreferrer noopener"
          >
            privacy.microsoft.com/privacystatement
          </a>
          .
        </li>
      </ul>
      <p>
        Cookies set on those external pages are not under our control. Each
        provider lists its own cookies and your choices in the policies linked
        above.
      </p>

      <h2>5. Your choices</h2>
      <ul>
        <li>
          <strong>Browser settings.</strong> Every modern browser lets you
          block or delete cookies for an individual site. Look in Settings
          &rarr; Privacy &rarr; Cookies and site data, or in some browsers
          Tools &rarr; Clear browsing data.
        </li>
        <li>
          <strong>Clear our local storage.</strong> Clearing site data for{" "}
          {PORTAL_DOMAIN} also wipes the theme preference and any UI dismiss
          flags. They will be re-created next time you sign in.
        </li>
        <li>
          <strong>Sign out.</strong> Signing out from the portal removes the
          session cookie immediately.
        </li>
        <li>
          <strong>Strictly-necessary cookies cannot be disabled.</strong> If
          you block them you will not be able to sign in, complete payments,
          or save changes. If you blocked cookies and now cannot sign in,
          email <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a> and we
          will help.
        </li>
      </ul>
      <p>
        Because we do not set advertising or analytics cookies, there is no
        consent banner to dismiss and no opt-out toggle for those categories.
        If we ever add cookies that require consent, we will deploy a banner
        that asks before they are set, and update this page.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We will update this page when the cookies we set change. The
        &ldquo;Effective&rdquo; date at the top reflects the most recent
        revision. For material changes (for example, adding analytics or
        consent-required categories) we will email account holders at least
        30 days before the change takes effect.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about cookies or this policy:{" "}
        <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
      </p>
    </>
  );
}
