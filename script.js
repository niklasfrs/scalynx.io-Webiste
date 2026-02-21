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
  {
    label: "Für Agenturen",
    href: "/branchen/amazon-agenturen.html",
    children: [
      { label: "Amazon-Agenturen", href: "/branchen/amazon-agenturen.html" },
      { label: "Nach Agenturgröße", href: "/branchen/agentur-segmente.html" }
    ]
  },
  {
    label: "Ressourcen",
    href: "/ressourcen/",
    children: [
      { label: "Ressourcenübersicht", href: "/ressourcen/" },
      { label: "Case Studies", href: "/ressourcen/case-studies" },
      { label: "Reporting-Playbook", href: "/ressourcen/playbooks/reporting-playbook.html" },
      { label: "Ads-Audit-Playbook", href: "/ressourcen/playbooks/ads-audit.html" },
      { label: "KPI-Glossar", href: "/ressourcen/guides/kpi-glossar.html" },
      { label: "Onboarding-Checkliste", href: "/ressourcen/guides/onboarding-checkliste.html" },
      { label: "Agentur-FAQ", href: "/ressourcen/faq/agentur-faq.html" }
    ]
  }
];

const TOPIC_LIBRARY = {
  dashboard: {
    prefix: "Dashboard-Steuerung",
    bullets: ["KPI-Logik je Land", "MoM/YoY Vergleich", "ASIN-Drilldown"],
    details: [
      "Priorisiert Top- und Risiko-ASINs in einem Blick.",
      "Verbindet Umsatz, Conversion und Werbequote im selben Kontext.",
      "Unterstützt B2B/B2C-Auswertungen für bessere Budgetsteuerung."
    ]
  },
  werbung: {
    prefix: "Werbeanalyse",
    bullets: ["ACoS/TACoS", "Budgetsteuerung", "Targeting-Fokus"],
    details: [
      "Identifiziert ineffiziente Kampagnen schneller.",
      "Hebt rentable Skalierungschancen klar hervor.",
      "Zeigt Zusammenhang aus Spend, Impression und Umsatzwirkung."
    ]
  },
  insights: {
    prefix: "Insights & Health",
    bullets: ["Risikofrühwarnung", "Findings-Priorität", "Empfehlungslogik"],
    details: [
      "Erkennt BuyBox-, Conversion- und Trendabweichungen frühzeitig.",
      "Priorisiert Maßnahmen nach operativer Wirkung.",
      "Gibt Agenturteams klare nächste Schritte statt Rohdaten."
    ]
  },
  promotions: {
    prefix: "Promotions-Review",
    bullets: ["Vorher/Nachher", "Vorjahresvergleich", "Wiederholungslogik"],
    details: [
      "Bewertet Aktionen datenbasiert statt subjektiv.",
      "Zeigt konkrete Wirkung auf Umsatz, TACoS und Conversion.",
      "Verbessert Planung für Prime Day und saisonale Peaks."
    ]
  },
  content: {
    prefix: "Content-Output",
    bullets: ["Bulk-Produktion", "A+ Basic/Premium", "Keyword/Competition"],
    details: [
      "Skaliert Content-Erstellung für viele ASINs parallel.",
      "Verbessert Time-to-Live neuer Creative-Ideen.",
      "Verbindet Performance-Signale mit Content-Entscheidungen."
    ]
  },
  kunden: {
    prefix: "Kundenführung",
    bullets: ["Rollen & Zugriff", "Monatsstatus", "Kommunikationsstruktur"],
    details: [
      "Konsolidiert Kundenstatus und operative To-dos zentral.",
      "Sorgt für planbare Übergaben im Team.",
      "Reduziert Rückfragen im Reporting-Prozess."
    ]
  },
  plattform: {
    prefix: "Plattformarchitektur",
    bullets: ["Kundensicht", "Agentursicht", "Datenfluss"],
    details: [
      "Trennt Entscheidungsdaten von operativer Tiefe sauber.",
      "Schafft Stabilität bei wachsender Kundenanzahl.",
      "Ermöglicht konsistente Prozessqualität je Teammitglied."
    ]
  },
  ressourcen: {
    prefix: "Praxis-Ressource",
    bullets: ["Playbook", "Framework", "Sofort nutzbar"],
    details: [
      "Lieferbar als direkt umsetzbare Teamvorlage.",
      "Standardisiert interne Qualität über alle Kunden.",
      "Beschleunigt Onboarding und operative Umsetzung."
    ]
  },
  default: {
    prefix: "Agenturvorteil",
    bullets: ["Skalierbarkeit", "Klarheit", "Umsetzung"],
    details: [
      "Richtet Fokus auf messbare Agenturleistung.",
      "Verringert Toolwechsel und Abstimmungsaufwand.",
      "Erhöht Geschwindigkeit von Insight bis Maßnahme."
    ]
  }
};

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

