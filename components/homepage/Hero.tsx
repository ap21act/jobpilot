import Image from "next/image";

import { CtaButtons } from "@/components/homepage/CtaButtons";

export function Hero() {
  return (
    <section className="px-8 py-12">
      <div className="landing-hero-glow landing-card-shadow mx-auto max-w-[1440px] rounded-2xl border border-border px-8 py-20 text-center">
        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight text-text-primary">
          Job hunting is hard.
          <br />
          Your tools shouldn&apos;t be.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-text-secondary">
          Stop applying blind. JobPilot finds the jobs, researches the
          companies, and gives you everything you need to stand out.
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButtons />
        </div>
      </div>

      <div className="landing-browser-shadow landing-browser-frame mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl">
        <Image
          src="/images/dashboard-demo.png"
          alt="JobPilot dashboard preview"
          width={4788}
          height={2416}
          className="w-full"
          priority
        />
      </div>
    </section>
  );
}
