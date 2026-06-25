import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section } from "./index";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Us — Bank of Maharashtra" },
    { name: "description", content: "Get in touch with Bank of Maharashtra. Customer care, branch locator and head office details." },
  ]}),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="We're here to help." subtitle="Reach our 24x7 customer care, find your nearest branch, or write to us." />
      <Section title="Get in touch">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { i: Phone, t: "Toll-free", v: "1800-233-4526" },
            { i: Mail, t: "Email", v: "info@mahabank.co.in" },
            { i: Clock, t: "Hours", v: "Mon–Sat, 10 AM – 4 PM" },
          ].map(({ i: Icon, t, v }) => (
            <div key={t} className="bg-card rounded-2xl p-6 shadow-card border border-border flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bom-gradient text-primary-foreground flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{t}</p>
                <p className="font-semibold">{v}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <form className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-4" onSubmit={(e) => e.preventDefault()}>
            <h3 className="text-xl font-semibold mb-2">Send us a message</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" type="text" />
              <Field label="Mobile" type="tel" />
            </div>
            <Field label="Email" type="email" />
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button className="inline-flex items-center justify-center rounded-md bom-gradient text-primary-foreground px-6 py-2.5 font-semibold shadow-elegant hover:opacity-90">Submit</button>
          </form>

          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <h3 className="text-xl font-semibold mb-4">Head Office</h3>
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p>Lokmangal, 1501, Shivajinagar,<br />Pune – 411005, Maharashtra, India</p>
            </div>
            <div className="mt-6 aspect-video rounded-xl overflow-hidden border border-border">
              <iframe
                title="map"
                src="https://www.google.com/maps?q=Bank+of+Maharashtra+Head+Office+Pune&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
