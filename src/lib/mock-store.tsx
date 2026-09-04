"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultProfile,
  unlockedProfile,
  type MockProfile,
} from "@/lib/mock-data";

export type DepartmentApplication = {
  id: string;
  departmentId: string;
  name: string;
  discord: string;
  whyJoin: string;
  experience: string;
  submittedAt: string;
};

export type BanAppeal = {
  id: string;
  discordId: string;
  reason: string;
  whatHappened: string;
  evidence: string;
  submittedAt: string;
};

type MockStoreValue = {
  unlockedDemo: boolean;
  setUnlockedDemo: (value: boolean) => void;
  profile: MockProfile;
  applications: DepartmentApplication[];
  appeals: BanAppeal[];
  submitApplication: (
    app: Omit<DepartmentApplication, "id" | "submittedAt">
  ) => DepartmentApplication;
  submitAppeal: (
    appeal: Omit<BanAppeal, "id" | "submittedAt">
  ) => BanAppeal;
  hasApplied: (departmentId: string) => boolean;
};

const MockStoreContext = createContext<MockStoreValue | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [unlockedDemo, setUnlockedDemo] = useState(false);
  const [applications, setApplications] = useState<DepartmentApplication[]>(
    []
  );
  const [appeals, setAppeals] = useState<BanAppeal[]>([]);

  const profile = unlockedDemo ? unlockedProfile : defaultProfile;

  const submitApplication = useCallback(
    (app: Omit<DepartmentApplication, "id" | "submittedAt">) => {
      const entry: DepartmentApplication = {
        ...app,
        id: uid("app"),
        submittedAt: new Date().toISOString(),
      };
      setApplications((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const submitAppeal = useCallback(
    (appeal: Omit<BanAppeal, "id" | "submittedAt">) => {
      const entry: BanAppeal = {
        ...appeal,
        id: uid("appeal"),
        submittedAt: new Date().toISOString(),
      };
      setAppeals((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const hasApplied = useCallback(
    (departmentId: string) =>
      applications.some((a) => a.departmentId === departmentId),
    [applications]
  );

  const value = useMemo(
    () => ({
      unlockedDemo,
      setUnlockedDemo,
      profile,
      applications,
      appeals,
      submitApplication,
      submitAppeal,
      hasApplied,
    }),
    [
      unlockedDemo,
      profile,
      applications,
      appeals,
      submitApplication,
      submitAppeal,
      hasApplied,
    ]
  );

  return (
    <MockStoreContext.Provider value={value}>
      {children}
    </MockStoreContext.Provider>
  );
}

export function useMockStore() {
  const ctx = useContext(MockStoreContext);
  if (!ctx) {
    throw new Error("useMockStore must be used within MockStoreProvider");
  }
  return ctx;
}
