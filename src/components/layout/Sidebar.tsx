import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckSquare,
  UserCog,
  Globe,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppData, isAdmin } from '@/hooks/useAppData';
import styles from './Sidebar.module.css';

type NavItem = { to: string; label: string; icon: React.ComponentType<{ size?: number }>; adminOnly?: boolean; end?: boolean };

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/checklists', label: 'Checklists', icon: CheckSquare },
  { to: '/users', label: 'Team & Roles', icon: UserCog, adminOnly: true },
];

export default function Sidebar() {
  const { currentUser } = useAppData();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Sparkles size={18} />
        </div>
        <div>
          <div className={styles.brandName}>TalentTrack</div>
          <div className={styles.brandSub}>ATS</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems
          .filter((item) => !item.adminOnly || isAdmin(currentUser.role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => clsx(styles.link, isActive && styles.linkActive)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/careers" className={styles.careersLink} target="_blank" rel="noreferrer">
          <Globe size={16} />
          <span>View Careers Page</span>
        </NavLink>
      </div>
    </aside>
  );
}
