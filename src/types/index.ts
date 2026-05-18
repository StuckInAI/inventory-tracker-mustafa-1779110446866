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

export type PipelineStage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export const PIPELINE_STAGES: PipelineStage[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export type CandidateNote = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type CandidateActivity = {
  id: string;
  type: 'StageChange' | 'Note' | 'Created' | 'Updated';
  message: string;
  createdAt: string;
  authorId?: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  stage: PipelineStage;
  source?: string;
  resumeSummary?: string;
  rating?: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  notes: CandidateNote[];
  activity: CandidateActivity[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type Checklist = {
  id: string;
  name: string;
  stage: PipelineStage;
  description?: string;
  items: ChecklistItem[];
  createdAt: string;
};
