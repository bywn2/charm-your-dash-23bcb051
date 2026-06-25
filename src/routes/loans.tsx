import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section } from "./index";
import { Home, Car, GraduationCap, User, Building2, HeartPulse, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/loans")({
  head: () => ({ meta: [
    { title: "Loans — Bank of Maharashtra" },
    { name: "description", content: "Home, car, education, personal, MSME and gold loans at attractive rates from Bank of Maharashtra." },
  ]}),
  component: Loans,
});

const loans = [
  { i: Home, t: "Home Loan", r: "8.35%", d: "Loans up to ₹10 Cr, tenure up to 30 years." },
  { i: Car, t: "Car Loan", r: "8.70%", d: "Up to 90% on-road for new & used cars." },
  { i: GraduationCap, t: "Education Loan", r: "8.05%", d: "Studies in India & abroad up to ₹1.5 Cr." },
  { i: User, t: "Personal Loan", r: "10.00%", d: "Up to ₹20 Lakh, minimal paperwork." },
  { i: Building2, t: "MSME Loan", r: "9.25%", d: "Working capital & term loans for businesses." },
  { i: HeartPulse, t: "Gold Loan", r: "8.95%", d: "Quick disbursal against gold ornaments." },
];

function Loans() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Loans" title="Borrow with confidence. Repay with ease." subtitle="Transparent processing, competitive interest rates and quick digital approvals." />
      <Section title="Find the right loan for you">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map(({ i: Icon, t, r, d }) => (
            <div key={t} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:-translate-y-1 hover:shadow-elegant transition flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-6 w-6" /></div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Rate from</p>
                  <p className="text-2xl font-bold text-primary">{r}</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t}</h3>
              <p className="text-sm text-muted-foreground flex-1">{d}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm">Apply now <ArrowRight className="h-4 w-4" /></a>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
