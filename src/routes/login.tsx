import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/bom-logo.png.asset.json";
import { login, getUser } from "@/lib/bank-store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "NetBanking Login — Bank of Maharashtra" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getUser()) navigate({ to: "/netbanking/dashboard" });
  }, [navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!u.trim() || !p.trim()) return;
    setLoading(true);
    setTimeout(() => {
      login(u.trim());
      navigate({ to: "/netbanking/dashboard" });
    }, 600);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-secondary">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bom-gradient text-primary-foreground relative overflow-hidden">
        <div>
          <img src={logo.url} alt="Bank of Maharashtra" className="h-16 w-auto bg-white p-2 rounded-lg" />
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold leading-tight">Bank of<br />Maharashtra<br /><span className="text-saffron text-3xl">Internet Banking</span></h2>
          <p className="mt-4 text-primary-foreground/90 max-w-md">Secure 24x7 access to your accounts, transfers, bill payments and loans — from anywhere in India.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {["256-bit SSL Encrypted Session", "Two-Factor Authentication", "RBI Compliant Security", "DICGC Insured Deposits"].map((f) => (
              <li key={f} className="flex items-center gap-3"><Shield className="h-4 w-4 text-saffron shrink-0" /> {f}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/70">© Bank of Maharashtra · A Government of India Undertaking</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <img src={logo.url} alt="Bank of Maharashtra" className="h-14 w-auto" />
          </div>
          <div className="bg-background rounded-2xl border border-border shadow-elegant p-8">
            <h1 className="text-2xl font-bold">Sign in to NetBanking</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter any User ID and password to continue (demo).</p>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-sm font-medium">User ID</label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input value={u} onChange={(e) => setU(e.target.value)} required type="text" autoComplete="username"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. rahul.sharma" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input value={p} onChange={(e) => setP(e.target.value)} required type={show ? "text" : "password"} autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-input" /> Remember me</label>
                <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
              </div>
              <button disabled={loading} className="w-full bom-gradient text-primary-foreground rounded-md py-2.5 font-semibold shadow-elegant hover:opacity-95 disabled:opacity-60 transition">
                {loading ? "Signing in…" : "Secure Login"}
              </button>
              <p className="text-xs text-muted-foreground text-center">By signing in you agree to BoM's Terms & Privacy Policy. Never share your password or OTP with anyone.</p>
            </form>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            New to BoM? <a href="/personal" className="text-primary font-medium hover:underline">Open an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
