import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/app/utils/amplifyServerUtils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = new URL(request.url);

  console.log("Request URL:", request.url);

  const session = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        console.log("Session:", session);
        return session;
      } catch (error) {
        console.log("Error fetching session:", error);
        return null;
      }
    },
  });

  const isAuthenticated =
    session?.tokens?.accessToken !== undefined &&
    session?.tokens?.idToken !== undefined;

  console.log("Is Authenticated:", isAuthenticated);

  const userGroups: string[] = Array.isArray(
    session?.tokens?.idToken?.payload?.["cognito:groups"]
  )
    ? session?.tokens?.idToken?.payload?.["cognito:groups"].filter(
        (group: any) => typeof group === "string"
      )
    : [];

  // Redirect authenticated users away from login and sign-up pages
  if (
    isAuthenticated &&
    ["/auth/login", "/auth/signup", "/auth/confirm-email"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow non-authenticated users to access sign-up and confirm-email pages
  if (["/auth/sign-up", "/auth/confirm-email"].includes(pathname)) {
    return response;
  }

  // Restrict /account to authenticated users only
  if (pathname === "/account" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Restrict /admin/* to users in the ADMINS group only
  if (pathname.startsWith("/admin") && !userGroups.includes("ADMINS")) {
    return NextResponse.redirect(new URL("/error/not-authorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/account",
    "/admin/:path*",
    "/auth/login",
    "/auth/signup",
    "/auth/confirm-email",
  ],
};
