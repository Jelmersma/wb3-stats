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
2. Draai `python3 build.py`.
3. Lees het rapport:
   - **Opmerkingen**: automatische correcties (bv. jaartal). Kort noemen, verder geen actie.
   - **CONTROLEREN**: mogelijke fouten in de Excel. Staat een melding niet onder *Bekende meldingen* hieronder? Leg hem dan aan Felix voor en vraag of hij het eerst wil fixen of het zo live wil. Push niet stilletjes data waarvan je vermoedt dat die niet klopt.
4. Check het resultaat lokaal (`python3 -m http.server 8321 --directory site`): het overzicht, de laatste wedstrijd en de klassementen.
5. Commit en push: `git add -A && git commit -m "Stats bijgewerkt t/m <datum laatste wedstrijd>" && git push`.
6. GitHub Pages zet het binnen ±1 minuut live. Meld Felix kort wat er nieuw is (uitslag, topscorer, opvallende dingen).

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

## Tekst en tone of voice

Alle zichtbare tekst staat in `site/assets/copy.js`. Voeg in `app.js` geen losse strings toe: maak een sleutel in `copy.js` en gebruik `t("pad.naar.sleutel")`.

Volg [TONE_OF_VOICE.md](TONE_OF_VOICE.md) voor toon, woordkeuze, design en vooral de **grenzen**. De site is openbaar: geen grappen over partners, exen, gezondheid, politiek of privézaken, ook niet als ze in de teamapp wel voorkomen.

## Privé bronmateriaal

- Screenshots (`IMG_*.png`) en WhatsApp-exports horen nooit in de repo. Ze staan in `.gitignore`.
- Controleer vóór elke commit met `git status` dat er geen foto's of chatbestanden meegaan.
