(function () {
  const page = document.body.dataset.page;
  if (!page) return;

  const ORANGE = "#ff9500";
  const MUTED = "#8b949e";
  const WHITE = "#f0f6fc";
  const GREEN = "#10b981";
  const RED = "#f85149";

  const TIERS = [
    { id: "starter", name: "Starter", range: "1-5 Kunden", pricePerCustomer: 149, min: 1, max: 5, priceKey: "starterPerCustomer", note: "" },
    { id: "growth", name: "Growth", range: "6-20 Kunden", pricePerCustomer: 119, min: 6, max: 20, priceKey: "growthPerCustomer", note: "EUR 30 weniger pro Kunde als Starter" },
    { id: "agency", name: "Agency", range: "21+ Kunden", pricePerCustomer: 99, min: 21, max: null, priceKey: "agencyPerCustomer", note: "EUR 50 weniger pro Kunde als Starter" }
  ];

  const PRICE_IDS = {
    basis: { month: "price_1T8O6ULyQHKwCZqqeE4mOMLU", year: "price_1T8O6ULyQHKwCZqq79jRD3KF" },
    starterPerCustomer: { month: "price_1T8O6ULyQHKwCZqqpig7FC1X", year: "price_1T8O6ULyQHKwCZqqV6RFCCYG" },
    growthPerCustomer: { month: "price_1T8O6ULyQHKwCZqqpL4L28gz", year: "price_1T8O6ULyQHKwCZqqJCnshRPs" },
    agencyPerCustomer: { month: "price_1T8O6ULyQHKwCZqq0XWeaTVX", year: "price_1T8O6ULyQHKwCZqqI20wThmP" }
  };

  const testimonials = [
    {
      quote: "Scalynx hat unseren kompletten Agentur-Workflow transformiert. Wir betreuen heute deutlich mehr Kunden mit demselben Team und behalten dabei Reporting, To-dos und Insights in einem System.",
      name: "Florian Egger",
      role: "Geschäftsführer, Conversion Studio"
    },
    {
      quote: "Endlich eine Software, die mit uns skaliert. Kein Tool-Chaos mehr, keine losen Notizen und ein Pricing, das für wachsende Agenturen sogar fairer wird.",
      name: "Leven Brandner",
      role: "Geschäftsführer, Sellersprint"
    }
  ];

  const faqs = [
    {
      question: "Kann ich später mehr Kunden hinzufügen?",
      answer: "Ja. Der Plan passt sich automatisch an. Sobald ihr mehr Kunden hinzufügt, springt ihr in die passende Staffel und zahlt pro Kunde weniger."
    },
    {
      question: "Was ist in der Grundgebühr von EUR 49 enthalten?",
      answer: "Die Grundgebühr deckt die Plattform-Infrastruktur ab: Agentur-Dashboard, Rollenmodell, Updates, Hosting und Support."
    },
    {
      question: "Wie funktioniert der Jahresrabatt?",
      answer: "Bei jährlicher Abrechnung reduzieren wir den Gesamtpreis um 20 Prozent. Die monatliche Vergleichsrate zeigen wir transparent weiter an."
    },
    {
      question: "Welchen Plan bekomme ich?",
      answer: "1 bis 5 Kunden = Starter, 6 bis 20 Kunden = Growth, 21+ Kunden = Agency. Die Zuweisung erfolgt automatisch anhand der Kundenzahl."
    }
  ];

  function formatCurrency(value, digits) {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  }

  function getPlanForCount(count) {
    if (count <= 5) return TIERS[0];
    if (count <= 20) return TIERS[1];
    return TIERS[2];
  }

  async function requestCheckout(payload) {
    const response = await fetch("/api/stripe-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Checkout konnte nicht gestartet werden.");
    if (data.checkout_url) window.location.href = data.checkout_url;
  }

  function setupFaqCards(root) {
    root.querySelectorAll(".faq-card").forEach((card) => {
      const button = card.querySelector(".faq-button");
      const toggle = card.querySelector(".faq-toggle");
      if (!button) return;
      button.addEventListener("click", () => {
        const isOpen = card.classList.contains("open");
        root.querySelectorAll(".faq-card").forEach((entry) => {
          entry.classList.remove("open");
          const entryButton = entry.querySelector(".faq-button");
          const entryToggle = entry.querySelector(".faq-toggle");
          if (entryButton) entryButton.setAttribute("aria-expanded", "false");
          if (entryToggle) entryToggle.textContent = "+";
        });
        if (!isOpen) {
          card.classList.add("open");
          button.setAttribute("aria-expanded", "true");
          if (toggle) toggle.textContent = "-";
        }
      });
    });
  }

  function setupTooltips(root) {
    root.querySelectorAll(".tooltip-wrap").forEach((wrap) => {
      const button = wrap.querySelector(".tooltip-btn");
      if (!button) return;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const nextState = !wrap.classList.contains("open");
        root.querySelectorAll(".tooltip-wrap").forEach((entry) => entry.classList.remove("open"));
        if (nextState) wrap.classList.add("open");
      });
    });
    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) {
        root.querySelectorAll(".tooltip-wrap").forEach((entry) => entry.classList.remove("open"));
      }
    });
  }

  function setRangeProgress(input) {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || 0);
    const progress = ((value - min) / (max - min)) * 100;
    input.style.setProperty("--slider-progress", progress + "%");
  }

  let confettiBurstId = 0;

  function launchConfetti(options) {
    const settings = {
      particleCount: options?.particleCount || 24,
      spread: options?.spread || 220,
      originX: options?.originX ?? 0.5,
      originY: options?.originY ?? 0.3
    };
    const container = document.createElement("div");
    const burstId = ++confettiBurstId;
    container.className = "confetti-layer";
    container.dataset.burstId = String(burstId);
    document.body.appendChild(container);

    for (let index = 0; index < settings.particleCount; index += 1) {
      const particle = document.createElement("span");
      const angle = (-settings.spread / 2) + (settings.spread / Math.max(settings.particleCount - 1, 1)) * index;
      const distance = 120 + Math.random() * 180;
      const driftX = Math.cos((angle * Math.PI) / 180) * distance;
      const driftY = Math.sin((angle * Math.PI) / 180) * distance * -1;
      const hue = [ORANGE, "#ffd166", "#10b981", "#50b4ff", "#f97316"][index % 5];
      particle.className = "confetti-piece";
      particle.style.left = `${settings.originX * 100}%`;
      particle.style.top = `${settings.originY * 100}%`;
      particle.style.setProperty("--confetti-x", `${driftX}px`);
      particle.style.setProperty("--confetti-y", `${driftY}px`);
      particle.style.setProperty("--confetti-rotate", `${180 + Math.random() * 360}deg`);
      particle.style.setProperty("--confetti-color", hue);
      particle.style.width = `${6 + Math.random() * 6}px`;
      particle.style.height = `${8 + Math.random() * 10}px`;
      particle.style.animationDelay = `${Math.random() * 120}ms`;
      container.appendChild(particle);
    }

    window.setTimeout(() => {
      if (container.parentNode && container.dataset.burstId === String(burstId)) {
        container.remove();
      }
    }, 1700);
  }

  function renderPricingPage() {
    const root = document.getElementById("pricing-root");
    if (!root) return;

    root.innerHTML = `
      <div class="pricing-page">
        <section class="section pricing-hero">
          <div class="pricing-badge">Scalynx für Agenturen</div>
          <h1 class="pricing-title">Alle Features. Immer. <span class="accent">Mehr Kunden = günstiger.</span></h1>
          <p class="pricing-lead">Gib einfach die Anzahl deiner Kunden ein. Je mehr Kunden ihr betreut, desto niedriger wird euer Preis pro Kunde.</p>
          <div class="live-badge"><span class="live-dot"></span><span>16 Agenturen nutzen scalynx gerade aktiv</span></div>
          <div class="pricing-grid">
            <article class="trial-card">
              <div class="trial-pill">Kostenlos starten</div>
              <h2 class="trial-title">14 Tage kostenlos testen</h2>
              <p class="trial-subline">Alle Features. Maximal 1 Kunde. Kein Risiko. Kein Setup-Aufwand.</p>
              <p class="micro-copy">Mehr als 20 Agenturen vertrauen auf scalynx für Reporting, Insights, Aufgaben und Content-Produktion.</p>
              <div class="trial-actions">
                <button class="pricing-btn" data-action="trial">14 Tage kostenlos testen</button>
                <a class="pricing-btn secondary" href="/roi-rechner.html">Wie viel sparst du? ROI-Rechner</a>
              </div>
            </article>
            <div>
              <div class="toggle-row">
                <div class="billing-toggle">
                  <button class="billing-btn active" data-billing="month">Monatlich</button>
                  <button class="billing-btn" data-billing="year">Jährlich <span class="billing-discount">-20%</span></button>
                </div>
              </div>
              <p class="subtle-text" style="text-align:center; margin-bottom: 1.1rem;">Dein Plan ergibt sich automatisch aus der Kundenzahl.</p>
              <div class="tier-grid" data-tier-grid></div>
            </div>
          </div>
        </section>

        <section class="section">
          <article class="panel config-card">
            <h2 class="pricing-card-title">Wie viele Kunden habt ihr aktuell?</h2>
            <p class="pricing-subline">Plan und Preis werden automatisch auf Basis eurer Kundenzahl berechnet.</p>

            <div class="slider-block">
              <div class="slider-header">
                <label for="customer-count">Anzahl Kunden</label>
                <div><span class="slider-value" data-customer-count>3</span><span class="subtle-text"> Kunden</span></div>
              </div>
              <input id="customer-count" class="range-input" type="range" min="1" max="40" value="3">
              <div class="scale-row"><span>1</span><span>5</span><span>20</span><span>40+</span></div>
            </div>

            <div class="flash-box" data-plan-flash></div>

            <div class="active-plan">
              <span data-plan-name>Starter</span>
              <span class="subtle-text" data-plan-range>bis zu 5 Kunden</span>
              <span style="margin-left:auto;">Aktiv</span>
            </div>

            <div class="price-breakdown">
              <div class="price-breakdown-body">
                <div class="breakdown-line"><span>Grundgebühr Plattform</span><strong data-base-fee>EUR 49,00</strong></div>
                <div class="breakdown-line"><span data-customer-label>3 Kunden x EUR 149,00</span><strong data-customer-total>EUR 447,00</strong></div>
                <div class="breakdown-line" data-year-savings-line hidden><span>20% Jahresrabatt</span><strong data-year-savings>EUR 0</strong></div>
              </div>
              <div class="breakdown-total"><span>Gesamt pro Monat</span><div><strong data-month-total>EUR 496,00</strong><div class="pricing-note" data-year-total-note></div></div></div>
            </div>

            <div class="annual-savings" data-annual-savings hidden></div>
            <div class="price-error" data-price-error></div>

            <div class="cta-row" style="margin-top: 1.2rem;">
              <button class="pricing-btn" data-action="checkout">Jetzt starten</button>
              <a class="pricing-btn secondary" href="/demo-anfragen.html">Fragen vorab klären</a>
            </div>

            <div class="security-row" style="margin-top: 1rem;">
              <span class="tooltip-chip">SSL verschlüsselt</span>
              <span class="tooltip-chip">DSGVO-konform</span>
              <span class="tooltip-chip">Jederzeit kündbar</span>
            </div>
          </article>
        </section>

        <section class="section">
          <div class="testimonial-grid">
            ${testimonials.map((entry) => `
              <article class="testimonial-card">
                <div class="testimonial-stars">★★★★★</div>
                <p class="testimonial-copy">„${entry.quote}“</p>
                <div class="testimonial-author">
                  <div class="testimonial-name">${entry.name}</div>
                  <div class="subtle-text">${entry.role}</div>
                </div>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="section">
          <div class="faq-grid">
            ${faqs.map((entry) => `
              <article class="faq-card">
                <button class="faq-button" aria-expanded="false">
                  <span class="faq-question">${entry.question}</span>
                  <span class="faq-toggle">+</span>
                </button>
                <div class="faq-answer">${entry.answer}</div>
              </article>
            `).join("")}
          </div>
        </section>

        <div class="sticky-mobile-cta sticky-pricing-cta" data-sticky-pricing>
          <div class="copy">
            <div class="subtle-text" data-sticky-plan>14 Tage kostenlos</div>
            <div class="price" data-sticky-total>Kostenlos testen</div>
          </div>
          <button class="pricing-btn" data-action="sticky-cta">Kostenlos testen</button>
        </div>
      </div>
    `;

    const elements = {
      tierGrid: root.querySelector("[data-tier-grid]"),
      customerCount: root.querySelector("[data-customer-count]"),
      range: root.querySelector("#customer-count"),
      planFlash: root.querySelector("[data-plan-flash]"),
      planName: root.querySelector("[data-plan-name]"),
      planRange: root.querySelector("[data-plan-range]"),
      baseFee: root.querySelector("[data-base-fee]"),
      customerLabel: root.querySelector("[data-customer-label]"),
      customerTotal: root.querySelector("[data-customer-total]"),
      yearSavingsLine: root.querySelector("[data-year-savings-line]"),
      yearSavings: root.querySelector("[data-year-savings]"),
      monthTotal: root.querySelector("[data-month-total]"),
      yearTotalNote: root.querySelector("[data-year-total-note]"),
      annualSavings: root.querySelector("[data-annual-savings]"),
      stickyWrap: root.querySelector("[data-sticky-pricing]"),
      stickyPlan: root.querySelector("[data-sticky-plan]"),
      stickyTotal: root.querySelector("[data-sticky-total]"),
      error: root.querySelector("[data-price-error]"),
      billingButtons: Array.from(root.querySelectorAll("[data-billing]")),
      trialButtons: Array.from(root.querySelectorAll('[data-action="trial"]')),
      checkoutButtons: Array.from(root.querySelectorAll('[data-action="checkout"]')),
      stickyButton: root.querySelector('[data-action="sticky-cta"]')
    };

    let billingCycle = "month";
    let customerCount = 3;
    let previousPlan = getPlanForCount(customerCount);
    let flashResetTimer = null;
    let hasAdjustedSlider = false;

    function updateStickyCta(plan, total) {
      if (!elements.stickyButton) return;
      if (!hasAdjustedSlider) {
        elements.stickyPlan.textContent = "14 Tage kostenlos";
        elements.stickyTotal.textContent = "Kostenlos testen";
        elements.stickyButton.textContent = "Kostenlos testen";
        elements.stickyButton.dataset.mode = "trial";
        return;
      }
      elements.stickyPlan.textContent = `${plan.name}-Plan`;
      elements.stickyTotal.textContent = `EUR ${formatCurrency(total, 2)}`;
      elements.stickyButton.textContent = "Jetzt starten";
      elements.stickyButton.dataset.mode = "plan";
    }

    function syncStickyWithFooter() {
      if (!elements.stickyWrap) return;
      const footer = document.querySelector(".footer");
      if (!footer || !("IntersectionObserver" in window)) return;
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        elements.stickyWrap.classList.toggle("is-hidden", Boolean(entry?.isIntersecting));
      }, { threshold: 0.02 });
      observer.observe(footer);
    }

    function renderTiers(activePlan) {
      elements.tierGrid.innerHTML = TIERS.map((tier) => {
        const yearlyPrice = tier.pricePerCustomer * 0.8;
        const displayPrice = billingCycle === "year" ? yearlyPrice : tier.pricePerCustomer;
        const isActive = tier.id === activePlan.id;
        return `
          <article class="tier-card ${isActive ? "active" : ""}">
            <div class="tier-name">${tier.name}</div>
            <div class="tier-range">${tier.range}</div>
            <div class="tier-price">EUR ${formatCurrency(displayPrice, 0)}</div>
            <div class="tier-range">pro Kunde / Monat</div>
            ${tier.note ? `<div class="pricing-note" style="margin-top:0.6rem;">${tier.note}</div>` : ""}
          </article>
        `;
      }).join("");
    }

    function updatePricing(showFlash) {
      const plan = getPlanForCount(customerCount);
      const multiplier = billingCycle === "year" ? 0.8 : 1;
      const baseFee = 49 * multiplier;
      const perCustomer = plan.pricePerCustomer * multiplier;
      const total = baseFee + perCustomer * customerCount;
      const yearlySavings = billingCycle === "year" ? (49 + plan.pricePerCustomer * customerCount) * 12 * 0.2 : 0;

      elements.customerCount.textContent = String(customerCount);
      elements.planName.textContent = plan.name + "-Plan";
      elements.planRange.textContent = plan.max ? `bis zu ${plan.max} Kunden` : "unbegrenzte Kunden";
      elements.baseFee.textContent = `EUR ${formatCurrency(baseFee, 2)}`;
      elements.customerLabel.textContent = `${customerCount} Kunden x EUR ${formatCurrency(perCustomer, 2)}`;
      elements.customerTotal.textContent = `EUR ${formatCurrency(perCustomer * customerCount, 2)}`;
      elements.monthTotal.textContent = `EUR ${formatCurrency(total, 2)}`;
      elements.yearTotalNote.textContent = billingCycle === "year" ? `= EUR ${formatCurrency(total * 12, 2)} jährlich` : "";
      elements.yearSavings.textContent = `- EUR ${formatCurrency(yearlySavings, 0)}`;
      elements.yearSavingsLine.hidden = billingCycle !== "year";
      elements.annualSavings.hidden = billingCycle !== "year";
      elements.annualSavings.textContent = `Du sparst EUR ${formatCurrency(yearlySavings, 0)} im Jahr gegenüber monatlicher Zahlung.`;
      updateStickyCta(plan, total);

      elements.billingButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.billing === billingCycle);
      });
      renderTiers(plan);

      if (showFlash && previousPlan.id !== plan.id && plan.pricePerCustomer < previousPlan.pricePerCustomer) {
        const saved = (previousPlan.pricePerCustomer - plan.pricePerCustomer) * customerCount;
        if (flashResetTimer) {
          window.clearTimeout(flashResetTimer);
        }
        elements.planFlash.className = "flash-box";
        elements.planFlash.textContent = "";
        void elements.planFlash.offsetWidth;
        elements.planFlash.className = "flash-box visible";
        elements.planFlash.innerHTML = `<strong>Plan-Upgrade!</strong><span>Du sparst jetzt EUR ${formatCurrency(saved, 0)} pro Monat.</span>`;
        launchConfetti({ particleCount: 26, spread: 200, originX: 0.5, originY: 0.36 });
        flashResetTimer = window.setTimeout(() => {
          elements.planFlash.className = "flash-box";
          elements.planFlash.textContent = "";
          flashResetTimer = null;
        }, 3200);
      }
      previousPlan = plan;
      elements.error.className = "price-error";
      elements.error.textContent = "";
      setRangeProgress(elements.range);
    }

    elements.range.addEventListener("input", () => {
      customerCount = Number(elements.range.value);
      hasAdjustedSlider = true;
      updatePricing(true);
    });

    elements.billingButtons.forEach((button) => {
      button.addEventListener("click", () => {
        billingCycle = button.dataset.billing;
        updatePricing(false);
      });
    });

    elements.trialButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        button.disabled = true;
        button.textContent = "Wird verarbeitet...";
        try {
          await requestCheckout({ planId: "trial" });
        } catch (error) {
          elements.error.className = "price-error visible";
          elements.error.textContent = error.message;
        } finally {
          button.disabled = false;
          button.textContent = "14 Tage kostenlos testen";
        }
      });
    });

    elements.checkoutButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const plan = getPlanForCount(customerCount);
        button.disabled = true;
        const original = button.textContent;
        button.textContent = "Wird verarbeitet...";
        try {
          await requestCheckout({
            planId: plan.id,
            numberOfCustomers: customerCount,
            billingCycle
          });
        } catch (error) {
          elements.error.className = "price-error visible";
          elements.error.textContent = error.message;
        } finally {
          button.disabled = false;
          button.textContent = original;
        }
      });
    });

    if (elements.stickyButton) {
      elements.stickyButton.addEventListener("click", async () => {
        if (elements.stickyButton.dataset.mode === "trial") {
          elements.stickyButton.disabled = true;
          const original = elements.stickyButton.textContent;
          elements.stickyButton.textContent = "Wird verarbeitet...";
          try {
            await requestCheckout({ planId: "trial" });
          } catch (error) {
            elements.error.className = "price-error visible";
            elements.error.textContent = error.message;
          } finally {
            elements.stickyButton.disabled = false;
            elements.stickyButton.textContent = original;
          }
          return;
        }

        const plan = getPlanForCount(customerCount);
        elements.stickyButton.disabled = true;
        const original = elements.stickyButton.textContent;
        elements.stickyButton.textContent = "Wird verarbeitet...";
        try {
          await requestCheckout({
            planId: plan.id,
            numberOfCustomers: customerCount,
            billingCycle
          });
        } catch (error) {
          elements.error.className = "price-error visible";
          elements.error.textContent = error.message;
        } finally {
          elements.stickyButton.disabled = false;
          elements.stickyButton.textContent = original;
        }
      });
    }

    setupFaqCards(root);
    updatePricing(false);
    syncStickyWithFooter();
  }

  function renderRoiPage() {
    const root = document.getElementById("roi-root");
    if (!root) return;

    root.innerHTML = `
      <div class="pricing-page roi-page">
        <section class="roi-stage" data-roi-step="1">
          <div class="roi-step-head">
            <div>
              <div class="roi-step-badge">ROI-Rechner</div>
              <h1 class="roi-title">Wie viel sparst du <span class="accent">mit scalynx?</span></h1>
              <p class="roi-lead">Antworte auf drei einfache Fragen und sieh sofort dein monatliches und jährliches Sparpotenzial.</p>
            </div>
          </div>
          <article class="panel roi-input-card">
            <div class="slider-block">
              <div class="slider-header">
                <label for="roi-employees">Wie viele Mitarbeiter?</label>
                <div class="slider-value" data-roi-employees-value>5</div>
              </div>
              <div class="help-line">
                <span>Alle Personen im Team, die aktiv Kunden betreuen.</span>
              </div>
              <input id="roi-employees" class="range-input" type="range" min="1" max="50" value="5">
            </div>

            <div class="slider-block">
              <div class="slider-header">
                <div>
                  <label for="roi-costs">Gesamte monatliche Kosten deiner Agentur</label>
                  <div class="help-line">Summe aller operativen Kosten für die Betreuung aller Kunden.</div>
                </div>
                <div class="slider-value" data-roi-costs-value>450</div>
              </div>
              <input id="roi-costs" class="range-input" type="range" min="100" max="2000" value="450">
            </div>

            <div class="slider-block">
              <div class="slider-header">
                <label for="roi-clients">Aktuelle Kunden</label>
                <div class="slider-value" data-roi-clients-value>15</div>
              </div>
              <input id="roi-clients" class="range-input" type="range" min="1" max="100" value="15">
            </div>

            <div class="cta-row" style="margin-top: 1.75rem;">
              <button class="roi-btn" data-roi-action="calculate">Ergebnis sehen</button>
              <a class="roi-btn secondary" href="/preise.html">Zu den Preisen</a>
            </div>
          </article>
        </section>

        <section class="roi-stage" data-roi-step="2" hidden>
          <div class="roi-step-head">
            <div class="roi-kicker">ROI-Ergebnis</div>
            <button class="roi-btn secondary" data-roi-action="back">Eingaben ändern</button>
          </div>

          <article class="roi-result-card">
            <div class="chart-label">Jährliches Sparpotenzial</div>
            <h2 class="roi-result-title">So viel Potenzial steckt in eurem Workflow</h2>
            <div class="roi-value" data-roi-annual>EUR 0</div>
            <div class="roi-subvalue">mit <span data-roi-employees-summary>5</span> Mitarbeitern und <span data-roi-clients-summary>15</span> Kunden</div>
            <div class="roi-success-box" style="margin-top: 1rem;">
              <span data-roi-percent>0%</span> ROI auf Basis eurer aktuellen Agenturkosten
            </div>
          </article>

          <div class="roi-grid">
            <article class="roi-card">
              <div class="chart-card-title">Monatliche Einsparungen</div>
              <div class="bar-chart" data-roi-bar-chart></div>
            </article>
            <article class="roi-card">
              <div class="chart-card-title">Gesamte Einsparungen über 12 Monate</div>
              <div class="line-chart" data-roi-line-chart></div>
            </article>
          </div>

          <div class="roi-metrics">
            <article class="roi-metric-card">
              <div class="metric-name">Aktuelle monatliche Kosten</div>
              <div class="metric-value" data-roi-current-costs>EUR 0</div>
            </article>
            <article class="roi-metric-card">
              <div class="metric-name">Einsparungen pro Monat (35%)</div>
              <div class="metric-value positive" data-roi-monthly-savings>EUR 0</div>
            </article>
            <article class="roi-metric-card">
              <div class="metric-name">Netto Gewinn monatlich</div>
              <div class="metric-value orange" data-roi-net-savings>EUR 0</div>
            </article>
          </div>

          <article class="roi-result-card result-summary">
            <div class="result-summary-title" data-roi-summary-title>Lohnt sich für dich</div>
            <p class="result-summary-copy" data-roi-summary-copy></p>
            <div class="cta-row" style="justify-content:center;">
              <button class="roi-btn" data-roi-action="trial">14 Tage kostenlos starten</button>
              <a class="roi-btn secondary" href="/preise.html">Preisstaffel ansehen</a>
            </div>
            <div class="price-error" data-roi-error></div>
          </article>

          <div class="sticky-mobile-cta">
            <div class="copy">
              <div class="subtle-text">Jährliche Ersparnis</div>
              <div class="price" data-roi-sticky>EUR 0</div>
            </div>
            <button class="roi-btn" data-roi-action="trial-mobile">Kostenlos testen</button>
          </div>
        </section>
      </div>
    `;

    const state = {
      employees: 5,
      totalCosts: 450,
      clients: 15
    };

    const els = {
      step1: root.querySelector('[data-roi-step="1"]'),
      step2: root.querySelector('[data-roi-step="2"]'),
      employeesInput: root.querySelector("#roi-employees"),
      employeesValue: root.querySelector("[data-roi-employees-value]"),
      costsInput: root.querySelector("#roi-costs"),
      costsValue: root.querySelector("[data-roi-costs-value]"),
      clientsInput: root.querySelector("#roi-clients"),
      clientsValue: root.querySelector("[data-roi-clients-value]"),
      annual: root.querySelector("[data-roi-annual]"),
      employeesSummary: root.querySelector("[data-roi-employees-summary]"),
      clientsSummary: root.querySelector("[data-roi-clients-summary]"),
      percent: root.querySelector("[data-roi-percent]"),
      currentCosts: root.querySelector("[data-roi-current-costs]"),
      monthlySavings: root.querySelector("[data-roi-monthly-savings]"),
      netSavings: root.querySelector("[data-roi-net-savings]"),
      summaryTitle: root.querySelector("[data-roi-summary-title]"),
      summaryCopy: root.querySelector("[data-roi-summary-copy]"),
      barChart: root.querySelector("[data-roi-bar-chart]"),
      lineChart: root.querySelector("[data-roi-line-chart]"),
      sticky: root.querySelector("[data-roi-sticky]"),
      error: root.querySelector("[data-roi-error]")
    };

    function updateInputs() {
      els.employeesValue.textContent = state.employees;
      els.costsValue.textContent = `EUR ${formatCurrency(state.totalCosts, 0)}`;
      els.clientsValue.textContent = state.clients;
      [els.employeesInput, els.costsInput, els.clientsInput].forEach(setRangeProgress);
    }

    function computeRoi() {
      const totalMonthlyCosts = state.totalCosts * state.clients;
      const scalynxBaseFee = 49;
      const scalynxPerClient = state.clients <= 5 ? 149 : state.clients <= 20 ? 119 : 99;
      const scalynxTotalCost = scalynxBaseFee + scalynxPerClient * state.clients;
      const monthlySavings = totalMonthlyCosts * 0.35;
      const netSavings = monthlySavings - scalynxTotalCost;
      const annualSavings = netSavings * 12;
      const roiPercent = Math.round((netSavings / Math.max(scalynxTotalCost, 1)) * 100);
      return { totalMonthlyCosts, scalynxTotalCost, monthlySavings, netSavings, annualSavings, roiPercent };
    }

    function renderCharts(result) {
      const breakdown = [
        { name: "Aktuelle Kosten", value: result.totalMonthlyCosts, color: MUTED },
        { name: "Einsparungen (35%)", value: result.monthlySavings, color: GREEN },
        { name: "Scalynx Kosten", value: result.scalynxTotalCost, color: RED },
        { name: "Netto Ersparnis", value: result.netSavings, color: ORANGE }
      ];
      const maxBreakdown = Math.max(...breakdown.map((item) => Math.abs(item.value)));
      els.barChart.innerHTML = breakdown.map((item) => `
        <div class="bar-item">
          <div class="bar-name">${item.name}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.max(8, Math.abs(item.value) / maxBreakdown * 100)}%; background:${item.color};"></div></div>
          <div class="bar-value">EUR ${formatCurrency(Math.abs(item.value), 0)}</div>
        </div>
      `).join("");

      const cumulative = [1, 3, 6, 12].map((month) => ({ label: `Monat ${month}`, value: result.netSavings * month }));
      const maxLine = Math.max(...cumulative.map((item) => Math.abs(item.value)));
      els.lineChart.innerHTML = cumulative.map((item) => `
        <div class="line-point">
          <div class="line-value">EUR ${formatCurrency(Math.abs(item.value), 0)}</div>
          <div class="line-column" style="height:${Math.max(18, Math.abs(item.value) / maxLine * 180)}px;"></div>
          <div class="line-name">${item.label}</div>
        </div>
      `).join("");
    }

    function renderResult() {
      const result = computeRoi();
      els.annual.textContent = `EUR ${formatCurrency(result.annualSavings, 0)}`;
      els.employeesSummary.textContent = state.employees;
      els.clientsSummary.textContent = state.clients;
      els.percent.textContent = `${result.roiPercent}%`;
      els.currentCosts.textContent = `EUR ${formatCurrency(result.totalMonthlyCosts, 0)}`;
      els.monthlySavings.textContent = `EUR ${formatCurrency(result.monthlySavings, 0)}`;
      els.netSavings.textContent = `EUR ${formatCurrency(result.netSavings, 0)}`;
      els.sticky.textContent = `EUR ${formatCurrency(result.annualSavings, 0)}`;

      if (result.netSavings > 200) {
        els.summaryTitle.textContent = "Absoluter No-Brainer";
      } else {
        els.summaryTitle.textContent = "Lohnt sich für dich";
      }
      const monthsToPayback = Math.ceil(result.scalynxTotalCost / Math.max(result.netSavings, 1));
      els.summaryCopy.textContent = `Mit EUR ${formatCurrency(result.netSavings, 0)} Netto-Ersparnis pro Monat zahlt sich scalynx in weniger als ${monthsToPayback} Monaten selbst. Danach arbeitet jede weitere Optimierung direkt für eure Marge.`;
      renderCharts(result);
    }

    [els.employeesInput, els.costsInput, els.clientsInput].forEach((input) => {
      input.addEventListener("input", () => {
        state.employees = Number(els.employeesInput.value);
        state.totalCosts = Number(els.costsInput.value);
        state.clients = Number(els.clientsInput.value);
        updateInputs();
      });
    });

    root.querySelector('[data-roi-action="calculate"]').addEventListener("click", () => {
      renderResult();
      els.step1.hidden = true;
      els.step2.hidden = false;
      launchConfetti({ particleCount: 30, spread: 230, originX: 0.5, originY: 0.22 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    root.querySelector('[data-roi-action="back"]').addEventListener("click", () => {
      els.step1.hidden = false;
      els.step2.hidden = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    async function handleTrial(button) {
      button.disabled = true;
      const original = button.textContent;
      button.textContent = "Wird verarbeitet...";
      try {
        await requestCheckout({ planId: "trial" });
      } catch (error) {
        els.error.className = "price-error visible";
        els.error.textContent = error.message;
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    }

    root.querySelectorAll('[data-roi-action="trial"], [data-roi-action="trial-mobile"]').forEach((button) => {
      button.addEventListener("click", () => handleTrial(button));
    });

    updateInputs();
    setupTooltips(root);
  }

  if (page === "preise") renderPricingPage();
  if (page === "roi") renderRoiPage();
})();
