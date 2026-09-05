"use client";

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";

/**
 * Credenziali fornite dal cliente per l'accesso al Gestionale. L'app è
 * pubblicata come export statico (nessun backend), quindi questo è solo un
 * cancello lato client: chiunque legga il bundle JS può vedere queste
 * stringhe. Non protegge dati sensibili, serve solo a evitare che un
 * visitatore casuale apra il pannello admin.
 */
const ADMIN_USERNAME = "Jet_hr_";
const ADMIN_PASSWORD = "milano2026@";
const SESSION_KEY = "jethr-admin-authenticated";

const authListeners = new Set<() => void>();

function getAuthSnapshot() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

/** Durante la pre-renderizzazione statica (build) sessionStorage non esiste:
 * si assume non autenticato, poi React risincronizza col valore reale del
 * browser subito dopo l'idratazione, senza bisogno di un useEffect. */
function getAuthServerSnapshot() {
  return false;
}

function subscribeAuth(callback: () => void) {
  authListeners.add(callback);
  return () => authListeners.delete(callback);
}

function setAuthenticated() {
  sessionStorage.setItem(SESSION_KEY, "1");
  authListeners.forEach((listener) => listener());
}

export default function AdminAuthGate({ children }: { children: ReactNode }) {
  const authenticated = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthenticated();
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!authenticated) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Lock className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-slate-900">Accesso Gestionale</h1>
          <p className="mt-1 text-sm text-slate-500">Inserisci le credenziali per continuare.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="admin-username">
              Nome utente
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {error && <p className="text-sm text-rose-600">Nome utente o password errati.</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Accedi
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
