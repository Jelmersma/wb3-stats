/* WB3 Stats - rendert alle pagina's uit WB3_DATA (data.js) en WB3_COPY (copy.js). */
(function () {
  "use strict";

  const D = window.WB3_DATA;
  const C = window.WB3_COPY;
  const root = document.getElementById("root");
  const page = document.body.dataset.page;

  // ------------------------------------------------------------------ helpers

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function t(path, vars) {
    const v = path.split(".").reduce((o, k) => (o == null ? o : o[k]), C);
    if (v == null) return path;
    if (typeof v === "function") return v(vars || {});
    return String(v).replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? vars[k] : ""));
  }
  const te = (path, vars) => esc(t(path, vars));

  const parseISO = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const fmt = (s, o) => new Intl.DateTimeFormat("nl-NL", o).format(parseISO(s)).replace(/\./g, "");
  const dShort = (s) => fmt(s, { day: "numeric", month: "short" });
  const dDay = (s) => fmt(s, { weekday: "short", day: "numeric", month: "short" });
  const dLong = (s) => fmt(s, { weekday: "long", day: "numeric", month: "long" });
  const todayISO = () => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  };
  const daysUntil = (s) => Math.round((parseISO(s) - parseISO(todayISO())) / 864e5);
  const byName = (a, b) => a.name.localeCompare(b.name, "nl");

  const P = Object.fromEntries(D.players.map((p) => [p.id, p]));
  const played = D.matches.filter((m) => m.played);
  const upcoming = D.matches.filter((m) => !m.played);
  const STATS = ["apps", "min", "goals", "assists", "snuiter", "geel", "rood"];

  function line(p, soort) {
    if (soort !== "all") return p[soort];
    const o = {};
    STATS.forEach((k) => (o[k] = p.comp[k] + p.oefen[k]));
    return o;
  }

  const playerUrl = (id) => `speler.html?id=${encodeURIComponent(id)}`;
  const matchUrl = (m) => `wedstrijden.html#${encodeURIComponent(m.id)}`;
  const team = () => te("site.team");

  // ------------------------------------------------------------------ icons

  const ICONS = {
    goals:
      '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.7l2.5 1.8-.95 2.95h-3.1L5.5 6.5z" fill="currentColor"/></svg>',
    assists:
      '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 11.5c3-5 6.5-6.5 10-6.5M9.5 2.5l3 2.5-2.5 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    snuiter:
      '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.6 1h2.8v2.6c0 .9 1.6 1.7 1.6 3.6V14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.2c0-1.9 1.6-2.7 1.6-3.6z" fill="currentColor"/><rect x="5.9" y="8.2" width="4.2" height="3.4" rx=".5" fill="var(--surface)" opacity=".85"/></svg>',
    geel: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="1.5" width="8" height="13" rx="1.6" fill="#f2c200"/></svg>',
    rood: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="1.5" width="8" height="13" rx="1.6" fill="#d63a3a"/></svg>',
  };

  // ------------------------------------------------------------------ components

  function resBadge(m, link = false) {
    const title = esc(t("match.against", { score: `${m.ours}–${m.theirs}`, opp: m.opponent }));
    const inner = te("short." + m.result);
    const label = `${t("result." + m.result)}: ${t("match.against", { score: `${m.ours}–${m.theirs}`, opp: m.opponent })}`;
    return link
      ? `<a class="res res-${m.result}" href="${matchUrl(m)}" data-tip="${title}" aria-label="${esc(label)}">${inner}</a>`
      : `<span class="res res-${m.result}" title="${esc(t("result." + m.result))}">${inner}</span>`;
  }

  function scoreline(m, size = "") {
    const us = `<span class="sl-team us">${team()}</span>`;
    const them = `<span class="sl-team">${esc(m.opponent)}</span>`;
    const [l, r] = m.home ? [us, them] : [them, us];
    const score = m.played
      ? `${m.home ? m.ours : m.theirs}<span class="sl-dash">–</span>${m.home ? m.theirs : m.ours}`
      : `<span class="sl-vs">${te("match.vs")}</span>`;
    return `<div class="scoreline ${size}">${l}<span class="sl-score">${score}</span>${r}</div>`;
  }

  function meta(m, extra = "") {
    return `<div class="meta">
      <span class="tag tag-${m.soort}">${te("soort." + m.soort)}</span>
      <span>${esc(dDay(m.date))}${m.time ? " · " + esc(m.time) : ""}</span>
      <span>${te(m.home ? "match.home" : "match.away")}</span>${extra}
    </div>`;
  }

  function people(list) {
    return list
      .map((e) => {
        const name = e.id
          ? `<a href="${playerUrl(e.id)}">${esc(e.name)}</a>`
          : `<span class="guest">${e.og ? te("match.ownGoal") : esc(e.name)}</span>`;
        return `<span class="pp">${name}${e.n > 1 ? `&nbsp;<span class="times">${e.n}×</span>` : ""}</span>`;
      })
      .join(", ");
  }

  function events(m) {
    const rows = ["goals", "assists", "snuiter", "geel", "rood"]
      .filter((k) => m[k] && m[k].length)
      .map((k) => `<div class="ev ev-${k}"><dt>${ICONS[k]}${te("match." + k)}</dt><dd>${people(m[k])}</dd></div>`);
    return rows.length ? `<dl class="events">${rows.join("")}</dl>` : "";
  }

  function notes(m) {
    return m.notes
      ? `<figure class="notes"><figcaption>${te("match.notes")}</figcaption><blockquote>${esc(m.notes)}</blockquote></figure>`
      : "";
  }

  function lineup(m) {
    if (!m.lineup.length) return "";
    const max = Math.max(90, ...m.lineup.map((x) => x.min));
    const rows = m.lineup
      .map((x) => {
        const p = P[x.id];
        return `<li><a href="${playerUrl(x.id)}">${esc(p ? p.name : x.id)}</a>
          <span class="meter" aria-hidden="true"><i style="width:${((x.min / max) * 100).toFixed(1)}%"></i></span>
          <span class="num">${x.min}'</span></li>`;
      })
      .join("");
    return `<details class="lineup"><summary>${te("match.lineup", { n: m.lineup.length })}</summary><ul>${rows}</ul></details>`;
  }

  function countdown(m) {
    const n = daysUntil(m.date);
    const txt = n <= 0 ? t("match.today") : n === 1 ? t("match.tomorrow") : t("match.inDays", { n });
    return `<span class="chip chip-accent">${esc(txt)}</span>`;
  }

  function ranked(players, getV, { limit = 5, tie = () => 0 } = {}) {
    const all = players
      .map((p) => ({ p, v: getV(p), tie: tie(p) }))
      .filter((r) => r.v > 0)
      .sort((a, b) => b.v - a.v || b.tie - a.tie || byName(a.p, b.p));
    let rank = 0;
    all.forEach((r, i) => {
      const prev = all[i - 1];
      if (!prev || prev.v !== r.v || prev.tie !== r.tie) rank = i + 1;
      r.rank = rank;
    });
    return { rows: all.slice(0, limit), more: Math.max(0, all.length - limit) };
  }

  function board({ title, sub, data, value, scale = (r) => r.v }) {
    const { rows, more } = data;
    const max = Math.max(1e-9, ...rows.map(scale));
    const body = rows.length
      ? `<ol class="board-list">${rows
          .map(
            (r) => `<li>
              <span class="rank${r.rank === 1 ? " r1" : ""}">${r.rank}</span>
              <a class="name" href="${playerUrl(r.p.id)}">${esc(r.p.name)}</a>
              <span class="bar" aria-hidden="true"><i style="width:${((scale(r) / max) * 100).toFixed(1)}%"></i></span>
              <span class="val">${value(r)}</span>
            </li>`
          )
          .join("")}</ol>${more ? `<p class="more">${te("boards.more", { n: more })}</p>` : ""}`
      : `<p class="empty">${te("boards.empty")}</p>`;
    return `<article class="card board">
      <header><h3>${esc(title)}</h3>${sub ? `<span class="sub">${esc(sub)}</span>` : ""}</header>
      ${body}
    </article>`;
  }

  function seg(name, options, current) {
    return `<div class="seg" role="group" data-seg="${name}">${options
      .map((o) => `<button type="button" data-value="${o}" aria-pressed="${o === current}">${te("soort." + o)}</button>`)
      .join("")}</div>`;
  }

  function band({ eyebrow, title, sub, big = false, extra = "" }) {
    return `<section class="band${big ? " band-big" : ""}"><div class="wrap">
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
      <h1>${title}</h1>
      ${sub ? `<p class="band-sub">${sub}</p>` : ""}
      ${extra}
    </div></section>`;
  }

  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  // ------------------------------------------------------------------ chrome

  function chrome() {
    const nav = [
      ["home", "./"],
      ["players", "spelers.html"],
      ["matches", "wedstrijden.html"],
      ["training", "training.html"],
    ];
    const current = page === "player" ? "players" : page;
    document.getElementById("top").innerHTML = `<div class="wrap topbar-inner">
      <a class="logo" href="./" aria-label="${te("site.title")}"><span class="logo-mark">${team()}</span><span class="logo-sub">${te("site.logoSub")}</span></a>
      <nav class="nav" aria-label="${te("nav.label")}">${nav
        .map(([k, href]) => `<a href="${href}"${k === current ? ' aria-current="page"' : ""}>${te("nav." + k)}</a>`)
        .join("")}</nav>
    </div>`;
    const updated = D.generated.slice(0, 10);
    document.getElementById("foot").innerHTML = `<div class="wrap footer-inner">
      <span class="logo-mark sm">${team()}</span>
      <span>${te("site.season", { season: D.season })} · ${te("site.updated", { date: fmt(updated, { day: "numeric", month: "long", year: "numeric" }) })}</span>
      <span class="footer-note">${te("site.footer")}</span>
    </div>`;
    const skip = document.querySelector(".skip");
    if (skip) skip.textContent = t("site.skip");
  }

  function setTitle(part) {
    document.title = part ? `${part} · ${t("site.title")}` : t("site.title");
  }

  // ------------------------------------------------------------------ pages

  function pageHome() {
    setTitle();
    const tc = D.team.comp;
    const gd = tc.gf - tc.ga;
    const form = played.filter((m) => m.soort === "comp").slice(-5);
    const last = played[played.length - 1];
    const today = todayISO();
    const next = upcoming.filter((m) => m.date >= today);
    const nxt = next[0];

    const hero = band({
      big: true,
      eyebrow: te("home.eyebrow", { season: D.season }),
      title: te("home.title"),
      sub: te("home.titleSub", tc),
      extra: `<div class="hero-grid">
        <div class="hero-fig"><span class="hero-num">${tc.points}</span><span class="hero-lbl">${te("home.points")}</span></div>
        <dl class="hero-stats">
          <div><dt>${te("home.played")}</dt><dd>${tc.played}</dd></div>
          <div><dt>${te("home.record")}</dt><dd>${tc.w}–${tc.g}–${tc.v}</dd></div>
          <div><dt>${te("home.goals")}</dt><dd>${tc.gf}–${tc.ga}</dd></div>
          <div><dt>${te("home.goalDiff")}</dt><dd>${gd > 0 ? "+" : ""}${gd}</dd></div>
        </dl>
      </div>
      <div class="form"><span class="form-lbl">${te("home.form")}</span>${
        form.length ? form.map((m) => resBadge(m, true)).join("") : `<span class="form-empty">${te("home.noForm")}</span>`
      }</div>`,
    });

    const lastCard = last
      ? `<article class="card match-card">
          <header class="card-head"><h2 class="h-card">${te("home.last")}</h2>${resBadge(last)}</header>
          ${meta(last)}
          <p class="verdict">${te("match.verdict", last)}</p>
          ${scoreline(last)}
          ${events(last)}
          ${notes(last)}
          <a class="link-more" href="${matchUrl(last)}">${te("home.allMatches")} →</a>
        </article>`
      : `<article class="card match-card"><header class="card-head"><h2 class="h-card">${te("home.last")}</h2></header><p class="empty">${te("home.noLast")}</p></article>`;

    const nextCard = nxt
      ? `<article class="card match-card next-card">
          <header class="card-head"><h2 class="h-card">${te("home.next")}</h2>${countdown(nxt)}</header>
          ${meta(nxt)}
          ${scoreline(nxt)}
          <p class="next-when">${esc(dLong(nxt.date))}${nxt.time ? ` · ${esc(nxt.time)}` : ""}</p>
          ${
            next.length > 1
              ? `<div class="after"><h3 class="h-mini">${te("home.after")}</h3><ul class="fixture-mini">${next
                  .slice(1, 3)
                  .map(
                    (m) =>
                      `<li><span class="num">${esc(dShort(m.date))}</span><span>${esc(m.opponent)}</span><span class="muted">${te(m.home ? "match.home" : "match.away")}</span></li>`
                  )
                  .join("")}</ul></div>`
              : ""
          }
          <a class="link-more" href="wedstrijden.html#programma">${te("home.allFixtures")} →</a>
        </article>`
      : `<article class="card match-card"><header class="card-head"><h2 class="h-card">${te("home.next")}</h2></header><p class="empty">${te("home.noNext")}</p></article>`;

    const ps = D.players;
    const boards = [
      board({ title: t("boards.goals"), sub: t("boards.goalsSub"), data: ranked(ps, (p) => p.comp.goals, { tie: (p) => p.comp.assists }), value: (r) => r.v }),
      board({ title: t("boards.assists"), sub: t("boards.assistsSub"), data: ranked(ps, (p) => p.comp.assists, { tie: (p) => p.comp.goals }), value: (r) => r.v }),
      board({ title: t("boards.snuiter"), sub: t("boards.snuiterSub"), data: ranked(ps, (p) => p.comp.snuiter), value: (r) => r.v }),
      board({ title: t("boards.minutes"), sub: t("boards.minutesSub"), data: ranked(ps, (p) => p.comp.min), value: (r) => `${r.v}'` }),
      board({
        title: t("boards.training"),
        sub: t("boards.trainingSub"),
        data: ranked(ps, (p) => (p.train.held ? p.train.att / p.train.held : 0), { tie: (p) => p.train.att }),
        value: (r) => `${r.p.train.att}/${r.p.train.held}`,
      }),
      board({
        title: t("boards.cards"),
        sub: t("boards.cardsSub"),
        data: ranked(ps, (p) => p.comp.geel + p.oefen.geel + 2 * (p.comp.rood + p.oefen.rood)),
        value: (r) => {
          const g = r.p.comp.geel + r.p.oefen.geel;
          const rd = r.p.comp.rood + r.p.oefen.rood;
          return `<span class="cards">${g ? `<span class="cardv">${ICONS.geel}${g}</span>` : ""}${rd ? `<span class="cardv">${ICONS.rood}${rd}</span>` : ""}</span>`;
        },
      }),
    ].join("");

    root.innerHTML = `${hero}
      <section class="section"><div class="wrap grid-2">${lastCard}${nextCard}</div></section>
      <section class="section section-tight"><div class="wrap">
        <div class="section-head">
          <div><h2>${te("home.boards")}</h2><p class="sub">${te("home.boardsSub")}</p></div>
          <a class="link-more" href="spelers.html">${te("home.allPlayers")} →</a>
        </div>
        <div class="boards">${boards}</div>
      </div></section>`;
  }

  // ---------------------------------------------------------------- spelers

  function pagePlayers() {
    setTitle(t("players.title"));
    const COLS = [
      { key: "name", label: t("stats.player"), text: true },
      { key: "apps", label: t("stats.apps"), title: t("stats.appsLong") },
      { key: "min", label: t("stats.min"), title: t("stats.minLong") },
      { key: "goals", label: t("stats.goals") },
      { key: "assists", label: t("stats.assists") },
      { key: "snuiter", label: t("stats.snuiter") },
      { key: "geel", label: t("stats.geel"), icon: ICONS.geel },
      { key: "rood", label: t("stats.rood"), icon: ICONS.rood },
      { key: "training", label: t("stats.training") },
    ];
    const state = { soort: new URLSearchParams(location.search).get("soort") || "comp", sort: "min", dir: -1 };
    if (!["comp", "oefen", "all"].includes(state.soort)) state.soort = "comp";

    root.innerHTML = `${band({ eyebrow: te("site.season", { season: D.season }), title: te("players.title"), sub: te("players.intro") })}
      <section class="section"><div class="wrap">
        <div class="toolbar">${seg("soort", ["comp", "oefen", "all"], state.soort)}</div>
        <div class="table-wrap"><table class="stats" id="stats-table"></table></div>
      </div></section>`;

    const table = document.getElementById("stats-table");
    const val = (p, key) => {
      if (key === "name") return p.name;
      if (key === "training") return p.train.held ? p.train.att / p.train.held : 0;
      return line(p, state.soort)[key];
    };

    function draw() {
      const rows = [...D.players].sort((a, b) => {
        const A = val(a, state.sort);
        const B = val(b, state.sort);
        const c = typeof A === "string" ? A.localeCompare(B, "nl") : A - B;
        return c * state.dir || byName(a, b);
      });
      const totals = {};
      STATS.forEach((k) => (totals[k] = D.players.reduce((s, p) => s + line(p, state.soort)[k], 0)));
      const cell = (v, extra = "") => `<td class="n${v === 0 ? " zero" : ""}${extra}">${v}</td>`;
      table.innerHTML = `<thead><tr>${COLS.map((c) => {
        const sorted = state.sort === c.key;
        const aria = sorted ? (state.dir === 1 ? "ascending" : "descending") : "none";
        return `<th scope="col" class="${c.text ? "" : "n"}" aria-sort="${aria}"${c.title ? ` title="${esc(c.title)}"` : ""}>
          <button type="button" data-sort="${c.key}">${c.icon || ""}<span>${esc(c.label)}</span><span class="sort-ind" aria-hidden="true">${sorted ? (state.dir === 1 ? "▲" : "▼") : ""}</span></button></th>`;
      }).join("")}</tr></thead>
      <tbody>${rows
        .map((p) => {
          const s = line(p, state.soort);
          const tr = p.train;
          return `<tr>
            <th scope="row"><a href="${playerUrl(p.id)}">${esc(p.name)}</a></th>
            ${cell(s.apps)}${cell(s.min)}${cell(s.goals)}${cell(s.assists)}${cell(s.snuiter)}${cell(s.geel)}${cell(s.rood)}
            <td class="n${tr.att === 0 ? " zero" : ""}"><span class="tr-cell"><span class="meter sm" aria-hidden="true"><i style="width:${pct(tr.att, tr.held)}%"></i></span>${tr.att}/${tr.held}</span></td>
          </tr>`;
        })
        .join("")}</tbody>
      <tfoot><tr><th scope="row">${te("stats.total")}</th>${["apps", "min", "goals", "assists", "snuiter", "geel", "rood"]
        .map((k) => `<td class="n">${k === "apps" ? "" : totals[k]}</td>`)
        .join("")}<td></td></tr></tfoot>`;
    }

    table.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-sort]");
      if (!b) return;
      const key = b.dataset.sort;
      if (state.sort === key) state.dir *= -1;
      else {
        state.sort = key;
        state.dir = key === "name" ? 1 : -1;
      }
      draw();
    });
    root.querySelector('[data-seg="soort"]').addEventListener("click", (e) => {
      const b = e.target.closest("button[data-value]");
      if (!b) return;
      state.soort = b.dataset.value;
      root.querySelectorAll('[data-seg="soort"] button').forEach((x) => x.setAttribute("aria-pressed", x === b));
      const url = new URL(location.href);
      if (state.soort === "comp") url.searchParams.delete("soort");
      else url.searchParams.set("soort", state.soort);
      history.replaceState(null, "", url);
      draw();
    });
    draw();
  }

  // ---------------------------------------------------------------- speler

  function pagePlayer() {
    const id = new URLSearchParams(location.search).get("id");
    const p = P[id];
    if (!p) {
      setTitle(t("player.notFound"));
      root.innerHTML = `${band({ title: te("player.notFound") })}
        <section class="section"><div class="wrap"><a class="link-more" href="spelers.html">← ${te("player.back")}</a></div></section>`;
      return;
    }
    setTitle(p.name);
    const c = p.comp;
    const o = p.oefen;
    const tr = p.train;

    const tile = (label, v, sub) =>
      `<div class="card tile"><span class="tile-lbl">${esc(label)}</span><span class="tile-val">${v}</span>${sub ? `<span class="tile-sub">${esc(sub)}</span>` : ""}</div>`;
    const tiles = [
      tile(t("stats.appsLong"), c.apps, t("player.tileOefen", { v: o.apps })),
      tile(t("stats.minLong"), c.min, t("player.tileOefen", { v: o.min })),
      tile(t("stats.goals"), c.goals, t("player.tileOefen", { v: o.goals })),
      tile(t("stats.assists"), c.assists, t("player.tileOefen", { v: o.assists })),
      tile(t("stats.snuiter"), c.snuiter, t("player.tileOefen", { v: o.snuiter })),
      tile(t("player.trainingPct"), `${pct(tr.att, tr.held)}%`, t("player.trainingOf", { att: tr.att, held: tr.held })),
    ].join("");

    const count = (m, k) => (m[k] || []).filter((e) => e.id === p.id).reduce((s, e) => s + e.n, 0);
    const log = [...played].reverse().map((m) => {
      const x = m.lineup.find((l) => l.id === p.id);
      const mins = x ? x.min : 0;
      const g = count(m, "goals");
      const a = count(m, "assists");
      const sn = count(m, "snuiter");
      const y = count(m, "geel");
      const r = count(m, "rood");
      const ev = [
        g ? `<span class="evi" title="${te("match.goals")}">${ICONS.goals}${g > 1 ? g : ""}</span>` : "",
        a ? `<span class="evi" title="${te("match.assists")}">${ICONS.assists}${a > 1 ? a : ""}</span>` : "",
        sn ? `<span class="evi evi-snuiter" title="${te("match.snuiter")}">${ICONS.snuiter}</span>` : "",
        y ? `<span class="evi" title="${te("match.geel")}">${ICONS.geel}</span>` : "",
        r ? `<span class="evi" title="${te("match.rood")}">${ICONS.rood}</span>` : "",
      ].join("");
      return `<li class="log-row${mins ? "" : " dnp"}">
        <span class="log-date num">${esc(dShort(m.date))}</span>
        <span class="log-opp"><a href="${matchUrl(m)}">${esc(m.opponent)}</a><span class="tag tag-${m.soort} sm">${te("soort." + m.soort)}</span></span>
        ${resBadge(m)}
        <span class="log-min">${
          mins
            ? `<span class="meter" aria-hidden="true"><i style="width:${Math.min(100, (mins / 90) * 100).toFixed(1)}%"></i></span><span class="num">${mins}'</span>`
            : `<span class="muted">${te("player.didNotPlay")}</span>`
        }</span>
        <span class="log-ev">${ev}</span>
      </li>`;
    });

    const dots = D.trainings
      .map((s) => {
        const on = s.present.includes(p.id);
        return `<span class="dot${on ? " on" : ""}" tabindex="0" data-tip="${esc(dShort(s.date))} · ${te(on ? "training.present" : "training.absent")}"></span>`;
      })
      .join("");

    root.innerHTML = `${band({
      eyebrow: te("player.eyebrow"),
      title: esc(p.name),
      sub: te("player.summary", { apps: c.apps, min: c.min }),
    })}
      <section class="section"><div class="wrap">
        <div class="tiles tiles-6">${tiles}</div>
      </div></section>
      <section class="section section-tight"><div class="wrap stack">
        <article class="card">
          <header class="card-head"><h2 class="h-card">${te("player.matches")}</h2></header>
          ${log.length ? `<ul class="log">${log.join("")}</ul>` : `<p class="empty">${te("player.noMatches")}</p>`}
        </article>
        <article class="card">
          <header class="card-head"><h2 class="h-card">${te("player.training")}</h2><span class="sub">${te("player.trainingOf", { att: tr.att, held: tr.held })}</span></header>
          ${D.trainings.length ? `<div class="dots">${dots}</div><p class="sub">${te("player.streak", { n: tr.streak })}</p>` : `<p class="empty">${te("training.none")}</p>`}
        </article>
      </div></section>
      <section class="section section-tight"><div class="wrap"><a class="link-more" href="spelers.html">← ${te("player.back")}</a></div></section>`;
  }

  // ---------------------------------------------------------------- wedstrijden

  function pageMatches() {
    setTitle(t("matches.title"));
    const state = { soort: "all" };

    root.innerHTML = `${band({
      eyebrow: te("site.season", { season: D.season }),
      title: te("matches.title"),
      sub: te("matches.intro"),
    })}
      <section class="section"><div class="wrap">
        <div class="toolbar">${seg("soort", ["all", "comp", "oefen"], state.soort)}</div>
        <div id="match-body"></div>
      </div></section>`;

    function draw() {
      const keep = (m) => state.soort === "all" || m.soort === state.soort;
      const res = [...played].reverse().filter(keep);
      const fix = upcoming.filter(keep);
      const today = todayISO();
      const nextId = (upcoming.find((m) => m.date >= today) || {}).id;

      const results = res.length
        ? `<div class="grid-2">${res
            .map(
              (m) => `<article class="card match-card" id="${esc(m.id)}">
                ${meta(m, resBadge(m))}
                <p class="verdict sm">${te("match.verdict", m)}</p>
                ${scoreline(m, "sm")}
                ${events(m)}
                ${notes(m)}
                ${lineup(m)}
              </article>`
            )
            .join("")}</div>`
        : `<p class="empty">${te("matches.noResults")}</p>`;

      let month = "";
      const fixtures = fix.length
        ? `<div class="card fixtures"><ul>${fix
            .map((m) => {
              const mo = fmt(m.date, { month: "long", year: "numeric" });
              const head = mo !== month ? `<li class="fx-month">${esc((month = mo))}</li>` : "";
              const isNext = m.id === nextId;
              const past = m.date < today;
              return `${head}<li class="fx${isNext ? " fx-next" : ""}" id="${esc(m.id)}">
                <span class="fx-date num">${esc(dDay(m.date))}</span>
                <span class="fx-time num">${m.time ? esc(m.time) : ""}</span>
                <span class="fx-opp">${esc(m.opponent)}${isNext ? ` <span class="chip chip-accent">${te("match.next")}</span>` : ""}${
                past ? ` <span class="chip">${te("match.pending")}</span>` : ""
              }</span>
                <span class="fx-where"><span class="tag${m.home ? " tag-home" : ""}">${te(m.home ? "match.home" : "match.away")}</span></span>
              </li>`;
            })
            .join("")}</ul></div>`
        : `<p class="empty">${te("matches.noFixtures")}</p>`;

      document.getElementById("match-body").innerHTML = `
        <h2 class="h-sec">${te("matches.results")}</h2>${results}
        <h2 class="h-sec" id="programma">${te("matches.fixtures")}</h2>${fixtures}`;
    }

    root.querySelector('[data-seg="soort"]').addEventListener("click", (e) => {
      const b = e.target.closest("button[data-value]");
      if (!b) return;
      state.soort = b.dataset.value;
      root.querySelectorAll('[data-seg="soort"] button').forEach((x) => x.setAttribute("aria-pressed", x === b));
      draw();
    });
    draw();
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) {
        el.classList.add("flash");
        requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
      }
    }
  }

  // ---------------------------------------------------------------- training

  function niceTicks(max, count = 3) {
    if (max <= 0) return [0, 1];
    const raw = max / count;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map((s) => s * mag).find((s) => s >= raw);
    const top = Math.ceil(max / step) * step;
    const out = [];
    for (let v = 0; v <= top + 1e-9; v += step) out.push(Math.round(v));
    return out;
  }

  function pageTraining() {
    setTitle(t("training.title"));
    const S = D.trainings;
    const n = S.length;
    const counts = S.map((s) => s.present.length);
    const avg = n ? counts.reduce((a, b) => a + b, 0) / n : 0;
    const bestI = counts.indexOf(Math.max(...counts));

    const tiles = n
      ? `<div class="tiles">
          <div class="card tile"><span class="tile-lbl">${te("training.sessions")}</span><span class="tile-val">${n}</span></div>
          <div class="card tile"><span class="tile-lbl">${te("training.avg")}</span><span class="tile-val">${avg.toLocaleString("nl-NL", { maximumFractionDigits: 1 })}</span><span class="tile-sub">${te("training.avgSub")}</span></div>
          <div class="card tile"><span class="tile-lbl">${te("training.best")}</span><span class="tile-val">${counts[bestI]}</span><span class="tile-sub">${esc(dLong(S[bestI].date))}</span></div>
        </div>`
      : "";

    // Kolomdiagram: opkomst per training
    const ticks = niceTicks(Math.max(...counts, 1));
    const top = ticks[ticks.length - 1];
    const labelEvery = n <= 8 ? 1 : Math.ceil(n / 6);
    const capAll = n <= 12;
    const maxV = Math.max(...counts);
    const chart = n
      ? `<article class="card">
          <header class="card-head"><div><h2 class="h-card">${te("training.perSession")}</h2><span class="sub">${te("training.perSessionSub")}</span></div></header>
          <div class="colchart" role="img" aria-label="${esc(S.map((s, i) => `${dShort(s.date)}: ${counts[i]}`).join(", "))}">
            <div class="cc-plot">
              ${ticks.map((v) => `<div class="cc-gl${v === 0 ? " base" : ""}" style="bottom:${(v / top) * 100}%"><span>${v}</span></div>`).join("")}
              <div class="cc-cols">${S.map((s, i) => {
                const showCap = capAll || counts[i] === maxV || i === n - 1;
                return `<div class="cc-col" tabindex="0" data-tip="${esc(dLong(s.date))} · ${te("training.players", { n: counts[i] })}">
                  <div class="cc-bar" style="height:${(counts[i] / top) * 100}%">${showCap ? `<span class="cc-cap">${counts[i]}</span>` : ""}</div>
                </div>`;
              }).join("")}</div>
            </div>
            <div class="cc-axis">${S.map((s, i) => `<span>${i % labelEvery === 0 || i === n - 1 ? esc(dShort(s.date)) : ""}</span>`).join("")}</div>
          </div>
        </article>`
      : `<p class="empty">${te("training.none")}</p>`;

    // Aanwezigheidsrooster
    const rows = [...D.players].sort((a, b) => b.train.att - a.train.att || byName(a, b));
    const grid = n
      ? `<article class="card card-flush">
          <header class="card-head pad"><div><h2 class="h-card">${te("training.grid")}</h2><span class="sub">${te("training.gridSub")}</span></div></header>
          <div class="presence-wrap" id="presence">
            <table class="presence">
              <thead><tr><th scope="col" class="pl">${te("stats.player")}</th><th scope="col" class="tot">${te("stats.total")}</th>${S.map((s) => {
                const d = parseISO(s.date);
                return `<th scope="col" class="d"><span class="d-day">${d.getDate()}</span><span class="d-mon">${esc(fmt(s.date, { month: "short" }))}</span></th>`;
              }).join("")}</tr></thead>
              <tbody>${rows
                .map(
                  (p) => `<tr>
                    <th scope="row" class="pl"><a href="${playerUrl(p.id)}">${esc(p.name)}</a></th>
                    <td class="tot num${p.train.att ? "" : " zero"}">${p.train.att}</td>
                    ${S.map((s) => {
                      const on = s.present.includes(p.id);
                      return `<td class="c"><span class="dot${on ? " on" : ""}" data-tip="${esc(p.name)} · ${esc(dShort(s.date))} · ${te(on ? "training.present" : "training.absent")}"><span class="sr">${te(on ? "training.present" : "training.absent")}</span></span></td>`;
                    }).join("")}
                  </tr>`
                )
                .join("")}</tbody>
            </table>
          </div>
        </article>`
      : "";

    root.innerHTML = `${band({ eyebrow: te("site.season", { season: D.season }), title: te("training.title"), sub: te("training.intro") })}
      <section class="section"><div class="wrap stack">${tiles}${chart}${grid}</div></section>`;

    const wrap = document.getElementById("presence");
    if (wrap) wrap.scrollLeft = wrap.scrollWidth;
  }

  // ------------------------------------------------------------------ tooltip

  function tooltips() {
    const tip = document.createElement("div");
    tip.className = "tip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    let cur = null;
    const show = (el) => {
      const txt = el.getAttribute("data-tip");
      if (!txt) return;
      cur = el;
      tip.textContent = txt;
      tip.classList.add("on");
      const r = el.getBoundingClientRect();
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      const x = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 8));
      let y = r.top - h - 8;
      if (y < 8) y = r.bottom + 8;
      tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    };
    const hide = () => {
      cur = null;
      tip.classList.remove("on");
    };
    document.addEventListener("pointerover", (e) => {
      const el = e.target.closest("[data-tip]");
      if (el) {
        if (el !== cur) show(el);
      } else if (cur) hide();
    });
    document.addEventListener("focusin", (e) => {
      const el = e.target.closest("[data-tip]");
      if (el) show(el);
    });
    document.addEventListener("focusout", hide);
    addEventListener("scroll", hide, { passive: true, capture: true });
  }

  // ------------------------------------------------------------------ start

  chrome();
  ({ home: pageHome, players: pagePlayers, player: pagePlayer, matches: pageMatches, training: pageTraining })[page]?.();
  tooltips();
})();
