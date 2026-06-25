import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Phone, Mail, MapPin, Facebook, Twitter, Youtube, Linkedin, Lock, Search, Accessibility } from "lucide-react";
import logo from "@/assets/bom-logo.png.asset.json";

const mainNav = [
  { to: "/personal", label: "Personal" },
  { to: "/business", label: "Corporate" },
  { to: "/business", label: "MSME" },
  { to: "/loans", label: "Agriculture" },
  { to: "/personal", label: "NRI Services" },
  { to: "/business", label: "Treasury" },
  { to: "/about", label: "IBU GIFT" },
] as const;

const topUtility = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Locate Us" },
  { to: "/about", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top utility bar — DARK NAVY like BoM */}
      <div className="bg-primary-dark text-primary-foreground">
        <div className="mx-auto max-w-[1400px] px-4 py-2 flex items-center justify-between gap-4">
          <nav className="hidden md:flex items-center gap-1">
            {topUtility.map((u) => (
              <Link key={u.label} to={u.to} className="px-3 py-1 text-[13px] hover:text-saffron font-medium">
                {u.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Type here to search…" className="pl-8 pr-3 py-1.5 text-[13px] rounded-md bg-white text-foreground w-56 md:w-72 placeholder:text-muted-foreground" />
            </div>
            <a href="#main" className="hidden lg:inline text-[13px] hover:text-saffron">Skip to Content</a>
            <select className="bg-white text-foreground rounded text-[13px] px-2 py-1 border border-white/20" defaultValue="EN">
              <option value="EN">English</option>
              <option value="HI">हिंदी</option>
              <option value="MR">मराठी</option>
            </select>
            <button className="h-8 w-8 grid place-items-center rounded-full bg-white text-primary-dark" aria-label="Accessibility"><Accessibility className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Main header — WHITE band with dark nav, blue LOG-IN */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="mx-auto max-w-[1400px] px-4 py-2.5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <div className="border border-primary/30 rounded px-2 py-1 bg-white">
              <img src={logo.url} alt="Bank of Maharashtra" className="h-12 md:h-14 w-auto" />
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="px-3 xl:px-4 py-2 text-[13px] xl:text-sm font-semibold text-foreground hover:text-primary transition"
                activeProps={{ className: "px-3 xl:px-4 py-2 text-[13px] xl:text-sm font-semibold text-primary border-b-2 border-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="inline-flex items-center gap-2 rounded bg-primary text-primary-foreground px-4 md:px-5 py-2 text-sm font-bold shadow hover:opacity-90 transition">
              <Lock className="h-4 w-4" /> LOG-IN
            </Link>
            <button className="p-2 rounded hover:bg-secondary text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border bg-background">
            <div className="px-4 py-2 flex flex-col max-w-[1400px] mx-auto">
              {[...topUtility, ...mainNav].map((item, i) => (
                <Link key={`${item.label}-${i}`} to={item.to} onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium border-b border-border last:border-0 text-foreground hover:text-primary">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">{children}</main>

      {/* Service ribbon (blue band) */}
      <section className="bg-[oklch(0.45_0.14_240)] text-primary-foreground">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-white/15">
          {[
            "Service Charges", "Public Information", "Gallery", "Social Activity", "Assets for Sale", "Tenders",
          ].map((l) => (
            <a key={l} href="#" className="text-center py-6 px-3 text-sm font-semibold hover:bg-white/10 transition">{l}</a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-primary-foreground">
        <div className="mx-auto max-w-[1400px] px-4 py-12 grid gap-8 md:grid-cols-4">
          <div>
            <div className="bg-white p-2 rounded inline-block">
              <img src={logo.url} alt="Bank of Maharashtra" className="h-14 w-auto" />
            </div>
            <p className="mt-4 text-sm text-primary-foreground/80">
              One Family, One Bank. Serving India since 1935 with trust, transparency and innovation.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-saffron transition"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-saffron transition"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-saffron transition"><Youtube className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-saffron transition"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>
          <FooterCol title="Disclosure" links={["Basel II Disclosure", "Basel III Disclosure", "BRSR Disclosures", "ESG Disclosures"]} />
          <FooterCol title="Compliance" links={["RTI", "CEPD", "Citizen Charter", "ABBFF Guidelines", "PIDPI"]} />
          <div>
            <h4 className="font-display font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Bank of Maharashtra Head Office, Lokmangal, 1501, Shivajinagar, Pune-411005</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> 1800-233-4526 (Toll Free)</li>
              <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> info@mahabank.co.in</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1400px] px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/70">
            <p>© {new Date().getFullYear()} Bank of Maharashtra. All rights reserved.</p>
            <p>Regulated by Reserve Bank of India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-display font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-primary-foreground/80">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-saffron transition">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bom-gradient text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:py-20">
        {eyebrow && <p className="text-saffron font-semibold uppercase tracking-wider text-xs mb-3">{eyebrow}</p>}
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-primary-foreground/85 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
