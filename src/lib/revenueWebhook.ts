import { GrowthTier } from "@/types/game";

export interface NormalizedCustomerTree {
  customerName: string;
  mrr: number;
  tier: GrowthTier;
  source: "stripe" | "lemonsqueezy" | "polar" | "custom";
  isValid: boolean;
  isChurn?: boolean;
}

const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"
]);

/**
 * Maps MRR numerical value to 3D Pine Tree Growth Tier
 */
export function calculateTreeTierFromMrr(mrr: number): GrowthTier {
  if (mrr >= 100) return "majestic";
  if (mrr >= 50) return "mature";
  if (mrr >= 20) return "young";
  if (mrr > 0) return "sapling";
  return "stump";
}

/**
 * Universal Revenue Webhook Parser
 * Parses and normalizes incoming payment/subscription events across Stripe, Lemon Squeezy, and Polar.
 */
export function parseUniversalRevenueEvent(payload: any): NormalizedCustomerTree {
  if (!payload || typeof payload !== "object") {
    return {
      customerName: "Anonymous Customer",
      mrr: 0,
      tier: "stump",
      source: "custom",
      isValid: false,
    };
  }

  // 1. Stripe Event Parser
  if (payload.object === "event" || payload.type?.startsWith("invoice.") || payload.type?.startsWith("checkout.") || payload.type?.startsWith("customer.subscription.")) {
    const eventType = payload.type || "";
    const obj = payload.data?.object || {};
    const name = obj.customer_name || obj.customer_email || obj.customer_details?.name || "Stripe Customer";
    const currency = (obj.currency || "usd").toLowerCase();
    const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);

    // Churn / Cancellation event
    if (eventType === "customer.subscription.deleted" || eventType === "customer.subscription.paused" || eventType === "invoice.payment_failed") {
      return {
        customerName: name,
        mrr: 0,
        tier: "stump",
        source: "stripe",
        isValid: true,
        isChurn: true,
      };
    }

    const rawAmount = obj.amount_paid ?? obj.amount_total ?? obj.total ?? 0;
    const isAnnual = obj.lines?.data?.[0]?.plan?.interval === "year";

    let mrr = isZeroDecimal ? rawAmount : Math.round(rawAmount / 100);
    if (isAnnual && mrr > 0) {
      mrr = Math.round(mrr / 12);
    }

    const isValid = mrr > 0;
    return {
      customerName: name,
      mrr,
      tier: calculateTreeTierFromMrr(mrr),
      source: "stripe",
      isValid,
    };
  }

  // 2. Lemon Squeezy Event Parser
  if (payload.meta?.event_name) {
    const eventName = payload.meta.event_name;
    const data = payload.data?.attributes || {};
    const name = data.user_name || data.user_email || data.customer_name || "Lemon Squeezy Customer";

    // Churn / Cancellation event
    if (eventName === "subscription_cancelled" || eventName === "subscription_expired" || eventName === "subscription_paused") {
      return {
        customerName: name,
        mrr: 0,
        tier: "stump",
        source: "lemonsqueezy",
        isValid: true,
        isChurn: true,
      };
    }

    const rawAmount = data.subtotal_usd ?? data.total ?? data.subtotal ?? 0;
    const isAnnual = data.interval === "year" || data.interval === "annually";

    let mrr = Math.round(rawAmount / 100);
    if (isAnnual && mrr > 0) {
      mrr = Math.round(mrr / 12);
    }

    const isValid = mrr > 0;
    return {
      customerName: name,
      mrr,
      tier: calculateTreeTierFromMrr(mrr),
      source: "lemonsqueezy",
      isValid,
    };
  }

  // 3. Polar Event Parser
  if (payload.event?.startsWith("order.") || payload.event?.startsWith("subscription.")) {
    const eventName = payload.event;
    const order = payload.data || {};
    const name = order.customer?.name || order.customer?.email || "Polar Backer";

    // Churn / Cancellation event
    if (eventName === "subscription.canceled" || eventName === "subscription.revoked") {
      return {
        customerName: name,
        mrr: 0,
        tier: "stump",
        source: "polar",
        isValid: true,
        isChurn: true,
      };
    }

    const rawAmount = order.amount ?? 0;
    const isAnnual = order.recurring_interval === "year";

    let mrr = Math.round(rawAmount / 100);
    if (isAnnual && mrr > 0) {
      mrr = Math.round(mrr / 12);
    }

    const isValid = mrr > 0;
    return {
      customerName: name,
      mrr,
      tier: calculateTreeTierFromMrr(mrr),
      source: "polar",
      isValid,
    };
  }

  return {
    customerName: "Anonymous Customer",
    mrr: 0,
    tier: "stump",
    source: "custom",
    isValid: false,
  };
}
