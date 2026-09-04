"use client";

import { CheckCircle2, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { SectionLabel } from "@/components/ui-helpers";
import { Button } from "@/components/ui/button";
import {
  SERVER,
  joinRequirements,
  joinSteps,
} from "@/lib/mock-data";

export default function JoinPage() {
  const copyConnect = async () => {
    try {
      await navigator.clipboard.writeText(SERVER.connectCode);
      toast.success("Connect string copied", {
        description: "Example only — replace with your live cfx.re code.",
      });
    } catch {
      toast.message(SERVER.connectCode, {
        description: "Copy manually — clipboard unavailable.",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="How to join"
        subtitle="Connect to PURP on FiveM"
      />
      <div className="space-y-5 px-4 py-4">
        <section className="animate-fade-up purp-card p-4">
          <p className="text-xs font-semibold tracking-wide text-amber-300/90 uppercase">
            Example connect string
          </p>
          <p className="mt-2 font-mono text-lg text-white">{SERVER.connectCode}</p>
          <p className="mt-1 text-xs text-zinc-500">{SERVER.connectNote}</p>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={copyConnect}
              className="h-11 flex-1 rounded-xl bg-violet-600 text-white hover:bg-violet-500"
            >
              <Copy className="size-4" />
              Copy
            </Button>
            <Button
              nativeButton={false}
              render={
                <a
                  href={SERVER.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              variant="outline"
              className="h-11 flex-1 rounded-xl border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            >
              <MessageCircle className="size-4" />
              Discord
              <ExternalLink className="size-3.5 opacity-60" />
            </Button>
          </div>
        </section>

        <section className="animate-fade-up-delay-1">
          <SectionLabel>Steps</SectionLabel>
          <ol className="space-y-2">
            {joinSteps.map((item) => (
              <li key={item.step} className="purp-card flex gap-3 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 font-heading text-sm font-semibold text-violet-200">
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
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-violet-300" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
