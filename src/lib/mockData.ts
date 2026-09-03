import { DEFAULT_TAX_SETTINGS } from "./defaultSettings";
import { calcolaBustaPaga } from "./taxEngine";
import { CalculatorInput, Citta, HistoryRecord, TipoContratto } from "./types";

interface MockSeed {
  ral: number;
  tipoContratto: TipoContratto;
  citta: Citta;
  mensilita: 13 | 14;
  giorniLavorati: number;
  daysAgo: number;
}

const SEEDS: MockSeed[] = [
  { ral: 28000, tipoContratto: "Tempo Indeterminato", citta: "Milano", mensilita: 13, giorniLavorati: 365, daysAgo: 42 },
  { ral: 32500, tipoContratto: "Tempo Indeterminato", citta: "Roma", mensilita: 14, giorniLavorati: 365, daysAgo: 38 },
  { ral: 45000, tipoContratto: "Tempo Indeterminato", citta: "Milano", mensilita: 13, giorniLavorati: 365, daysAgo: 35 },
  { ral: 24000, tipoContratto: "Tempo Determinato", citta: "Torino", mensilita: 13, giorniLavorati: 240, daysAgo: 30 },
  { ral: 60000, tipoContratto: "Tempo Indeterminato", citta: "Bologna", mensilita: 13, giorniLavorati: 365, daysAgo: 27 },
  { ral: 38000, tipoContratto: "Tempo Indeterminato", citta: "Roma", mensilita: 13, giorniLavorati: 365, daysAgo: 21 },
  { ral: 29500, tipoContratto: "Tempo Determinato", citta: "Milano", mensilita: 14, giorniLavorati: 300, daysAgo: 15 },
  { ral: 52000, tipoContratto: "Tempo Indeterminato", citta: "Torino", mensilita: 13, giorniLavorati: 365, daysAgo: 11 },
  { ral: 33000, tipoContratto: "Tempo Indeterminato", citta: "Bologna", mensilita: 14, giorniLavorati: 365, daysAgo: 6 },
  { ral: 41000, tipoContratto: "Tempo Indeterminato", citta: "Milano", mensilita: 13, giorniLavorati: 365, daysAgo: 2 },
];

function seedToRecord(seed: MockSeed, index: number): HistoryRecord {
  const input: CalculatorInput = {
    ral: seed.ral,
    tipoContratto: seed.tipoContratto,
    citta: seed.citta,
    mensilita: seed.mensilita,
    giorniLavorati: seed.giorniLavorati,
  };
  const result = calcolaBustaPaga(input, DEFAULT_TAX_SETTINGS);
  const createdAt = new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: `mock-${index}`,
    createdAt,
    simulato: true,
    result,
    ...input,
  };
}

export const MOCK_HISTORY: HistoryRecord[] = SEEDS.map(seedToRecord);
