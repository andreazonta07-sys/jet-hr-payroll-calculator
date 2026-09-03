import { TaxSettings } from "./types";

/**
 * Parametri fiscali di default (anno di riferimento 2024, valori semplificati
 * a fini dimostrativi). Tutti i valori sono editabili dal pannello Admin e
 * persistiti in localStorage: questa costante e' solo il seed iniziale.
 */
export const DEFAULT_TAX_SETTINGS: TaxSettings = {
  inpsRateDipendente: 9.19,
  inpsAggiuntivoDeterminato: 1.4,
  irpefScaglioni: [
    { upTo: 28000, rate: 23 },
    { upTo: 50000, rate: 35 },
    { upTo: Infinity, rate: 43 },
  ],
  addizionaliRegionali: {
    Milano: 1.23,
    Roma: 1.73,
    Torino: 1.62,
    Bologna: 1.33,
  },
  addizionaliComunali: {
    Milano: 0.8,
    Roma: 0.9,
    Torino: 0.8,
    Bologna: 0.8,
  },
  detrazioniLavoro: {
    importoBase: 1955,
    sogliaBassa: 15000,
    sogliaMedia: 28000,
    sogliaAlta: 50000,
  },
  costoAziendaMoltiplicatore: 1.3,
};

export const CITTA_OPTIONS = [
  { value: "Milano", label: "Milano (Lombardia)" },
  { value: "Roma", label: "Roma (Lazio)" },
  { value: "Torino", label: "Torino (Piemonte)" },
  { value: "Bologna", label: "Bologna (Emilia-Romagna)" },
] as const;
