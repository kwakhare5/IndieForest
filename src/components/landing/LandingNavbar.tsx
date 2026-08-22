"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { sound } from "@/lib/sound";

export function LandingNavbar() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-3 pointer-events-none font-satoshi">
      <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg transition-all duration-200">
        <div className="px-4 py-1.5 rounded-full porcelain-surface flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-lg overflow-hidden shadow-xs border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/indieforest_logo.svg"
                alt="IndieForest Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-xs sm:text-sm text-stone-950 tracking-tight font-satoshi">
              IndieForest
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-stone-600 font-satoshi">
            <a
              href="#overview"
              className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
            >
              How It Works
            </a>
            <a
              href="#showcase"
              className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
            >
              Dual Groves
            </a>
            <a
              href="#bento"
              className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
            >
              Features
            </a>
            <a
              href="#faq"
              className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
            >
              FAQ
            </a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="emerald" size="sm" showArrow arrowType="right">
                    DASHBOARD
                  </Button>
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="emerald"
                  size="sm"
                  showArrow
                  arrowType="right"
                  onClick={() => sound.playClick()}
                >
                  SIGN IN
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
