"use client";

import { PageHeader } from "@/components/layout/page-header";
import { formatRelativeDate } from "@/components/ui-helpers";
import { Badge } from "@/components/ui/badge";
import { announcements } from "@/lib/mock-data";

const typeStyles = {
  announcement: "bg-orange-500/15 text-orange-200",
  changelog: "bg-sky-500/15 text-sky-200",
  event: "bg-amber-500/15 text-amber-200",
} as const;

const typeLabels = {
  announcement: "Announcement",
  changelog: "Changelog",
  event: "Event",
} as const;

export default function AnnouncementsPage() {
  return (
    <div>
      <PageHeader title="Announcements" subtitle="News" backHref="/" />
      <div className="space-y-3 px-4 py-4">
        {announcements.map((item, index) => (
          <article
            key={item.id}
            className="purp-card animate-fade-up p-4"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className={`rounded-full ${typeStyles[item.type]}`}>
                {typeLabels[item.type]}
              </Badge>
              <time className="text-xs text-zinc-500">
                {formatRelativeDate(item.date)}
              </time>
            </div>
            <h2 className="font-heading text-base font-semibold text-white">
              {item.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
