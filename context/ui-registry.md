# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Navbar

`components/layout/Navbar.tsx` — top nav, used on all pages. `async` Server Component — calls `createInsforgeServer()` to check session and renders `UserMenu` when signed in, the CTA link when signed out.

- Wrapper: `h-16 w-full bg-surface border-b border-border`
- Inner: `mx-auto flex h-full max-w-[1440px] items-center justify-between px-8`
- Logo: `next/image` pointing at `/logo.png` (icon + wordmark baked into one asset)
- Nav links: `text-sm font-medium text-text-dark hover:text-accent`
- CTA button (signed out): `rounded-md bg-text-slate px-4 py-2 text-sm font-medium text-white hover:opacity-90`

### UserMenu

`components/layout/UserMenu.tsx` — avatar + logout dropdown, rendered by `Navbar` when a session exists. Client component (needs open/close state and an `onClick` handler).

- Avatar trigger: `flex size-9 items-center justify-center overflow-hidden rounded-full bg-accent-light text-sm font-medium text-accent` — shows profile `avatar_url` image if present, else first letter of name/email
- Dropdown panel: `absolute right-0 top-12 w-40 rounded-md border border-border bg-surface p-1 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]`
- Logout item: `w-full rounded-md px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-surface-secondary` — calls `signOutAction()` Server Action directly

### OAuthButtons

`components/auth/OAuthButtons.tsx` — Google + GitHub sign-in buttons, used on the login page. Client component (button state + click handler calling a Server Action).

- Button: `inline-flex items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-60`
- Brand icons: inline SVG (Google multicolor "G", GitHub mark) — lucide-react has no brand logos. Google's four path colors use `fill-google-blue`/`fill-google-green`/`fill-google-yellow`/`fill-google-red` tokens (see ui-tokens.md), never inline hex — GitHub's mark uses `fill="currentColor"`.
- Calls `signInWithOAuthAction(provider, redirectTo)` from `actions/auth.ts`; shows inline error text (`text-sm text-error`) on failure

### Footer

`components/layout/Footer.tsx` — site footer, used on all pages.

- Wrapper: `w-full border-t border-border bg-surface`
- Inner: `mx-auto flex max-w-[1440px] items-center justify-between px-8 py-8`
- Links: `text-sm font-medium text-text-secondary hover:text-accent`

### CtaButtons

`components/homepage/CtaButtons.tsx` — shared "Get Started" + "Find Your First Match" button pair, reused in Hero and CallToAction. `async` Server Component — calls `createInsforgeServer()` and routes both links to `/dashboard` if signed in, `/login` if not.

- Primary: `inline-flex items-center gap-1.5 rounded-md bg-text-slate px-4 py-2.5 text-sm font-medium text-white hover:opacity-90` + `ChevronRight` icon from `lucide-react`
- Secondary: `inline-flex items-center rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary`

### Hero

`components/homepage/Hero.tsx` — homepage hero banner + dashboard preview image.

- Glow panel: `landing-hero-glow landing-card-shadow` (defined in globals.css) on `rounded-2xl border border-border`
- Headline: `text-5xl font-bold leading-tight text-text-primary`
- Subtext: `text-base text-text-secondary`
- Dashboard preview: `next/image` of `/images/dashboard-demo.png` inside `landing-browser-shadow landing-browser-frame rounded-2xl overflow-hidden`

### FeatureShowcase

`components/homepage/FeatureShowcase.tsx` — reusable two-column image+feature-list section. Used twice on homepage (jobs-list image / agent-log image), mirrored via `imagePosition` prop.

- Grid: `mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 md:grid-cols-2`
- Heading: `text-3xl font-bold text-text-primary`
- Feature item: `border-l-2 py-5 pl-6`, active item uses `border-accent`, inactive `border-border`
- Image wrapper: `rounded-2xl bg-surface-muted p-8`

### Testimonial

`components/homepage/Testimonial.tsx` — success story quote section.

- Section: `landing-divider px-8 py-20`
- Card: `mx-auto max-w-3xl rounded-2xl bg-surface p-12 text-center landing-card-shadow`
- Label: `text-xs font-semibold uppercase tracking-wide text-accent`
- Avatar: `next/image` of `/images/user-icon.png`, `rounded-full`

### CallToAction

`components/homepage/CallToAction.tsx` — bottom CTA banner, mirrors Hero's glow panel and reuses `CtaButtons`.

### Login page

`app/(auth)/login/page.tsx` — centered auth card, no Navbar/Footer (standard auth-page convention, not specified otherwise in build-plan). `async` Server Component — reads `searchParams.error` to show a message after a failed/cancelled OAuth attempt.

- Page wrapper: `flex flex-1 items-center justify-center bg-background px-4`
- Card: `w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]`
- Error message (`?error=cancelled`/`?error=failed`): `mt-4 text-center text-sm text-error`
- Renders `OAuthButtons` below logo + heading

### Callback page

`app/(auth)/callback/page.tsx` — transient status page shown while the OAuth code exchange runs server-side, then redirects to `/dashboard` or `/login`. Client component wrapped in `Suspense` (required for `useSearchParams()`).

- Page wrapper: same as Login page — `flex flex-1 items-center justify-center bg-background px-4`
- Status text: `text-sm text-text-secondary` (e.g. "Signing you in…") — reuse this wrapper/text pairing for any future transient/status-only page rather than inventing a new one

---

## Notes

- `app/globals.css` base element resets (`a`, `button/input/textarea/select`, `::selection`) must stay inside `@layer base`. Tailwind v4 utilities are emitted in `@layer utilities`, and unlayered CSS always wins over any `@layer` regardless of specificity — an unlayered `a { color: inherit }` was silently overriding `text-white` on every `Link`/`a` element before this was fixed.
