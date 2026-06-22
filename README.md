# JobPilot

JobPilot is a full-stack AI-powered job hunting assistant. Set up your profile once, upload your resume, and the agent discovers relevant jobs, scores them against your profile with GPT-4o, and researches each company before you apply.

## How It Works

1. **Sign up** with Google or GitHub via InsForge auth
2. **Build your profile** — fill out resume fields manually, or upload a PDF and let GPT-4o extract them automatically
3. **Find jobs** — search by title and location; the agent pulls listings from Adzuna and scores each one 0-100 against your profile, with matched/missing skills and a reason
4. **Research companies** — one click sends a Browserbase + Stagehand session to browse the company's public pages, and GPT-4o builds a structured dossier (overview, tech stack, culture, interview prep)
5. **Apply** — review the job and dossier, then click through to the original posting

Everything is tracked on a dashboard with PostHog-powered analytics and a recent activity feed.

## Pages

```
/                  Homepage
/login             Auth (Google + GitHub OAuth)
/dashboard         Overview, recent activity, analytics
/find-jobs         Search controls + full jobs list
/find-jobs/[id]    Job details + company research
/profile           Profile form, resume management
```

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [InsForge](https://insforge.dev) — auth, database, storage
- [Adzuna API](https://developer.adzuna.com) — job discovery
- GPT-4o — job matching, resume parsing/generation, company dossiers
- [Browserbase](https://www.browserbase.com) + [Stagehand](https://www.stagehand.dev) — company research browsing
- [PostHog](https://posthog.com) — product analytics

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

See `context/project-overview.md` for the full product spec and `context/build-plan.md` / `context/progress-tracker.md` for current build status.
