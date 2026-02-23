(function () {
  if (location.hostname === "www.scalynx.io") {
    location.replace("https://scalynx.io" + location.pathname + location.search + location.hash);
  }
})();

const NAV_CONFIG = [
  { label: "Start", href: "/" },
  {
    label: "Leistungen",
    href: "/leistungen/",
    children: [
      { label: "Leistungsübersicht", href: "/leistungen/" },
      { label: "Dashboard & Reporting", href: "/leistungen/dashboard-reporting.html" },
      { label: "Werbung & Analytics", href: "/leistungen/werbung-analytics.html" },
      { label: "Insights & Health", href: "/leistungen/insights-health.html" },
      { label: "Promotion-Auswertung", href: "/leistungen/promotions-erfolgsmessung.html" },
      { label: "Content Studio", href: "/leistungen/content-studio.html" },
      { label: "Kundenmanagement", href: "/leistungen/kundenmanagement.html" },
      { label: "Aufgaben & Reports", href: "/leistungen/aufgaben-reports.html" }
    ]
  },
  {
    label: "Plattform",
    href: "/plattform/",
    children: [
      { label: "Plattformübersicht", href: "/plattform/" },
      { label: "Kundensicht", href: "/plattform/kundensicht.html" },
      { label: "Agentursicht", href: "/plattform/agentursicht.html" },
      { label: "Funktionsumfang", href: "/plattform/funktionsumfang.html" },
      { label: "Datenquellen & Sync", href: "/plattform/datenquellen-sync.html" },
      { label: "Rollen & Rechte", href: "/plattform/rollen-rechte.html" },
      { label: "Werbeautomatisierung (Coming Soon)", href: "/plattform/automatisierung.html" }
    ]
  },
  { label: "Für Agenturen", href: "/branchen/amazon-agenturen.html" },
  {
    label: "Ressourcen",
    href: "/ressourcen/",
    children: [
      { label: "Ressourcenübersicht", href: "/ressourcen/" },
      { label: "Case Studies", href: "/ressourcen/case-studies.html" },
      { label: "Reporting-Playbook", href: "/ressourcen/playbooks/reporting-playbook.html" },
      { label: "Ads-Audit-Playbook", href: "/ressourcen/playbooks/ads-audit.html" },
      { label: "KPI-Glossar", href: "/ressourcen/guides/kpi-glossar.html" },
      { label: "Onboarding-Checkliste", href: "/ressourcen/guides/onboarding-checkliste.html" },
      { label: "Agentur-FAQ", href: "/ressourcen/faq/agentur-faq.html" }
    ]
  }
];


function normalizePath(pathname) {
  if (!pathname || pathname === "") return "/";
  if (pathname.endsWith("/") || pathname.endsWith(".html")) return pathname;
  return pathname;
}

function isActiveLink(target, current) {
  if (target === "/") return current === "/";
  if (target.endsWith("/")) return current.startsWith(target);
  return current === target;
}

function buildNavHTML(currentPath) {
  return NAV_CONFIG.map((item) => {
    const children = item.children || [];
    const childActive = children.some((child) => isActiveLink(child.href, currentPath));
    const active = isActiveLink(item.href, currentPath) || childActive;
    if (!children.length) {
      return `<a class="${active ? "active" : ""}" href="${item.href}">${item.label}</a>`;
    }

    const childrenHTML = children
      .map((child) => {
        const childClass = isActiveLink(child.href, currentPath) ? "active" : "";
        return `<a class="${childClass}" href="${child.href}">${child.label}</a>`;
      })
      .join("");

    return `<div class="nav-item has-menu">
      <a class="${active ? "active" : ""}" href="${item.href}">${item.label}</a>
      <div class="submenu">${childrenHTML}</div>
    </div>`;
  }).join("");
}

function buildMobileMenuHTML(currentPath) {
  return NAV_CONFIG.map((item) => {
    const children = item.children || [];
    const active = isActiveLink(item.href, currentPath) || children.some((child) => isActiveLink(child.href, currentPath));
    if (!children.length) {
      return `<a class="mobile-link ${active ? "active" : ""}" href="${item.href}">${item.label}</a>`;
    }
    const childrenHTML = children
      .map((child) => `<a class="mobile-sublink ${isActiveLink(child.href, currentPath) ? "active" : ""}" href="${child.href}">${child.label}</a>`)
      .join("");
    return `
      <details class="mobile-group" ${active ? "open" : ""}>
        <summary>${item.label}</summary>
        <div class="mobile-submenu">${childrenHTML}</div>
      </details>
    `;
  }).join("");
}

function initMobileMenu(topbar, currentPath) {
  if (!topbar) return;
  const cta = topbar.querySelector(".btn.primary");
  if (!cta) return;

  let actions = topbar.querySelector(".topbar-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.className = "topbar-actions";
    topbar.appendChild(actions);
  }

  if (cta.parentElement !== actions) actions.prepend(cta);

  let toggle = actions.querySelector(".mobile-menu-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-menu-toggle";
    toggle.setAttribute("aria-label", "Menü öffnen");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    actions.appendChild(toggle);
  }

  let panel = topbar.querySelector(".mobile-menu");
  if (!panel) {
    panel = document.createElement("div");
    panel.className = "mobile-menu";
    panel.setAttribute("aria-hidden", "true");
    topbar.appendChild(panel);
  }
  panel.innerHTML = buildMobileMenuHTML(currentPath);

  const closeMenu = () => {
    topbar.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  };
  const openMenu = () => {
    topbar.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
  };

  toggle.onclick = () => {
    if (topbar.classList.contains("menu-open")) closeMenu();
    else openMenu();
  };

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!topbar.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function renderHeaderAndFooter() {
  const currentYear = new Date().getFullYear();
  const currentPath = normalizePath(location.pathname);
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const nav = topbar.querySelector(".nav");
    if (nav) nav.innerHTML = buildNavHTML(currentPath);
    const cta = topbar.querySelector(".btn.primary");
    if (cta) {
      cta.href = "/demo-anfragen.html";
      cta.textContent = "Demo anfragen";
    }
    initMobileMenu(topbar, currentPath);
  }

  const footer = document.querySelector(".footer");
  if (footer) {
    footer.innerHTML = `
      <a class="brand" href="/"><span class="main">scaly<span>nx</span></span><span class="dot">.io</span></a>
      <div class="links">
        <a href="/impressum.html">Impressum</a>
        <a href="/datenschutz.html">Datenschutz</a>
        <a href="/agb.html">AGB</a>
      </div>
      <small>© ${currentYear} scalynx.io – gebaut für Amazon-Agenturen.</small>
    `;
  }
}

