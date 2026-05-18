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

export type CandidateStage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export type CandidateNote = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
};

export type CandidateActivity = {
  id: string;
  type: 'StageChange' | 'Note' | 'Created' | 'Updated' | 'Applied' | 'Other';
  message?: string;
  by?: string;
  at: string;
  authorId?: string;
  createdAt?: string;
};

export type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  jobId: string;
  stage: CandidateStage;
  source?: string;
  resumeUrl?: string;
  appliedAt: string;
  lastActivityAt: string;
  notes: CandidateNote[];
  activity: CandidateActivity[];
  checklistProgress?: Record<string, Record<string, boolean>>;
};

export type ChecklistItem = {
  id: string;
  label: string;
};

export type Checklist = {
  id: string;
  name: string;
  description?: string;
  stage?: CandidateStage;
  items: ChecklistItem[];
};
