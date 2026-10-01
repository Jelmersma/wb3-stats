/*
 * Alle teksten van de site staan hier, in de WB3-tone of voice (zie TONE_OF_VOICE.md).
 * {naam} wordt ingevuld door de site. Een functie mag ook, bv. voor enkelvoud/meervoud
 * of een tekst die afhangt van de uitslag.
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
        ? "Nog niks gespeeld. Op papier zijn we ongeslagen."
        : v === 0 && w > 0
          ? "Ongeslagen. Lekker. Maar we hebben nog helemaal niks."
          : v === 0
            ? "Nog niet verloren. Ze moeten er wel een keer in."
            : "Geen man overboord. Elke pot is vanaf nu een finale.",
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
    empty: "Nog niemand. Kans!",
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
      if (result === "W" && diff >= 4) return "Dominant.";
      if (result === "W" && diff === 1) return "Zakelijk. Drie punten.";
      if (result === "W") return "Heerlijk potje.";
      if (result === "G" && ours === 0) return "Brilstand. Niemand blij.";
      if (result === "G") return "Kansen genoeg. Ze moeten er wel in.";
      if (diff <= -3) return "Daar blijven we niet in hangen.";
      return "Geen man overboord.";
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
        ? "Nog geen competitieminuut. De technische staf houdt je in de gaten."
        : `${apps} ${apps === 1 ? "competitiepot" : "competitiepotjes"} · ${min} minuten`,
    tileOefen: ({ v }) => `Oefen: ${v}`,
    trainingPct: "Training",
    trainingOf: ({ att, held }) => `${att} van ${held}`,
    matches: "Wedstrijden",
    didNotPlay: "Niet gespeeld",
    noMatches: "Nog geen wedstrijden gespeeld.",
    training: "Trainingen",
    streak: ({ n }) =>
      n > 1
        ? `${n} trainingen op rij aanwezig. Hulde 💪🏻`
        : n === 1
          ? "Laatste training: aanwezig. Netjes."
          : "Laatste training gemist. We oordelen niet, we signaleren alleen.",
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