function rewriteDemoLinks() {
  document.querySelectorAll("a").forEach((link) => {
    const label = (link.textContent || "").trim().toLowerCase();
    if (label === "demo anfragen" || label === "live-demo buchen" || label === "live demo buchen") {
      link.setAttribute("href", "/demo-anfragen.html");
    }
    const href = link.getAttribute("href") || "";
    if (href === "/ressourcen/case-studies") {
      link.setAttribute("href", "/ressourcen/case-studies.html");
    }
  });
}

function setupTicker() {
  const ticker = document.querySelector(".trust-ticker");
  if (!ticker) return;
  if (ticker.querySelector(".trust-ticker-track")) return;
  const items = Array.from(ticker.querySelectorAll("span"));
  if (!items.length) return;
  const html = items.map((el) => el.outerHTML).join("");
  ticker.innerHTML = `<div class="trust-ticker-track">${html}${html}</div>`;
}

function initSegmentLanding() {
  const switcher = document.querySelector(".segment-switch");
  if (!switcher) return;

  const buttons = Array.from(switcher.querySelectorAll("[data-segment]"));
  const panels = Array.from(document.querySelectorAll(".segment-panel[data-segment]"));
  if (!buttons.length || !panels.length) return;

  function activateSegment(segment, updateUrl = true) {
    buttons.forEach((btn) => btn.classList.toggle("active", btn.dataset.segment === segment));
    panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.segment === segment));
    if (!updateUrl) return;
    const url = new URL(location.href);
    url.searchParams.set("size", segment);
    history.replaceState({}, "", url.toString());
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activateSegment(btn.dataset.segment));
  });

  const sizeParam = new URLSearchParams(location.search).get("size");
  const valid = buttons.some((b) => b.dataset.segment === sizeParam);
  activateSegment(valid ? sizeParam : "klein", false);
}

