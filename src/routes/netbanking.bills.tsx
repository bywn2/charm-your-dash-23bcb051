import { createFileRoute } from "@tanstack/react-router";
import { BankLayout, Card, PageTitle } from "@/components/BankLayout";
import { Zap, Droplet, Flame, Phone, Wifi, Tv, CreditCard, Receipt, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { formatINR } from "@/lib/bank-store";

export const Route = createFileRoute("/netbanking/bills")({
  head: () => ({ meta: [{ title: "Bill Payments — Bank of Maharashtra" }] }),
  component: Bills,
});

const billers = [
  { i: Zap, t: "Electricity", v: ["MSEB", "Tata Power", "Adani Electricity", "BSES"] },
  { i: Droplet, t: "Water", v: ["PMC Pune", "BMC Mumbai", "Delhi Jal Board"] },
  { i: Flame, t: "Gas", v: ["Mahanagar Gas", "Indraprastha Gas", "HP Gas"] },
  { i: Phone, t: "Mobile Recharge", v: ["Jio", "Airtel", "Vi", "BSNL"] },
  { i: Wifi, t: "Broadband", v: ["Jio Fiber", "Airtel Xstream", "ACT Fibernet"] },
  { i: Tv, t: "DTH", v: ["Tata Play", "Airtel DTH", "Dish TV", "d2h"] },
  { i: CreditCard, t: "Credit Card", v: ["HDFC", "ICICI", "SBI", "BoM Card"] },
  { i: Receipt, t: "Insurance", v: ["LIC", "HDFC Life", "ICICI Pru"] },
];

const dues = [
  { name: "MSEB Electricity", account: "9876543210", amount: 2840, due: "28 Jun 2026" },
  { name: "Jio Fiber", account: "MUM-PUN-998877", amount: 999, due: "01 Jul 2026" },
  { name: "Tata Play DTH", account: "1023456789", amount: 460, due: "05 Jul 2026" },
];

function Bills() {
  const [paid, setPaid] = useState<string | null>(null);
  return (
    <BankLayout>
      <PageTitle title="Bill Payments" subtitle="Pay all your bills from one place. Get reminders before due dates." />

      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Bills</h2>
        <ul className="divide-y divide-border">
          {dues.map((b) => (
            <li key={b.name} className="py-3 grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_auto_auto] gap-3 items-center">
              <div className="min-w-0">
                <p className="font-medium truncate">{b.name}</p>
                <p className="text-xs text-muted-foreground">A/C {b.account} · Due {b.due}</p>
              </div>
              <p className="font-semibold tabular-nums">{formatINR(b.amount * 100)}</p>
              <button onClick={() => setPaid(b.name)} className="col-span-2 sm:col-span-1 mt-2 sm:mt-0 px-3 py-1.5 bom-gradient text-primary-foreground rounded-md text-sm font-semibold">
                Pay now
              </button>
            </li>
          ))}
        </ul>
        {paid && (
          <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
            <p className="text-sm text-emerald-900">{paid} paid successfully. Reference: BIL{Date.now().toString().slice(-10)}</p>
          </div>
        )}
      </Card>

      <h2 className="text-lg font-semibold mb-3">All Biller Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {billers.map(({ i: Icon, t, v }) => (
          <Card key={t} className="hover:-translate-y-0.5 hover:shadow-elegant transition cursor-pointer">
            <div className="h-12 w-12 rounded-lg bom-gradient text-primary-foreground grid place-items-center mb-3"><Icon className="h-5 w-5" /></div>
            <p className="font-semibold">{t}</p>
            <p className="text-xs text-muted-foreground mt-1">{v.slice(0, 3).join(", ")}…</p>
          </Card>
        ))}
      </div>
    </BankLayout>
  );
}
