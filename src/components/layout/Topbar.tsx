import { useAppData } from '@/hooks/useAppData';
import { initials } from '@/lib/format';
import styles from './Topbar.module.css';
import type { Role } from '@/types';

const roleLabels: Record<Role, string> = {
  Admin: 'Admin',
  Recruiter: 'Recruiter',
  HiringManager: 'Hiring Manager',
};

export default function Topbar() {
  const { currentUser, users, setCurrentUserId } = useAppData();

  return (
    <header className={styles.topbar}>
      <div className={styles.welcome}>
        <div className={styles.greeting}>Welcome back, {currentUser.name.split(' ')[0]}</div>
        <div className={styles.sub}>Here's what's happening across your pipeline today.</div>
      </div>

      <div className={styles.actions}>
        <label className={styles.switcher}>
          <span className={styles.switcherLabel}>View as</span>
          <select
            className={styles.select}
            value={currentUser.id}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentUserId(e.target.value)}
          >
            {users
              .filter((u) => u.active)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {roleLabels[u.role]}
                </option>
              ))}
          </select>
        </label>

        <div className={styles.profile}>
          <div className={styles.avatar}>{initials(currentUser.name)}</div>
          <div className={styles.profileMeta}>
            <div className={styles.profileName}>{currentUser.name}</div>
            <div className={styles.profileRole}>{roleLabels[currentUser.role]}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
