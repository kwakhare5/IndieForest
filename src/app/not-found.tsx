import React from "react";
import Link from "next/link";
import { Trees } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ece7de] text-stone-900 font-sans p-4">
      <div className="w-full max-w-md p-1.5 rounded-[2.5rem] glass-dock shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 rounded-[calc(2.5rem-0.375rem)] porcelain-surface text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
            <Trees className="w-6 h-6 stroke-[1.75]" />
          </div>

          <div className="space-y-1">
            <Badge variant="stone" size="sm" className="mb-2">
              404 • Lost in the Forest
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-normal text-stone-950 font-editorial">
              Island Not Found
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-xs mx-auto">
              This path has wandered off the map into unexplored wilderness.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Link href="/">
              <Button variant="emerald" size="md" showArrow arrowType="left">
                Return to Island
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
