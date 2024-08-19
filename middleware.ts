import { clerkMiddleware, ClerkMiddlewareOptions } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // You can still use options for Clerk here if needed
} as ClerkMiddlewareOptions);
//a
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
