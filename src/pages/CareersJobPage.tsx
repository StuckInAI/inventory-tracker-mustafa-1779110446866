import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';

export default function CareersJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, addCandidate } = useAppData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const job = jobs.find((j) => j.id === jobId);

  if (!job || job.status !== 'Open') {
    return (
      <div style={{ maxWidth: 720, margin: '60px auto', padding: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Position not available</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 18 }}>This role may have been filled or is no longer accepting applications.</p>
        <Button onClick={() => navigate('/careers')}>Browse open roles</Button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !email.trim() || !job) return;
    const [firstName, ...rest] = trimmed.split(' ');
    const lastName = rest.join(' ') || '—';
    addCandidate({
      firstName,
      lastName,
      fullName: trimmed,
      email: email.trim(),
      phone: phone.trim() || undefined,
      location: location.trim() || undefined,
      jobId: job.id,
      stage: 'Applied',
      source: 'Careers Page',
      resumeSummary: summary.trim() || undefined,
      notes: [],
      activity: [
        {
          id: `act_${Date.now()}`,
          type: 'Applied',
          at: new Date().toISOString(),
          by: 'Careers Page',
        },
      ],
      checklistProgress: {},
    });
    setSubmitted(true);
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <Link to="/careers" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 18 }}>
        <ArrowLeft size={14} /> All open roles
      </Link>

      <Card>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{job.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 18 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Briefcase size={14} /> {job.department}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {job.location}</span>
          <span>{job.employmentType.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-text)' }}>{job.description}</p>
      </Card>

      <div style={{ marginTop: 24 }}>
        <Card>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{ display: 'inline-flex', width: 56, height: 56, borderRadius: '50%', background: 'var(--color-success-soft)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <CheckCircle2 size={28} color="#047857" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Application received</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Thanks for applying to {job.title}. The team will reach out shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Apply for this role</h2>
              <Field label="Full name" required>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field label="Email" required>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
              <Field label="Phone">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <Field label="Location">
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
              </Field>
              <Field label="Tell us about yourself">
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Share a quick summary of your background and why this role excites you." />
              </Field>
              <Button type="submit" disabled={!name.trim() || !email.trim()}>Submit application</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
