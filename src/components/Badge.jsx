import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { priLabel } from '../utils';

const config = {
  ok:     { bg: 'var(--green-bg)',  color: 'var(--green-text)',  border: 'var(--green-border)',  Icon: CheckCircle2    },
  warn:   { bg: 'var(--amber-bg)', color: 'var(--amber-text)', border: 'var(--amber-border)', Icon: AlertTriangle   },
  danger: { bg: 'var(--red-bg)',   color: 'var(--red-text)',   border: 'var(--red-border)',   Icon: XCircle         },
  muted:  { bg: 'var(--surface2)', color: 'var(--text-muted)', border: 'var(--border)',       Icon: HelpCircle      },
};

export default function Badge({ v, m }) {
  const { txt, cls } = priLabel(v, m);
  const { bg, color, border, Icon } = config[cls];
  return (
    <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap', background: bg, color, border: `1px solid ${border}`, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Icon size={11} strokeWidth={2.5} />
      {txt}
    </span>
  );
}
