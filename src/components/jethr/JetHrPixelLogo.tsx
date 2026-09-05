"use client";

import Image from "next/image";

const WORDMARK_DELAY_MS = 550;

/**
 * Riempie lo spazio libero sotto il form del calcolatore: l'icona "J"
 * pixellata compare per prima, poi la scritta "Jet HR" si dissolve dentro
 * subito dopo, componendo il logo completo.
 */
export default function JetHrPixelLogo() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-10">
      <div className="flex items-center gap-4">
        <div className="animate-fade-in-up">
          <Image
            src="/jethr-logo-icon.png"
            alt=""
            width={119}
            height={128}
            className="h-14 w-auto"
            priority
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: `${WORDMARK_DELAY_MS}ms` }}>
          <Image
            src="/jethr-logo-wordmark.png"
            alt="Jet HR"
            width={268}
            height={80}
            className="h-9 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
