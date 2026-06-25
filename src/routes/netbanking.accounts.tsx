import { createFileRoute } from "@tanstack/react-router";
import { BankLayout, Card, PageTitle } from "@/components/BankLayout";
import { BALANCE_PAISE, formatINR, getUser } from "@/lib/bank-store";

export const Route = createFileRoute("/netbanking/accounts")({
  head: () => ({ meta: [{ title: "Accounts — Bank of Maharashtra" }] }),
  component: Accounts,
});

function Accounts() {
  const user = typeof window !== "undefined" ? getUser() : null;
  const accounts = [
    { type: "Savings Account", no: user?.accountNo, bal: BALANCE_PAISE, status: "Active", ifsc: user?.ifsc },
    { type: "Recurring Deposit", no: "60" + "823461298765", bal: 12500000, status: "Active", ifsc: user?.ifsc },
    { type: "Fixed Deposit", no: "FD" + "456789012345", bal: 50000000, status: "Active", ifsc: user?.ifsc },
  ];
  return (
    <BankLayout>
      <PageTitle title="My Accounts" subtitle="Summary of all your accounts with Bank of Maharashtra." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((a) => (
          <Card key={a.no}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{a.type}</p>
            <p className="font-mono text-sm mt-1">{a.no}</p>
            <p className="mt-4 text-2xl font-bold text-primary tabular-nums">{formatINR(a.bal)}</p>
            <p className="text-xs text-muted-foreground mt-1">IFSC {a.ifsc} · Branch: Shivajinagar, Pune</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">● {a.status}</span>
          </Card>
        ))}
      </div>
    </BankLayout>
  );
}
