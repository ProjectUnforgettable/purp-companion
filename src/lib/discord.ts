/**
 * Discord webhook helpers for static export.
 * Webhook URLs come from NEXT_PUBLIC_* at build time (visible in client JS).
 * Access env vars as static process.env.NEXT_PUBLIC_* keys so Next can inline them.
 */

const EMBED_COLOR = 0xc65d2e; // burnt orange

export type DeptId = "police" | "ems" | "fire";

export type DiscordWebhookPayload = {
  content?: string;
  embeds?: DiscordEmbed[];
};

export type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: string;
};

export async function postWebhook(
  url: string,
  payload: DiscordWebhookPayload
): Promise<void> {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error("Webhook URL missing");
  }

  const res = await fetch(trimmed, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      body
        ? `Discord webhook failed (${res.status}): ${body.slice(0, 120)}`
        : `Discord webhook failed (${res.status})`
    );
  }
}

export function webhookForDepartment(id: DeptId): string | undefined {
  const map: Record<DeptId, string | undefined> = {
    police: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_POLICE?.trim() || undefined,
    ems: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_EMS?.trim() || undefined,
    fire: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_FIRE?.trim() || undefined,
  };
  return map[id];
}

export function webhookForAppeal(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_BAN_APPEALS?.trim() || undefined
  );
}

const deptTitles: Record<DeptId, string> = {
  police: "Police application",
  ems: "EMS application",
  fire: "Fire application",
};

function field(name: string, value: string, inline = false) {
  const trimmed = value.trim() || "—";
  return {
    name,
    value: trimmed.length > 1024 ? `${trimmed.slice(0, 1020)}…` : trimmed,
    inline,
  };
}

export function buildDeptAppEmbed(input: {
  departmentId: DeptId;
  name: string;
  discord: string;
  whyJoin: string;
  experience: string;
}): DiscordEmbed {
  return {
    title: deptTitles[input.departmentId],
    color: EMBED_COLOR,
    fields: [
      field("Character", input.name, true),
      field("Discord", input.discord, true),
      field("Department", input.departmentId.toUpperCase(), true),
      field("Why join", input.whyJoin),
      field("Experience", input.experience || "—"),
    ],
    footer: { text: "PURP Companion" },
    timestamp: new Date().toISOString(),
  };
}

export function buildAppealEmbed(input: {
  discordId: string;
  reason: string;
  whatHappened: string;
  evidence: string;
}): DiscordEmbed {
  return {
    title: "Ban appeal",
    color: EMBED_COLOR,
    fields: [
      field("Discord ID", input.discordId, true),
      field("Ban reason", input.reason, true),
      field("What happened", input.whatHappened),
      field("Evidence", input.evidence || "—"),
    ],
    footer: { text: "PURP Companion" },
    timestamp: new Date().toISOString(),
  };
}

export async function submitDepartmentToDiscord(input: {
  departmentId: DeptId;
  name: string;
  discord: string;
  whyJoin: string;
  experience: string;
}): Promise<void> {
  const url = webhookForDepartment(input.departmentId);
  if (!url) {
    throw new Error("Discord webhook not set for this department");
  }
  await postWebhook(url, {
    embeds: [buildDeptAppEmbed(input)],
  });
}

export async function submitAppealToDiscord(input: {
  discordId: string;
  reason: string;
  whatHappened: string;
  evidence: string;
}): Promise<void> {
  const url = webhookForAppeal();
  if (!url) {
    throw new Error("Ban appeal webhook not set");
  }
  await postWebhook(url, {
    embeds: [buildAppealEmbed(input)],
  });
}
