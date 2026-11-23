# Rich World 1.1 — Operazioni nell'Admin Shopify

Il file zip del tema contiene solo grafica e logica. Prodotti, collezioni, menu, pagine e policy si creano nell'Admin Shopify, nell'ordine indicato qui sotto.
Finora **nessuna di queste risorse è stata creata nel negozio**: il connettore Shopify non era collegato.

---

## 1. Carica il tema (non pubblicarlo)
Negozio online → Temi → Aggiungi tema → Carica file zip → `rich-world-theme.zip`.
Lascialo **non pubblicato** finché non hai completato i passaggi seguenti e controllato l'anteprima.

## 2. Metafield prodotto
Impostazioni → Dati personalizzati → Prodotti → Aggiungi definizione. Namespace `custom` (già usato dal tema).

| Nome | Chiave | Tipo | Note |
|---|---|---|---|
| Condizione | `custom.condizione` | Testo a riga singola, valori consentiti: **Nuovo, Usato, Vintage** | Attiva "Filtri" e "Collezioni automatiche" |
| Referenza | `custom.referenza` | Testo a riga singola | |
| Anno | `custom.anno` | Testo a riga singola | Es. "2021" o "anni '90" |
| Materiali | `custom.materiali` | Testo a riga singola | |
| Colore | `custom.colore` | Testo a riga singola | Attiva "Filtri" se utile |
| Scatola e documentazione | `custom.accessori` | Testo multiriga | Es. "Scatola, garanzia" |
| Disponibilità | `custom.disponibilita` | Testo a riga singola | Facoltativo: testo mostrato al posto di "Disponibile" |
| Prezzo su richiesta | `custom.prezzo_su_richiesta` | Vero/falso | Se vero: mostra PRICE ON REQUEST e blocca l'acquisto online |
| Spedizione | `custom.spedizione` | Testo multiriga | Facoltativo: note di spedizione del singolo pezzo |

Metafield collezione (facoltativo): **Colore neon** `custom.colore_neon`, di tipo Colore.

I campi nativi restano: Titolo, Descrizione, Fornitore (= **marchio**), Tipo di prodotto (= **categoria**), Tag (= **sottocategoria**), Prezzo, SKU, Quantità, Immagini.

## 3. Regole per i dati prodotto
- **Marchio** → campo *Fornitore*, con grafia esatta: Rolex · Audemars Piguet · Cartier · Patek Philippe · Swatch · Hermès · Louis Vuitton · Gucci · Prada
- **Categoria** → *Tipo di prodotto*: Orologi · Gioielli · Borse · Accessori
- **Sottocategoria** → *Tag*, esattamente così:
  - Orologi: `Di lusso`, `Vintage e da collezione`
  - Gioielli: `Diamanti`, `Collane e catene`, `Bracciali`, `Anelli`, `Tennis`, `Iced-out` (un pezzo può averne più di uno, es. Bracciali + Tennis)
  - Borse: `Di lusso`, `Da collezione`
  - Accessori: `Cinture`, `Occhiali`, `Portafogli`, `Piccola pelletteria`, `Esclusivi`
- **Condizione** → metafield Condizione (Nuovo / Usato / Vintage). Le collezioni "nuovi", "pre-owned" e "vintage" la usano.
- **Prezzo su richiesta** → prezzo 0 € oppure metafield Prezzo su richiesta = vero (oppure il tag `price-on-request`, ancora supportato).

## 4. Importa i prodotti
Prodotti → Importa → `prodotti-demo.csv` (4 record **DEMO**, in bozza, fornitore "DEMO", prezzo su richiesta) per vedere come si comporta il tema.
Per i pezzi veri usa `prodotti-modello-vuoto.csv` (solo intestazioni). Le colonne dei metafield si importano solo se il passo 2 è già fatto.
**Cancella i record DEMO prima di andare online.** Non inserire prezzi, referenze o certificati non verificati.

## 5. Collezioni automatiche (32)
Prodotti → Collezioni → Crea collezione → *Automatica*, "tutte le condizioni". L'elenco completo, con handle, condizioni, template, descrizione e titolo SEO, è in `collezioni.csv`.
- **4 categorie**: `orologi`, `gioielli`, `borse`, `accessori` (Tipo di prodotto è uguale a …)
- **19 sottocategorie** (Tipo + Tag oppure Tipo + Condizione)
- **9 marchi**: `rolex`, `audemars-piguet`, `cartier`, `patek-philippe`, `swatch`, `hermes`, `louis-vuitton`, `gucci`, `prada` (Fornitore è uguale a …). Per queste scegli il **modello di tema `collection.brand`**.

Un orologio Cartier compare così sia in Orologi sia in Cartier.
Se la condizione sul metafield non compare tra le opzioni delle collezioni, controlla che al passo 2 sia attiva "Collezioni automatiche" sulla definizione Condizione.

## 6. Filtri (Search & Discovery)
Installa l'app gratuita **Shopify Search & Discovery** → Filtri → aggiungi: Disponibilità, Prezzo, Fornitore (Marchio), Tipo di prodotto (Categoria), Tag (Sottocategoria), Metafield Condizione. Il tema li mostra da solo come menu a tendina, insieme all'ordinamento.

## 7. Pagine
Negozio online → Pagine → Aggiungi pagina. Crea tutte le pagine come **nascoste** e incolla il testo dal file HTML corrispondente (in `pagine/`, da aprire con un editor di testo e incollare nella vista HTML `<>`).

