# Jet HR — Calcolatore Busta Paga

Single-page app Next.js che calcola stipendio netto a partire dalla RAL,
con doppia vista (Calcolatore pubblico + Gestionale/Admin) e una sezione
di lead generation ispirata a [Jet HR](https://www.jethr.com).

> Demo non ufficiale realizzata a scopo dimostrativo. Non affiliata a Jet HR S.r.l.

## Stack tecnico

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS 4** per lo styling
- **Recharts** per i grafici (stacked bar, grouped bar)
- **Lucide Icons** per le icone
- **React Context + localStorage** per stato globale (parametri fiscali e storico calcoli) — nessun backend richiesto

## Setup

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). Il progetto è già inizializzato come repository Git locale con un `.gitignore` pronto per GitHub (ignora `node_modules`, `.next`, `.env*`, ecc.).

Comandi utili:

```bash
npm run build   # build di produzione
npm run start   # avvia la build di produzione
npm run lint    # ESLint
```

## Architettura del progetto

```
src/
├── app/
│   ├── layout.tsx        # layout root, metadata, font
│   └── page.tsx           # entry point: switcher tra vista Calcolatore/Admin
├── components/
│   ├── Header.tsx          # header con switcher "Calcolatore" / "Admin"
│   ├── CalculatorView.tsx  # composizione vista pubblica
│   ├── AdminView.tsx       # composizione vista gestionale
│   ├── calculator/         # form, metriche, grafici, tabella dettaglio
│   ├── admin/               # editor regole fiscali, storico calcoli
│   └── jethr/                # sezione promo Jet HR, modale lead gen
├── context/
│   └── AppContext.tsx      # React Context: settings fiscali + storico, persistiti in localStorage
└── lib/
    ├── types.ts             # modelli TypeScript condivisi
    ├── taxEngine.ts         # motore di calcolo busta paga
    ├── defaultSettings.ts   # parametri fiscali di default (seed)
    ├── mockData.ts          # storico calcoli simulato (10 record)
    └── useLocalStorage.ts   # hook di persistenza generico
```

Non c'è alcun server/database: tutto lo stato (parametri fiscali editabili
e storico calcoli) vive in `localStorage` tramite `AppContext`, così le
modifiche fatte nel pannello Admin si riflettono immediatamente nel
Calcolatore, anche dopo un refresh della pagina.

## Logica di calcolo fiscale (`src/lib/taxEngine.ts`)

Il calcolo è volutamente semplificato a fini dimostrativi (anno di
riferimento 2024) ma segue il flusso reale di una busta paga italiana:

1. **RAL effettiva** = `RAL × (giorni lavorati / 365)`
2. **INPS Dipendente** = `RAL effettiva × aliquota INPS` (+ aggiuntivo 1,4% per contratti a tempo determinato, contributo addizionale ASpI)
3. **Imponibile IRPEF** = `RAL effettiva − INPS Dipendente`
4. **IRPEF Lorda**: calcolata a scaglioni progressivi marginali (23% / 35% / 43%, soglie editabili)
5. **Detrazioni da Lavoro Dipendente**: formula a fasce basata sull'imponibile (piena fino a €15.000, decrescente fino a €50.000, zero oltre)
6. **IRPEF Netta** = `IRPEF Lorda − Detrazioni`
7. **Addizionali Regionale e Comunale**: percentuali per città (Milano, Roma, Torino, Bologna), applicate sull'imponibile IRPEF
8. **Netto Annuale** = `RAL effettiva − (INPS + IRPEF Netta + Addizionali)`
9. **Netto Mensile** = `Netto Annuale / numero mensilità` (13 o 14)
10. **Costo Azienda** = `RAL × moltiplicatore` (default 1,30x, per stimare contributi datoriali e TFR)

Tutti i parametri di cui sopra (aliquote, scaglioni, addizionali,
detrazioni, moltiplicatore costo azienda) sono modificabili dal pannello
Admin senza toccare il codice.

## Vista Calcolatore (pubblica)

