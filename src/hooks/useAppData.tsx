import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  Job,
  Candidate,
  User,
  Role,
  ChecklistTemplate,
  ChecklistItem,
  CandidateStage,
  CandidateActivity,
  CandidateNote,
} from '@/types';
import { seedJobs, seedCandidates, seedUsers, seedChecklists } from '@/lib/seed';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

const STORAGE_KEY = 'ats-recruitment-data-v1';

type PersistedState = {
  jobs: Job[];
  candidates: Candidate[];
  users: User[];
  checklists: ChecklistTemplate[];
  currentUserId: string;
};

export type AppDataContextValue = {
  jobs: Job[];
  candidates: Candidate[];
  users: User[];
  checklists: ChecklistTemplate[];
  currentUser: User;
  setCurrentUserId: (id: string) => void;

  // Jobs
  addJob: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Job;
  updateJob: (id: string, data: Partial<Omit<Job, 'id' | 'createdAt'>>) => void;
  deleteJob: (id: string) => void;

  // Candidates
  addCandidate: (data: Omit<Candidate, 'id' | 'appliedAt' | 'lastActivityAt'>) => Candidate;
  updateCandidate: (id: string, data: Partial<Candidate>) => void;
  updateCandidateStage: (id: string, stage: CandidateStage) => void;
  addCandidateNote: (id: string, body: string) => void;
  deleteCandidate: (id: string) => void;

  // Users
  addUser: (data: Omit<User, 'id'>) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Checklists
  addChecklist: (data: Omit<ChecklistTemplate, 'id'>) => ChecklistTemplate;
  updateChecklist: (id: string, data: Partial<ChecklistTemplate>) => void;
  deleteChecklist: (id: string) => void;
  toggleChecklistItemForCandidate: (candidateId: string, checklistId: string, itemId: string) => void;

  resetData: () => void;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function getInitialState(): PersistedState {
  const stored = loadFromStorage<PersistedState>(STORAGE_KEY);
  if (stored) return stored;
  return {
    jobs: seedJobs,
    candidates: seedCandidates,
    users: seedUsers,
    checklists: seedChecklists,
    currentUserId: seedUsers[0]?.id ?? '',
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => getInitialState());

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state);
  }, [state]);

  const currentUser = useMemo(() => {
    return state.users.find((u) => u.id === state.currentUserId) ?? state.users[0];
  }, [state.users, state.currentUserId]);

  const value: AppDataContextValue = {
    jobs: state.jobs,
    candidates: state.candidates,
    users: state.users,
    checklists: state.checklists,
    currentUser,
    setCurrentUserId: (id) => setState((s) => ({ ...s, currentUserId: id })),

    addJob: (data) => {
      const job: Job = {
        ...data,
        id: generateId('job'),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setState((s) => ({ ...s, jobs: [job, ...s.jobs] }));
      return job;
    },
    updateJob: (id, data) => {
      setState((s) => ({
        ...s,
        jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...data, updatedAt: nowIso() } : j)),
      }));
    },
    deleteJob: (id) => {
      setState((s) => ({
        ...s,
        jobs: s.jobs.filter((j) => j.id !== id),
        candidates: s.candidates.filter((c) => c.jobId !== id),
      }));
    },

    addCandidate: (data) => {
      const candidate: Candidate = {
        ...data,
        id: generateId('cand'),
        appliedAt: nowIso(),
        lastActivityAt: nowIso(),
      };
      setState((s) => ({ ...s, candidates: [candidate, ...s.candidates] }));
      return candidate;
    },
    updateCandidate: (id, data) => {
      setState((s) => ({
        ...s,
        candidates: s.candidates.map((c) =>
          c.id === id ? { ...c, ...data, lastActivityAt: nowIso() } : c
        ),
      }));
    },
    updateCandidateStage: (id, stage) => {
      setState((s) => ({
        ...s,
        candidates: s.candidates.map((c) => {
          if (c.id !== id) return c;
          if (c.stage === stage) return c;
          const activity: CandidateActivity = {
            id: generateId('act'),
            type: 'StageChange',
            from: c.stage,
            to: stage,
            at: nowIso(),
            by: currentUser?.name ?? 'System',
          };
          return {
            ...c,
            stage,
            lastActivityAt: nowIso(),
            activity: [...(c.activity ?? []), activity],
          };
        }),
      }));
    },
    addCandidateNote: (id, body) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      setState((s) => ({
        ...s,
        candidates: s.candidates.map((c) => {
          if (c.id !== id) return c;
          const note: CandidateNote = {
            id: generateId('note'),
            body: trimmed,
            at: nowIso(),
            by: currentUser?.name ?? 'System',
          };
          const activity: CandidateActivity = {
            id: generateId('act'),
            type: 'Note',
            at: nowIso(),
            by: currentUser?.name ?? 'System',
            note: trimmed,
          };
          return {
            ...c,
            notes: [...(c.notes ?? []), note],
            activity: [...(c.activity ?? []), activity],
            lastActivityAt: nowIso(),
          };
        }),
      }));
    },
    deleteCandidate: (id) => {
      setState((s) => ({ ...s, candidates: s.candidates.filter((c) => c.id !== id) }));
    },

    addUser: (data) => {
      const user: User = { ...data, id: generateId('user') };
      setState((s) => ({ ...s, users: [...s.users, user] }));
      return user;
    },
    updateUser: (id, data) => {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
      }));
    },
    deleteUser: (id) => {
      setState((s) => ({
        ...s,
        users: s.users.filter((u) => u.id !== id),
        currentUserId: s.currentUserId === id ? s.users[0]?.id ?? '' : s.currentUserId,
      }));
    },

    addChecklist: (data) => {
      const cl: ChecklistTemplate = { ...data, id: generateId('cl') };
      setState((s) => ({ ...s, checklists: [...s.checklists, cl] }));
      return cl;
    },
    updateChecklist: (id, data) => {
      setState((s) => ({
        ...s,
        checklists: s.checklists.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }));
    },
    deleteChecklist: (id) => {
      setState((s) => ({ ...s, checklists: s.checklists.filter((c) => c.id !== id) }));
    },
    toggleChecklistItemForCandidate: (candidateId, checklistId, itemId) => {
      setState((s) => ({
        ...s,
        candidates: s.candidates.map((c) => {
          if (c.id !== candidateId) return c;
          const progress = { ...(c.checklistProgress ?? {}) };
          const completed = Array.isArray(progress[checklistId]) ? [...progress[checklistId]] : [];
          const idx = completed.indexOf(itemId);
          if (idx >= 0) completed.splice(idx, 1);
          else completed.push(itemId);
          progress[checklistId] = completed;
          return { ...c, checklistProgress: progress, lastActivityAt: nowIso() };
        }),
      }));
    },

    resetData: () => {
      setState({
        jobs: seedJobs,
        candidates: seedCandidates,
        users: seedUsers,
        checklists: seedChecklists,
        currentUserId: seedUsers[0]?.id ?? '',
      });
    },
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}

export function isAdmin(role: Role): boolean {
  return role === 'Admin';
}

export function canEdit(role: Role): boolean {
  return role === 'Admin' || role === 'Recruiter';
}

export function canEditJob(role: Role): boolean {
  return role === 'Admin' || role === 'Recruiter';
}

export type { ChecklistItem };
