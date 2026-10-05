/*
 * Alle teksten van de site staan hier, in de WB3-tone of voice (zie TONE_OF_VOICE.md).
 * {naam} wordt ingevuld door de site. Een functie mag ook, bv. voor enkelvoud/meervoud
 * of een tekst die afhangt van de uitslag.
 * Een lijst [ ... ] = varianten. De site kiest er vast één per speler/wedstrijd,
 * zodat niet overal hetzelfde zinnetje staat. Varianten toevoegen mag altijd.
 */
window.WB3_COPY = {
  site: {
    team: "WB3",
    logoSub: "Stats",
    title: "WB3 Stats",
    updated: "Bijgewerkt op {date}",
    season: "Seizoen {season}",
    footer:
      "Klachten over je statistieken? Ga eerst bij jezelf te rade. Grote kans dat het is opgelost. Nog steeds een probleem? Meld je bij de technische staf. Gaat waarschijnlijk niks opleveren.",
    skip: "Naar de inhoud",
  },

  nav: {
    label: "Hoofdmenu",
    home: "Overzicht",
    players: "Selectie",
    matches: "Wedstrijden",
    training: "Training",
  },

  soort: { comp: "Competitie", oefen: "Oefenpot", all: "Alles" },
  result: { W: "Winst", G: "Gelijk", V: "Verlies" },
  short: { W: "W", G: "G", V: "V" },

  home: {
    eyebrow: "WB3 🟨⬛ Seizoen {season} · Competitie",
    title: "Zo staan we ervoor",
    titleSub: ({ played, v, w }) =>
      played === 0
        ? ["Nog niks gespeeld. Op papier zijn we ongeslagen."]
        : v === 0 && w > 0
          ? [
              "Ongeslagen. Lekker. Maar we hebben nog helemaal niks.",
              `Nog niet verloren. Rustig blijven, het is pas ${played === 1 ? "één potje" : `${played} potjes`}.`,
              "Ongeslagen. De kantine fluistert al over de schaal. Niet doen.",
            ]
          : v === 0
            ? ["Nog niet verloren. Ze moeten er wel een keer in.", "Ongeslagen, maar ook nog niks gewonnen. Komaan."]
            : [
                "Geen man overboord. Elke pot is vanaf nu een finale.",
                "We hebben nog alles in eigen hand. Zeggen we elk jaar.",
                "Op papier gaat het prima. Op het veld komt het nog.",
              ],
    points: "Punten",
    played: "Gespeeld",
    record: "W–G–V",
    goals: "Doelpunten",
    goalDiff: "Doelsaldo",
    form: "Vorm",
    noForm: "Nog geen competitiepot gespeeld.",
    last: "Laatste potje",
    noLast: "Nog niks gespeeld. De spanning stijgt.",
    next: "Matchday",
    noNext: "Geen potjes meer op het programma. Tijd voor het weekendje weg 🎣",
    after: "Voor in de agenda",
    allMatches: "Alle uitslagen",
    allFixtures: "Het hele programma",
    boards: "Klassementen",
    boardsSub: "Competitie, tot nu toe. Gewoon voor de transparantie.",
    allPlayers: "De hele selectie",
  },

  boards: {
    goals: "Topscorers",
    goalsSub: "Wie het netje weet te vinden",
    assists: "Assists",
    assistsSub: "Op een presenteerblaadje",
    snuiter: "Snuiter van de week",
    snuiterSub: "Man of the match. Hoger dan dit wordt het niet.",
    minutes: "Meeste minuten",
    minutesSub: "De kilometervreters",
    training: "Trainingsopkomst",
    trainingSub: "Donderdag op het veld. Of weer een goed argument.",
    cards: "Kaartenboekje",
    cardsSub: "Strijd. Inzet. Beetje zeiken. Soms een gele.",
    empty: ["Nog niemand. Kans!", "Leeg. Wie durft?", "Nog niks. Wie opent het klassement?"],
    more: ({ n }) => (n === 1 ? "en nog 1 strijder" : `en nog ${n} strijders`),
  },

  stats: {
    player: "Speler",
    apps: "Wed.",
    appsLong: "Wedstrijden",
    min: "Min.",
    minLong: "Minuten",
    goals: "Goals",
    assists: "Assists",
    snuiter: "Snuiter",
    geel: "Geel",
    rood: "Rood",
    training: "Training",
    total: "Totaal",
  },

  match: {
    home: "Thuis",
    away: "Uit",
    vs: "vs",
    goals: "Doelpunten",
    assists: "Assists",
    snuiter: "Snuiter",
    geel: "Geel",
    rood: "Rood",
    ownGoal: "Eigen goal",
    notes: "Uit de kleedkamer",
    lineup: ({ n }) => `Wie stonden er (${n})`,
    noLineup: "Geen minuten bekend.",
    today: "Matchday! 🟨⬛",
    tomorrow: "Morgen al. Rustig aan vanavond.",
    inDays: ({ n }) => `Over ${n} dagen`,
    pending: "Uitslag volgt",
    next: "Volgende",
    against: ({ score, opp }) => `${score} tegen ${opp}`,
    // Korte kop boven de uitslag, zoals op de posters in het kanaal
    verdict: ({ result, ours, theirs }) => {
      const diff = ours - theirs;
      if (result === "W" && diff >= 4) return ["Dominant.", "Walk in the park.", "Galacticos.", "Eenrichtingsverkeer."];
      if (result === "W" && diff === 1)
        return ["Zakelijk. Drie punten.", "Mooi is anders. Drie punten.", "Op karakter.", "Lelijk winnen telt ook."];
      if (result === "W") return ["Heerlijk potje.", "Lekker potje.", "Netjes gedaan.", "Zo kan het ook."];
      if (result === "G" && ours === 0) return ["Brilstand. Niemand blij.", "0-0. Daar kwam niemand voor."];
      if (result === "G")
        return ["Kansen genoeg. Ze moeten er wel in.", "Een punt. We nemen het mee.", "Puntendeling. Ze gaan er een keer in."];
      if (diff <= -3) return ["Daar blijven we niet in hangen.", "Pijnlijk. Wissen en door.", "Die vergeten we snel."];
      return ["Geen man overboord.", "Kop op. Volgende week beter.", "We nemen het mee naar de training. Wie er dan is."];
    },
  },

  players: {
    title: "De selectie",
    intro: "Alle strijders op een rij. Tik op een kolom om te sorteren en op een naam voor het hele verhaal.",
  },

  player: {
    eyebrow: "WB3 🟨⬛ Spelersprofiel",
    notFound: "Deze snuiter kennen we niet.",
    back: "Terug naar de selectie",
    summary: ({ apps, min }) =>
      apps === 0
        ? [
            "Nog geen competitieminuut. De technische staf houdt je in de gaten.",
            "Nog geen minuut competitie. Fris als een hoentje voor als het echt moet.",
            "Nog niet in actie geweest. Vast bewaard voor de belangrijke potjes.",
            "0 competitieminuten. Het seizoen is lang. Heel lang.",
          ]
        : `${apps} ${apps === 1 ? "competitiepot" : "competitiepotjes"} · ${min} minuten`,
    tileOefen: ({ v }) => `Oefen: ${v}`,
    trainingPct: "Training",
    trainingOf: ({ att, held }) => `${att} van ${held}`,
    matches: "Wedstrijden",
    didNotPlay: "Niet gespeeld",
    noMatches: "Nog geen wedstrijden gespeeld.",
    training: "Trainingen",
    // Regel onder de trainingsbolletjes. {n} = reeks, {att} = aanwezig, {held} = gehouden
    streak: ({ n, att, held }) => {
      if (att === 0)
        return [
          "Nog geen training gezien. Het veld ligt er elke donderdag, hoor.",
          "Trainingsopkomst: nul. We oordelen niet, we signaleren alleen.",
          "Nog nooit op training gezien. Weet je de weg naar De Grift nog?",
          "0 van {held}. Talent heeft blijkbaar geen onderhoud nodig.",
          "Nog geen donderdag gezien. De goede argumenten worden elke week beter.",
        ];
      if (n === held && held >= 3)
        return [
          "Nog geen training gemist. De rest kan een voorbeeld nemen.",
          "{held} van {held}. Hulde 💪🏻",
          "Elke donderdag present. Iemand moet het goede voorbeeld geven.",
          "Nog nooit een training overgeslagen. Verdacht.",
        ];
      if (n > 1)
        return [
          "{n} trainingen op rij aanwezig. Hulde 💪🏻",
          "{n} keer op rij op het veld. De technische staf heeft het genoteerd.",
          "{n} op rij. Zo worden kampioenen gemaakt. Zeggen ze.",
          "Al {n} donderdagen op rij present. Dat noemen we een reeks.",
        ];
      if (n === 1)
        return [
          "Laatste training: aanwezig. Netjes.",
          "Vorige donderdag gewoon op het veld. Zo hoort het.",
          "Laatste training erbij. Nu nog volhouden.",
          "Vorige week present. Het begin van een reeks?",
        ];
      if (att / held < 0.4)
        return [
          "Laatste training gemist. We oordelen niet, we signaleren alleen.",
          "Vorige donderdag niet gezien. Vast weer een goed argument.",
          "{att} van {held}. Het veld mist je. De rest valt mee.",
          "Laatste keer afwezig. De agenda zat vast weer vol.",
        ];
      return [
        "Laatste training gemist. Eén keertje mag. Eén.",
        "Vorige donderdag overgeslagen. Volgende week weer, toch?",
        "Laatste training niet gezien. De reeks begint gewoon opnieuw.",
      ];
    },
  },

  matches: {
    title: "Wedstrijden",
    intro: "Uitslagen, doelpuntenmakers en kleedkamerverhalen. De nette versie.",
    results: "Uitslagen",
    fixtures: "Voor in de agenda",
    noResults: "Nog geen uitslagen. Op papier zijn we ongeslagen.",
    noFixtures: "Niks meer gepland. Zet het weekendje maar in de agenda.",
  },

  training: {
    title: "Training",
    intro: "Elke donderdag ligt het veld er klaar. Een deel van de selectie ook. De rest had weer een goed argument.",
    sessions: "Trainingen",
    avg: "Gem. opkomst",
    avgSub: "strijders per training",
    best: "Drukste training",
    perSession: "Opkomst per training",
    perSessionSub: "Aantal strijders op het veld",
    grid: "Wie was er?",
    gridSub: "Gesorteerd op opkomst. We oordelen niet, we signaleren alleen.",
    present: "aanwezig",
    absent: "afwezig",
    players: ({ n }) => (n === 1 ? "1 strijder" : `${n} strijders`),
    none: "Nog geen trainingen.",
  },
};
