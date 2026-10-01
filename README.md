# WB3 Stats

De statistieken van WB3, seizoen 2026/27: uitslagen, topscorers, assists, Snuiters, minuten en trainingsopkomst.

## Updaten

Open een nieuwe chat in Claude Code **in deze map** (`wb3-stats`), upload de nieuwe `WB3 Stats.xlsx` en vraag om een update. Claude doet dan het volgende:

- leest de Excel in en controleert hem;
- meldt eventuele fouten;
- zet de site live.

Zelf doen kan ook:

```bash
cp ~/Downloads/"WB3 Stats.xlsx" data/
python3 build.py
git add -A && git commit -m "Stats bijgewerkt" && git push
```

## Zo vul je de Excel in

| Tabblad | Wat erin staat |
|---|---|
| **Wedstrijden** | Eén rij per wedstrijd: Datum (met tijd), Soort (`Competitie`/`Oefen`), Tegenstander, Waar (`Thuis`/`Uit`), Uitslag, Stats, Bijzonderheden |
| **Competitie** / **Oefen** | Minuten per speler. Kolomkop = datum van de wedstrijd |
| **Training** | 1 = aanwezig, 0 = afwezig. Kolomkop = datum van de training |
| **Selectie** | Handmatige totalen: Goals, Assists, Geel, Rood, Snuiter (competitie en oefen apart) |

**Uitslag** schrijf je als `3-1 (W)`, `2-2 (G)` of `0-2 (V)`.

**Stats** schrijf je zo, met elk kopje op een eigen regel:

```
Doelpunten: Mark 2x, Jur, Tom
Assists: Sander, Mark
Snuiter: Milan
Geel: Felix
Rood: -
```

- Gebruik namen precies zoals in de selectie (`Joey H.`, `Niels v. B.`).
- Een voornaam alleen mag als die uniek is.
- Een eigen goal van de tegenstander schrijf je als `eigen goal`.

**Nieuwe speler?** Voeg hem toe aan alle tabbladen: Selectie, Training, Competitie en Oefen. De volgorde maakt niet uit.

## Techniek

- Een statische site in `site/`. Gewone HTML, CSS en JavaScript, zonder framework.
- `build.py` (Python 3 + openpyxl) zet de Excel om naar `site/assets/data.js`.
- Hosting via GitHub Pages: elke push naar `main` gaat automatisch live.
- Alle teksten staan in `site/assets/copy.js`.

Lokaal bekijken:

```bash
python3 -m http.server 8321 --directory site
```
