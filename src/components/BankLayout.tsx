import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, Receipt, Landmark, User, FileText,
  LogOut, Menu, X, HeadphonesIcon,
} from "lucide-react";
import logo from "@/assets/bom-logo.png.asset.json";
import { getUser, logout, type AuthUser } from "@/lib/bank-store";

const nav = [
  { to: "/netbanking/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/netbanking/accounts", label: "Accounts", icon: Wallet },
  { to: "/netbanking/statements", label: "Statements", icon: FileText },
  { to: "/netbanking/transfers", label: "Transfers", icon: ArrowLeftRight },
  { to: "/netbanking/bills", label: "Bill Payments", icon: Receipt },
  { to: "/netbanking/loans", label: "Loans & Cards", icon: Landmark },
  { to: "/netbanking/profile", label: "Profile", icon: User },
] as const;

export function useAuthGuard(): AuthUser | null {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    const u = getUser();
    if (!u) navigate({ to: "/login" });
    else setUser(u);
  }, [navigate]);
  return user;
}

export function BankLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthGuard();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { setOpen(false); }, [pathname]);

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <p className="text-muted-foreground text-sm">Loading secure session…</p>
      </div>
    );
  }

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const firstName = user.name.split(" ")[0];
  const lastLogin = new Date().toLocaleString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Desktop sidebar */}
      <Sidebar user={user} />

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="lg:hidden fixed inset-0 bg-slate-900/60 z-40" onClick={() => setOpen(false)} />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#002147] text-white z-50 overflow-y-auto">
            <Sidebar user={user} mobile onClose={() => setOpen(false)} />
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        {/* Sticky top bar */}
        <header className="h-16 bg-background border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/netbanking/dashboard" className="lg:hidden flex items-center shrink-0" aria-label="Bank of Maharashtra">
              <img src={logo.url} alt="Bank of Maharashtra" className="h-8 w-auto" />
            </Link>
            <h1 className="hidden sm:block text-base lg:text-lg font-semibold text-slate-800 truncate">
              Welcome back, {firstName}
            </h1>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden md:flex flex-col items-end text-right leading-tight">
              <span className="text-sm font-semibold text-slate-900">{user.name}</span>
              <span className="text-[11px] text-slate-500">Last Login: {lastLogin}</span>
            </div>
            <div
              className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 grid place-items-center font-semibold text-[#002147] text-sm shrink-0"
              aria-label={user.name}
            >
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}

function Sidebar({ user, mobile, onClose }: { user: AuthUser; mobile?: boolean; onClose?: () => void }) {
  return (
    <aside className={`${mobile ? "flex" : "hidden lg:flex"} w-64 lg:w-64 flex-col bg-[#002147] text-white shrink-0 ${mobile ? "" : "sticky top-0 h-screen"}`}>
      <div className="p-6 flex items-center justify-between gap-3">
        <Link to="/netbanking/dashboard" className="flex items-center gap-3 min-w-0" aria-label="Bank of Maharashtra">
          <div className="h-9 w-9 rounded-lg bg-white grid place-items-center shrink-0 p-1">
            <img src={logo.url} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9933]">Bank of</span>
            <span className="text-base font-bold tracking-tight truncate">Maharashtra</span>
          </div>
        </Link>
        {mobile && (
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm"
            activeProps={{
              className: "flex items-center gap-3 px-3 py-2.5 bg-white/10 text-white border-l-2 border-[#FF9933] rounded-lg text-sm font-semibold",
            }}
          >
            <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <HeadphonesIcon className="h-3.5 w-3.5 text-[#FF9933]" />
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Relationship Manager</p>
          </div>
          <p className="text-sm font-medium text-white">Ankit Sharma</p>
          <p className="text-xs text-slate-400 mt-0.5">+91 22 4567 8901</p>
          <p className="text-[10px] text-slate-500 mt-3 truncate">Branch · {user.branch ?? "Shivajinagar"}</p>
        </div>
      </div>
    </aside>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-background rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 ${className}`}>
      {children}
    </div>
  );
}
