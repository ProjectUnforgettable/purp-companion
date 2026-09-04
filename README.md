# PURP — Project Unforgettable

Mobile-first web companion for the **PURP** FiveM RP server. Designed as a phone-native prototype (bottom tabs, safe areas, touch targets) that can later wrap with Capacitor for iOS/Android.

## Quick start

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321) and resize to a phone viewport (~390×844) for the intended experience.

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server on port **4321** |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## What’s included

All data is **client-side mock JSON** — no backend, secrets, or live FiveM/Discord credentials.

| Screen | Route | What it does |
|--------|-------|--------------|
| **Home / Status** | `/` | Online badge, players, queue, job breakdown, uptime, quick actions |
| **Join** | `/join` | FiveM join steps, example `cfx.re/join/purp` connect string, requirements, Discord link |
| **Rules** | `/rules` | Searchable / collapsible RP ruleset |
| **Profile** | `/profile` | Mock character, economy, playtime unlock bar, demo unlock toggle |
| **More** | `/more` | Discord, theme note, about, links to departments / appeals / announcements |
| **Departments** | `/departments` | Police / EMS / Fire cards, 10h unlock, mock application form |
| **Appeals** | `/appeals` | Ban appeal form with local confirmation |
| **Announcements** | `/announcements` | Mock news + changelog feed |

**Bottom tabs:** Home · Join · Rules · Profile · More

## Branding

- App title: **PURP**
- Subtitle: **Project Unforgettable**
- Dark premium theme (deep purple / black)

## PWA basics

- `public/manifest.json` — name, theme color, standalone display
- Theme color + Apple web app meta via Next.js metadata
- `icon.svg` and `apple-touch-icon.png` placeholders

## Architecture notes

- **Next.js App Router** + TypeScript + Tailwind CSS + shadcn/ui
- Mock source: `src/lib/mock-data.ts`
- Session UI state (applications, appeals, unlock toggle): `src/lib/mock-store.tsx`
- Phone chrome: `src/components/layout/*`

## Next steps

1. **Live status** — replace `serverStatus` with your FXServer / cfx.re status endpoint (players, queue, uptime).
2. **Discord** — wire department apps + ban appeals to a Discord bot or webhook; replace placeholder invite URLs.
3. **Auth** — optional Discord OAuth so profile/playtime come from linked accounts instead of mocks.
4. **Native wrap** — add [Capacitor](https://capacitorjs.com/) (`npx cap add ios` / `android`) pointing at this web app for App Store / Play distribution.
5. **Push** — announcements via FCM/APNs once native shells exist.

## License

Prototype companion frontend for PURP. Standalone — does not include or clone private FiveM server resources.
