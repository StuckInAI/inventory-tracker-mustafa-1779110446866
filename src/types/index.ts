// Core domain types for the ATS app

export type Role = 'Admin' | 'Recruiter' | 'HiringManager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export type JobStatus = 'Draft' | 'Open' | 'OnHold' | 'Closed';
export type EmploymentType = 'FullTime' | 'PartTime' | 'Contract' | 'Internship';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type Stage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export const STAGES: Stage[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export type ActivityEntry = {
  id: string;
  at: string;
  type: 'StageChange' | 'Note' | 'Applied' | 'ChecklistItem';
  message: string;
  byUserId?: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  stage: Stage;
  source?: string;
  resumeSummary?: string;
  appliedAt: string;
  lastActivityAt: string;
  activity: ActivityEntry[];
  checklistProgress?: Record<string, string[]>; // templateId -> completed itemIds
};

export type ChecklistItem = {
  id: string;
  label: string;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  description?: string;
  appliesToStage?: Stage;
  items: ChecklistItem[];
};

export type AppDataContextValue = {
  currentUser: User;
  setCurrentUserId: (id: string) => void;
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  checklistTemplates: ChecklistTemplate[];
  addJob: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Job;
  updateJob: (id: string, data: Partial<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteJob: (id: string) => void;
  addCandidate: (data: Omit<Candidate, 'id' | 'appliedAt' | 'lastActivityAt' | 'activity'>) => Candidate;
  updateCandidate: (id: string, data: Partial<Candidate>) => void;
  moveCandidateStage: (id: string, stage: Stage) => void;
  addCandidateNote: (id: string, note: string) => void;
  toggleChecklistItem: (candidateId: string, templateId: string, itemId: string) => void;
  addUser: (data: Omit<User, 'id'>) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  removeUser: (id: string) => void;
};
