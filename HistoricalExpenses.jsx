import React, { useMemo } from "react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, ZAxis } from "recharts";
import PageHeader from "@/components/PageHeader";
import { historicalExpenses, expenseMilestones, formatUSD } from "@/lib/historicalData";
import { History, TrendingUp, TrendingDown, Calendar } from "lucide-react";

const fmt = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
};

export default function HistoricalExpenses() {
  const data = historicalExpenses;

  // simple linear regression for trend line across the century
  const trendPoints = useMemo(() => {
    const n = data.length;
    const xs = data.map((d) => d.year);
    const ys = data.map((d) => d.totalExpense);
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - meanX) * (ys[i] - meanY);
      den += (xs[i] - meanX) ** 2;
    }
    const slope = num / den;
    const intercept = meanY - slope * meanX;
    return [
      { year: 1926, trend: Math.round(intercept + slope * 1926) },
      { year: 2026, trend: Math.round(intercept + slope * 2026) },
    ];
  }, [data]);

  const first = data[0];
  const last = data[data.length - 1];
  const max = data.reduce((m, d) => (d.totalExpense > m.totalExpense ? d : m), data[0]);
  const min = data.reduce((m, d) => (d.totalExpense < m.totalExpense ? d : m), data[0]);

  return (
    <div>
      <PageHeader
        title="Historical Expenses · 1926–2026"
        subtitle="A century of borough spending, with trend line and milestone events"
        icon={History}
        accent="slate"
      />

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">1926 Spending</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{fmt(first.totalExpense)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">2026 Projected</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{fmt(last.totalExpense)}</p>
          <p className="mt-0.5 text-[11px] text-emerald-600">+{Math.round((last.totalExpense / first.totalExpense - 1) * 100)}% over century</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Peak Year</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{max.year}</p>
          <p className="text-[11px] text-slate-500">{fmt(max.totalExpense)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Trough Year</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{min.year}</p>
          <p className="text-[11px] text-slate-500">{fmt(min.totalExpense)}</p>
        </div>
      </div>

      {/* Scatter + trend chart */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Annual Total Expenses (1926–2026)</h3>
        <p className="text-xs text-slate-500">Each point = one fiscal year; line = century-long trend</p>
        <div className="mt-4 h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 10, right: 20, top: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="year"
                type="number"
                domain={[1926, 2026]}
                tick={{ fontSize: 11 }}
                tickCount={11}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} width={70} />
              <ZAxis range={[60, 60]} />
              <Tooltip
                labelFormatter={(y) => `Year ${y}`}
                formatter={(v) => [fmt(v), "Total Expense"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {expenseMilestones.map((m) => (
                <ReferenceLine key={m.year} x={m.year} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: m.year, fontSize: 9, fill: "#64748b", position: "top" }} />
              ))}
              <Scatter dataKey="totalExpense" fill="#2563eb" name="Annual Expense" />
              <Line data={trendPoints} dataKey="trend" type="monotone" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Century Trend" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Calendar className="h-4 w-4 text-slate-400" /> Key Milestones
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expenseMilestones.map((m) => (
            <div key={m.year} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{m.year}</span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">{m.event}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{m.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Era commentary */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <TrendingUp className="h-4 w-4" /> Growth Eras
          </div>
          <ul className="mt-3 space-y-2 text-xs text-emerald-800/80">
            <li><strong>1946–1969:</strong> Postwar suburban expansion drove the fastest sustained growth.</li>
            <li><strong>1970–1980:</strong> Inflation era — nominal spending accelerated sharply.</li>
            <li><strong>2020:</strong> COVID-19 triggered emergency spending that has since stabilized.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-800">
            <TrendingDown className="h-4 w-4" /> Contraction Eras
          </div>
          <ul className="mt-3 space-y-2 text-xs text-rose-800/80">
            <li><strong>1930–1933:</strong> Great Depression cut spending by over 35%.</li>
            <li><strong>2008–2009:</strong> Great Recession forced back-to-back spending cuts.</li>
            <li><strong>1942–1945:</strong> WWII era kept growth flat despite population shifts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
