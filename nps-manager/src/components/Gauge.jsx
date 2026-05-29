import { npsColor } from '../utils';

export default function Gauge({ value, meta, size = 90 }) {
  const r    = 36;
  const cx   = 45;
  const cy   = 48;
  const circ = Math.PI * r;
  const pct  = value === null ? 0 : Math.max(0, Math.min(100, (value + 100) / 200));
  const dash = pct * circ;
  const color = value === null
    ? '#E2E8F4'
    : value >= meta  ? '#0E9E6E'
    : value >= meta - 8 ? '#D97706'
    : '#DC2626';

  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 90 60">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#EDF2FB" strokeWidth="7" strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
      />
      {/* Valor */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fontWeight="600"
        fill={color} fontFamily="DM Sans, sans-serif">
        {value !== null ? value : '—'}
      </text>
      {/* Meta */}
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="7"
        fill="#9AAAC0" fontFamily="DM Sans, sans-serif">
        meta {meta}
      </text>
    </svg>
  );
}
