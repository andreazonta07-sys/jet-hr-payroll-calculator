"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculationResult } from "@/lib/types";
import { formatEuro, formatEuroDecimal, formatPercent } from "@/lib/taxEngine";

export const SEGMENTS = [
  { key: "nettoAnnuale", label: "Netto (Stipendio)", color: "#4F46E5" },
  { key: "inpsDipendente", label: "INPS Dipendente", color: "#F59E0B" },
  { key: "irpefNetta", label: "IRPEF Netta", color: "#EF4444" },
  { key: "addizionaleRegionale", label: "Addizionale Regionale", color: "#EC4899" },
  { key: "addizionaleComunale", label: "Addizionale Comunale", color: "#8B5CF6" },
] as const;

const OVERLAY_FADE_MS = 260;

interface RalColumnChartProps {
  result: CalculationResult;
  /** Se false, la colonna resta coperta da un overlay bianco (in attesa del
   * reveal della transizione di caricamento). Passare a true dissolve subito
   * l'overlay rivelando Recharts già alla sua dimensione definitiva — niente
   * ri-crescita dal basso qui: quella è già stata mostrata durante il
   * caricamento, mostrarla due volte darebbe l'impressione di uno scatto. */
  revealed?: boolean;
}

export default function RalColumnChart({ result, revealed = true }: RalColumnChartProps) {
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">La Colonna della RAL</h3>
      <p className="mt-1 text-sm text-slate-500">
        Composizione al 100% della RAL: {formatEuro(result.ral)}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr]">
        <div className="relative mx-auto h-96 w-full max-w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="15%">
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, result.ral]} />
              <Tooltip
                formatter={(value) => formatEuroDecimal(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 8px 24px -8px rgba(15, 23, 42, 0.18)",
                  fontSize: 13,
                }}
                cursor={{ fill: "rgba(79, 70, 229, 0.04)" }}
              />
              {SEGMENTS.map((seg, i) => {
                let radius: [number, number, number, number] = [0, 0, 0, 0];
                if (i === SEGMENTS.length - 1) radius = [10, 10, 0, 0];
                if (i === 0) radius = [radius[0], radius[1], 10, 10];
                return (
                  <Bar
                    key={seg.key}
                    dataKey={seg.key}
                    stackId="ral"
                    fill={seg.color}
                    radius={radius}
                    isAnimationActive={false}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>

          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px] bg-white"
            style={{ opacity: revealed ? 0 : 1, transition: `opacity ${OVERLAY_FADE_MS}ms ease-out` }}
          />
        </div>

        <div key={revealed ? "revealed" : "pending"} className="flex h-full flex-col justify-between gap-2">
          {[...SEGMENTS].reverse().map((seg, i) => {
            const value = result[seg.key];
            return (
              <div
                key={seg.key}
                style={{ animationDelay: `${i * 70}ms` }}
                className="animate-fade-in-up flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 transition-colors hover:bg-slate-100"
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
