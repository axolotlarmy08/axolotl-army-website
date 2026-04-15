import {
  TiktokLogo,
  InstagramLogo,
  YoutubeLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";

const PORTAL_LINK = "/portal-coming-soon";

const footerLinks = {
  Platform: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Characters", href: "#characters" },
    { label: "Merch", href: "#merch" },
  ],
  Portal: [
    { label: "Log In", href: PORTAL_LINK },
    { label: "Pricing", href: PORTAL_LINK },
    { label: "Dashboard", href: PORTAL_LINK },
  ],
  Legal: [
    { label: "Terms of Service", href: PORTAL_LINK },
    { label: "Privacy Policy", href: PORTAL_LINK },
    { label: "Security", href: PORTAL_LINK },
  ],
};

const socials = [
  { icon: TiktokLogo, href: "#", label: "TikTok" },
  { icon: InstagramLogo, href: "#", label: "Instagram" },
  { icon: YoutubeLogo, href: "#", label: "YouTube" },
  { icon: XLogo, href: "#", label: "X" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm tracking-tight">
                AA
              </div>
              <span className="text-foreground font-semibold tracking-tight text-lg">
                Axolotl Army
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-[35ch] mb-6">
              AI-powered video generation and multi-platform publishing for
              creators and brands.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-surface border border-border/50 flex items-center justify-center text-muted hover:text-foreground hover:border-accent/20 transition-colors"
                  >
                    <Icon size={16} weight="regular" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-foreground text-sm font-medium mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted text-sm hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted/50 text-xs">
            &copy; {new Date().getFullYear()} Axolotl Army. All rights reserved.
          </p>
          <p className="text-muted/30 text-xs">
            Powered by Axolotl Army Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
