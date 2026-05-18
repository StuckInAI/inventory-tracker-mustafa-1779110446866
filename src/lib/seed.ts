import type { Job, Candidate, User, ChecklistTemplate } from '@/types';

const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const seedUsers: User[] = [
  { id: 'user_admin', name: 'Alex Morgan', email: 'alex@talenttrack.io', role: 'Admin', active: true, title: 'Head of Talent' },
  { id: 'user_rec1', name: 'Priya Shah', email: 'priya@talenttrack.io', role: 'Recruiter', active: true, title: 'Senior Recruiter' },
  { id: 'user_rec2', name: 'Diego Ramirez', email: 'diego@talenttrack.io', role: 'Recruiter', active: true, title: 'Technical Recruiter' },
  { id: 'user_hm1', name: 'Sarah Chen', email: 'sarah@talenttrack.io', role: 'HiringManager', active: true, title: 'Engineering Manager' },
  { id: 'user_hm2', name: 'Marcus Johnson', email: 'marcus@talenttrack.io', role: 'HiringManager', active: true, title: 'Design Director' },
  { id: 'user_rec3', name: 'Emma Williams', email: 'emma@talenttrack.io', role: 'Recruiter', active: false, title: 'Recruiter' },
];

export const seedJobs: Job[] = [
  {
    id: 'job_se_001',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote — US',
    employmentType: 'FullTime',
    status: 'Open',
    description: 'Build and scale our core platform. Strong experience with TypeScript, distributed systems, and product-minded engineering.',
    ownerId: 'user_hm1',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(2),
  },
  {
    id: 'job_pd_002',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY',
    employmentType: 'FullTime',
    status: 'Open',
    description: 'Own end-to-end product design for our recruiting suite. Partner closely with engineering and PM to ship delightful experiences.',
    ownerId: 'user_hm2',
    createdAt: daysAgo(18),
    updatedAt: daysAgo(1),
  },
  {
    id: 'job_dm_003',
    title: 'Data Engineer',
    department: 'Engineering',
    location: 'Remote — EU',
    employmentType: 'FullTime',
    status: 'Open',
    description: 'Design and operate the data platform powering analytics and ML across the company.',
    ownerId: 'user_hm1',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(3),
  },
  {
    id: 'job_cs_004',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Austin, TX',
    employmentType: 'FullTime',
    status: 'OnHold',
    description: 'Champion our enterprise customers, drive adoption, and surface insights back to product.',
    ownerId: 'user_admin',
    createdAt: daysAgo(40),
    updatedAt: daysAgo(15),
  },
  {
    id: 'job_mk_005',
    title: 'Content Marketing Lead',
    department: 'Marketing',
    location: 'Remote — Global',
    employmentType: 'FullTime',
    status: 'Draft',
    description: 'Define and execute our content strategy across blog, email, and social.',
    ownerId: 'user_admin',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'job_ds_006',
    title: 'Design Intern',
    department: 'Design',
    location: 'New York, NY',
    employmentType: 'Internship',
    status: 'Closed',
    description: 'Summer internship for emerging designers. Closed for the season.',
    ownerId: 'user_hm2',
    createdAt: daysAgo(120),
    updatedAt: daysAgo(60),
  },
];

function makeCandidate(
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  jobId: string,
  stage: Candidate['stage'],
  appliedDays: number,
  source: string,
  location: string
): Candidate {
  const fullName = `${firstName} ${lastName}`;
  return {
    id,
    firstName,
    lastName,
    fullName,
    email,
    jobId,
    stage,
    source,
    location,
    appliedAt: daysAgo(appliedDays),
    lastActivityAt: daysAgo(Math.max(0, appliedDays - 2)),
    resumeSummary: `${fullName} brings strong experience across cross-functional teams.`,
    notes: [],
    activity: [
      {
        id: `${id}_act_applied`,
        type: 'Applied',
        at: daysAgo(appliedDays),
        by: 'Careers Page',
      },
    ],
    checklistProgress: {},
  };
}

