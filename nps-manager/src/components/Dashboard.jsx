import Gauge from './Gauge';
import { calcNPS, calcAgencia, encNeeded, npsColor, META_V, META_P, META_AG } from '../utils';

export default function Dashboard({ asesores }) {
  const v = asesores.filter(a => a.canal === 'V');
  const p = asesores.filter(a => a.canal === 'P');

  const npsV  = calcNPS(v.reduce((s,a)=>s+a.prom,0), v.reduce((s,a)=>s+a.det,0), v.reduce((s,a)=>s+a.neut,0));
  const npsP  = calcNPS(p.reduce((s,a)=>s+a.prom,0), p.reduce((s,a)=>s+a.det,0), p.reduce((s,a)=>s+a.neut,0));
  const npsAg = calcAgencia(asesores);

  const totEnc  = asesores.reduce((s,a) => s + a.prom + a.det + a.neut, 0);
  const totProm = asesores.reduce((s,a) => s + a.prom, 0);
  const totDet  = asesores.reduce((s,a) => s + a.det,  0);

  const critico = [...asesores]
    .filter(a => {
      const n = calcNPS(a.prom, a.det, a.neut);
      return n !== null && n < (a.canal === 'V' ? META_V : META_P);
    })
    .sort((a, b) => calcNPS(a.prom, a.det, a.neut) - calcNPS(b.prom, b.det, b.neut))[0];

  const canales = [
    { label: 'Ventanilla', nps: npsV, meta: META_V },
    { label: 'Plataforma', nps: npsP, meta: META_P },
  ].sort((a, b) => (a.nps ?? 999) - (b.nps ?? 999));

  return (
    <div>
      {/* Alerta foco del día */}
      {critico && (
        <div style={{ background: 'var(--bcp-blue)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🎯</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Foco de hoy</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', lineHeight: 1.5 }}>
              Prioriza a <strong>{critico.nombre.split(' ')[0]}</strong> — NPS {calcNPS(critico.prom, critico.det, critico.neut)}{' '}
              · Necesita{' '}
              <strong>{encNeeded(critico.prom, critico.det, critico.neut, critico.canal === 'V' ? META_V : META_P)}</strong>{' '}
              encuestas promotoras para llegar a meta
            </div>
          </div>
        </div>
      )}

      {/* Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'NPS Agencia',   val: npsAg, meta: META_AG },
          { label: 'Ventanilla',    val: npsV,  meta: META_V  },
          { label: 'Plataforma',    val: npsP,  meta: META_P  },
        ].map(({ label, val, meta }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 8px 10px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{label}</div>
            <Gauge value={val} meta={meta} size={78} />
          </div>
        ))}
      </div>

      {/* Fórmula */}
      <div style={{ background: 'var(--bcp-blue-light)', border: '1px solid #C5D8F5', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: 16, fontSize: 12, color: 'var(--bcp-blue)', lineHeight: 1.6 }}>
        <strong>Fórmula:</strong> NPS Agencia = (NPS Ventanilla + NPS Plataforma) ÷ 2 &nbsp;·&nbsp; Peso 50% / 50%<br />
        <strong>Regla de oro:</strong> Trabaja siempre el canal más bajo — tiene más margen de mejora.
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Total enc.</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{totEnc}</div>
        </div>
        <div style={{ background: 'var(--green-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', border: '1px solid #B7EDD8' }}>
          <div style={{ fontSize: 10, color: 'var(--green-text)', marginBottom: 2 }}>Promotores</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>{totProm}</div>
        </div>
        <div style={{ background: 'var(--red-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', border: '1px solid #FCA5A5' }}>
          <div style={{ fontSize: 10, color: 'var(--red-text)', marginBottom: 2 }}>Detractores</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--red)' }}>{totDet}</div>
        </div>
      </div>

      {/* Canal a priorizar */}
      {npsV !== null && npsP !== null && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.04em' }}>Canal a priorizar hoy</div>
          {canales.map((c, i) => (
            <div key={c.label} style={{ marginBottom: i === 0 ? 12 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--bcp-blue)' : 'var(--text-secondary)' }}>
                  {i === 0 ? '⚡ ' : ''}{c.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: npsColor(c.nps, c.meta) }}>{c.nps}</span>
              </div>
              <div style={{ background: '#EDF2FB', borderRadius: 20, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(0, Math.min(100, (c.nps + 100) / 200 * 100))}%`, height: 8, background: npsColor(c.nps, c.meta), borderRadius: 20, transition: 'width .5s' }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Meta: {c.meta}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
