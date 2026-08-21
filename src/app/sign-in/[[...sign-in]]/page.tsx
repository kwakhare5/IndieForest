import React from "react";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ece7de] text-stone-900 font-satoshi p-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" showArrow arrowType="left">
            Back to Island
          </Button>
        </Link>
      </div>
      <div className="p-1.5 rounded-[2rem] glass-dock shadow-2xl">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-none border-none bg-white/95 rounded-[calc(2rem-0.375rem)]",
            },
          }}
        />
      </div>
    </div>
  );
}
