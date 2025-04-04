// import { fetchAuthSession } from "aws-amplify/auth/server";
// import { NextRequest, NextResponse } from "next/server";
// import { runWithAmplifyServerContext } from "@/app/utils/amplifyServerUtils";

import { NextRequest, NextResponse } from "next/server";
import {
  authenticatedUser,
  runWithAmplifyServerContext,
} from "./utils/amplifyServerUtils";
import { fetchAuthSession } from "aws-amplify/auth/server";

// // Add a new function to check if the user has performed a checkout action
// const hasPerformedCheckout = (request: NextRequest): boolean => {
//   const checkoutPerformed = request.cookies.get("checkoutPerformed");
//   return checkoutPerformed?.value === "true";
// };

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next();
//   const { pathname } = new URL(request.url);

//   const session = await runWithAmplifyServerContext({
//     nextServerContext: { request, response },
//     operation: async (contextSpec) => {
//       try {
//         const session = await fetchAuthSession(contextSpec);
//         return session;
//       } catch (error) {
//         return null;
//       }
//     },
//   });

//   const isAuthenticated =
//     session?.tokens?.accessToken !== undefined &&
//     session?.tokens?.idToken !== undefined;

//   const userGroups: string[] = Array.isArray(
//     session?.tokens?.idToken?.payload?.["cognito:groups"]
//   )
//     ? session?.tokens?.idToken?.payload?.["cognito:groups"].filter(
//         (group: any) => typeof group === "string"
//       )
//     : [];

//   // Redirect authenticated users away from login and sign-up pages
//   if (
//     isAuthenticated &&
//     ["/auth/login", "/auth/signup", "/auth/confirm-email"].includes(pathname)
//   ) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Allow non-authenticated users to access sign-up and confirm-email pages
//   if (["/auth/sign-up", "/auth/confirm-email"].includes(pathname)) {
//     return response;
//   }

//   // Restrict /account to authenticated users only
//   if (pathname === "/account" && !isAuthenticated) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   // Restrict /account to users in the USERS group only
//   if (pathname === "/account" && !userGroups.includes("USERS")) {
//     return NextResponse.redirect(new URL("/admin", request.url));
//   }

//   // Restrict /admin/* to users in the ADMINS group only
//   if (pathname.startsWith("/admin") && !userGroups.includes("ADMINS")) {
//     return NextResponse.redirect(new URL("/error/not-authorized", request.url));
//   }

//   // Restrict /checkout/payment/success and /checkout/payment/cancel to users who have performed a checkout action
//   if (
//     ["/checkout/payment/success", "/checkout/payment/cancel"].includes(
//       pathname
//     ) &&
//     !hasPerformedCheckout(request)
//   ) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return response;
// }

// export const config = {
//   matcher: [
//     "/account",
//     "/admin/:path*",
//     "/auth/login",
//     "/auth/signup",
//     "/auth/confirm-email",
//     "/checkout/payment/success",
//     "/checkout/payment/cancel",
//   ],
// };

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });

  const isOnAdminPage = request.nextUrl.pathname.startsWith("/admin");

  if (isOnAdminPage) {
    if (isOnAdminPage && !user?.isAdmin) {
      return NextResponse.redirect(
        new URL("/error/not-authorized", request.nextUrl)
      );
    }
  }

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (context) => {
      try {
        const session = await fetchAuthSession(context, {});
        return session.tokens !== undefined;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });
  if (authenticated) {
    return response;
  }
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: [
    "/account",
    "/admin/:path*",
    "/checkout/payment/success",
    "/checkout/payment/cancel",
  ],
};
