import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import tick3tLogo from "@assets/tick3t-light_1786308665024.png";

const navGroups = [
  {
    title: "Discover",
    links: [
      { label: "Browse Events", to: "/events" },
      { label: "Marketplace", to: "/marketplace" },
      { label: "My Tickets", to: "/my-tickets" },
    ],
  },
  {
    title: "Organize",
    links: [
      { label: "Create Event", to: "/create-event" },
      { label: "Become an Organizer", to: "/upgrade-to-organizer" },
      { label: "Organizer Dashboard", to: "/organizer-dashboard" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Developer Portal", to: "/developers" },
      { label: "API & SDKs", to: "/developers" },
      { label: "Token Gating", to: "/developers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "#" },
      { label: "Contact Us", to: "#" },
      { label: "Privacy", to: "#" },
      { label: "Terms", to: "#" },
    ],
  },
];

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const logoClass = mounted && resolvedTheme !== "dark" ? "invert" : "";
  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-background">
      {/* subtle gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center">
              <img
                src={tick3tLogo}
                alt="Tick3t"
                className={`h-9 w-auto transition-opacity duration-300 ${logoClass}`}
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Effortless event tickets and digital identities — pay your way,
              and carry everything in your pocket.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Verified organizers
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Instant delivery
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Global marketplace
              </span>
            </div>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-4">
            {navGroups.map((g) => (
              <div key={g.title}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  {g.title}
                </h3>
                <ul className="space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tick3t. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
