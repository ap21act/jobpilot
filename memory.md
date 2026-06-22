# Memory — Database Schema (Phase 1, Feature 04)

Last updated: 2026-06-22

## What was built

Feature 04 — Database Schema, executed directly against the live InsForge backend (no local migrations folder existed; InsForge has no migration history of its own).

- Created four Postgres tables in InsForge: `profiles`, `agent_runs`, `jobs`, `agent_logs` — exact columns from `context/architecture.md`.
- Enabled RLS on all four tables with one blanket `for all` policy each, keyed on `auth.uid()`.
- Added a `CHECK (source in ('search','url'))` constraint on `jobs.source` — the only column architecture.md calls an explicit invariant.
- Added indexes on every FK/filter column (`user_id` on `agent_runs`/`jobs`/`agent_logs`, `run_id` on `jobs`/`agent_logs`, `job_id` on `agent_logs`).
- Created the `resumes` storage bucket with `isPublic: false`.
- Wrote `db/schema.sql` as the durable source of truth for the schema (new file, new `db/` folder).
- Updated `context/progress-tracker.md`: checklist, "Last completed"/"Next" pointers, and a full decision-log entry.
- Ran `/review`, which found two Layer 3 issues; both fixed in the same session and re-verified live:
  - `agent_logs.run_id` changed from `on delete cascade` to `on delete set null` (now consistent with `jobs.run_id`'s behavior — both survive a deleted `agent_run` as orphaned rows rather than diverging).
  - Added a `set_updated_at()` trigger function + `before update` trigger on `profiles` so `updated_at` bumps automatically (previously only had a `default now()`, which only fires on insert).
- `db/schema.sql` and `progress-tracker.md` updated again to reflect both fixes. A second `/review` pass confirmed 0 issues remaining.

## Decisions made

- `profiles.id` **is** the FK to `auth.users(id)` (`on delete cascade`) — no separate `user_id` column on that table. RLS on `profiles` is `auth.uid() = id`; RLS on the other three tables is `auth.uid() = user_id`.
- RLS uses one blanket `for all` policy per table rather than separate per-operation policies — every table here is strictly single-owner, no shared/admin read case exists anywhere in scope.
- Only `jobs.source` got a DB-level CHECK constraint. Other enum-like text columns (`agent_runs.status`, `agent_logs.level`, `experience_level`, `remote_preference`, `cover_letter_tone`, `work_authorization`, `job_type`) deliberately stay plain `text`, validated by zod at the Server Action/agent boundary instead — matches `code-standards.md`'s "validate at boundaries" principle.
- Storage bucket privacy: InsForge has **no per-object storage RLS** (confirmed against the SDK docs) — only bucket-level `isPublic` true/false. "Own files only" for `resumes` is NOT enforced at the DB/storage layer; it depends entirely on every future upload/download (feature 06+) always using the `resumes/{user_id}/resume.pdf` path server-side and never accepting an arbitrary path from the client. This is a real gap to keep in mind, not yet exercised by any code.
- Schema source of truth lives in `db/schema.sql`, executed via InsForge's `run-raw-sql` MCP tool (schema management is infrastructure per `AGENTS.md`, not application logic — SDK is for app code only).

## Problems solved

- Confirmed InsForge's auth backend is Supabase-style before writing any DDL: `auth.users(id, email, password, email_verified, created_at, updated_at, profile, metadata, is_project_admin, is_anonymous)`, `auth.uid()` function, and `anon`/`authenticated` Postgres roles all already exist. This made the RLS pattern (`auth.uid() = <owner column>`) a safe bet rather than a guess.
- `get-table-schema` doesn't show cross-schema (`auth.*`) foreign keys in its `foreignKeys` output — had to confirm those FKs actually landed via a direct `pg_constraint` query (`confrelid = 'auth.users'::regclass`) rather than trusting the absence of a SQL error alone.

## Current state

- All four tables live in InsForge, RLS enabled, policies active, indexes present, FKs to `auth.users` confirmed via `pg_constraint`.
- `resumes` bucket live, private (`isPublic: false`).
- `db/schema.sql` matches the live database exactly (re-verified after the post-review fixes).
- `context/progress-tracker.md`: Phase 1 is now `01 Homepage [x]`, `02 Auth [x]`, `03 PostHog Initialization [x]`, `04 Database Schema [x]`. "Next" points to `05 Profile Page — Full UI`.
- Second `/review` pass: 0 issues across all three layers. Feature is ready to ship.

## Next session starts with

Phase 2 → **05 Profile Page — Full UI** (per `context/build-plan.md`): build the complete profile page UI with mock data, no save logic yet — needs-attention banner with completion ring, resume upload section, and the full Profile Information form (Personal Info, Professional Info, up to 3 Work Experience roles, Education, Job Preferences), Save Profile button at bottom. Run `/architect` first per `AGENTS.md`'s required workflow before writing any UI code.

## Open questions

- None blocking. Worth keeping in mind for feature 06 (Profile Save Logic): the `resumes` bucket has no DB-level enforcement of "own files only" — that protection only exists if the upload/download code strictly uses the `resumes/{user_id}/resume.pdf` path convention. Verify this explicitly when 06 is built.
- Still open from the prior session, still not urgent: whether to remove the redundant client-side `identify()` call in `PostHogIdentify.tsx` now that the server-side one in `actions/auth.ts` covers the login moment.
