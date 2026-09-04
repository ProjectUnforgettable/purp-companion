"use client";

import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  FileWarning,
  Info,
  MessageCircle,
  Newspaper,
  Palette,
  Shield,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionLabel } from "@/components/ui-helpers";
import { SERVER } from "@/lib/mock-data";

const links = [
  {
    href: "/departments",
    label: "Departments & applications",
    description: "Police, EMS, Fire — 10h unlock",
    icon: Shield,
  },
  {
    href: "/appeals",
    label: "Ban appeals",
    description: "Submit a mock appeal form",
    icon: FileWarning,
  },
  {
    href: "/announcements",
    label: "Announcements",
    description: "Changelog and server news",
    icon: Newspaper,
  },
] as const;

export default function MorePage() {
  return (
    <div>
      <PageHeader title="More" subtitle="Settings & links" />
      <div className="space-y-5 px-4 py-4">
        <section>
          <SectionLabel>Shortcuts</SectionLabel>
          <div className="purp-card divide-y divide-white/5 overflow-hidden">
            {links.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="purp-press flex items-center gap-3 px-4 py-3.5"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-white">{label}</span>
                  <span className="block text-xs text-zinc-500">
                    {description}
                  </span>
                </span>
                <ChevronRight className="size-4 text-zinc-600" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Community</SectionLabel>
          <a
            href={SERVER.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="purp-card purp-press flex items-center gap-3 p-4"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <MessageCircle className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-white">
                Open Discord
              </span>
              <span className="block text-xs text-zinc-500">
                Placeholder invite — {SERVER.discordNote}
              </span>
            </span>
            <ExternalLink className="size-4 text-zinc-600" />
          </a>
        </section>

        <section>
          <SectionLabel>Appearance</SectionLabel>
          <div className="purp-card flex items-start gap-3 p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300">
              <Palette className="size-5" />
            </span>
            <div>
              <p className="font-medium text-white">Dark premium theme</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                PURP ships dark-only for this prototype — deep purple / black
                accents matched to the Project Unforgettable brand. Light mode
                can be added later if needed.
              </p>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel>About</SectionLabel>
          <div className="purp-card space-y-3 p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Info className="size-5" />
              </span>
              <div>
                <p className="font-heading text-lg font-semibold text-white">
                  PURP
                </p>
                <p className="text-sm text-violet-300/90">
                  {SERVER.fullName}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  A mobile-first companion for players — status, rules, join
                  guide, profile, department apps, and appeals. Built as a web
                  prototype intended for a future Capacitor wrap on iOS and
                  Android.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5 text-xs leading-relaxed text-violet-100/90">
              <strong className="font-semibold">Demo mode:</strong> all player,
              economy, and status data is mocked until this app is wired to
              FXServer status APIs and Discord bots.
            </div>
            <p className="text-center text-[11px] text-zinc-600">
              Companion prototype · v0.1.0 · no secrets embedded
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
