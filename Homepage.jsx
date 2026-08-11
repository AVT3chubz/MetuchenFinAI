import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import StatCard from "@/components/dashboard/StatCard";
import PortfolioAllocation from "@/components/dashboard/PortfolioAllocation";
import ExpenseByDepartment from "@/components/dashboard/ExpenseByDepartment";
import ExpenseTrend from "@/components/dashboard/ExpenseTrend";
import AIInsightsPanel from "@/components/dashboard/AIInsightsPanel";
import { Building2, Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function Home() {
  const [holdings, setHoldings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [h, e] = await Promise.all([
          base44.entities.PortfolioHolding.list(),
          base44.entities.MunicipalExpense.list("-fiscal_year", 200),
        ]);
        setHoldings(h);
        setExpenses(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const portfolioSummary = useMemo(() => {
    const totalValue = holdings.reduce((s, h) => s + (h.market_value || 0), 0);
    const totalYield = holdings.reduce((s, h) => s + (h.market_value || 0) * ((h.annual_yield_pct || 0) / 100), 0);
    const byClass = holdings.reduce((acc, h) => {
      acc[h.asset_class] = (acc[h.asset_class] || 0) + h.market_value;
      return acc;
    }, {});
    return { totalValue, annualIncome: totalYield, weightedYield: totalValue ? (totalYield / totalValue) * 100 : 0, byClass };
  }, [holdings]);

  const expenseSummary = useMemo(() => {
    const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const byDept = expenses.reduce((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + e.amount;
      return acc;
    }, {});
    const byYear = expenses.reduce((acc, e) => {
      acc[e.fiscal_year] = (acc[e.fiscal_year] || 0) + e.amount;
      return acc;
    }, {});
    const latestYear = Object.keys(byYear).sort().pop();
    return { total, byDept, byYear, latestYear, latestYearTotal: byYear[latestYear] || 0 };
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  const incomeVsExpense = portfolioSummary.annualIncome - (expenseSummary.latestYearTotal || 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Mayor's Console Overview</h1>
          <p className="text-sm text-slate-500">Portfolio & expense optimization · Borough of Metuchen, NJ</p>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live data
        </div>
      </div>

      <div>
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Portfolio Value"
            value={`$${(portfolioSummary.totalValue / 1000000).toFixed(2)}M`}
            sublabel="Total invested assets"
            icon={Wallet}
            accent="slate"
            trend={`+${portfolioSummary.weightedYield.toFixed(2)}% weighted yield`}
          />
          <StatCard
            label="Annual Investment Income"
            value={`$${portfolioSummary.annualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            sublabel="Projected from current holdings"
            icon={TrendingUp}
            accent="emerald"
          />
          <StatCard
            label={`Expenses ${expenseSummary.latestYear || ""}`}
            value={`$${((expenseSummary.latestYearTotal || 0) / 1000000).toFixed(2)}M`}
            sublabel="Total fiscal year spending"
            icon={Building2}
            accent="indigo"
          />
          <StatCard
            label="Income vs. Spending"
            value={`${incomeVsExpense >= 0 ? "+" : ""}$${(incomeVsExpense / 1000).toFixed(0)}K`}
            sublabel={incomeVsExpense >= 0 ? "Surplus coverage" : "Shortfall"}
            icon={incomeVsExpense >= 0 ? TrendingUp : TrendingDown}
            accent={incomeVsExpense >= 0 ? "emerald" : "rose"}
          />
        </div>

        {/* Charts row */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PortfolioAllocation holdings={holdings} />
          <ExpenseByDepartment expenses={expenses.filter((e) => e.fiscal_year === expenseSummary.latestYear)} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ExpenseTrend expenses={expenses} />
          <AIInsightsPanel portfolioSummary={portfolioSummary} expenseSummary={expenseSummary} />
        </div>

        {/* Holdings table */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Portfolio Holdings</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-2 pr-4 font-medium">Holding</th>
                  <th className="pb-2 pr-4 font-medium">Class</th>
                  <th className="pb-2 pr-4 font-medium">Value</th>
                  <th className="pb-2 pr-4 font-medium">Yield</th>
                  <th className="pb-2 pr-4 font-medium">YTD Return</th>
                  <th className="pb-2 font-medium">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-900">{h.asset_name}</p>
                      {h.ticker && <p className="text-xs text-slate-400">{h.ticker}</p>}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{h.asset_class}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">${(h.market_value / 1000).toFixed(0)}K</td>
                    <td className="py-3 pr-4 text-slate-600">{h.annual_yield_pct ? `${h.annual_yield_pct}%` : "—"}</td>
                    <td className="py-3 pr-4">
                      {h.ytd_return_pct != null ? (
                        <span className={h.ytd_return_pct >= 0 ? "text-emerald-600" : "text-rose-600"}>
                          {h.ytd_return_pct >= 0 ? "+" : ""}{h.ytd_return_pct}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-3 text-slate-600">{h.liquidity || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Borough of Metuchen, NJ · Municipal Finance Intelligence Platform · Built for operational efficiency
        </footer>
      </div>
    </div>
  );
}
