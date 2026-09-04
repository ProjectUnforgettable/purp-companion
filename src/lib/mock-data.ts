export const SERVER = {
  name: "PURP",
  fullName: "Project Unforgettable",
  tagline: "Premium roleplay. Unforgettable stories.",
  connectCode: "cfx.re/join/purp",
  connectNote: "Example connect string — replace with your live cfx.re code.",
  discordUrl: "https://discord.gg/purp-example",
  discordNote: "Placeholder Discord invite — wire to your real server invite later.",
  website: "https://purp.example",
  maxPlayers: 128,
} as const;

export type ServerStatus = {
  online: boolean;
  playersOnline: number;
  maxPlayers: number;
  queue: number;
  uptimeHours: number;
  lastRestart: string;
  jobs: {
    police: number;
    ems: number;
    fire: number;
    civilians: number;
  };
};

export const serverStatus: ServerStatus = {
  online: true,
  playersOnline: 42,
  maxPlayers: 128,
  queue: 3,
  uptimeHours: 18.4,
  lastRestart: "2026-09-04T06:00:00Z",
  jobs: {
    police: 8,
    ems: 5,
    fire: 3,
    civilians: 26,
  },
};

export type MockProfile = {
  characterName: string;
  discordHandle: string;
  discordId: string;
  playtimeHours: number;
  job: string;
  rank: string;
  cash: number;
  bank: number;
  badges: string[];
  departmentHoursRequired: number;
};

export const defaultProfile: MockProfile = {
  characterName: "Maya Reyes",
  discordHandle: "maya.reyes",
  discordId: "123456789012345678",
  playtimeHours: 7.5,
  job: "Unemployed",
  rank: "Civilian",
  cash: 2450,
  bank: 18750,
  badges: ["Verified", "Civilian"],
  departmentHoursRequired: 10,
};

