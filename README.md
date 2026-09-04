# PURP | Project Unforgettable

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

## Branding

- App title: **PURP**
- Subtitle: **Project Unforgettable**
- Wordmark logo (shield/flame asset may come later)
- Dark theme with **burnt-orange** accents (matched to PURP framework markers — not purple)

## What’s included

All data is **client-side mock JSON** — no backend, secrets, or live FiveM/Discord credentials.

| Screen | Route | What it does |
|--------|-------|--------------|
| **Home / Status** | `/` | Online badge, players, queue, heat/staffing, `#server-status`-style feed, on-shift jobs, quick actions |
| **Join** | `/join` | FiveM steps, connect placeholder (`server IP / cfx link TBD`), Discord guild deep link, controller tip |
| **Rules** | `/rules` | Searchable / collapsible RP ruleset |
| **Profile** | `/profile` | Read-only character sheet (from game), Discord linked + whitelist/verified, in-game playtime clock, shift board, phone/bank/inventory placeholders, demo unlock toggle |
| **More** | `/more` | Discord, controller tip (Xbox + PlayStation via `purp-input`), theme note, about, links to departments / appeals / announcements |
| **Departments** | `/departments` | Police / EMS / Fire cards, **10h in-game** unlock, application status, staff-assigned note (never self-serve) |
| **Appeals** | `/appeals` | Ban appeal form with local confirmation |
| **Announcements** | `/announcements` | Mock news + changelog feed |

**Bottom tabs:** Home · Join · Rules · Profile · More

## Connect & Discord

- Connect: **server IP / cfx link TBD** until hosted on cfx.re — watch Discord for the live string
- Discord guild deep link: `https://discord.com/channels/1373397457177935893`

## PWA basics

- `public/manifest.json` — name, burnt-orange-friendly theme color, standalone display
- Theme color + Apple web app meta via Next.js metadata
- `icon.svg` and `apple-touch-icon.png` wordmark placeholders

## Architecture notes

- **Next.js App Router** + TypeScript + Tailwind CSS + shadcn/ui
- Mock source: `src/lib/mock-data.ts`
- Session UI state (applications, appeals, unlock toggle): `src/lib/mock-store.tsx`
- Phone chrome: `src/components/layout/*`

## Next steps (API wiring)

1. **Live status** — replace `serverStatus` / status feed with FXServer or Discord `#server-status` bot output (players, jobs on shift, heat, staffing).
2. **In-game playtime** — sync the profile clock from the game (not wall-clock) so the 10h department unlock is authoritative.
3. **Character sheet** — read-only pulls from game state (job/shift board, cash/bank); keep Discord for identity/whitelist only.
4. **Phone / bank / inventory snapshots** — fill the placeholder cards when those resource APIs exist.
5. **Discord** — wire department apps + ban appeals to a bot or webhook; keep guild deep link `1373397457177935893`.
6. **Connect** — swap the TBD placeholder for the live cfx.re join code once hosted.
7. **Native wrap** — add [Capacitor](https://capacitorjs.com/) (`npx cap add ios` / `android`) for App Store / Play distribution.
8. **Push** — announcements via FCM/APNs once native shells exist.

## License

Prototype companion frontend for PURP. Standalone — does not include or clone private FiveM server resources.
