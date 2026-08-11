import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from "recharts";
import PageHeader from "@/components/PageHeader";
import { publicWorksStats } from "@/lib/historicalData";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const CONDITION_STYLES = {
  Good: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Fair: "bg-amber-50 text-amber-700 border-amber-200",
  Poor: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function PublicWorks() {
  return (
    <div>
      <PageHeader title="Public Works & Infrastructure" subtitle="Asset condition and maintenance operations" icon={Wrench} accent="amber" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Road Miles</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicWorksStats.roadMiles}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Paved</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicWorksStats.pavedPct}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Open Work Orders</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicWorksStats.openWorkOrders}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Avg Resolution</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicWorksStats.avgResolutionDays} days</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Infrastructure Condition</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={publicWorksStats.infrastructure} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                <YAxis type="category" dataKey="asset" tick={{ fontSize: 10 }} width={110} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]} fill="#2563eb" name="Condition %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Work Orders · Opened vs Closed</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={publicWorksStats.workOrdersTrend} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="opened" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Opened" />
                <Bar dataKey="closed" fill="#10b981" radius={[4, 4, 0, 0]} name="Closed" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Asset Condition Summary</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publicWorksStats.infrastructure.map((a) => (
            <div key={a.asset} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900">{a.asset}</p>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", CONDITION_STYLES[a.condition])}>
                  {a.condition}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{a.pct}% rated condition</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={cn("h-full rounded-full", a.condition === "Good" ? "bg-emerald-500" : a.condition === "Fair" ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
