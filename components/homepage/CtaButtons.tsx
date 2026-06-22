import { ChevronRight } from "lucide-react";

import { createInsforgeServer } from "@/lib/insforge-server";
import { CtaLink } from "@/components/homepage/CtaLink";

export async function CtaButtons() {
  const insforge = await createInsforgeServer();
  const { data } = await insforge.auth.getCurrentUser();
  const destination = data.user ? "/dashboard" : "/login";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CtaLink
        href={destination}
        label="get_started"
        className="inline-flex items-center gap-1.5 rounded-md bg-text-slate px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Get Started
        <ChevronRight className="size-4" />
      </CtaLink>
      <CtaLink
        href={destination}
        label="find_first_match"
        className="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary"
      >
        Find Your First Match
      </CtaLink>
    </div>
  );
}
