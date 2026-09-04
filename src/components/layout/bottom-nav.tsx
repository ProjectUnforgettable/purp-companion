"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  MoreHorizontal,
  Radio,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/join", label: "Join", icon: Radio },
  { href: "/rules", label: "Rules", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/more", label: "More", icon: MoreHorizontal },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0c0a08]/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors",
                active
                  ? "text-orange-300"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(196,92,38,0.85)]" />
              )}
              <Icon
                className={cn(
                  "size-5 transition-transform",
                  active && "scale-105"
                )}
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
