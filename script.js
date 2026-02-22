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

function ensureLongFormSections() {
  const path = normalizePath(location.pathname);
  if (path === "/" || path.includes("impressum") || path.includes("datenschutz") || path.includes("agb")) return;
  const main = document.querySelector("main.page-shell");
  if (!main) return;

  const minSections = path.includes("demo-anfragen") ? 4 : 8;
  const sectionCount = main.querySelectorAll(":scope > section").length;
  if (sectionCount >= minSections) return;

  const topic = path.includes("/leistungen/")
    ? "Leistungsumsetzung"
    : path.includes("/plattform/")
      ? "Plattformlogik"
      : path.includes("/ressourcen/")
        ? "Praxiswissen"
        : "Agenturstrategie";

  const needed = minSections - sectionCount;
  const fx = ["left", "up", "right", "zoom"];

  const variants = [
    (i) => `
      <section class="section longform-section">
        <div class="split">
          <div data-reveal data-fx="${fx[i % fx.length]}">
            <p class="kicker">${topic} · Prozessblock ${i + 1}</p>
            <h2>Vom Signal zur Entscheidung ohne Kontextverlust</h2>
            <p class="lead">Jeder Schritt ist so aufgebaut, dass dein Team direkt zwischen Diagnose, Priorisierung und Maßnahme wechseln kann.</p>
            <ul class="list">
              <li>Frühindikatoren mit klarer Schwellenlogik</li>
              <li>Verantwortung mit Owner und Termin pro Maßnahme</li>
              <li>Kommunizierbare Argumentation für Kunden-Calls</li>
            </ul>
          </div>
          <article class="panel card longform-panel interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <p class="tag">Umsetzung</p>
            <h3>Operativer Vorteil für Agenturen</h3>
            <p>Du arbeitest in einem durchgängigen Ablauf statt zwischen mehreren Tools und Tabellen zu wechseln.</p>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <p class="kicker" data-reveal data-fx="${fx[i % fx.length]}">${topic} · Teamsteuerung ${i + 1}</p>
        <h2 data-reveal data-fx="up">Mehr Klarheit für Owner, Teamlead und Account Manager</h2>
        <div class="content-grid" style="margin-top:1rem;">
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <h3>Leitfrage 1</h3>
            <p>Welche Kennzahl kippt gerade, und was ist die wahrscheinlichste Ursache?</p>
          </article>
          <article class="panel card interactive-card" data-reveal data-fx="${fx[(i + 2) % fx.length]}">
            <h3>Leitfrage 2</h3>
            <p>Welche Maßnahme erzeugt im nächsten Zyklus die höchste Wirkung?</p>
          </article>
        </div>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <article class="panel longform-panel" data-reveal data-fx="${fx[i % fx.length]}">
          <p class="kicker">${topic} · Qualitätsblock ${i + 1}</p>
          <h2>Standardisierung ohne Verlust an Kundenspezifik</h2>
          <p class="lead">Die Struktur bleibt über Kunden hinweg gleich, während Inhalte und Prioritäten je Account individuell gesteuert werden.</p>
          <div class="kpi-band" style="margin-top:1rem;">
            <article><strong>Signal</strong><span>Was ist konkret auffällig?</span></article>
            <article><strong>Ursache</strong><span>Was treibt die Entwicklung?</span></article>
            <article><strong>Aktion</strong><span>Was wird als Nächstes umgesetzt?</span></article>
            <article><strong>Wirkung</strong><span>Wie wird Erfolg gemessen?</span></article>
          </div>
        </article>
      </section>
    `,
    (i) => `
      <section class="section longform-section">
        <div class="content-grid">
          <article class="panel card longform-panel interactive-card" data-reveal data-fx="${fx[i % fx.length]}">
            <p class="tag">Praxis</p>
            <h3>Typischer Sprint-Ablauf</h3>
            <ul class="list">
              <li>Montag: KPI-Scan + Risiko-Priorisierung</li>
              <li>Mittwoch: Maßnahmenstatus und Anpassung</li>
              <li>Freitag: Report-Update und Kundenkommunikation</li>
            </ul>
          </article>
          <article class="panel card longform-panel interactive-card" data-reveal data-fx="${fx[(i + 1) % fx.length]}">
            <p class="tag">Outcome</p>
            <h3>Was sich im Alltag verbessert</h3>
            <p>Weniger Rückfragen, kürzere Abstimmungsschleifen und höhere Umsetzungsgeschwindigkeit über alle Kunden hinweg.</p>
            <p class="interactive-note">Tipp: Klicke Karten an, um Fokus und Priorisierung visuell hervorzuheben.</p>
          </article>
        </div>
      </section>
    `
  ];

  const blocks = Array.from({ length: needed })
    .map((_, i) => variants[i % variants.length](i))
    .join("");

  main.insertAdjacentHTML("beforeend", blocks);
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

function initClickInteractions() {
  const interactiveCards = Array.from(document.querySelectorAll(".card, .panel.interactive-card"));
  interactiveCards.forEach((card) => {
    card.addEventListener("click", () => {
      const container = card.closest(".content-grid, .feature-grid, .deep-grid, .split, .section") || document;
      container.querySelectorAll(".card.is-active").forEach((active) => {
        if (active !== card) active.classList.remove("is-active");
      });
      card.classList.add("is-active");
      card.classList.remove("click-pulse");
      void card.offsetWidth;
      card.classList.add("click-pulse");
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
initClickInteractions();

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (!topbar) return;
  topbar.style.background = window.scrollY > 24 ? "rgba(8, 15, 24, 0.9)" : "rgba(8, 15, 24, 0.76)";
});
