"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpenCheck, Volume2, VolumeX } from "lucide-react";
import EbookModal from "./EbookModal";

/** Personalizza qui l'URL del video/reel di presentazione Jet HR. */
export const JET_HR_VIDEO_SRC = "/jethr-reel.mp4";

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/jethr", icon: LinkedinIcon },
  { label: "Instagram", href: "https://www.instagram.com/jethr", icon: InstagramIcon },
];

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.11 20.45H3.56V9h3.55v11.45z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TrustpilotStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#00b67a">
      <path d="M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.27l-6.18 3.23L7 13.63l-5-4.87 6.91-1z" />
    </svg>
  );
}

/** Punteggio verificato su it.trustpilot.com/review/jethr.com. */
function TrustpilotBadge() {
  return (
    <a
      href="https://it.trustpilot.com/review/jethr.com"
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/15"
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <TrustpilotStar key={i} className="h-4 w-4" />
        ))}
      </div>
      <span className="text-sm">
        <span className="font-semibold">Trustpilot</span> · 4,6/5 Eccellente{" "}
        <span className="text-indigo-100">(146 recensioni)</span>
      </span>
    </a>
  );
}

/**
 * Autoplay con audio non è concesso dai browser: parte muto (unico modo
 * garantito ovunque) e la persona può attivare l'audio col tasto speaker,
 * che imposta un volume basso (0.35) invece del 100% di default.
 */
/** `heightPx` arriva dal genitore, misurata sul blocco di testo affiancato:
 * null sotto il breakpoint lg (dove il video torna a dimensionarsi da solo
 * in colonna, in cima al testo). */
function ReelPlayer({ heightPx }: { heightPx: number | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    if (muted) {
      video.volume = 0.35;
      video.muted = false;
      setMuted(false);
    } else {
      video.muted = true;
      setMuted(true);
    }
  }

  return (
    <div
      className="relative mx-auto block aspect-[9/16] w-full max-w-[360px] shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-lg lg:mx-0 lg:w-auto lg:max-w-none"
      style={heightPx != null ? { height: heightPx } : undefined}
    >
      <video
        ref={videoRef}
        src={JET_HR_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-900/85" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-sm font-semibold leading-snug text-white">
          🎥 Come Jet HR abbatte la burocrazia della tua azienda
        </p>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Attiva audio" : "Disattiva audio"}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Tailwind lg: sotto questa soglia il video torna a dimensionarsi da solo. */
const LG_BREAKPOINT_PX = 1024;

export default function PromoSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [videoHeight, setVideoHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setVideoHeight(window.innerWidth >= LG_BREAKPOINT_PX ? el.offsetHeight : null);
    }

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    window.addEventListener("resize", update);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-12">
          <ReelPlayer heightPx={videoHeight} />

          <div ref={textRef} className="flex max-w-xl flex-col justify-center text-center lg:text-left">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Libera la tua Azienda dal Peso della Burocrazia
            </h2>
            <p className="mt-5 text-base leading-loose text-indigo-100 sm:text-lg">
              Jet HR affianca le imprese italiane con un software payroll e HR pensato per farti
              risparmiare tempo su assunzioni, buste paga e adempimenti: un supporto concreto, non
              solo un tool in più.
            </p>

            <p className="mt-8 text-base font-medium text-indigo-100">
              Scopri come Jet HR risolve la burocrazia della tua azienda
            </p>
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-900/30 transition-transform hover:scale-[1.02]"
              >
                <BookOpenCheck className="h-4 w-4" />
                Scarica l&apos;Ebook Gratuito: Guida al Cuneo Fiscale
              </button>
            </div>

            <div className="mt-5">
              <TrustpilotBadge />
            </div>
          </div>
        </div>
      </div>

      {modalOpen && <EbookModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}
