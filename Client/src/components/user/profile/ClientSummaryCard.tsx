import { ClientSummary } from "@/types/user.type";
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function ClientSummaryCard({ summary, owner = false }: { summary: ClientSummary; owner?: boolean }) {
  const completed = summary.projectsCompleted ?? summary.completedProjects ?? 0;
  const since = summary.memberSince
    ? new Date(summary.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  const stats: [string, string][] = [
    ["Projects completed", String(completed)],
    ["Reviews given", String(summary.reviewsGiven)],
    ["Average rating given", summary.averageRatingGiven !== null ? `${summary.averageRatingGiven} / 5` : "—"],
    ["Total spent", owner && summary.totalSpent !== undefined ? money(summary.totalSpent) : summary.totalSpentRange],
  ];
  if (owner) {
    stats.push(["Active projects", String(summary.activeProjects ?? 0)]);
    stats.push(["In escrow", money(summary.inEscrow ?? 0)]);
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase">Member since {since}</span>
        {summary.paymentVerified ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ Payment verified
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-gray-600 border bg-red-300 border-red-600">
            Payment not verified yet
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-base font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}