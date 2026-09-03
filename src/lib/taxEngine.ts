import { findComune } from "./comuni";
import { CalculationResult, CalculatorInput, TaxSettings } from "./types";

/**
 * Calcola l'IRPEF lorda applicando gli scaglioni a scaglioni progressivi
 * (marginal tax bracket calculation).
 */
function calcolaIrpefLorda(imponibile: number, settings: TaxSettings): number {
  let irpef = 0;
  let sogliaPrecedente = 0;

  for (const scaglione of settings.irpefScaglioni) {
    if (imponibile <= sogliaPrecedente) break;
    const baseImponibileScaglione = Math.min(imponibile, scaglione.upTo) - sogliaPrecedente;
    if (baseImponibileScaglione > 0) {
      irpef += (baseImponibileScaglione * scaglione.rate) / 100;
    }
    sogliaPrecedente = scaglione.upTo;
  }

  return irpef;
}

/**
 * Detrazioni da lavoro dipendente (formula semplificata basata sulle fasce
 * di reddito imponibile IRPEF, a fini dimostrativi).
 */
function calcolaDetrazioniLavoro(imponibile: number, settings: TaxSettings): number {
  const { importoBase, sogliaBassa, sogliaMedia, sogliaAlta } = settings.detrazioniLavoro;

  if (imponibile <= 0) return 0;
  if (imponibile <= sogliaBassa) {
    return importoBase;
  }
  if (imponibile <= sogliaMedia) {
    const importoIntermedio = importoBase * 0.6;
    return (
      importoIntermedio +
      (importoBase - importoIntermedio) * ((sogliaMedia - imponibile) / (sogliaMedia - sogliaBassa))
    );
  }
  if (imponibile <= sogliaAlta) {
    const importoIntermedio = importoBase * 0.6;
    return importoIntermedio * ((sogliaAlta - imponibile) / (sogliaAlta - sogliaMedia));
  }
  return 0;
}

/**
 * Aliquota INPS a carico del dipendente per tipo di contratto (2024,
 * semplificato a fini dimostrativi): il Tempo Determinato paga un aggiuntivo,
 * l'Apprendistato ha un'aliquota ridotta e sostitutiva, il Contratto a
 * Chiamata ha lo stesso trattamento previdenziale del Tempo Indeterminato.
 */
function inpsRateFor(tipoContratto: CalculatorInput["tipoContratto"], settings: TaxSettings): number {
  switch (tipoContratto) {
    case "Apprendistato":
      return settings.inpsRateApprendistato;
    case "Tempo Determinato":
      return settings.inpsRateDipendente + settings.inpsAggiuntivoDeterminato;
    default:
      return settings.inpsRateDipendente;
  }
}

export function calcolaBustaPaga(input: CalculatorInput, settings: TaxSettings): CalculationResult {
  const giorniFactor = Math.min(Math.max(input.giorniLavorati, 0), 365) / 365;
  const ralEffettiva = input.ral * giorniFactor;

  const inpsRate = inpsRateFor(input.tipoContratto, settings);
  const inpsDipendente = (ralEffettiva * inpsRate) / 100;

  const imponibileIrpef = Math.max(ralEffettiva - inpsDipendente, 0);
  const irpefLorda = calcolaIrpefLorda(imponibileIrpef, settings);
  const detrazioniLavoro = calcolaDetrazioniLavoro(imponibileIrpef, settings);
  const irpefNetta = Math.max(irpefLorda - detrazioniLavoro, 0);

  const regione = findComune(input.citta)?.regione;
  const aliquotaRegionale = (regione ? settings.addizionaliRegionali[regione] : undefined) ?? 0;
  const aliquotaComunale = settings.addizionaliComunali[input.citta] ?? settings.aliquotaComunaleDefault;
  const addizionaleRegionale = (imponibileIrpef * aliquotaRegionale) / 100;
  const addizionaleComunale = (imponibileIrpef * aliquotaComunale) / 100;

  const totaleTrattenute = inpsDipendente + irpefNetta + addizionaleRegionale + addizionaleComunale;
  const nettoAnnuale = Math.max(ralEffettiva - totaleTrattenute, 0);
  const nettoMensile = nettoAnnuale / input.mensilita;
  const costoAzienda = input.ral * settings.costoAziendaMoltiplicatore;

  return {
    ral: input.ral,
    ralEffettiva,
    inpsDipendente,
    imponibileIrpef,
    irpefLorda,
    detrazioniLavoro,
    irpefNetta,
    addizionaleRegionale,
    addizionaleComunale,
    totaleTrattenute,
    nettoAnnuale,
    nettoMensile,
    costoAzienda,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatEuroDecimal(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(part: number, total: number): string {
  if (total <= 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}
