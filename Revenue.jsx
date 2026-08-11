import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import PageHeader from "@/components/PageHeader";
import { revenueSources, revenueTrend, formatUSD } from "@/lib/historicalData";
import { DollarSign, TrendingUp } from "lucide-react";

const COLORS = ["#0f172a", "#2563eb", "#0ea5e9", "#14b8a6", "#f59e0b", "#ec4899", "#8b5cf6", "#64748b"];

export default function Revenue() {
  const total = revenueSources.reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <PageHeader title="Revenue Dashboard" subtitle="Where borough income comes from" icon={DollarSign} accent="emerald" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Revenue</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatUSD(total)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Property Tax Share</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">58%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Top Growing Source</p>
          <p className="mt-1 text-lg font-semibold text-emerald-600">Interest +45%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Declining Source</p>
          <p className="mt-1 text-lg font-semibold text-rose-600">Court Fines -4%</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Revenue Mix</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueSources} dataKey="amount" nameKey="source" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={2}>
                  {revenueSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Revenue Trend (Millions USD)</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
                <Tooltip formatter={(v) => `$${v}M`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="property" stackId="a" fill="#0f172a" name="Property Tax" radius={[0, 0, 0, 0]} />
                <Bar dataKey="state" stackId="a" fill="#2563eb" name="State Aid" />
                <Bar dataKey="other" stackId="a" fill="#14b8a6" radius={[6, 6, 0, 0]} name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Revenue Sources</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">% of Total</th>
                <th className="pb-2 font-medium">YoY Trend</th>
              </tr>
            </thead>
            <tbody>
              {revenueSources.map((r) => (
                <tr key={r.source} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-900">{r.source}</td>
                  <td className="py-3 text-slate-600">{formatUSD(r.amount)}</td>
                  <td className="py-3 text-slate-600">{r.pct}%</td>
                  <td className="py-3">
                    <span className={r.trend.startsWith("-") ? "text-rose-600" : "text-emerald-600"}>
                      <TrendingUp className={`mr-1 inline h-3 w-3 ${r.trend.startsWith("-") ? "rotate-180" : ""}`} />{r.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
