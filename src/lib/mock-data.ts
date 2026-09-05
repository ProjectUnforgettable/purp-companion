const DISCORD_INVITE_FALLBACK = "https://discord.gg/vun3Gy9mRy";
const DISCORD_DEEP_LINK_FALLBACK =
  "https://discord.com/channels/1373397457177935893/1545554671425421405";

export const SERVER = {
  name: "PURP",
  fullName: "Project Unforgettable",
  tagline: "Serious RP. No nonsense.",
  /** Local smoke test — no public join yet */
  connectLabel: "Local smoke test — no public join yet",
  connectNote: "No cfx. Watch Discord.",
  discordGuildId: "1373397457177935893",
  /** Primary: invite so new folks land in PURP */
  discordUrl:
    process.env.NEXT_PUBLIC_DISCORD_INVITE_URL?.trim() ||
    DISCORD_INVITE_FALLBACK,
  /** Already in? deep link to #verify */
  discordDeepLink:
    process.env.NEXT_PUBLIC_DISCORD_OPEN_URL?.trim() ||
    DISCORD_DEEP_LINK_FALLBACK,
  discordNote: "PURP Discord",
  website: "https://purp.example",
  maxPlayers: 48,
  controllerTip: "Xbox / PS pads work via purp-input.",
} as const;

export type HeatLevel = "low" | "moderate" | "high" | "critical";

export type ServerStatus = {
  online: boolean;
  playersOnline: number;
  maxPlayers: number;
  queue: number;
  uptimeHours: number;
  lastRestart: string;
  /** City heat / priority call load — mirrors Discord #server-status */
  heat: HeatLevel;
  heatLabel: string;
  staffingNote: string;
  jobs: {
    police: number;
    ems: number;
    fire: number;
    civilians: number;
  };
  /** Short feed lines like a #server-status channel */
  statusFeed: { id: string; text: string; at: string }[];
};

export const serverStatus: ServerStatus = {
  online: true,
  playersOnline: 42,
  maxPlayers: 128,
  queue: 3,
  uptimeHours: 18.4,
  lastRestart: "2026-09-04T06:00:00Z",
  heat: "moderate",
  heatLabel: "Moderate heat",
  staffingNote: "LEO OK · EMS thin · Fire covered",
  jobs: {
    police: 8,
    ems: 5,
    fire: 3,
    civilians: 26,
  },
  statusFeed: [
    {
      id: "f1",
      text: "42/128 online · queue 3 · heat MODERATE",
      at: "2026-09-04T22:55:00Z",
    },
    {
      id: "f2",
      text: "On shift — Police 8 · EMS 5 · Fire 3 · Civ 26",
      at: "2026-09-04T22:55:00Z",
    },
    {
      id: "f3",
      text: "Staffing: LEO OK · EMS thin · Fire covered",
      at: "2026-09-04T22:40:00Z",
    },
    {
      id: "f4",
      text: "Restart ~18h ago",
      at: "2026-09-04T22:10:00Z",
    },
  ],
};

export type ShiftBoard = {
  onDuty: boolean;
  desk: string;
  payGrade: string;
  hourlyPay: number;
  clockedInAt: string | null;
};

export type ApiSnapshotPlaceholder = {
  id: "phone" | "bank" | "inventory";
  title: string;
  blurb: string;
};

export type MockProfile = {
  characterName: string;
  discordHandle: string;
  discordId: string;
  discordLinked: boolean;
  whitelisted: boolean;
  verified: boolean;
  /** In-game hours only — not wall-clock */
  playtimeHours: number;
  job: string;
  rank: string;
  cash: number;
  bank: number;
  badges: string[];
  departmentHoursRequired: number;
  shift: ShiftBoard;
  /** Read-only character sheet sourced from game (mock) */
  characterSheet: {
    dob: string;
    nationality: string;
    phone: string;
    licenses: string[];
  };
};

export const defaultProfile: MockProfile = {
  characterName: "Maya Reyes",
  discordHandle: "maya.reyes",
  discordId: "123456789012345678",
  discordLinked: true,
  whitelisted: true,
  verified: true,
  playtimeHours: 7.5,
  job: "Unemployed",
  rank: "Civilian",
  cash: 2450,
  bank: 18750,
  badges: ["Discord linked", "Whitelisted", "Verified", "Civilian"],
  departmentHoursRequired: 10,
  shift: {
    onDuty: false,
    desk: "—",
    payGrade: "Civilian",
    hourlyPay: 0,
    clockedInAt: null,
  },
  characterSheet: {
    dob: "1998-04-12",
    nationality: "American",
    phone: "(555) 014-2291",
    licenses: ["Driver", "Firearm"],
  },
};

