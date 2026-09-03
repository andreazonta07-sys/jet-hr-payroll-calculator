import { TaxSettings } from "./types";

/**
 * Parametri fiscali di default (anno di riferimento 2024, valori semplificati
 * a fini dimostrativi). Tutti i valori sono editabili dal pannello Admin e
 * persistiti in localStorage: questa costante e' solo il seed iniziale.
 */
export const DEFAULT_TAX_SETTINGS: TaxSettings = {
  inpsRateDipendente: 9.19,
  inpsAggiuntivoDeterminato: 1.4,
  inpsRateApprendistato: 5.84,
  irpefScaglioni: [
    { upTo: 28000, rate: 23 },
    { upTo: 50000, rate: 35 },
    { upTo: Infinity, rate: 43 },
  ],
  addizionaliRegionali: {
    Abruzzo: 1.73,
    Basilicata: 1.23,
    Calabria: 1.73,
    Campania: 1.73,
    "Emilia-Romagna": 1.33,
    "Friuli-Venezia Giulia": 1.23,
    Lazio: 1.73,
    Liguria: 1.23,
    Lombardia: 1.23,
    Marche: 1.23,
    Molise: 1.73,
    Piemonte: 1.62,
    Puglia: 1.33,
    Sardegna: 1.23,
    Sicilia: 1.23,
    Toscana: 1.42,
    "Trentino-Alto Adige": 0.5,
    Umbria: 1.23,
    "Valle d'Aosta": 1.23,
    Veneto: 1.23,
  },
  addizionaliComunali: {
    Milano: 0.8,
    Roma: 0.9,
    Torino: 0.8,
    Bologna: 0.8,
  },
  aliquotaComunaleDefault: 0.7,
  detrazioniLavoro: {
    importoBase: 1955,
    sogliaBassa: 15000,
    sogliaMedia: 28000,
    sogliaAlta: 50000,
  },
  costoAziendaMoltiplicatore: 1.3,
};
