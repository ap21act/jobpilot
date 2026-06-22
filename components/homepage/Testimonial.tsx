import Image from "next/image";

export function Testimonial() {
  return (
    <section className="landing-divider px-8 py-20">
      <div className="mx-auto max-w-3xl rounded-2xl bg-surface p-12 text-center landing-card-shadow">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Success Stories
        </p>
        <blockquote className="mt-6 text-2xl font-medium leading-snug text-text-primary">
          &ldquo;I used to spend my evenings copy-pasting resumes. Now I open
          my dashboard to see interviews waiting. It feels like cheating. Had
          3 offers on the table simultaneously.&rdquo;
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Image
            src="/images/user-icon.png"
            alt="Tom Wilson"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-text-primary">
              Tom Wilson
            </p>
            <p className="text-xs text-text-muted">Junior Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
