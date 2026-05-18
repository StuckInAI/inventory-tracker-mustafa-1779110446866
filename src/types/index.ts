export type Role = 'Admin' | 'Recruiter' | 'HiringManager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type JobStatus = 'Open' | 'Closed';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
  status: JobStatus;
  assignedRecruiterIds: string[];
  createdAt: string;
};

export type PipelineStage =
  | 'Applied'
  | 'Referral'
  | 'Screened'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Onboarding'
  | 'BackgroundCheck';

export const PIPELINE_STAGES: PipelineStage[] = [
  'Applied',
  'Referral',
  'Screened',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
  'Onboarding',
  'BackgroundCheck',
];

export type Candidate = {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resumeFileName: string;
  tags: string[];
  stage: PipelineStage;
  assignedRecruiterId: string | null;
  appliedAt: string;
  lastActivityAt: string;
  source: 'CareersPage' | 'Internal';
};

export type TimelineEntryType = 'note' | 'email' | 'stage_change' | 'system';

export type TimelineEntry = {
  id: string;
  candidateId: string;
  type: TimelineEntryType;
  authorId: string | null;
  authorName: string;
  createdAt: string;
  content: string;
  subject?: string;
  fromStage?: PipelineStage;
  toStage?: PipelineStage;
};

export type ChecklistItem = {
  id: string;
  label: string;
  requiresForm: boolean;
  formTemplate?: string;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  stage: 'Onboarding' | 'BackgroundCheck';
  items: ChecklistItem[];
};

export type CandidateChecklistProgress = {
  candidateId: string;
  templateId: string;
  completedItemIds: string[];
  formSubmissions: Record<string, string>;
};
