import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { useAppData } from '@/hooks/useAppData';

export default function CareersJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, addCandidate } = useAppData();
  const job = jobs.find((j) => j.id === jobId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cover, setCover] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Job not found.</p>
        <Link to="/careers">Back to careers</Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addCandidate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      jobId: job!.id,
      coverLetter: cover.trim() || undefined,
    });
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <header style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '16px 32px' }}>
        <Link to="/careers" style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> All openings
        </Link>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.4 }}>{job.title}</h1>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Briefcase size={13} /> {job.department}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> {job.location}</span>
          <span>{job.employmentType}</span>
        </div>

        <div style={{ marginTop: 28, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>About the role</h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {job.description || 'We are looking for a talented individual to join our team.'}
          </p>
        </div>

        <div style={{ marginTop: 24, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Apply for this role</h2>
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 20, gap: 10 }}>
              <CheckCircle2 size={40} color="var(--color-success, #10b981)" />
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Application submitted!</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                Thanks for applying. We'll review your application and reach out soon.
              </p>
              <Link to="/careers" style={{ marginTop: 8, fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                Browse more roles →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Field label="Full name" required>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field label="Email" required>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
              <Field label="Phone">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <Field label="Cover letter" hint="Tell us why you'd be a great fit.">
                <textarea value={cover} onChange={(e) => setCover(e.target.value)} />
              </Field>
              <div style={{ marginTop: 8 }}>
                <Button type="submit" disabled={!name.trim() || !email.trim()}>Submit application</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
