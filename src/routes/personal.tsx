import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section } from "./index";
import { Wallet, PiggyBank, CreditCard, Smartphone, ShieldCheck, Coins } from "lucide-react";

export const Route = createFileRoute("/personal")({
  head: () => ({ meta: [
    { title: "Personal Banking — Bank of Maharashtra" },
    { name: "description", content: "Savings, deposits, cards and digital banking services for individuals from Bank of Maharashtra." },
  ]}),
  component: Personal,
});

const items = [
  { i: Wallet, t: "Savings Accounts", d: "Regular, Salary, Premium, Mahabank Lok Bachat — pick what fits you." },
  { i: PiggyBank, t: "Fixed & Recurring Deposits", d: "Flexible tenures from 7 days to 10 years with senior citizen benefits." },
  { i: CreditCard, t: "Debit & Credit Cards", d: "RuPay, Visa & Mastercard with rewards, cashback and global acceptance." },
  { i: Smartphone, t: "MahaMobile & NetBanking", d: "Pay bills, transfer funds, invest — anytime, anywhere." },
  { i: ShieldCheck, t: "Insurance & Investment", d: "Life, health and mutual funds through trusted partners." },
  { i: Coins, t: "Locker & Demat", d: "Safe deposit lockers and demat accounts across 2,200+ branches." },
];

function Personal() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Personal Banking" title="Banking that grows with your family." subtitle="From your first savings account to retirement planning — we are with you at every milestone." />
      <Section title="Everything you need, in one bank">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ i: Icon, t, d }) => (
            <div key={t} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:-translate-y-1 hover:shadow-elegant transition">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4"><Icon className="h-6 w-6" /></div>
              <h3 className="text-xl font-semibold mb-2">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
