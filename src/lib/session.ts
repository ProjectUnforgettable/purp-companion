/**
 * Client-side Discord session for static companion (localStorage).
 * Backend OAuth should redirect to /profile with discordId (+ optional username/avatar).
 */

export const SESSION_STORAGE_KEY = "purp.session";

/** Legacy key from Discord-ID lookup UI — still read for migration / advanced lookup. */
export const DISCORD_ID_STORAGE_KEY = "purp.discordId";

export type PurpSession = {
  discordId: string;
  username?: string;
  avatar?: string;
};

function discordAvatarUrl(discordId: string, avatar?: string): string | undefined {
  if (!avatar?.trim()) return undefined;
  const a = avatar.trim();
  if (a.startsWith("http://") || a.startsWith("https://")) return a;
  // Discord avatar hash
  return `https://cdn.discordapp.com/avatars/${discordId}/${a}.png?size=128`;
}

export function sessionAvatarUrl(session: PurpSession): string | undefined {
  return discordAvatarUrl(session.discordId, session.avatar);
}

export function readSession(): PurpSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PurpSession>;
      const discordId =
        typeof parsed.discordId === "string" ? parsed.discordId.trim() : "";
      if (discordId) {
        return {
          discordId,
          username:
            typeof parsed.username === "string" && parsed.username.trim()
              ? parsed.username.trim()
              : undefined,
          avatar:
            typeof parsed.avatar === "string" && parsed.avatar.trim()
              ? parsed.avatar.trim()
              : undefined,
        };
      }
    }
  } catch {
    /* ignore */
  }
  // Migrate legacy ID-only storage into a thin session
  try {
    const legacy = localStorage.getItem(DISCORD_ID_STORAGE_KEY)?.trim();
    if (legacy) {
      const migrated: PurpSession = { discordId: legacy };
      writeSession(migrated);
      return migrated;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeSession(session: PurpSession): void {
  if (typeof window === "undefined") return;
  const discordId = session.discordId.trim();
  if (!discordId) return;
  const payload: PurpSession = {
    discordId,
    ...(session.username?.trim()
      ? { username: session.username.trim() }
      : {}),
    ...(session.avatar?.trim() ? { avatar: session.avatar.trim() } : {}),
  };
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(DISCORD_ID_STORAGE_KEY, discordId);
  } catch {
    /* ignore quota */
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(DISCORD_ID_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function pickParam(
  from: URLSearchParams,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const v = from.get(key);
    if (v?.trim()) return v.trim();
  }
  return undefined;
}

/**
 * Read OAuth callback params from query and/or hash fragment.
 * Supports login=1 (or truthy) with discordId; username/avatar optional.
 */
export function readAuthCallbackParams(
  search = typeof window !== "undefined" ? window.location.search : "",
  hash = typeof window !== "undefined" ? window.location.hash : ""
): PurpSession | null {
  const query = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search
  );
  const hashRaw = hash.startsWith("#") ? hash.slice(1) : hash;
  const frag = new URLSearchParams(
    hashRaw.includes("=") ? hashRaw.replace(/^\/?/, "") : ""
  );

  const discordId =
    pickParam(query, "discordId", "discord_id", "id") ||
    pickParam(frag, "discordId", "discord_id", "id");
  if (!discordId) return null;

  const loginFlag =
    pickParam(query, "login") || pickParam(frag, "login") || "";
  const username =
    pickParam(query, "username", "user", "name") ||
    pickParam(frag, "username", "user", "name");
  const avatar =
    pickParam(query, "avatar", "avatarUrl", "avatar_url") ||
    pickParam(frag, "avatar", "avatarUrl", "avatar_url");

  // Expect login=1 from OAuth; also accept username/avatar-bearing callbacks
  // if the backend omits the flag.
  const looksLikeLogin =
    loginFlag === "1" ||
    loginFlag.toLowerCase() === "true" ||
    Boolean(username) ||
    Boolean(avatar);

  if (!looksLikeLogin) return null;

  return {
    discordId,
    ...(username ? { username } : {}),
    ...(avatar ? { avatar } : {}),
  };
}

/** Drop auth query/hash from the address bar without a navigation. */
export function cleanAuthParamsFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const strip = [
      "discordId",
      "discord_id",
      "id",
      "username",
      "user",
      "name",
      "avatar",
      "avatarUrl",
      "avatar_url",
      "login",
    ];
    let changed = false;
    for (const key of strip) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }
    if (url.hash && /discordId|login=|avatar|username/i.test(url.hash)) {
      url.hash = "";
      changed = true;
    }
    if (changed) {
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  } catch {
    /* ignore */
  }
}
