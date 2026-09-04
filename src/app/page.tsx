"use client";

import Link from "next/link";
import {
  Building2,
  Clock3,
  ExternalLink,
  Gavel,
  MessageCircle,
  Radio,
  Shield,
  Siren,
  Users,
} from "lucide-react";
import { SERVER, serverStatus } from "@/lib/mock-data";
import {
  StatusDot,
  SectionLabel,
  formatRelativeDate,
  formatUptime,
} from "@/components/ui-helpers";
const jobRows = [
  {
    key: "police",
    label: "Police",
    count: serverStatus.jobs.police,
    icon: Shield,
    tint: "text-sky-300 bg-sky-500/10",
  },
  {
    key: "ems",
    label: "EMS",
    count: serverStatus.jobs.ems,
    icon: Siren,
    tint: "text-rose-300 bg-rose-500/10",
  },
  {
    key: "fire",
    label: "Fire",
    count: serverStatus.jobs.fire,
    icon: Building2,
    tint: "text-orange-300 bg-orange-500/10",
  },
  {
    key: "civilians",
    label: "Civilians",
    count: serverStatus.jobs.civilians,
    icon: Users,
    tint: "text-violet-300 bg-violet-500/10",
  },
] as const;

export default function HomePage() {
  const { online, playersOnline, maxPlayers, queue, uptimeHours, lastRestart } =
    serverStatus;

  return (
    <div className="px-4 pt-4 pb-6">
      <section className="animate-fade-up mb-6 text-center">
        <p className="font-heading text-5xl font-bold tracking-tight text-white">
          PURP
        </p>
        <p className="mt-1 text-sm text-violet-300/90">{SERVER.fullName}</p>
        <p className="mt-2 text-xs text-zinc-500">{SERVER.tagline}</p>
      </section>

      <section className="animate-fade-up-delay-1 purp-card mb-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium">
              <StatusDot online={online} />
              <span className={online ? "text-emerald-300" : "text-zinc-400"}>
                {online ? "Online" : "Offline"}
              </span>
            </div>
            <p className="font-heading text-3xl font-semibold tracking-tight text-white">
              {playersOnline}
              <span className="text-lg text-zinc-500">/{maxPlayers}</span>
            </p>
            <p className="mt-0.5 text-sm text-zinc-400">Players online</p>
          </div>
          <div className="rounded-xl bg-violet-500/10 px-3 py-2 text-right">
            <p className="text-[11px] tracking-wide text-violet-300/80 uppercase">
              Queue
            </p>
            <p className="font-heading text-xl font-semibold text-violet-200">
              {queue > 0 ? queue : "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-sm">
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock3 className="size-4 text-violet-300" />
            <div>
              <p className="text-[11px] text-zinc-500">Uptime</p>
              <p className="font-medium">{formatUptime(uptimeHours)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-zinc-500">Last restart</p>
            <p className="font-medium text-zinc-300">
              {formatRelativeDate(lastRestart)}
            </p>
          </div>
        </div>
      </section>

      <section className="animate-fade-up-delay-2 mb-5">
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
        <SectionLabel>Quick actions</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/join"
            className="purp-press flex flex-col items-center gap-1.5 rounded-2xl border border-violet-400/30 bg-violet-600/90 py-3 text-white hover:bg-violet-500"
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
            <span className="text-xs font-medium">Discord</span>
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
        <SectionLabel>Explore</SectionLabel>
        <div className="space-y-2">
          <Link
            href="/departments"
            className="purp-card purp-press flex items-center justify-between p-4"
          >
            <div>
              <p className="font-medium text-white">Departments</p>
              <p className="text-xs text-zinc-500">
                Police · EMS · Fire applications
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
              <p className="text-xs text-zinc-500">News & patch notes</p>
            </div>
            <ExternalLink className="size-4 text-zinc-500" />
          </Link>
          <Link
            href="/appeals"
            className="purp-card purp-press flex items-center justify-between p-4"
          >
            <div>
              <p className="font-medium text-white">Ban appeals</p>
              <p className="text-xs text-zinc-500">Submit a mock appeal</p>
            </div>
            <ExternalLink className="size-4 text-zinc-500" />
          </Link>
        </div>
      </section>
    </div>
  );
}
