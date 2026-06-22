"use client";

import { useState } from "react";
import posthog from "posthog-js";

import { signInWithOAuthAction } from "@/actions/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.48c-.28 1.5-1.13 2.78-2.41 3.63v3.02h3.89c2.28-2.1 3.59-5.2 3.59-8.84Z"
        className="fill-google-blue"
      />
      <path
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.89-3.02c-1.08.73-2.46 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.92H1.27v3.09C3.25 21.3 7.31 24 12 24Z"
        className="fill-google-green"
      />
      <path
        d="M5.31 14.32a7.2 7.2 0 0 1 0-4.64V6.59H1.27a11.99 11.99 0 0 0 0 10.82l4.04-3.09Z"
        className="fill-google-yellow"
      />
      <path
        d="M12 4.76c1.76 0 3.34.61 4.59 1.79l3.45-3.45C17.94 1.18 15.23 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.04 3.09c.94-2.82 3.58-4.92 6.69-4.92Z"
        className="fill-google-red"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.69.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

export function OAuthButtons() {
  const [pendingProvider, setPendingProvider] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(provider: "google" | "github") {
    setError(null);
    setPendingProvider(provider);

    posthog.capture("sign_in_initiated", { provider });

    const result = await signInWithOAuthAction(
      provider,
      `${window.location.origin}/callback`,
    );

    if (result && !result.success) {
      posthog.capture("sign_in_error", { provider });
      setError("Something went wrong signing in. Please try again.");
      setPendingProvider(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => handleSignIn("google")}
        disabled={pendingProvider !== null}
        className="inline-flex items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-60"
      >
        <GoogleIcon />
        {pendingProvider === "google" ? "Redirecting…" : "Continue with Google"}
      </button>

      <button
        type="button"
        onClick={() => handleSignIn("github")}
        disabled={pendingProvider !== null}
        className="inline-flex items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-60"
      >
        <GithubIcon />
        {pendingProvider === "github" ? "Redirecting…" : "Continue with GitHub"}
      </button>

      {error && <p className="text-center text-sm text-error">{error}</p>}
    </div>
  );
}
