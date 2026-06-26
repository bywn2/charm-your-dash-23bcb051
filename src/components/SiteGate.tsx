import { useEffect, useState, type ReactNode } from "react";

const PASSWORD = "n@$";
const KEY = "site-gate-unlocked";

export function SiteGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === "1") setUnlocked(true);
    } catch {}
    setReady(true);
  }, []);

  if (!ready) {
    return <div style={{ position: "fixed", inset: 0, background: "#fff" }} />;
  }

  if (!unlocked) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#fff", display: "grid", placeItems: "center", zIndex: 99999 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value === PASSWORD) {
              try { sessionStorage.setItem(KEY, "1"); } catch {}
              setUnlocked(true);
            } else {
              setErr(true);
            }
          }}
          style={{ display: "flex", flexDirection: "column", gap: 10, width: 260 }}
        >
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => { setValue(e.target.value); setErr(false); }}
            style={{ padding: "10px 12px", border: "1px solid #d4d4d8", borderRadius: 6, fontSize: 14, outline: "none" }}
            aria-label="Password"
          />
          <button type="submit" style={{ padding: "10px 12px", background: "#111", color: "#fff", border: 0, borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
            Enter
          </button>
          {err && <span style={{ color: "#b91c1c", fontSize: 12 }}>Incorrect</span>}
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
