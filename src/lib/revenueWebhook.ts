import type { NormalizedCustomerTree } from "@/types/game";
import { calculateTreeTier } from "./gamification";

export type { NormalizedCustomerTree };

const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

interface StripeEventObject {
  customer_name?: string;
  customer_email?: string;
  customer_details?: { name?: string; email?: string };
  currency?: string;
  amount_paid?: number;
  amount_total?: number;
  total?: number;
  lines?: {
    data?: Array<{
      plan?: {
        interval?: string;
      };
    }>;
  };
}

interface StripeWebhookPayload {
  object?: string;
  type?: string;
  data?: {
    object?: StripeEventObject;
  };
}

interface LemonSqueezyWebhookPayload {
  meta?: {
    event_name?: string;
  };
  data?: {
    attributes?: {
      user_name?: string;
      user_email?: string;
      customer_name?: string;
      subtotal_usd?: number;
      total?: number;
      subtotal?: number;
      interval?: string;
    };
  };
}

interface PolarWebhookPayload {
  event?: string;
  data?: {
    customer?: {
      name?: string;
      email?: string;
    };
    amount?: number;
    recurring_interval?: string;
  };
}

export function parseUniversalRevenueEvent(payload: unknown): NormalizedCustomerTree {
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
  const stripePayload = payload as StripeWebhookPayload;
  if (
    stripePayload.object === "event" ||
    stripePayload.type?.startsWith("invoice.") ||
    stripePayload.type?.startsWith("checkout.") ||
    stripePayload.type?.startsWith("customer.subscription.")
  ) {
    const eventType = stripePayload.type || "";
    const obj = stripePayload.data?.object || {};
    const name =
      obj.customer_name ||
      obj.customer_email ||
      obj.customer_details?.name ||
      "Stripe Pro User";
    const currency = (obj.currency || "usd").toLowerCase();
    const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);

    if (
      eventType === "customer.subscription.deleted" ||
      eventType === "customer.subscription.paused" ||
      eventType === "invoice.payment_failed"
    ) {
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
      tier: calculateTreeTier("revenue", mrr),
      source: "stripe",
      isValid,
    };
  }

  // 2. Lemon Squeezy Event Parser
  const lsPayload = payload as LemonSqueezyWebhookPayload;
  if (lsPayload.meta?.event_name) {
    const eventName = lsPayload.meta.event_name;
    const data = lsPayload.data?.attributes || {};
    const name =
      data.user_name ||
      data.user_email ||
      data.customer_name ||
      "Lemon Squeezy Customer";

    if (
      eventName === "subscription_cancelled" ||
      eventName === "subscription_expired" ||
      eventName === "subscription_paused"
    ) {
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
      tier: calculateTreeTier("revenue", mrr),
      source: "lemonsqueezy",
      isValid,
    };
  }

  // 3. Polar Event Parser
  const polarPayload = payload as PolarWebhookPayload;
  if (polarPayload.event?.startsWith("order.") || polarPayload.event?.startsWith("subscription.")) {
    const eventName = polarPayload.event;
    const order = polarPayload.data || {};
    const name = order.customer?.name || order.customer?.email || "Polar Backer";

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
      tier: calculateTreeTier("revenue", mrr),
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
