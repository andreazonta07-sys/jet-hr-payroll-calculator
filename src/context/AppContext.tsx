"use client";

import { createContext, useCallback, useContext, useMemo, ReactNode } from "react";
import { DEFAULT_TAX_SETTINGS } from "@/lib/defaultSettings";
import { MOCK_HISTORY } from "@/lib/mockData";
import { calcolaBustaPaga } from "@/lib/taxEngine";
import { CalculatorInput, HistoryRecord, TaxSettings } from "@/lib/types";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface AppContextValue {
  settings: TaxSettings;
  updateSettings: (settings: TaxSettings) => void;
  resetSettings: () => void;
  history: HistoryRecord[];
  addHistoryRecord: (input: CalculatorInput) => HistoryRecord;
  deleteHistoryRecord: (id: string) => void;
  hydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings, settingsHydrated] = useLocalStorage<TaxSettings>(
    // v2: le aliquote regionali sono ora chiavate per regione (non più per le 4 città fisse)
    "jethr:tax-settings:v2",
    DEFAULT_TAX_SETTINGS
  );
  const [history, setHistory, historyHydrated] = useLocalStorage<HistoryRecord[]>(
    "jethr:history",
    MOCK_HISTORY
  );

  const updateSettings = useCallback(
    (next: TaxSettings) => {
      setSettings(next);
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_TAX_SETTINGS);
  }, [setSettings]);

  const addHistoryRecord = useCallback(
    (input: CalculatorInput) => {
      const result = calcolaBustaPaga(input, settings);
      const record: HistoryRecord = {
        ...input,
        id: `calc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        simulato: false,
        result,
      };
      setHistory((prev) => [record, ...prev]);
      return record;
    },
    [settings, setHistory]
  );

  const deleteHistoryRecord = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((r) => r.id !== id));
    },
    [setHistory]
  );

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      history,
      addHistoryRecord,
      deleteHistoryRecord,
      hydrated: settingsHydrated && historyHydrated,
    }),
    [settings, updateSettings, resetSettings, history, addHistoryRecord, deleteHistoryRecord, settingsHydrated, historyHydrated]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext deve essere usato dentro AppProvider");
  return ctx;
}
