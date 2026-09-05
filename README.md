# PURP Companion

Mobile web companion for the **PURP** FiveM RP server (**Project Unforgettable**).

Live status, rules, join tips, Discord login + profile, department apps, and ban appeals.

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

Default: `https://manager-accessibility-rain-quantitative.trycloudflare.com`

| Route | Notes |
|-------|--------|
| `GET /api/status` | Players, queue, heat, jobs, staffing |
| `GET /api/player?discordId=` | Online player; **404** `{ "error": "player_not_online" }` when offline |

If the API is down, Home falls back to local status data. Profile shows a short offline empty state when signed in but offline.

## Discord login (Profile)

Env: `NEXT_PUBLIC_DISCORD_LOGIN_URL`

Default: `https://registration-stream-contributors-inside.trycloudflare.com/oauth/discord/start`

- **Log in with Discord** sends the browser to that URL.
- OAuth callback should land on `/profile` with `login=1` + `discordId` (+ optional `username`, `avatar`). Query or hash fragment both work.
- The app saves `localStorage["purp.session"]` (`discordId`, `username`, `avatar`) and strips those params from the URL.
- When signed in, Profile fetches `GET /api/player?discordId=`. Log out clears the session.

## Connect

Direct connect: `212.192.29.176:30120` (F8 / FiveM). Status API is served over HTTPS (Cloudflare tunnel) so GitHub Pages has no mixed-content block.

## Stack

Next.js (static `output: 'export'`) · TypeScript · Tailwind · shadcn/ui
