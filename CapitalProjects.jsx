import React from "react";
import PageHeader from "@/components/PageHeader";
import { capitalProjects, formatUSD } from "@/lib/historicalData";
import { HardHat, CheckCircle2, Clock, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Planning: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function CapitalProjects() {
  const totalBudget = capitalProjects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = capitalProjects.reduce((s, p) => s + p.spent, 0);
  const completed = capitalProjects.filter((p) => p.status === "Completed").length;
  const inProgress = capitalProjects.filter((p) => p.status === "In Progress").length;

  return (
    <div>
      <PageHeader title="Capital Projects Tracker" subtitle="Major infrastructure & building investments" icon={HardHat} accent="amber" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Budget</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatUSD(totalBudget)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Spent to Date</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatUSD(totalSpent)}</p>
          <p className="text-[11px] text-slate-500">{Math.round((totalSpent / totalBudget) * 100)}% of budget</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">In Progress</p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-blue-600"><Clock className="h-4 w-4" />{inProgress}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Completed</p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" />{completed}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {capitalProjects.map((p) => {
          const pct = Math.round((p.spent / p.budget) * 100);
          return (
            <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.dept} · Started {p.start} · ETA {p.eta}</p>
                </div>
                <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", STATUS_STYLES[p.status])}>
                  {p.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Budget</p>
                  <p className="font-medium text-slate-900">{formatUSD(p.budget)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Spent</p>
                  <p className="font-medium text-slate-900">{formatUSD(p.spent)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Remaining</p>
                  <p className="font-medium text-slate-900">{formatUSD(p.budget - p.spent)}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", p.status === "Completed" ? "bg-emerald-500" : "bg-blue-500")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
