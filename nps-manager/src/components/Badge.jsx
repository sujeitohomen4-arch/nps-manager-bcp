import { priLabel } from '../utils';

const styles = {
  ok:     { background: 'var(--green-bg)',  color: 'var(--green-text)' },
  warn:   { background: 'var(--amber-bg)', color: 'var(--amber-text)' },
  danger: { background: 'var(--red-bg)',   color: 'var(--red-text)'   },
  muted:  { background: 'var(--surface2)', color: 'var(--text-muted)' },
};

export default function Badge({ v, m }) {
  const { txt, cls } = priLabel(v, m);
  return (
    <span style={{
      fontSize: 10,
      padding: '2px 8px',
      borderRadius: 20,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      ...styles[cls],
    }}>
      {txt}
    </span>
  );
}
