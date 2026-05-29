import { calcNPS, npsColor, META_V, META_P } from '../utils';

export default function Datos({ asesores, setAsesores }) {
  const update = (id, field, val) => {
    setAsesores(prev =>
      prev.map(a => a.id === id ? { ...a, [field]: Math.max(0, +val || 0) } : a)
    );
  };

  const renderCanal = (canal, label, meta) => {
    const rows  = asesores.filter(a => a.canal === canal);
    const totP  = rows.reduce((s, a) => s + a.prom, 0);
    const totD  = rows.reduce((s, a) => s + a.det,  0);
    const totN  = rows.reduce((s, a) => s + a.neut, 0);
    const nps   = calcNPS(totP, totD, totN);

    const fieldBg = { prom: '#F0FBF7', det: '#FEF2F2', neut: 'var(--surface2)' };

    return (
      <div style={{ marginBottom: 24 }}>
        {/* Encabezado canal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ background: 'var(--bcp-blue)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{label}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: npsColor(nps, meta) }}>NPS {nps !== null ? nps : '—'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>Meta: {meta}</div>
        </div>

        {/* Tabla */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          {/* Encabezado */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) 1fr 1fr 1fr 1fr' }}>
            {['Asesor', 'Prom ✓', 'Det ✗', 'Neut ~', 'NPS'].map(h => (
              <div key={h} style={{ padding: '8px 8px', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', textAlign: h === 'Asesor' ? 'left' : 'center' }}>{h}</div>
            ))}
          </div>

          {/* Filas */}
          {rows.map((a, i) => {
            const npsA = calcNPS(a.prom, a.det, a.neut);
            return (
              <div key={a.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) 1fr 1fr 1fr 1fr', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ padding: '8px 10px', fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.nombre.split(' ')[0]} {a.nombre.split(' ').slice(-1)[0]}
                  </span>
                </div>
                {['prom', 'det', 'neut'].map(f => (
                  <div key={f} style={{ padding: '5px 3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input
                      type="number" value={a[f]} min="0"
                      onChange={e => update(a.id, f, e.target.value)}
                      style={{ width: 44, padding: '5px 2px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 6, textAlign: 'center', background: fieldBg[f], color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace', outline: 'none' }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 4px' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: npsColor(npsA, meta) }}>{npsA !== null ? npsA : '—'}</span>
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) 1fr 1fr 1fr 1fr', borderTop: '2px solid var(--border)', background: 'var(--surface2)' }}>
            <div style={{ padding: '8px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>Total {label}</div>
            <div style={{ padding: '8px 4px', fontSize: 13, fontWeight: 700, color: 'var(--green)',         textAlign: 'center' }}>{totP}</div>
            <div style={{ padding: '8px 4px', fontSize: 13, fontWeight: 700, color: 'var(--red)',           textAlign: 'center' }}>{totD}</div>
            <div style={{ padding: '8px 4px', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)',textAlign: 'center' }}>{totN}</div>
            <div style={{ padding: '8px 4px', fontSize: 13, fontWeight: 700, color: npsColor(nps, meta),   textAlign: 'center' }}>{nps !== null ? nps : '—'}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ background: 'var(--bcp-orange)', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: 16, fontSize: 12, color: '#1A1A2E', lineHeight: 1.5 }}>
        <strong>Ingreso diario —</strong> Copia los números de Medallia aquí. Son 27 campos, ~90 segundos. El app calcula todo lo demás automáticamente.
      </div>
      {renderCanal('V', 'Ventanilla', META_V)}
      {renderCanal('P', 'Plataforma', META_P)}
    </div>
  );
}
