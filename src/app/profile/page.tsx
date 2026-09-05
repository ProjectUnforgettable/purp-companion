"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Briefcase,
  Clock3,
  Landmark,
  Link2,
  Lock,
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
import { DISCORD_ID_STORAGE_KEY } from "@/lib/api-config";
import { apiPlaceholders } from "@/lib/mock-data";
import { useMockStore } from "@/lib/mock-store";
import {
  fetchLivePlayer,
  type LivePlayer,
  type PlayerLookupResult,
} from "@/lib/purp-api";

const snapshotIcons = {
  phone: Phone,
  bank: Landmark,
  inventory: Package,
} as const;

function readStoredDiscordId() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(DISCORD_ID_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function num(v: unknown, fallback = 0) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function str(v: unknown, fallback = "—") {
  return typeof v === "string" && v.trim() ? v : fallback;
}

export default function ProfilePage() {
  const { profile, unlockedDemo, setUnlockedDemo } = useMockStore();
  const [discordId, setDiscordId] = useState("");
  const [lookup, setLookup] = useState<PlayerLookupResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = readStoredDiscordId();
    setDiscordId(id);
    setHydrated(true);
  }, []);

  const runLookup = useCallback(async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) {
      setLookup({
        ok: false,
        reason: "empty",
        message: "Paste a Discord ID to peek at who’s online.",
      });
      return;
    }
    setBusy(true);
    const result = await fetchLivePlayer({ discordId: trimmed });
    setLookup(result);
    setBusy(false);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = discordId.trim();
    if (!id) return;
    void runLookup(id);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps -- one-shot hydrate lookup

  const onSaveAndLookup = () => {
    const trimmed = discordId.trim();
    try {
      if (trimmed) localStorage.setItem(DISCORD_ID_STORAGE_KEY, trimmed);
      else localStorage.removeItem(DISCORD_ID_STORAGE_KEY);
    } catch {
      /* ignore quota */
    }
    void runLookup(trimmed);
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

  const showMockSheet = !livePlayer && !offline;

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Live player peek + demo character sheet"
      />
      <div className="space-y-5 px-4 py-4">
        <section className="animate-fade-up purp-card space-y-3 p-4">
          <div>
            <p className="text-sm font-medium text-white">Discord ID lookup</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Hits the smoke box for whoever’s online right now. Saved on this
              phone.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="e.g. 123456789012345678"
              inputMode="numeric"
              className="h-11 flex-1 rounded-xl border-white/10 bg-black/30 font-mono text-sm"
              aria-label="Discord ID"
            />
            <Button
              type="button"
              onClick={onSaveAndLookup}
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
          {lookupError ? (
            <p className="text-xs text-amber-300/90">{lookupError}</p>
          ) : null}
          {lookup?.ok === true ? (
            <p className="text-xs text-emerald-300/90">Live from the smoke box.</p>
          ) : null}
        </section>

        {offline ? (
          <EmptyState
            title="Player not online"
            description="That Discord ID isn’t on the smoke box right now (404). Hop in-game and try again."
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
                    @{str(livePlayer.discordHandle, "discord")}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-zinc-600">
                    {str(livePlayer.discordId, discordId.trim())}
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
                  <p className="text-xs text-zinc-500">Desk / post</p>
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
            <p className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2.5 text-xs leading-relaxed text-orange-100/90">
              No live player pinned yet — here’s a demo sheet so you can poke
              around. Paste a Discord ID above when someone’s on the box.
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
                <p className="text-xs text-zinc-400">Not wall-clock</p>
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
              <SectionLabel>Character sheet</SectionLabel>
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
              <SectionLabel>Job / shift board</SectionLabel>
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
                  <p className="text-xs text-zinc-500">Desk / post</p>
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
              <SectionLabel>Department unlock</SectionLabel>
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
                Police / EMS / Fire apps open after {required} hours{" "}
                <strong className="font-medium text-zinc-400">in-game</strong>.
                Staff hands out roles after review — nobody self-assigns.
              </p>
            </section>
          </>
        ) : null}

        {!offline ? (
          <section>
            <SectionLabel>Snapshots</SectionLabel>
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
            Live sheet hidden until they’re online again.
          </div>
        )}

        {showMockSheet ? (
          <section className="purp-card flex items-center justify-between gap-3 p-4">
            <div>
              <Label htmlFor="unlock-demo" className="text-sm text-white">
                Demo: unlock applications
              </Label>
              <p className="mt-0.5 text-xs text-zinc-500">
                Flip mock playtime between{" "}
                {unlockedDemo ? "7.5h" : "14.2h"} to preview locked vs unlocked.
              </p>
            </div>
            <Switch
              id="unlock-demo"
              checked={unlockedDemo}
              onCheckedChange={setUnlockedDemo}
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}
