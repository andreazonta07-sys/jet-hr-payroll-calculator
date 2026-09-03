"use client";

import { useState } from "react";
import { Calculator, Loader2 } from "lucide-react";
import { CITTA_OPTIONS } from "@/lib/defaultSettings";
import { CalculatorInput, Citta, TipoContratto } from "@/lib/types";

interface IntroGateProps {
  onConfirm: (input: CalculatorInput) => void;
}

const CALCOLO_DELAY_MS = 1100;
const EXIT_ANIMATION_MS = 520;
const SLIDER_MIN = 15000;

/** Il massimo dello slider si allarga progressivamente se l'utente digita un valore più alto. */
function getSliderMax(ral: number) {
  const base = 120000;
  if (ral <= base) return base;
  return Math.ceil((ral * 1.2) / 5000) * 5000;
}

export default function IntroGate({ onConfirm }: IntroGateProps) {
  const [ral, setRal] = useState(35000);
  const [tipoContratto, setTipoContratto] = useState<TipoContratto>("Tempo Indeterminato");
  const [citta, setCitta] = useState<Citta>("Milano");
  const [status, setStatus] = useState<"idle" | "calcolo" | "closing">("idle");

  const sliderMax = getSliderMax(ral);

  function handleConfirm() {
    if (status !== "idle") return;
    setStatus("calcolo");
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
    }, CALCOLO_DELAY_MS);
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
          <Calculator className="h-6 w-6 text-white" />
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Calcola la tua Busta Paga con Jet HR
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm text-indigo-100/70">
          Inserisci la tua retribuzione lorda annua: Jet HR calcola netto, tasse e composizione
          dello stipendio in tempo reale.
        </p>

        <div className="mt-7 space-y-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-indigo-100/80">RAL Annua Lorda</span>
              <input
                type="number"
                min={0}
                step={500}
                value={ral}
                disabled={busy}
                onChange={(e) => setRal(Math.max(0, Number(e.target.value) || 0))}
                className="w-32 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-right text-lg font-semibold text-white tabular-nums focus:border-indigo-400 focus:outline-none disabled:opacity-50"
              />
            </div>
            <input
              type="range"
              min={SLIDER_MIN}
              max={sliderMax}
              step={500}
              value={Math.min(Math.max(ral, SLIDER_MIN), sliderMax)}
              disabled={busy}
              onChange={(e) => setRal(Number(e.target.value))}
              className="mt-3 w-full accent-indigo-400 disabled:opacity-50"
            />
            <div className="mt-1 flex justify-between text-xs text-indigo-100/40">
              <span>€{SLIDER_MIN.toLocaleString("it-IT")}</span>
              <span>€{sliderMax.toLocaleString("it-IT")}</span>
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
              <Calculator className="h-4 w-4" />
              Conferma e Calcola
            </>
          )}
          {status !== "idle" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Calcolo in corso…
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
