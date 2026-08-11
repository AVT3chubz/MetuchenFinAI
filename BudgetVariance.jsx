import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import PageHeader from "@/components/PageHeader";
import { budgetVariance, formatUSD } from "@/lib/historicalData";
import { Scale, ArrowUp, ArrowDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BudgetVariance() {
  const rows = budgetVariance.map((d) => {
    const variance = d.actual - d.budget;
    const pct = Math.round((variance / d.budget) * 100);
    return { ...d, variance, pct };
  });
  const totalBudget = budgetVariance.reduce((s, d) => s + d.budget, 0);
  const totalActual = budgetVariance.reduce((s, d) => s + d.actual, 0);
  const overBudget = rows.filter((r) => r.variance > 0);
  const underBudget = rows.filter((r) => r.variance < 0);
  const onBudget = rows.filter((r) => r.variance === 0);

  const chartData = rows.map((r) => ({
    department: r.department,
    Budget: r.budget / 1000000,
    Actual: r.actual / 1000000,
  }));

  return (
    <div>
      <PageHeader title="Budget vs Actuals" subtitle="Variance analysis for current fiscal year" icon={Scale} accent="rose" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Budget</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatUSD(totalBudget)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Actual</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatUSD(totalActual)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Net Variance</p>
          <p className={cn("mt-1 text-lg font-semibold", totalActual - totalBudget > 0 ? "text-rose-600" : "text-emerald-600")}>
            {totalActual - totalBudget >= 0 ? "+" : ""}{formatUSD(totalActual - totalBudget)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Over Budget</p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-rose-600"><ArrowUp className="h-4 w-4" />{overBudget.length} depts</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Budget vs Actual by Department (Millions USD)</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="department" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip formatter={(v) => `$${v}M`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="Budget" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Budget" />
              <Bar dataKey="Actual" radius={[4, 4, 0, 0]} name="Actual">
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.Actual > d.Budget ? "#ef4444" : "#2563eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Variance Detail</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-2 font-medium">Department</th>
                <th className="pb-2 font-medium">Budget</th>
                <th className="pb-2 font-medium">Actual</th>
                <th className="pb-2 font-medium">Variance</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.department} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-900">{r.department}</td>
                  <td className="py-3 text-slate-600">{formatUSD(r.budget)}</td>
                  <td className="py-3 text-slate-600">{formatUSD(r.actual)}</td>
                  <td className={cn("py-3 font-medium", r.variance > 0 ? "text-rose-600" : r.variance < 0 ? "text-emerald-600" : "text-slate-600")}>
                    {r.variance >= 0 ? "+" : ""}{formatUSD(r.variance)} ({r.pct >= 0 ? "+" : ""}{r.pct}%)
                  </td>
                  <td className="py-3">
                    {r.variance > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700"><ArrowUp className="h-3 w-3" /> Over</span>
                    ) : r.variance < 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"><ArrowDown className="h-3 w-3" /> Under</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"><Check className="h-3 w-3" /> On budget</span>
                    )}
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