/** Alternate profile when demo unlock toggle is on (≥10h in-game) */
export const unlockedProfile: MockProfile = {
  ...defaultProfile,
  playtimeHours: 14.2,
  badges: [
    "Discord linked",
    "Whitelisted",
    "Verified",
    "Civilian",
    "Dept eligible",
  ],
  shift: {
    onDuty: true,
    desk: "Legion Square — taxi stand (temp)",
    payGrade: "Civilian · Contract",
    hourlyPay: 85,
    clockedInAt: "2026-09-04T20:15:00Z",
  },
};

export const apiPlaceholders: ApiSnapshotPlaceholder[] = [
  {
    id: "phone",
    title: "Phone",
    blurb: "Soon.",
  },
  {
    id: "bank",
    title: "Bank",
    blurb: "Soon.",
  },
  {
    id: "inventory",
    title: "Inventory",
    blurb: "Soon.",
  },
];

export type Department = {
  id: "police" | "ems" | "fire";
  name: string;
  shortName: string;
  description: string;
  requirements: string[];
  color: string;
  icon: "shield" | "heart" | "flame";
};

export const departments: Department[] = [
  {
    id: "police",
    name: "Los Santos Police Department",
    shortName: "Police",
    description: "Patrol, stops, and investigations.",
    requirements: [
      "10h in-game",
      "Discord linked + whitelist",
      "Clean record (or cleared appeal)",
      "Staff review — they assign the role",
    ],
    color: "blue",
    icon: "shield",
  },
  {
    id: "ems",
    name: "Emergency Medical Services",
    shortName: "EMS",
    description: "Medics, transports, scene care.",
    requirements: [
      "10h in-game",
      "Discord linked + whitelist",
      "Down to learn SOPs",
      "Staff review — they assign the role",
    ],
    color: "rose",
    icon: "heart",
  },
  {
    id: "fire",
    name: "Los Santos Fire Department",
    shortName: "Fire",
    description: "Fires, extrication, hazmat.",
    requirements: [
      "10h in-game",
      "Discord linked + whitelist",
      "Show up for your crew",
      "Staff review — they assign the role",
    ],
    color: "orange",
    icon: "flame",
  },
];

export type RuleSection = {
  id: string;
  title: string;
  summary: string;
  rules: string[];
};

