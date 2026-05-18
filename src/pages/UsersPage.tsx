import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { useAppData, isAdmin } from '@/hooks/useAppData';
import { initials } from '@/lib/format';
import type { Role } from '@/types';

const roleLabels: Record<Role, string> = {
  Admin: 'Admin',
  Recruiter: 'Recruiter',
  HiringManager: 'Hiring Manager',
};

const roleTones: Record<Role, 'primary' | 'info' | 'success'> = {
  Admin: 'primary',
  Recruiter: 'info',
  HiringManager: 'success',
};

export default function UsersPage() {
  const { users, currentUser, updateUserRole, toggleUserActive } = useAppData();

  if (!isAdmin(currentUser.role)) {
    return (
      <Card>
        <EmptyState title="Admins only" description="You don't have permission to view this page." />
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Team & Roles</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Manage who has access and what they can do.</p>
      </div>

      <Card padded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid var(--color-border)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          <div>Member</div>
          <div>Role</div>
          <div>Status</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>
        {users.map((u) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 20px', alignItems: 'center', borderTop: '1px solid var(--color-border)', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12 }}>
                {initials(u.name)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.email}</div>
              </div>
            </div>
            <div>
              <Badge tone={roleTones[u.role]}>{roleLabels[u.role]}</Badge>
            </div>
            <div>
              <Badge tone={u.active ? 'success' : 'neutral'}>{u.active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
              <select
                value={u.role}
                onChange={(e) => updateUserRole(u.id, e.target.value as Role)}
                disabled={u.id === currentUser.id}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '6px 8px', fontSize: 12 }}
              >
                <option value="Admin">Admin</option>
                <option value="Recruiter">Recruiter</option>
                <option value="HiringManager">Hiring Manager</option>
              </select>
              <button
                onClick={() => toggleUserActive(u.id)}
                disabled={u.id === currentUser.id}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '6px 10px', fontSize: 12, cursor: u.id === currentUser.id ? 'not-allowed' : 'pointer', opacity: u.id === currentUser.id ? 0.5 : 1 }}
              >
                {u.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
