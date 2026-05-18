import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import Card from '@/components/ui/Card';
import StageBadge from '@/components/ui/StageBadge';
import EmptyState from '@/components/ui/EmptyState';
import { initials, formatRelative } from '@/lib/format';
import type { CandidateStage } from '@/types';

const stageOptions: (CandidateStage | 'All')[] = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function CandidatesPage() {
  const { candidates, jobs } = useAppData();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<CandidateStage | 'All'>('All');
  const [jobFilter, setJobFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return candidates.filter((c) => {
      if (stageFilter !== 'All' && c.stage !== stageFilter) return false;
      if (jobFilter !== 'All' && c.jobId !== jobFilter) return false;
      if (!q) return true;
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.location ?? '').toLowerCase().includes(q)
      );
    });
  }, [candidates, search, stageFilter, jobFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Candidates</h1>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
          {candidates.length} total across {jobs.length} jobs
        </div>
      </div>

      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 12px 9px 36px',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as CandidateStage | 'All')}
            style={{ padding: '9px 12px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', fontSize: 13, background: 'var(--color-surface)' }}
          >
            {stageOptions.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All stages' : s}</option>
            ))}
          </select>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            style={{ padding: '9px 12px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', fontSize: 13, background: 'var(--color-surface)' }}
          >
            <option value="All">All jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card padded={false}>
        {filtered.length === 0 ? (
          <div style={{ padding: 24 }}>
            <EmptyState icon={<Users size={20} />} title="No candidates match these filters" description="Try clearing filters or adjusting the search." />
          </div>
        ) : (
          <div>
            {filtered.map((c) => {
              const job = jobs.find((j) => j.id === c.jobId);
              return (
                <Link
                  key={c.id}
                  to={`/candidates/${c.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 13, flexShrink: 0,
                  }}>
                    {initials(c.fullName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.fullName}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {job?.title ?? 'Job removed'} • {c.location ?? '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {formatRelative(c.lastActivityAt)}
                  </div>
                  <StageBadge stage={c.stage} />
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
