# WB3 Stats

Statische website met de voetbalstatistieken van WB3 (seizoen 2026/27).
Geen framework en geen npm. Het enige wat nodig is: Python 3 met `openpyxl`.

- Live: https://wb3stats.nl (eigen domein; https://jelmersma.github.io/wb3-stats/ stuurt daarheen door)
- DNS: Cloudflare (nameservers hugh/olga). Records op **DNS only** (grijze wolk), anders werkt het GitHub-certificaat niet.
- Repo: https://github.com/Jelmersma/wb3-stats (publiek, GitHub Pages via Actions)

## Structuur

- `data/WB3 Stats.xlsx`: de bron, de Excel van Felix. Elke update overschrijft dit bestand.
- `build.py`: leest de Excel, controleert hem en schrijft `site/assets/data.js`. Zet ook cache-busters (`?v=`) in de HTML.
- `site/`: precies wat online komt, via GitHub Pages (`.github/workflows/deploy.yml`, bij elke push naar `main`).
  - `index.html`, `spelers.html`, `speler.html?id=…`, `wedstrijden.html`, `training.html`: lege schillen met `data-page`.
  - `assets/app.js`: rendert alle pagina's uit `WB3_DATA` + `WB3_COPY`.
  - `assets/copy.js`: **alle** teksten. De tone of voice zit hier, nergens anders.
  - `assets/style.css`: opmaak, design tokens bovenaan (licht + donker).
  - `assets/data.js`: gegenereerd, nooit met de hand aanpassen.

## Update-procedure

Felix uploadt in de chat een nieuwe versie van de Excel en vraagt om een update.

1. Kopieer de geüploade Excel naar `data/WB3 Stats.xlsx` (overschrijven).
1b. Werk de competitiestand bij (zie *Competitiestand* hieronder).
1c. Meldt de build dat een telefoon-update "nu ook in de Excel" staat? Haal die regel uit `data/updates.json`.
2. Draai `python3 build.py`.
3. Lees het rapport:
   - **Opmerkingen**: automatische correcties (bv. jaartal). Kort noemen, verder geen actie.
   - **CONTROLEREN**: mogelijke fouten in de Excel. Staat een melding niet onder *Bekende meldingen* hieronder? Leg hem dan aan Felix voor en vraag of hij het eerst wil fixen of het zo live wil. Push niet stilletjes data waarvan je vermoedt dat die niet klopt.
4. Check het resultaat lokaal (`python3 -m http.server 8321 --directory site`): het overzicht, de laatste wedstrijd en de klassementen.
5. Commit en push: `git add -A && git commit -m "Stats bijgewerkt t/m <datum laatste wedstrijd>" && git push`.
6. GitHub Pages zet het binnen ±1 minuut live. Meld Felix kort wat er nieuw is (uitslag, topscorer, opvallende dingen).

### Update via de telefoon (cloud-sessie in de Claude-app)

Felix typt op zijn telefoon zoiets als: *"WB3 – Merino's 3-1 gewonnen. Goals Tom 2x, Mark. Assists Sander, Hanna. Snuiter Mark. Minuten: Tom 90, Mark 60, …"*
Er is dan geen Excel. Je werkt in een cloud-sessie: geen browser, wel git en Python. `openpyxl` wordt geïnstalleerd door de SessionStart-hook in `.claude/settings.json`.

1. **Wedstrijd zoeken:** zoek de datum en tegenstander op in tabblad Wedstrijden van `data/WB3 Stats.xlsx`. Dat is de eerstvolgende wedstrijd zonder uitslag, tenzij Felix iets anders zegt.
2. **Toevoegen aan `data/updates.json`:** voeg een object toe aan de lijst:
   ```json
   {"datum": "2026-10-10", "tegenstander": "De Merino's 2", "uitslag": "3-1 (W)",
    "stats": "Doelpunten: Tom 2x, Mark\nAssists: Sander, Hanna\nSnuiter: Mark",
    "bijzonderheden": "optioneel",
    "minuten": {"Tom": 90, "Mark": 60, "Niels v. B.": 90}}
   ```
   - De uitslag altijd met `(W/G/V)`.
   - Namen zoals in de selectie. Is een naam onduidelijk, vraag het.
   - `minuten` is optioneel: alleen spelers die gespeeld hebben, hele getallen van 1 t/m 90. Stuurt Felix geen minuten, laat het veld dan weg.
3. **Bouwen:** draai `python3 build.py`.
   - De opmerkingen over ontbrekende minuten (als Felix ze niet meestuurde) en een achterlopende stand zijn bij een telefoon-update normaal.
   - Met minuten controleert het script dat ze optellen tot 990 (11 x 90) en dat iedereen bij Doelpunten/Assists/Snuiter minuten heeft. Wijkt het af, vraag het Felix (vergeten speler, of met 10 gespeeld?).
   - **CONTROLEREN**-meldingen leg je aan Felix voor, net als bij een Excel-update.
