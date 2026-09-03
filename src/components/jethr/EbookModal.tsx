"use client";

import { useState } from "react";
import { CheckCircle2, Mail, X } from "lucide-react";

export default function EbookModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Lead capture: in produzione qui andrebbe la chiamata a un CRM / API di Jet HR.
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Chiudi"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Scarica l&apos;Ebook Gratuito
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              &ldquo;Guida al Cuneo Fiscale 2024&rdquo; — tutto quello che devi sapere su RAL, netto e costo
              del lavoro, spiegato in modo semplice.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                type="email"
                required
                placeholder="La tua email aziendale"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Invia e scarica l&apos;ebook
              </button>
              <p className="text-center text-xs text-slate-400">
                Iscrivendoti accetti di ricevere comunicazioni da Jet HR. Nessuno spam.
              </p>
            </form>
          </>
        ) : (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Grazie!</h3>
            <p className="mt-1 text-sm text-slate-500">
              Controlla la tua casella email: il link per scaricare l&apos;ebook sta per arrivare.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Chiudi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
