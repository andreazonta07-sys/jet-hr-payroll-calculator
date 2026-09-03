"use client";

import { CalendarDays, PiggyBank, Wallet } from "lucide-react";
import { CalculationResult } from "@/lib/types";
import { formatEuro } from "@/lib/taxEngine";
import { useCountUp } from "@/lib/useCountUp";

const CARD_DEFS = [
  {
    key: "nettoMensile" as const,
    label: "Netto Mensile",
    icon: CalendarDays,
    accent: "bg-indigo-50 text-indigo-700",
    ring: "hover:border-indigo-200 hover:shadow-indigo-100",
  },
  {
    key: "nettoAnnuale" as const,
    label: "Netto Annuale",
    icon: Wallet,
    accent: "bg-emerald-50 text-emerald-700",
    ring: "hover:border-emerald-200 hover:shadow-emerald-100",
  },
  {
    key: "totaleTrattenute" as const,
    label: "Totale Trattenute e Tasse",
    icon: PiggyBank,
    accent: "bg-rose-50 text-rose-700",
    ring: "hover:border-rose-200 hover:shadow-rose-100",
  },
];

export default function MetricsCards({ result }: { result: CalculationResult }) {
  const nettoMensile = useCountUp(result.nettoMensile);
  const nettoAnnuale = useCountUp(result.nettoAnnuale);
  const totaleTrattenute = useCountUp(result.totaleTrattenute);

  const values: Record<(typeof CARD_DEFS)[number]["key"], number> = {
    nettoMensile,
    nettoAnnuale,
    totaleTrattenute,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CARD_DEFS.map((card) => (
        <div
          key={card.key}
          className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${card.ring}`}
        >
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.accent} transition-transform duration-300 group-hover:scale-110`}>
            <card.icon className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {formatEuro(values[card.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
