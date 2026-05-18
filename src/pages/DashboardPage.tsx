import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock, AlertTriangle, CheckSquare, ArrowRight } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StageBadge from '@/components/ui/StageBadge';
import EmptyState from '@/components/ui/EmptyState';
import { PIPELINE_STAGES } from '@/types';
import { formatDate, daysSince, initials } from '@/lib/format';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { currentUser, jobs, candidates, users, progress, checklistTemplates } = useAppData();

  const openJobs = jobs.filter((j) => j.status === 'Open');
  const myJobs =
    currentUser.role === 'Recruiter'
      ? openJobs.filter((j) => j.assignedRecruiterIds.includes(currentUser.id))
      : openJobs;

  const recentApplications = [...candidates]
    .filter((c) => c.source === 'CareersPage')
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  const stuckCandidates = candidates
    .filter((c) => daysSince(c.lastActivityAt) >= 3 && c.stage !== 'Hired' && c.stage !== 'Rejected')
    .filter((c) => currentUser.role !== 'Recruiter' || c.assignedRecruiterId === currentUser.id)
    .slice(0, 5);

  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: candidates.filter((c) => c.stage === stage).length,
  }));

  const recruiterWorkload = users
    .filter((u) => u.role === 'Recruiter' && u.active)
    .map((u) => ({
      user: u,
      open: candidates.filter(
        (c) => c.assignedRecruiterId === u.id && c.stage !== 'Hired' && c.stage !== 'Rejected'
      ).length,
    }));

  const pendingChecklistItems = candidates
    .filter((c) => c.stage === 'Onboarding' || c.stage === 'BackgroundCheck')
    .filter((c) => currentUser.role !== 'Recruiter' || c.assignedRecruiterId === currentUser.id)
    .map((c) => {
      const tpl = checklistTemplates.find((t) => t.stage === c.stage);
      if (!tpl) return null;
      const p = progress.find((pp) => pp.candidateId === c.id && pp.templateId === tpl.id);
      const completed = p ? p.completedItemIds.length : 0;
      const total = tpl.items.length;
      if (completed >= total) return null;
      return { candidate: c, tpl, completed, total };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        <StatCard
          icon={<Briefcase size={20} />}
          label="Open Jobs"
          value={openJobs.length}
          accent="primary"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Active Candidates"
          value={candidates.filter((c) => c.stage !== 'Hired' && c.stage !== 'Rejected').length}
          accent="info"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="New This Week"
          value={candidates.filter((c) => daysSince(c.appliedAt) <= 7).length}
          accent="warning"
        />
        <StatCard
          icon={<CheckSquare size={20} />}
          label="In Onboarding"
          value={candidates.filter((c) => c.stage === 'Onboarding' || c.stage === 'BackgroundCheck').length}
          accent="success"
        />
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader
            title="Pipeline overview"
            subtitle="Candidates per stage across all jobs"
          />
          <div className={styles.stageList}>
            {stageCounts.map(({ stage, count }) => (
              <div key={stage} className={styles.stageRow}>
                <StageBadge stage={stage} />
                <div className={styles.stageBar}>
                  <div
                    className={styles.stageBarFill}
                    style={{
                      width: `${Math.max(
                        4,
                        (count / Math.max(1, Math.max(...stageCounts.map((s) => s.count)))) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className={styles.stageCount}>{count}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title={currentUser.role === 'Recruiter' ? 'My open jobs' : 'Open jobs'}
            subtitle={`${myJobs.length} active position${myJobs.length === 1 ? '' : 's'}`}
            action={
              <Link to="/jobs" className={styles.link}>
                View all <ArrowRight size={14} />
              </Link>
            }
          />
          {myJobs.length === 0 ? (
            <EmptyState title="No open jobs" description="Create a job to start receiving applications." />
          ) : (
            <div className={styles.list}>
              {myJobs.slice(0, 5).map((job) => {
                const count = candidates.filter((c) => c.jobId === job.id).length;
                return (
                  <Link key={job.id} to={`/jobs/${job.id}`} className={styles.listItem}>
                    <div>
                      <div className={styles.itemTitle}>{job.title}</div>
                      <div className={styles.itemSub}>
                        {job.department} · {job.location}
                      </div>
                    </div>
                    <Badge tone="info">{count} candidates</Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader
            title="Recent applications"
            subtitle="Latest submissions from the Careers Page"
          />
          {recentApplications.length === 0 ? (
            <EmptyState title="No recent applications" />
          ) : (
            <div className={styles.list}>
              {recentApplications.map((c) => {
                const job = jobs.find((j) => j.id === c.jobId);
                return (
                  <Link key={c.id} to={`/candidates/${c.id}`} className={styles.listItem}>
                    <div className={styles.candidateRow}>
                      <div className={styles.avatar}>{initials(c.fullName)}</div>
                      <div>
                        <div className={styles.itemTitle}>{c.fullName}</div>
                        <div className={styles.itemSub}>
                          {job?.title ?? '—'} · {formatDate(c.appliedAt)}
                        </div>
                      </div>
                    </div>
                    <StageBadge stage={c.stage} />
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Needs attention"
            subtitle="Candidates without recent activity (3+ days)"
          />
          {stuckCandidates.length === 0 ? (
            <EmptyState
              icon={<AlertTriangle size={20} />}
              title="All caught up!"
              description="Every candidate has recent activity."
            />
          ) : (
            <div className={styles.list}>
              {stuckCandidates.map((c) => (
                <Link key={c.id} to={`/candidates/${c.id}`} className={styles.listItem}>
                  <div className={styles.candidateRow}>
                    <div className={styles.avatar}>{initials(c.fullName)}</div>
                    <div>
                      <div className={styles.itemTitle}>{c.fullName}</div>
                      <div className={styles.itemSub}>
                        No activity for {daysSince(c.lastActivityAt)} days
                      </div>
                    </div>
                  </div>
                  <StageBadge stage={c.stage} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader title="Pending checklist items" subtitle="Onboarding & background-check progress" />
          {pendingChecklistItems.length === 0 ? (
            <EmptyState title="No pending checklist work" />
          ) : (
            <div className={styles.list}>
              {pendingChecklistItems.map(({ candidate, tpl, completed, total }) => (
                <Link key={candidate.id} to={`/candidates/${candidate.id}`} className={styles.listItem}>
                  <div className={styles.candidateRow}>
                    <div className={styles.avatar}>{initials(candidate.fullName)}</div>
                    <div>
                      <div className={styles.itemTitle}>{candidate.fullName}</div>
                      <div className={styles.itemSub}>
                        {tpl.name} — {completed}/{total} complete
                      </div>
                    </div>
                  </div>
                  <StageBadge stage={candidate.stage} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Recruiter workload" subtitle="Open candidates assigned per recruiter" />
          {recruiterWorkload.length === 0 ? (
            <EmptyState title="No recruiters yet" />
          ) : (
            <div className={styles.list}>
              {recruiterWorkload.map(({ user, open }) => (
                <div key={user.id} className={styles.listItem}>
                  <div className={styles.candidateRow}>
                    <div className={styles.avatar}>{initials(user.name)}</div>
                    <div>
                      <div className={styles.itemTitle}>{user.name}</div>
                      <div className={styles.itemSub}>{user.email}</div>
                    </div>
                  </div>
                  <Badge tone={open > 5 ? 'warning' : 'info'}>{open} open</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: 'primary' | 'info' | 'warning' | 'success';
}) {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[`accent_${accent}`]}`}>{icon}</div>
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}
