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
import { submitAppealToDiscord } from "@/lib/discord";

export default function AppealsPage() {
  const { profile, submitAppeal, appeals } = useMockStore();
  const [discordId, setDiscordId] = useState(profile.discordId);
  const [reason, setReason] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordId.trim() || !reason.trim() || whatHappened.trim().length < 20) {
      toast.error("Missing details", {
        description:
          "Need ID, reason, and what happened.",
      });
      return;
    }
    if (sending) return;
    setSending(true);
    const payload = {
      discordId: discordId.trim(),
      reason: reason.trim(),
      whatHappened: whatHappened.trim(),
      evidence: evidence.trim(),
    };
    try {
      await submitAppealToDiscord(payload);
      submitAppeal(payload);
      setSubmitted(true);
      setReason("");
      setWhatHappened("");
      setEvidence("");
      toast.success("Sent to Discord", {
        description: "Staff will reply there.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not reach Discord.";
      toast.error("Did not send", {
        description: msg,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader title="Appeals" subtitle="One appeal per ban" backHref="/more" />
      <div className="space-y-4 px-4 py-4">
        <p className="text-sm text-zinc-400">
          Be honest. Clips help.
        </p>

        {submitted ? (
          <div className="purp-card border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            Sent to Discord. Staff replies there.
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
                placeholder="What happened — dates, who was there, your side."
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
              disabled={sending}
              className="h-11 w-full rounded-xl bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Submit appeal"}
            </Button>
          </form>
        )}

        <section>
          <SectionLabel>Submitted</SectionLabel>
          {appeals.length === 0 ? (
            <EmptyState title="No appeals yet" description="Nothing submitted." />
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
