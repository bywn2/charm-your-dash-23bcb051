import { createFileRoute, Link } from "@tanstack/react-router";
import { BankLayout, Card } from "@/components/BankLayout";
import { BALANCE_PAISE, formatINR, getTransactions, getUser } from "@/lib/bank-store";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Send, Receipt, Smartphone, Landmark, FileText, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/netbanking/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Bank of Maharashtra" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [showBal, setShowBal] = useState(true);
  const user = typeof window !== "undefined" ? getUser() : null;
  const txns = useMemo(() => (typeof window !== "undefined" ? getTransactions().slice(0, 6) : []), []);
  const monthTxns = useMemo(() => {
    if (typeof window === "undefined") return [];
    const now = new Date();
    return getTransactions().filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, []);
  const credits = monthTxns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const debits = monthTxns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <BankLayout>
      {/* Balance hero */}
      <Card className="bom-gradient text-primary-foreground border-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-primary-foreground/80">Available Balance · Savings A/C</p>
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <p className="text-3xl md:text-5xl font-bold font-display">
                {showBal ? formatINR(BALANCE_PAISE) : "₹ • • • • • • •"}
              </p>
              <button onClick={() => setShowBal(!showBal)} className="p-2 rounded-full bg-white/15 hover:bg-white/25" aria-label="Toggle balance">
                {showBal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-3 text-sm text-primary-foreground/80">A/C: {user?.accountNo ?? "—"} · IFSC: {user?.ifsc ?? "—"}</p>
            <p className="text-sm text-primary-foreground/80">{user?.branch ?? "—"}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <Mini label="This month in" value={formatINR(Math.round(credits * 100))} icon={ArrowDownLeft} />
            <Mini label="This month out" value={formatINR(Math.round(debits * 100))} icon={ArrowUpRight} />
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
        {[
          { to: "/netbanking/transfers", l: "Send Money", i: Send },
          { to: "/netbanking/bills", l: "Pay Bills", i: Receipt },
          { to: "/netbanking/transfers", l: "Mobile Recharge", i: Smartphone },
          { to: "/netbanking/loans", l: "Loans", i: Landmark },
          { to: "/netbanking/statements", l: "Statements", i: FileText },
          { to: "/netbanking/transactions", l: "All Transactions", i: TrendingUp },
        ].map(({ to, l, i: Icon }) => (
          <Link key={l} to={to} className="bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2 hover:-translate-y-0.5 hover:shadow-card transition">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></div>
            <span className="text-xs sm:text-sm font-medium text-center">{l}</span>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/netbanking/transactions" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-border">
            {txns.map((t) => (
              <li key={t.id} className="py-3 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 items-center">
                <div className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${t.amount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {t.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · {t.channel}</p>
                </div>
                <p className={`text-sm font-semibold tabular-nums ${t.amount > 0 ? "text-emerald-700" : "text-foreground"}`}>
                  {t.amount > 0 ? "+" : "-"}{formatINR(Math.round(Math.abs(t.amount) * 100))}
                </p>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
          <dl className="space-y-3 text-sm">
            <Row k="Customer ID" v={user?.customerId} />
            <Row k="Name" v={user?.name} />
            <Row k="Email" v={user?.email} />
            <Row k="Mobile" v={user?.mobile} />
            <Row k="Last login" v={user ? new Date(user.loginAt).toLocaleString("en-IN") : ""} />
          </dl>
        </Card>
      </div>
    </BankLayout>
  );
}

function Mini({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="bg-white/15 rounded-xl p-3">
      <div className="flex items-center gap-2 text-primary-foreground/85 text-xs"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <p className="font-semibold mt-1 text-sm tabular-nums">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium truncate">{v}</dd>
    </div>
  );
}
