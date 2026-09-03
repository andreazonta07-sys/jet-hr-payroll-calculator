"use client";

import { useEffect, useState } from "react";
import { AppProvider } from "@/context/AppContext";
import Header, { ViewMode } from "@/components/Header";
import CalculatorView from "@/components/CalculatorView";
import AdminView from "@/components/AdminView";
import IntroGate from "@/components/IntroGate";
import { CalculatorInput } from "@/lib/types";

const FALLBACK_INPUT: CalculatorInput = {
  ral: 35000,
  tipoContratto: "Tempo Indeterminato",
  citta: "Milano",
  mensilita: 13,
  giorniLavorati: 365,
};

export default function Home() {
  const [view, setView] = useState<ViewMode>("calcolatore");
  const [introDone, setIntroDone] = useState(false);
  const [initialInput, setInitialInput] = useState<CalculatorInput | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "admin") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial view is derived from the URL on mount
      setView("admin");
      setIntroDone(true);
    }
  }, []);

  return (
    <AppProvider>
      {!introDone && (
        <IntroGate
          onConfirm={(input) => {
            setInitialInput(input);
            setIntroDone(true);
          }}
        />
      )}

      {introDone && (
        <div className="animate-fade-in-up flex min-h-full flex-1 flex-col">
          <Header view={view} onChangeView={setView} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {view === "calcolatore" ? (
              <CalculatorView initialInput={initialInput ?? FALLBACK_INPUT} />
            ) : (
              <AdminView />
            )}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
            Demo non ufficiale realizzata a scopo dimostrativo. Non affiliata a Jet HR S.r.l.
          </footer>
        </div>
      )}
    </AppProvider>
  );
}
