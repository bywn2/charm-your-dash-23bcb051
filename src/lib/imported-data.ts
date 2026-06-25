// Excel import store. Keeps headers in original order and rows as plain
// key/value records so any extra columns the user adds flow into the UI.
import * as XLSX from "xlsx";

const KEY = "bom_imported_v1";

export type ImportedRow = Record<string, string | number>;
export type ImportedData = {
  headers: string[];
  rows: ImportedRow[];
  fileName: string;
  importedAt: string;
};

const stripDiacritics = (s: string) =>
  s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

const norm = (s: string) =>
  stripDiacritics(String(s)).toLowerCase().replace(/[^a-z0-9]/g, "");

export function isAmountHeader(h: string): boolean {
  const n = norm(h);
  return (
    n.includes("debit") ||
    n.includes("credit") ||
    n.includes("amount") ||
    n.includes("balance") ||
    n.includes("withdrawal") ||
    n.includes("deposit")
  );
}

export function isDateHeader(h: string): boolean {
  const n = norm(h);
  return n === "date" || n.includes("txndate") || n.includes("valuedate") || n.includes("transactiondate");
}

export function parseAmount(v: string | number | undefined | null): number {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return v;
  const n = Number(String(v).replace(/[,\s₹$]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const INR = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatCell(value: string | number, header: string): string {
  if (value === "" || value == null) return "";
  if (isAmountHeader(header)) {
    const n = parseAmount(value);
    return n === 0 && value !== 0 && value !== "0" ? String(value) : INR(n);
  }
  return String(value);
}

export async function parseExcelFile(file: File): Promise<ImportedData> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  // Read as array of arrays first so we can preserve original header order
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });
  if (aoa.length === 0) return { headers: [], rows: [], fileName: file.name, importedAt: new Date().toISOString() };
  // Find first non-empty row as the header row
  let headerIdx = 0;
  for (let i = 0; i < aoa.length; i++) {
    const r = aoa[i] as unknown[];
    if (r && r.some((c) => String(c ?? "").trim() !== "")) {
      headerIdx = i;
      break;
    }
  }
  const headerRow = (aoa[headerIdx] as unknown[]).map((c, i) => String(c ?? `Column ${i + 1}`).trim() || `Column ${i + 1}`);
  // De-duplicate headers
  const seen = new Map<string, number>();
  const headers = headerRow.map((h) => {
    const k = h;
    const c = (seen.get(k) ?? 0) + 1;
    seen.set(k, c);
    return c === 1 ? k : `${k} (${c})`;
  });
  const rows: ImportedRow[] = [];
  for (let i = headerIdx + 1; i < aoa.length; i++) {
    const r = aoa[i] as unknown[];
    if (!r || !r.some((c) => String(c ?? "").trim() !== "")) continue;
    const obj: ImportedRow = {};
    headers.forEach((h, idx) => {
      const v = r[idx];
      obj[h] = typeof v === "number" ? v : String(v ?? "");
    });
    rows.push(obj);
  }
  return { headers, rows, fileName: file.name, importedAt: new Date().toISOString() };
}

export function saveImported(d: ImportedData) {
  localStorage.setItem(KEY, JSON.stringify(d));
}

export function getImported(): ImportedData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ImportedData) : null;
  } catch {
    return null;
  }
}

export function clearImported() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
