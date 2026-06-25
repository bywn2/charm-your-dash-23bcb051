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
      {/* Top bar: hamburger + user id (left) | logo (right) */}
      <header className="sticky top-0 z-40 bg-primary-dark text-primary-foreground shadow-elegant">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 -ml-2 rounded-md hover:bg-white/10" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-full bg-saffron text-primary-dark grid place-items-center font-bold shrink-0 text-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[11px] text-primary-foreground/70 uppercase tracking-wide">User ID</span>
              <span className="text-sm font-semibold truncate">{user.username}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-white/10" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
            <button onClick={handleLogout} className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-sm" aria-label="Logout">
              <LogOut className="h-4 w-4" /> <span className="hidden md:inline">Logout</span>
            </button>
            <Link to="/netbanking/dashboard" className="flex items-center shrink-0 ml-1" aria-label="Bank of Maharashtra">
              <div className="bg-white rounded px-1.5 py-0.5">
                <img src={logo.url} alt="Bank of Maharashtra" className="h-9 w-auto" />
              </div>
            </Link>
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
