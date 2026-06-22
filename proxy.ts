import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr";
import type { CookieStore } from "@insforge/sdk/ssr";

const protectedPrefixes = ["/dashboard", "/profile", "/find-jobs"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const { accessToken } = await updateSession({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    requestCookies: {
      get: (name) => request.cookies.get(name),
    },
    // CookieWriter.set is overloaded with a single-options-object signature that
    // Next's ResponseCookies.set (name, value, options) can't structurally satisfy.
    responseCookies: {
      get: (name) => response.cookies.get(name),
      set: (name: string, value: string, options) =>
        response.cookies.set(name, value, options),
      delete: (name: string) => response.cookies.delete(name),
    } as CookieStore,
  });

  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isLoginRoute = pathname === "/login";

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
