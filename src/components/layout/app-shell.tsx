"use client";

import { BottomNav } from "@/components/layout/bottom-nav";
import { DemoBanner } from "@/components/layout/demo-banner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-[#0c0a08] text-zinc-100 shadow-[0_0_80px_rgba(196,92,38,0.18)] md:my-0 md:min-h-dvh md:border-x md:border-white/5 lg:max-w-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-700/20 blur-3xl" />
        <div className="absolute bottom-32 -left-20 h-48 w-48 rounded-full bg-amber-900/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,92,38,0.12),_transparent_55%)]" />
      </div>
      <div className="relative flex min-h-dvh flex-col">
        <DemoBanner />
        <main className="relative flex-1 overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
