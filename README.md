# Portfolio — Shafik Mohamed R

Interactive personal portfolio: career timeline, delivery metrics, domain expertise, success stories and a meeting scheduler.

**Live:** https://shafi18.github.io/Portfolio/

![Deploy](https://github.com/Shafi18/Portfolio/actions/workflows/deploy.yml/badge.svg)

| | |
|---|---|
| **Stack** | React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion |
| **Hosting** | GitHub Pages via GitHub Actions (OIDC, least-privilege) |
| **Analytics** | Google Analytics (optional, via `VITE_GA_MEASUREMENT_ID`) |

## Structure

```
src/
├── App.tsx            # Layout, routing between views
├── data.ts            # Portfolio content (single source of truth)
├── components/
│   ├── Hero, Navbar, Footer
│   ├── Timeline, Metrics, Domains, TechArraySection, SuccessStories
│   └── SchedulerModal, ConfirmationView, BookedMeetingsView
└── lib/gtag.ts        # Analytics helper
```

## Run locally

```bash
npm ci
cp .env.example .env.local   # fill in values; never commit this file
npm run dev                  # http://localhost:3000
```

## Security notes

- `.env*` files are git-ignored; only `.env.example` (placeholders) is committed.
- Any variable prefixed `VITE_` is bundled into public JavaScript — never put secrets there.
- Dependencies and Actions are kept current by Dependabot.
