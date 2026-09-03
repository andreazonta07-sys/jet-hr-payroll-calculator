"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculationResult } from "@/lib/types";
import { formatEuro, formatEuroDecimal, formatPercent } from "@/lib/taxEngine";

const SEGMENTS = [
  { key: "nettoAnnuale", label: "Netto (Stipendio)", color: "#4F46E5" },
  { key: "inpsDipendente", label: "INPS Dipendente", color: "#F59E0B" },
  { key: "irpefNetta", label: "IRPEF Netta", color: "#EF4444" },
  { key: "addizionaleRegionale", label: "Addizionale Regionale", color: "#EC4899" },
  { key: "addizionaleComunale", label: "Addizionale Comunale", color: "#8B5CF6" },
] as const;

export default function RalColumnChart({ result }: { result: CalculationResult }) {
  const chartData = [
    SEGMENTS.reduce<Record<string, number | string>>(
      (acc, seg) => {
        acc[seg.key] = result[seg.key];
        return acc;
      },
      { name: "RAL" }
    ),
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">La Colonna della RAL</h3>
      <p className="mt-1 text-sm text-slate-500">
        Composizione al 100% della RAL: {formatEuro(result.ral)}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-[160px_1fr]">
        <div className="mx-auto h-72 w-full max-w-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, result.ral]} />
              <Tooltip formatter={(value) => formatEuroDecimal(Number(value))} />
              {SEGMENTS.map((seg) => (
                <Bar key={seg.key} dataKey={seg.key} stackId="ral" fill={seg.color} radius={0} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {SEGMENTS.map((seg) => {
            const value = result[seg.key];
            return (
              <div
                key={seg.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm text-slate-700">{seg.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatEuro(value)}</p>
                  <p className="text-xs text-slate-400">{formatPercent(value, result.ral)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
