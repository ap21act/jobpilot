import { CtaButtons } from "@/components/homepage/CtaButtons";

export function CallToAction() {
  return (
    <section className="px-8 py-16">
      <div className="landing-hero-glow landing-card-shadow mx-auto max-w-[1440px] rounded-2xl border border-border px-8 py-16 text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-text-primary">
          Your next job search can feel a lot less overwhelming
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-text-secondary">
          Set up your profile, upload your resume, and start finding matches
          in minutes.
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButtons />
        </div>
      </div>
    </section>
  );
}
