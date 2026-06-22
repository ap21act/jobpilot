# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Foundation
**Last completed:** 04 Database Schema (profiles, agent_runs, jobs, agent_logs tables + resumes storage bucket created in InsForge, RLS enabled on all four tables)
**Next:** 05 Profile Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- Homepage built pixel-matched against `context/designs/landing-page.png`. Used the pre-rendered mockup images already in `public/images/` (`dashboard-demo.png`, `jobs-lists.png`, `agnet-log.png`, `user-icon.png`) and `public/logo.png` directly instead of re-building those visuals as DOM/markup, since the design's screenshots are static decorative content, not live data.
- Both feature-showcase rows ("Manage Your Job Search With Ease" / "Apply With More Confidence, Every Time") share one reusable `FeatureShowcase` component instead of two near-duplicate components, since they're the exact same layout mirrored.
- CTA button pair ("Get Started" / "Find Your First Match") extracted into `CtaButtons` since it's used verbatim in both Hero and CallToAction.
- "Get Started", "Find Your First Match", and "Start for free" all link to `/login` for now — no auth/session check exists yet (that's Phase 1 → 02 Auth), so the authenticated→`/dashboard` redirect branch from project-overview.md isn't wired up yet.
- **02 Auth:** The real `@insforge/sdk` ships its SSR cookie-session kit under the `@insforge/sdk/ssr` subpath (not a separate `@insforge/ssr` package as `architecture.md`/`code-standards.md` previously implied — both docs corrected). Key pieces used: `createBrowserClient()` (read-only auth surface: `getCurrentUser`/`getProfile`/`getPublicAuthConfig` — no mutations), `createServerClient({ cookies: { get } })` for server-side reads, `createAuthActions({ cookies })` for Server Actions that need to write auth cookies (`signInWithOAuth`, `signOut`), and `updateSession({ requestCookies, responseCookies })` in `proxy.ts` for optimistic-refresh route protection.
- `signInWithOAuth`/`signOut` are intentionally unavailable on the browser client returned by `createBrowserClient()` — they require cookie writes, which only happen server-side. Implemented as Server Actions in `actions/auth.ts`: `signInWithOAuthAction(provider, redirectTo)` calls `redirect()` to the provider URL returned by the SDK; `signOutAction()` clears cookies then redirects home. Both are called directly as functions from client components (`OAuthButtons.tsx`, `UserMenu.tsx`), not via `<form action>`.
- Next.js 16 renamed `middleware.ts` → `proxy.ts` (export `proxy()`, not `middleware()`). Confirmed via `node_modules/next/dist/docs` — this project is on Next 16.2.9. `architecture.md` corrected to reference `proxy.ts`.
- `Navbar` and `CtaButtons` are now `async` Server Components that call `createInsforgeServer()` to check session — `Navbar` shows `UserMenu` (avatar + logout) when signed in, "Start for free" when signed out; `CtaButtons` routes to `/dashboard` vs `/login` accordingly.
- `allowedRedirectUrls` being empty on the InsForge backend is **fine** — per InsForge's REST docs, an empty list means "allow all redirects" (a dev convenience), not "reject all." This was misdiagnosed mid-session as a blocker; it never needed a dashboard change.
- **The actual OAuth bug:** the PKCE `POST /api/auth/oauth/exchange` REST endpoint requires `code_verifier` in the body, even though the TS SDK's `exchangeOAuthCode(code, codeVerifier?)` types it as optional. `signInWithOAuthAction` now stashes the `codeVerifier` returned by `signInWithOAuth()` into a short-lived httpOnly cookie (`oauth_code_verifier`, 600s) before redirecting to the provider; `exchangeOAuthCodeAction` (called from `app/(auth)/callback/page.tsx` via `useSearchParams().get("insforge_code")`) reads that cookie, passes it to `exchangeOAuthCode(code, codeVerifier)`, then deletes it. Without this round-trip the exchange silently fails and the user gets bounced back to `/login` with no code ever actually being consumed.
- Removed `lib/insforge-client.ts` and `app/api/auth/refresh/route.ts` — both were built for the browser client (`createBrowserClient()`), but the design ended up routing every auth mutation through Server Actions instead (the SSR browser client's auth surface deliberately excludes `signInWithOAuth`/`signOut`), so nothing ever called either one. Recreate both (3 lines + `createRefreshAuthRouter()`) the moment a feature needs client-side `getCurrentUser()`/`getProfile()` reads — see architecture.md's InsForge Client Pattern for the exact snippet.
- The callback page also redirects to `/login?error=cancelled` if the provider returns an `error` query param (user denied/cancelled on the provider's consent screen), and to `/login?error=failed` if the code exchange itself fails — `/login` reads that param server-side and shows a human-readable message.
- **03 PostHog Initialization:** Built by the PostHog wizard, which deviated from `build-plan.md`/`architecture.md` in three ways now corrected in the docs: (1) uses `instrumentation-client.ts` at the project root instead of `lib/posthog-client.ts` — this is the actual Next.js 16 convention, auto-loaded before app code with no init call needed in `layout.tsx`; (2) the env var is `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, not `NEXT_PUBLIC_POSTHOG_KEY`; (3) `lib/posthog-server.ts` exports a module-level singleton (`getPostHogClient()`) rather than a `createPostHogServer()` factory — `posthog.shutdown()` is intentionally never called on it (`shutdown()` would permanently close the singleton for every later request in the same process); `flushAt: 1` + `flushInterval: 0` already force a synchronous flush per `capture()`, so no event is lost without it. The wizard also shipped 6 events (`cta_clicked`, `sign_in_initiated`, `sign_in_error`, `sign_in_completed`, `sign_in_failed`, `signed_out`) covering auth/landing — added to `code-standards.md`'s event table alongside the 4 events still planned for later phases (`job_search_started`, `job_found`, `profile_completed`, `company_researched`).
- **04 Database Schema:** All DDL run via InsForge's `run-raw-sql` MCP tool (not the SDK — schema management is infrastructure, not application logic) and saved to `db/schema.sql` as the durable source of truth, since InsForge has no migration history of its own. Confirmed InsForge auth is Supabase-style: `auth.users(id, email, ...)`, `auth.uid()` function, and `anon`/`authenticated` Postgres roles already exist. Three deviations from a naive reading of `architecture.md` worth flagging: (1) `profiles.id` is the FK to `auth.users(id)` directly (`on delete cascade`) — there is no separate `user_id` column on `profiles`, so RLS there is `auth.uid() = id`, not `auth.uid() = user_id`; (2) RLS is one blanket `for all` policy per table rather than separate per-operation policies — every table here is strictly single-owner with no shared/admin read case in scope; (3) only `jobs.source` got a DB-level `CHECK (source in ('search','url'))` constraint, since it's the one column `architecture.md`'s Invariants section explicitly calls out — other enum-like columns (`agent_runs.status`, `agent_logs.level`, `experience_level`, etc.) stay plain `text`, validated by zod at the Server Action/agent boundary instead. The `resumes` storage bucket was created with `isPublic: false`; InsForge has no per-object storage RLS, so "own files only" is **not** enforced at the DB/storage layer — it depends entirely on every future upload/download (feature 06+) using the `resumes/{user_id}/resume.pdf` path server-side and never accepting an arbitrary path from the client. Indexes added on every FK/filter column (`user_id` on `agent_runs`/`jobs`/`agent_logs`, `run_id` on `jobs`/`agent_logs`, `job_id` on `agent_logs`) since features 11, 15, 16 filter/sort/aggregate by these immediately.
- **04 Database Schema — post-review fixes:** `/review` flagged two issues, both fixed and reflected in `db/schema.sql`. (1) `agent_logs.run_id` originally cascade-deleted with its `agent_run`, while `jobs.run_id` only nulled out — inconsistent if a "delete old runs" cleanup ever ships. Changed `agent_logs_run_id_fkey` to `on delete set null` so logs and jobs behave the same way (orphaned, not deleted) if a run record ever goes away. (2) `profiles.updated_at` had a `default now()` but nothing bumped it on `UPDATE`, so it would freeze at creation time unless every future Server Action set it manually. Added a `set_updated_at()` trigger function and a `before update` trigger on `profiles` so it's automatic. Third review finding (storage bucket privacy is unverified end-to-end) was left as-is — it's an assumption to exercise in feature 06, not something to fix here.

---

## Notes

- Fixed a pre-existing bug in `app/globals.css`: the base element resets (`a`, `button/input/textarea/select`, `::selection`) were unlayered CSS, which beats any `@layer utilities` rule regardless of specificity in Tailwind v4's cascade. This silently broke `text-white` (and would've broken any text-color utility) on every link. Moved those resets into `@layer base`. Worth keeping in mind for any future global CSS added outside `@theme`.
- `npm run dev` will refuse a second instance and fall back to whatever port is free (saw both 3000 and 3001 during this session) — check the actual `Local:` URL it prints rather than assuming 3000.
