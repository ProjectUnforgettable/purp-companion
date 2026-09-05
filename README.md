# PURP

Phone companion for the PURP FiveM server.

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4321

## Live API

`NEXT_PUBLIC_PURP_API_BASE` (default in `.env.example`):

- `GET /api/status`
- `GET /api/player?discordId=` → 404 `{ "error": "player_not_online" }` when offline

If the API is down, Home falls back to local status data.

## Connect

Local smoke test — no public join yet. No invented cfx codes.
