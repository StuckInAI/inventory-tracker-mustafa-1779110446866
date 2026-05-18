// Shared types for the ATS app

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
  assignedRecruiterIds?: string[];
  createdAt: string;
  updatedAt: string;
};

export type Stage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'BackgroundCheck'
  | 'Onboarding'
  | 'Hired'
  | 'Rejected';

export const PIPELINE_STAGES: Stage[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'BackgroundCheck',
  'Onboarding',
  'Hired',
  'Rejected',
];

export type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  jobId: string;
  stage: Stage;
  source?: string;
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
  assignedRecruiterId?: string;
  appliedAt: string;
  lastActivityAt: string;
  checklistProgress?: Record<string, boolean>;
};

export type ChecklistItem = {
  id: string;
  label: string;
  required?: boolean;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  stage: Stage;
  items: ChecklistItem[];
};

export type ActivityLog = {
  id: string;
  candidateId: string;
  message: string;
  actorId: string;
  createdAt: string;
};
