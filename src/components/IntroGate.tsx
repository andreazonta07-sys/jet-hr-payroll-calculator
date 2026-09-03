"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { CITTA_OPTIONS } from "@/lib/defaultSettings";
import { CalculatorInput, Citta, TipoContratto } from "@/lib/types";

const RAL_PRESETS = [25000, 35000, 45000, 60000, 80000];

interface IntroGateProps {
  onConfirm: (input: CalculatorInput) => void;
}

const ANALYSIS_DELAY_MS = 1400;
const EXIT_ANIMATION_MS = 520;

export default function IntroGate({ onConfirm }: IntroGateProps) {
  const [ral, setRal] = useState(35000);
  const [tipoContratto, setTipoContratto] = useState<TipoContratto>("Tempo Indeterminato");
  const [citta, setCitta] = useState<Citta>("Milano");
  const [status, setStatus] = useState<"idle" | "analyzing" | "closing">("idle");

  function handleConfirm() {
    if (status !== "idle") return;
    setStatus("analyzing");
    window.setTimeout(() => {
      setStatus("closing");
      window.setTimeout(() => {
        onConfirm({
          ral,
          tipoContratto,
          citta,
          mensilita: 13,
          giorniLavorati: 365,
        });
      }, EXIT_ANIMATION_MS);
    }, ANALYSIS_DELAY_MS);
  }

  const busy = status !== "idle";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950 px-4 py-10 ${
        status === "closing" ? "animate-gate-exit" : ""
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(680px 420px at 15% 10%, rgba(129,140,248,0.35), transparent 60%), radial-gradient(620px 460px at 85% 90%, rgba(167,139,250,0.28), transparent 60%), radial-gradient(500px 500px at 90% 5%, rgba(52,211,153,0.15), transparent 60%)",
        }}
      />

      <div className="animate-fade-in-up relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
          <Sparkles className="h-6 w-6 text-white" />
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Analizza la tua RAL con l&apos;AI di Jet HR
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm text-indigo-100/70">
          Seleziona la tua retribuzione lorda annua: l&apos;AI di Jet HR calcola netto, tasse e
          composizione dello stipendio in tempo reale.
        </p>

        <div className="mt-7 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-100/80">RAL Annua Lorda</span>
              <span className="text-lg font-semibold text-white tabular-nums">
                {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(ral)}
              </span>
            </div>
            <input
              type="range"
              min={15000}
              max={120000}
              step={500}
              value={ral}
              disabled={busy}
              onChange={(e) => setRal(Number(e.target.value))}
              className="mt-3 w-full accent-indigo-400 disabled:opacity-50"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {RAL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={busy}
                  onClick={() => setRal(preset)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                    ral === preset
                      ? "border-indigo-400 bg-indigo-500/20 text-white"
                      : "border-white/15 text-indigo-100/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  €{(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-indigo-100/70">Tipo Contratto</label>
              <select
                value={tipoContratto}
                disabled={busy}
                onChange={(e) => setTipoContratto(e.target.value as TipoContratto)}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 [&>option]:text-slate-900"
              >
                <option value="Tempo Indeterminato">Tempo Indeterminato</option>
                <option value="Tempo Determinato">Tempo Determinato</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-indigo-100/70">Residenza</label>
              <select
                value={citta}
                disabled={busy}
                onChange={(e) => setCitta(e.target.value as Citta)}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 [&>option]:text-slate-900"
              >
                {CITTA_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={busy}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-90"
        >
          {status === "idle" && (
            <>
              <Sparkles className="h-4 w-4" />
              Conferma e Analizza la RAL
            </>
          )}
          {status !== "idle" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analisi AI in corso…
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] text-indigo-100/50">
          Potrai modificare tutti i parametri anche dopo, nel calcolatore completo.
        </p>
      </div>
    </div>
  );
}
