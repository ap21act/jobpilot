import Image from "next/image";
import Link from "next/link";

import { OAuthButtons } from "@/components/auth/OAuthButtons";

const errorMessages: Record<string, string> = {
  cancelled: "Sign in was cancelled.",
  failed: "Sign in failed. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/">
            <Image src="/logo.png" alt="JobPilot" width={124} height={42} priority />
          </Link>
          <h1 className="mt-4 text-lg font-semibold text-text-primary">
            Welcome to JobPilot
          </h1>
          <p className="text-sm text-text-secondary">
            Sign in to find your next role.
          </p>
        </div>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-error">{errorMessage}</p>
        )}

        <div className="mt-6">
          <OAuthButtons />
        </div>
      </div>
    </main>
  );
}
