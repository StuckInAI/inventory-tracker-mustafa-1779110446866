import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

type CardProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

export default function Card({ children, className, padded = true }: CardProps) {
  return <div className={clsx(styles.card, padded && styles.padded, className)}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className={styles.header}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
