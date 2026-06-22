"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";

import { signOutAction } from "@/actions/auth";

type Props = {
  name: string;
  avatarUrl?: string;
};

export function UserMenu({ name, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-accent-light text-sm font-medium text-accent"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={36} height={36} />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-40 rounded-md border border-border bg-surface p-1 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            onClick={() => {
              posthog.capture("signed_out");
              posthog.reset();
              signOutAction();
            }}
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-surface-secondary"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
