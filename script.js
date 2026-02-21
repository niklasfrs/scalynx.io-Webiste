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
  const currentPath = normalizePath(location.pathname);
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const nav = topbar.querySelector(".nav");
    if (nav) nav.innerHTML = buildNavHTML(currentPath);
    const cta = topbar.querySelector(".btn.primary");
    if (cta) {
      cta.href = "mailto:info@scalynx.io?subject=Demo-Anfrage%20scalynx.io";
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

renderHeaderAndFooter();

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (!topbar) return;
  topbar.style.background = window.scrollY > 24 ? "rgba(8, 15, 24, 0.9)" : "rgba(8, 15, 24, 0.76)";
});

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && revealItems.length) {
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

const details = document.querySelectorAll("details");
details.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    details.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
