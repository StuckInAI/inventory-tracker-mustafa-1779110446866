import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { useAppData, canEditJob } from '@/hooks/useAppData';
import JobFormModal from '@/components/jobs/JobFormModal';
import { formatDate } from '@/lib/format';
import type { Job, JobStatus } from '@/types';
import styles from './JobsPage.module.css';

const statusTones: Record<JobStatus, 'success' | 'warning' | 'neutral' | 'info'> = {
  Open: 'success',
  Draft: 'warning',
  OnHold: 'info',
  Closed: 'neutral',
};

export default function JobsPage() {
  const { jobs, candidates, currentUser, users } = useAppData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | JobStatus>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

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

  const candidatesByJob = useMemo(() => {
    const map = new Map<string, number>();
    candidates.forEach((c) => {
      map.set(c.jobId, (map.get(c.jobId) ?? 0) + 1);
    });
    return map;
  }, [candidates]);

  const userById = useMemo(() => {
    const map = new Map(users.map((u) => [u.id, u]));
    return map;
  }, [users]);

  const canCreate = canEditJob(currentUser.role);

  function openCreate() {
    setEditingJob(null);
    setShowModal(true);
  }

  function openEdit(job: Job) {
    setEditingJob(job);
    setShowModal(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Jobs</h1>
          <p className={styles.sub}>Manage open requisitions and their pipelines.</p>
        </div>
        {canCreate && (
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            New Job
          </Button>
        )}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.search}
            placeholder="Search by title, department, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | JobStatus)}
        >
          <option value="All">All statuses</option>
          <option value="Open">Open</option>
          <option value="Draft">Draft</option>
          <option value="OnHold">On Hold</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase size={20} />}
            title="No jobs found"
            description="Try adjusting your filters or create a new job to get started."
            action={
              canCreate ? (
                <Button icon={<Plus size={16} />} onClick={openCreate}>
                  New Job
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className={styles.grid}>
          {filtered.map((job) => {
            const owner = userById.get(job.ownerId);
            const count = candidatesByJob.get(job.id) ?? 0;
            return (
              <Card key={job.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleWrap}>
                    <Link to={`/jobs/${job.id}`} className={styles.cardTitle}>
                      {job.title}
                    </Link>
                    <div className={styles.cardMeta}>
                      {job.department} · {job.location} · {job.employmentType}
                    </div>
                  </div>
                  <Badge tone={statusTones[job.status]}>{job.status}</Badge>
                </div>
                <div className={styles.cardStats}>
                  <div>
                    <div className={styles.statValue}>{count}</div>
                    <div className={styles.statLabel}>Candidates</div>
                  </div>
                  <div>
                    <div className={styles.statValue}>{formatDate(job.createdAt)}</div>
                    <div className={styles.statLabel}>Created</div>
                  </div>
                  <div>
                    <div className={styles.statValue}>{owner?.name ?? '—'}</div>
                    <div className={styles.statLabel}>Owner</div>
                  </div>
                </div>
                {canEditJob(currentUser.role) && (
                  <div className={styles.cardActions}>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(job)}>
                      Edit
                    </Button>
                    <Link to={`/jobs/${job.id}`} className={styles.viewLink}>
                      View pipeline →
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {showModal && (
        <JobFormModal
          job={editingJob}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
