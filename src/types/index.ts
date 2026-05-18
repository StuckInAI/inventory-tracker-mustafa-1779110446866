export type Role = 'Admin' | 'Recruiter' | 'HiringManager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
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
  type: 'stage_change' | 'note' | 'applied' | 'created' | 'other';
  at: string;
  by?: string;
  from?: Stage;
  to?: Stage;
  message?: string;
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
  tags?: string[];
  notes: CandidateNote[];
  activity: CandidateActivity[];
  createdAt: string;
  lastActivityAt: string;
  checklistProgress?: Record<string, Record<string, boolean>>;
};

export type ChecklistItem = {
  id: string;
  label: string;
};

export type Checklist = {
  id: string;
  name: string;
  stage: Stage;
  items: ChecklistItem[];
};
