"use client";

import { CalendarDays, PiggyBank, Wallet } from "lucide-react";
import { CalculationResult } from "@/lib/types";
import { formatEuro } from "@/lib/taxEngine";

export default function MetricsCards({ result }: { result: CalculationResult }) {
  const cards = [
    {
      label: "Netto Mensile",
      value: formatEuro(result.nettoMensile),
      icon: CalendarDays,
      accent: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Netto Annuale",
      value: formatEuro(result.nettoAnnuale),
      icon: Wallet,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Totale Trattenute e Tasse",
      value: formatEuro(result.totaleTrattenute),
      icon: PiggyBank,
      accent: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
