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
      { label: "Case Studies", href: "/ressourcen/case-studies" },
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

function ensureLongFormSections() {
  const path = normalizePath(location.pathname);
  if (path === "/" || path.includes("impressum") || path.includes("datenschutz") || path.includes("agb") || path.includes("demo-anfragen")) return;
  const main = document.querySelector("main.page-shell");
  if (!main) return;

  const sectionCount = main.querySelectorAll(":scope > section").length;
  if (sectionCount >= 8) return;

  const topic = path.includes("/leistungen/")
    ? "Leistungsumsetzung"
    : path.includes("/plattform/")
      ? "Plattformlogik"
      : path.includes("/ressourcen/")
        ? "Praxiswissen"
        : "Agenturstrategie";

  const needed = 8 - sectionCount;
  const fx = ["left", "up", "right", "zoom"];

  const blocks = Array.from({ length: needed }).map((_, i) => `
    <section class="section">
      <article class="panel card longform-panel" data-reveal data-fx="${fx[i % fx.length]}">
        <p class="kicker">${topic} · Abschnitt ${i + 1}</p>
        <h2>${topic}: Klarer Fokus für Entscheidungen und Umsetzung</h2>
        <p class="lead">Dieser Abschnitt vertieft das Seitenthema mit operativer Perspektive, damit Agenturinhaber, Teamleads und Account Manager dieselbe Entscheidungslogik nutzen.</p>
        <ul class="list">
          <li>Konkrete Einordnung von KPI-Signalen statt reiner Zahlenansicht</li>
          <li>Handlungspfad vom Insight zur priorisierten Maßnahme</li>
          <li>Saubere Kommunikation der nächsten Schritte gegenüber Kunden</li>
        </ul>
      </article>
    </section>
  `).join("");

  const wrapper = document.createElement("div");
  wrapper.className = "longform-stack";
  wrapper.innerHTML = blocks;
  main.appendChild(wrapper);
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

renderHeaderAndFooter();
rewriteDemoLinks();
setupTicker();
initSegmentLanding();
ensureLongFormSections();
initRevealAnimations();
initDetailsAccordion();
initScrollProgress();

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (!topbar) return;
  topbar.style.background = window.scrollY > 24 ? "rgba(8, 15, 24, 0.9)" : "rgba(8, 15, 24, 0.76)";
});
