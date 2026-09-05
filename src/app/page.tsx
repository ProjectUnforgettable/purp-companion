"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Clock3,
  ExternalLink,
  Flame,
  Gavel,
  MessageCircle,
  Radio,
  RefreshCw,
  Shield,
  Siren,
  Users,
} from "lucide-react";
import { SERVER } from "@/lib/mock-data";
import { STATUS_POLL_MS } from "@/lib/api-config";
import {
  fetchLiveStatus,
  type NormalizedStatus,
} from "@/lib/purp-api";
import {
  StatusDot,
  SectionLabel,
  formatRelativeDate,
  formatUptime,
} from "@/components/ui-helpers";

const heatStyles = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  moderate: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  high: "bg-orange-500/20 text-orange-200 border-orange-500/30",
  critical: "bg-red-500/20 text-red-300 border-red-500/30",
} as const;

export default function HomePage() {
  const [status, setStatus] = useState<NormalizedStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    const next = await fetchLiveStatus();
    setStatus(next);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load(false);
    const id = window.setInterval(() => {
      void load(true);
    }, STATUS_POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  const s = status;
  const jobRows = [
    {
      key: "police",
      label: "Police",
      count: s?.jobs.police ?? 0,
      icon: Shield,
      tint: "text-sky-300 bg-sky-500/10",
    },
    {
      key: "ems",
      label: "EMS",
      count: s?.jobs.ems ?? 0,
      icon: Siren,
      tint: "text-rose-300 bg-rose-500/10",
    },
    {
      key: "fire",
      label: "Fire",
      count: s?.jobs.fire ?? 0,
      icon: Building2,
      tint: "text-orange-300 bg-orange-500/10",
    },
    {
      key: "civilians",
      label: "Civilians",
      count: s?.jobs.civilians ?? 0,
      icon: Users,
      tint: "text-orange-200/90 bg-orange-500/10",
    },
  ] as const;

  return (
    <div className="px-4 pt-4 pb-6">
      <section className="animate-fade-up mb-6 text-center">
        <p className="font-heading text-5xl font-bold tracking-tight text-white">
          PURP
        </p>
        <p className="mt-1 text-sm text-orange-300/90">{SERVER.fullName}</p>
        <p className="mt-2 text-xs text-zinc-500">{SERVER.tagline}</p>
      </section>

      <section className="animate-fade-up-delay-1 purp-card mb-4 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
            Status
          </p>
          <button
            type="button"
            onClick={() => void load(true)}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-white/10"
            aria-label="Refresh status"
          >
            <RefreshCw
              className={`size-3 ${refreshing ? "animate-spin" : ""}`}
            />
            {s?.source === "live" ? "Live" : loading ? "…" : "Local"}
          </button>
        </div>

        {loading && !s ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            Loading…
          </p>
        ) : s ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium">
                  <StatusDot online={s.online} />
                  <span
                    className={s.online ? "text-emerald-300" : "text-zinc-400"}
                  >
                    {s.online ? "Online" : "Offline"}
                  </span>
                </div>
                <p className="font-heading text-3xl font-semibold tracking-tight text-white">
                  {s.playersOnline}
                  <span className="text-lg text-zinc-500">/{s.maxPlayers}</span>
                </p>
                <p className="mt-0.5 text-sm text-zinc-400">Players</p>
              </div>
              <div className="space-y-2 text-right">
                <div className="rounded-xl bg-orange-500/10 px-3 py-2">
                  <p className="text-[11px] tracking-wide text-orange-300/80 uppercase">
                    Queue
                  </p>
                  <p className="font-heading text-xl font-semibold text-orange-200">
                    {s.queue > 0 ? s.queue : "—"}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${heatStyles[s.heat]}`}
                >
                  <Flame className="size-3" />
                  {s.heatLabel}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Heat</span>
                <span className="tabular-nums text-orange-300/90">
                  {s.heatPct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-500"
                  style={{ width: `${s.heatPct}%` }}
                />
              </div>
            </div>

            <p className="mt-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-xs text-zinc-400">
              {s.staffingNote}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-sm">
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock3 className="size-4 text-orange-300" />
                <div>
                  <p className="text-[11px] text-zinc-500">Uptime</p>
                  <p className="font-medium">{formatUptime(s.uptimeHours)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-zinc-500">Last restart</p>
                <p className="font-medium text-zinc-300">
                  {formatRelativeDate(s.lastRestart)}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </section>

      <section className="animate-fade-up-delay-2 mb-5">
        <SectionLabel>Feed</SectionLabel>
        <div className="purp-card divide-y divide-white/5 overflow-hidden">
          {(s?.statusFeed ?? []).map((line) => (
            <div key={line.id} className="px-4 py-3">
              <p className="font-mono text-xs leading-relaxed text-zinc-300">
                {line.text}
              </p>
              <p className="mt-1 text-[10px] text-zinc-600">
                {formatRelativeDate(line.at)}
              </p>
            </div>
          ))}
          {!s?.statusFeed?.length && !loading ? (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">
              Nobody online.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mb-5">
        <SectionLabel>On duty</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {jobRows.map(({ key, label, count, icon: Icon, tint }) => (
            <div key={key} className="purp-card flex items-center gap-3 p-3">
              <span
                className={`inline-flex size-10 items-center justify-center rounded-xl ${tint}`}
              >
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="font-heading text-xl font-semibold text-white">
                  {count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="animate-fade-up-delay-3 mb-5">
        <SectionLabel>Actions</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/join"
            className="purp-press flex flex-col items-center gap-1.5 rounded-2xl border border-orange-400/30 bg-orange-600/90 py-3 text-white hover:bg-orange-500"
          >
            <Radio className="size-5" />
            <span className="text-xs font-medium">Connect</span>
          </Link>
          <a
            href={SERVER.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="purp-press flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-3 text-zinc-100 hover:bg-white/10"
          >
            <MessageCircle className="size-5 text-indigo-300" />
            <span className="text-xs font-medium">Open Discord</span>
          </a>
          <Link
            href="/rules"
            className="purp-press flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-3 text-zinc-100 hover:bg-white/10"
          >
            <Gavel className="size-5 text-amber-300" />
            <span className="text-xs font-medium">Rules</span>
          </Link>
        </div>
      </section>

      <section className="mb-2">
        <SectionLabel>More</SectionLabel>
        <div className="space-y-2">
          <Link
            href="/departments"
            className="purp-card purp-press flex items-center justify-between p-4"
          >
            <div>
              <p className="font-medium text-white">Departments</p>
              <p className="text-xs text-zinc-500">
                Police · EMS · Fire — need 10h
              </p>
            </div>
            <ExternalLink className="size-4 text-zinc-500" />
          </Link>
          <Link
            href="/announcements"
            className="purp-card purp-press flex items-center justify-between p-4"
          >
            <div>
              <p className="font-medium text-white">Announcements</p>
              <p className="text-xs text-zinc-500">News</p>
            </div>
            <ExternalLink className="size-4 text-zinc-500" />
          </Link>
          <Link
            href="/appeals"
            className="purp-card purp-press flex items-center justify-between p-4"
          >
            <div>
              <p className="font-medium text-white">Appeals</p>
              <p className="text-xs text-zinc-500">Appeals</p>
            </div>
            <ExternalLink className="size-4 text-zinc-500" />
          </Link>
        </div>
      </section>
    </div>
  );
}
