"use client";

import { Calculator, LayoutDashboard, Rocket } from "lucide-react";
import { SOCIAL_LINKS } from "@/components/jethr/PromoSection";

export type ViewMode = "calcolatore" | "admin";

interface HeaderProps {
  view: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

export default function Header({ view, onChangeView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <Rocket className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Jet HR</p>
            <p className="text-xs text-slate-500">Calcolatore Busta Paga</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onChangeView("calcolatore")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
              view === "calcolatore"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calcolatore Busta Paga</span>
            <span className="sm:hidden">Calcolatore</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeView("admin")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
              view === "admin"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Gestionale &amp; Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </nav>

        <div className="hidden items-center gap-1.5 sm:flex">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-700"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
