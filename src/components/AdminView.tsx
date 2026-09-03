"use client";

import { useAppContext } from "@/context/AppContext";
import TaxRulesEditor from "@/components/admin/TaxRulesEditor";
import HistoryTable from "@/components/admin/HistoryTable";

export default function AdminView() {
  const { settings, updateSettings, resetSettings, history, deleteHistoryRecord } = useAppContext();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Gestionale &amp; Admin Panel
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestisci parametri fiscali e storico calcoli. Nessuna autenticazione richiesta (demo).
        </p>
      </div>

      <TaxRulesEditor settings={settings} onSave={updateSettings} onReset={resetSettings} />
      <HistoryTable history={history} onDelete={deleteHistoryRecord} />
    </div>
  );
}
