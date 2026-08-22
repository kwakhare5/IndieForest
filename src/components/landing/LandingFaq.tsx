"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { LandingSectionHeader } from "./LandingSectionHeader";

const FAQ_ITEMS = [
  {
    question: "Do you read or store my private code?",
    answer:
      "Never. IndieForest only checks public commit timestamps and authors to verify that you shipped code today. We never request private repo write permissions or read your source code.",
  },
  {
    question: "Can I use IndieForest if I have $0 MRR?",
    answer:
      "Yes, absolutely. The code grove (West side) grows purely through git commits. You don't need paying customers or revenue to build a living island.",
  },
  {
    question: "How does Stripe or Lemon Squeezy integration work?",
    answer:
      "Paste your unique webhook URL into Stripe, Lemon Squeezy, or Polar. When someone buys a subscription, a golden revenue oak sprouts automatically on your island.",
  },
  {
    question: "What happens if I take a weekend or rest day off?",
    answer:
      "You earn Rest Shields every 7 days of shipping (up to 2 banked). When you take a rest day, a shield is used automatically to keep your streak intact.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="py-20 bg-[#e6e1d7] border-t border-stone-300/80 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <LandingSectionHeader
          badge="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about automated diorama tracking, privacy, and rest shields."
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
