import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Briefcase } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';

export default function CareersPage() {
  const { jobs } = useAppData();
  const openJobs = jobs.filter((j) => j.status === 'Open');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <header style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>TalentTrack</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Careers</div>
          </div>
        </div>
        <Link to="/" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>Recruiter portal →</Link>
      </header>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px 30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.6 }}>Join our team</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginTop: 12, maxWidth: 560, marginInline: 'auto' }}>
          We're building the future of hiring. Browse open roles below and apply in minutes.
        </p>
      </section>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: '10px 24px 60px' }}>
        {openJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No open positions at the moment. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {openJobs.map((job) => (
              <Link
                key={job.id}
                to={`/careers/${job.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', gap: 14 }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{job.title}</div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Briefcase size={12} /> {job.department}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {job.location}</span>
                    <span>{job.employmentType}</span>
                  </div>
                </div>
                <span style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 600 }}>View role →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
