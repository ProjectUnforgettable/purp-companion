import { PURP_API_BASE } from "@/lib/api-config";
import {
  serverStatus as mockServerStatus,
  type HeatLevel,
  type ServerStatus,
} from "@/lib/mock-data";

/** Raw /api/status — documented + observed smoke-box field names */
export type LiveStatusRaw = Record<string, unknown>;

export type LivePlayer = {
  characterName?: string;
  discordHandle?: string;
  discordId?: string;
  playtimeHours?: number;
  job?: string;
  rank?: string;
  cash?: number;
  bank?: number;
  onDuty?: boolean;
  desk?: string;
  payGrade?: string;
  hourlyPay?: number;
  [key: string]: unknown;
};

export type PlayerLookupResult =
  | { ok: true; player: LivePlayer; source: "live" }
  | { ok: false; reason: "not_online" | "error" | "empty"; message: string };

export type NormalizedStatus = ServerStatus & {
  heatPct: number;
  source: "live" | "mock";
  fetchedAt: string;
};

function heatFromNumber(n: number): {
  heat: HeatLevel;
  heatLabel: string;
  heatPct: number;
} {
  const clamped = Math.max(0, Math.min(1, n));
  const heatPct = Math.round(clamped * 100);
  if (clamped < 0.25) {
    return { heat: "low", heatLabel: `Low heat (${heatPct}%)`, heatPct };
  }
  if (clamped < 0.5) {
    return {
      heat: "moderate",
      heatLabel: `Moderate heat (${heatPct}%)`,
      heatPct,
    };
  }
  if (clamped < 0.75) {
    return { heat: "high", heatLabel: `High heat (${heatPct}%)`, heatPct };
  }
  return {
    heat: "critical",
    heatLabel: `Street heat burning (${heatPct}%)`,
    heatPct,
  };
}

function heatFromUnknown(value: unknown): {
  heat: HeatLevel;
  heatLabel: string;
  heatPct: number;
} {
  if (typeof value === "number" && Number.isFinite(value)) {
    return heatFromNumber(value);
  }
  if (typeof value === "string") {
    const asNum = Number(value);
    if (Number.isFinite(asNum)) return heatFromNumber(asNum);
    const key = value.toLowerCase() as HeatLevel;
    if (
      key === "low" ||
      key === "moderate" ||
      key === "high" ||
      key === "critical"
    ) {
      const pct = { low: 15, moderate: 40, high: 65, critical: 100 }[key];
      return {
        heat: key,
        heatLabel: `${key[0]!.toUpperCase()}${key.slice(1)} heat (${pct}%)`,
        heatPct: pct,
      };
    }
  }
  return { heat: "moderate", heatLabel: "Heat unknown", heatPct: 0 };
}

function pickNum(obj: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return 0;
}

function pickStr(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

function pickBool(
  obj: Record<string, unknown>,
  ...keys: string[]
): boolean | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "boolean") return v;
  }
  return undefined;
}

export function normalizeStatus(
  rawIn: LiveStatusRaw,
  source: "live" | "mock" = "live"
): NormalizedStatus {
  const raw = rawIn;
  const jobsRaw =
    raw.jobs && typeof raw.jobs === "object"
      ? (raw.jobs as Record<string, unknown>)
      : {};

  const playersOnline = pickNum(raw, "playersOnline", "players", "playerCount");
  const maxPlayers = pickNum(raw, "maxPlayers", "max", "slots") || 48;
  const queue = pickNum(raw, "queue", "queueCount");
  const uptimeHours = pickNum(raw, "uptimeHours", "uptime");
  const lastRestart =
    pickStr(raw, "lastRestart", "restartedAt") || new Date().toISOString();
  const staffingNote =
    pickStr(raw, "staffingNote", "staffing") ||
    "No staffing note.";
  const { heat, heatLabel, heatPct } = heatFromUnknown(raw.heat);
  const jobs = {
    police: pickNum(jobsRaw, "police"),
    ems: pickNum(jobsRaw, "ems"),
    fire: pickNum(jobsRaw, "fire"),
    civilians: pickNum(jobsRaw, "civilians"),
  };
  const online = pickBool(raw, "online") ?? true;

  const feedCandidate = raw.statusFeed ?? raw.feed;
  const statusFeed =
    Array.isArray(feedCandidate) && feedCandidate.length > 0
      ? feedCandidate.map((line, i) => {
          const row = (line ?? {}) as Record<string, unknown>;
          return {
            id: String(row.id ?? `live-${i}`),
            text: String(row.text ?? ""),
            at: String(row.at ?? lastRestart),
          };
        })
      : [
          {
            id: "live-1",
            text: `${playersOnline}/${maxPlayers} online · queue ${queue} · heat ${heatPct}%`,
            at: new Date().toISOString(),
          },
          {
            id: "live-2",
            text: `On shift — Police ${jobs.police} · EMS ${jobs.ems} · Fire ${jobs.fire} · Civ ${jobs.civilians}`,
            at: new Date().toISOString(),
          },
          {
            id: "live-3",
            text: staffingNote,
            at: new Date().toISOString(),
          },
        ];

  return {
    online,
    playersOnline,
    maxPlayers,
    queue,
    uptimeHours,
    lastRestart,
    heat,
    heatLabel,
    staffingNote,
    jobs,
    statusFeed,
    heatPct,
    source,
    fetchedAt: new Date().toISOString(),
  };
}

function mockFallback(): NormalizedStatus {
  const heatPct =
    mockServerStatus.heat === "critical"
      ? 100
      : mockServerStatus.heat === "high"
        ? 70
        : mockServerStatus.heat === "moderate"
          ? 40
          : 15;
  return {
    ...mockServerStatus,
    heatPct,
    source: "mock",
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchLiveStatus(): Promise<NormalizedStatus> {
  try {
    const res = await fetch(`${PURP_API_BASE}/api/status`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("status response was not JSON");
    }
    if (!data || typeof data !== "object") {
      throw new Error("invalid status payload");
    }
    return normalizeStatus(data as LiveStatusRaw, "live");
  } catch {
    return mockFallback();
  }
}

export async function fetchLivePlayer(params: {
  discordId?: string;
  license?: string;
}): Promise<PlayerLookupResult> {
  const q = new URLSearchParams();
  if (params.discordId?.trim()) q.set("discordId", params.discordId.trim());
  if (params.license?.trim()) q.set("license", params.license.trim());
  if (![...q.keys()].length) {
    return {
      ok: false,
      reason: "empty",
      message: "Need a Discord ID.",
    };
  }

  try {
    const res = await fetch(`${PURP_API_BASE}/api/player?${q.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        ok: false,
        reason: "error",
        message: "Bad player response.",
      };
    }

    const err =
      data && typeof data === "object" && "error" in data
        ? String((data as { error?: string }).error ?? "")
        : "";

    if (
      res.status === 404 ||
      err === "player_not_online" ||
      err === "player_not_online"
    ) {
      return {
        ok: false,
        reason: "not_online",
        message: "Not in-game.",
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        reason: "error",
        message: `Player lookup failed (${res.status}).`,
      };
    }

    if (!data || typeof data !== "object") {
      return {
        ok: false,
        reason: "error",
        message: "Unexpected player payload.",
      };
    }

    return { ok: true, player: data as LivePlayer, source: "live" };
  } catch {
    return {
      ok: false,
      reason: "error",
      message: "Can’t reach player API.",
    };
  }
}
