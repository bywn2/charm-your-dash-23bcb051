import { createFileRoute } from "@tanstack/react-router";
import { BankLayout, Card, PageTitle } from "@/components/BankLayout";
import { Home, Car, GraduationCap, User, Building2 } from "lucide-react";
import { formatINR } from "@/lib/bank-store";

export const Route = createFileRoute("/netbanking/loans")({
  head: () => ({ meta: [{ title: "Loans — Bank of Maharashtra" }] }),
  component: Loans,
});

const myLoans = [
  { t: "Home Loan", i: Home, outstanding: 4250000_00, emi: 28500_00, next: "05 Jul 2026", tenure: "180 / 240" },
  { t: "Car Loan", i: Car, outstanding: 380000_00, emi: 14200_00, next: "07 Jul 2026", tenure: "26 / 60" },
];

const offers = [
  { i: User, t: "Personal Loan", r: "10.00%", a: "Up to ₹20 Lakh" },
  { i: GraduationCap, t: "Education Loan", r: "8.05%", a: "Up to ₹1.5 Cr" },
  { i: Building2, t: "MSME Loan", r: "9.25%", a: "Working Capital & Term" },
];

function Loans() {
  return (
    <BankLayout>
      <PageTitle title="My Loans" subtitle="Track active loans and explore new offers tailored for you." />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {myLoans.map(({ t, i: Icon, outstanding, emi, next, tenure }) => (
          <Card key={t}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></div>
                  <h3 className="font-semibold text-lg">{t}</h3>
                </div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-primary tabular-nums">{formatINR(outstanding)}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <Stat l="Next EMI" v={formatINR(emi)} />
              <Stat l="Due on" v={next} />
              <Stat l="EMIs paid" v={tenure} />
            </dl>
            <button className="mt-4 w-full py-2 rounded-md bom-gradient text-primary-foreground font-semibold text-sm">Pay EMI</button>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Pre-approved offers for you</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map(({ i: Icon, t, r, a }) => (
          <Card key={t}>
            <div className="h-12 w-12 rounded-lg bom-gradient text-primary-foreground grid place-items-center mb-3"><Icon className="h-5 w-5" /></div>
            <h3 className="font-semibold">{t}</h3>
            <p className="text-sm text-muted-foreground">{a}</p>
            <p className="mt-2 text-2xl font-bold text-primary">{r} <span className="text-xs text-muted-foreground font-normal">p.a.</span></p>
            <button className="mt-4 w-full py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition font-semibold text-sm">Apply Now</button>
          </Card>
        ))}
      </div>
    </BankLayout>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{l}</dt>
      <dd className="font-semibold tabular-nums">{v}</dd>
    </div>
  );
}
