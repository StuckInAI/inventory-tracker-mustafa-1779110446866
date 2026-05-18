import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Search } from 'lucide-react';
import { useAppData, canEdit, isAdmin } from '@/hooks/useAppData';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import JobFormModal from '@/components/jobs/JobFormModal';
import { formatDate } from '@/lib/format';
import type { Job } from '@/types';
import styles from './JobsPage.module.css';

export default function JobsPage() {
  const { jobs, candidates, currentUser } = useAppData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'Closed'>('all');
  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = jobs.filter((j) => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Jobs</h1>
          <p className={styles.subtitle}>Manage open positions and track applications.</p>
        </div>
        {canEdit(currentUser.role) && (
          <Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>
            New job
          </Button>
        )}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.search}
            placeholder="Search jobs by title, department, location..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatusFilter(e.target.value as 'all' | 'Open' | 'Closed')
          }
        >
          <option value="all">All status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase size={20} />}
            title="No jobs found"
            description="Try adjusting your filters or create a new job."
          />
        </Card>
      ) : (
        <div className={styles.grid}>
          {filtered.map((job) => {
            const count = candidates.filter((c) => c.jobId === job.id).length;
            return (
              <Card key={job.id} className={styles.jobCard}>
                <div className={styles.jobHead}>
                  <div>
                    <Link to={`/jobs/${job.id}`} className={styles.jobTitle}>
                      {job.title}
                    </Link>
                    <div className={styles.jobSub}>
                      {job.department} · {job.location} · {job.employmentType}
                    </div>
                  </div>
                  <Badge tone={job.status === 'Open' ? 'success' : 'neutral'}>{job.status}</Badge>
                </div>
                <p className={styles.jobDesc}>{job.description}</p>
                <div className={styles.jobFooter}>
                  <div className={styles.metaRow}>
                    <Badge tone="info">{count} candidates</Badge>
                    <span className={styles.meta}>Posted {formatDate(job.createdAt)}</span>
                  </div>
                  <div className={styles.actions}>
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="secondary" size="sm">
                        View pipeline
                      </Button>
                    </Link>
                    {isAdmin(currentUser.role) && (
                      <Button variant="ghost" size="sm" onClick={() => setEditing(job)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {creating && <JobFormModal onClose={() => setCreating(false)} />}
      {editing && <JobFormModal job={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
