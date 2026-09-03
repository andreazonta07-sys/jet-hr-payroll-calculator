"use client";

import { useState } from "react";
import { Calculator, Loader2 } from "lucide-react";
import ComuneAutocomplete from "@/components/ComuneAutocomplete";
import { CalculatorInput, Citta, TipoContratto } from "@/lib/types";

interface IntroGateProps {
  onConfirm: (input: CalculatorInput) => void;
}

const CALCOLO_DELAY_MS = 1100;
const EXIT_ANIMATION_MS = 520;

export default function IntroGate({ onConfirm }: IntroGateProps) {
  const [ral, setRal] = useState(35000);
  const [tipoContratto, setTipoContratto] = useState<TipoContratto>("Tempo Indeterminato");
  const [citta, setCitta] = useState<Citta>("Milano");
  const [mensilita, setMensilita] = useState<13 | 14>(13);
  const [status, setStatus] = useState<"idle" | "calcolo" | "closing">("idle");

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
          mensilita,
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
            <label htmlFor="intro-ral" className="text-sm font-medium text-indigo-100/80">
              RAL Annua Lorda
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 focus-within:border-indigo-400">
              <span className="text-lg font-semibold text-indigo-100/60">€</span>
              <input
                id="intro-ral"
                type="number"
                min={0}
                step={500}
                value={ral}
                disabled={busy}
                onChange={(e) => setRal(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-transparent text-lg font-semibold text-white tabular-nums outline-none disabled:opacity-50"
              />
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
              <div className="mt-1.5">
                <ComuneAutocomplete
                  value={citta}
                  onChange={setCitta}
                  disabled={busy}
                  variant="dark"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-indigo-100/70">Numero Mensilità</label>
              <select
                value={mensilita}
                disabled={busy}
                onChange={(e) => setMensilita(Number(e.target.value) as 13 | 14)}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 [&>option]:text-slate-900"
              >
                <option value={13}>13 mensilità</option>
                <option value={14}>14 mensilità</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={busy}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-90"
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
