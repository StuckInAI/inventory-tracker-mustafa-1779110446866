import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Candidate,
  CandidateChecklistProgress,
  ChecklistTemplate,
  Job,
  PipelineStage,
  Role,
  TimelineEntry,
  User,
} from '@/types';
import { loadState, saveState, uid } from '@/lib/storage';
import {
  seedCandidates,
  seedChecklistTemplates,
  seedJobs,
  seedTimeline,
  seedUsers,
} from '@/lib/seed';

type AppDataContextValue = {
  currentUser: User;
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  timeline: TimelineEntry[];
  checklistTemplates: ChecklistTemplate[];
  progress: CandidateChecklistProgress[];
  setCurrentUserId: (id: string) => void;
  // user mgmt
  addUser: (input: { name: string; email: string; role: Role }) => void;
  toggleUserActive: (id: string) => void;
  updateUserRole: (id: string, role: Role) => void;
  // jobs
  addJob: (input: Omit<Job, 'id' | 'createdAt'>) => Job;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  // candidates
  addCandidate: (input: Omit<Candidate, 'id' | 'appliedAt' | 'lastActivityAt'>) => Candidate;
  updateCandidate: (id: string, patch: Partial<Candidate>) => void;
  moveCandidateStage: (id: string, toStage: PipelineStage) => void;
  assignCandidate: (id: string, recruiterId: string | null) => void;
  // timeline
  addNote: (candidateId: string, content: string) => void;
  sendEmail: (candidateId: string, subject: string, body: string) => void;
  // checklists
  addChecklistTemplate: (tpl: Omit<ChecklistTemplate, 'id'>) => void;
  toggleChecklistItem: (candidateId: string, templateId: string, itemId: string) => void;
  saveFormSubmission: (candidateId: string, templateId: string, itemId: string, value: string) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadState<User[]>('users', seedUsers));
  const [jobs, setJobs] = useState<Job[]>(() => loadState<Job[]>('jobs', seedJobs));
  const [candidates, setCandidates] = useState<Candidate[]>(() => loadState<Candidate[]>('candidates', seedCandidates));
  const [timeline, setTimeline] = useState<TimelineEntry[]>(() => loadState<TimelineEntry[]>('timeline', seedTimeline));
  const [checklistTemplates, setChecklistTemplates] = useState<ChecklistTemplate[]>(() =>
    loadState<ChecklistTemplate[]>('templates', seedChecklistTemplates)
  );
  const [progress, setProgress] = useState<CandidateChecklistProgress[]>(() =>
    loadState<CandidateChecklistProgress[]>('progress', [])
  );
  const [currentUserId, setCurrentUserIdState] = useState<string>(() =>
    loadState<string>('currentUserId', 'u_admin')
  );

  useEffect(() => saveState('users', users), [users]);
  useEffect(() => saveState('jobs', jobs), [jobs]);
  useEffect(() => saveState('candidates', candidates), [candidates]);
  useEffect(() => saveState('timeline', timeline), [timeline]);
  useEffect(() => saveState('templates', checklistTemplates), [checklistTemplates]);
  useEffect(() => saveState('progress', progress), [progress]);
  useEffect(() => saveState('currentUserId', currentUserId), [currentUserId]);

  const currentUser = useMemo<User>(() => {
    return users.find((u) => u.id === currentUserId) ?? users[0];
  }, [users, currentUserId]);

  const setCurrentUserId = useCallback((id: string) => setCurrentUserIdState(id), []);

  const addUser: AppDataContextValue['addUser'] = useCallback((input) => {
    const user: User = { id: uid('u'), name: input.name, email: input.email, role: input.role, active: true };
    setUsers((prev) => [...prev, user]);
  }, []);

  const toggleUserActive: AppDataContextValue['toggleUserActive'] = useCallback((id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  }, []);

  const updateUserRole: AppDataContextValue['updateUserRole'] = useCallback((id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }, []);

  const addJob: AppDataContextValue['addJob'] = useCallback((input) => {
    const job: Job = { ...input, id: uid('j'), createdAt: new Date().toISOString() };
    setJobs((prev) => [job, ...prev]);
    return job;
  }, []);

  const updateJob: AppDataContextValue['updateJob'] = useCallback((id, patch) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  const deleteJob: AppDataContextValue['deleteJob'] = useCallback((id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setCandidates((prev) => prev.filter((c) => c.jobId !== id));
  }, []);

  const addTimelineEntry = useCallback((entry: TimelineEntry) => {
    setTimeline((prev) => [entry, ...prev]);
  }, []);

  const addCandidate: AppDataContextValue['addCandidate'] = useCallback(
    (input) => {
      const now = new Date().toISOString();
      const c: Candidate = { ...input, id: uid('c'), appliedAt: now, lastActivityAt: now };
      setCandidates((prev) => [c, ...prev]);
      addTimelineEntry({
        id: uid('t'),
        candidateId: c.id,
        type: 'system',
        authorId: null,
        authorName: 'System',
        createdAt: now,
        content:
          input.source === 'CareersPage'
            ? 'Application received via Careers Page.'
            : 'Candidate added by internal staff.',
      });
      return c;
    },
    [addTimelineEntry]
  );

  const updateCandidate: AppDataContextValue['updateCandidate'] = useCallback((id, patch) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, lastActivityAt: new Date().toISOString() } : c))
    );
  }, []);

  const moveCandidateStage: AppDataContextValue['moveCandidateStage'] = useCallback(
    (id, toStage) => {
      setCandidates((prev) => {
        const c = prev.find((x) => x.id === id);
        if (!c) return prev;
        if (c.stage === toStage) return prev;
        const fromStage = c.stage;
        const now = new Date().toISOString();
        addTimelineEntry({
          id: uid('t'),
          candidateId: id,
          type: 'stage_change',
          authorId: currentUser.id,
          authorName: currentUser.name,
          createdAt: now,
          content: `Moved from ${fromStage} to ${toStage}.`,
          fromStage,
          toStage,
        });
        return prev.map((x) => (x.id === id ? { ...x, stage: toStage, lastActivityAt: now } : x));
      });
    },
    [addTimelineEntry, currentUser]
  );

  const assignCandidate: AppDataContextValue['assignCandidate'] = useCallback((id, recruiterId) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, assignedRecruiterId: recruiterId, lastActivityAt: new Date().toISOString() } : c
      )
    );
  }, []);

  const addNote: AppDataContextValue['addNote'] = useCallback(
    (candidateId, content) => {
      const now = new Date().toISOString();
      addTimelineEntry({
        id: uid('t'),
        candidateId,
        type: 'note',
        authorId: currentUser.id,
        authorName: currentUser.name,
        createdAt: now,
        content,
      });
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, lastActivityAt: now } : c)));
    },
    [addTimelineEntry, currentUser]
  );

  const sendEmail: AppDataContextValue['sendEmail'] = useCallback(
    (candidateId, subject, body) => {
      const now = new Date().toISOString();
      addTimelineEntry({
        id: uid('t'),
        candidateId,
        type: 'email',
        authorId: currentUser.id,
        authorName: currentUser.name,
        createdAt: now,
        subject,
        content: body,
      });
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, lastActivityAt: now } : c)));
    },
    [addTimelineEntry, currentUser]
  );

  const addChecklistTemplate: AppDataContextValue['addChecklistTemplate'] = useCallback((tpl) => {
    const t: ChecklistTemplate = { ...tpl, id: uid('tpl') };
    setChecklistTemplates((prev) => [...prev, t]);
  }, []);

  const ensureProgress = useCallback(
    (candidateId: string, templateId: string): CandidateChecklistProgress => {
      const existing = progress.find((p) => p.candidateId === candidateId && p.templateId === templateId);
      if (existing) return existing;
      const fresh: CandidateChecklistProgress = {
        candidateId,
        templateId,
        completedItemIds: [],
        formSubmissions: {},
      };
      setProgress((prev) => [...prev, fresh]);
      return fresh;
    },
    [progress]
  );

  const toggleChecklistItem: AppDataContextValue['toggleChecklistItem'] = useCallback(
    (candidateId, templateId, itemId) => {
      ensureProgress(candidateId, templateId);
      setProgress((prev) => {
        const exists = prev.find((p) => p.candidateId === candidateId && p.templateId === templateId);
        const base: CandidateChecklistProgress = exists ?? {
          candidateId,
          templateId,
          completedItemIds: [],
          formSubmissions: {},
        };
        const has = base.completedItemIds.includes(itemId);
        const updated: CandidateChecklistProgress = {
          ...base,
          completedItemIds: has
            ? base.completedItemIds.filter((i) => i !== itemId)
            : [...base.completedItemIds, itemId],
        };
        if (exists) {
          return prev.map((p) => (p === exists ? updated : p));
        }
        return [...prev, updated];
      });
    },
    [ensureProgress]
  );

  const saveFormSubmission: AppDataContextValue['saveFormSubmission'] = useCallback(
    (candidateId, templateId, itemId, value) => {
      ensureProgress(candidateId, templateId);
      setProgress((prev) => {
        const exists = prev.find((p) => p.candidateId === candidateId && p.templateId === templateId);
        const base: CandidateChecklistProgress = exists ?? {
          candidateId,
          templateId,
          completedItemIds: [],
          formSubmissions: {},
        };
        const updated: CandidateChecklistProgress = {
          ...base,
          formSubmissions: { ...base.formSubmissions, [itemId]: value },
        };
        if (exists) return prev.map((p) => (p === exists ? updated : p));
        return [...prev, updated];
      });
    },
    [ensureProgress]
  );

  const value: AppDataContextValue = {
    currentUser,
    users,
    jobs,
    candidates,
    timeline,
    checklistTemplates,
    progress,
    setCurrentUserId,
    addUser,
    toggleUserActive,
    updateUserRole,
    addJob,
    updateJob,
    deleteJob,
    addCandidate,
    updateCandidate,
    moveCandidateStage,
    assignCandidate,
    addNote,
    sendEmail,
    addChecklistTemplate,
    toggleChecklistItem,
    saveFormSubmission,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
  return ctx;
}

export function canEdit(role: Role): boolean {
  return role === 'Admin' || role === 'Recruiter';
}

export function isAdmin(role: Role): boolean {
  return role === 'Admin';
}
