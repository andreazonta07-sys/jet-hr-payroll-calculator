"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { useAppContext } from "@/context/AppContext";
import { calcolaBustaPaga } from "@/lib/taxEngine";
import { CalculatorInput } from "@/lib/types";
import { SEGMENTS } from "@/components/calculator/RalColumnChart";

interface RalLoadingTransitionProps {
  input: CalculatorInput;
  columnRef: RefObject<HTMLDivElement | null>;
  /** Chiamata appena inizia lo svelamento: il chiamante deve avviare in parallelo
   * il fade-in del contenuto sottostante e far ripartire le sue animazioni interne. */
  onRevealStart: () => void;
  /** Chiamata quando l'overlay ha finito di sparire: sicuro smontarlo. */
  onDone: () => void;
}

type Phase = "filling" | "morphing" | "revealing";

const EASE = "cubic-bezier(0.16,1,0.3,1)";
/** Approssima lo stesso profilo di EASE per le interpolazioni calcolate a mano. */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

const BAR_HEIGHT = 130;
const BAR_RADIUS = 20;
const FILL_STAGGER_MS = 130;
const FILL_SEGMENT_MS = 550;
const FILL_TOTAL_MS = FILL_STAGGER_MS * (SEGMENTS.length - 1) + FILL_SEGMENT_MS;
const HOLD_MS = 350;
const MORPH_MS = 1150;
const EMPTY_MS = 650;
const OVERLAY_FADE_MS = 480;

interface BarBox {
  width: number;
  height: number;
  cx: number;
  cy: number;
  rotate: number;
  radius: number;
}

/**
 * Overlay di transizione tra la conferma della RAL e il calcolatore.
 *
 * Tre fasi, ciascuna con un solo scopo — niente è mostrato due volte:
 * 1. filling: una barra orizzontale si riempie con le proporzioni reali della
 *    busta paga — è il progress (0→100%) del "calcolo". Percentuale e larghezza
 *    di ogni segmento sono calcolate nello stesso ciclo requestAnimationFrame
 *    (stessa sorgente di tempo), cosicché non possano mai disallinearsi come
 *    succederebbe mescolando un contatore JS con transition-delay CSS staggerati.
 * 2. morphing: la barra ruota di -90° (con swap width/height, così un contenuto
 *    disposto in riga appare naturalmente come pila verticale) e rimpicciolisce
 *    fino a coincidere esattamente con "La Colonna della RAL" già montata sotto,
 *    misurata via getBoundingClientRect. In parallelo i segmenti si SVUOTANO:
 *    l'unica volta che la colonna si riempie è quella vera, dentro la pagina
 *    (Recharts, rimontato dal chiamante tramite key al momento del reveal).
 * 3. revealing: il ghost (ormai vuoto) sparisce mentre il contenuto sottostante
 *    fa il proprio fade-in — due transizioni di opacità in parallelo, mai un
 *    salto secco di visibility.
 */
export default function RalLoadingTransition({
  input,
  columnRef,
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
  const [barBox, setBarBox] = useState<BarBox>(() => ({
    width: Math.min(1100, window.innerWidth * 0.88),
    height: BAR_HEIGHT,
    cx: window.innerWidth / 2,
    cy: window.innerHeight * 0.44,
    rotate: 0,
    radius: BAR_RADIUS,
  }));

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

    const t1 = window.setTimeout(() => setPhase("morphing"), FILL_TOTAL_MS + HOLD_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
    };
  }, []);

  useEffect(() => {
    if (phase !== "morphing") return;

    // Svuota i segmenti in parallelo alla rotazione (stessa tecnica: un solo
    // rAF pilota tutti i segmenti insieme), finendo prima che il morph
    // geometrico atterri, cosicché la forma arrivi già vuota.
    const emptyStart = performance.now();
    let rafEmpty = 0;
    function tickEmpty(now: number) {
      const t = Math.min(1, (now - emptyStart) / EMPTY_MS);
      const eased = easeOutQuart(t);
      setSegProgress(SEGMENTS.map(() => 1 - eased));
      if (t < 1) rafEmpty = requestAnimationFrame(tickEmpty);
    }
    rafEmpty = requestAnimationFrame(tickEmpty);

    const el = columnRef.current;
    if (!el) {
      setPhase("revealing");
      return;
    }
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        setBarBox({
          width: rect.height,
          height: rect.width,
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          rotate: -90,
          radius: 16,
        });
      });
    });
    const t = window.setTimeout(() => setPhase("revealing"), MORPH_MS + 30);
    return () => {
      cancelAnimationFrame(rafEmpty);
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [phase, columnRef]);

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
          left: 0,
          top: 0,
          width: barBox.width,
          height: barBox.height,
          overflow: "hidden",
          borderRadius: barBox.radius,
          boxShadow: "0 20px 60px -20px rgba(0,0,0,0.55)",
          transform: `translate(${barBox.cx}px, ${barBox.cy}px) translate(-50%, -50%) rotate(${barBox.rotate}deg)`,
          transition:
            phase === "filling"
              ? "none"
              : `width ${MORPH_MS}ms ${EASE}, height ${MORPH_MS}ms ${EASE}, transform ${MORPH_MS}ms ${EASE}, border-radius ${MORPH_MS}ms ${EASE}`,
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
