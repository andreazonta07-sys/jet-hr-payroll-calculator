"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculatorInput, TaxSettings, TipoContratto } from "@/lib/types";
import { calcolaBustaPaga, formatEuro } from "@/lib/taxEngine";

interface ComparisonChartProps {
  input: CalculatorInput;
  settings: TaxSettings;
}

const TIPI_CONTRATTO: TipoContratto[] = [
  "Tempo Indeterminato",
  "Tempo Determinato",
  "Apprendistato",
  "Contratto a Chiamata",
];

/** Etichette brevi per l'asse X (il nome completo resta nel tooltip). */
const SHORT_LABELS: Record<string, string> = {
  "Tempo Indeterminato": "T. Indet.",
  "Tempo Determinato": "T. Determ.",
  Apprendistato: "Apprend.",
  "Contratto a Chiamata": "A Chiamata",
};

export default function ComparisonChart({ input, settings }: ComparisonChartProps) {
  const data = TIPI_CONTRATTO.map((tipoContratto) => {
    const result = calcolaBustaPaga({ ...input, tipoContratto }, settings);
    return {
      name: tipoContratto,
      "Netto Annuale": Math.round(result.nettoAnnuale),
      "Costo Azienda": Math.round(result.costoAzienda),
      isCurrent: tipoContratto === input.tipoContratto,
    };
  });

  const attuale = data.find((d) => d.isCurrent);
  const apprendistato = data.find((d) => d.name === "Apprendistato");
  const differenzaApprendistato =
    attuale && apprendistato && attuale.name !== "Apprendistato"
      ? attuale["Netto Annuale"] - apprendistato["Netto Annuale"]
      : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">Confronto tra Tipi di Contratto</h3>
      <p className="mt-1 text-sm text-slate-500">
        Netto annuale e costo azienda a parità di RAL ({formatEuro(input.ral)}), per ciascuna tipologia
        contrattuale. Il tuo contratto attuale è evidenziato.
      </p>

      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              tickFormatter={(v) => SHORT_LABELS[v] ?? v}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <YAxis tickFormatter={(v) => `€${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatEuro(Number(value))} />
            <Legend />
            <Bar dataKey="Netto Annuale" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.isCurrent ? "#4F46E5" : "#A5B4FC"} />
              ))}
            </Bar>
            <Bar dataKey="Costo Azienda" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {differenzaApprendistato !== null && differenzaApprendistato !== 0 && (
        <p className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
          {differenzaApprendistato > 0
            ? `Con l'Apprendistato il dipendente riceverebbe ${formatEuro(differenzaApprendistato)} in meno di netto annuale rispetto al tuo contratto attuale, a parità di costo per l'azienda.`
            : `Con l'Apprendistato il dipendente riceverebbe ${formatEuro(-differenzaApprendistato)} in più di netto annuale rispetto al tuo contratto attuale, a parità di costo per l'azienda.`}
        </p>
      )}
    </div>
  );
}
