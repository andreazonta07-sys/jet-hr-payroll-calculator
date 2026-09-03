"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Download, Search, Trash2 } from "lucide-react";
import { HistoryRecord, TipoContratto } from "@/lib/types";
import { formatEuro } from "@/lib/taxEngine";

interface HistoryTableProps {
  history: HistoryRecord[];
  onDelete: (id: string) => void;
}

export default function HistoryTable({ history, onDelete }: HistoryTableProps) {
  const [search, setSearch] = useState("");
  const [contractFilter, setContractFilter] = useState<TipoContratto | "Tutti">("Tutti");

  const filtered = useMemo(() => {
    return history.filter((r) => {
      const matchesSearch =
        search.trim() === "" ||
        r.citta.toLowerCase().includes(search.toLowerCase()) ||
        String(r.ral).includes(search.trim());
      const matchesContract = contractFilter === "Tutti" || r.tipoContratto === contractFilter;
      return matchesSearch && matchesContract;
    });
  }, [history, search, contractFilter]);

  function exportCsv() {
    const header = [
      "Data",
      "RAL",
      "Tipo Contratto",
      "Città",
      "Mensilità",
      "Giorni Lavorati",
      "Netto Mensile",
      "Netto Annuale",
      "Totale Trattenute",
      "Simulato",
    ];
    const rows = filtered.map((r) => [
      new Date(r.createdAt).toLocaleDateString("it-IT"),
      r.ral,
      r.tipoContratto,
      r.citta,
      r.mensilita,
      r.giorniLavorati,
      r.result.nettoMensile.toFixed(2),
      r.result.nettoAnnuale.toFixed(2),
      r.result.totaleTrattenute.toFixed(2),
      r.simulato ? "Sì" : "No",
    ]);
    const csv = [header, ...rows].map((row) => row.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storico-calcoli-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Storico Calcoli Effettuati</h2>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Esporta CSV
        </button>
      </div>

      <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
        <AlertTriangle className="h-4 w-4" />
        ⚠️ Dati Simulati di Esempio
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per RAL o città…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={contractFilter}
          onChange={(e) => setContractFilter(e.target.value as TipoContratto | "Tutti")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="Tutti">Tutti i contratti</option>
          <option value="Tempo Indeterminato">Tempo Indeterminato</option>
          <option value="Tempo Determinato">Tempo Determinato</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2">Data</th>
              <th className="pb-2">RAL</th>
              <th className="pb-2">Contratto</th>
              <th className="pb-2">Città</th>
              <th className="pb-2">Netto Mensile</th>
              <th className="pb-2">Netto Annuale</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="py-2.5 pr-2 text-slate-500">{new Date(r.createdAt).toLocaleDateString("it-IT")}</td>
                <td className="py-2.5 pr-2 font-medium text-slate-800">{formatEuro(r.ral)}</td>
                <td className="py-2.5 pr-2 text-slate-600">{r.tipoContratto}</td>
                <td className="py-2.5 pr-2 text-slate-600">{r.citta}</td>
                <td className="py-2.5 pr-2 text-slate-600">{formatEuro(r.result.nettoMensile)}</td>
                <td className="py-2.5 pr-2 text-slate-600">{formatEuro(r.result.nettoAnnuale)}</td>
                <td className="py-2.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {r.simulato && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        Simulato
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Elimina record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-sm text-slate-400">
                  Nessun record trovato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
