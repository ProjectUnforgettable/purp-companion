"use client";

import { BadgeCheck, Briefcase, Clock3, Wallet } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  SectionLabel,
  formatCurrency,
} from "@/components/ui-helpers";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMockStore } from "@/lib/mock-store";

export default function ProfilePage() {
  const { profile, unlockedDemo, setUnlockedDemo } = useMockStore();
  const required = profile.departmentHoursRequired;
  const progress = Math.min(100, (profile.playtimeHours / required) * 100);
  const unlocked = profile.playtimeHours >= required;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Mock player card" />
      <div className="space-y-5 px-4 py-4">
        <section className="animate-fade-up purp-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-700 font-heading text-xl font-bold text-white shadow-lg shadow-violet-900/40">
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
                {profile.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="gap-1 rounded-full border border-violet-400/20 bg-violet-500/15 text-violet-200"
                  >
                    <BadgeCheck className="size-3" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="animate-fade-up-delay-1 grid grid-cols-2 gap-2">
          <div className="purp-card p-3">
            <div className="mb-2 inline-flex size-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
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
            <p className="text-xs text-zinc-500">Playtime</p>
            <p className="font-heading text-xl font-semibold text-white">
              {profile.playtimeHours.toFixed(1)}h
            </p>
            <p className="text-xs text-zinc-400">In-game</p>
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

        <section className="animate-fade-up-delay-2 purp-card p-4">
          <SectionLabel>Department unlock</SectionLabel>
          <div className="mb-2 flex items-end justify-between gap-2">
            <p className="text-sm text-zinc-300">
              {profile.playtimeHours.toFixed(1)} / {required} hours
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
            Emergency department applications unlock after {required} hours
            in-game. Roles are staff-assigned after review.
          </p>
        </section>

        <section className="purp-card flex items-center justify-between gap-3 p-4">
          <div>
            <Label htmlFor="unlock-demo" className="text-sm text-white">
              Demo: unlock applications
            </Label>
            <p className="mt-0.5 text-xs text-zinc-500">
              Toggle mock playtime to {unlockedDemo ? "7.5h" : "14.2h"} so you
              can preview locked and unlocked states.
            </p>
          </div>
          <Switch
            id="unlock-demo"
            checked={unlockedDemo}
            onCheckedChange={setUnlockedDemo}
          />
        </section>
      </div>
    </div>
  );
}
