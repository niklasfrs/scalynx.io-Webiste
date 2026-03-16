export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.scalynx.io") {
      url.hostname = "scalynx.io";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/api/stripe-checkout") {
      return handleStripeCheckout(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

const PRICE_IDS = {
  basis: { month: "price_1T8O6ULyQHKwCZqqeE4mOMLU", year: "price_1T8O6ULyQHKwCZqq79jRD3KF" },
  starterPerCustomer: { month: "price_1T8O6ULyQHKwCZqqpig7FC1X", year: "price_1T8O6ULyQHKwCZqqV6RFCCYG" },
  growthPerCustomer: { month: "price_1T8O6ULyQHKwCZqqpL4L28gz", year: "price_1T8O6ULyQHKwCZqqJCnshRPs" },
  agencyPerCustomer: { month: "price_1T8O6ULyQHKwCZqq0XWeaTVX", year: "price_1T8O6ULyQHKwCZqqI20wThmP" },
  trial: { month: "price_1TBCiOLyQHKwCZqq7SLcohXs" }
};

const MAX_CLIENTS_MAP = {
  starter: "5",
  growth: "20",
  agency: "unlimited",
  trial: "1"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

async function handleStripeCheckout(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type"
      }
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Stripe secret fehlt in der Cloudflare-Konfiguration." }, 500);
  }

  try {
    const { planId, numberOfCustomers, billingCycle } = await request.json();
    const params = new URLSearchParams();
    params.set("mode", "subscription");
    params.set("success_url", "https://app.scalynx.io/CheckoutSuccess?session_id={CHECKOUT_SESSION_ID}");
    params.set("cancel_url", "https://scalynx.io/preise.html");
    params.set("metadata[base44_app_id]", "698a544d271fc7b7f075c89d");
    params.set("metadata[plan_id]", String(planId || ""));

    if (planId === "trial") {
      params.set("line_items[0][price]", PRICE_IDS.trial.month);
      params.set("line_items[0][quantity]", "1");
      params.set("subscription_data[trial_period_days]", "14");
      params.set("metadata[max_clients]", "1");
      params.set("metadata[billing_cycle]", "monthly");
    } else {
      if (!billingCycle || !["month", "year"].includes(billingCycle)) {
        return json({ error: "Ungueltiger Abrechnungszyklus." }, 400);
      }
      const quantity = Math.max(1, Number(numberOfCustomers || 1));
      const planKey = `${planId}PerCustomer`;
      const planPrice = PRICE_IDS[planKey] && PRICE_IDS[planKey][billingCycle];
      const basePrice = PRICE_IDS.basis[billingCycle];

      if (!planPrice || !basePrice) {
        return json({ error: "Ungueltiger Plan oder Preis nicht gefunden." }, 400);
      }

      params.set("line_items[0][price]", basePrice);
      params.set("line_items[0][quantity]", "1");
      params.set("line_items[1][price]", planPrice);
      params.set("line_items[1][quantity]", String(quantity));
      params.set("metadata[max_clients]", MAX_CLIENTS_MAP[planId] || String(quantity));
      params.set("metadata[billing_cycle]", billingCycle === "year" ? "yearly" : "monthly");
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const stripeData = await stripeResponse.json();
    if (!stripeResponse.ok) {
      const message = stripeData && stripeData.error && stripeData.error.message
        ? stripeData.error.message
        : "Stripe-Checkout konnte nicht erstellt werden.";
      return json({ error: message }, 500);
    }

    return json({ checkout_url: stripeData.url, sessionId: stripeData.id });
  } catch (error) {
    return json({ error: error.message || "Unbekannter Stripe-Fehler." }, 500);
  }
}
