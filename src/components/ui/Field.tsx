import type { ReactNode } from 'react';
import styles from './Field.module.css';

type FieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export default function Field({ label, hint, required, children }: FieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}
