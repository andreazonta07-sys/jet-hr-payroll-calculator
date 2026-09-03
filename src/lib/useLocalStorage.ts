"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [hydrated, setHydrated] = useState(false);
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reading an external store (localStorage) on mount
        setValue(JSON.parse(stored) as T);
      }
    } catch (error) {
      console.warn(`Impossibile leggere ${key} da localStorage`, error);
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Impossibile scrivere ${key} su localStorage`, error);
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
