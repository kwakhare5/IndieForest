"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "./SectionHeader";

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
      "Paste your unique webhook URL into Stripe, Lemon Squeezy, or Polar. When someone buys a subscription, a golden cash pine sprouts automatically on your island.",
  },
  {
    question: "What happens if I take a weekend or rest day off?",
    answer:
      "You earn Rest Shields every 7 days of shipping (up to 2 banked). When you take a rest day, a shield is used automatically to keep your streak intact.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 bg-[#e6e1d7] border-t border-stone-300/80 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about automated island tracking, privacy, and rest shields."
          className="mb-12"
        />

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <Card
              key={idx}
              doubleBezel
              rounded="2xl"
              innerClassName="p-5 sm:p-6 space-y-2"
            >
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-md bg-stone-100/90 text-stone-600 border border-stone-200/90 text-[10px] font-mono font-medium flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  0{idx + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-medium text-stone-950 text-sm font-sans">
                    {item.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    {item.answer}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

