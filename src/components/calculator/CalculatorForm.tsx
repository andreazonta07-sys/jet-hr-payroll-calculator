"use client";

import { CITTA_OPTIONS } from "@/lib/defaultSettings";
import { CalculatorInput, Citta, TipoContratto } from "@/lib/types";

interface CalculatorFormProps {
  input: CalculatorInput;
  onChange: (input: CalculatorInput) => void;
}

const MIN_RAL = 15000;
const MAX_RAL = 120000;

export default function CalculatorForm({ input, onChange }: CalculatorFormProps) {
  function patch(partial: Partial<CalculatorInput>) {
    onChange({ ...input, ...partial });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Dati per il calcolo</h2>
      <p className="mt-1 text-sm text-slate-500">Inserisci i parametri del contratto per stimare la busta paga.</p>

      <div className="mt-5 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="ral" className="text-sm font-medium text-slate-700">
              RAL — Retribuzione Annua Lorda
            </label>
            <span className="text-sm font-semibold text-indigo-700">
              {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(input.ral)}
            </span>
          </div>
          <input
            id="ral"
            type="number"
            min={0}
            step={500}
            value={input.ral}
            onChange={(e) => patch({ ral: Number(e.target.value) || 0 })}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <input
            type="range"
            min={MIN_RAL}
            max={MAX_RAL}
            step={500}
            value={Math.min(Math.max(input.ral, MIN_RAL), MAX_RAL)}
            onChange={(e) => patch({ ral: Number(e.target.value) })}
            className="mt-3 w-full accent-indigo-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>€{MIN_RAL.toLocaleString("it-IT")}</span>
            <span>€{MAX_RAL.toLocaleString("it-IT")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tipoContratto" className="text-sm font-medium text-slate-700">
              Tipo Contratto
            </label>
            <select
              id="tipoContratto"
              value={input.tipoContratto}
              onChange={(e) => patch({ tipoContratto: e.target.value as TipoContratto })}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Tempo Indeterminato">Tempo Indeterminato</option>
              <option value="Tempo Determinato">Tempo Determinato</option>
            </select>
          </div>

          <div>
            <label htmlFor="citta" className="text-sm font-medium text-slate-700">
              Residenza / Comune
            </label>
            <select
              id="citta"
              value={input.citta}
              onChange={(e) => patch({ citta: e.target.value as Citta })}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {CITTA_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mensilita" className="text-sm font-medium text-slate-700">
              Numero Mensilità
            </label>
            <select
              id="mensilita"
              value={input.mensilita}
              onChange={(e) => patch({ mensilita: Number(e.target.value) as 13 | 14 })}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value={13}>13 mensilità</option>
              <option value={14}>14 mensilità</option>
            </select>
          </div>

          <div>
            <label htmlFor="giorniLavorati" className="text-sm font-medium text-slate-700">
              Giorni Lavorati nell&apos;Anno
            </label>
            <input
              id="giorniLavorati"
              type="number"
              min={1}
              max={365}
              value={input.giorniLavorati}
              onChange={(e) => patch({ giorniLavorati: Number(e.target.value) || 0 })}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
