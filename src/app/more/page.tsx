"use client";

import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  FileWarning,
  Gamepad2,
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
    label: "Departments",
    description: "Police · EMS · Fire — need 10h",
    icon: Shield,
  },
  {
    href: "/appeals",
    label: "Appeals",
    description: "Ban appeals",
    icon: FileWarning,
  },
  {
    href: "/announcements",
    label: "Announcements",
    description: "News",
    icon: Newspaper,
  },
] as const;

export default function MorePage() {
  return (
    <div>
      <PageHeader title="More" subtitle="Links" />
      <div className="space-y-5 px-4 py-4">
        <section>
          <SectionLabel>Menu</SectionLabel>
          <div className="purp-card divide-y divide-white/5 overflow-hidden">
            {links.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="purp-press flex items-center gap-3 px-4 py-3.5"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
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
              <span className="block font-medium text-white">Open Discord</span>
              <span className="block text-xs text-zinc-500">
                {SERVER.discordNote}
              </span>
            </span>
            <ExternalLink className="size-4 text-zinc-600" />
          </a>
        </section>

        <section>
          <SectionLabel>Controllers</SectionLabel>
          <div className="purp-card flex items-start gap-3 p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
              <Gamepad2 className="size-5" />
            </span>
            <div>
              <p className="font-medium text-white">Controllers</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                {SERVER.controllerTip}
              </p>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel>Appearance</SectionLabel>
          <div className="purp-card flex items-start gap-3 p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
              <Palette className="size-5" />
            </span>
            <div>
              <p className="font-medium text-white">Theme</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                Dark + burnt orange. That's it.
              </p>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel>About</SectionLabel>
          <div className="purp-card space-y-3 p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
                <Info className="size-5" />
              </span>
              <div>
                <p className="font-heading text-lg font-semibold text-white">
                  PURP
                </p>
                <p className="text-sm text-orange-300/90">{SERVER.fullName}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Status, rules, join, profile, depts, appeals.
                </p>
              </div>
            </div>
            <p className="text-center text-[11px] text-zinc-600">
              PURP · v0.1.0
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
