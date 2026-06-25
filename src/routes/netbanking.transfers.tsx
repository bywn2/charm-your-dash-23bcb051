import { createFileRoute } from "@tanstack/react-router";
import { BankLayout, Card, PageTitle } from "@/components/BankLayout";
import { formatINR, BALANCE_PAISE } from "@/lib/bank-store";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/netbanking/transfers")({
  head: () => ({ meta: [{ title: "Money Transfer — Bank of Maharashtra" }] }),
  component: Transfers,
});

const tabs = ["Within BoM", "NEFT / RTGS", "IMPS", "UPI"] as const;
type Tab = typeof tabs[number];

function Transfers() {
  const [tab, setTab] = useState<Tab>("NEFT / RTGS");
  const [done, setDone] = useState<{ amt: string; to: string } | null>(null);
  const [form, setForm] = useState({ name: "", acc: "", ifsc: "MAHB0", amt: "", remark: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone({ amt: form.amt, to: form.name });
    setForm({ name: "", acc: "", ifsc: "MAHB0", amt: "", remark: "" });
  }

  const beneficiaries = [
    { n: "Rahul Sharma", a: "HDFC ****4521", l: "Frequent" },
    { n: "Priya Patil", a: "ICICI ****8821", l: "Family" },
    { n: "Anil Desai", a: "BoM ****2134", l: "Friend" },
    { n: "Maharashtra Electricity Board", a: "AXIS ****0001", l: "Biller" },
  ];

  return (
    <BankLayout>
      <PageTitle title="Money Transfer" subtitle={`Available balance: ${formatINR(BALANCE_PAISE)}`} />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition ${tab === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-secondary"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">{tab} Transfer</h2>
          {done ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-900">Transfer successful</p>
                <p className="text-sm text-emerald-800">{formatINR(Math.round(Number(done.amt) * 100))} sent to {done.to}. Ref: TXN{Date.now().toString().slice(-10)}</p>
                <button onClick={() => setDone(null)} className="mt-3 text-sm font-medium text-primary hover:underline">Make another transfer</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
              <Field label="Beneficiary Name" v={form.name} on={(v) => setForm({ ...form, name: v })} required />
              <Field label="Account Number" v={form.acc} on={(v) => setForm({ ...form, acc: v })} required />
              <Field label="IFSC Code" v={form.ifsc} on={(v) => setForm({ ...form, ifsc: v })} required />
              <Field label="Amount (₹)" v={form.amt} on={(v) => setForm({ ...form, amt: v })} type="number" required />
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Remark</label>
                <input value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <button className="inline-flex items-center gap-2 bom-gradient text-primary-foreground px-6 py-2.5 rounded-md font-semibold shadow-elegant">
                  <Send className="h-4 w-4" /> Send {form.amt && `₹${form.amt}`}
                </button>
              </div>
            </form>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Saved Beneficiaries</h2>
          <ul className="space-y-3">
            {beneficiaries.map((b) => (
              <li key={b.n} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer" onClick={() => setForm({ ...form, name: b.n })}>
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold shrink-0">{b.n[0]}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{b.n}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.a}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-saffron/20 text-primary-dark">{b.l}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </BankLayout>
  );
}

function Field({ label, v, on, type = "text", required }: { label: string; v: string; on: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input value={v} onChange={(e) => on(e.target.value)} type={type} required={required}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    </div>
  );
}
