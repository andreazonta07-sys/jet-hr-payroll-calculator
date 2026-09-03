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
import { Sparkles } from "lucide-react";

interface CalculatorViewProps {
  initialInput: CalculatorInput;
}

export default function CalculatorView({ initialInput }: CalculatorViewProps) {
  const { settings, history } = useAppContext();
  const [input, setInput] = useState<CalculatorInput>(initialInput);

  const result = useMemo(() => calcolaBustaPaga(input, settings), [input, settings]);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />
          Analisi AI completata
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
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
            <RalColumnChart result={result} animationKey="initial" />
            <ComparisonChart result={result} history={history} />
          </div>
          <BreakdownTable result={result} />
        </div>
      </div>

      <PromoSection />
    </div>
  );
}
