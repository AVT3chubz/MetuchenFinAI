import React from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import PageHeader from "@/components/PageHeader";
import { departmentScorecards, formatUSD } from "@/lib/historicalData";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

function scoreColor(pct) {
  if (pct >= 85) return "text-emerald-600";
  if (pct >= 70) return "text-amber-600";
  return "text-rose-600";
}

function efficiencyBg(pct) {
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-rose-500";
}

export default function DepartmentScorecards() {
  const radarData = departmentScorecards.map((d) => ({
    department: d.department.length > 12 ? d.department.slice(0, 11) + "…" : d.department,
    Efficiency: d.efficiency,
    OnTime: d.onTimePct,
  }));

  return (
    <div>
      <PageHeader title="Department Scorecards" subtitle="Performance & efficiency by department" icon={Gauge} accent="indigo" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Efficiency vs. On-Time Delivery</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={110}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="department" tick={{ fontSize: 10 }} />
                <Radar name="Efficiency" dataKey="Efficiency" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                <Radar name="On-Time %" dataKey="OnTime" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Budget Utilization</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentScorecards.map((d) => ({ ...d, utilization: Math.round((d.spent / d.budget) * 100) }))} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="%" domain={[0, 120]} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 9 }} width={120} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="utilization" radius={[0, 6, 6, 0]}>
                  {departmentScorecards.map((d, i) => (
                    <Cell key={i} fill={d.spent > d.budget ? "#ef4444" : "#2563eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departmentScorecards.map((d) => {
          const over = d.spent > d.budget;
          return (
            <div key={d.department} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">{d.department}</h3>
              <p className="text-xs text-slate-500">{d.staff} staff</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Budget</p>
                  <p className="font-medium text-slate-900">{formatUSD(d.budget)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Spent</p>
                  <p className={cn("font-medium", over ? "text-rose-600" : "text-slate-900")}>{formatUSD(d.spent)}</p>
                </div>
                <div>
                  <p className="text-slate-500">On-time</p>
                  <p className={cn("font-medium", scoreColor(d.onTimePct))}>{d.onTimePct}%</p>
                </div>
                <div>
                  <p className="text-slate-500">Efficiency</p>
                  <p className={cn("font-medium", scoreColor(d.efficiency))}>{d.efficiency}%</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", efficiencyBg(d.efficiency))} style={{ width: `${d.efficiency}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
