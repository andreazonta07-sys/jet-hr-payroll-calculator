"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CalculationResult } from "@/lib/types";
import { formatEuroDecimal } from "@/lib/taxEngine";

export default function BreakdownTable({ result }: { result: CalculationResult }) {
  const [open, setOpen] = useState(true);

  const rows: { label: string; value: number; isTotal?: boolean; isDeduction?: boolean }[] = [
    { label: "RAL Lorda", value: result.ral },
    { label: "− INPS Dipendente", value: -result.inpsDipendente, isDeduction: true },
    { label: "= Imponibile IRPEF", value: result.imponibileIrpef, isTotal: true },
    { label: "IRPEF Lorda", value: result.irpefLorda },
    { label: "− Detrazioni Lavoro Dipendente", value: -result.detrazioniLavoro, isDeduction: true },
    { label: "= IRPEF Netta", value: result.irpefNetta, isTotal: true },
    { label: "− Addizionale Regionale", value: -result.addizionaleRegionale, isDeduction: true },
    { label: "− Addizionale Comunale", value: -result.addizionaleComunale, isDeduction: true },
    { label: "= Netto Finale (Annuale)", value: result.nettoAnnuale, isTotal: true },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6"
      >
        <div>
          <h3 className="text-base font-semibold text-slate-900">Dettaglio Calcolo Passo per Passo</h3>
          <p className="mt-1 text-sm text-slate-500">Da RAL lorda a netto finale, voce per voce</p>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 sm:px-6">
          <table className="mt-3 w-full text-sm">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className={row.isTotal ? "border-t border-slate-200" : ""}>
                  <td
                    className={`py-2.5 pr-4 ${
                      row.isTotal ? "font-semibold text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {row.label}
                  </td>
                  <td
                    className={`py-2.5 text-right tabular-nums ${
                      row.isTotal
                        ? "font-semibold text-slate-900"
                        : row.isDeduction
                        ? "text-rose-600"
                        : "text-slate-700"
                    }`}
                  >
                    {formatEuroDecimal(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
