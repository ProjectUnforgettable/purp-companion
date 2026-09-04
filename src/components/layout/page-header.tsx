"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  backHref,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/5 bg-[#0b0614]/85 backdrop-blur-xl",
        className
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/5 text-zinc-200 transition hover:bg-white/10"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="font-heading truncate text-lg font-semibold tracking-tight text-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-xs text-zinc-400">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
    </header>
  );
}