/** Alternate profile used when demo unlock toggle is on */
export const unlockedProfile: MockProfile = {
  ...defaultProfile,
  playtimeHours: 14.2,
  badges: ["Verified", "Civilian", "Eligible"],
};

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
    description:
      "Protect and serve with professional LEO roleplay. Patrol, investigations, and coordinated responses.",
    requirements: [
      "10 hours in-game playtime",
      "Discord verified + whitelist approved",
      "Clean ban history (or resolved appeals)",
      "Pass scenario interview with staff",
    ],
    color: "blue",
    icon: "shield",
  },
  {
    id: "ems",
    name: "Emergency Medical Services",
    shortName: "EMS",
    description:
      "Stabilize scenes, transport patients, and keep the city alive with medical RP.",
    requirements: [
      "10 hours in-game playtime",
      "Discord verified + whitelist approved",
      "Willingness to learn medical SOPs",
      "Staff review after application",
    ],
    color: "rose",
    icon: "heart",
  },
  {
    id: "fire",
    name: "Los Santos Fire Department",
    shortName: "Fire",
    description:
      "Structure fires, vehicle extrication, and hazmat response with coordinated crew RP.",
    requirements: [
      "10 hours in-game playtime",
      "Discord verified + whitelist approved",
      "Team-first attitude on scenes",
      "Staff assignment after review",
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
    title: "General conduct",
    summary: "Respect players, staff, and the server community.",
    rules: [
      "Treat everyone with respect — no harassment, hate speech, or discrimination.",
      "Follow staff instructions during tickets, scenes, and investigations.",
      "Do not exploit bugs; report them to staff immediately.",
      "English is the primary language in public voice and text channels.",
      "Keep Discord and in-game usernames appropriate and identifiable.",
    ],
  },
  {
    id: "rdm-vdm",
    title: "RDM / VDM",
    summary: "Random and vehicle deathmatch are prohibited.",
    rules: [
      "RDM: Do not kill or injure another player without valid roleplay initiation.",
      "VDM: Do not use vehicles as weapons without clear RP reason and initiation.",
      "Initiation requires verbal or clear nonverbal RP that the other party can reasonably understand.",
      "Revenge killing without continued scene context may be treated as RDM.",
    ],
  },
  {
    id: "fail-rp",
    title: "Fail RP",
    summary: "Stay in character and keep scenes believable.",
    rules: [
      "Stay in character while in-game unless in designated OOC areas/channels.",
      "Value your life — do not rush armed threats or ignore serious injuries.",
      "Do not break immersion with memes, unrealistic actions, or ignoring injuries.",
      "Fear RP applies when clearly outnumbered or outgunned in a credible scene.",
    ],
  },
  {
    id: "metagaming",
    title: "Metagaming",
    summary: "Do not use out-of-character knowledge in-character.",
    rules: [
      "Information from Discord, streams, or OOC chat cannot be used in-character.",
      "Do not share live location or scene details via OOC to gain an advantage.",
      "Streamer mode or spoilers still count as OOC knowledge if used IC.",
      "Ask staff if you are unsure whether information is IC-safe.",
    ],
  },
  {
    id: "powergaming",
    title: "Powergaming",
    summary: "Do not force outcomes or deny others a fair chance to RP.",
    rules: [
      "Do not force actions on other players (e.g., “I zip-tie you instantly”).",
      "Give others time to respond to emotes and demands when reasonably possible.",
      "No god-mode claims, impossible knowledge, or scripted “always win” behavior.",
      "Criminal scenes must leave room for LEO response and fair counterplay.",
    ],
  },
  {
    id: "nlr",
    title: "New Life Rule (NLR)",
    summary: "After death, you forget the events leading to it.",
    rules: [
      "After being downed/killed and respawning, you forget the scene that caused it.",
      "Do not return to the same scene or seek revenge based on that death.",
      "Wait a reasonable cooldown before interacting with involved parties about that event.",
      "EMS revive in the same scene may keep limited memory — follow staff guidance.",
    ],
  },
  {
    id: "combat-logging",
    title: "Combat logging",
    summary: "Do not disconnect to avoid roleplay consequences.",
    rules: [
      "Leaving during an active scene, arrest, or pursuit to avoid outcomes is combat logging.",
      "If you disconnect unintentionally, reconnect ASAP and /report if needed.",
      "Repeated disconnects during scenes may result in bans.",
      "Going AFK mid-scene without warning can be treated similarly.",
    ],
  },
  {
    id: "robbery-hostage",
    title: "Robbery / hostage",
    summary: "High-stakes scenes need initiation, value-of-life, and fair limits.",
    rules: [
      "Initiate clearly before escalating to weapons or hostages.",
      "Hostage takers must value their own lives and negotiate in good faith.",
      "Do not take excessive hostages or camp hospitals/PD without staff approval.",
      "No copy-cat spam of the same store/bank immediately after a major scene.",
      "Follow any server-specific cooldown timers posted in Discord announcements.",
    ],
  },
  {
    id: "leo",
    title: "LEO interaction",
    summary: "Police scenes require professionalism from both sides.",
    rules: [
      "Civilians must comply or create believable resistance — not instant shootouts every stop.",
      "LEO must use proper escalation, radio, and department SOPs.",
      "Do not bait officers solely for PvP; scenes need RP motive.",
      "Corrupt LEO RP requires staff approval where applicable.",
    ],
  },
  {
    id: "ems-fire",
    title: "EMS / Fire",
    summary: "Emergency services are protected and essential to RP.",
    rules: [
      "Do not intentionally target EMS or Fire while they are clearly on duty helping.",
      "Allow medics space to work unless the scene fiction justifies immediate threat.",
      "Fake calls / malicious misuse of emergency services is prohibited.",
      "EMS/Fire members stay professional and avoid combat unless self-defense applies.",
    ],
  },
  {
    id: "gangs",
    title: "Gangs",
    summary: "Organization RP must stay fair, recorded, and staff-aware.",
    rules: [
      "Official gangs require staff registration and approved turf rules.",
      "Wars and major hits need proper initiation and fair numbers.",
      "No random civilian hunting under a gang flag.",
      "Recruitment must stay in-character; do not pressure OOC.",
    ],
  },
  {
    id: "voice-ooc",
    title: "Voice / OOC",
    summary: "Keep OOC clean and voice chat immersive.",
    rules: [
      "Use /ooc sparingly; prefer Discord tickets for disputes.",
      "No soundboards, ear-rape, or disruptive mic spam.",
      "Do not argue rules mid-scene — finish RP, then open a ticket.",
      "Streaming is welcome; do not metagame from chat or Discord callouts.",
    ],
  },
  {
    id: "ban-appeals",
    title: "Ban appeals",
    summary: "Appeals are reviewed by staff — be honest and complete.",
    rules: [
      "Submit one appeal per ban via the companion app or Discord appeal channel.",
      "Include Discord ID, approximate date, and a clear account of what happened.",
      "Evidence links help — do not harass staff for faster reviews.",
      "Lying on an appeal may result in a permanent denial.",
      "Wait for staff response; duplicate spam appeals may be closed.",
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
    title: "Whitelist applications reopening",
    body: "Civilian whitelist reviews resume this weekend. Make sure Discord is verified and your rules quiz is complete before applying.",
    date: "2026-09-04T15:00:00Z",
  },
  {
    id: "a2",
    type: "changelog",
    title: "Patch 0.9.4 — economy & MDT polish",
    body: "Adjusted starter cash, fixed MDT warrant sync, and improved EMS stretcher props. Clear cache if you see old assets.",
    date: "2026-09-03T20:30:00Z",
  },
  {
    id: "a3",
    type: "event",
    title: "Friday night car meet",
    body: "Legion Square from 8–10 PM server time. No weapons, pure car culture RP. Prizes for best build voted by staff.",
    date: "2026-09-02T18:00:00Z",
  },
  {
    id: "a4",
    type: "changelog",
    title: "Patch 0.9.3 — voice & housing",
    body: "Proximity voice fade tuned, apartment lock bugs fixed, and gang spray cleanup tool added for staff.",
    date: "2026-08-30T22:00:00Z",
  },
  {
    id: "a5",
    type: "announcement",
    title: "Department apps require 10 hours",
    body: "Police, EMS, and Fire applications unlock after 10 hours of in-game playtime. Emergency roles are staff-assigned after review.",
    date: "2026-08-28T12:00:00Z",
  },
];

export const joinSteps = [
  {
    step: 1,
    title: "Install FiveM",
    detail: "Download the FiveM client from the official FiveM website and install it on Windows.",
  },
  {
    step: 2,
    title: "Join our Discord",
    detail: "Verify, read #rules, and complete whitelist onboarding so staff can approve your character.",
  },
  {
    step: 3,
    title: "Connect to PURP",
    detail: `In FiveM, use the connect link (example: ${SERVER.connectCode}) or paste the server IP provided in Discord.`,
  },
  {
    step: 4,
    title: "Create your character",
    detail: "Pick a realistic name, backstory, and start as a civilian. Department apps unlock at 10 hours.",
  },
];

export const joinRequirements = [
  "18+ (or server-stated minimum age)",
  "Working microphone for voice RP",
  "Discord account verified in the PURP server",
  "Willingness to follow NL/WL rules and staff direction",
  "No active bans on linked accounts without a resolved appeal",
];
