"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState, SectionLabel } from "@/components/ui-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMockStore } from "@/lib/mock-store";

export default function AppealsPage() {
  const { profile, submitAppeal, appeals } = useMockStore();
  const [discordId, setDiscordId] = useState(profile.discordId);
  const [reason, setReason] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordId.trim() || !reason.trim() || whatHappened.trim().length < 20) {
      toast.error("Missing details", {
        description:
          "Discord ID, ban reason, and a full account of what happened are required.",
      });
      return;
    }
    submitAppeal({
      discordId: discordId.trim(),
      reason: reason.trim(),
      whatHappened: whatHappened.trim(),
      evidence: evidence.trim(),
    });
    setSubmitted(true);
    setReason("");
    setWhatHappened("");
    setEvidence("");
    toast.success("Appeal submitted", {
      description:
        "Mock confirmation only — staff would review this in Discord / a ticket bot.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Ban appeals"
        subtitle="Honest, complete appeals only"
        backHref="/more"
      />
      <div className="space-y-4 px-4 py-4">
        <p className="text-sm text-zinc-400">
          Submit one appeal per ban. Include evidence links when you have them.
          This prototype stores appeals in local demo state only.
        </p>

        {submitted ? (
          <div className="purp-card border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            Your mock appeal was recorded for this session. In production, staff
            would reply via Discord.
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-10 w-full rounded-xl border-emerald-400/20 bg-transparent text-emerald-100 hover:bg-emerald-500/10"
              onClick={() => setSubmitted(false)}
            >
              Submit another
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="purp-card space-y-3 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="discord-id">Discord ID</Label>
              <Input
                id="discord-id"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                className="h-11 rounded-xl border-white/10 bg-white/5"
                placeholder="17–19 digit snowflake"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ban-reason">Ban reason (as you understand it)</Label>
              <Input
                id="ban-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-11 rounded-xl border-white/10 bg-white/5"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="what-happened">What happened?</Label>
              <Textarea
                id="what-happened"
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
                className="min-h-28 rounded-xl border-white/10 bg-white/5"
                placeholder="Be specific. Dates, characters involved, and your side of the story."
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="evidence">Evidence links (optional)</Label>
              <Textarea
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="min-h-20 rounded-xl border-white/10 bg-white/5"
                placeholder="Clip URLs, ticket IDs, screenshots…"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-violet-600 text-white hover:bg-violet-500"
            >
              Submit appeal
            </Button>
          </form>
        )}

        <section>
          <SectionLabel>Session submissions</SectionLabel>
          {appeals.length === 0 ? (
            <EmptyState
              title="No appeals yet"
              description="Submitted mock appeals will show up here."
            />
          ) : (
            <ul className="space-y-2">
              {appeals.map((a) => (
                <li key={a.id} className="purp-card p-3">
                  <p className="font-medium text-white">{a.reason}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    ID {a.discordId} ·{" "}
                    {new Date(a.submittedAt).toLocaleString()}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                    {a.whatHappened}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
