"use client";

import { useState } from "react";
import { RotateCcw, Save, Settings2 } from "lucide-react";
import { TaxSettings } from "@/lib/types";

interface TaxRulesEditorProps {
  settings: TaxSettings;
  onSave: (settings: TaxSettings) => void;
  onReset: () => void;
}

export default function TaxRulesEditor({ settings, onSave, onReset }: TaxRulesEditorProps) {
  const [draft, setDraft] = useState<TaxSettings>(settings);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateScaglione(index: number, field: "upTo" | "rate", value: number) {
    const next = [...draft.irpefScaglioni];
    next[index] = { ...next[index], [field]: value };
    setDraft({ ...draft, irpefScaglioni: next });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-base font-semibold text-slate-900">Configurazione Regole Fiscali</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Modifica i parametri usati dal motore di calcolo. Le modifiche si applicano solo dopo il salvataggio.
      </p>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Contributi INPS</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Aliquota INPS Dipendente (%)"
              value={draft.inpsRateDipendente}
              onChange={(v) => setDraft({ ...draft, inpsRateDipendente: v })}
            />
            <Field
              label="Aggiuntivo Tempo Determinato (%)"
              value={draft.inpsAggiuntivoDeterminato}
              onChange={(v) => setDraft({ ...draft, inpsAggiuntivoDeterminato: v })}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">Scaglioni IRPEF</h3>
          <div className="mt-3 space-y-3">
            {draft.irpefScaglioni.map((scaglione, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <Field
                  label={`Fino a (€) — scaglione ${i + 1}`}
                  value={scaglione.upTo === Infinity ? 999999 : scaglione.upTo}
                  disabled={scaglione.upTo === Infinity}
                  onChange={(v) => updateScaglione(i, "upTo", v)}
                />
                <Field
                  label="Aliquota (%)"
                  value={scaglione.rate}
                  onChange={(v) => updateScaglione(i, "rate", v)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">Addizionali Regionali IRPEF</h3>
          <p className="mt-1 text-xs text-slate-500">
            Applicata in base alla regione del comune scelto nel calcolatore.
          </p>
          <div className="mt-3 max-h-72 overflow-y-auto overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full min-w-[320px] text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 pb-2 pt-3">Regione</th>
                  <th className="px-3 pb-2 pt-3">Aliquota (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(draft.addizionaliRegionali).map(([regione, rate]) => (
                  <tr key={regione} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{regione}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step={0.01}
                        value={rate}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            addizionaliRegionali: {
                              ...draft.addizionaliRegionali,
                              [regione]: Number(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">Addizionali Comunali</h3>
          <p className="mt-1 text-xs text-slate-500">
            Eccezioni per comuni specifici. Tutti gli altri comuni usano l&apos;aliquota di default.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(draft.addizionaliComunali).map(([comune, rate]) => (
              <Field
                key={comune}
                label={`${comune} (%)`}
                value={rate}
                onChange={(v) =>
                  setDraft({
                    ...draft,
                    addizionaliComunali: { ...draft.addizionaliComunali, [comune]: v },
                  })
                }
              />
            ))}
            <Field
              label="Aliquota Comunale di Default (%)"
              value={draft.aliquotaComunaleDefault}
              onChange={(v) => setDraft({ ...draft, aliquotaComunaleDefault: v })}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">Detrazioni da Lavoro Dipendente</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field
              label="Importo Base (€)"
              value={draft.detrazioniLavoro.importoBase}
              onChange={(v) => setDraft({ ...draft, detrazioniLavoro: { ...draft.detrazioniLavoro, importoBase: v } })}
            />
            <Field
              label="Soglia Bassa (€)"
              value={draft.detrazioniLavoro.sogliaBassa}
              onChange={(v) => setDraft({ ...draft, detrazioniLavoro: { ...draft.detrazioniLavoro, sogliaBassa: v } })}
            />
            <Field
              label="Soglia Media (€)"
              value={draft.detrazioniLavoro.sogliaMedia}
              onChange={(v) => setDraft({ ...draft, detrazioniLavoro: { ...draft.detrazioniLavoro, sogliaMedia: v } })}
            />
            <Field
              label="Soglia Alta (€)"
              value={draft.detrazioniLavoro.sogliaAlta}
              onChange={(v) => setDraft({ ...draft, detrazioniLavoro: { ...draft.detrazioniLavoro, sogliaAlta: v } })}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">Costo Azienda</h3>
          <div className="mt-3 max-w-xs">
            <Field
              label="Moltiplicatore Costo Azienda (es. 1.30)"
              value={draft.costoAziendaMoltiplicatore}
              step={0.01}
              onChange={(v) => setDraft({ ...draft, costoAziendaMoltiplicatore: v })}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Save className="h-4 w-4" />
          Salva e Applica al Calcolatore
        </button>
        <button
          type="button"
          onClick={() => {
            onReset();
            setDraft(settings);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Ripristina Default
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">Impostazioni salvate ✓</span>}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 0.01,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-slate-600">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-400"
      />
    </label>
  );
}
