"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

type Props = {
  userId: string;
  email?: string;
  name?: string;
};

export function PostHogIdentify({ userId, email, name }: Props) {
  useEffect(() => {
    posthog.identify(userId, { email, name });
  }, [userId, email, name]);

  return null;
}
