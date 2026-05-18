import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Edit3 } from 'lucide-react';
import { useAppData, canEdit } from '@/hooks/useAppData';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StageBadge from '@/components/ui/StageBadge';
import EmptyState from '@/components/ui/EmptyState';
import JobFormModal from '@/components/jobs/JobFormModal';
import { initials, formatDate, formatRelative } from '@/lib/format';
import type { CandidateStage } from '@/types';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, candidates, currentUser, updateCandidateStage, users } = useAppData();
  const [editing, setEditing] = useState(false);
  const [stageFilter, setStageFilter] = useState<CandidateStage | 'All'>('All');

  const job = jobs.find((j) => j.id === jobId);
  const jobCandidates = useMemo(() => {
    if (!job) return [];
    return candidates
      .filter((c) => c.jobId === job.id)
      .filter((c) => stageFilter === 'All' || c.stage === stageFilter);
  }, [candidates, job, stageFilter]);

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="This job may have been removed."
        action={<Link to="/jobs"><Button variant="secondary">Back to jobs</Button></Link>}
      />
    );
  }

  const owner = users.find((u) => u.id === job.ownerId);
  const stages: (CandidateStage | 'All')[] = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={14} /> All jobs
      </Link>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{job.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: 'var(--color-text-muted)', marginTop: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Briefcase size={14} /> {job.department}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {job.location}</span>
              <span>{job.employmentType.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge tone={job.status === 'Open' ? 'success' : job.status === 'Draft' ? 'neutral' : job.status === 'Closed' ? 'danger' : 'warning'} size="md">
              {job.status}
            </Badge>
            {canEdit(currentUser.role) && (
              <Button variant="secondary" size="sm" icon={<Edit3 size={14} />} onClick={() => setEditing(true)}>Edit</Button>
            )}
          </div>
        </div>
        <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.7 }}>{job.description}</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 18, fontSize: 12, color: 'var(--color-text-muted)' }}>
          <span>Owner: {owner?.name ?? 'Unassigned'}</span>
          <span>Created {formatDate(job.createdAt)}</span>
          <span>Updated {formatRelative(job.updatedAt)}</span>
        </div>
      </Card>

      <Card padded={false}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)' }}>
          <CardHeader title={`Candidates (${jobCandidates.length})`} subtitle="Pipeline for this role" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as CandidateStage | 'All')}
            style={{ padding: '8px 12px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', fontSize: 13, background: 'var(--color-surface)' }}
          >
            {stages.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All stages' : s}</option>
            ))}
          </select>
        </div>

        {jobCandidates.length === 0 ? (
          <div style={{ padding: 24 }}>
            <EmptyState title="No candidates yet" description="Candidates who apply will appear here." />
          </div>
        ) : (
          <div>
            {jobCandidates.map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: 12, flexShrink: 0,
                }}>
                  {initials(c.fullName)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/candidates/${c.id}`} style={{ fontSize: 13, fontWeight: 600 }}>{c.fullName}</Link>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    Applied {formatRelative(c.appliedAt)} • {c.source ?? '—'}
                  </div>
                </div>
                {canEdit(currentUser.role) ? (
                  <select
                    value={c.stage}
                    onChange={(e) => updateCandidateStage(c.id, e.target.value as CandidateStage)}
                    style={{ padding: '6px 10px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', fontSize: 12, background: 'var(--color-surface)' }}
                  >
                    {(['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'] as CandidateStage[]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <StageBadge stage={c.stage} />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {editing && <JobFormModal job={job} onClose={() => setEditing(false)} />}
    </div>
  );
}
