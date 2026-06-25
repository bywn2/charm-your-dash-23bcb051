import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/netbanking/")({
  beforeLoad: () => { throw redirect({ to: "/netbanking/dashboard" }); },
});
