"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Flame,
  Heart,
  Lock,
  Shield,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { SectionLabel } from "@/components/ui-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { departments, type Department } from "@/lib/mock-data";
import { useMockStore } from "@/lib/mock-store";
import {
  submitDepartmentToDiscord,
  type DeptId,
} from "@/lib/discord";

const iconMap = {
  shield: Shield,
  heart: Heart,
  flame: Flame,
} as const;

const tintMap = {
  police: "from-sky-600/30 to-sky-950/40 text-sky-300",
  ems: "from-rose-600/30 to-rose-950/40 text-rose-300",
  fire: "from-orange-600/30 to-orange-950/40 text-orange-300",
} as const;

const statusLabel = {
  pending: "Pending",
  under_review: "Under review",
  accepted: "Accepted",
  denied: "Denied",
} as const;

function ApplicationForm({
  department,
  onClose,
}: {
  department: Department;
  onClose: () => void;
}) {
  const { profile, submitApplication, hasApplied } = useMockStore();
  const [name, setName] = useState(profile.characterName);
  const [discord, setDiscord] = useState(profile.discordHandle);
  const [whyJoin, setWhyJoin] = useState("");
  const [experience, setExperience] = useState("");
  const [sending, setSending] = useState(false);
  const already = hasApplied(department.id);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (already) {
      toast.message("Already submitted", {
        description: `You already applied to ${department.shortName} this session.`,
      });
      return;
    }
    if (!name.trim() || !discord.trim() || whyJoin.trim().length < 12) {
      toast.error("Complete the form", {
        description: "Name, Discord, and a short “why join” are required.",
      });
      return;
    }
    if (sending) return;
    setSending(true);
    const payload = {
      departmentId: department.id as DeptId,
      name: name.trim(),
      discord: discord.trim(),
      whyJoin: whyJoin.trim(),
      experience: experience.trim(),
    };
    try {
      await submitDepartmentToDiscord(payload);
      submitApplication(payload);
      toast.success("Sent to Discord", {
        description: "Staff will look it over.",
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn’t reach Discord.";
      toast.error("Didn’t send", {
        description: msg,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="purp-card mt-3 space-y-3 p-4">
      <div>
        <p className="font-heading font-semibold text-white">
          Apply — {department.shortName}
        </p>
        <p className="text-xs text-zinc-500">
          Won't give you the job.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="app-name">Character name</Label>
        <Input
          id="app-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-xl border-white/10 bg-white/5"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="app-discord">Discord</Label>
        <Input
          id="app-discord"
          value={discord}
          onChange={(e) => setDiscord(e.target.value)}
          className="h-11 rounded-xl border-white/10 bg-white/5"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="app-why">Why do you want to join?</Label>
        <Textarea
          id="app-why"
          value={whyJoin}
          onChange={(e) => setWhyJoin(e.target.value)}
          className="min-h-24 rounded-xl border-white/10 bg-white/5"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="app-xp">Relevant experience</Label>
        <Textarea
          id="app-xp"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="min-h-20 rounded-xl border-white/10 bg-white/5"
          placeholder="Prior LEO/EMS RP, certifications, etc."
        />
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-11 flex-1 rounded-xl border-white/10 bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={sending}
          className="h-11 flex-1 rounded-xl bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default function DepartmentsPage() {
  const {
    profile,
    unlockedDemo,
    setUnlockedDemo,
    hasApplied,
    getApplication,
    applications,
  } = useMockStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const unlocked = profile.playtimeHours >= profile.departmentHoursRequired;

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Need 10h first. Staff reviews apps."
        backHref="/more"
      />
      <div className="space-y-4 px-4 py-4">
        <div className="purp-card flex items-center justify-between gap-3 p-4">
          <div>
            <Label htmlFor="dept-unlock" className="text-sm text-white">
              Test 10h
            </Label>
            <p className="text-xs text-zinc-500">
              Playtime: {profile.playtimeHours.toFixed(1)}h
            </p>
          </div>
          <Switch
            id="dept-unlock"
            checked={unlockedDemo}
            onCheckedChange={setUnlockedDemo}
          />
        </div>

        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-100/90">
          Need <strong className="font-semibold">10h in-game</strong>. Staff
          reviews apps and assigns the role.
        </p>

        <SectionLabel>Departments</SectionLabel>
        <div className="space-y-3">
          {departments.map((dept) => {
            const Icon = iconMap[dept.icon];
            const applied = hasApplied(dept.id);
            const app = getApplication(dept.id);
            const showForm = activeId === dept.id;

            return (
              <article key={dept.id} className="purp-card overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${tintMap[dept.id]}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-semibold text-white">
                          {dept.shortName}
                        </h3>
                        {unlocked ? (
                          <Badge className="gap-1 rounded-full bg-emerald-500/15 text-emerald-300">
                            <Unlock className="size-3" />
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge className="gap-1 rounded-full bg-zinc-500/20 text-zinc-300">
                            <Lock className="size-3" />
                            Locked
                          </Badge>
                        )}
                        {app ? (
                          <Badge className="gap-1 rounded-full bg-orange-500/15 text-orange-200">
                            <CheckCircle2 className="size-3" />
                            {statusLabel[app.status]}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        {dept.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
                    {dept.requirements.map((req) => (
                      <li
                        key={req}
                        className="flex gap-2 text-xs text-zinc-400"
                      >
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-orange-400" />
                        {req}
                      </li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => setActiveId(showForm ? null : dept.id)}
                    className="mt-3 h-11 w-full rounded-xl bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-40"
                  >
                    {unlocked
                      ? showForm
                        ? "Hide form"
                        : applied
                          ? "View app"
                          : "Apply"
                      : `Need ${profile.departmentHoursRequired}h first`}
                  </Button>
                </div>
                {showForm && unlocked ? (
                  <div className="border-t border-white/5 bg-black/20 px-1 pb-1">
                    <ApplicationForm
                      department={dept}
                      onClose={() => setActiveId(null)}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {applications.length > 0 ? (
          <section>
            <SectionLabel>Your apps</SectionLabel>
            <ul className="space-y-2">
              {applications.map((app) => (
                <li key={app.id} className="purp-card p-3 text-sm">
                  <p className="font-medium text-white">
                    {app.departmentId.toUpperCase()} — {app.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    @{app.discord} · {statusLabel[app.status]} ·{" "}
                    {new Date(app.submittedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
