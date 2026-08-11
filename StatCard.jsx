import React from "react";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, sublabel, trend, icon: Icon, accent = "slate" }) {
  const accentMap = {
    slate: "from-slate-700 to-slate-900",
    emerald: "from-emerald-600 to-emerald-800",
    amber: "from-amber-500 to-amber-700",
    indigo: "from-indigo-500 to-indigo-700",
    rose: "from-rose-500 to-rose-700",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white", accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend && (
        <p className="mt-3 text-xs font-medium text-emerald-600">{trend}</p>
      )}
    </div>
  );
}
