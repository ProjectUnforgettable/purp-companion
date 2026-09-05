# PURP | Project Unforgettable

Mobile-first web companion for the **PURP** FiveM RP server. Phone-native layout (bottom tabs, safe areas) that can later wrap with Capacitor.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — defaults already point at the smoke box
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321) and resize to a phone viewport (~390×844).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server on port **4321** |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Live API

Base URL (no `/purp-api` prefix) — override with `NEXT_PUBLIC_PURP_API_BASE`:

`https://backgrounds-wrist-refrigerator-plot.trycloudflare.com`

| Route | Notes |
|-------|--------|
| `GET /api/status` | Players, queue, heat (0–1), jobs, staffing note |
| `GET /api/player?discordId=` | Online player sheet; **404** `{ "error": "player_not_online" }` when offline |

If the tunnel flakes or returns non-JSON, Home falls back to mock status. Profile keeps a demo sheet until you paste a Discord ID.

## Branding

- **PURP** / Project Unforgettable
- Dark theme, burnt-orange accents

## Screens

| Screen | Route |
|--------|-------|
| Home / live status | `/` |
| Join (smoke box · local only) | `/join` |
| Rules | `/rules` |
| Profile (Discord ID lookup) | `/profile` |
| More | `/more` |
| Departments | `/departments` |
| Appeals | `/appeals` |
| Announcements | `/announcements` |

**Bottom tabs:** Home · Join · Rules · Profile · More

## Connect & Discord

- Connect: **smoke box / local only** — no public cfx join invented
- Discord guild: `https://discord.com/channels/1373397457177935893`

## Stack

Next.js App Router · TypeScript · Tailwind · shadcn/ui · live helpers in `src/lib/purp-api.ts`

## License

Prototype companion frontend for PURP. Standalone — does not include private FiveM resources.