4. **Pushen:** commit en push **direct naar `main`**: `git push origin HEAD:main`. Lukt dat niet, maak dan een PR en zeg Felix dat hij die in de GitHub-app moet mergen.
5. **Melden:** meld Felix kort wat er live staat.

Wat in een cloud-sessie **niet** kan:
- de competitiestand bijwerken (stap 1b, er is geen browser). Dat gebeurt bij de volgende update vanaf de Mac. De site meldt zolang dat de stand achterloopt.

**Excel wint.** Zodra de Excel de uitslag van een wedstrijd heeft, negeert `build.py` de telefoon-update daarvan (ook de minuten). Staan de minuten van die datum al in tabblad Competitie/Oefen, dan winnen die ook.
- Komt de uitslag overeen, dan staat er een opmerking "mag uit data/updates.json". Haal die regel dan weg.
- Wijkt de uitslag af, dan meldt het script een **CONTROLEREN**. Leg die aan Felix voor.

### Competitiestand

- **Waar staat hij:** de stand komt van de clubsite (https://www.vvwoudenberg.nl/424/14594/competitie/) en staat in `data/stand.json`.
- **Niet via een script:** de clubsite zit achter Cloudflare-botbeveiliging. `curl` en GitHub Actions worden geblokkeerd. **Omzeil dat niet.**
- **Wel via het browservenster:** open de pagina daar (cookiemelding: "niet toestaan") en voer dit uit met `javascript_tool`:

  ```js
  JSON.stringify({ competitie: document.title.split(" - ")[0].trim(), rows: [...document.querySelectorAll("table.StandTabel tbody tr")].map(tr => { const c = [...tr.children].map(td => td.textContent.trim()); return { pos: +c[0], team: c[1], played: +c[2], w: +c[3], d: +c[4], l: +c[5], pts: +c[6], gf: +c[7], ga: +c[9], pm: +c[10] }; }) })
  ```

- **Opslaan:** schrijf het resultaat naar `data/stand.json`, met `"bron"` (de URL) en `"opgehaald"` (datum van vandaag, `YYYY-MM-DD`) erbij.
- **Controle:** `build.py` vergelijkt de regel van `Woudenberg 3` met de Excel en meldt het als de stand verouderd is of afwijkt. Het meldt ook een tegenstander die niet in de stand voorkomt.

### Bekende meldingen (geaccepteerd)

- Nog geen.

## Hoe de data gelezen wordt (belangrijk)

- Alles wordt **op naam** gekoppeld, nooit op rijnummer. De formules in tabblad Selectie (minuten, trainingen) worden genegeerd, omdat die eerder scheef liepen.
- Minuten en wedstrijden komen uit de tabbladen `Competitie` en `Oefen` (kolomkop = datum). Een kolom wordt aan een wedstrijd in `Wedstrijden` gekoppeld via dezelfde datum en soort.
- Trainingen komen uit `Training`. Een datumkolom telt als gehouden zodra er iemand een waarde heeft.
- Goals, assists, Snuiter, geel en rood (seizoenstotalen) komen uit de **handmatige kolommen in Selectie**. Per-wedstrijd details komen uit de kolom `Stats` in `Wedstrijden`. Het script controleert of die twee bronnen overeenkomen.
- Uitslag: `x-y (W/G/V)`. De letter bepaalt wie er won, dus de volgorde van de cijfers maakt niet uit.
- Jaartallen: het seizoen loopt van juli t/m juni. Datums die in het verkeerde jaar staan, worden automatisch gecorrigeerd.
- Namen in de Stats-tekst die niet in de selectie staan (leenspelers), tellen mee voor de wedstrijd maar niet in de spelersstats. Daarover verschijnt een melding.
- Bijnamen/alternatieve namen in de Stats-tekst staan in `ALIASES` bovenin `build.py` (bv. "Robin H." = Hanna). Bevestigt Felix dat een onbekende naam een bestaande speler is, voeg hem daar toe.
- Krijg je aanvullingen in de chat (bv. een vergeten Assists-regel)? Werk dan `data/WB3 Stats.xlsx` bij met openpyxl (laden zónder `data_only`, zodat formules blijven) en vraag Felix het ook in zijn eigen Excel te zetten. Anders verdwijnt het bij de volgende upload weer.

## Tekst en tone of voice

Alle zichtbare tekst staat in `site/assets/copy.js`. Voeg in `app.js` geen losse strings toe: maak een sleutel in `copy.js` en gebruik `t("pad.naar.sleutel")`.

Volg [TONE_OF_VOICE.md](TONE_OF_VOICE.md) voor toon, woordkeuze, design en vooral de **grenzen**. De site is openbaar: geen grappen over partners, exen, gezondheid, politiek of privézaken, ook niet als ze in de teamapp wel voorkomen.

## Privé bronmateriaal

- Screenshots (`IMG_*.png`) en WhatsApp-exports horen nooit in de repo. Ze staan in `.gitignore`.
- Controleer vóór elke commit met `git status` dat er geen foto's of chatbestanden meegaan.
