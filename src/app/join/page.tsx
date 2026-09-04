"use client";

import { CheckCircle2, ExternalLink, Gamepad2, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionLabel } from "@/components/ui-helpers";
import { Button } from "@/components/ui/button";
import {
  SERVER,
  joinRequirements,
  joinSteps,
} from "@/lib/mock-data";

export default function JoinPage() {
  return (
    <div>
      <PageHeader title="How to join" subtitle="Connect to PURP on FiveM" />
      <div className="space-y-5 px-4 py-4">
        <section className="animate-fade-up purp-card p-4">
          <p className="text-xs font-semibold tracking-wide text-amber-300/90 uppercase">
            Connect
          </p>
          <p className="mt-2 font-mono text-lg text-white">
            {SERVER.connectLabel}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{SERVER.connectNote}</p>
          <div className="mt-3 flex gap-2">
            <Button
              nativeButton={false}
              render={
                <a
                  href={SERVER.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="h-11 flex-1 rounded-xl bg-orange-600 text-white hover:bg-orange-500"
            >
              <MessageCircle className="size-4" />
              Open Discord
              <ExternalLink className="size-3.5 opacity-60" />
            </Button>
          </div>
        </section>

        <section className="animate-fade-up-delay-1">
          <SectionLabel>Steps</SectionLabel>
          <ol className="space-y-2">
            {joinSteps.map((item) => (
              <li key={item.step} className="purp-card flex gap-3 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-heading text-sm font-semibold text-orange-200">
                  {item.step}
                </span>
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-400">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="animate-fade-up-delay-2">
          <SectionLabel>Requirements</SectionLabel>
          <ul className="purp-card space-y-2.5 p-4">
            {joinRequirements.map((req) => (
              <li key={req} className="flex gap-2.5 text-sm text-zinc-300">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-300" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionLabel>Controllers</SectionLabel>
          <div className="purp-card flex items-start gap-3 p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
              <Gamepad2 className="size-5" />
            </span>
            <div>
              <p className="font-medium text-white">Xbox + PlayStation</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                {SERVER.controllerTip}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
