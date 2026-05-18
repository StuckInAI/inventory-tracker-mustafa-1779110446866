import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Field from '@/components/ui/Field';
import Button from '@/components/ui/Button';
import { useAppData } from '@/hooks/useAppData';
import type { Job, JobStatus, EmploymentType } from '@/types';

type JobFormModalProps = {
  job: Job | null;
  onClose: () => void;
};

export default function JobFormModal({ job, onClose }: JobFormModalProps) {
  const { addJob, updateJob, users, currentUser } = useAppData();
  const [title, setTitle] = useState(job?.title ?? '');
  const [department, setDepartment] = useState(job?.department ?? '');
  const [location, setLocation] = useState(job?.location ?? '');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(job?.employmentType ?? 'FullTime');
  const [status, setStatus] = useState<JobStatus>(job?.status ?? 'Draft');
  const [description, setDescription] = useState(job?.description ?? '');
  const [ownerId, setOwnerId] = useState(job?.ownerId ?? currentUser.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employmentType,
      status,
      description: description.trim(),
      ownerId,
    };
    if (job) {
      updateJob(job.id, payload);
    } else {
      addJob(payload);
    }
    onClose();
  }

  return (
    <Modal
      title={job ? 'Edit Job' : 'New Job'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>{job ? 'Save changes' : 'Create job'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="Job title" required>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Department">
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </Field>
          <Field label="Location">
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Employment type">
            <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}>
              <option value="FullTime">Full Time</option>
              <option value="PartTime">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
              <option value="Draft">Draft</option>
              <option value="Open">Open</option>
              <option value="OnHold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>
          </Field>
        </div>
        <Field label="Owner">
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
