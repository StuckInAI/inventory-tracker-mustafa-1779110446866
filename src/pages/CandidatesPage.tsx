import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import StageBadge from '@/components/ui/StageBadge';
import { useAppData } from '@/hooks/useAppData';
import { formatDate, initials } from '@/lib/format';
import type { Stage } from '@/types';

const STAGES: Array<'All' | Stage> = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function CandidatesPage() {
  const { candidates, jobs } = useAppData();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<'All' | Stage>('All');

  const jobById = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return candidates.filter((c) => {
      if (stageFilter !== 'All' && c.stage !== stageFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (jobById.get(c.jobId)?.title.toLowerCase() ?? '').includes(q)
      );
    });
  }, [candidates, search, stageFilter, jobById]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Candidates</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Browse and track all applicants in your pipeline.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '9px 12px 9px 34px', fontSize: 13, outline: 'none' }}
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as 'All' | Stage)}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '9px 12px', fontSize: 13 }}
        >
          {STAGES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All stages' : s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Users size={20} />} title="No candidates found" description="Try adjusting your search or filters." />
        </Card>
      ) : (
        <Card padded={false}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((c, idx) => {
              const job = jobById.get(c.jobId);
              return (
                <Link
                  key={c.id}
                  to={`/candidates/${c.id}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 120px 120px',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 20px',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
                      {initials(c.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{c.email}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{job?.title ?? '—'}</div>
                  <StageBadge stage={c.stage} />
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'right' }}>{formatDate(c.appliedAt)}</div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
