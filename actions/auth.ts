"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";
import { getPostHogClient } from "@/lib/posthog-server";

const CODE_VERIFIER_COOKIE = "oauth_code_verifier";

async function getAuthActions() {
  const cookieStore = await cookies();
  return createAuthActions({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });
}

export async function signInWithOAuthAction(
  provider: "google" | "github",
  redirectTo: string,
) {
  let oauthUrl: string;

  try {
    const auth = await getAuthActions();
    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo,
    });

    if (error || !data?.url) {
      return { success: false, error: "Failed to start sign in" };
    }

    // PKCE: the REST exchange endpoint requires this verifier back, but it's
    // only returned here, in this first request — stash it so the callback
    // request (a separate request, after the provider redirect) can read it.
    if (data.codeVerifier) {
      const cookieStore = await cookies();
      cookieStore.set(CODE_VERIFIER_COOKIE, data.codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600,
      });
    }

    oauthUrl = data.url;
  } catch (error) {
    console.error("[actions/auth]", error);
    return { success: false, error: "Failed to start sign in" };
  }

  redirect(oauthUrl);
}

export async function exchangeOAuthCodeAction(code: string) {
  let userId: string | undefined;

  try {
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get(CODE_VERIFIER_COOKIE)?.value;
    cookieStore.delete(CODE_VERIFIER_COOKIE);

    const auth = await getAuthActions();
    const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier);

    if (error) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: "anonymous",
        event: "sign_in_failed",
        properties: { error: error.message ?? "oauth_exchange_failed" },
      });
      return { success: false, error: "Sign in failed. Please try again." };
    }

    userId = (data as { user?: { id?: string } } | null)?.user?.id;
  } catch (error) {
    console.error("[actions/auth]", error);
    return { success: false, error: "Sign in failed. Please try again." };
  }

  if (userId) {
    const posthog = getPostHogClient();
    posthog.identify({ distinctId: userId });
    posthog.capture({
      distinctId: userId,
      event: "sign_in_completed",
    });
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  try {
    const auth = await getAuthActions();
    await auth.signOut();
  } catch (error) {
    console.error("[actions/auth]", error);
  }

  redirect("/");
}
