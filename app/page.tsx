import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CallToAction } from "@/components/homepage/CallToAction";
import { FeatureShowcase } from "@/components/homepage/FeatureShowcase";
import { Hero } from "@/components/homepage/Hero";
import { Testimonial } from "@/components/homepage/Testimonial";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />

        <div className="landing-divider h-10" />

        <FeatureShowcase
          heading="Manage Your Job Search With Ease"
          imagePosition="right"
          activeFeatureIndex={0}
          image={{
            src: "/images/jobs-lists.png",
            width: 2364,
            height: 1778,
            alt: "Jobs list with match scores",
          }}
          features={[
            {
              title: "Find jobs that actually fit",
              description:
                "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
            },
            {
              title: "Know the Company Before You Apply",
              description:
                "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
            },
            {
              title: "Keep track of every application",
              description:
                "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
            },
          ]}
        />

        <div className="landing-divider h-10" />

        <FeatureShowcase
          heading="Apply With More Confidence, Every Time"
          imagePosition="left"
          activeFeatureIndex={1}
          image={{
            src: "/images/agnet-log.png",
            width: 2144,
            height: 1656,
            alt: "JobPilot agent log",
          }}
          features={[
            {
              title: "Understand your match score",
              description:
                "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
            },
            {
              title: "AI-Powered Job Matching",
              description:
                "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
            },
            {
              title: "Focus on the right roles",
              description:
                "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
            },
          ]}
        />

        <Testimonial />

        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
