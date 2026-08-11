import React, { useState } from "react";
import { Sparkles, Loader2, AlertCircle, TrendingUp, Lightbulb, ShieldAlert, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const IMPACT_STYLES = {
  High: "bg-rose-50 text-rose-700 border-rose-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const CAT_ICON = {
  Portfolio: TrendingUp,
  Expense: AlertCircle,
  Revenue: TrendingUp,
  Efficiency: Lightbulb,
  Risk: ShieldAlert,
};

export default function AIInsightsPanel({ portfolioSummary, expenseSummary }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setInsights(null);
    try {
      const prompt = `You are a municipal financial advisor analyzing the Town of Metuchen, NJ's finances.

PORTFOLIO SUMMARY:
${JSON.stringify(portfolioSummary, null, 2)}

EXPENSE SUMMARY:
${JSON.stringify(expenseSummary, null, 2)}

Generate 5 actionable insights that help the town make its expenses more effective and align the investment portfolio with spending needs. For each, provide a clear recommendation and estimate potential annual savings in USD where relevant. Focus on real, practical efficiency gains a small NJ municipality could achieve.`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  recommendation: { type: "string" },
                  impact: { type: "string", enum: ["High", "Medium", "Low"] },
                  category: { type: "string", enum: ["Portfolio", "Expense", "Revenue", "Efficiency", "Risk"] },
                  estimated_savings_usd: { type: "number" },
                },
                required: ["title", "summary", "recommendation", "impact", "category"],
              },
            },
          },
          required: ["insights"],
        },
      });

      const generated = res.insights || [];
      setInsights(generated);
      // Persist to DB for record-keeping
      if (generated.length) {
        await base44.entities.AIInsight.bulkCreate(generated);
      }
    } catch (e) {
      setError(e.message || "Unable to generate insights right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">AI Efficiency Advisor</h3>
            <p className="text-xs text-slate-500">Analyzes portfolio & expenses for savings</p>
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? "Analyzing..." : insights ? "Regenerate" : "Generate Insights"}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <p className="mt-3 text-xs text-slate-500">Reviewing financial patterns...</p>
        </div>
      )}

      {insights && !loading && (
        <div className="mt-4 space-y-3">
          {insights.map((ins, i) => {
            const Icon = CAT_ICON[ins.category] || Lightbulb;
            return (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{ins.title}</p>
                      <p className="mt-1 text-xs text-slate-600">{ins.summary}</p>
                    </div>
                  </div>
                  <span className={cn("flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", IMPACT_STYLES[ins.impact])}>
                    {ins.impact}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-2.5 text-xs text-slate-700">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{ins.recommendation}</span>
                </div>
                {ins.estimated_savings_usd > 0 && (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    Est. annual savings: ${ins.estimated_savings_usd.toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!insights && !loading && !error && (
        <p className="mt-4 text-xs text-slate-500">
          Click "Generate Insights" to run an AI analysis of Metuchen's portfolio against its expenses and receive efficiency recommendations.
        </p>
      )}
    </div>
  );
}
