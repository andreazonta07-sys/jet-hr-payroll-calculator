/** Nome del comune di residenza, scelto tramite autocomplete da src/lib/comuni.ts. */
export type Citta = string;

export type TipoContratto = "Tempo Indeterminato" | "Tempo Determinato";

export interface IrpefScaglione {
  /** Limite superiore dello scaglione in euro. Usare Infinity per l'ultimo scaglione. */
  upTo: number;
  /** Aliquota percentuale (es. 23 = 23%) */
  rate: number;
}

export interface DetrazioniLavoroParams {
  /** Importo detrazione massima per redditi fino a sogliaBassa */
  importoBase: number;
  /** Soglia reddito fino a cui si applica l'importo pieno */
  sogliaBassa: number;
  /** Soglia intermedia (fine seconda fascia decrescente) */
  sogliaMedia: number;
  /** Soglia oltre la quale la detrazione si azzera */
  sogliaAlta: number;
}

export interface TaxSettings {
  inpsRateDipendente: number; // %
  inpsAggiuntivoDeterminato: number; // % extra per tempo determinato
  irpefScaglioni: IrpefScaglione[];
  /** Aliquota addizionale regionale IRPEF (%), per nome regione. */
  addizionaliRegionali: Record<string, number>;
  /** Eccezioni comunali curate (%), per nome comune. I comuni non presenti usano aliquotaComunaleDefault. */
  addizionaliComunali: Record<string, number>;
  /** Aliquota addizionale comunale (%) usata per tutti i comuni non presenti in addizionaliComunali. */
  aliquotaComunaleDefault: number;
  detrazioniLavoro: DetrazioniLavoroParams;
  costoAziendaMoltiplicatore: number; // es. 1.30
}

export interface CalculatorInput {
  ral: number;
  tipoContratto: TipoContratto;
  citta: Citta;
  mensilita: 13 | 14;
  giorniLavorati: number;
}

export interface CalculationResult {
  ral: number;
  ralEffettiva: number; // rapportata ai giorni lavorati
  inpsDipendente: number;
  imponibileIrpef: number;
  irpefLorda: number;
  detrazioniLavoro: number;
  irpefNetta: number;
  addizionaleRegionale: number;
  addizionaleComunale: number;
  totaleTrattenute: number;
  nettoAnnuale: number;
  nettoMensile: number;
  costoAzienda: number;
}

export interface HistoryRecord extends CalculatorInput {
  id: string;
  createdAt: string; // ISO date
  result: CalculationResult;
  simulato?: boolean;
}
