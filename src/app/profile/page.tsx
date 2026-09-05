"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Briefcase,
  ChevronDown,
  Clock3,
  Landmark,
  Link2,
  Lock,
  LogIn,
  LogOut,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRoundX,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState, SectionLabel, formatCurrency } from "@/components/ui-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DISCORD_LOGIN_URL } from "@/lib/api-config";
import { apiPlaceholders } from "@/lib/mock-data";
import { useMockStore } from "@/lib/mock-store";
import {
  fetchLivePlayer,
  type LivePlayer,
  type PlayerLookupResult,
} from "@/lib/purp-api";
import {
  clearSession,
  cleanAuthParamsFromUrl,
  readAuthCallbackParams,
  readSession,
  sessionAvatarUrl,
  writeSession,
  type PurpSession,
} from "@/lib/session";

const snapshotIcons = {
  phone: Phone,
  bank: Landmark,
  inventory: Package,
} as const;

function num(v: unknown, fallback = 0) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function str(v: unknown, fallback = "—") {
  return typeof v === "string" && v.trim() ? v : fallback;
}

function displayHandle(session: PurpSession) {
  const name = session.username?.replace(/^@/, "").trim();
  return name ? `@${name}` : "Discord account";
}

export default function ProfilePage() {
  const { profile, unlockedDemo, setUnlockedDemo } = useMockStore();
  const [session, setSession] = useState<PurpSession | null>(null);
  const [lookup, setLookup] = useState<PlayerLookupResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupId, setLookupId] = useState("");

  const runLookup = useCallback(async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) {
      setLookup({
        ok: false,
        reason: "empty",
        message: "Need a Discord ID.",
      });
      return;
    }
    setBusy(true);
    const result = await fetchLivePlayer({ discordId: trimmed });
    setLookup(result);
    setBusy(false);
  }, []);

  useEffect(() => {
    const fromCallback = readAuthCallbackParams();
    if (fromCallback) {
      writeSession(fromCallback);
      cleanAuthParamsFromUrl();
      setSession(fromCallback);
      setLookupId(fromCallback.discordId);
    } else {
      const existing = readSession();
      setSession(existing);
      if (existing) setLookupId(existing.discordId);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !session?.discordId) return;
    void runLookup(session.discordId);
  }, [hydrated, session?.discordId, runLookup]);

  const onLogout = () => {
    clearSession();
    setSession(null);
    setLookup(null);
    setLookupId("");
  };

  const onAdvancedLookup = () => {
    void runLookup(lookupId);
  };

  const livePlayer: LivePlayer | null =
    lookup?.ok === true ? lookup.player : null;
  const offline = lookup?.ok === false && lookup.reason === "not_online";
  const lookupError =
    lookup?.ok === false && lookup.reason === "error" ? lookup.message : null;

  const required = profile.departmentHoursRequired;
  const progress = Math.min(100, (profile.playtimeHours / required) * 100);
  const unlocked = profile.playtimeHours >= required;
  const { shift, characterSheet } = profile;

  const signedIn = Boolean(session?.discordId);
  const avatarUrl = session ? sessionAvatarUrl(session) : undefined;
  // Show example sheet only when signed out (not looking anyone up as self)
  const showMockSheet = !signedIn && !livePlayer && !offline;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your account" />
      <div className="space-y-5 px-4 py-4">
        <section className="animate-fade-up purp-card space-y-3 p-4">
          {!hydrated ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : signedIn && session ? (
            <>
              <div className="flex items-start gap-3">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-14 rounded-2xl object-cover shadow-lg shadow-orange-950/40"
                    width={56}
                    height={56}
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-800 font-heading text-xl font-bold text-white shadow-lg shadow-indigo-950/40">
                    {(session.username || "D")[0]!.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500">Signed in as</p>
                  <p className="truncate font-heading text-lg font-semibold text-white">
                    {displayHandle(session)}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-zinc-600">
                    {session.discordId}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onLogout}
                  className="h-10 rounded-xl border-white/10 bg-black/20 text-zinc-200 hover:bg-white/5"
                >
                  <LogOut className="size-4" />
                  Log out
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => void runLookup(session.discordId)}
                  className="h-10 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                >
                  {busy ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="size-4" />
                  )}
                  Refresh
                </Button>
              </div>
              {lookupError ? (
                <p className="text-xs text-amber-300/90">{lookupError}</p>
              ) : null}
              {lookup?.ok === true ? (
                <p className="text-xs text-emerald-300/90">You’re online on the server.</p>
              ) : null}
              {offline ? (
                <p className="text-xs text-zinc-500">
                  Not in-game right now. Jump on PURP and we’ll show your sheet.
                </p>
              ) : null}
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-white">Your PURP account</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Log in with Discord. We’ll remember you on this device.
                </p>
              </div>
              <a
                href={DISCORD_LOGIN_URL}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-4 text-sm font-medium text-white hover:bg-[#4752C4]"
              >
                <LogIn className="size-4" />
                Log in with Discord
              </a>
              <p className="text-[11px] text-zinc-600">
                Opens Discord sign-in. You’ll land back here when it’s ready.
              </p>
            </>
          )}
        </section>

        {signedIn && offline ? (
          <EmptyState
            title="Not in-game"
            description="Come online on PURP to see cash, job, and playtime."
          />
        ) : null}

        {livePlayer ? (
          <>
            <section className="purp-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-800 font-heading text-xl font-bold text-white shadow-lg shadow-orange-950/50">
                  {str(livePlayer.characterName, "??")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading truncate text-xl font-semibold text-white">
                    {str(livePlayer.characterName, "Unknown character")}
                  </h2>
                  <p className="truncate text-sm text-zinc-400">
                    @{str(livePlayer.discordHandle, session?.username || "discord")}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-zinc-600">
                    {str(livePlayer.discordId, session?.discordId || "")}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-2">
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-300">
                  <Briefcase className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">Job</p>
                <p className="font-medium text-white">
                  {str(livePlayer.job, "—")}
                </p>
                <p className="text-xs text-zinc-400">
                  {str(livePlayer.rank, "")}
                </p>
              </div>
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <Clock3 className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">In-game playtime</p>
                <p className="font-heading text-xl font-semibold text-white">
                  {num(livePlayer.playtimeHours).toFixed(1)}h
                </p>
              </div>
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
                  <Wallet className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">Cash</p>
                <p className="font-medium text-white">
                  {formatCurrency(num(livePlayer.cash))}
                </p>
              </div>
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <Wallet className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">Bank</p>
                <p className="font-medium text-white">
                  {formatCurrency(num(livePlayer.bank))}
                </p>
              </div>
            </section>

            <section className="purp-card p-4">
              <SectionLabel>Shift board</SectionLabel>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={
                    livePlayer.onDuty
                      ? "rounded-full bg-emerald-500/15 text-emerald-300"
                      : "rounded-full bg-zinc-500/20 text-zinc-300"
                  }
                >
                  {livePlayer.onDuty ? "On duty" : "Off duty"}
                </Badge>
                <span className="text-xs text-zinc-500">
                  {str(livePlayer.payGrade, "")}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Post</p>
                  <p className="text-zinc-200">{str(livePlayer.desk)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Pay</p>
                  <p className="text-zinc-200">
                    {num(livePlayer.hourlyPay) > 0
                      ? `${formatCurrency(num(livePlayer.hourlyPay))}/hr`
                      : "—"}
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : null}

        {showMockSheet ? (
          <>
            <p className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2.5 text-xs text-orange-100/90">
              Example sheet — log in to see yours when you’re online.
            </p>

            <section className="animate-fade-up purp-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-800 font-heading text-xl font-bold text-white shadow-lg shadow-orange-950/50">
                  {profile.characterName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading truncate text-xl font-semibold text-white">
                    {profile.characterName}
                  </h2>
                  <p className="truncate text-sm text-zinc-400">
                    @{profile.discordHandle}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profile.discordLinked ? (
                      <Badge className="gap-1 rounded-full border border-indigo-400/20 bg-indigo-500/15 text-indigo-200">
                        <Link2 className="size-3" />
                        Discord linked
                      </Badge>
                    ) : null}
                    {profile.whitelisted ? (
                      <Badge className="gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/15 text-emerald-200">
                        <ShieldCheck className="size-3" />
                        Whitelisted
                      </Badge>
                    ) : null}
                    {profile.verified ? (
                      <Badge className="gap-1 rounded-full border border-orange-400/20 bg-orange-500/15 text-orange-200">
                        <BadgeCheck className="size-3" />
                        Verified
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="animate-fade-up-delay-1 grid grid-cols-2 gap-2">
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-300">
                  <Briefcase className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">Job</p>
                <p className="font-medium text-white">{profile.job}</p>
                <p className="text-xs text-zinc-400">{profile.rank}</p>
              </div>
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <Clock3 className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">In-game playtime</p>
                <p className="font-heading text-xl font-semibold text-white">
                  {profile.playtimeHours.toFixed(1)}h
                </p>
                <p className="text-xs text-zinc-400">In-game hours</p>
              </div>
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
                  <Wallet className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">Cash</p>
                <p className="font-medium text-white">
                  {formatCurrency(profile.cash)}
                </p>
              </div>
              <div className="purp-card p-3">
                <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <Wallet className="size-4" />
                </div>
                <p className="text-xs text-zinc-500">Bank</p>
                <p className="font-medium text-white">
                  {formatCurrency(profile.bank)}
                </p>
              </div>
            </section>

            <section className="purp-card p-4">
              <SectionLabel>Sheet</SectionLabel>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-zinc-500">DOB</dt>
                  <dd className="text-zinc-200">{characterSheet.dob}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Nationality</dt>
                  <dd className="text-zinc-200">{characterSheet.nationality}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Phone</dt>
                  <dd className="font-mono text-zinc-200">
                    {characterSheet.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Licenses</dt>
                  <dd className="text-zinc-200">
                    {characterSheet.licenses.join(", ")}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="purp-card p-4">
              <SectionLabel>Shift</SectionLabel>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={
                    shift.onDuty
                      ? "rounded-full bg-emerald-500/15 text-emerald-300"
                      : "rounded-full bg-zinc-500/20 text-zinc-300"
                  }
                >
                  {shift.onDuty ? "On duty" : "Off duty"}
                </Badge>
                <span className="text-xs text-zinc-500">{shift.payGrade}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Post</p>
                  <p className="text-zinc-200">{shift.desk}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Pay</p>
                  <p className="text-zinc-200">
                    {shift.hourlyPay > 0
                      ? `${formatCurrency(shift.hourlyPay)}/hr`
                      : "—"}
                  </p>
                </div>
              </div>
            </section>

            <section className="animate-fade-up-delay-2 purp-card p-4">
              <SectionLabel>Dept unlock</SectionLabel>
              <div className="mb-2 flex items-end justify-between gap-2">
                <p className="text-sm text-zinc-300">
                  {profile.playtimeHours.toFixed(1)} / {required} in-game hours
                </p>
                <p
                  className={`text-xs font-semibold ${
                    unlocked ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {unlocked ? "Unlocked" : "Locked"}
                </p>
              </div>
              <Progress value={progress} className="h-2.5" />
              <p className="mt-2 text-xs text-zinc-500">
                Need {required}h in-game. Staff assigns after review.
              </p>
            </section>
          </>
        ) : null}

        {!offline || !signedIn ? (
          <section>
            <SectionLabel>More</SectionLabel>
            <div className="space-y-2">
              {apiPlaceholders.map((item) => {
                const Icon = snapshotIcons[item.id];
                return (
                  <div
                    key={item.id}
                    className="purp-card flex items-start gap-3 p-4 opacity-90"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{item.title}</p>
                        <Lock className="size-3.5 text-zinc-600" />
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-500">{item.blurb}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-zinc-600">
            <UserRoundX className="size-3.5" />
            Not in-game.
          </div>
        )}

        {showMockSheet ? (
          <section className="purp-card flex items-center justify-between gap-3 p-4">
            <div>
              <Label htmlFor="unlock-demo" className="text-sm text-white">
                Test 10h
              </Label>
              <p className="mt-0.5 text-xs text-zinc-500">
                Toggle {unlockedDemo ? "7.5h" : "14.2h"}.
              </p>
            </div>
            <Switch
              id="unlock-demo"
              checked={unlockedDemo}
              onCheckedChange={setUnlockedDemo}
            />
          </section>
        ) : null}

        <section className="purp-card overflow-hidden">
          <button
            type="button"
            onClick={() => setLookupOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
            aria-expanded={lookupOpen}
          >
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Lookup another player
              </p>
              <p className="text-[11px] text-zinc-600">Advanced — paste a Discord ID</p>
            </div>
            <ChevronDown
              className={`size-4 shrink-0 text-zinc-500 transition-transform ${
                lookupOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {lookupOpen ? (
            <div className="space-y-3 border-t border-white/5 px-4 py-3">
              <div className="flex gap-2">
                <Input
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="e.g. 123456789012345678"
                  inputMode="numeric"
                  className="h-11 flex-1 rounded-xl border-white/10 bg-black/30 font-mono text-sm"
                  aria-label="Discord ID to look up"
                />
                <Button
                  type="button"
                  onClick={onAdvancedLookup}
                  disabled={busy}
                  className="h-11 shrink-0 rounded-xl bg-orange-600 px-4 text-white hover:bg-orange-500"
                >
                  {busy ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  Look up
                </Button>
              </div>
              <p className="text-[11px] text-zinc-600">
                Doesn’t change who’s signed in. Just peeks at who’s online.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
