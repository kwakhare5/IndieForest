"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { LandingSectionHeader } from "./LandingSectionHeader";

const FAQ_ITEMS = [
  {
    question: "Do you read or store my private GitHub source code?",
    answer:
      "Never. IndieForest only fetches public repository commit timestamps and author names to verify that you shipped code today. We never request private repo write permissions or read code contents.",
  },
  {
    question: "Can I use IndieForest if I am pre-revenue ($0 MRR)?",
    answer:
      "Yes, absolutely! The Emerald Shipping Grove (West pasture) levels up purely through code commits and consistency. Pre-revenue builders get full visual progression without needing revenue.",
  },
  {
    question: "How does Stripe or Lemon Squeezy integration work?",
    answer:
      "You simply paste your unique IndieForest Webhook URL into your Stripe, Lemon Squeezy, or Polar webhook settings. When a customer purchases a subscription, our webhook normalizer automatically sprouts a Golden Pine tree in your revenue grove.",
  },
  {
    question: "What happens if I take a weekend or vacation off?",
    answer:
      "We believe in sustainable coding, not burnout. For every 7 days of consecutive shipping, you earn 1 Streak Shield (up to 2 maximum). When you take a rest day, a shield is automatically consumed to protect your streak from resetting.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="py-20 bg-[#e6e1d7] border-t border-stone-300/80 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <LandingSectionHeader
          badge="Transparent & Zero-Slop"
          title="Frequently Asked Questions"
          description="Everything you need to know about zero-touch diorama tracking, privacy, and streak safety."
          className="mb-12"
        />

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <Card key={idx} variant="porcelain" className="p-6 rounded-2xl space-y-1.5">
              <h3 className="font-bold text-stone-950 text-sm font-sans">
                {item.question}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {item.answer}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
