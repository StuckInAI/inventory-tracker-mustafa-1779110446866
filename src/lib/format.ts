export function initials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatRelative(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const week = Math.round(day / 7);
  const month = Math.round(day / 30);
  const year = Math.round(day / 365);

  if (Math.abs(sec) < 45) return 'just now';
  if (Math.abs(min) < 60) return min <= 0 ? `in ${-min}m` : `${min}m ago`;
  if (Math.abs(hr) < 24) return hr <= 0 ? `in ${-hr}h` : `${hr}h ago`;
  if (Math.abs(day) < 7) return day <= 0 ? `in ${-day}d` : `${day}d ago`;
  if (Math.abs(week) < 5) return week <= 0 ? `in ${-week}w` : `${week}w ago`;
  if (Math.abs(month) < 12) return month <= 0 ? `in ${-month}mo` : `${month}mo ago`;
  return year <= 0 ? `in ${-year}y` : `${year}y ago`;
}

export function truncate(text: string, max = 120): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}
