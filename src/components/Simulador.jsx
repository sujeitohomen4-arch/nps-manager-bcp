import { useState } from 'react';
import { calcNPS, calcAgencia, npsColor, META_V, META_P, META_AG } from '../utils';

export default function Simulador({ asesores }) {
  const [extras, setExtras] = useState(
    () => Object.fromEntries(asesores.map(a => [a.id, 0]))
  );

  const modRows     = asesores.map(a => ({ ...a, prom: a.prom + (extras[a.id] || 0) }));
  const totalExtra  = Object.values(extras).reduce((s, v) => s + (v || 0), 0);

  const v = asesores.filter(a => a.canal === 'V');
  const p = asesores.filter(a => a.canal === 'P');
  const vM = modRows.filter(a => a.canal === 'V');
  const pM = modRows.filter(a => a.canal === 'P');

  const sum = (arr, f) => arr.reduce((s, a) => s + a[f], 0);

  const npsVAntes    = calcNPS(sum(v,'prom'), sum(v,'det'), sum(v,'neut'));
  const npsPAntes    = calcNPS(sum(p,'prom'), sum(p,'det'), sum(p,'neut'));
  const npsAgAntes   = calcAgencia(asesores);
  const npsVDespues  = calcNPS(sum(vM,'prom'), sum(vM,'det'), sum(vM,'neut'));
  const npsPDespues  = calcNPS(sum(pM,'prom'), sum(pM,'det'), sum(pM,'neut'));
  const npsAgDespues = calcAgencia(modRows);

  const alcanzaMeta  = npsAgDespues !== null && npsAgDespues >= META_AG;

  const inc  = id => setExtras(e => ({ ...e, [id]: (e[id] || 0) + 1 }));
  const dec  = id => setExtras(e => ({ ...e, [id]: Math.max(0, (e[id] || 0) - 1) }));

  const CardAntes  = ({ l, v: val, m }) => (
    <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', border: '1px solid var(--border)', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>{l}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: npsColor(val, m) }}>{val !== null ? val : '—'}</div>
    </div>
  );
  const CardDespues = ({ l, v: val, m }) => (
    <div style={{ background: val !== null && val >= m ? 'var(--green-bg)' : 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', border: `1px solid ${val !== null && val >= m ? '#B7EDD8' : 'var(--border)'}`, textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>{l}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: npsColor(val, m) }}>{val !== null ? val : '—'}</div>
    </div>
  );

  return (
    <div>
      {/* Sliders por asesor */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', marginBottom: 14, boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
          ¿Qué pasa si ingresan más encuestas promotoras?
        </div>
        {asesores.map(a => {
          const nps  = calcNPS(a.prom, a.det, a.neut);
          const meta = a.canal === 'V' ? META_V : META_P;
          const canalColor = a.canal === 'V' ? { bg: '#EBF4FF', color: '#1E40AF' } : { bg: '#ECFDF5', color: '#065F46' };
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '7px 10px', background: 'var(--surface2)', borderRadius: 8 }}>
              <div style={{ flex: 1, fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 70 }}>
                {a.nombre.split(' ')[0]}
              </div>
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 20, fontWeight: 600, flexShrink: 0, background: canalColor.bg, color: canalColor.color }}>{a.canal}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: npsColor(nps, meta), minWidth: 32, textAlign: 'right' }}>{nps !== null ? nps : '—'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <button onClick={() => dec(a.id)} style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', fontSize: 15, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>−</button>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 600, color: 'var(--bcp-blue)', minWidth: 22, textAlign: 'center' }}>{extras[a.id] || 0}</span>
                <button onClick={() => inc(a.id)} style={{ width: 26, height: 26, border: '1px solid var(--bcp-blue)', borderRadius: 6, background: 'var(--bcp-blue)', cursor: 'pointer', fontSize: 15, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Antes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
        <CardAntes l="Ventanilla antes" v={npsVAntes}  m={META_V}  />
        <CardAntes l="Plataforma antes" v={npsPAntes}  m={META_P}  />
        <CardAntes l="Agencia antes"    v={npsAgAntes} m={META_AG} />
      </div>

      <div style={{ textAlign: 'center', fontSize: 20, color: 'var(--text-muted)', margin: '6px 0', lineHeight: 1 }}>
        ↓ <span style={{ fontSize: 12, color: 'var(--bcp-blue)', fontWeight: 600 }}>+{totalExtra} encuestas promotoras</span>
      </div>

      {/* Después */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        <CardDespues l="Ventanilla nueva" v={npsVDespues}  m={META_V}  />
        <CardDespues l="Plataforma nueva" v={npsPDespues}  m={META_P}  />
        <CardDespues l="Agencia nueva"    v={npsAgDespues} m={META_AG} />
      </div>

      {/* Veredicto */}
      <div style={{ background: alcanzaMeta ? 'var(--green-bg)' : 'var(--red-bg)', borderRadius: 'var(--radius)', padding: '12px 14px', border: `1px solid ${alcanzaMeta ? '#B7EDD8' : '#FCA5A5'}`, fontSize: 13, color: alcanzaMeta ? 'var(--green-text)' : 'var(--red-text)', fontWeight: 500, lineHeight: 1.5 }}>
        {totalExtra === 0
          ? 'Usa los botones + para simular encuestas promotoras adicionales por asesor.'
          : alcanzaMeta
            ? `✓ Con esas ${totalExtra} encuestas extra, la agencia llega a ${npsAgDespues} — meta alcanzada.`
            : `Con ${totalExtra} encuestas extra la agencia quedaría en ${npsAgDespues}. Faltan ${+(META_AG - (npsAgDespues ?? 0)).toFixed(1)} pts para meta. Prueba agregar más a los asesores en rojo.`
        }
      </div>
    </div>
  );
}
