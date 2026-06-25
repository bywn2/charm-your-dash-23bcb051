import { createFileRoute } from "@tanstack/react-router";
import { BankLayout } from "@/components/BankLayout";
import { TxnView } from "./netbanking.transactions";

export const Route = createFileRoute("/netbanking/statements")({
  head: () => ({ meta: [{ title: "Statements — Bank of Maharashtra" }] }),
  component: () => (
    <BankLayout>
      <TxnView title="Account Statement" subtitle="Choose Month, 6 Months, Year-to-date or a Custom date range. Download as CSV." />
    </BankLayout>
  ),
});
