import Image from "next/image";
import Link from "next/link";

import { createInsforgeServer } from "@/lib/insforge-server";
import { UserMenu } from "@/components/layout/UserMenu";
import { PostHogIdentify } from "@/components/PostHogIdentify";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Find Jobs", href: "/find-jobs" },
  { label: "Profile", href: "/profile" },
];

export async function Navbar() {
  const insforge = await createInsforgeServer();
  const { data } = await insforge.auth.getCurrentUser();
  const user = data.user;

  return (
    <header className="h-16 w-full bg-surface border-b border-border">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-8">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="JobPilot" width={124} height={42} priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-dark hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <>
            <PostHogIdentify
              userId={user.id ?? user.email}
              email={user.email}
              name={user.profile?.name}
            />
            <UserMenu
              name={user.profile?.name ?? user.email}
              avatarUrl={user.profile?.avatar_url}
            />
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-text-slate px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Start for free
          </Link>
        )}
      </div>
    </header>
  );
}
