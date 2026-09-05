"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { calcolaBustaPaga } from "@/lib/taxEngine";
import { CalculatorInput } from "@/lib/types";
import { SEGMENTS } from "@/components/calculator/RalColumnChart";

interface RalLoadingTransitionProps {
  input: CalculatorInput;
  /** Chiamata appena inizia lo svelamento: il chiamante deve avviare in parallelo
   * il fade-in del contenuto sottostante e far ripartire le sue animazioni interne. */
  onRevealStart: () => void;
  /** Chiamata quando l'overlay ha finito di sparire: sicuro smontarlo. */
  onDone: () => void;
}

type Phase = "filling" | "revealing";

const EASE = "cubic-bezier(0.16,1,0.3,1)";
/** Approssima lo stesso profilo di EASE per le interpolazioni calcolate a mano. */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

const BAR_WIDTH_RATIO = 0.88;
const BAR_MAX_WIDTH = 1100;
const BAR_HEIGHT = 130;
const BAR_RADIUS = 20;
const FILL_STAGGER_MS = 130;
const FILL_SEGMENT_MS = 550;
const FILL_TOTAL_MS = FILL_STAGGER_MS * (SEGMENTS.length - 1) + FILL_SEGMENT_MS;
const HOLD_MS = 350;
const OVERLAY_FADE_MS = 480;

/**
 * Overlay di transizione tra la conferma della RAL e il calcolatore.
 *
 * Due fasi:
 * 1. filling: una barra orizzontale fissa si riempie con le proporzioni reali
 *    della busta paga — è il progress (0→100%) del "calcolo". Percentuale e
 *    larghezza di ogni segmento sono calcolate nello stesso ciclo
 *    requestAnimationFrame (stessa sorgente di tempo), cosicché non possano
 *    mai disallinearsi come succederebbe mescolando un contatore JS con
 *    transition-delay CSS staggerati.
 * 2. revealing: l'intera barra (ancora piena) sparisce con un fade diretto,
 *    mentre sotto "La Colonna della RAL" (già alla sua dimensione definitiva,
 *    niente ri-crescita) fa il proprio fade-in in parallelo — niente
 *    ridimensionamento visibile della barra verso la colonna, che darebbe
 *    l'illusione di restringersi fino a una lineetta prima di sparire.
 */
export default function RalLoadingTransition({
  input,
  onRevealStart,
  onDone,
}: RalLoadingTransitionProps) {
  const { settings } = useAppContext();
  const result = useMemo(() => calcolaBustaPaga(input, settings), [input, settings]);
  const total = result.ral;
  const segPercents = useMemo(
    () => SEGMENTS.map((seg) => (total > 0 ? (result[seg.key] / total) * 100 : 0)),
    [result, total]
  );

  const [phase, setPhase] = useState<Phase>("filling");
  const [percent, setPercent] = useState(0);
  // Fattore 0..1 per ciascun segmento: moltiplica segPercents per ottenere la
  // larghezza istantanea. Guidato interamente da rAF, mai da CSS transition,
  // così il numero mostrato e le barre sono sempre coerenti fotogramma per fotogramma.
  const [segProgress, setSegProgress] = useState<number[]>(() => SEGMENTS.map(() => 0));
  // Lazy initializer: sicuro qui perché questo componente viene istanziato
  // solo lato client, dopo l'interazione dell'utente (mai durante l'SSR).
  const [barWidth] = useState(() => Math.min(BAR_MAX_WIDTH, window.innerWidth * BAR_WIDTH_RATIO));

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const elapsed = now - start;
      setPercent(Math.min(100, Math.round((elapsed / FILL_TOTAL_MS) * 100)));
      setSegProgress(
        SEGMENTS.map((_, i) => {
          const local = elapsed - i * FILL_STAGGER_MS;
          const t = Math.min(1, Math.max(0, local / FILL_SEGMENT_MS));
          return easeOutQuart(t);
        })
      );
      if (elapsed < FILL_TOTAL_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        setPercent(100);
        setSegProgress(SEGMENTS.map(() => 1));
      }
    }
    raf = requestAnimationFrame(tick);

    const t1 = window.setTimeout(() => setPhase("revealing"), FILL_TOTAL_MS + HOLD_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
    };
  }, []);

  useEffect(() => {
    if (phase !== "revealing") return;
    onRevealStart();
    const t = window.setTimeout(onDone, OVERLAY_FADE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        opacity: phase === "revealing" ? 0 : 1,
        transition: `opacity ${OVERLAY_FADE_MS}ms ${EASE}`,
        pointerEvents: phase === "revealing" ? "none" : "auto",
      }}
    >
      <div className="absolute inset-0 bg-slate-950" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(680px 420px at 15% 10%, rgba(129,140,248,0.35), transparent 60%), radial-gradient(620px 460px at 85% 90%, rgba(167,139,250,0.28), transparent 60%), radial-gradient(500px 500px at 90% 5%, rgba(52,211,153,0.15), transparent 60%)",
        }}
      />

      {phase === "filling" && (
        <div className="absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-5xl font-semibold tabular-nums text-white">{percent}%</p>
          <p className="mt-2 text-sm text-indigo-100/70">
            Calcolo la composizione della tua busta paga…
          </p>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "44%",
          width: barWidth,
          height: BAR_HEIGHT,
          overflow: "hidden",
          borderRadius: BAR_RADIUS,
          boxShadow: "0 20px 60px -20px rgba(0,0,0,0.55)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex h-full w-full flex-row">
          {SEGMENTS.map((seg, i) => (
            <div
              key={seg.key}
              style={{
                height: "100%",
                width: `${segPercents[i] * segProgress[i]}%`,
                background: seg.color,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
