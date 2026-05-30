export default function Gauge({ value, meta, size = 90 }) {
  const r    = 36, cx = 45, cy = 50;
  const circ = Math.PI * r;
  const pct  = value === null ? 0 : Math.max(0, Math.min(100, (value + 100) / 200));
  const dash = pct * circ;
  const color = value === null    ? '#CBD5E1'
    : value >= meta     ? '#059669'
    : value >= meta - 8 ? '#D97706'
    : '#DC2626';
  const trackColor = value === null    ? '#F1F5F9'
    : value >= meta     ? '#D1FAE5'
    : value >= meta - 8 ? '#FEF3C7'
    : '#FEE2E2';

  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 90 62">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
        fill="none" stroke={trackColor} strokeWidth="8" strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
        fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray .5s ease' }}/>
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="17" fontWeight="800"
        fill={color} fontFamily="DM Sans, sans-serif">{value !== null ? value : '—'}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8.5"
        fill="#8FA0BE" fontFamily="DM Sans, sans-serif">meta {meta}</text>
    </svg>
  );
}