export const seedCandidates: Candidate[] = [
  makeCandidate('cand_001', 'Jordan', 'Lee', 'jordan.lee@example.com', 'job_se_001', 'Interview', 14, 'Referral', 'Seattle, WA'),
  makeCandidate('cand_002', 'Maya', 'Patel', 'maya.patel@example.com', 'job_se_001', 'Screening', 9, 'LinkedIn', 'Remote — US'),
  makeCandidate('cand_003', 'Ethan', 'Brown', 'ethan.brown@example.com', 'job_se_001', 'Applied', 4, 'Careers Page', 'Austin, TX'),
  makeCandidate('cand_004', 'Sophia', 'Garcia', 'sophia.garcia@example.com', 'job_se_001', 'Offer', 21, 'Referral', 'Remote — US'),
  makeCandidate('cand_005', 'Liam', 'Nguyen', 'liam.nguyen@example.com', 'job_se_001', 'Rejected', 25, 'LinkedIn', 'San Jose, CA'),
  makeCandidate('cand_006', 'Ava', 'Martinez', 'ava.martinez@example.com', 'job_pd_002', 'Interview', 11, 'Dribbble', 'Brooklyn, NY'),
  makeCandidate('cand_007', 'Noah', 'Kim', 'noah.kim@example.com', 'job_pd_002', 'Screening', 6, 'Referral', 'New York, NY'),
  makeCandidate('cand_008', 'Isabella', 'Davis', 'isabella.davis@example.com', 'job_pd_002', 'Hired', 45, 'Careers Page', 'New York, NY'),
  makeCandidate('cand_009', 'Lucas', 'Wilson', 'lucas.wilson@example.com', 'job_dm_003', 'Applied', 3, 'Careers Page', 'Berlin, DE'),
  makeCandidate('cand_010', 'Mia', 'Anderson', 'mia.anderson@example.com', 'job_dm_003', 'Interview', 13, 'LinkedIn', 'Lisbon, PT'),
  makeCandidate('cand_011', 'Oliver', 'Thomas', 'oliver.thomas@example.com', 'job_dm_003', 'Screening', 7, 'Referral', 'Amsterdam, NL'),
  makeCandidate('cand_012', 'Charlotte', 'Taylor', 'charlotte.taylor@example.com', 'job_cs_004', 'Applied', 30, 'Careers Page', 'Austin, TX'),
  makeCandidate('cand_013', 'James', 'Moore', 'james.moore@example.com', 'job_cs_004', 'Screening', 28, 'LinkedIn', 'Dallas, TX'),
  makeCandidate('cand_014', 'Amelia', 'Jackson', 'amelia.jackson@example.com', 'job_mk_005', 'Applied', 2, 'Careers Page', 'Remote — US'),
  makeCandidate('cand_015', 'Benjamin', 'White', 'benjamin.white@example.com', 'job_se_001', 'Applied', 1, 'Careers Page', 'Remote — US'),
];

export const seedChecklists: ChecklistTemplate[] = [
  {
    id: 'cl_screen',
    name: 'Phone Screen',
    description: 'Initial recruiter screen to validate fit and motivation.',
    appliesToStage: 'Screening',
    items: [
      { id: 'cl_screen_1', label: 'Confirm role expectations and compensation range', required: true },
      { id: 'cl_screen_2', label: 'Validate work authorization and location', required: true },
      { id: 'cl_screen_3', label: 'Assess motivation for change', required: false },
      { id: 'cl_screen_4', label: 'Walk through resume highlights', required: false },
      { id: 'cl_screen_5', label: 'Schedule next step with hiring manager', required: true },
    ],
  },
  {
    id: 'cl_interview',
    name: 'Onsite Interview Loop',
    description: 'Standard onsite loop covering technical and behavioral signal.',
    appliesToStage: 'Interview',
    items: [
      { id: 'cl_interview_1', label: 'Technical deep-dive (60m)', required: true },
      { id: 'cl_interview_2', label: 'System design or portfolio review (60m)', required: true },
      { id: 'cl_interview_3', label: 'Behavioral with hiring manager (45m)', required: true },
      { id: 'cl_interview_4', label: 'Team & values fit (30m)', required: false },
      { id: 'cl_interview_5', label: 'Debrief notes submitted in scorecard', required: true },
    ],
  },
  {
    id: 'cl_offer',
    name: 'Offer Prep',
    description: 'Ensure approvals and offer details are ready before extending.',
    appliesToStage: 'Offer',
    items: [
      { id: 'cl_offer_1', label: 'Compensation approved by Finance', required: true },
      { id: 'cl_offer_2', label: 'References checked (2 minimum)', required: true },
      { id: 'cl_offer_3', label: 'Offer letter generated', required: true },
      { id: 'cl_offer_4', label: 'Start date confirmed with candidate', required: false },
    ],
  },
];
