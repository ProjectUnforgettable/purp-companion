import fs from "node:fs";
import type { NextConfig } from "next";

/** Set GITHUB_PAGES=true for project-site deploy under /purp-companion */
const isGithubPages = process.env.GITHUB_PAGES === "true";

/**
 * Optional local config (not in git). Used at build time to fill NEXT_PUBLIC_* Discord
 * vars for static export. Path override: PURP_DISCORD_CONFIG.
 */
function applyDiscordConfigFromFile() {
  const configPath =
    process.env.PURP_DISCORD_CONFIG?.trim() ||
    "/workspace/purp-discord-app-config.json";
  if (!fs.existsSync(configPath)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
      guildId?: string;
      inviteUrl?: string;
      openDiscordUrl?: string;
      channels?: Record<string, string>;
      webhooks?: Record<string, string>;
    };
    const setIfEmpty = (key: string, value?: string) => {
      if (!value?.trim()) return;
      if (!process.env[key]?.trim()) process.env[key] = value.trim();
    };
    setIfEmpty("NEXT_PUBLIC_DISCORD_INVITE_URL", raw.inviteUrl);
    // Prefer #how-to-join deep link as secondary; fall back to openDiscordUrl (#verify)
    const howToJoin =
      raw.guildId && raw.channels?.["how-to-join"]
        ? `https://discord.com/channels/${raw.guildId}/${raw.channels["how-to-join"]}`
        : undefined;
    setIfEmpty("NEXT_PUBLIC_DISCORD_OPEN_URL", howToJoin);
    setIfEmpty("NEXT_PUBLIC_DISCORD_OPEN_URL", raw.openDiscordUrl);
    setIfEmpty(
      "NEXT_PUBLIC_DISCORD_WEBHOOK_POLICE",
      raw.webhooks?.["apply-police"]
    );
    setIfEmpty(
      "NEXT_PUBLIC_DISCORD_WEBHOOK_EMS",
      raw.webhooks?.["apply-ems"]
    );
    setIfEmpty(
      "NEXT_PUBLIC_DISCORD_WEBHOOK_FIRE",
      raw.webhooks?.["apply-fire"]
    );
    setIfEmpty(
      "NEXT_PUBLIC_DISCORD_WEBHOOK_BAN_APPEALS",
      raw.webhooks?.["ban-appeals"]
    );
  } catch {
    // ignore malformed local config
  }
}

applyDiscordConfigFromFile();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGithubPages
    ? {
        basePath: "/purp-companion",
        assetPrefix: "/purp-companion/",
      }
    : {}),
};

export default nextConfig;
