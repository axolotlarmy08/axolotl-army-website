import type { Metadata } from "next";
import {
  COMPANY_NAME,
  SUPPORT_EMAIL,
  LEGAL_EFFECTIVE_DATE_HUMAN,
} from "@/lib/legalContent";

export const metadata: Metadata = {
  title: `Accessibility — ${COMPANY_NAME} Portal`,
  description: `Our commitment to accessibility on the ${COMPANY_NAME} Portal: WCAG 2.2 Level AA target, what we do today, known gaps, and how to report a barrier.`,
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <>
      <h1>Accessibility Statement</h1>
      <p><em>Effective: {LEGAL_EFFECTIVE_DATE_HUMAN}</em></p>

      <p>
        We aim to make the {COMPANY_NAME} Portal usable by everyone and target
        conformance with the Web Content Accessibility Guidelines (WCAG) 2.2
        Level AA across the application. This statement applies to{" "}
        <code>portal.axolotlarmy.net</code> and the marketing site at{" "}
        <code>www.axolotlarmy.net</code>.
      </p>

      <h2>What we do today</h2>
      <ul>
        <li>Keyboard-navigable flows for sign-in, dashboard, video generation, calendar, and editor surfaces.</li>
        <li>Visible focus indicators on every interactive element.</li>
        <li>Form fields associated with persistent labels (not placeholder text); error messages exposed to assistive technology.</li>
        <li>Color contrast ratio of at least 4.5:1 for body text and 3:1 for large text and UI controls.</li>
        <li>Honoring <code>prefers-reduced-motion</code> for animations and transitions.</li>
        <li>ARIA landmarks on layout regions (<code>main</code>, <code>nav</code>, <code>complementary</code>) and live regions (<code>role=&quot;status&quot;</code>) for async toasts, errors, and progress.</li>
        <li>Modals built on a shared <code>&lt;Modal&gt;</code> primitive that handles focus trap, Escape-to-close, and click-outside dismiss.</li>
        <li>Destructive actions go through a Promise-based confirm dialog rather than the native <code>window.confirm()</code> for full keyboard + screen-reader support.</li>
        <li>Maximum-scale viewport headers omitted so users can pinch-zoom (a WCAG 2.2 requirement).</li>
        <li>Full keyboard support in the global Command Palette (⌘K, arrow keys, Enter, Escape).</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>The video editor timeline currently relies on pointer interactions for fine-grained trim/split. Keyboard equivalents are on the roadmap; in the meantime an admin can perform these actions on request.</li>
        <li>Some long-form analytics charts use canvas rendering and do not yet expose data tables for screen readers; we will ship a &quot;view as table&quot; toggle.</li>
        <li>Voice features (AXY voice synthesis, slideshow narration) are optional; the same content is always available as readable text.</li>
        <li>Embedded social platform previews (TikTok, Instagram) inherit those platforms&apos; accessibility behaviour, which we do not control.</li>
      </ul>

      <h2>Standards referenced</h2>
      <ul>
        <li>WCAG 2.2 Level AA (W3C, October 2023)</li>
        <li>Section 508 of the US Rehabilitation Act</li>
        <li>European Accessibility Act 2025 (EN 301 549)</li>
        <li>Americans with Disabilities Act (ADA) Title III as applied to private sector websites</li>
      </ul>

      <h2>Assistive technology compatibility</h2>
      <p>
        We test with VoiceOver (macOS, iOS), TalkBack (Android), NVDA (Windows),
        and JAWS (Windows) on Safari, Chrome, Firefox, and Edge current versions.
        If your assistive technology stack runs into a barrier we missed, please
        let us know.
      </p>

      <h2>How to report an accessibility barrier</h2>
      <p>
        If you encounter an accessibility barrier, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}?subject=Accessibility%20barrier`}>{SUPPORT_EMAIL}</a>{" "}
        with a description of the issue, the page or feature affected, the
        device + assistive technology you were using, and (where helpful) a
        screen recording. We aim to respond within 5 business days.
      </p>

      <h2>Alternative format requests</h2>
      <p>
        If a portal feature is currently inaccessible to you, contact us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        {" "}and we&apos;ll work with you to provide an alternative way to complete
        the task — including, where reasonable, manual assistance from our
        support team.
      </p>

      <h2>Continuous improvement</h2>
      <p>
        <strong>Continuous improvement.</strong> Accessibility is part of
        our PR review checklist. New features ship with keyboard support,
        focus management, and screen-reader-friendly copy. We test critical
        flows manually with assistive technologies before each release. We
        have not yet integrated automated accessibility scanning (e.g.
        axe-core) into CI; that is on our roadmap.
      </p>
    </>
  );
}
