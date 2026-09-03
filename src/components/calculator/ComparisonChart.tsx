"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculationResult, HistoryRecord } from "@/lib/types";
import { calcolaMediaNetto } from "@/lib/mockData";
import { formatEuro } from "@/lib/taxEngine";

interface ComparisonChartProps {
  result: CalculationResult;
  history: HistoryRecord[];
}

export default function ComparisonChart({ result, history }: ComparisonChartProps) {
  const mediaStorico = calcolaMediaNetto(history);

  const data = [
    {
      name: "Confronto",
      "Netto Attuale": Math.round(result.nettoAnnuale),
      "Media Storico": Math.round(mediaStorico),
      "Costo Azienda": Math.round(result.costoAzienda),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">Confronto con le Medie &amp; Costo Azienda</h3>
      <p className="mt-1 text-sm text-slate-500">
        Netto calcolato vs media storico simulazioni vs costo totale per l&apos;azienda (~
        {result.costoAzienda > 0 ? (result.costoAzienda / result.ral).toFixed(2) : "1.30"}x RAL)
      </p>

      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `€${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatEuro(Number(value))} />
            <Legend />
            <Bar dataKey="Netto Attuale" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Media Storico" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Costo Azienda" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
