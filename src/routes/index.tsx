import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Wallet, FileText, Headphones, Briefcase, MapPin, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import banner1 from "@/assets/bom-banner-1.jpg.asset.json";
import banner2 from "@/assets/bom-banner-2.jpg.asset.json";
import banner3 from "@/assets/bom-banner-3.jpg.asset.json";
import banner4 from "@/assets/bom-banner-4.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Bank of Maharashtra — One Family, One Bank" }] }),
  component: Home,
});

const slides = [
  { img: banner1.url, to: "/personal", alt: "Bank of Maharashtra featured offer" },
  { img: banner2.url, to: "/loans", alt: "Bank of Maharashtra home loan" },
  { img: banner3.url, to: "/login", alt: "Bank of Maharashtra digital banking" },
  { img: banner4.url, to: "/loans", alt: "Bank of Maharashtra agri banking" },
];

const quickRibbon = [
  { l: "Online SB Account", i: Wallet, color: "bg-saffron text-primary-dark" },
  { l: "Online Loans", i: FileText, color: "bg-primary text-primary-foreground" },
  { l: "Helpline", i: Headphones, color: "bg-primary text-primary-foreground" },
  { l: "Investor Relation", i: Briefcase, color: "bg-primary text-primary-foreground" },
  { l: "Branch/ATM Locator", i: MapPin, color: "bg-primary text-primary-foreground" },
];

const lookingFor = [
  { l: "HOME LOANS" }, { l: "CAR LOAN" }, { l: "GOLD LOAN AGAINST ORNAMENTS" },
  { l: "DEPOSIT INTEREST RATES" }, { l: "LOAN INTEREST RATES" }, { l: "DOWNLOAD FORMS" },
  { l: "HELPLINE" }, { l: "BANK OF MAHARASHTRA SBI CREDIT CARD", new: true, link: true },
  { l: "NETC-FASTAG" }, { l: "DIGITAL BANKING" }, { l: "CO-LENDING (DIGITAL LENDING)" },
  { l: "ONLINE LOANS" }, { l: "SAVINGS ACCOUNT" }, { l: "ONLINE LOCKER APPLICATION" },
  { l: "BOM REWARDS" }, { l: "RE-KYC" }, { l: "V-CIP", new: true, link: true },
  { l: "METAVERSE" }, { l: "ONLINE JEEVAN PRAMAN PATRA SUBMISSION" },
  { l: "IMPORTANT ANNOUNCEMENT FOR SHAREHOLDERS" }, { l: "NOMINATION", new: true },
  { l: "TPA", new: true }, { l: "POSITIVE PAY SYSTEM", new: true },
  { l: "KCC JANSAMARTH", new: true }, { l: "E-OTS", new: true },
  { l: "ONLINE DIGITIZATION FORMS", new: true, link: true },
  { l: "BHARAT AADHAAR SEEDING ENABLER (BASE-NPCI)", new: true },
  { l: "MAHA E-GST LOAN", link: true }, { l: "MUDRA LOAN", link: true },
  { l: "LODGE A COMPLAINT" }, { l: "DIGITAL CAR LOAN", new: true },
  { l: "GLOBAL EDGE SAVINGS ACCOUNT", new: true, link: true },
  { l: "ZEN LYFE APP", new: true, link: true }, { l: "ACCESSIBILITY FOR DIVYANGJAN", new: true },
  { l: "MPOS", new: true },
];

const ancillary = [
  "PPF SCHEME", "LC/BG CONFIRMATION", "INSURANCE", "EQUITY TRADING SERVICES",
  "LOCKERS", "SOVEREIGN GOLD BOND SCHEME", "METCO-TRUSTEE CO",
  "SENIOR CITIZEN SAVING SCHEME", "SUKANYA SAMRIDDHI YOJANA", "ATAL PENSION YOJANA",
  "NATIONAL PENSION SYSTEM", "DOORSTEP BANKING SERVICES",
];

