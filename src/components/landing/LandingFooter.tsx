"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Trees } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { sound } from "@/lib/sound";

export function LandingFooter() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 font-sans">
      <Card variant="elevated" className="p-8 sm:p-12 rounded-[3rem] text-center space-y-6 relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
          <Trees className="w-6 h-6 stroke-[1.75]" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight font-editorial">
            Start growing your island today.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-sans">
            Join indie builders turning daily commits and revenue momentum into a living 3D world.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          {isLoaded && isSignedIn ? (
            <Link href="/dashboard">
              <Button variant="emerald" size="lg" showArrow arrowType="right">
                Open Dashboard
              </Button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <Button
                variant="emerald"
                size="lg"
                showArrow
                arrowType="right"
                onClick={() => sound.playClick()}
              >
                Start Free with GitHub
              </Button>
            </SignInButton>
          )}
        </div>

        <p className="text-xs font-sans text-stone-500 pt-2">
          Free forever • 100% automated • Instant 3D diorama
        </p>
      </Card>

      <footer className="mt-16 pt-8 border-t border-stone-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-stone-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-800 font-sans">IndieForest</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6 font-sans">
          <a
            href="https://github.com/kwakhare5/IndieForest"
            target="_blank"
            rel="noreferrer"
            className="hover:text-stone-900 transition"
          >
            GitHub Repository
          </a>
          <Link href="/dashboard" className="hover:text-stone-900 transition">
            Open Dashboard
          </Link>
          <Link href="/dashboard" className="hover:text-stone-900 transition">
            Live Showcase
          </Link>
        </div>
      </footer>
    </section>
  );
}
