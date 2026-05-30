import { ClipboardList } from 'lucide-react';
import { calcNPS, npsColor, META_V, META_P } from '../utils';

// Input limpio: sin ceros a la izquierda, sin spinner
function NumInput({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value === 0 ? '' : String(value)}
      placeholder="0"
      onChange={e => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        onChange(raw === '' ? 0 : Math.min(999, parseInt(raw, 10)));
      }}
      style={{
        width: 46, padding: '6px 2px', fontSize: 14, fontWeight: 600,
        border: '1.5px solid var(--border)', borderRadius: 8, textAlign: 'center',
        background: 'var(--surface2)', color: 'var(--text-primary)',
        fontFamily: 'DM Mono, monospace', outline: 'none',
      }}
    />
  );
}

export default function Datos({ asesores, setAsesores }) {
  const update = (id, field, val) =>
    setAsesores(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));

  const renderCanal = (canal, label, meta) => {
    const rows = asesores.filter(a => a.canal === canal);
    const totP = rows.reduce((s,a)=>s+a.prom,0);
    const totD = rows.reduce((s,a)=>s+a.det,0);
    const totN = rows.reduce((s,a)=>s+a.neut,0);
    const nps  = calcNPS(totP, totD, totN);

    // Columnas: Promotor | Neutro | Detractor
    const cols = [
      { f:'prom', label:'Prom ✓', bg:'#ECFDF5', border:'#6EE7B7', color:'var(--green)'  },
      { f:'neut', label:'Neut ~', bg:'var(--surface2)', border:'var(--border)', color:'var(--amber)' },
      { f:'det',  label:'Det ✗',  bg:'#FEF2F2', border:'#FCA5A5', color:'var(--red)'    },
    ];

    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ background:'var(--bcp-blue)', color:'#fff', fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>{label}</div>
          <div style={{ fontSize:15, fontWeight:700, color:npsColor(nps,meta) }}>NPS {nps!==null?nps:'—'}</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginLeft:'auto', fontWeight:500 }}>Meta: {meta}</div>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) 1fr 1fr 1fr 1fr' }}>
            <div style={{ padding:'10px 12px', fontSize:11, fontWeight:700, color:'var(--text-muted)', background:'var(--surface2)', borderBottom:'1px solid var(--border)' }}>Asesor</div>
            {cols.map(c => (
              <div key={c.f} style={{ padding:'10px 6px', fontSize:11, fontWeight:700, color:c.color, background:'var(--surface2)', borderBottom:'1px solid var(--border)', textAlign:'center' }}>{c.label}</div>
            ))}
            <div style={{ padding:'10px 6px', fontSize:11, fontWeight:700, color:'var(--bcp-blue)', background:'var(--surface2)', borderBottom:'1px solid var(--border)', textAlign:'center' }}>NPS</div>
          </div>

          {/* Filas */}
          {rows.map((a, i) => {
            const npsA = calcNPS(a.prom, a.det, a.neut);
            return (
              <div key={a.id} style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) 1fr 1fr 1fr 1fr', borderBottom: i<rows.length-1?'1px solid var(--border)':'none', background: i%2===1?'#FAFBFF':'var(--surface)' }}>
                <div style={{ padding:'10px 12px', fontSize:12, fontWeight:600, color:'var(--text-primary)', display:'flex', alignItems:'center' }}>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {a.nombre.split(' ')[0]} {a.nombre.split(' ').slice(-1)[0]}
                  </span>
                </div>
                {cols.map(c => (
                  <div key={c.f} style={{ padding:'6px 4px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <input
                      type="text" inputMode="numeric"
                      value={a[c.f] === 0 ? '' : String(a[c.f])}
                      placeholder="0"
                      onChange={e => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        update(a.id, c.f, raw === '' ? 0 : Math.min(999, parseInt(raw,10)));
                      }}
                      style={{ width:46, padding:'6px 2px', fontSize:14, fontWeight:600, border:`1.5px solid ${c.border}`, borderRadius:8, textAlign:'center', background:c.bg, color:'var(--text-primary)', fontFamily:'DM Mono,monospace', outline:'none' }}
                    />
                  </div>
                ))}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'6px 4px' }}>
                  <span style={{ fontSize:13, fontWeight:800, color:npsColor(npsA,meta) }}>{npsA!==null?npsA:'—'}</span>
                </div>
              </div>
            );
          })}

          {/* Totales */}
          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) 1fr 1fr 1fr 1fr', borderTop:'2px solid var(--border)', background:'var(--surface2)' }}>
            <div style={{ padding:'10px 12px', fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Total {label}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:'var(--green)',         textAlign:'center' }}>{totP}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:'var(--amber)',         textAlign:'center' }}>{totN}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:'var(--red)',           textAlign:'center' }}>{totD}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:npsColor(nps,meta),     textAlign:'center' }}>{nps!==null?nps:'—'}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,#F5A623,#d4891a)', borderRadius:'var(--radius)', padding:'14px 16px', marginBottom:20, display:'flex', gap:12, alignItems:'center', boxShadow:'0 4px 12px rgba(245,166,35,.3)' }}>
        <div style={{ background:'rgba(255,255,255,.25)', borderRadius:10, padding:8, flexShrink:0 }}>
          <ClipboardList size={20} color="#fff" strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:2 }}>Ingreso diario</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.9)', lineHeight:1.5 }}>
            Copia los números de Medallia · 27 campos · ~90 segundos
          </div>
        </div>
      </div>
      {renderCanal('V', 'Ventanilla', META_V)}
      {renderCanal('P', 'Plataforma', META_P)}
    </div>
  );
}