const PAGE_MODELS = {
  "/demo-anfragen.html": {
    topic: "Demo-Rollout",
    audience: "für Amazon-Agenturen",
    focus: "Warteliste, Priorisierung und frühes Onboarding",
    promise: "Kein Leerlauf bis zum Release: frühe Interessenten werden strukturiert vorbereitet.",
    signals: ["Dringlichkeit im Team", "Anzahl aktiver Kunden", "Fokus auf Werbung oder Content", "Technische Systemlandschaft"],
    steps: ["Use Case aufnehmen", "Teamrolle definieren", "Pilotkunden priorisieren", "Go-Live-Kriterien festlegen"],
    outcome: "Schnellerer Start mit klaren Erwartungen statt unklarem Vorlauf."
  },
  "/branchen/amazon-agenturen.html": {
    topic: "Amazon-Agentur-Fit",
    audience: "für Agenturinhaber und Teamleads",
    focus: "Skalierbare Struktur statt Tool-Chaos",
    promise: "Die Plattform passt sich an Agenturgröße, Teamstruktur und Kundenportfolio an.",
    signals: ["Marge pro Kunde", "Zeitaufwand pro Monatsreport", "Reaktionsgeschwindigkeit bei Risiken", "Umsetzungsquote im Team"],
    steps: ["Segment wählen", "KPI-Standard setzen", "Rollen zuordnen", "Review-Rhythmus etablieren"],
    outcome: "Mehr operative Ruhe, schnellere Entscheidungen und nachvollziehbare Kundenergebnisse."
  },
  "/leistungen/": {
    topic: "Leistungsportfolio",
    audience: "für operative Amazon-Agenturen",
    focus: "Von KPI-Analyse bis Maßnahmenumsetzung",
    promise: "Jede Leistung ist direkt mit einem konkreten Agentur-Output verbunden.",
    signals: ["Reporting-Qualität", "Werbeeffizienz", "Risikofrüherkennung", "Liefergeschwindigkeit im Team"],
    steps: ["Leistung auswählen", "Untermodul vertiefen", "Teamprozess zuordnen", "Kundennutzen kommunizieren"],
    outcome: "Klarer Leistungsnachweis im Kundengespräch und weniger interne Reibung."
  },
  "/leistungen/dashboard-reporting.html": {
    topic: "Dashboard & Reporting",
    audience: "für Entscheider in Amazon-Agenturen",
    focus: "Saubere KPI-Lesbarkeit für Kunden-Calls",
    promise: "Reports erklären nicht nur Zahlen, sondern auch Ursache, Maßnahme und nächste Entscheidung.",
    signals: ["Umsatztrend", "TACoS-Entwicklung", "ACoS-Abweichung", "BuyBox-Stabilität"],
    steps: ["Abweichung markieren", "Ursache belegen", "Maßnahme priorisieren", "Kommunikation vorbereiten"],
    outcome: "Mehr Vertrauen im Termin und weniger Rückfragen nach dem Report."
  },
  "/leistungen/werbung-analytics.html": {
    topic: "Werbung & Analytics",
    audience: "für Performance-Teams",
    focus: "Budget, Gebote und Targets mit klarer Steuerlogik",
    promise: "Werbeentscheidungen basieren auf Effizienzsignalen statt auf Bauchgefühl.",
    signals: ["ROAS je Kampagne", "ACoS je Ziel", "Klickkosten-Trend", "Conversion je ASIN"],
    steps: ["Ineffizienz clustern", "Budget anpassen", "Targets verschieben", "Wirkung prüfen"],
    outcome: "Weniger Streuverlust und stabilere Skalierung profitabler Kampagnen."
  },
  "/leistungen/insights-health.html": {
    topic: "Insights & Health",
    audience: "für proaktive Account-Teams",
    focus: "Risiken erkennen, bevor Kunden sie melden",
    promise: "Findings und Health-Signale werden in klare Prioritäten für das Team übersetzt.",
    signals: ["BuyBox-Verlust", "Conversion-Einbruch", "Traffic ohne Umsatz", "Budgetwarnungen"],
    steps: ["Signal bewerten", "Schadenspotenzial einschätzen", "Sofortmaßnahme planen", "Status nachhalten"],
    outcome: "Reaktionsstarkes Kundenmanagement statt reaktiver Feuerwehr."
  },
  "/leistungen/insights/buybox-monitoring.html": {
    topic: "BuyBox-Monitoring",
    audience: "für kritische Umsatzkontrolle",
    focus: "Frühwarnung bei Sichtbarkeitsverlust",
    promise: "BuyBox-Abweichungen werden früh erkannt und priorisiert eskaliert.",
    signals: ["BuyBox-Quote", "betroffene ASINs", "Marktplatzvergleich", "Zeitliche Muster"],
    steps: ["Abfall identifizieren", "Ursache eingrenzen", "Gegenmaßnahme starten", "Erholung prüfen"],
    outcome: "Schnelleres Gegensteuern bei Umsatzrisiken auf Produktebene."
  },
  "/leistungen/promotions-erfolgsmessung.html": {
    topic: "Promotion-Auswertung",
    audience: "für datenbasierte Aktionsplanung",
    focus: "Vorher/Während/Nachher/Vorjahr in einer Logik",
    promise: "Deals werden anhand echter Wirkung bewertet, nicht anhand kurzfristiger Peaks.",
    signals: ["Umsatzhebel", "Conversion-Delta", "Werbekostenquote", "organischer Anteil"],
    steps: ["Aktion dokumentieren", "Vergleichsfenster wählen", "Ergebnis interpretieren", "Wiederholung entscheiden"],
    outcome: "Bessere Promotionsplanung mit klarer Profitabilitätsbewertung."
  },
  "/leistungen/content-studio.html": {
    topic: "Content Studio",
    audience: "für skalierbare Produktionsteams",
    focus: "Texte, Bilder, A+ und Video in einem Workflow",
    promise: "Von Einzel-Asset bis Bulk-Output bleibt die Qualitätslogik stabil.",
    signals: ["Produktionstempo", "Freigabedauer", "Qualitätskonsistenz", "Wiederverwendbarkeit"],
    steps: ["Input definieren", "Assets produzieren", "Qualitätscheck durchführen", "Kundenfreigabe steuern"],
    outcome: "Höherer Output ohne Qualitätsverlust bei wachsender Kundenanzahl."
  },
  "/leistungen/kundenmanagement.html": {
    topic: "Kundenmanagement",
    audience: "für Agenturführung und Operations",
    focus: "Status, Abrechnung und Rollen sauber steuern",
    promise: "Kundenstruktur ist transparent und operativ nutzbar statt in Nebensystemen verteilt.",
    signals: ["Aktiv/Pause-Status", "Monatsbetrag", "Zugriffsrechte", "Onboarding-Stand"],
    steps: ["Kunde anlegen", "Rollen zuweisen", "Status pflegen", "Abrechnung prüfen"],
    outcome: "Weniger Admin-Reibung und bessere Steuerbarkeit im Tagesgeschäft."
  },
  "/leistungen/aufgaben-reports.html": {
    topic: "Aufgaben & Reports",
    audience: "für Teams mit hohem Umsetzungsdruck",
    focus: "Insights direkt in umsetzbare Tasks überführen",
    promise: "Jede Maßnahme ist mit Owner, Termin und Reporting-Kontext verbunden.",
    signals: ["Offene Prioritäten", "Deadline-Risiken", "Umsetzungsquote", "Report-Vollständigkeit"],
    steps: ["Task anlegen", "Owner setzen", "Status dokumentieren", "Report aktualisieren"],
    outcome: "Besserer Durchsatz zwischen Analyse, Umsetzung und Kundenkommunikation."
  },
  "/leistungen/reporting/kundenreports.html": {
    topic: "Kundenreports",
    audience: "für überzeugende Monatsgespräche",
    focus: "Von KPI-Verlauf zur klaren Entscheidung",
    promise: "Berichte werden als Entscheidungsdokument genutzt statt als reine Datensammlung.",
    signals: ["Kern-KPI je Ziel", "Top- und Flop-Treiber", "offene Risiken", "nächste Maßnahmen"],
    steps: ["Kernaussage formulieren", "Beleg mit KPI liefern", "Maßnahme benennen", "Commitment festhalten"],
    outcome: "Höhere Abschlusswahrscheinlichkeit für Empfehlungen im Kundencall."
  },
  "/plattform/": {
    topic: "Plattformarchitektur",
    audience: "für technisch orientierte Agenturen",
    focus: "Ansichten, Datenfluss und Rollenmodell",
    promise: "Die Plattformlogik erklärt, warum Prozesse stabil und skalierbar laufen.",
    signals: ["Datenqualität", "Sync-Zyklus", "Rollenklarheit", "Mandantenfähigkeit"],
    steps: ["Ansicht wählen", "Rechte definieren", "Datenfluss prüfen", "Governance festlegen"],
    outcome: "Stabile Systembasis für konsistente Agenturleistung."
  },
  "/plattform/kundensicht.html": {
    topic: "Kundensicht",
    audience: "für klare Kundenerlebnisse",
    focus: "Transparenz ohne operative Überforderung",
    promise: "Kunden sehen genau die Informationen, die für Entscheidungen relevant sind.",
    signals: ["Dashboard-Lesbarkeit", "Report-Verfügbarkeit", "Insights-Verständlichkeit", "Rückfragequote"],
    steps: ["Ansicht strukturieren", "KPI priorisieren", "Report bereitstellen", "Feedback auswerten"],
    outcome: "Weniger Rückfragen und professionellerer Auftritt im Kundenkontakt."
  },
  "/plattform/agentursicht.html": {
    topic: "Agentursicht",
    audience: "für operative Teams",
    focus: "Tiefe Steuerung für Analyse, Umsetzung und Produktion",
    promise: "Agenturen arbeiten mit allen Admin- und Produktionsmodulen in einer Oberfläche.",
    signals: ["Prioritätenklarheit", "Teamdurchsatz", "Risikofrüherkennung", "Content-Output"],
    steps: ["Kunde auswählen", "Signale priorisieren", "Maßnahmen steuern", "Ergebnisse dokumentieren"],
    outcome: "Deutlich weniger Toolwechsel und mehr operative Geschwindigkeit."
  },
  "/plattform/funktionsumfang.html": {
    topic: "Funktionsumfang",
    audience: "für Evaluations- und Einkaufsteams",
    focus: "Was heute live ist und was als Roadmap folgt",
    promise: "Klarer Abgleich zwischen aktuellem Produktumfang und nächstem Ausbauschritt.",
    signals: ["Live-Module", "Roadmap-Module", "Nutzungsreife", "Abdeckungsgrad"],
    steps: ["Anforderung aufnehmen", "Modul zuordnen", "Reifegrad prüfen", "Einführung planen"],
    outcome: "Verlässliche Entscheidungsgrundlage für Rollout und Erwartungsmanagement."
  },
  "/plattform/datenquellen-sync.html": {
    topic: "Datenquellen & Sync",
    audience: "für datengetriebene Agenturen",
    focus: "Automatischer Datenfluss aus Amazon-Quellen",
    promise: "KPI-Ansichten basieren auf laufend aktualisierten Daten statt auf manueller Pflege.",
    signals: ["Sync-Häufigkeit", "Vollständigkeit", "Datenlatenz", "Fehlerstatus"],
    steps: ["Quelle anbinden", "Sync prüfen", "Anomalien markieren", "Daten im Report nutzen"],
    outcome: "Höhere Datensicherheit und weniger manuelle Nacharbeit."
  },
  "/plattform/rollen-rechte.html": {
    topic: "Rollen & Rechte",
    audience: "für Governance und Datenschutz",
    focus: "Trennung von Kundensicht und Agentursteuerung",
    promise: "Jeder Nutzer sieht exakt die Informationen, die zur Rolle passen.",
    signals: ["Rollenabdeckung", "Zugriffsfehler", "Freigabeprozesse", "Auditierbarkeit"],
    steps: ["Rolle definieren", "Rechte zuweisen", "Freigabe testen", "Regelwerk dokumentieren"],
    outcome: "Sichere Zusammenarbeit ohne unklare Zugriffsgrenzen."
  },
  "/plattform/automatisierung.html": {
    topic: "Werbeautomatisierung (Coming Soon)",
    audience: "für skalierende Ads-Teams",
    focus: "Regelsets für Gebote, Budgets und Targets",
    promise: "Templates und individuelle Regeln reduzieren manuelle Kampagnenpflege deutlich.",
    signals: ["Regelabdeckung", "Budgetabweichung", "Gebotsdynamik", "Targeting-Qualität"],
    steps: ["Template wählen", "Grenzwerte setzen", "Regel aktivieren", "Wirkung kontrollieren"],
    outcome: "Planbarer Ads-Betrieb bei wachsender Kundenzahl."
  },
  "/ressourcen/": {
    topic: "Ressourcen-Hub",
    audience: "für Teams in der Umsetzung",
    focus: "Playbooks, Cases und Guides für den Agenturalltag",
    promise: "Jede Ressource ist auf direkte Anwendung im Tagesgeschäft ausgelegt.",
    signals: ["Nutzungsfrequenz", "Team-Standardisierung", "Onboarding-Tempo", "Entscheidungsqualität"],
    steps: ["Ressource auswählen", "im Team ausrollen", "Ergebnisse messen", "Standard festschreiben"],
    outcome: "Schnellere Einarbeitung und einheitliche Arbeitsqualität."
  },
  "/ressourcen/case-studies.html": {
    topic: "Case Studies",
    audience: "für strategische Entscheider",
    focus: "Praxisbelege aus realen Agenturkonstellationen",
    promise: "Die Cases zeigen, wie Teams Struktur, Tempo und Kundenwirkung verbessert haben.",
    signals: ["Ausgangslage", "Umsetzungsweg", "Teamwirkung", "Kundenergebnis"],
    steps: ["Case auswählen", "Muster erkennen", "auf eigenes Team übertragen", "Erfolg validieren"],
    outcome: "Schnelleres Vertrauen in den Rollout auf Basis echter Beispiele."
  },
  "/ressourcen/cases/sellersprint.html": {
    topic: "Case: sellersprint.de",
    audience: "für wachstumsorientierte Agenturen",
    focus: "Operative Struktur bei steigender Kundenanzahl",
    promise: "Der Case zeigt, wie Reporting und Priorisierung im Team stabilisiert wurden.",
    signals: ["Report-Zeit", "Rückfragequote", "Umsetzungsquote", "Klarheit im Team"],
    steps: ["Ist-Stand erfassen", "Modul-Rollout starten", "Review-Rhythmus etablieren", "Wirkung auswerten"],
    outcome: "Messbar stabilere Prozesse bei gleichzeitig höherer Liefergeschwindigkeit."
  },
  "/ressourcen/cases/conversion-studio.html": {
    topic: "Case: Conversion Studio",
    audience: "für Agenturen im Skalierungsmodus",
    focus: "Einheitliche KPI-Logik über mehrere Accounts",
    promise: "Der Case zeigt, wie Standards und Flexibilität gleichzeitig möglich werden.",
    signals: ["Team-Alignment", "KPI-Konsistenz", "Task-Durchsatz", "Kundenzufriedenheit"],
    steps: ["Standard definieren", "Rollenmodell einführen", "Taskfluss aufsetzen", "Qualität absichern"],
    outcome: "Höhere Prozesssicherheit und bessere Skalierbarkeit im Tagesbetrieb."
  },
  "/ressourcen/playbooks/reporting-playbook.html": {
    topic: "Reporting-Playbook",
    audience: "für klare Monatsgespräche",
    focus: "Struktur für Berichte mit Maßnahmenlogik",
    promise: "Das Playbook hilft, Reports als Entscheidungsvorlage statt als Datenanhang zu nutzen.",
    signals: ["KPI-Relevanz", "Argumentationslinie", "Maßnahmenklarheit", "Commitment"],
    steps: ["Reportstruktur wählen", "Kernaussagen priorisieren", "Maßnahmen festlegen", "Folgetermin absichern"],
    outcome: "Professionellere Kundenkommunikation mit höherer Verbindlichkeit."
  },
  "/ressourcen/playbooks/ads-audit.html": {
    topic: "Ads-Audit-Playbook",
    audience: "für PPC-Verantwortliche",
    focus: "Systematische Prüfung von Kampagnenqualität",
    promise: "Das Audit macht Ineffizienzen reproduzierbar sichtbar und priorisiert Verbesserungen.",
    signals: ["Kostenstruktur", "Targeting-Qualität", "Keyword-Wirkung", "Skalierungspotenzial"],
    steps: ["Datenfenster wählen", "Auffälligkeiten clustern", "Prioritäten setzen", "Maßnahmen tracken"],
    outcome: "Schnellere Optimierung mit klarer Reihenfolge und messbarer Wirkung."
  },
  "/ressourcen/guides/kpi-glossar.html": {
    topic: "KPI-Glossar",
    audience: "für einheitliche Team-Sprache",
    focus: "Definitionen für Amazon-Kennzahlen ohne Interpretationslücken",
    promise: "Alle Rollen arbeiten mit denselben KPI-Bedeutungen und Entscheidungsregeln.",
    signals: ["Definitionsklarheit", "Vergleichbarkeit", "Missverständnisse", "Anwendbarkeit"],
    steps: ["KPI prüfen", "Bedeutung abstimmen", "Schwellen definieren", "im Report verankern"],
    outcome: "Weniger Diskussionsaufwand und schnellere Entscheidungen im Team."
  },
  "/ressourcen/guides/onboarding-checkliste.html": {
    topic: "Onboarding-Checkliste",
    audience: "für neue Kundenaufnahmen",
    focus: "Strukturierter Start vom Invite bis zum ersten Report",
    promise: "Die Checkliste reduziert Reibung in den ersten Wochen deutlich.",
    signals: ["Datenzugang", "Rollenzuordnung", "KPI-Abstimmung", "Erster Review-Termin"],
    steps: ["Kickoff durchführen", "Daten anbinden", "Rollen setzen", "erste Maßnahmen priorisieren"],
    outcome: "Schneller produktiver Start mit klaren Verantwortlichkeiten."
  },
  "/ressourcen/faq/agentur-faq.html": {
    topic: "Agentur-FAQ",
    audience: "für häufige Entscheidungsfragen",
    focus: "Klarheit zu Einsatz, Umfang und Rollout",
    promise: "Typische Einwände und Fragen werden kompakt und nachvollziehbar beantwortet.",
    signals: ["Einführungsaufwand", "Funktionsfit", "Teamakzeptanz", "Kundennutzen"],
    steps: ["Frage clustern", "Antwort standardisieren", "im Team teilen", "im Vertrieb nutzen"],
    outcome: "Schnellere Entscheidungswege in Sales und Operations."
  }
};

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

