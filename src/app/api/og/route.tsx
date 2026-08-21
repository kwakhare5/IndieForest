import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const username = searchParams.get("username") || "builder";
    const level = searchParams.get("level") || "1";
    const streak = searchParams.get("streak") || "1";
    const trees = searchParams.get("trees") || "0";
    const mrr = searchParams.get("mrr") || "0";
    const badge = searchParams.get("badge") || "I";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ece7de",
            padding: "60px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Top Header */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  backgroundColor: "#047857",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                IF
              </div>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#047857",
                  letterSpacing: "-0.02em",
                }}
              >
                IndieForest
              </span>
            </div>

            <div
              style={{
                padding: "8px 20px",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                border: "1px solid #d6cfc5",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1c1917",
              }}
            >
              @{username}
            </div>
          </div>

          {/* Center Card */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ffffff",
              borderRadius: "32px",
              padding: "40px",
              border: "2px solid #d6cfc5",
              boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "44px",
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: "24px",
              }}
            >
              Day {streak} of Daily Shipping
            </div>

            <div
              style={{
                display: "flex",
                gap: "32px",
                paddingTop: "24px",
                borderTop: "2px solid #f5f5f4",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "16px", color: "#78716c", textTransform: "uppercase", fontWeight: "bold" }}>
                  Rank
                </span>
                <span style={{ fontSize: "32px", fontWeight: "bold", color: "#1c1917" }}>
                  Tier {badge} (Lvl {level})
                </span>
              </div>

              <div style={{ width: "2px", height: "50px", backgroundColor: "#e7e5e4" }} />

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "16px", color: "#78716c", textTransform: "uppercase", fontWeight: "bold" }}>
                  Active Trees
                </span>
                <span style={{ fontSize: "32px", fontWeight: "bold", color: "#047857" }}>
                  {trees} Trees
                </span>
              </div>

              <div style={{ width: "2px", height: "50px", backgroundColor: "#e7e5e4" }} />

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "16px", color: "#78716c", textTransform: "uppercase", fontWeight: "bold" }}>
                  Revenue
                </span>
                <span style={{ fontSize: "32px", fontWeight: "bold", color: "#1c1917" }}>
                  ${mrr}/mo MRR
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "18px",
              color: "#78716c",
              fontWeight: "600",
            }}
          >
            <span>Live 3D Diorama: indieforest.dev/u/{username}</span>
            <span>Turn your commits into a living island</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Failed to generate OG image";
    return new Response(errorMsg, { status: 500 });
  }
}
