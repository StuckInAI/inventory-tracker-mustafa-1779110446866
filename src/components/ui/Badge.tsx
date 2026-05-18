import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeProps = {
  children: ReactNode;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
};

export default function Badge({ children, tone = 'neutral', size = 'sm' }: BadgeProps) {
  return <span className={clsx(styles.badge, styles[tone], size === 'md' && styles.md)}>{children}</span>;
}
