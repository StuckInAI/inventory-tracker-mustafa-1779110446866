export type Role = 'Admin' | 'Recruiter' | 'HiringManager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  title?: string;
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

export type CandidateStage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export type CandidateNote = {
  id: string;
  body: string;
  at: string;
  by: string;
};

export type CandidateActivity = {
  id: string;
  type: 'StageChange' | 'Note' | 'Applied' | 'Other';
  at: string;
  by: string;
  from?: CandidateStage;
  to?: CandidateStage;
  note?: string;
  message?: string;
};

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  jobId: string;
  stage: CandidateStage;
  source?: string;
  location?: string;
  resumeSummary?: string;
  appliedAt: string;
  lastActivityAt: string;
  notes: CandidateNote[];
  activity: CandidateActivity[];
  checklistProgress?: Record<string, string[]>;
  tags?: string[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  required?: boolean;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  description?: string;
  appliesToStage?: CandidateStage;
  items: ChecklistItem[];
};
