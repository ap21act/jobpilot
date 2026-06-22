"use client";

import Link from "next/link";
import posthog from "posthog-js";

type Props = {
  href: string;
  label: string;
  className: string;
  children: React.ReactNode;
};

export function CtaLink({ href, label, className, children }: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => posthog.capture("cta_clicked", { label })}
    >
      {children}
    </Link>
  );
}
