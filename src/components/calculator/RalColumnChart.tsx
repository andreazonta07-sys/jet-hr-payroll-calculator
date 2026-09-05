"use client";

import { useEffect, useState, type Ref } from "react";
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

const STAGGER_MS = 260;
const GROWTH_SEGMENT_MS = 700;
const GROWTH_TOTAL_MS = STAGGER_MS * (SEGMENTS.length - 1) + GROWTH_SEGMENT_MS;
const OVERLAY_FADE_MS = 260;

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

interface RalColumnChartProps {
  result: CalculationResult;
  /** Riferimento al riquadro della colonna, usato per ancorare l'animazione barra→colonna al caricamento. */
  columnRef?: Ref<HTMLDivElement>;
  /** Se false, la colonna resta coperta da un overlay a zero (in attesa del
   * reveal della transizione). Passare a true fa crescere l'overlay dal basso
   * con lo stesso stagger dell'originale, poi lo dissolve rivelando Recharts —
   * che resta sempre statico (isAnimationActive=false): con più Bar aventi
   * animationBegin scaglionati, l'animazione nativa di react-smooth si blocca
   * in modo intermittente in questa combinazione di versioni, quindi la
   * crescita "vera" la pilotiamo qui a mano con lo stesso approccio rAF già
   * usato per il ghost della transizione. */
  revealed?: boolean;
}

export default function RalColumnChart({ result, columnRef, revealed = true }: RalColumnChartProps) {
  const chartData = [
    SEGMENTS.reduce<Record<string, number | string>>(
      (acc, seg) => {
        acc[seg.key] = result[seg.key];
        return acc;
      },
      { name: "RAL" }
    ),
  ];

  const [growthDone, setGrowthDone] = useState(revealed);
  const [growProgress, setGrowProgress] = useState<number[]>(() => SEGMENTS.map(() => (revealed ? 1 : 0)));

  useEffect(() => {
    if (!revealed || growthDone) return;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const elapsed = now - start;
      setGrowProgress(
        SEGMENTS.map((_, i) => {
          const local = elapsed - i * STAGGER_MS;
          const t = Math.min(1, Math.max(0, local / GROWTH_SEGMENT_MS));
          return easeOutQuart(t);
        })
      );
      if (elapsed < GROWTH_TOTAL_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        setGrowProgress(SEGMENTS.map(() => 1));
        setGrowthDone(true);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, growthDone]);

  const total = result.ral;
  const showGrowthOverlay = revealed ? !growthDone : true;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">La Colonna della RAL</h3>
      <p className="mt-1 text-sm text-slate-500">
        Composizione al 100% della RAL: {formatEuro(result.ral)}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr]">
        <div ref={columnRef} className="relative mx-auto h-96 w-full max-w-[180px]">
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
              {SEGMENTS.map((seg, i) => (
                <Bar
                  key={seg.key}
                  dataKey={seg.key}
                  stackId="ral"
                  fill={seg.color}
                  radius={i === SEGMENTS.length - 1 ? [10, 10, 0, 0] : 0}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>

          {showGrowthOverlay && (
            <div
              className="pointer-events-none absolute inset-0 flex flex-col-reverse overflow-hidden rounded-t-[10px] bg-white"
              style={{ opacity: revealed && growthDone ? 0 : 1, transition: `opacity ${OVERLAY_FADE_MS}ms ease-out` }}
            >
              {SEGMENTS.map((seg, i) => {
                const pct = total > 0 ? (result[seg.key] / total) * 100 : 0;
                return (
                  <div
                    key={seg.key}
                    style={{
                      width: "100%",
                      height: `${pct * growProgress[i]}%`,
                      background: seg.color,
                      borderRadius: i === SEGMENTS.length - 1 ? "10px 10px 0 0" : 0,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div key={revealed ? "revealed" : "pending"} className="space-y-2">
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
