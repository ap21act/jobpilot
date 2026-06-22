# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into JobPilot. The project already had `posthog-js` and `posthog-node` installed, client-side tracking initialized via `instrumentation-client.ts`, a reverse proxy configured in `next.config.ts`, and a server-side PostHog client in `lib/posthog-server.ts`. Six key events were instrumented across four files. User identity is linked on the client side via a `PostHogIdentify` component rendered in the `Navbar` for every authenticated user, and on the server side in the OAuth code-exchange action.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | Visitor clicks a primary call-to-action button on the landing page (hero or bottom section). | `components/homepage/CtaLink.tsx` |
| `sign_in_initiated` | User clicks the Google or GitHub OAuth button to start the sign-in flow. | `components/auth/OAuthButtons.tsx` |
| `sign_in_error` | OAuth sign-in redirect fails and the user sees a client-side error. | `components/auth/OAuthButtons.tsx` |
| `sign_in_completed` | OAuth code exchange succeeds and the user is authenticated. | `actions/auth.ts` |
| `sign_in_failed` | OAuth code exchange fails on the server side. | `actions/auth.ts` |
| `signed_out` | Authenticated user clicks the logout button and their session is reset. | `components/layout/UserMenu.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/481011/dashboard/1744517)
- [Sign-in Conversion Funnel](https://us.posthog.com/project/481011/insights/Fe3DYT09)
- [Daily Sign-ins](https://us.posthog.com/project/481011/insights/cBMVYuIe)
- [CTA Click Performance](https://us.posthog.com/project/481011/insights/xma5PfSo)
- [Sign-in Failures](https://us.posthog.com/project/481011/insights/cJPVVVge)
- [User Sign-outs (Churn Signal)](https://us.posthog.com/project/481011/insights/NsSli02A)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component fires on every authenticated page load via the `Navbar`, but verify this covers all authenticated routes that render the `Navbar`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
