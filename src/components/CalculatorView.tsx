"use client";

import { useMemo, useState, type RefObject } from "react";
import { useAppContext } from "@/context/AppContext";
import { calcolaBustaPaga } from "@/lib/taxEngine";
import { CalculatorInput } from "@/lib/types";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import MetricsCards from "@/components/calculator/MetricsCards";
import RalColumnChart from "@/components/calculator/RalColumnChart";
import ComparisonChart from "@/components/calculator/ComparisonChart";
import BreakdownTable from "@/components/calculator/BreakdownTable";
import PromoSection from "@/components/jethr/PromoSection";
import JetHrPixelLogo from "@/components/jethr/JetHrPixelLogo";
import { CheckCircle2 } from "lucide-react";

interface CalculatorViewProps {
  initialInput: CalculatorInput;
  columnRef?: RefObject<HTMLDivElement | null>;
  /** Se false, la colonna RAL resta a zero (in attesa del reveal della
   * transizione); passare a true fa partire la sua animazione di crescita. */
  chartRevealed?: boolean;
}

export default function CalculatorView({ initialInput, columnRef, chartRevealed }: CalculatorViewProps) {
  const { settings } = useAppContext();
  const [input, setInput] = useState<CalculatorInput>(initialInput);

  const result = useMemo(() => calcolaBustaPaga(input, settings), [input, settings]);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Calcolo elaborato da Jet HR
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Calcolatore Busta Paga
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Stima netto mensile, netto annuale e costo azienda a partire dalla RAL.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-6">
          <CalculatorForm input={input} onChange={setInput} />
          <JetHrPixelLogo />
        </div>
        <div className="space-y-6">
          <MetricsCards result={result} />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RalColumnChart
              result={result}
              columnRef={columnRef}
              revealed={chartRevealed ?? true}
            />
            <ComparisonChart input={input} settings={settings} />
          </div>
        </div>
      </div>

      <BreakdownTable result={result} />

      <PromoSection />
    </div>
  );
}