function renderHeaderAndFooter() {
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
      <small>© 2026 scalynx.io – gebaut für Amazon-Agenturen.</small>
    `;
  }
}

function rewriteDemoLinks() {
  document.querySelectorAll("a").forEach((link) => {
    const label = (link.textContent || "").trim().toLowerCase();
    if (label === "demo anfragen" || label === "live-demo buchen" || label === "live demo buchen") {
      link.setAttribute("href", "/demo-anfragen.html");
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

function detectTopic(path) {
  if (path.includes("werbung")) return "werbung";
  if (path.includes("promotion")) return "promotions";
  if (path.includes("content")) return "content";
  if (path.includes("insights") || path.includes("findings") || path.includes("health")) return "insights";
  if (path.includes("dashboard") || path.includes("reporting")) return "dashboard";
  if (path.includes("kunden") || path.includes("aufgaben")) return "kunden";
  if (path.includes("/plattform/")) return "plattform";
  if (path.includes("/ressourcen/")) return "ressourcen";
  return "default";
}

function ensureDeepContent() {
  const path = normalizePath(location.pathname);
  if (path === "/" || path.includes("impressum") || path.includes("datenschutz") || path.includes("agb")) return;
  const main = document.querySelector("main.page-shell");
  if (!main) return;

  const currentCards = main.querySelectorAll("article.panel.card").length;
  if (currentCards >= 8) return;

  const topicKey = detectTopic(path);
  const topic = TOPIC_LIBRARY[topicKey] || TOPIC_LIBRARY.default;
  const needed = Math.min(12, Math.max(8, 10) - currentCards);
  const fx = ["left", "up", "right", "zoom"];

  const cards = Array.from({ length: needed }).map((_, i) => {
    const detail = topic.details[i % topic.details.length];
    const title = `${topic.prefix} ${i + 1}`;
    const b1 = topic.bullets[i % topic.bullets.length];
    const b2 = topic.bullets[(i + 1) % topic.bullets.length];
    const b3 = topic.bullets[(i + 2) % topic.bullets.length];
    return `
      <article class="panel card deep-card variant-${i % 4}" data-reveal data-fx="${fx[i % fx.length]}">
        <p class="tag">Deep Dive</p>
        <h3>${title}</h3>
        <p>${detail}</p>
        <ul class="mini-list">
          <li>${b1}</li>
          <li>${b2}</li>
          <li>${b3}</li>
        </ul>
      </article>
    `;
  }).join("");

  const section = document.createElement("section");
  section.className = "section deep-dive";
  section.innerHTML = `
    <p class="kicker" data-reveal data-fx="left">Detaillierte Umsetzung</p>
    <h2 data-reveal data-fx="up">Tiefer Einblick für Amazon-Agenturen</h2>
    <p class="lead" data-reveal data-fx="right">Damit jede Seite nicht nur überblickt, sondern wirklich erklärt: hier sind zusätzliche operative Bausteine mit direktem Praxisbezug.</p>
    <div class="deep-grid">${cards}</div>
  `;
  main.appendChild(section);
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!revealItems.length) return;

  const baseTransforms = {
    left: "translateX(-28px)",
    right: "translateX(28px)",
    up: "translateY(24px)",
    zoom: "scale(.94) translateY(12px)"
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

renderHeaderAndFooter();
rewriteDemoLinks();
setupTicker();
initSegmentLanding();
ensureDeepContent();
initRevealAnimations();
initDetailsAccordion();

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (!topbar) return;
  topbar.style.background = window.scrollY > 24 ? "rgba(8, 15, 24, 0.9)" : "rgba(8, 15, 24, 0.76)";
});
