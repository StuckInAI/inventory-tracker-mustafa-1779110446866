import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Briefcase, MapPin } from 'lucide-react';
import { useAppData, canEdit } from '@/hooks/useAppData';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import JobFormModal from '@/components/jobs/JobFormModal';
import { formatRelative } from '@/lib/format';
import type { Job, JobStatus } from '@/types';

const statusOptions: (JobStatus | 'All')[] = ['All', 'Open', 'Draft', 'OnHold', 'Closed'];

export default function JobsPage() {
  const { jobs, candidates, currentUser, users } = useAppData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'All'>('All');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (statusFilter !== 'All' && j.status !== statusFilter) return false;
      if (!q) return true;
      return (
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    });
  }, [jobs, search, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Jobs</h1>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {jobs.filter((j) => j.status === 'Open').length} open • {jobs.length} total
          </div>
        </div>
        {canEdit(currentUser.role) && (
          <Button icon={<Plus size={15} />} onClick={() => setCreating(true)}>New job</Button>
        )}
      </div>

      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by title, department, or location"
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'All')}
            style={{ padding: '9px 12px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', fontSize: 13, background: 'var(--color-surface)' }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>
            ))}
          </select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase size={20} />}
            title="No jobs match these filters"
            description="Adjust your search or create a new job to get started."
            action={canEdit(currentUser.role) ? <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>New job</Button> : undefined}
          />
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map((j) => {
            const count = candidates.filter((c) => c.jobId === j.id).length;
            const owner = users.find((u) => u.id === j.ownerId);
            const tone: 'success' | 'neutral' | 'warning' | 'danger' =
              j.status === 'Open' ? 'success' : j.status === 'Draft' ? 'neutral' : j.status === 'Closed' ? 'danger' : 'warning';
            return (
              <Card key={j.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                  <Link to={`/jobs/${j.id}`} style={{ fontSize: 15, fontWeight: 600 }}>{j.title}</Link>
                  <Badge tone={tone}>{j.status}</Badge>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Briefcase size={12} /> {j.department}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {j.location}</span>
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <span>{count} candidates</span>
                  <span>Updated {formatRelative(j.updatedAt)}</span>
                </div>
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Owner: {owner?.name ?? '—'}</span>
                  {canEdit(currentUser.role) && (
                    <Button size="sm" variant="ghost" onClick={() => setEditingJob(j)}>Edit</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {creating && <JobFormModal job={null} onClose={() => setCreating(false)} />}
      {editingJob && <JobFormModal job={editingJob} onClose={() => setEditingJob(null)} />}
    </div>
  );
}