| Pagina | Handle | Modello tema |
|---|---|---|
| Giacomino | `storia` | page.storia |
| Fiducia | `fiducia` | page.fiducia |
| Marchi (Shop by Brand) | `marchi` | page.marchi |
| Contatti | `contatti` | page.contatti (testo: `contatti.html`) |
| Cookie Policy | `cookie-policy` | page.legal |
| Diritto di recesso | `diritto-di-recesso` | page.legal |
| Garanzia e assistenza | `garanzia-e-assistenza` | page.legal |
| Pagamenti | `pagamenti` | page.legal |
| Autenticità e condizioni | `autenticita-e-condizioni` | page.legal |

**Policy native** (Impostazioni → Policy), da `pagine/`: Informativa sulla privacy ← `privacy-policy.html` · Termini di servizio ← `termini-e-condizioni.html` · Politica di spedizione ← `spedizioni-e-consegne.html` · Politica di rimborso ← `resi-e-rimborsi.html` · Informazioni di contatto ← `contatti.html`.

Ogni testo contiene campi **[DA COMPLETARE]**. Finché ci sono, la pagina mostra l'avviso "Bozza da completare". Vanno fatti revisionare a un consulente prima della pubblicazione.

## 8. Menu (Negozio online → Navigazione)
**main-menu** (header):
- HOME → Home
- OROLOGI → collezione `orologi`, con sotto-voci: Tutti gli orologi (`orologi`), Orologi di lusso, Orologi vintage e da collezione, Orologi nuovi, Orologi pre-owned
- GIOIELLI → `gioielli`, con sotto-voci: Tutti i gioielli, Diamanti, Collane e catene, Bracciali, Anelli, Tennis, Gioielli iced-out
- BORSE → `borse`, con sotto-voci: Tutte le borse, Borse di lusso, Borse vintage, Borse pre-owned, Borse da collezione
- ACCESSORI → `accessori`, con sotto-voci: Tutti gli accessori, Cinture, Occhiali, Portafogli, Piccola pelletteria, Accessori esclusivi
- MARCHI → pagina `marchi`, con sotto-voci: i 9 marchi (collezioni marchio)
- CONTATTI → pagina `contatti`

**footer** (colonna Explore): Orologi, Gioielli, Borse, Accessori
**footer-brands** (colonna Brands): i marchi principali
**customer-care** (colonna Customer Care): Privacy Policy, Cookie Policy, Termini e condizioni, Spedizioni, Resi, Contatti

Gli handle `footer-brands` e `customer-care` vanno scritti esattamente così, perché il tema li cerca con questi nomi. In alternativa, scegli i menu nell'editor: Footer → Menu colonna 3 / 4.

## 9. Impostazioni del tema (editor → Impostazioni tema)
- **WhatsApp e contatti**: già compilati con il numero e la sede di Giacomino.
- **Vendita**: carrello **spento** (vetrina con WhatsApp). Non attivarlo finché i prodotti non sono verificati. Con il carrello attivo, i pezzi a prezzo su richiesta restano comunque non acquistabili online.
- **Spedizioni**: lascia "Servizio confermato" spento. Quando il corriere specializzato è confermato, compila nome, tracciabilità e assicurazione (solo dati reali) e accendilo. Imposta "Pagina Spedizioni e consegne" su `/policies/shipping-policy`.
- Nell'editor, controlla che i blocchi Boutique e Shop by Brand puntino alle collezioni giuste (sono preimpostati con gli handle sopra).

## 10. Prima di pubblicare
- Cancella i prodotti DEMO.
- Completa e fai revisionare tutti i campi [DA COMPLETARE].
- Attiva il banner cookie (Impostazioni → Privacy dei clienti).
- Togli la password del negozio solo dopo questi controlli.

---

# Report dei test (23 nov 2026)

**Controllo automatico**: Shopify Theme Check, 0 errori e 0 avvisi su tutti i file.

**Anteprima locale**: il tema è stato reso con dati di prova (renderer Liquid locale con prodotti, menu e pagine finti) e controllato nel browser a 1440 px (desktop) e 390 px (mobile, touch).

| Area | Desktop | Mobile | Note |
|---|---|---|---|
| Hero 3D + Giacomino | ✓ | ✓ | Il menu non si sovrappone all'hero |
| Header con 7 voci + tendine | ✓ | – | Sotto 1100 px passa al menu a scomparsa |
| Mega menu Marchi (3 colonne) | ✓ | – | Apertura al passaggio del mouse, al clic e da tastiera (Freccia giù, Esc) |
| Menu mobile a sezioni espandibili | – | ✓ | Testato al tocco |
| 4 boutique | ✓ (4 in riga) | ✓ (carosello) | Corretto il troncamento dei nomi lunghi |
| Shop by Brand, 9 marchi | ✓ (3×3) | ✓ (2 colonne) | Corretto l'a capo di "Audemars Piguet" |
| Luxury Delivery | ✓ | ✓ | Mostra solo il testo neutro finché il servizio non è confermato |
| Pagina marchio vuota | ✓ | ✓ | Stato "in arrivo" con WhatsApp |
| Pagina collezione con filtri e ordinamento | ✓ | ✓ | I filtri reali dipendono da Search & Discovery |
| Scheda prodotto | ✓ | ✓ | Nuovi campi: categoria, anno, colore, SKU, spedizione |
| Pagina legale (bozza) | ✓ | ✓ | Avviso "Bozza da completare" |
| Contatti con modulo Shopify | ✓ | ✓ | |
| Footer a 4 colonne | ✓ | ✓ (2 colonne → 1) | |

**Non ancora testato**: il rendering reale dentro Shopify (filtri veri, modulo contatti, carrello e checkout). Si fa dopo il caricamento, con l'anteprima del tema non pubblicato.
