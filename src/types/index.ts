export type Role = 'Admin' | 'Recruiter' | 'HiringManager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  title?: string;
  avatarColor?: string;
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

export type CandidateNote = {
  id: string;
  body: string;
  by: string;
  at: string;
};

export type CandidateActivity = {
  id: string;
  type: 'stage_change' | 'note' | 'applied' | 'created';
  at: string;
  by?: string;
  from?: Stage;
  to?: Stage;
  note?: string;
  message?: string;
};

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobId: string;
  stage: Stage;
  source?: string;
  resumeSummary?: string;
  skills?: string[];
  notes: CandidateNote[];
  activity: CandidateActivity[];
  checklistProgress?: Record<string, Record<string, boolean>>;
  appliedAt: string;
  lastActivityAt: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  description?: string;
  stage?: Stage;
  items: ChecklistItem[];
};
