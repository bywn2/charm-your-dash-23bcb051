import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section } from "./index";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Us — Bank of Maharashtra" },
    { name: "description", content: "Founded in 1935 in Pune, Bank of Maharashtra is one of India's leading public sector banks." },
  ]}),
  component: About,
});

const milestones = [
  { y: "1935", t: "Founded in Pune by a group of visionaries led by V. G. Kale and D. K. Sathe." },
  { y: "1969", t: "Nationalised by the Government of India along with 13 other major banks." },
  { y: "2000", t: "Crossed 1,000 branches and launched core banking solutions." },
  { y: "2023", t: "Recognised as Best Public Sector Bank by multiple national bodies." },
  { y: "2025", t: "Crossed 2.5 crore customers and 2,200+ branches across India." },
];

function About() {
  return (
    <SiteLayout>
      <PageHero eyebrow="About Us" title="90 years of serving Bharat." subtitle="From a small bank in Pune to a pan-India public sector lender — our story is India's story." />
      <Section title="Our Heritage" subtitle="Milestones across nine decades.">
        <ol className="relative border-l-2 border-primary/20 ml-3 space-y-8">
          {milestones.map((m) => (
            <li key={m.y} className="ml-8">
              <span className="absolute -left-[11px] h-5 w-5 rounded-full bom-gradient shadow-elegant" />
              <p className="font-display text-2xl font-bold text-primary">{m.y}</p>
              <p className="mt-1 text-muted-foreground">{m.t}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Vision & Mission">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <h3 className="text-xl font-semibold mb-3 text-primary">Vision</h3>
            <p className="text-muted-foreground">To be a vibrant, forward-looking, techno-savvy, customer-centric bank serving diverse sections of society.</p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <h3 className="text-xl font-semibold mb-3 text-primary">Mission</h3>
            <p className="text-muted-foreground">To ensure quick & efficient response to customer expectations and innovate products & services to cater to diverse sections.</p>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
