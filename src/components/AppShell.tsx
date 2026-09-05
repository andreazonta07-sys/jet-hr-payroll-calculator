"use client";

import { useCallback, useRef, useState } from "react";
import { AppProvider } from "@/context/AppContext";
import Header, { ViewMode } from "@/components/Header";
import CalculatorView from "@/components/CalculatorView";
import AdminView from "@/components/AdminView";
import IntroGate from "@/components/IntroGate";
import RalLoadingTransition from "@/components/RalLoadingTransition";
import { CalculatorInput } from "@/lib/types";

const FALLBACK_INPUT: CalculatorInput = {
  ral: 35000,
  tipoContratto: "Tempo Indeterminato",
  citta: "Milano",
  mensilita: 13,
  giorniLavorati: 365,
};

interface AppShellProps {
  /** "gate" mostra la schermata iniziale con inserimento RAL; "admin" apre direttamente il Gestionale. */
  startView: "gate" | "admin";
}

type Phase = "gate" | "revealing" | "app";

const CONTENT_FADE_MS = 480;

export default function AppShell({ startView }: AppShellProps) {
  const [view, setView] = useState<ViewMode>(startView === "admin" ? "admin" : "calcolatore");
  const [phase, setPhase] = useState<Phase>(startView === "admin" ? "app" : "gate");
  const [initialInput, setInitialInput] = useState<CalculatorInput | null>(null);
  // Il contenuto sotto l'overlay fa un vero fade-in (mai un salto secco di
  // visibility). La colonna RAL vera è sempre già piena/statica: è il ghost
  // di RalLoadingTransition a mostrare la crescita dal basso, misurato sulla
  // posizione/dimensione reali di questa colonna — evitando così una seconda
  // crescita da zero (visibilmente ridondante) quando il ghost sparisce.
  const [contentVisible, setContentVisible] = useState(startView === "admin");
  const columnRef = useRef<HTMLDivElement>(null);

  const handleRevealStart = useCallback(() => {
    setContentVisible(true);
  }, []);

  const handleDone = useCallback(() => setPhase("app"), []);

  const appMounted = phase !== "gate";

  return (
    <AppProvider>
      {phase === "gate" && (
        <IntroGate
          onConfirm={(input) => {
            setInitialInput(input);
            setPhase("revealing");
          }}
        />
      )}

      {appMounted && (
        <div
          aria-hidden={!contentVisible}
          className="flex min-h-full flex-1 flex-col"
          style={{
            opacity: contentVisible ? 1 : 0,
            pointerEvents: contentVisible ? "auto" : "none",
            transition: `opacity ${CONTENT_FADE_MS}ms cubic-bezier(0.16,1,0.3,1)`,
          }}
        >
          <Header view={view} onChangeView={setView} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {view === "calcolatore" ? (
              <CalculatorView
                initialInput={initialInput ?? FALLBACK_INPUT}
                columnRef={columnRef}
              />
            ) : (
              <AdminView />
            )}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
            Demo non ufficiale realizzata a scopo dimostrativo. Non affiliata a Jet HR S.r.l.
          </footer>
        </div>
      )}

      {phase === "revealing" && initialInput && (
        <RalLoadingTransition
          input={initialInput}
          columnRef={columnRef}
          onRevealStart={handleRevealStart}
          onDone={handleDone}
        />
      )}
    </AppProvider>
  );
}
