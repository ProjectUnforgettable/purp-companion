/**
 * PURP live server API config.
 * Override with NEXT_PUBLIC_PURP_API_BASE (no path suffix — routes are /api/…).
 */
export const PURP_API_BASE =
  process.env.NEXT_PUBLIC_PURP_API_BASE?.replace(/\/$/, "") ||
  "https://manager-accessibility-rain-quantitative.trycloudflare.com";

export const STATUS_POLL_MS = 20_000;

/** Discord OAuth start URL (backend). Override with NEXT_PUBLIC_DISCORD_LOGIN_URL. */
export const DISCORD_LOGIN_URL =
  process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL?.trim() ||
  "https://manager-accessibility-rain-quantitative.trycloudflare.com/oauth/discord/start";

export {
  DISCORD_ID_STORAGE_KEY,
  SESSION_STORAGE_KEY,
} from "@/lib/session";
