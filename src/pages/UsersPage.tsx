import { useState } from 'react';
import { UserCog, ShieldCheck } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useAppData, isAdmin } from '@/hooks/useAppData';
import { initials } from '@/lib/format';
import type { Role } from '@/types';

const roleLabels: Record<Role, string> = {
  Admin: 'Admin',
  Recruiter: 'Recruiter',
  HiringManager: 'Hiring Manager',
};

const roleOptions: Role[] = ['Admin', 'Recruiter', 'HiringManager'];

export default function UsersPage() {
  const { users, currentUser, updateUser } = useAppData();
  const [filter, setFilter] = useState<'all' | Role>('all');

  if (!isAdmin(currentUser.role)) {
    return (
      <Card>
        <EmptyState
          icon={<ShieldCheck size={20} />}
          title="Admins only"
          description="You need administrator access to manage team members and roles."
        />
      </Card>
    );
  }

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  return (
    <div>
      <Card>
        <CardHeader
          title="Team & Roles"
          subtitle="Manage who has access and what they can do"
          action={
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | Role)}
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '7px 10px',
                fontSize: 13,
              }}
            >
              <option value="all">All roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{roleLabels[r]}</option>
              ))}
            </select>
          }
        />
        {filtered.length === 0 ? (
          <EmptyState icon={<UserCog size={20} />} title="No team members" description="Adjust your filters to see more." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((u) => (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 14px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: u.avatarColor ?? 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {initials(u.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{u.email}</div>
                </div>
                <select
                  value={u.role}
                  onChange={(e) => updateUser(u.id, { role: e.target.value as Role })}
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 10px',
                    fontSize: 13,
                  }}
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{roleLabels[r]}</option>
                  ))}
                </select>
                <Badge tone={u.active ? 'success' : 'neutral'}>{u.active ? 'Active' : 'Inactive'}</Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateUser(u.id, { active: !u.active })}
                  disabled={u.id === currentUser.id}
                >
                  {u.active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
