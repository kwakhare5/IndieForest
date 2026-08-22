import { NextRequest, NextResponse } from "next/server";
import { parseUniversalRevenueEvent } from "@/lib/revenueWebhook";
import { supabase } from "@/lib/supabase";

/**
 * Universal Revenue Webhook Route for IndieForest
 * Connects Stripe, Lemon Squeezy, and Polar webhooks to auto-sprout 3D Golden Oak trees.
 */
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const userId = searchParams.get("userId") || searchParams.get("user");

    if (!token || token.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Valid webhook token required in query parameter (?token=...)" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const normalizedTree = parseUniversalRevenueEvent(body);

    if (!normalizedTree.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Ignored zero-value or trial event",
          data: normalizedTree,
        },
        { status: 200 }
      );
    }

    // Direct Supabase Insertion if userId is present
    if (userId) {
      try {
        await supabase.from("trees").insert({
          id: `tree-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          user_id: userId,
          name: normalizedTree.customerName,
          type: "revenue",
          mrr: normalizedTree.mrr,
          tier: normalizedTree.tier,
          grid_x: 2.0,
          grid_z: -1.0,
          planted_at: new Date().toISOString(),
        } as any);
      } catch (dbErr) {
        console.warn("Webhook DB insert fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Customer tree ready to sprout: ${normalizedTree.customerName} ($${normalizedTree.mrr}/mo)`,
      data: normalizedTree,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
