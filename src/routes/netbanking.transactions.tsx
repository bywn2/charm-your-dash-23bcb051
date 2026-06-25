import { createFileRoute } from "@tanstack/react-router";
import { BankLayout, Card, PageTitle } from "@/components/BankLayout";
import { formatINR, getTransactions, BALANCE_PAISE, CUSTOMER, type Txn } from "@/lib/bank-store";
import {
  ArrowDownLeft, ArrowUpRight, Search, Download, FileText, Wallet, Upload, X as XIcon, FileSpreadsheet,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { downloadStatementPDF, downloadImportedPDF } from "@/lib/statement-pdf";
import {
  clearImported,
  formatCell,
  getImported,
  isAmountHeader,
  isDateHeader,
  parseAmount,
  parseExcelFile,
  saveImported,
  type ImportedData,
} from "@/lib/imported-data";

export const Route = createFileRoute("/netbanking/transactions")({
  head: () => ({ meta: [{ title: "Transactions — Bank of Maharashtra" }] }),
  component: Transactions,
});

type Range = "1M" | "3M" | "6M" | "YTD" | "1Y" | "CUSTOM";

function Transactions() {
  return <BankLayout><TxnView title="Transactions" subtitle="Filter by date range and category. Last 6 months available instantly." /></BankLayout>;
}

export function TxnView({ title, subtitle }: { title: string; subtitle: string }) {
  const [imported, setImported] = useState<ImportedData | null>(null);
  useEffect(() => { setImported(getImported()); }, []);

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadErr(null);
    try {
      const data = await parseExcelFile(f);
      if (data.headers.length === 0) throw new Error("Empty file");
      saveImported(data);
      setImported(data);
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Could not read file");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImport() {
    clearImported();
    setImported(null);
  }

  const uploadBar = (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2 min-w-0">
        {imported ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs min-w-0">
            <FileSpreadsheet className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium">{imported.fileName}</span>
            <span className="text-emerald-600/80 hidden sm:inline">· {imported.rows.length} rows · {imported.headers.length} columns</span>
            <button onClick={removeImport} className="ml-1 p-1 rounded hover:bg-emerald-100" aria-label="Remove import"><XIcon className="h-3.5 w-3.5" /></button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Showing your account's seeded transactions.</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFile}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-saffron text-primary-dark text-sm font-semibold hover:opacity-90"
        >
          <Upload className="h-4 w-4" /> Upload Excel
        </button>
      </div>
    </div>
  );

  return (
    <>
      <PageTitle title={title} subtitle={subtitle} />
      {uploadBar}
      {uploadErr && (
        <div className="mb-4 px-3 py-2 rounded-md bg-destructive/10 text-destructive text-sm">{uploadErr}</div>
      )}
      {imported ? <ImportedView data={imported} /> : <SeededView />}
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Imported (Excel) view — same Card chrome, dynamic columns.
// ──────────────────────────────────────────────────────────────
function ImportedView({ data }: { data: ImportedData }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return data.rows;
    const needle = q.toLowerCase();
    return data.rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(needle)));
  }, [data.rows, q]);

  // Auto-detect amount totals if Debit/Credit columns are present
  const debitCol = data.headers.find((h) => /^debit$|withdrawal/i.test(h));
  const creditCol = data.headers.find((h) => /^credit$|deposit/i.test(h));
  const balanceCol = data.headers.find((h) => /balance/i.test(h));
  const dateCol = data.headers.find((h) => isDateHeader(h));

  const totals = useMemo(() => {
    let d = 0, c = 0;
    filtered.forEach((r) => {
      if (debitCol) d += parseAmount(r[debitCol]);
      if (creditCol) c += parseAmount(r[creditCol]);
    });
    return { d, c };
  }, [filtered, debitCol, creditCol]);

  function downloadCSV() {
    const rows = [data.headers, ...filtered.map((r) => data.headers.map((h) => String(r[h] ?? "")))];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${data.fileName.replace(/\.[^.]+$/, "")}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadPDF() {
    try {
      await downloadImportedPDF(data.headers, filtered, data.fileName);
    } catch (err) {
      console.error("PDF download failed", err);
      alert(`Could not generate PDF: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return (
    <>
      {/* Summary cards — only the ones that map cleanly */}
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Wallet className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">{balanceCol ? "Latest Balance" : "Available Balance"}</p>
              <p className="font-bold text-primary tabular-nums">
                {balanceCol && filtered.length ? `₹${formatCell(filtered[filtered.length - 1][balanceCol] ?? 0, balanceCol)}` : formatINR(BALANCE_PAISE)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">A/C {CUSTOMER.accountNo} · {CUSTOMER.ifsc}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">{creditCol ? `Total ${creditCol}` : "Credits in view"}</p>
          <p className="font-bold text-emerald-700 tabular-nums">₹{totals.c.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{filtered.length} entries shown</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">{debitCol ? `Total ${debitCol}` : "Debits in view"}</p>
          <p className="font-bold text-rose-700 tabular-nums">₹{totals.d.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{data.headers.length} columns from your file</p>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search across ${data.headers.length} columns…`}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={downloadCSV} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-sm font-medium hover:bg-secondary">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={downloadPDF} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <FileText className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                {data.headers.map((h) => (
                  <th key={h} className={`p-3 font-semibold whitespace-nowrap ${isAmountHeader(h) ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-secondary/50">
                  {data.headers.map((h) => {
                    const isAmt = isAmountHeader(h);
                    const isDt = h === dateCol;
                    const raw = r[h];
                    const display = isAmt ? formatCell(raw, h) : String(raw ?? "");
                    return (
                      <td
                        key={h}
                        className={`p-3 align-top ${isAmt ? "text-right font-semibold tabular-nums" : ""} ${isDt ? "whitespace-nowrap text-muted-foreground" : ""}`}
                      >
                        {isAmt && display ? `₹${display}` : display}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={data.headers.length} className="p-8 text-center text-muted-foreground">No rows match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Original seeded view (unchanged behavior)
// ──────────────────────────────────────────────────────────────
function SeededView() {
  const all = useMemo<Txn[]>(() => (typeof window !== "undefined" ? getTransactions() : []), []);
  const [range, setRange] = useState<Range>("6M");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const today = new Date();
  const defaultFrom = new Date(); defaultFrom.setMonth(today.getMonth() - 6);
  const [from, setFrom] = useState(defaultFrom.toISOString().slice(0, 10));
  const [to, setTo] = useState(today.toISOString().slice(0, 10));
  const [month, setMonth] = useState<string>("");

  const filtered = useMemo(() => {
    const now = new Date();
    let f: Date, t: Date = now;
    if (range === "CUSTOM") { f = new Date(from); t = new Date(to); t.setHours(23,59,59); }
    else if (range === "1M") { f = new Date(); f.setMonth(now.getMonth() - 1); }
    else if (range === "3M") { f = new Date(); f.setMonth(now.getMonth() - 3); }
    else if (range === "6M") { f = new Date(); f.setMonth(now.getMonth() - 6); }
    else if (range === "YTD") { f = new Date(now.getFullYear(), 0, 1); }
    else { f = new Date(); f.setFullYear(now.getFullYear() - 1); }
    return all.filter((x) => {
      const d = new Date(x.date);
      if (d < f || d > t) return false;
      if (month) {
        const [y, m] = month.split("-").map(Number);
        if (d.getFullYear() !== y || d.getMonth() + 1 !== m) return false;
      }
      if (cat !== "All" && x.category !== cat) return false;
      if (q && !x.desc.toLowerCase().includes(q.toLowerCase()) && !x.ref.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [all, range, from, to, q, cat, month]);

  const credits = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const debits = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    all.forEach((t) => {
      const d = new Date(t.date);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    return Array.from(set).sort().reverse();
  }, [all]);

  function downloadCSV() {
    const rows = [["Date","Description","Category","Channel","Reference","Amount (INR)"],
      ...filtered.map((t) => [new Date(t.date).toLocaleDateString("en-IN"), t.desc, t.category, t.channel, t.ref, t.amount.toFixed(2)])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `statement-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadPDF() {
    const f = new Date(from);
    const t = new Date(to);
    if (range !== "CUSTOM") {
      const now = new Date();
      if (range === "1M") f.setTime(now.getTime()), f.setMonth(now.getMonth() - 1);
      else if (range === "3M") f.setTime(now.getTime()), f.setMonth(now.getMonth() - 3);
      else if (range === "6M") f.setTime(now.getTime()), f.setMonth(now.getMonth() - 6);
      else if (range === "YTD") f.setTime(new Date(now.getFullYear(), 0, 1).getTime());
      else f.setTime(now.getTime()), f.setFullYear(now.getFullYear() - 1);
      t.setTime(now.getTime());
    }
    try {
      await downloadStatementPDF(filtered, f, t);
    } catch (err) {
      console.error("PDF download failed", err);
      alert(`Could not generate PDF: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Wallet className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="font-bold text-primary tabular-nums">{formatINR(BALANCE_PAISE)}</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">A/C {CUSTOMER.accountNo} · {CUSTOMER.ifsc}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Credits in view</p>
          <p className="font-bold text-emerald-700 tabular-nums">{formatINR(Math.round(credits * 100))}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{filtered.filter(t=>t.amount>0).length} credit entries</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Debits in view</p>
          <p className="font-bold text-rose-700 tabular-nums">{formatINR(Math.round(debits * 100))}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{filtered.filter(t=>t.amount<0).length} debit entries</p>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap gap-2">
          {(["1M","3M","6M","YTD","1Y","CUSTOM"] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition ${range === r ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-secondary"}`}>
              {r === "1M" ? "1 Month" : r === "3M" ? "3 Months" : r === "6M" ? "6 Months" : r === "YTD" ? "Year to date" : r === "1Y" ? "1 Year" : "Custom"}
            </button>
          ))}
        </div>
        {range === "CUSTOM" && (
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <label className="text-sm">From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></label>
            <label className="text-sm">To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></label>
          </div>
        )}
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search description / reference"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm" />
          </div>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All months in range</option>
            {monthOptions.map((m) => {
              const [y, mm] = m.split("-");
              const label = new Date(Number(y), Number(mm) - 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
              return <option key={m} value={m}>{label}</option>;
            })}
          </select>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            {["All","Transfer","Bill","Shopping","Salary","ATM","UPI","Interest","EMI"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
          <div className="flex gap-4 text-sm">
            <span><span className="text-muted-foreground">Credits:</span> <span className="font-semibold text-emerald-700 tabular-nums">{formatINR(Math.round(credits * 100))}</span></span>
            <span><span className="text-muted-foreground">Debits:</span> <span className="font-semibold text-rose-700 tabular-nums">{formatINR(Math.round(debits * 100))}</span></span>
            <span className="hidden sm:inline"><span className="text-muted-foreground">Count:</span> <span className="font-semibold">{filtered.length}</span></span>
          </div>
          <div className="flex gap-2">
            <button onClick={downloadCSV} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-sm font-medium hover:bg-secondary">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={downloadPDF} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <FileText className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Channel</th>
                <th className="p-3 font-semibold">Reference</th>
                <th className="p-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/50">
                  <td className="p-3 whitespace-nowrap text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="p-3">
                    <p className="font-medium">{t.desc}</p>
                    <p className="text-xs text-muted-foreground">{t.category}</p>
                  </td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-secondary">{t.channel}</span></td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{t.ref}</td>
                  <td className={`p-3 text-right font-semibold tabular-nums ${t.amount > 0 ? "text-emerald-700" : "text-foreground"}`}>
                    {t.amount > 0 ? "+" : "-"}{formatINR(Math.round(Math.abs(t.amount) * 100))}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No transactions in this range.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <ul className="md:hidden divide-y divide-border">
          {filtered.map((t) => (
            <li key={t.id} className="p-4 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 items-center">
              <div className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${t.amount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {t.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{t.desc}</p>
                <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} · {t.channel}</p>
              </div>
              <p className={`text-sm font-semibold tabular-nums ${t.amount > 0 ? "text-emerald-700" : ""}`}>
                {t.amount > 0 ? "+" : "-"}{formatINR(Math.round(Math.abs(t.amount) * 100))}
              </p>
            </li>
          ))}
          {filtered.length === 0 && <li className="p-8 text-center text-muted-foreground text-sm">No transactions.</li>}
        </ul>
      </Card>
    </>
  );
}
