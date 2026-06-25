import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, ArrowLeftRight, Receipt, Landmark, User, FileText, LogOut, Menu, X, Bell } from "lucide-react";
import logo from "@/assets/bom-logo.png.asset.json";
import { getUser, logout, type AuthUser } from "@/lib/bank-store";

const nav = [
  { to: "/netbanking/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/netbanking/accounts", label: "My Accounts", icon: Wallet },
  { to: "/netbanking/statements", label: "Statements & Transactions", icon: FileText },
  { to: "/netbanking/transfers", label: "Money Transfer", icon: ArrowLeftRight },
  { to: "/netbanking/bills", label: "Bill Payments", icon: Receipt },
  { to: "/netbanking/loans", label: "Loans", icon: Landmark },
  { to: "/netbanking/profile", label: "Profile & Settings", icon: User },
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
    return <div className="min-h-screen grid place-items-center bg-secondary"><p className="text-muted-foreground">Loading secure session…</p></div>;
  }

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/40">
      {/* Top bar: logo (left) | profile + logout (right) */}
      <header className="sticky top-0 z-40 bg-primary-dark text-primary-foreground shadow-elegant">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 -ml-2 rounded-md hover:bg-white/10" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/netbanking/dashboard" className="flex items-center shrink-0" aria-label="Bank of Maharashtra">
            <div className="bg-white rounded px-2 py-1">
              <img src={logo.url} alt="Bank of Maharashtra" className="h-9 md:h-10 w-auto" />
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/10">
              <div className="h-7 w-7 rounded-full bg-saffron text-primary-dark grid place-items-center font-bold text-xs shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[10px] text-primary-foreground/70 uppercase tracking-wide">User ID</span>
                <span className="text-xs font-semibold truncate max-w-[140px]">{user.username}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-sm font-medium"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>


      <div className="flex-1 flex">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-background border-r border-border">
          <SideNav onLogout={handleLogout} />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
            <aside className="lg:hidden fixed left-0 top-[60px] bottom-0 w-72 bg-background z-50 border-r border-border overflow-y-auto">
              <SideNav onLogout={handleLogout} />
            </aside>
          </>
        )}

        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SideNav({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="flex flex-col py-4 h-full">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          activeProps={{ className: "flex items-center gap-3 px-5 py-3 text-sm font-semibold bg-primary/10 text-primary border-l-4 border-primary" }}>
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
      <button onClick={onLogout} className="mt-auto flex items-center gap-3 px-5 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 lg:hidden">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </nav>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-background rounded-2xl border border-border shadow-card p-5 md:p-6 ${className}`}>{children}</div>;
}
