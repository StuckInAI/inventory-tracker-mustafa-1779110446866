import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import StageBadge from '@/components/ui/StageBadge';
import { useAppData, canEditJob } from '@/hooks/useAppData';
import { formatDate, initials } from '@/lib/format';
import type { Candidate, Stage } from '@/types';

const STAGES: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, candidates, currentUser, updateCandidateStage, users } = useAppData();
  const job = jobs.find((j) => j.id === jobId);
  const [activeStage, setActiveStage] = useState<Stage>('Applied');

  const jobCandidates = useMemo(
    () => candidates.filter((c) => c.jobId === jobId),
    [candidates, jobId]
  );

  const byStage = useMemo(() => {
    const map = new Map<Stage, Candidate[]>();
    STAGES.forEach((s) => map.set(s, []));
    jobCandidates.forEach((c) => {
      const arr = map.get(c.stage) ?? [];
      arr.push(c);
      map.set(c.stage, arr);
    });
    return map;
  }, [jobCandidates]);

  const owner = job ? users.find((u) => u.id === job.ownerId) : undefined;

  if (!job) {
    return (
      <div>
        <Link to="/jobs">← Back to jobs</Link>
        <Card><EmptyState title="Job not found" description="This job may have been removed." /></Card>
      </div>
    );
  }

  const canEdit = canEditJob(currentUser.role);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Link to="/jobs" style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Back to jobs
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{job.title}</h1>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
            {job.department} · {job.location} · {job.employmentType} · Created {formatDate(job.createdAt)}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <Badge tone="primary">{job.status}</Badge>
            {owner && <Badge tone="neutral">Owner: {owner.name}</Badge>}
          </div>
        </div>
      </div>

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Description</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {job.description || 'No description provided.'}
        </p>
      </Card>

      <div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {STAGES.map((s) => {
            const count = byStage.get(s)?.length ?? 0;
            const isActive = activeStage === s;
            return (
              <button
                key={s}
                onClick={() => setActiveStage(s)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid ' + (isActive ? 'var(--color-primary)' : 'var(--color-border)'),
                  background: isActive ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {s} <span style={{ opacity: 0.7, marginLeft: 4 }}>{count}</span>
              </button>
            );
          })}
        </div>

        <Card>
          {(byStage.get(activeStage) ?? []).length === 0 ? (
            <EmptyState
              icon={<Plus size={20} />}
              title={`No candidates in ${activeStage}`}
              description="Candidates in this stage will appear here."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(byStage.get(activeStage) ?? []).map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
                      {initials(c.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <Link to={`/candidates/${c.id}`} style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</Link>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{c.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StageBadge stage={c.stage} />
                    {canEdit && (
                      <select
                        value={c.stage}
                        onChange={(e) => updateCandidateStage(c.id, e.target.value as Stage)}
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '6px 8px', fontSize: 12 }}
                      >
                        {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
