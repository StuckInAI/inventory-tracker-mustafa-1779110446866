import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import StageBadge from '@/components/ui/StageBadge';
import { useAppData, canEditJob } from '@/hooks/useAppData';
import { formatDate, initials } from '@/lib/format';
import type { Stage } from '@/types';

const STAGES: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { candidates, jobs, currentUser, updateCandidateStage, addCandidateNote } = useAppData();
  const candidate = candidates.find((c) => c.id === candidateId);
  const [note, setNote] = useState('');

  if (!candidate) {
    return (
      <div>
        <Link to="/candidates">← Back</Link>
        <Card><EmptyState title="Candidate not found" /></Card>
      </div>
    );
  }

  const job = jobs.find((j) => j.id === candidate.jobId);
  const canEdit = canEditJob(currentUser.role);

  function submitNote() {
    if (!note.trim()) return;
    addCandidateNote(candidate!.id, note.trim(), currentUser.id);
    setNote('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Link to="/candidates" style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <ArrowLeft size={14} /> Back to candidates
      </Link>

      <Card>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>
            {initials(candidate.name)}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>{candidate.name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={13} /> {candidate.email}</span>
              {candidate.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={13} /> {candidate.phone}</span>}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <StageBadge stage={candidate.stage} />
              {job && <Badge tone="neutral">Applied to {job.title}</Badge>}
              <Badge tone="neutral">Applied {formatDate(candidate.appliedAt)}</Badge>
            </div>
          </div>
          {canEdit && (
            <select
              value={candidate.stage}
              onChange={(e) => updateCandidateStage(candidate.id, e.target.value as Stage)}
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 13 }}
            >
              {STAGES.map((s) => <option key={s} value={s}>Move to {s}</option>)}
            </select>
          )}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Notes</h3>
          {canEdit && (
            <div style={{ marginBottom: 14 }}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this candidate..."
                style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: 10, fontSize: 13, minHeight: 70, fontFamily: 'inherit' }}
              />
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <Button size="sm" onClick={submitNote} disabled={!note.trim()}>Add Note</Button>
              </div>
            </div>
          )}
          {candidate.notes.length === 0 ? (
            <EmptyState title="No notes yet" description="Notes added by the team will appear here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {candidate.notes.map((n) => (
                <div key={n.id} style={{ padding: 12, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>{n.body}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>{formatDate(n.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Activity</h3>
          {candidate.activity.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {candidate.activity.slice().reverse().map((a) => (
                <div key={a.id} style={{ fontSize: 12 }}>
                  <div>{a.message}</div>
                  <div style={{ color: 'var(--color-text-muted)', marginTop: 2 }}>{formatDate(a.at)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
