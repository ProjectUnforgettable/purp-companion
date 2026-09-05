"use client";

import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div
      className="relative z-50 border-b border-orange-500/20 bg-orange-950/70 px-3 py-2 text-center text-[11px] leading-snug text-orange-100/90"
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        <Info className="size-3.5 shrink-0 opacity-80" />
        <span>
          <strong className="font-semibold text-orange-50">Live smoke box</strong>
          {" — "}
          status polls the tunnel; if it flakes we fall back to demo data.
        </span>
      </span>
    </div>
  );
}
