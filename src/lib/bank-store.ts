// Dummy auth + transactions data store (client-side only, no backend).
// Any username/password works. Persists in localStorage.

export type Txn = {
  id: string;
  date: string; // ISO
  desc: string;
  category: "Transfer" | "Bill" | "Shopping" | "Salary" | "ATM" | "UPI" | "Interest" | "EMI";
  amount: number; // negative = debit, positive = credit
  channel: string;
  ref: string;
};

const AUTH_KEY = "bom_auth_v1";

export type AuthUser = {
  customerId: string;
  name: string;
  username: string;
  accountNo: string;
  ifsc: string;
  branch: string;
  email: string;
  mobile: string;
  loginAt: string;
};

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function login(username: string): AuthUser {
  const user: AuthUser = {
    customerId: "BOM2284716",
    name: "Salla Bharath Kumar",
    username: username || "bharath.salla",
    accountNo: "60412238847651",
    ifsc: "MAHB0000476",
    branch: "Himayathnagar, Hyderabad",
    email: "bharath.salla@mahabank.in",
    mobile: "+91 98480 33212",
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

// Static customer details (also used pre-login on statements)
export const CUSTOMER = {
  name: "Salla Bharath Kumar",
  address: ["H.No 3-6-291/A, Liberty Road", "Himayathnagar", "Hyderabad - 500029", "Telangana, India"],
  mobile: "+91 98480 33212",
  email: "bharath.salla@mahabank.in",
  pan: "CKLPS4476R",
  dob: "12/04/1992",
  customerId: "BOM2284716",
  accountNo: "60412238847651",
  accountType: "Savings - Individual Resident",
  branchNo: "00476",
  branchName: "Himayathnagar (Hyderabad)",
  branchAddress: ["3-6-291, Liberty X Roads,", "Himayathnagar, Hyderabad - 500029"],
  ifsc: "MAHB0000476",
  branchGstin: "36AACCB0774B1Z9",
};

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export const BALANCE_PAISE = 445321200; // ₹44,53,212.00
export const formatINR = (paise: number) => {
  const rupees = paise / 100;
  return rupees.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
};

// Deterministic 6-month transaction history (seeded by date).
const seedRand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const merchants: { d: string; c: Txn["category"]; min: number; max: number; debit: boolean }[] = [
  { d: "Swiggy Order", c: "UPI", min: 180, max: 750, debit: true },
  { d: "Zomato", c: "UPI", min: 220, max: 900, debit: true },
  { d: "BigBasket Groceries", c: "Shopping", min: 800, max: 3500, debit: true },
  { d: "Amazon.in Purchase", c: "Shopping", min: 499, max: 8999, debit: true },
  { d: "Flipkart Order", c: "Shopping", min: 599, max: 5499, debit: true },
  { d: "Reliance Jio Recharge", c: "Bill", min: 239, max: 999, debit: true },
  { d: "MSEB Electricity Bill", c: "Bill", min: 1200, max: 4200, debit: true },
  { d: "Tata Power Bill", c: "Bill", min: 1500, max: 3800, debit: true },
  { d: "PMC Water Tax", c: "Bill", min: 450, max: 1100, debit: true },
  { d: "Mahanagar Gas Bill", c: "Bill", min: 380, max: 1250, debit: true },
  { d: "IRCTC Train Booking", c: "UPI", min: 845, max: 4200, debit: true },
  { d: "Uber Ride", c: "UPI", min: 95, max: 480, debit: true },
  { d: "Ola Cab", c: "UPI", min: 110, max: 520, debit: true },
  { d: "Netflix Subscription", c: "Bill", min: 199, max: 649, debit: true },
  { d: "Spotify Premium", c: "Bill", min: 119, max: 179, debit: true },
  { d: "Apollo Pharmacy", c: "Shopping", min: 240, max: 1800, debit: true },
  { d: "PVR Cinemas", c: "Shopping", min: 350, max: 1450, debit: true },
  { d: "ATM Withdrawal - Pune", c: "ATM", min: 2000, max: 20000, debit: true },
  { d: "UPI to Rahul Sharma", c: "Transfer", min: 500, max: 8000, debit: true },
  { d: "UPI to Priya Patil", c: "Transfer", min: 200, max: 4500, debit: true },
  { d: "NEFT to HDFC Bank", c: "Transfer", min: 5000, max: 25000, debit: true },
  { d: "Home Loan EMI - BoM", c: "EMI", min: 28500, max: 28500, debit: true },
  { d: "Car Loan EMI - BoM", c: "EMI", min: 14200, max: 14200, debit: true },
  { d: "SIP - Mutual Fund", c: "Bill", min: 5000, max: 10000, debit: true },
  { d: "LIC Premium", c: "Bill", min: 3200, max: 12000, debit: true },
  { d: "Salary Credit - Infosys Ltd", c: "Salary", min: 185000, max: 185000, debit: false },
  { d: "Quarterly Interest Credit", c: "Interest", min: 2800, max: 5400, debit: false },
  { d: "UPI Received - Anil Desai", c: "Transfer", min: 500, max: 12000, debit: false },
  { d: "Cashback - Amazon", c: "UPI", min: 50, max: 600, debit: false },
  { d: "IT Refund", c: "Interest", min: 8000, max: 24000, debit: false },
];

let cache: Txn[] | null = null;
export function getTransactions(): Txn[] {
  if (cache) return cache;
  const rand = seedRand(20260625);
  const out: Txn[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 6 months back -> today
  for (let day = 0; day < 185; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() - day);
    const count = Math.floor(rand() * 4) + (date.getDate() === 1 ? 3 : 1); // salary day on 1st
    for (let i = 0; i < count; i++) {
      let m = merchants[Math.floor(rand() * merchants.length)];
      if (date.getDate() === 1 && i === 0) m = merchants.find((x) => x.c === "Salary")!;
      if (date.getDate() === 5 && i === 0) m = merchants.find((x) => x.d.includes("Home Loan"))!;
      if (date.getDate() === 7 && i === 0) m = merchants.find((x) => x.d.includes("Car Loan"))!;
      const amt = Math.round((m.min + rand() * (m.max - m.min)) * 100) / 100;
      out.push({
        id: `${date.toISOString().slice(0, 10)}-${i}-${Math.floor(rand() * 1e6)}`,
        date: date.toISOString(),
        desc: m.d,
        category: m.c,
        amount: m.debit ? -amt : amt,
        channel: m.c === "ATM" ? "ATM" : m.c === "EMI" || m.c === "Salary" ? "NEFT" : m.c === "Transfer" ? "IMPS" : "UPI",
        ref: "TXN" + Math.floor(rand() * 1e10).toString().padStart(10, "0"),
      });
    }
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  cache = out;
  return out;
}
