import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import PageHeader from "@/components/PageHeader";
import { populationHistory, demographics } from "@/lib/historicalData";
import { Users } from "lucide-react";

const AGE_COLORS = ["#0ea5e9", "#2563eb", "#0f172a", "#64748b", "#94a3b8"];

export default function Demographics() {
  return (
    <div>
      <PageHeader title="Demographics & Population" subtitle="Community profile and growth history" icon={Users} accent="blue" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Population</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{demographics.population.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Median Age</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{demographics.medianAge}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Median Income</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">${demographics.medianHouseholdIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Households</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{demographics.households.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">Population Growth (Census decade)</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={populationHistory} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="decade" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="population" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Age Distribution</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={demographics.ageDistribution} dataKey="pct" nameKey="range" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={2}>
                  {demographics.ageDistribution.map((_, i) => <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {demographics.ageDistribution.map((a, i) => (
          <div key={a.range} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: AGE_COLORS[i % AGE_COLORS.length] }} />
              <p className="text-xs uppercase tracking-wider text-slate-500">Age {a.range}</p>
            </div>
            <p className="mt-1 text-lg font-semibold text-slate-900">{a.pct}%</p>
            <p className="text-[11px] text-slate-500">~{Math.round((a.pct / 100) * demographics.population).toLocaleString()} residents</p>
          </div>
        ))}
      </div>
    </div>
  );
}
