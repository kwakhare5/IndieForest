import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default async function middleware(req: any, evt: any) {
  // If Clerk environment keys are not configured yet, pass through gracefully
  const hasClerkKeys =
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.CLERK_SECRET_KEY);

  if (!hasClerkKeys) {
    return NextResponse.next();
  }

  try {
    const handler = clerkMiddleware();
    return await handler(req, evt);
  } catch (error) {
    console.error("Clerk middleware initialization fallback:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};

