"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { searchComuni } from "@/lib/comuni";

interface ComuneAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  variant?: "light" | "dark";
}

export default function ComuneAutocomplete({
  id,
  value,
  onChange,
  disabled,
  variant = "light",
}: ComuneAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const results = searchComuni(query);

  const isDark = variant === "dark";
  const inputClass = isDark
    ? "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-indigo-100/40 focus:border-indigo-400 focus:outline-none disabled:opacity-50"
    : "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-400";
  const dropdownClass = isDark
    ? "absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-white/15 bg-slate-800 shadow-xl"
    : "absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg";
  const itemClass = isDark
    ? "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-white/10"
    : "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50";

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder="Cerca un comune…"
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className={inputClass}
      />
      {open && results.length > 0 && (
        <div className={dropdownClass}>
          {results.map((c) => (
            <button
              key={c.nome}
              type="button"
              onClick={() => {
                onChange(c.nome);
                setQuery(c.nome);
                setOpen(false);
              }}
              className={itemClass}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span className="font-medium">{c.nome}</span>
              <span className={isDark ? "text-indigo-100/50" : "text-slate-400"}>{c.regione}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
