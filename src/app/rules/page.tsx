"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui-helpers";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ruleSections } from "@/lib/mock-data";

export default function RulesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ruleSections;
    return ruleSections.filter(
      (section) =>
        section.title.toLowerCase().includes(q) ||
        section.summary.toLowerCase().includes(q) ||
        section.rules.some((r) => r.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div>
      <PageHeader title="Rules" subtitle="Read these. Seriously." />
      <div className="space-y-4 px-4 py-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules…"
            className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-base"
            aria-label="Search rules"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Nothing found"
            description="Try NLR, RDM, gangs…"
          />
        ) : (
          <Accordion multiple className="purp-card overflow-hidden px-3">
            {filtered.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="py-3.5 hover:no-underline">
                  <div className="pr-3 text-left">
                    <p className="font-medium text-white">{section.title}</p>
                    <p className="mt-0.5 text-xs font-normal text-zinc-500">
                      {section.summary}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pb-2 pl-1">
                    {section.rules.map((rule) => (
                      <li
                        key={rule}
                        className="flex gap-2 text-sm leading-relaxed text-zinc-300"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-400/80" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
