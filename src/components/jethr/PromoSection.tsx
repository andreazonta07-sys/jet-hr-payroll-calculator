"use client";

import { useState } from "react";
import { BookOpenCheck, MessageCircleHeart, PlayCircle, Star } from "lucide-react";
import EbookModal from "./EbookModal";

/** Personalizza qui l'URL del video/reel di presentazione Jet HR. */
export const JET_HR_VIDEO_SRC = "https://www.jethr.com/video/demo-reel.mp4";
export const JET_HR_WEBSITE_URL = "https://www.jethr.com";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/jethr", icon: LinkedinIcon },
  { label: "Instagram", href: "https://www.instagram.com/jethr", icon: InstagramIcon },
  { label: "YouTube", href: "https://www.youtube.com/@jethr", icon: YoutubeIcon },
  { label: "X (Twitter)", href: "https://x.com/jethr", icon: XIcon },
  { label: "Facebook", href: "https://www.facebook.com/jethr", icon: FacebookIcon },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M22 12s0-3.2-.41-4.72a2.78 2.78 0 0 0-1.96-1.97C18.13 5 12 5 12 5s-6.13 0-7.63.31A2.78 2.78 0 0 0 2.4 7.28C2 8.8 2 12 2 12s0 3.2.41 4.72a2.78 2.78 0 0 0 1.96 1.97C5.87 19 12 19 12 19s6.13 0 7.63-.31a2.78 2.78 0 0 0 1.96-1.97C22 15.2 22 12 22 12z" />
      <path d="M10 15.2V8.8L15.5 12z" fill="#fff" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.3c-.26-.04-1.16-.11-2.2-.11-2.18 0-3.68 1.33-3.68 3.77V10.5H8.2v3h2.42V21h2.88z" />
    </svg>
  );
}

export default function PromoSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-sm sm:p-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              Jet HR — Software HR &amp; Payroll
            </span>
            <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
              Automatizza la Gestione Payroll della tua Azienda con Jet HR
            </h2>
            <p className="mt-3 text-sm text-indigo-100 sm:text-base">
              Basta calcoli manuali in Excel. Gestisci assunzioni, buste paga e presenze in un unico
              software intuitivo.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-transform hover:scale-[1.02]"
              >
                <BookOpenCheck className="h-4 w-4" />
                Scarica l&apos;Ebook Gratuito: Guida al Cuneo Fiscale
              </button>
              <a
                href={JET_HR_WEBSITE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Richiedi una Demo di Jet HR
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[260px]">
            <button
              type="button"
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40 shadow-lg"
              aria-label="Guarda il video demo"
              data-video-src={JET_HR_VIDEO_SRC}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-900/30 to-slate-900/70 p-4 text-center">
                <PlayCircle className="h-14 w-14 text-white transition-transform group-hover:scale-110" />
                <p className="text-xs font-medium text-white">
                  🎥 Guarda come Jet HR semplifica la busta paga in 60 secondi
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TrustBadge icon={Star} label="Valutazione Clienti" value="4.9/5 ⭐" />
        <TrustBadge icon={MessageCircleHeart} label="Aziende Gestite" value="500+ 🏢" />
        <TrustBadge icon={MessageCircleHeart} label="Assistenza HR Dedicata" value="< 5 minuti 💬" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-center text-sm font-medium text-slate-600">Seguici sui canali ufficiali Jet HR</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>

      {modalOpen && <EbookModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}

function TrustBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
