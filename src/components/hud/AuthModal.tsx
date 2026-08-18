"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
import { ShieldCheck, UserPlus } from "lucide-react";
import { sound } from "@/lib/sound";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest?: () => void;
}

export function AuthModal({ isOpen, onClose, onContinueAsGuest }: AuthModalProps) {
  const { isSignedIn, user: clerkUser } = useUser();

  const handleGuest = () => {
    sound.playCoin();
    if (onContinueAsGuest) onContinueAsGuest();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter IndieForest"
      badgeText="Clerk Authentication"
      icon={ShieldCheck}
    >
      <div className="space-y-4 text-center font-satoshi">
        <p className="text-xs text-stone-600 leading-relaxed font-satoshi text-left">
          Sign in to save your 3D island, track your daily streak across devices, and unlock your public profile.
        </p>

        {isSignedIn ? (
          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 text-left">
              <UserButton />
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  {clerkUser?.fullName || clerkUser?.username || "Signed In"}
                </h4>
                <span className="text-[10px] text-stone-500 font-pixel">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
            <Badge variant="emerald" size="sm">
              Connected
            </Badge>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* 1. Clerk Instant Sign-In Button (Google + Email) */}
            <SignInButton mode="modal">
              <button
                type="button"
                onClick={() => sound.playLevelUp()}
                className="w-full p-3 rounded-2xl bg-white border border-stone-300 hover:border-stone-400 shadow-xs hover:shadow-sm flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.99] cursor-pointer group"
              >
                {/* Google G SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="font-bold text-xs text-stone-900 font-satoshi">
                  Sign In with Google / Email
                </span>
              </button>
            </SignInButton>

            {/* 2. Clerk Sign-Up Button */}
            <SignUpButton mode="modal">
              <button
                type="button"
                onClick={() => sound.playLevelUp()}
                className="w-full p-3 rounded-2xl bg-stone-900 hover:bg-stone-950 text-white shadow-xs flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.99] cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span className="font-bold text-xs text-white font-satoshi">
                  Create New Account
                </span>
              </button>
            </SignUpButton>
          </div>
        )}

        {/* 3. Privacy Guarantee */}
        <Card variant="subtle-inset" className="p-3 text-[11px] text-stone-600 text-left rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-stone-800">
            <Badge variant="stone" size="sm">
              Instant Setup
            </Badge>
            <span>Secured via Clerk</span>
          </div>
          <p className="text-[10px] text-stone-500">
            Your progress syncs across all devices. Zero private code tracking.
          </p>
        </Card>

        {/* 4. Guest / Explore Mode */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">Just exploring?</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleGuest} showArrow arrowType="right">
            Continue as Guest
          </Button>
        </div>
      </div>
    </Modal>
  );
}
