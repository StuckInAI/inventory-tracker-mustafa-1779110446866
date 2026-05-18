import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StageBadge from '@/components/ui/StageBadge';
import { initials, formatRelative } from '@/lib/format';
import type { CandidateStage } from '@/types';

const pipelineStages: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

export default function DashboardPage() {
  const { jobs, candidates, currentUser } = useAppData();

  const stats = useMemo(() => {
    const openJobs = jobs.filter((j) => j.status === 'Open').length;
    const activeCandidates = candidates.filter((c) => c.stage !== 'Hired' && c.stage !== 'Rejected').length;
    const hired = candidates.filter((c) => c.stage === 'Hired').length;
    const offers = candidates.filter((c) => c.stage === 'Offer').length;
    return { openJobs, activeCandidates, hired, offers };
  }, [jobs, candidates]);

  const pipelineCounts = useMemo(() => {
    return pipelineStages.map((stage) => ({
      stage,
      count: candidates.filter((c) => c.stage === stage).length,
    }));
  }, [candidates]);

  const recentCandidates = useMemo(() => {
    return [...candidates]
      .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime())
      .slice(0, 6);
  }, [candidates]);

  const myJobs = useMemo(() => {
    return jobs
      .filter((j) => j.ownerId === currentUser.id)
      .slice(0, 5);
  }, [jobs, currentUser.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
          A snapshot of your recruiting activity across the team.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <StatCard label="Open jobs" value={stats.openJobs} icon={<Briefcase size={18} />} tone="primary" />
        <StatCard label="Active candidates" value={stats.activeCandidates} icon={<Users size={18} />} tone="info" />
        <StatCard label="Outstanding offers" value={stats.offers} icon={<TrendingUp size={18} />} tone="warning" />
        <StatCard label="Hired this year" value={stats.hired} icon={<CheckCircle2 size={18} />} tone="success" />
      </div>

      <Card>
        <CardHeader title="Pipeline overview" subtitle="Where candidates are across all open roles" />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pipelineStages.length}, 1fr)`, gap: 12 }}>
          {pipelineCounts.map(({ stage, count }) => (
            <div
              key={stage}
              style={{
                padding: 14,
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700 }}>{count}</div>
              <div style={{ marginTop: 6 }}>
                <StageBadge stage={stage} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <Card>
          <CardHeader
            title="Recent activity"
            subtitle="Latest candidate updates"
            action={<Link to="/candidates" style={{ fontSize: 12, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={12} /></Link>}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {recentCandidates.map((c) => {
              const job = jobs.find((j) => j.id === c.jobId);
              return (
                <Link
                  key={c.id}
                  to={`/candidates/${c.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', borderBottom: '1px solid var(--color-border)' }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 11, flexShrink: 0,
                  }}>
                    {initials(c.fullName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.fullName}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {job?.title ?? 'Job removed'} • {formatRelative(c.lastActivityAt)}
                    </div>
                  </div>
                  <StageBadge stage={c.stage} />
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="My jobs"
            subtitle={`Jobs you own as ${currentUser.name.split(' ')[0]}`}
            action={<Link to="/jobs" style={{ fontSize: 12, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={12} /></Link>}
          />
          {myJobs.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)' }}>
              You don't own any jobs yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {myJobs.map((j) => {
                const count = candidates.filter((c) => c.jobId === j.id).length;
                return (
                  <Link
                    key={j.id}
                    to={`/jobs/${j.id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', borderBottom: '1px solid var(--color-border)' }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{j.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {j.department} • {j.location}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{count} candidates</div>
                    <Badge tone={j.status === 'Open' ? 'success' : j.status === 'Draft' ? 'neutral' : 'warning'}>{j.status}</Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: 'primary' | 'info' | 'warning' | 'success' }) {
  const bg = {
    primary: 'var(--color-primary-soft)',
    info: 'var(--color-info-soft)',
    warning: 'var(--color-warning-soft)',
    success: 'var(--color-success-soft)',
  }[tone];
  const color = {
    primary: 'var(--color-primary)',
    info: '#1d4ed8',
    warning: '#b45309',
    success: '#047857',
  }[tone];
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{value}</div>
        </div>
      </div>
    </Card>
  );
}
