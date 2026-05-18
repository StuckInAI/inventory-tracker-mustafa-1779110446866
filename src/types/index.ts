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
  type: 'stage_change' | 'note' | 'applied' | 'created' | 'other';
  by?: string;
  at: string;
  fromStage?: CandidateStage;
  toStage?: CandidateStage;
  message?: string;
};

export type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  jobId: string;
  stage: CandidateStage;
  resumeUrl?: string;
  source?: string;
  appliedAt: string;
  notes: CandidateNote[];
  activity: CandidateActivity[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  required?: boolean;
  done?: boolean;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  description?: string;
  appliesToStage?: CandidateStage;
  items: ChecklistItem[];
};