export const ruleSections: RuleSection[] = [
  {
    id: "general",
    title: "Conduct",
    summary: "Don't be a dick.",
    rules: [
      "No harassment, hate, or toxicity.",
      "Listen to staff in tickets and scenes.",
      "Report bugs — don't abuse them.",
      "English in public voice/text.",
      "Keep names readable.",
    ],
  },
  {
    id: "rdm-vdm",
    title: "RDM / VDM",
    summary: "No random kills.",
    rules: [
      "RDM: don't shoot without initiation.",
      "VDM: cars aren't weapons without RP.",
      "Initiation has to be clear to the other player.",
      "Revenge with no scene left = RDM.",
    ],
  },
  {
    id: "fail-rp",
    title: "Fail RP",
    summary: "Stay in character.",
    rules: [
      "IC in-game unless you're in an OOC spot.",
      "Value your life.",
      "No meme / cartoon shit in serious scenes.",
      "Fear RP when you're clearly outgunned.",
    ],
  },
  {
    id: "metagaming",
    title: "Metagaming",
    summary: "OOC knowledge stays OOC.",
    rules: [
      "Discord / streams / OOC chat isn't IC intel.",
      "Don't call out locations OOC mid-scene.",
      "Streamer spoilers still count as OOC.",
      "Not sure? Ask staff.",
    ],
  },
  {
    id: "powergaming",
    title: "Powergaming",
    summary: "Don't force wins.",
    rules: [
      "No “I cuff you instantly” nonsense.",
      "Give people a second to respond.",
      "No godmode / impossible knowledge.",
      "Leave room for cops and fair counterplay.",
    ],
  },
  {
    id: "nlr",
    title: "NLR",
    summary: "Death wipes that scene.",
    rules: [
      "After you die and respawn, that scene's gone.",
      "No revenge run-backs off that death.",
      "Give it a cooldown before you hit those people again.",
      "Same-scene EMS revive may keep a little memory — staff call.",
    ],
  },
  {
    id: "combat-logging",
    title: "Combat logging",
    summary: "Don't rage-quit scenes.",
    rules: [
      "Leaving mid-arrest / chase / fight to dodge it is logging.",
      "Crash? Rejoin and /report if needed.",
      "Repeat loggers get banned.",
      "AFK mid-scene without a word can count the same.",
    ],
  },
  {
    id: "robbery-hostage",
    title: "Robbery / hostage",
    summary: "Initiate. Value life. Don't spam.",
    rules: [
      "Clear initiation before guns / hostages.",
      "Value your own life — negotiate.",
      "No hospital / PD camping without staff OK.",
      "Don't chain the same spot right after a big hit.",
      "Respect posted cooldowns.",
    ],
  },
  {
    id: "leo",
    title: "Cops",
    summary: "Both sides play fair.",
    rules: [
      "Comply or resist believably — not every stop is a shootout.",
      "LEO: escalate properly, use radio, follow SOPs.",
      "Don't bait cops just for PvP.",
      "Corrupt LEO needs staff approval when required.",
    ],
  },
  {
    id: "ems-fire",
    title: "EMS / Fire",
    summary: "Don't grief medics.",
    rules: [
      "Don't hunt on-duty EMS / Fire helping people.",
      "Give them room unless the scene says otherwise.",
      "No fake / spam emergency calls.",
      "EMS/Fire aren't combat jobs unless defending themselves.",
    ],
  },
  {
    id: "gangs",
    title: "Gangs",
    summary: "Registered or it doesn't count.",
    rules: [
      "Official gangs register with staff.",
      "Wars need initiation and fair numbers.",
      "No random civ hunting under a flag.",
      "Recruit IC — don't pressure OOC.",
    ],
  },
  {
    id: "voice-ooc",
    title: "Voice / OOC",
    summary: "Keep the mic clean.",
    rules: [
      "/ooc sparingly — tickets for drama.",
      "No soundboards or mic spam.",
      "Argue rules after the scene, not during.",
      "Streamers: no meta from chat callouts.",
    ],
  },
  {
    id: "ban-appeals",
    title: "Appeals",
    summary: "One honest appeal. Wait.",
    rules: [
      "One appeal per ban (app or Discord).",
      "Include ID, roughly when, and what happened.",
      "Evidence helps. Don't spam staff.",
      "Lie on an appeal and you're done.",
      "Wait for a reply — dupes get closed.",
    ],
  },
];

export type Announcement = {
  id: string;
  type: "announcement" | "changelog" | "event";
  title: string;
  body: string;
  date: string;
};

export const announcements: Announcement[] = [
  {
    id: "a1",
    type: "announcement",
    title: "Whitelist open again",
    body: "Civ apps this weekend. Link Discord, verify, do the rules quiz, then apply.",
    date: "2026-09-04T15:00:00Z",
  },
  {
    id: "a2",
    type: "changelog",
    title: "0.9.4 — economy / MDT",
    body: "Starter cash tweak, MDT warrant sync fix, better EMS stretchers. Clear cache if assets look old.",
    date: "2026-09-03T20:30:00Z",
  },
  {
    id: "a3",
    type: "event",
    title: "Friday car meet",
    body: "Legion 8–10 server time. No guns. Controllers fine.",
    date: "2026-09-02T18:00:00Z",
  },
  {
    id: "a4",
    type: "changelog",
    title: "0.9.3 — voice / housing",
    body: "Voice fade tuned, apartment locks fixed, staff spray cleanup tool.",
    date: "2026-08-30T22:00:00Z",
  },
  {
    id: "a5",
    type: "announcement",
    title: "Dept apps = 10h in-game",
    body: "Police / EMS / Fire unlock at 10h in-game. Staff reviews apps and assigns roles.",
    date: "2026-08-28T12:00:00Z",
  },
];

export const joinSteps = [
  {
    step: 1,
    title: "Get FiveM",
    detail: "Official client, Windows.",
  },
  {
    step: 2,
    title: "Discord",
    detail: "Verify, read #rules, finish whitelist.",
  },
  {
    step: 3,
    title: "Connect",
    detail: "Local smoke test — no public join yet. Link drops in Discord later.",
  },
  {
    step: 4,
    title: "Character",
    detail: "Made in-game. Dept apps at 10h.",
  },
];

export const joinRequirements = [
  "18+ (or whatever staff posts)",
  "Working mic",
  "Discord linked + verified",
  "Whitelist approved",
  "Follow NL/WL rules",
  "No open bans (or a cleared appeal)",
];
