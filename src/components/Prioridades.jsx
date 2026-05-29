import Badge from './Badge';
import { calcNPS, encNeeded, impacto1, npsColor, META_V, META_P } from '../utils';

export default function Prioridades({ asesores }) {
  const conImpacto = asesores.map(a => {
    const nps  = calcNPS(a.prom, a.det, a.neut);
    const meta = a.canal === 'V' ? META_V : META_P;
    const imp  = impacto1(a, asesores);
    const need = (a.prom + a.det + a.neut) > 0
      ? encNeeded(a.prom, a.det, a.neut, meta)
      : '—';
    return { ...a, nps, meta, imp, need };
  }).sort((a, b) => {
    const rank = x => x.nps === null ? 3 : x.nps < x.meta ? 0 : x.nps < x.meta + 5 ? 1 : 2;
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    return (a.nps ?? 999) - (b.nps ?? 999);
  });

  const maxImp = Math.max(...conImpacto.map(a => a.imp), 0.01);

  return (
    <div>
      <div style={{ background: 'var(--bcp-blue-light)', border: '1px solid #C5D8F5', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: 14, fontSize: 12, color: 'var(--bcp-blue)', lineHeight: 1.6 }}>
        <strong>Regla de oro:</strong> Con peso 50/50, trabaja siempre el canal más bajo. Dentro del canal, prioriza al asesor con NPS más bajo — tiene más margen de subida.
      </div>

      {conImpacto.map((a, i) => {
        const esPrioridad = a.nps !== null && a.nps < a.meta;
        const barW = Math.round((a.imp / maxImp) * 100);
        const canalColor = a.canal === 'V'
          ? { bg: '#EBF4FF', color: '#1E40AF' }
          : { bg: '#ECFDF5', color: '#065F46' };

        return (
          <div key={a.id} style={{
            background: 'var(--surface)',
            border: `1px solid ${esPrioridad && i < 2 ? '#FCA5A5' : 'var(--border)'}`,
            borderLeft: `3px solid ${npsColor(a.nps, a.meta)}`,
            borderRadius: '0 var(--radius) var(--radius) 0',
            padding: '12px 14px',
            marginBottom: 8,
            boxShadow: 'var(--shadow)',
          }}>
            {/* Nombre + badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', flex: 1, minWidth: 90 }}>
                {i === 0 ? '⚡ ' : ''}{a.nombre.split(' ')[0]} {a.nombre.split(' ').slice(-1)[0]}
              </div>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 600, background: canalColor.bg, color: canalColor.color }}>
                {a.canal === 'V' ? 'Ventanilla' : 'Plataforma'}
              </span>
              <Badge v={a.nps} m={a.meta} />
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
              <div style={{ background: 'var(--surface2)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 1 }}>NPS actual</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: npsColor(a.nps, a.meta) }}>
                  {a.nps !== null ? a.nps : '—'}
                </div>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 1 }}>Meta</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--bcp-blue)' }}>{a.meta}</div>
              </div>
              <div style={{ background: a.need === 0 ? 'var(--green-bg)' : 'var(--bcp-blue-light)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 1 }}>Enc. faltantes</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: a.need === 0 ? 'var(--green)' : 'var(--bcp-blue)' }}>
                  {a.need === 0 ? '✓' : a.need}
                </div>
              </div>
            </div>

            {/* Barra de impacto */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>
                <span>Impacto en agencia por +1 promotor</span>
                <span style={{ fontWeight: 600, color: 'var(--bcp-blue)' }}>+{a.imp} pts</span>
              </div>
              <div style={{ background: '#EDF2FB', borderRadius: 20, height: 5, overflow: 'hidden' }}>
                <div style={{ width: `${barW}%`, height: 5, background: 'var(--bcp-blue)', borderRadius: 20, transition: 'width .4s' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
