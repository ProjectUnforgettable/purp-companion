# PURP Companion

Mobile web companion for the **PURP** FiveM RP server (**Project Unforgettable**).

Live status, rules, join tips, Discord player lookup, department apps, and ban appeals.

## Permanent host (GitHub Pages)

Target URL after Pages is enabled on `ProjectUnforgettable/purp-companion`:

**https://projectunforgettable.github.io/purp-companion/**

CI: `.github/workflows/pages.yml` builds a static Next export on every push to `main`.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

Static export preview:

```bash
GITHUB_PAGES=true npm run build
npx serve out
```

## Live API

Env: `NEXT_PUBLIC_PURP_API_BASE` (no path suffix)

Default: `https://backgrounds-wrist-refrigerator-plot.trycloudflare.com`

| Route | Notes |
|-------|--------|
| `GET /api/status` | Players, queue, heat, jobs, staffing |
| `GET /api/player?discordId=` | Online player; **404** `{ "error": "player_not_online" }` when offline |

If the API is down, Home falls back to local status data. Profile shows a short offline empty state.

## Connect

Local smoke test — no public join yet. No invented cfx codes.

## Stack

Next.js (static `output: 'export'`) · TypeScript · Tailwind · shadcn/ui
