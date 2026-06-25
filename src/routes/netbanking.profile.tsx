import { createFileRoute } from "@tanstack/react-router";
import { BankLayout, Card, PageTitle } from "@/components/BankLayout";
import { getUser } from "@/lib/bank-store";
import { User, Mail, Phone, MapPin, Shield, Bell, KeyRound, FileCheck } from "lucide-react";

export const Route = createFileRoute("/netbanking/profile")({
  head: () => ({ meta: [{ title: "Profile — Bank of Maharashtra" }] }),
  component: Profile,
});

function Profile() {
  const user = typeof window !== "undefined" ? getUser() : null;
  return (
    <BankLayout>
      <PageTitle title="My Profile" subtitle="Manage your personal information and security settings." />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bom-gradient text-primary-foreground grid place-items-center text-2xl font-bold shrink-0">
              {user?.name.charAt(0) ?? "U"}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">Customer ID: {user?.customerId}</p>
            </div>
          </div>
          <dl className="grid sm:grid-cols-2 gap-4">
            <Info icon={User} k="Username" v={user?.username} />
            <Info icon={Mail} k="Email" v={user?.email} />
            <Info icon={Phone} k="Mobile" v={user?.mobile} />
            <Info icon={MapPin} k="Branch" v={user?.branch} />
            <Info icon={FileCheck} k="PAN" v="ABCDE1234F" />
            <Info icon={FileCheck} k="Aadhaar" v="XXXX XXXX 4521" />
          </dl>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Security & Preferences</h3>
          <ul className="space-y-2">
            {[
              { i: KeyRound, t: "Change Password" },
              { i: Shield, t: "Two-Factor Authentication" },
              { i: Bell, t: "Notification Preferences" },
              { i: FileCheck, t: "Update KYC Documents" },
            ].map(({ i: Icon, t }) => (
              <li key={t}>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-left text-sm">
                  <Icon className="h-4 w-4 text-primary" /> <span className="flex-1">{t}</span> <span className="text-muted-foreground">›</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </BankLayout>
  );
}

function Info({ icon: Icon, k, v }: { icon: React.ComponentType<{ className?: string }>; k: string; v?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0"><Icon className="h-4 w-4" /></div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{k}</p>
        <p className="font-medium truncate">{v}</p>
      </div>
    </div>
  );
}
