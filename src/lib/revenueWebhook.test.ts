import { describe, it, expect } from "vitest";
import { parseUniversalRevenueEvent, NormalizedCustomerTree } from "./revenueWebhook";

describe("Revenue Webhook Domain Core (TDD Seam)", () => {
  describe("Stripe Events", () => {
    it("parses monthly Stripe invoice.payment_succeeded event", () => {
      const payload = {
        type: "invoice.payment_succeeded",
        data: {
          object: {
            customer_name: "Stripe Pro User",
            customer_email: "pro@acme.com",
            amount_paid: 4900,
            currency: "usd",
            lines: {
              data: [{ plan: { interval: "month" } }],
            },
          },
        },
      };

      const result: NormalizedCustomerTree = parseUniversalRevenueEvent(payload);

      expect(result).toEqual({
        customerName: "Stripe Pro User",
        mrr: 49,
        tier: "young",
        source: "stripe",
        isValid: true,
      });
    });

    it("parses annual Stripe invoice event and converts to monthly MRR", () => {
      const payload = {
        type: "invoice.payment_succeeded",
        data: {
          object: {
            customer_email: "annual@enterprise.com",
            amount_paid: 120000, // $1200/yr -> $100/mo
            currency: "usd",
            lines: {
              data: [{ plan: { interval: "year" } }],
            },
          },
        },
      };

      const result: NormalizedCustomerTree = parseUniversalRevenueEvent(payload);

      expect(result.mrr).toBe(100);
      expect(result.tier).toBe("majestic");
      expect(result.customerName).toBe("annual@enterprise.com");
      expect(result.isValid).toBe(true);
    });

    it("handles customer.subscription.deleted as a churn event (converts tree to stump)", () => {
      const payload = {
        type: "customer.subscription.deleted",
        data: {
          object: {
            customer_email: "churned@user.com",
          },
        },
      };

      const result = parseUniversalRevenueEvent(payload);
      expect(result.isValid).toBe(true);
      expect(result.isChurn).toBe(true);
      expect(result.tier).toBe("stump");
      expect(result.mrr).toBe(0);
    });
  });

  describe("Lemon Squeezy Events", () => {
    it("parses Lemon Squeezy subscription_created event", () => {
      const payload = {
        meta: { event_name: "subscription_created" },
        data: {
          attributes: {
            user_name: "Lemon Squeezy Builder",
            user_email: "builder@lemon.com",
            subtotal_usd: 2900,
            interval: "monthly",
          },
        },
      };

      const result: NormalizedCustomerTree = parseUniversalRevenueEvent(payload);

      expect(result).toEqual({
        customerName: "Lemon Squeezy Builder",
        mrr: 29,
        tier: "young",
        source: "lemonsqueezy",
        isValid: true,
      });
    });

    it("handles Lemon Squeezy subscription_cancelled as churn", () => {
      const payload = {
        meta: { event_name: "subscription_cancelled" },
        data: {
          attributes: {
            user_name: "Cancelling User",
          },
        },
      };

      const result = parseUniversalRevenueEvent(payload);
      expect(result.isChurn).toBe(true);
      expect(result.tier).toBe("stump");
    });
  });

  describe("Polar Events", () => {
    it("parses Polar order.created event", () => {
      const payload = {
        event: "order.created",
        data: {
          customer: { name: "Polar Backer" },
          amount: 1500,
          recurring_interval: "month",
        },
      };

      const result: NormalizedCustomerTree = parseUniversalRevenueEvent(payload);

      expect(result).toEqual({
        customerName: "Polar Backer",
        mrr: 15,
        tier: "sapling",
        source: "polar",
        isValid: true,
      });
    });

    it("handles Polar subscription.canceled as churn", () => {
      const payload = {
        event: "subscription.canceled",
        data: {
          customer: { name: "Polar Churner" },
        },
      };

      const result = parseUniversalRevenueEvent(payload);
      expect(result.isChurn).toBe(true);
      expect(result.tier).toBe("stump");
    });
  });

  describe("Edge Cases & Validation", () => {
    it("flags $0 / trial payments safely without crashing", () => {
      const payload = {
        type: "invoice.payment_succeeded",
        data: {
          object: {
            customer_name: "Free Trial Tester",
            amount_paid: 0,
          },
        },
      };

      const result = parseUniversalRevenueEvent(payload);
      expect(result.isValid).toBe(false);
      expect(result.mrr).toBe(0);
    });

    it("handles null / malformed payloads gracefully", () => {
      const result = parseUniversalRevenueEvent({});
      expect(result.isValid).toBe(false);
      expect(result.customerName).toBe("Anonymous Customer");
    });
  });
});
