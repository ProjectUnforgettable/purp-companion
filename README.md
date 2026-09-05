# PURP Companion

Mobile web companion for the **PURP** FiveM RP server (**Project Unforgettable**).

Status, rules, join tips, profile lookup, department apps, and ban appeals — dark theme with burnt-orange accents.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

## Live API

Env: `NEXT_PUBLIC_PURP_API_BASE` (no path suffix)

Default: `https://backgrounds-wrist-refrigerator-plot.trycloudflare.com`

| Route | Notes |
|-------|--------|
| `GET /api/status` | Players, queue, heat, jobs, staffing |
| `GET /api/player?discordId=` | Online player; **404** `{ "error": "player_not_online" }` when offline |

If the API tunnel is down, Home falls back to local status data. Profile shows an offline empty state.

## Connect

Local smoke test — no public join yet. No invented cfx codes.

## Deploy (Vercel)

```bash
npx vercel login
npx vercel --prod --name purp-companion \
  --env NEXT_PUBLIC_PURP_API_BASE=https://backgrounds-wrist-refrigerator-plot.trycloudflare.com
```

Or link the Origin/`main` repo in the Vercel dashboard as project **purp-companion** / **purp-app** and set the same env var.

## Stack

Next.js App Router · TypeScript · Tailwind · shadcn/ui
