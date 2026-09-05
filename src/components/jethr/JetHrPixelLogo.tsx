"use client";

import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const REST_LETTERS = ["E", "T", "H", "R"];
const LETTER_STEP_MS = 160;
const J_DELAY_MS = 0;
const REST_START_MS = 420;

/**
 * Riempie lo spazio libero sotto il form del calcolatore: la "J" pixellata
 * appare per prima, poi "ETHR" si materializza lettera per lettera subito
 * dopo, componendo "JETHR" (Jet HR).
 */
export default function JetHrPixelLogo() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center">
      <div className={`${pixelFont.className} flex items-baseline text-slate-900`} style={{ fontSize: "2.5rem" }}>
        <span
          className="animate-fade-in-up inline-block"
          style={{ animationDelay: `${J_DELAY_MS}ms` }}
        >
          J
        </span>
        {REST_LETTERS.map((letter, i) => (
          <span
            key={letter}
            className="animate-fade-in-up inline-block"
            style={{ animationDelay: `${REST_START_MS + i * LETTER_STEP_MS}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">Il calcolo giusto, in un attimo.</p>
    </div>
  );
}