- Form con RAL (input + slider), tipo contratto, città, mensilità, giorni lavorati
- Card riepilogo: Netto Mensile, Netto Annuale, Totale Trattenute
- **Grafico A — "La Colonna della RAL"**: stacked bar chart che scompone il 100% della RAL nelle sue componenti, con legenda dettagliata (€ e %)
- **Grafico B — "Confronto con le Medie & Costo Azienda"**: grouped bar chart che confronta netto attuale, media storico simulazioni e costo azienda
- Tabella accordion col dettaglio passo-passo da RAL lorda a netto finale
- Sezione promozionale Jet HR (vedi sotto)

## Pannello Admin/Gestionale (`/` — vista "Admin", nessuna password)

### A. Configurazione Regole Fiscali
Editor no-code per: aliquota INPS dipendente, aggiuntivo tempo
determinato, scaglioni IRPEF (soglie e aliquote), addizionali regionali e
comunali per città, parametri delle detrazioni da lavoro, moltiplicatore
costo azienda. Pulsante **"Salva e Applica al Calcolatore"** propaga le
modifiche allo stato globale (e a `localStorage`); **"Ripristina
Default"** riporta ai valori seed.

### B. Storico Calcoli Effettuati
Tabella con badge **"⚠️ Dati Simulati di Esempio"**, pre-popolata con 10
record mock generati proceduralmente con il motore di calcolo reale.
Include: ricerca per RAL/città, filtro per tipo contratto, eliminazione
record, esportazione CSV (`;`-separated, formato Excel IT).

## Sezione Jet HR — Growth & Lead Generation

Pensata come showcase di **Product-Led Growth**: il calcolatore gratuito
è il "prodotto di ingresso" che genera valore immediato (stima netto
busta paga) e converte il traffico organico in lead qualificati per Jet
HR, senza bisogno di un team commerciale outbound.

- **Banner prodotto**: headline/subheadline orientate al beneficio ("Basta calcoli manuali in Excel"), video/reel verticale placeholder (src personalizzabile in `src/components/jethr/PromoSection.tsx` → costante `JET_HR_VIDEO_SRC`)
- **CTA primaria (lead magnet)**: "Scarica l'Ebook Gratuito: Guida al Cuneo Fiscale" → apre modale di raccolta email (`EbookModal.tsx`), pronta per essere collegata a un CRM/ESP reale
- **CTA secondaria**: "Richiedi una Demo di Jet HR" → link diretto al sito ufficiale (`JET_HR_WEBSITE_URL`)
- **Social proof**: badge di fiducia (valutazione clienti, aziende gestite, tempo di risposta assistenza)
- **Footer social**: link ai canali ufficiali Jet HR (LinkedIn, Instagram, YouTube, X, Facebook)

### Strategia PLG per Jet HR

1. **Top of funnel**: il calcolatore risolve un problema concreto (quanto netto percepisco con questa RAL?) senza richiedere login → alto traffico organico/SEO e passaparola HR
2. **Middle of funnel**: l'ebook sul cuneo fiscale converte il visitatore anonimo in lead con email, segmentabile per follow-up commerciale
3. **Bottom of funnel**: la CTA "Richiedi Demo" intercetta chi ha già capito il valore del tool e vuole automatizzare l'intero processo payroll, non solo simularlo
4. **Retention/expansion**: il Grafico B (confronto costo azienda vs netto) introduce l'HR/founder al concetto di costo del lavoro totale, aprendo la conversazione su moduli aggiuntivi Jet HR (presenze, assunzioni, gestione documentale)

## Personalizzazione rapida

- Video promo: `src/components/jethr/PromoSection.tsx` → `JET_HR_VIDEO_SRC`
- Link sito Jet HR: stessa constante `JET_HR_WEBSITE_URL`
- Città supportate: `src/lib/defaultSettings.ts` → `CITTA_OPTIONS` (aggiungere anche le relative aliquote in `DEFAULT_TAX_SETTINGS`)
- Parametri fiscali di default: `src/lib/defaultSettings.ts`
