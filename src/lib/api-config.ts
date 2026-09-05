/**
 * PURP smoke-box API config.
 * Override with NEXT_PUBLIC_PURP_API_BASE (no path suffix — routes are /api/…).
 */
export const PURP_API_BASE =
  process.env.NEXT_PUBLIC_PURP_API_BASE?.replace(/\/$/, "") ||
  "https://backgrounds-wrist-refrigerator-plot.trycloudflare.com";

export const STATUS_POLL_MS = 20_000;

export const DISCORD_ID_STORAGE_KEY = "purp.discordId";
