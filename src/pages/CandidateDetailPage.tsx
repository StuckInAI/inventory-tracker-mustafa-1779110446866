import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppData } from '@/hooks/useAppData';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import StageBadge from '@/components/ui/StageBadge';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { initials, formatDate, formatRelative } from '@/lib/format';
import type { CandidateStage } from '@/types';

const stages: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { candidates, jobs, currentUser, updateCandidateStage, addCandidateNote } = useAppData();
  const [note, setNote] = useState('');

  const candidate = candidates.find((c) => c.id === candidateId);
  if (!candidate) {
    return (
      <EmptyState
        title="Candidate not found"
        description="This candidate may have been removed."
        action={<Link to="/candidates"><Button variant="secondary">Back to candidates</Button></Link>}
      />
    );
  }

  const job = jobs.find((j) => j.id === candidate.jobId);

  function handleAddNote() {
    if (!note.trim()) return;
    addCandidateNote(candidate!.id, note);
    setNote('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 18,
        }}>
          {initials(candidate.fullName)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>{candidate.fullName}</h1>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {candidate.email}{candidate.location ? ` • ${candidate.location}` : ''}
          </div>
        </div>
        <StageBadge stage={candidate.stage} />
      </div>

      <Card>
        <CardHeader title="Pipeline" subtitle={job ? `Applied to ${job.title}` : 'Job removed'} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {stages.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === candidate.stage ? 'primary' : 'secondary'}
              onClick={() => updateCandidateStage(candidate.id, s)}
              disabled={currentUser.role === 'HiringManager'}
            >
              {s}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Profile" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, fontSize: 13 }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>Source</div>
            <div style={{ marginTop: 4 }}>{candidate.source ?? '—'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>Applied</div>
            <div style={{ marginTop: 4 }}>{formatDate(candidate.appliedAt)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>Last activity</div>
            <div style={{ marginTop: 4 }}>{formatRelative(candidate.lastActivityAt)}</div>
          </div>
        </div>
        {candidate.resumeSummary && (
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{candidate.resumeSummary}</p>
        )}
      </Card>

      <Card>
        <CardHeader title="Notes" subtitle="Internal notes shared with the hiring team" />
        <div style={{ marginBottom: 14 }}>
          <Field label="Add a note">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Share feedback, scheduling info, or context..." />
          </Field>
          <Button onClick={handleAddNote} disabled={!note.trim()} size="sm">Add note</Button>
        </div>
        {candidate.notes.length === 0 ? (
          <EmptyState title="No notes yet" description="Add the first note to capture context for the team." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {candidate.notes.slice().reverse().map((n) => (
              <div key={n.id} style={{ padding: 12, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{n.body}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
                  {n.by} • {formatRelative(n.at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Activity" />
        {candidate.activity.length === 0 ? (
          <EmptyState title="No activity yet" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {candidate.activity.slice().reverse().map((a) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  {a.type === 'StageChange' && (
                    <span>Moved from <Badge tone="neutral">{a.from}</Badge> to <Badge tone="info">{a.to}</Badge></span>
                  )}
                  {a.type === 'Note' && <span>Added a note</span>}
                  {a.type === 'Applied' && <span>Applied via {a.by}</span>}
                  {a.type === 'Other' && <span>{a.message ?? 'Activity'}</span>}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{formatRelative(a.at)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
