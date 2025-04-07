import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/conversations/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <p className="text-slate-400">Pick a phone number!</p>;
}
