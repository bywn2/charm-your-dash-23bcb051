import { createFileRoute, Link } from "@tanstack/react-router";
import { BankLayout, Card } from "@/components/BankLayout";
import { BALANCE_PAISE, formatINR, getTransactions, getUser } from "@/lib/bank-store";
import {
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Send, Receipt, Smartphone,
  Landmark, FileText, TrendingUp, Wifi, Sparkles, Target, CalendarClock,
  ShoppingBag, Utensils, Car, Zap, CreditCard,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";

export const Route = createFileRoute("/netbanking/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Bank of Maharashtra" }] }),
  component: Dashboard,
});

const CATEGORY_META: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  Shopping: { color: "oklch(0.62 0.17 235)", icon: ShoppingBag },
  UPI: { color: "oklch(0.75 0.17 60)", icon: Utensils },
  Bill: { color: "oklch(0.55 0.18 145)", icon: Zap },
  Transfer: { color: "oklch(0.58 0.22 300)", icon: Send },
  EMI: { color: "oklch(0.58 0.22 27)", icon: Car },
  ATM: { color: "oklch(0.5 0.04 240)", icon: CreditCard },
  Salary: { color: "oklch(0.55 0.18 145)", icon: ArrowDownLeft },
  Interest: { color: "oklch(0.7 0.15 180)", icon: TrendingUp },
};

