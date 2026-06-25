import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CUSTOMER, BALANCE_PAISE, type Txn } from "./bank-store";
import logoAsset from "@/assets/bom-logo.png.asset.json";

const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Brand palette matched to the reference statement
const HEADER_BG: [number, number, number] = [213, 232, 240]; // light blue
const BORDER: [number, number, number] = [120, 160, 190];
const TEXT_DARK: [number, number, number] = [20, 20, 20];
const BLUE: [number, number, number] = [13, 71, 132];

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(logoAsset.url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function downloadStatementPDF(txns: Txn[], fromDate: Date, toDate: Date) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 36;

  // ── Logo band centered at top ─────────────────────────────
  const logoData = await loadLogoDataUrl();
  const logoW = 220;
  const logoH = 143; // preserves 400x260 aspect ratio
  const logoX = (pageW - logoW) / 2;
  const logoY = 32;
  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", logoX, logoY, logoW, logoH);
    } catch {
      doc.setFillColor(...HEADER_BG);
      doc.rect(logoX, logoY, logoW, logoH, "F");
      doc.setTextColor(...BLUE);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Bank of Maharashtra", pageW / 2, logoY + 45, { align: "center" });
    }
  }

  // ── Customer & Branch detail tables (side by side) ────────
  const startY = logoY + logoH + 24;
  const colGap = 10;
  const colW = (pageW - margin * 2 - colGap) / 2;

  const customerLines: string[] = [
    CUSTOMER.name,
    "KHATA NO 238/244",
    CUSTOMER.address[0],
    CUSTOMER.address[1],
    `${CUSTOMER.address[2]}`,
    CUSTOMER.address[3],
    `Mobile : ${CUSTOMER.mobile.replace(/\D/g, "")}`,
    `Email : ${CUSTOMER.email}`,
    `Date of Birth : ${CUSTOMER.dob}`,
    `PAN/TAN : ${CUSTOMER.pan}`,
    "",
    `Statement Date : ${toDate.toLocaleDateString("en-GB")}`,
  ];

  const branchLines: string[] = [
    `Branch No : ${CUSTOMER.branchNo}`,
    `Branch IFSC : ${CUSTOMER.ifsc}`,
    `Branch Name : ${CUSTOMER.branchName}`,
    CUSTOMER.branchAddress[0],
    CUSTOMER.branchAddress[1],
    `Branch GSTIN : ${CUSTOMER.branchGstin}`,
    `Account No : ${CUSTOMER.accountNo}`,
    `Account Type : ${CUSTOMER.accountType}`,
    `Total Balance : ${fmt(BALANCE_PAISE / 100)}`,
    `Clear Balance : ${fmt(BALANCE_PAISE / 100)}`,
    `Primary GSTIN : NA`,
    "",
  ];

  autoTable(doc, {
    startY,
    head: [["Customer Details"]],
    body: customerLines.map((l) => [l]),
    margin: { left: margin },
    tableWidth: colW,
    theme: "grid",
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 3, right: 6, bottom: 3, left: 8 },
      textColor: TEXT_DARK,
      lineColor: BORDER,
      lineWidth: 0.6,
      valign: "middle",
      minCellHeight: 16,
    },
    headStyles: {
      fillColor: HEADER_BG,
      textColor: TEXT_DARK,
      halign: "center",
      fontStyle: "bold",
      fontSize: 11,
      cellPadding: 5,
    },
  });

  autoTable(doc, {
    startY,
    head: [["Branch & Account Details"]],
    body: branchLines.map((l) => [l]),
    margin: { left: margin + colW + colGap },
    tableWidth: colW,
    theme: "grid",
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 3, right: 6, bottom: 3, left: 8 },
      textColor: TEXT_DARK,
      lineColor: BORDER,
      lineWidth: 0.6,
      valign: "middle",
      minCellHeight: 16,
    },
    headStyles: {
      fillColor: HEADER_BG,
      textColor: TEXT_DARK,
      halign: "center",
      fontStyle: "bold",
      fontSize: 11,
      cellPadding: 5,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detailsBottom = (doc as any).lastAutoTable.finalY;

  // ── Statement title band ──────────────────────────────────
  const titleY = detailsBottom + 22;
  // Build transaction rows with running balance (chronological asc)
  let running = BALANCE_PAISE / 100;
  const sortedDesc = [...txns].sort((a, b) => b.date.localeCompare(a.date));
  const builtDesc = sortedDesc.map((t) => {
    const debit = t.amount < 0 ? Math.abs(t.amount) : 0;
    const credit = t.amount > 0 ? t.amount : 0;
    const balAfter = running; // balance shown is post-transaction
    running = running - t.amount; // older row
    const type =
      t.category === "EMI" ? "Charges" :
      t.channel === "ATM" ? "ATM" :
      t.channel === "NEFT" ? "Cheque" :
      t.channel === "IMPS" ? "Cheque" :
      "";
    return {
      date: new Date(t.date).toLocaleDateString("en-GB"),
      type,
      desc: t.desc,
      ref: t.ref.replace(/\D/g, "").slice(-5),
      debit,
      credit,
      bal: balAfter,
      channel: t.channel === "ATM" ? "ATM-null" : t.channel === "NEFT" ? "1091-null" : t.channel === "IMPS" ? "1655-null" : t.channel === "UPI" ? "UPI-null" : "",
    };
  });
  const rows = builtDesc.reverse().map((r) => [
    r.date,
    r.type,
    r.desc,
    r.ref,
    r.debit ? fmt(r.debit) : "",
    r.credit ? fmt(r.credit) : "",
    fmt(r.bal),
    r.channel,
  ]);

  doc.setFillColor(...HEADER_BG);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.6);
  doc.rect(margin, titleY, pageW - margin * 2, 26, "FD");
  doc.setTextColor(...TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(
    `Statement for Account No ${CUSTOMER.accountNo} from ${fromDate.toLocaleDateString("en-GB")} to ${toDate.toLocaleDateString("en-GB")}.`,
    pageW / 2,
    titleY + 17,
    { align: "center" }
  );

  // ── Transactions table ────────────────────────────────────
  autoTable(doc, {
    startY: titleY + 26,
    head: [["Date", "Type", "Particulars", "Cheque/Reference No", "Debit", "Credit", "Balance", "Channel"]],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
      textColor: TEXT_DARK,
      lineColor: BORDER,
      lineWidth: 0.5,
      valign: "middle",
    },
    headStyles: {
      fillColor: HEADER_BG,
      textColor: TEXT_DARK,
      fontStyle: "bold",
      halign: "center",
      fontSize: 9.5,
      lineColor: BORDER,
      lineWidth: 0.6,
    },
    columnStyles: {
      0: { cellWidth: 60, halign: "left" },
      1: { cellWidth: 48, halign: "left" },
      2: { cellWidth: 150, halign: "left" },
      3: { cellWidth: 78, halign: "left" },
      4: { halign: "right", cellWidth: 60 },
      5: { halign: "right", cellWidth: 60 },
      6: { halign: "right", cellWidth: 70 },
      7: { cellWidth: 50, halign: "left" },
    },
    margin: { left: margin, right: margin, bottom: 36 },
    didDrawPage: () => {
      const pageCount = doc.getNumberOfPages();
      const current = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_DARK);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Page ${current} of ${pageCount}`,
        pageW / 2,
        doc.internal.pageSize.getHeight() - 18,
        { align: "center" }
      );
    },
  });

  // Re-stamp page numbers with final total after pagination
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(255, 255, 255);
    doc.rect(pageW / 2 - 60, doc.internal.pageSize.getHeight() - 30, 120, 18, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_DARK);
    doc.text(`Page ${i} of ${total}`, pageW / 2, doc.internal.pageSize.getHeight() - 18, { align: "center" });
  }

  doc.save(`BoM-Statement-${fromDate.toISOString().slice(0, 10)}_to_${toDate.toISOString().slice(0, 10)}.pdf`);
}
