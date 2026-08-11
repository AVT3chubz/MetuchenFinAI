import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import PageHeader from "@/components/PageHeader";
import { publicSafetyStats } from "@/lib/historicalData";
import { Shield } from "lucide-react";

const PIE_COLORS = ["#0f172a", "#2563eb", "#0ea5e9", "#14b8a6", "#f59e0b", "#94a3b8"];

export default function PublicSafety() {
  return (
    <div>
      <PageHeader title="Public Safety" subtitle="Police & fire operations overview" icon={Shield} accent="rose" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Police Officers</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicSafetyStats.officers}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Firefighters</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicSafetyStats.firefighters}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Calls (FY2024)</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicSafetyStats.calls2024.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Avg Response</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publicSafetyStats.avgResponseMin} min</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Incidents by Type (FY2024)</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={publicSafetyStats.incidentsByType} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={2}>
                  {publicSafetyStats.incidentsByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Call Volume Trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={publicSafetyStats.callsTrend} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="police" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} name="Police" />
                <Line type="monotone" dataKey="fire" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} name="Fire" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Incident Breakdown</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Count</th>
                <th className="pb-2 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {publicSafetyStats.incidentsByType.map((it) => (
                <tr key={it.type} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-900">{it.type}</td>
                  <td className="py-3 text-slate-600">{it.count.toLocaleString()}</td>
                  <td className="py-3 text-slate-600">{Math.round((it.count / publicSafetyStats.calls2024) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
