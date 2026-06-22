"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { exchangeOAuthCodeAction } from "@/actions/auth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error")) {
      router.replace("/login?error=cancelled");
      return;
    }

    const code = searchParams.get("insforge_code");

    if (!code) {
      router.replace("/login");
      return;
    }

    exchangeOAuthCodeAction(code).then((result) => {
      if (result && !result.success) {
        router.replace("/login?error=failed");
      }
    });
  }, [router, searchParams]);

  return <p className="text-sm text-text-secondary">Signing you in…</p>;
}

export default function CallbackPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4">
      <Suspense fallback={<p className="text-sm text-text-secondary">Signing you in…</p>}>
        <CallbackContent />
      </Suspense>
    </main>
  );
}