function Home() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [playing]);

  const go = (n: number) => setActive(((n % slides.length) + slides.length) % slides.length);

  return (
    <SiteLayout>
      {/* Hero / functional slider */}
      <section className="relative bg-primary-dark overflow-hidden">
        <div className="relative h-[260px] sm:h-[360px] md:h-[460px] lg:h-[540px]">
          {slides.map((s, i) => (
            <Link
              key={s.img}
              to={s.to}
              className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              aria-hidden={i !== active}
            >
              <img src={s.img} alt={s.alt} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
            </Link>
          ))}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 md:right-8 z-10 flex items-center gap-2 text-primary-foreground">
            <button onClick={() => go(active - 1)} className="h-9 w-9 grid place-items-center rounded-full bg-black/40 hover:bg-black/60" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => go(active + 1)} className="h-9 w-9 grid place-items-center rounded-full bg-black/40 hover:bg-black/60" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
            <button onClick={() => setPlaying((p) => !p)} className="h-9 w-9 grid place-items-center rounded-full bg-black/40 hover:bg-black/60" aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {/* Slider dots */}
        <div className="bg-primary-dark/90 py-3 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-saffron" : "w-2.5 bg-white/40 hover:bg-white/60"}`} />
          ))}
        </div>
      </section>

      {/* Quick action ribbon */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {quickRibbon.map(({ l, i: Icon, color }) => (
            <a key={l} href="#" className={`${color} text-center py-5 px-3 flex flex-col items-center gap-1 hover:opacity-90 transition border-r border-white/10 last:border-0`}>
              <Icon className="h-5 w-5" />
              <span className="text-sm font-bold">{l}</span>
            </a>
          ))}
        </div>
      </section>

      {/* What are you looking for? */}
      <section className="bg-secondary/40 py-12">
        <div className="mx-auto max-w-[1400px] px-4 grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">What are you<br />looking for?</h2>
          </div>
          <div className="bg-background rounded-2xl border border-border p-6">
            <h3 className="text-center text-xl font-bold text-foreground mb-5">Bank of Maharashtra</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {lookingFor.map((t) => (
                <a key={t.l} href="#"
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-[11px] md:text-xs font-semibold border transition ${
                    t.link
                      ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                      : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                  }`}>
                  {t.l}
                  {t.new && <span className="ml-1 inline-block bg-destructive text-destructive-foreground text-[9px] font-bold px-1 rounded">NEW</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ancillary products */}
      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">Ancillary<br />Products</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {ancillary.map((t) => (
              <a key={t} href="#" className="inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold border border-border bg-background text-foreground hover:border-primary hover:text-primary transition">
                {t}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Today's rates */}
      <section className="bg-secondary/50 py-14">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-primary font-semibold uppercase tracking-wider text-xs">Today's Rates</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold">Competitive returns. Transparent terms.</h2>
              <p className="mt-3 text-muted-foreground">Rates effective from 1st June 2026. Subject to change as per RBI guidelines.</p>
            </div>
            <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-card">
              <table className="w-full text-sm">
                <thead className="bg-primary text-primary-foreground">
                  <tr><th className="text-left p-4">Product</th><th className="text-right p-4">Rate (p.a.)</th></tr>
                </thead>
                <tbody>
                  {rates.map((r, i) => (
                    <tr key={r.p} className={i % 2 ? "bg-secondary/40" : ""}>
                      <td className="p-4 font-medium">{r.p}</td>
                      <td className="p-4 text-right font-bold text-primary">{r.r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

const rates = [
  { p: "Savings Account", r: "2.75%" },
  { p: "FD (1 year)", r: "6.75%" },
  { p: "FD (5 years)", r: "6.50%" },
  { p: "Senior Citizen FD", r: "7.25%" },
  { p: "Home Loan (from)", r: "8.35%" },
  { p: "Car Loan (from)", r: "8.70%" },
];

export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16">
      <div className="max-w-2xl mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