function rotateArray(items, shift) {
  if (!items.length) return items;
  const offset = shift % items.length;
  return items.slice(offset).concat(items.slice(0, offset));
}

function stripHtmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeComparableText(value) {
  return (value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textSimilarity(a, b) {
  const aa = new Set(normalizeComparableText(a).split(" ").filter((token) => token.length > 2));
  const bb = new Set(normalizeComparableText(b).split(" ").filter((token) => token.length > 2));
  if (!aa.size || !bb.size) return 0;
  let intersection = 0;
  aa.forEach((token) => {
    if (bb.has(token)) intersection += 1;
  });
  return intersection / Math.max(aa.size, bb.size);
}

function extractTagTexts(html, tagName) {
  const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  const out = [];
  let match = pattern.exec(html);
  while (match) {
    out.push(stripHtmlToText(match[1]));
    match = pattern.exec(html);
  }
  return out;
}

function getModelForPath(path) {
  if (PAGE_MODELS[path]) return PAGE_MODELS[path];
  if (!path.endsWith("/") && !path.endsWith(".html") && PAGE_MODELS[`${path}.html`]) return PAGE_MODELS[`${path}.html`];
  if (path.endsWith(".html")) {
    const clean = path.replace(/\.html$/, "");
    if (PAGE_MODELS[clean]) return PAGE_MODELS[clean];
  }
  return null;
}

function ensureLongFormSections() {
  const path = normalizePath(location.pathname);
  if (path === "/") return;
  const main = document.querySelector("main.page-shell");
  if (!main) return;

  const model = getModelForPath(path);
  if (!model) return;

  const minSections = path.includes("demo-anfragen") ? 9 : 9;
  const minScrollableViewports = path.includes("demo-anfragen") ? 4.6 : 4.8;
  const requiredScrollableHeight = Math.round(window.innerHeight * minScrollableViewports);
  const fx = ["left", "up", "right", "zoom"];
  const storyline = [
    "Strategischer Kontext",
    "Operatives Raster",
    "Team-Rhythmus",
    "Kundengespräch",
    "Maßnahmen-Backlog",
    "Entscheidungsqualität",
    "Skalierungspfad",
    "Rollout-Timeline",
    "Umsetzungscontrolling",
    "Qualitätssicherung",
    "Wirkungsnachweis",
    "Nächste Ausbaustufe"
  ];
  const angle = [
    "klare Prioritäten statt KPI-Überfrachtung",
    "schnellere Umsetzung mit dokumentierter Verantwortlichkeit",
    "weniger Tool-Wechsel und sauberere Teamübergaben",
    "mehr Verbindlichkeit in Kundenterminen",
    "stabilere Prozesse auch bei wachsender Kundenanzahl",
    "messbarer Fortschritt pro Woche"
  ];
  const headlineVerbs = [
    "priorisiert",
    "synchronisiert",
    "strukturiert",
    "stabilisiert",
    "beschleunigt",
    "verbindet",
    "standardisiert",
    "verdichtet",
    "orchestriert",
    "fokussiert",
    "vereinheitlicht",
    "absichert"
  ];
  const headlineObjects = [
    "KPI-Signale und Maßnahmen",
    "Reporting und operative Umsetzung",
    "Teamrollen und Kundenkommunikation",
    "Entscheidungswege im Tagesgeschäft",
    "Analyse und Handlungspfad",
    "Prioritäten und Verantwortlichkeiten",
    "Rollout-Logik und Qualitätskontrolle",
    "Kundensicht und Agentursicht",
    "Backlog-Steuerung und Ergebnisnachweis",
    "Risikoerkennung und Maßnahmentakt"
  ];
  const headlineOutcomes = [
    "messbare Kundenwirkung",
    "klarere Entscheidungen",
    "stabilere Prozesse",
    "höhere Teamgeschwindigkeit",
    "weniger Reibung im Alltag",
    "saubere Skalierung",
    "bessere Reportqualität",
    "höhere Umsetzungsquote",
    "weniger Abstimmungsaufwand",
    "stärkere Kundenbindung"
  ];

  const makeHeadline = (seed) => {
    const base = hashString(`${path}:${seed}:headline`);
    const a = headlineVerbs[base % headlineVerbs.length];
    const b = headlineObjects[(base * 3) % headlineObjects.length];
    const c = headlineOutcomes[(base * 5) % headlineOutcomes.length];
    return `${model.topic}: ${a} ${b} für ${c}`;
  };
  const makeLead = (seed) => `${model.promise} Schwerpunkt: ${angle[seed % angle.length]}.`;
  const detailSeed = (seed) => {
    const modifiers = ["Fokus", "Steuerung", "Praxis", "Framework", "Ablauf", "Review", "Plan", "Signal"];
    const baseSeed = hashString(`${path}:${seed}:kicker`);
    const base = storyline[baseSeed % storyline.length];
    const mod = modifiers[(baseSeed * 7) % modifiers.length];
    return `${base} · ${mod}`;
  };

  const variations = [
    (i) => `
      <section class="section longform-section">
        <div class="split">
          <div data-reveal data-fx="${fx[i % fx.length]}">
            <p class="kicker">${model.topic} · ${detailSeed(i)}</p>
            <h2>${makeHeadline(i)}</h2>
            <p class="lead">${makeLead(i)}</p>
            <ul class="list">
              <li>${model.topic} ${model.audience}</li>
              <li>Schwerpunkt: ${model.signals[0]} und ${model.signals[1]}</li>
              <li>Wirkung: ${model.outcome}</li>
            </ul>
          </div>
          <article class="panel card longform-panel interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <p class="tag">Entscheidungslogik</p>
            <h3>Welche Signale zuerst bewertet werden</h3>
            <p>${model.signals[0]}, ${model.signals[1]}, ${model.signals[2]} und ${model.signals[3]} bilden die Priorisierung im Tagesgeschäft.</p>
            <p class="interactive-note">Diese Perspektive zeigt, welche Signale in der Reihenfolge priorisiert werden.</p>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <p class="kicker" data-reveal data-fx="${fx[i % fx.length]}">${model.topic} · ${detailSeed(i + 1)}</p>
        <h2 data-reveal data-fx="up">${makeHeadline(i + 1)}</h2>
        <div class="content-grid" style="margin-top:1rem;">
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <h3>Schritt 1: Ausgangslage klären</h3>
            <p>${model.steps[0]} und ${model.steps[1]}, damit alle im Team dieselbe Priorität sehen.</p>
          </article>
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 2) % fx.length]}">
            <h3>Schritt 2: Umsetzung absichern</h3>
            <p>${model.steps[2]} und ${model.steps[3]}, damit Maßnahmen im Report sauber nachvollziehbar sind.</p>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <article class="panel longform-panel" data-reveal data-fx="${fx[i % fx.length]}">
          <p class="kicker">${model.topic} · ${detailSeed(i + 2)}</p>
          <h2>${makeHeadline(i + 2)}</h2>
          <p class="lead">Diese KPI-Perspektive hilft, Diskussionen im Kundencall auf Wirkung und nächste Schritte zu lenken.</p>
          <div class="kpi-band" style="margin-top:1rem;">
            <article><strong>${model.signals[0]}</strong><span>Frühindikator für Handlungsbedarf</span></article>
            <article><strong>${model.signals[1]}</strong><span>Ursachenanalyse und Priorisierung</span></article>
            <article><strong>${model.signals[2]}</strong><span>Maßnahmenauswahl im Team</span></article>
            <article><strong>${model.signals[3]}</strong><span>Erfolgskontrolle im Folgereview</span></article>
          </div>
        </article>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <div class="content-grid">
          <article class="panel card longform-panel interactive-card" data-reveal data-fx="${fx[i % fx.length]}">
            <p class="tag">${detailSeed(i + 3)}</p>
            <h3>${makeHeadline(i + 3)}</h3>
            <ul class="list">
              <li>Montag: ${model.steps[0]} und Signalcheck</li>
              <li>Mittwoch: ${model.steps[1]} mit Teamabgleich</li>
              <li>Freitag: ${model.steps[2]} und Ergebnisdokumentation</li>
            </ul>
          </article>
          <article class="panel card longform-panel interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <p class="tag">Ergebnisbild</p>
            <h3>Welcher Nutzen im Kundengeschäft entsteht</h3>
            <p>${model.outcome}</p>
            <p class="interactive-note">So bleibt der Nutzen klar: Wirkung, Priorität und Umsetzung sind sauber verbunden.</p>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <div class="split">
          <article class="panel timeline" data-reveal data-fx="${fx[i % fx.length]}">
            <p class="kicker">${model.topic} · ${detailSeed(i + 4)}</p>
            <h2>${makeHeadline(i + 4)}</h2>
            <ol>
              <li><span>1</span><div><strong>Erkennen</strong><p>${model.signals[0]} und ${model.signals[1]} werden als Signalquelle priorisiert.</p></div></li>
              <li><span>2</span><div><strong>Bewerten</strong><p>${model.steps[0]} und ${model.steps[1]} sichern einheitliche Bewertung im Team.</p></div></li>
              <li><span>3</span><div><strong>Umsetzen</strong><p>${model.steps[2]} und ${model.steps[3]} machen Fortschritt reportfähig.</p></div></li>
            </ol>
          </article>
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <p class="tag">Kommunikation</p>
            <h3>Argumentation für Kundentermine</h3>
            <p>In der Präsentation wird zuerst das relevante Signal gezeigt, danach Ursache, Maßnahme und erwartete Wirkung.</p>
            <ul class="list">
              <li>Klarer roter Faden ohne KPI-Überladung</li>
              <li>Konkretes Commitment bis zum nächsten Review</li>
              <li>Dokumentierte Verantwortlichkeit je Maßnahme</li>
            </ul>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <p class="kicker" data-reveal data-fx="${fx[i % fx.length]}">${model.topic} · ${detailSeed(i + 5)}</p>
        <h2 data-reveal data-fx="up">${makeHeadline(i + 5)}</h2>
        <div class="feature-grid" style="margin-top:1rem;">
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <h3>Inhalt</h3>
            <p>Ist die Aussage für den Kunden eindeutig und auf ein Ziel ausgerichtet?</p>
          </article>
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 2) % fx.length]}">
            <h3>Datenbasis</h3>
            <p>Sind Kennzahlen, Zeiträume und Vergleiche konsistent dokumentiert?</p>
          </article>
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 3) % fx.length]}">
            <h3>Maßnahme</h3>
            <p>Ist eindeutig, wer bis wann was umsetzt und wie Erfolg gemessen wird?</p>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <p class="kicker" data-reveal data-fx="${fx[i % fx.length]}">${model.topic} · ${detailSeed(i + 6)}</p>
        <h2 data-reveal data-fx="up">${makeHeadline(i + 6)}</h2>
        <div class="split">
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <p class="tag">Woche 1</p>
            <h3>Setup und Zielbild</h3>
            <ul class="list">
              <li>${model.steps[0]} mit klarer Zieldefinition</li>
              <li>Verantwortlichkeiten je Rolle sauber verteilen</li>
              <li>Kritische KPI-Signale für den Start festlegen</li>
            </ul>
          </article>
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 2) % fx.length]}">
            <p class="tag">Woche 2-4</p>
            <h3>Stabilisierung und Skalierung</h3>
            <ul class="list">
              <li>${model.steps[1]} und ${model.steps[2]} in festen Routinen</li>
              <li>Reporting-Rhythmus für Kundenkommunikation etablieren</li>
              <li>Ergebnisse aus ${model.signals[2]} und ${model.signals[3]} messbar machen</li>
            </ul>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <article class="panel cta-box" data-reveal data-fx="${fx[i % fx.length]}">
          <p class="kicker">${model.topic} · ${detailSeed(i + 7)}</p>
          <h2>Warum Agenturen damit schneller liefern und überzeugender verkaufen</h2>
          <p class="lead">${model.promise} Dadurch entsteht ein klarer Vorteil in Akquise, Kundenführung und operativer Umsetzung.</p>
          <div class="kpi-band" style="margin-top:1.1rem;">
            <article><strong>Schnelleres Onboarding</strong><span>Weniger Abstimmung bis zum ersten verwertbaren Report</span></article>
            <article><strong>Stabilere Prozesse</strong><span>Weniger Toolwechsel und geringere Fehleranfälligkeit</span></article>
            <article><strong>Klarere Kundencalls</strong><span>Entscheidungen statt KPI-Overload im Gespräch</span></article>
            <article><strong>Höherer Durchsatz</strong><span>Mehr umgesetzte Maßnahmen pro Kunde und Monat</span></article>
          </div>
          <div class="hero-cta" style="justify-content:center;margin-top:1.1rem;">
            <a class="btn primary" href="/demo-anfragen.html">Demo anfragen</a>
            <a class="btn secondary" href="/branchen/amazon-agenturen.html">Für Agenturen ansehen</a>
          </div>
        </article>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <article class="panel reveal-shell" data-click-reveal data-reveal data-fx="${fx[i % fx.length]}">
          <p class="kicker">${model.topic} · ${detailSeed(i + 8)}</p>
          <h2>${makeHeadline(i + 7)}</h2>
          <p class="lead">Interaktive Vertiefung für Entscheider in Amazon-Agenturen: pro Klick ein konkreter Umsetzungshebel.</p>
          <div class="reveal-tabs">
            <button class="reveal-tab active" type="button" data-reveal-target="prozess-${i}">Prozess</button>
            <button class="reveal-tab" type="button" data-reveal-target="qualität-${i}">Qualität</button>
            <button class="reveal-tab" type="button" data-reveal-target="ergebnis-${i}">Ergebnis</button>
          </div>
          <div class="reveal-panels">
            <article class="reveal-panel active" data-reveal-panel="prozess-${i}">
              <h3>Prozessklarheit im Tagesgeschäft</h3>
              <p>${model.steps[0]}, ${model.steps[1]} und ${model.steps[2]} werden mit fester Verantwortlichkeit im Team umgesetzt.</p>
            </article>
            <article class="reveal-panel" data-reveal-panel="qualität-${i}">
              <h3>Qualitätskriterien pro Kundenkonto</h3>
              <p>${model.signals[0]}, ${model.signals[1]} und ${model.signals[2]} bilden das Standard-Raster für Priorisierung und Report-Freigabe.</p>
            </article>
            <article class="reveal-panel" data-reveal-panel="ergebnis-${i}">
              <h3>Messbares Ergebnisbild</h3>
              <p>${model.outcome} Dadurch steigt die Verbindlichkeit in Kundengesprächen und die Umsetzungsquote im Team.</p>
            </article>
          </div>
        </article>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <div class="split">
          <article class="panel card interactive-card" data-reveal data-fx="${fx[i % fx.length]}">
            <p class="tag">Praxis-Snapshot</p>
            <h3>${makeHeadline(i + 8)}</h3>
            <p>Diese Perspektive fokussiert ${model.signals[0]} und ${model.signals[3]} für Entscheidungen mit direkter Kundenwirkung.</p>
            <ul class="list">
              <li>Klare Priorität je ASIN und Zeitraum</li>
              <li>Nachvollziehbare Entscheidung im Teamprotokoll</li>
              <li>Messbare Auswirkung bis zum Folgetermin</li>
            </ul>
          </article>
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <p class="tag">Operativer Hebel</p>
            <h3>Wie der Block in der Agentur direkt genutzt wird</h3>
            <p>${model.steps[1]} und ${model.steps[3]} geben dem Team einen festen Ablauf für Umsetzung und Reporting.</p>
            <p class="interactive-note">Der Ablauf ist dadurch im Team eindeutig und in Kundenreports konsistent nachvollziehbar.</p>
          </article>
        </div>
      </section>
    `
  ];

  const orderedVariations = rotateArray(variations, hashString(path) % variations.length).map((render, idx) => ({
    id: idx,
    layout: idx,
    render
  }));

  const seenSignatures = new Set();
  const usedLayouts = new Set();
  const seenHeadings = new Set(
    Array.from(main.querySelectorAll(":scope > section h1, :scope > section h2, :scope > section h3"))
      .map((el) => normalizeComparableText(el.textContent || ""))
      .filter(Boolean)
  );
  const seenKickers = new Set(
    Array.from(main.querySelectorAll(":scope > section .kicker"))
      .map((el) => normalizeComparableText(el.textContent || ""))
      .filter(Boolean)
  );
  const recentTexts = [];
  let lastLayout = -1;
  let added = 0;
  let guard = 0;

  const needsMoreDepth = () => {
    const sectionCount = main.querySelectorAll(":scope > section").length;
    const scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return sectionCount < minSections || scrollableHeight < requiredScrollableHeight;
  };

  while (needsMoreDepth() && guard < 36) {
    const seed = hashString(`${path}:${guard}:${added}`);
    const startIndex = (seed + added) % orderedVariations.length;
    let candidate = orderedVariations[startIndex];
    let candidateHtml = candidate.render(added + guard);
    let candidateText = stripHtmlToText(candidateHtml);
    let candidateSignature = normalizeComparableText(candidateText).slice(0, 240);
    let candidateHeadings = extractTagTexts(candidateHtml, "h2")
      .concat(extractTagTexts(candidateHtml, "h3"))
      .map(normalizeComparableText)
      .filter(Boolean);
    let candidateKickers = extractTagTexts(candidateHtml, "p")
      .map(normalizeComparableText)
      .filter((line) => line.startsWith(normalizeComparableText(model.topic)))
      .slice(0, 2);
    let attempts = 0;

    while (attempts < orderedVariations.length * 2) {
      const tooSimilarRecent = recentTexts.some((existing) => textSimilarity(existing, candidateText) >= 0.72);
      const isKnownSignature = seenSignatures.has(candidateSignature);
      const sameLayoutAsLast = candidate.layout === lastLayout;
      const layoutAlreadyUsed = usedLayouts.has(candidate.layout);
      const hasSeenHeading = candidateHeadings.some((h) => seenHeadings.has(h));
      const hasSeenKicker = candidateKickers.some((k) => seenKickers.has(k));
      if (!tooSimilarRecent && !isKnownSignature && !sameLayoutAsLast && !layoutAlreadyUsed && !hasSeenHeading && !hasSeenKicker) break;
      attempts += 1;
      const next = orderedVariations[(startIndex + attempts) % orderedVariations.length];
      candidate = next;
      candidateHtml = candidate.render(added + guard + attempts);
      candidateText = stripHtmlToText(candidateHtml);
      candidateSignature = normalizeComparableText(candidateText).slice(0, 240);
      candidateHeadings = extractTagTexts(candidateHtml, "h2")
        .concat(extractTagTexts(candidateHtml, "h3"))
        .map(normalizeComparableText)
        .filter(Boolean);
      candidateKickers = extractTagTexts(candidateHtml, "p")
        .map(normalizeComparableText)
        .filter((line) => line.startsWith(normalizeComparableText(model.topic)))
        .slice(0, 2);
    }

    main.insertAdjacentHTML("beforeend", candidateHtml);
    seenSignatures.add(candidateSignature);
    usedLayouts.add(candidate.layout);
    candidateHeadings.forEach((h) => seenHeadings.add(h));
    candidateKickers.forEach((k) => seenKickers.add(k));
    recentTexts.push(candidateText);
    if (recentTexts.length > 3) recentTexts.shift();
    lastLayout = candidate.layout;
    added += 1;
    guard += 1;
  }
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!revealItems.length) return;

  const baseTransforms = {
    left: "none",
    right: "none",
    up: "none",
    zoom: "none"
  };

  revealItems.forEach((item, idx) => {
    const fx = item.dataset.fx;
    if (fx && baseTransforms[fx]) item.style.transform = baseTransforms[fx];
    item.style.transitionDelay = `${Math.min((idx % 8) * 45, 220)}ms`;
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in"));
  }
}

function initScrollProgress() {
  let bar = document.querySelector(".scroll-progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.prepend(bar);
  }

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initDetailsAccordion() {
  const details = document.querySelectorAll("details");
  details.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      details.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function initMouseGlow() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!finePointer) return;
  document.body.classList.add("has-mouse-glow");
  let raf = 0;
  const update = (x, y) => {
    document.body.style.setProperty("--mx", `${x}px`);
    document.body.style.setProperty("--my", `${y}px`);
    document.body.style.setProperty("--glow-opacity", "1");
  };
  window.addEventListener("pointermove", (event) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      update(event.clientX, event.clientY);
      raf = 0;
    });
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    document.body.style.setProperty("--glow-opacity", "0");
  });
  update(window.innerWidth * 0.5, window.innerHeight * 0.25);
}

function initClickRevealModules() {
  const modules = Array.from(document.querySelectorAll("[data-click-reveal]"));
  modules.forEach((module) => {
    const tabs = Array.from(module.querySelectorAll(".reveal-tab[data-reveal-target]"));
    const panels = Array.from(module.querySelectorAll(".reveal-panel[data-reveal-panel]"));
    if (!tabs.length || !panels.length) return;

    const activate = (target) => {
      tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.revealTarget === target));
      panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.revealPanel === target));
    };

    const activeTab = tabs.find((tab) => tab.classList.contains("active"));
    const initialTarget = activeTab ? activeTab.dataset.revealTarget : tabs[0].dataset.revealTarget;
    activate(initialTarget);

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.revealTarget));
    });
  });
}

renderHeaderAndFooter();
rewriteDemoLinks();
setupTicker();
initSegmentLanding();
ensureLongFormSections();
initRevealAnimations();
initDetailsAccordion();
initScrollProgress();
initMouseGlow();
initClickRevealModules();

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (!topbar) return;
  topbar.style.background = window.scrollY > 24 ? "rgba(8, 15, 24, 0.9)" : "rgba(8, 15, 24, 0.76)";
});
