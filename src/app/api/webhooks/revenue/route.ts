import { NextRequest, NextResponse } from "next/server";
import { parseUniversalRevenueEvent } from "@/lib/revenueWebhook";

/**
 * Universal Revenue Webhook Route for IndieForest
 * Connects Stripe, Lemon Squeezy, and Polar webhooks to auto-sprout 3D pine trees.
 */
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

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
