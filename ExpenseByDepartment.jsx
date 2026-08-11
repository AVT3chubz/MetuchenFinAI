import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DEPT_COLORS = {
  "Public Safety": "#0f172a",
  "Public Works": "#2563eb",
  Education: "#0ea5e9",
  Administration: "#64748b",
  "Community Services": "#14b8a6",
  Utilities: "#f59e0b",
  "Capital Projects": "#8b5cf6",
  "Debt Service": "#ef4444",
  Recreation: "#ec4899",
  Health: "#10b981",
};

export default function ExpenseByDepartment({ expenses }) {
  const data = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + e.amount;
      return acc;
    }, {})
  )
    .map(([name, amount]) => ({ name, amount: amount / 1000000 }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Expenses by Department</h3>
      <p className="text-xs text-slate-500">Millions USD, current fiscal year</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
            <Tooltip formatter={(v) => `$${v.toFixed(2)}M`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={DEPT_COLORS[d.name] || "#64748b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
