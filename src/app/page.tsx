"use client";

import { useState } from "react";
import { AppProvider } from "@/context/AppContext";
import Header, { ViewMode } from "@/components/Header";
import CalculatorView from "@/components/CalculatorView";
import AdminView from "@/components/AdminView";
import IntroGate from "@/components/IntroGate";
import { CalculatorInput } from "@/lib/types";

export default function Home() {
  const [view, setView] = useState<ViewMode>("calcolatore");
  const [introDone, setIntroDone] = useState(false);
  const [initialInput, setInitialInput] = useState<CalculatorInput | null>(null);

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

      {introDone && initialInput && (
        <div className="animate-fade-in-up flex min-h-full flex-1 flex-col">
          <Header view={view} onChangeView={setView} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {view === "calcolatore" ? (
              <CalculatorView initialInput={initialInput} />
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
