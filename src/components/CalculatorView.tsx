"use client";

import { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { calcolaBustaPaga } from "@/lib/taxEngine";
import { CalculatorInput } from "@/lib/types";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import MetricsCards from "@/components/calculator/MetricsCards";
import RalColumnChart from "@/components/calculator/RalColumnChart";
import ComparisonChart from "@/components/calculator/ComparisonChart";
import BreakdownTable from "@/components/calculator/BreakdownTable";
import PromoSection from "@/components/jethr/PromoSection";

const DEFAULT_INPUT: CalculatorInput = {
  ral: 35000,
  tipoContratto: "Tempo Indeterminato",
  citta: "Milano",
  mensilita: 13,
  giorniLavorati: 365,
};

export default function CalculatorView() {
  const { settings, history } = useAppContext();
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);

  const result = useMemo(() => calcolaBustaPaga(input, settings), [input, settings]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Calcolatore Busta Paga
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Stima netto mensile, netto annuale e costo azienda a partire dalla RAL.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <CalculatorForm input={input} onChange={setInput} />
        <div className="space-y-6">
          <MetricsCards result={result} />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RalColumnChart result={result} />
            <ComparisonChart result={result} history={history} />
          </div>
          <BreakdownTable result={result} />
        </div>
      </div>

      <PromoSection />
    </div>
  );
}
