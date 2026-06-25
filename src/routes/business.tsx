import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section } from "./index";
import { Briefcase, Building2, Truck, Wheat, Globe2, FileCheck } from "lucide-react";

export const Route = createFileRoute("/business")({
  head: () => ({ meta: [
    { title: "Business Banking — Bank of Maharashtra" },
    { name: "description", content: "Current accounts, MSME loans, trade finance and corporate banking solutions for businesses of every size." },
  ]}),
  component: Business,
});

const items = [
  { i: Briefcase, t: "Current Accounts", d: "Maha-Premium, Maha-Diamond and trader-friendly variants." },
  { i: Building2, t: "MSME & SME Loans", d: "Working capital, term loans, CGTMSE-backed credit up to ₹5 Cr." },
  { i: Wheat, t: "Agriculture Banking", d: "Kisan Credit Card, farm equipment loans, allied activity finance." },
  { i: Truck, t: "Transport Finance", d: "Commercial vehicle and fleet financing with quick approvals." },
  { i: Globe2, t: "Trade & Forex", d: "LCs, bank guarantees, export-import finance, AD-1 services." },
  { i: FileCheck, t: "Government Business", d: "Tax collection, CBS-PFMS integration, PMJDY accounts." },
];

function Business() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Business Banking" title="Built for India's entrepreneurs." subtitle="From kirana stores to listed corporates — our products scale with your ambition." />
      <Section title="Business banking solutions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ i: Icon, t, d }) => (
            <div key={t} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:-translate-y-1 hover:shadow-elegant transition">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4"><Icon className="h-6 w-6" /></div>
              <h3 className="text-xl font-semibold mb-2">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