function Dashboard() {
  const [showBal, setShowBal] = useState(true);
  const user = typeof window !== "undefined" ? getUser() : null;
  const allTxns = useMemo(() => (typeof window !== "undefined" ? getTransactions() : []), []);
  const txns = allTxns.slice(0, 6);

  const now = new Date();
  const monthTxns = useMemo(
    () => allTxns.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }),
    [allTxns, now]
  );
  const credits = monthTxns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const debits = monthTxns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  // 6-month income vs spend
  const monthly = useMemo(() => {
    const buckets = new Map<string, { m: string; in: number; out: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.set(k, { m: d.toLocaleString("en-IN", { month: "short" }), in: 0, out: 0 });
    }
    allTxns.forEach((t) => {
      const d = new Date(t.date);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      const b = buckets.get(k);
      if (!b) return;
      if (t.amount > 0) b.in += t.amount;
      else b.out += Math.abs(t.amount);
    });
    return [...buckets.values()].map((b) => ({ m: b.m, In: Math.round(b.in), Out: Math.round(b.out) }));
  }, [allTxns, now]);

  // Balance trend (last 30 days, derived backwards from current balance)
  const balanceTrend = useMemo(() => {
    const days: { d: string; bal: number }[] = [];
    let bal = BALANCE_PAISE / 100;
    const byDay = new Map<string, number>();
    allTxns.forEach((t) => {
      const k = t.date.slice(0, 10);
      byDay.set(k, (byDay.get(k) ?? 0) + t.amount);
    });
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      days.unshift({ d: d.getDate().toString(), bal: Math.round(bal) });
      bal -= byDay.get(k) ?? 0;
    }
    return days;
  }, [allTxns, now]);

  // Category breakdown for this month
  const breakdown = useMemo(() => {
    const m = new Map<string, number>();
    monthTxns.filter((t) => t.amount < 0).forEach((t) => {
      m.set(t.category, (m.get(t.category) ?? 0) + Math.abs(t.amount));
    });
    return [...m.entries()]
      .map(([name, value]) => ({ name, value: Math.round(value), color: CATEGORY_META[name]?.color ?? "#888" }))
      .sort((a, b) => b.value - a.value);
  }, [monthTxns]);
  const totalSpend = breakdown.reduce((s, b) => s + b.value, 0) || 1;

  // Upcoming bills (mock based on patterns)
  const upcoming = [
    { name: "Home Loan EMI", amount: 28500, due: "05 Jul", icon: Landmark, accent: "rose" },
    { name: "Tata Power Bill", amount: 2840, due: "12 Jul", icon: Zap, accent: "amber" },
    { name: "Netflix", amount: 649, due: "18 Jul", icon: Sparkles, accent: "indigo" },
  ];

  const savingsGoal = 5000000; // ₹50L
  const savedPct = Math.min(100, Math.round(((BALANCE_PAISE / 100) / savingsGoal) * 100));

  return (
    <BankLayout>
      {/* Hero row: Navy balance card (2/3) + Cards widget (1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Primary account hero */}
        <div className="xl:col-span-2 relative overflow-hidden bg-[#002147] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF9933]/25 to-transparent rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8 md:mb-10 gap-4">
              <div className="min-w-0">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">Savings Account</p>
                <p className="text-base md:text-lg font-semibold font-mono truncate">
                  {showBal
                    ? user?.accountNo?.replace(/(.{4})/g, "$1 ").trim()
                    : "•••• •••• •••• 1084"}
                </p>
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-[11px] font-medium border border-white/10 shrink-0">
                ● Active
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-blue-100/70 text-sm">Available Balance</p>
                <button
                  onClick={() => setShowBal(!showBal)}
                  className="p-1 rounded-full text-blue-100/70 hover:text-white hover:bg-white/10 transition"
                  aria-label="Toggle balance"
                >
                  {showBal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl md:text-5xl font-bold tracking-tight tabular-nums">
                  {showBal ? formatINR(BALANCE_PAISE) : "₹ •••••••"}
                </span>
                <span className="text-emerald-300 text-xs md:text-sm font-medium">↑ 12% this month</span>
              </div>
              <p className="text-blue-100/60 text-xs mt-2">IFSC {user?.ifsc} · {user?.branch}</p>
            </div>
            <div className="mt-8 md:mt-10 flex gap-3 flex-wrap">
              <Link
                to="/netbanking/transfers"
                className="px-5 md:px-6 py-2.5 bg-[#FF9933] hover:bg-[#e8892d] text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-950/20 text-sm"
              >
                Send Money
              </Link>
              <Link
                to="/netbanking/bills"
                className="px-5 md:px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 text-sm"
              >
                Pay Bills
              </Link>
            </div>
          </div>
        </div>

        {/* Cards widget */}
        <div className="bg-background border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Your Card</h3>
            <Link to="/netbanking/profile" className="text-xs font-semibold text-[#002147] hover:underline">
              Manage
            </Link>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="w-full aspect-[1.58/1] bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#FF9933]/20 rounded-full blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div className="text-[10px] text-white/60 tracking-widest uppercase">Platinum Debit</div>
                <Wifi className="h-4 w-4 text-white/40 rotate-90" />
              </div>
              <div className="relative text-white tracking-widest font-mono text-sm">•••• •••• •••• 9921</div>
              <div className="relative flex justify-between items-end">
                <div className="text-[9px] text-white/50 uppercase leading-tight">
                  Valid Thru
                  <br />
                  <span className="text-xs text-white font-semibold">09/27</span>
                </div>
                <span className="font-display italic font-bold text-[#FF9933] text-sm">मah@Bank</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Card Status</span>
                <span className="font-semibold text-emerald-600">● Unlocked</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#002147]" style={{ width: "65%" }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wide">
                <span>Usage Limit</span>
                <span className="tabular-nums">₹65,000 / ₹1,00,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        <StatCard
          label="Money In · This month"
          value={formatINR(Math.round(credits * 100))}
          delta="+12.4%"
          positive
          icon={ArrowDownLeft}
        />
        <StatCard
          label="Money Out · This month"
          value={formatINR(Math.round(debits * 100))}
          delta="-4.1%"
          positive={false}
          icon={ArrowUpRight}
        />
        <div className="col-span-2 lg:col-span-1 bg-background rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#FF9933]/15 text-[#FF9933] grid place-items-center">
                <Target className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold">Savings Goal · ₹50L</p>
            </div>
            <p className="text-sm font-bold text-[#002147] tabular-nums">{savedPct}%</p>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#002147] to-[#FF9933] rounded-full transition-all"
              style={{ width: `${savedPct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {formatINR(Math.round((savingsGoal - BALANCE_PAISE / 100) * 100))} to go.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Quick actions</p>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { to: "/netbanking/transfers", l: "Send Money", i: Send, c: "primary" },
            { to: "/netbanking/bills", l: "Pay Bills", i: Receipt, c: "saffron" },
            { to: "/netbanking/transfers", l: "Recharge", i: Smartphone, c: "primary" },
            { to: "/netbanking/loans", l: "Loans", i: Landmark, c: "saffron" },
            { to: "/netbanking/statements", l: "Statements", i: FileText, c: "primary" },
            { to: "/netbanking/transactions", l: "All Activity", i: TrendingUp, c: "saffron" },
          ].map(({ to, l, i: Icon, c }) => (
            <Link
              key={l}
              to={to}
              className="group bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2 hover:-translate-y-1 hover:shadow-elegant hover:border-primary/30 transition-all"
            >
              <div className={`h-11 w-11 rounded-xl grid place-items-center transition-transform group-hover:scale-110 ${c === "saffron" ? "bg-saffron/15 text-saffron" : "bg-primary/10 text-primary"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-center">{l}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-semibold">Cashflow</h2>
              <p className="text-xs text-muted-foreground">Income vs Spending · Last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Legend dot="oklch(0.55 0.18 145)" label="Income" />
              <Legend dot="oklch(0.58 0.22 27)" label="Spending" />
            </div>
          </div>
          <div className="h-64 -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} barCategoryGap={18}>
                <CartesianGrid vertical={false} stroke="oklch(0.91 0.015 235)" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} style={{ fontSize: 11 }} width={55} />
                <Tooltip
                  cursor={{ fill: "oklch(0.95 0.02 235 / 0.4)" }}
                  formatter={(v: number) => formatINR(v * 100)}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                />
                <Bar dataKey="In" fill="oklch(0.55 0.18 145)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Out" fill="oklch(0.58 0.22 27)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Where it went</h2>
          <p className="text-xs text-muted-foreground mb-4">This month · {formatINR(totalSpend * 100)}</p>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">
                  {breakdown.map((b, i) => <Cell key={i} fill={b.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatINR(v * 100)} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Top</p>
                <p className="text-sm font-bold">{breakdown[0]?.name ?? "—"}</p>
              </div>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {breakdown.slice(0, 4).map((b) => (
              <li key={b.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
                <span className="flex-1 truncate">{b.name}</span>
                <span className="text-muted-foreground tabular-nums">{Math.round((b.value / totalSpend) * 100)}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Balance trend */}
      <Card className="mt-5">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold">Balance trend</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
          <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> Healthy
          </div>
        </div>
        <div className="h-44 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceTrend}>
              <defs>
                <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.17 235)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.62 0.17 235)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="oklch(0.94 0.01 235)" />
              <XAxis dataKey="d" tickLine={false} axisLine={false} style={{ fontSize: 10 }} interval={4} />
              <YAxis hide domain={["dataMin - 50000", "dataMax + 50000"]} />
              <Tooltip
                formatter={(v: number) => formatINR(v * 100)}
                labelFormatter={(l) => `Day ${l}`}
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="bal" stroke="oklch(0.62 0.17 235)" strokeWidth={2.5} fill="url(#balFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity + Upcoming */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/netbanking/transactions" className="text-sm font-medium text-primary hover:underline">View all →</Link>
          </div>
          <ul className="divide-y divide-border">
            {txns.map((t) => {
              const meta = CATEGORY_META[t.category];
              const Icon = meta?.icon ?? ShoppingBag;
              const credit = t.amount > 0;
              return (
                <li key={t.id} className="py-3 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 items-center group">
                  <div
                    className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
                    style={{ background: `color-mix(in oklab, ${meta?.color ?? "#888"} 12%, transparent)`, color: meta?.color }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.desc}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} · {t.channel} · {t.category}
                    </p>
                  </div>
                  <p className={`text-sm font-bold tabular-nums ${credit ? "text-emerald-600" : "text-foreground"}`}>
                    {credit ? "+" : "−"}{formatINR(Math.round(Math.abs(t.amount) * 100))}
                  </p>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Upcoming</h2>
              </div>
              <Link to="/netbanking/bills" className="text-xs text-primary hover:underline">Manage</Link>
            </div>
            <ul className="space-y-3">
              {upcoming.map((u) => (
                <li key={u.name} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center text-primary-dark">
                    <u.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground">Due {u.due}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{formatINR(u.amount * 100)}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-saffron/10 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-saffron" />
              <h3 className="font-semibold">Smart Insight</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You've spent <span className="font-semibold text-foreground">{formatINR(Math.round(debits * 100))}</span> this month — about {Math.round((debits / Math.max(credits, 1)) * 100)}% of your income. Nice discipline!
            </p>
          </Card>
        </div>
      </div>
    </BankLayout>
  );
}

function StatCard({
  label, value, delta, positive, icon: Icon,
}: { label: string; value: string; delta: string; positive: boolean; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="bg-background rounded-2xl border border-border shadow-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <div className={`h-8 w-8 rounded-lg grid place-items-center ${positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-lg md:text-xl font-bold mt-2 tabular-nums">{value}</p>
      <p className={`text-xs font-medium mt-1 ${positive ? "text-emerald-600" : "text-rose-600"}`}>{delta} vs last month</p>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: dot }} />
      {label}
    </span>
  );
}
