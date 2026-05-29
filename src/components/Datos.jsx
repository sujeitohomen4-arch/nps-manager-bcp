import { ClipboardList, CheckCircle2 } from 'lucide-react';
import { calcNPS, npsColor, META_V, META_P } from '../utils';

export default function Datos({ asesores, setAsesores }) {
  const update = (id, field, val) =>
    setAsesores(prev => prev.map(a => a.id===id ? {...a,[field]:Math.max(0,+val||0)} : a));

  const renderCanal = (canal, label, meta) => {
    const rows = asesores.filter(a => a.canal===canal);
    const totP = rows.reduce((s,a)=>s+a.prom,0);
    const totD = rows.reduce((s,a)=>s+a.det,0);
    const totN = rows.reduce((s,a)=>s+a.neut,0);
    const nps  = calcNPS(totP,totD,totN);
    const fieldBg = { prom:'#ECFDF5', det:'#FEF2F2', neut:'var(--surface2)' };
    const fieldBorder = { prom:'#6EE7B7', det:'#FCA5A5', neut:'var(--border)' };

    return (
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ background:'var(--bcp-blue)', color:'#fff', fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>{label}</div>
          <div style={{ fontSize:15, fontWeight:700, color:npsColor(nps,meta) }}>NPS {nps!==null?nps:'—'}</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginLeft:'auto', fontWeight:500 }}>Meta: {meta}</div>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) 1fr 1fr 1fr 1fr' }}>
            {[
              { h:'Asesor', color:'var(--text-muted)' },
              { h:'Prom ✓', color:'var(--green)' },
              { h:'Det ✗',  color:'var(--red)'   },
              { h:'Neut ~', color:'var(--amber)'  },
              { h:'NPS',    color:'var(--bcp-blue)' },
            ].map(({ h, color }) => (
              <div key={h} style={{ padding:'10px 8px', fontSize:11, fontWeight:700, color, background:'var(--surface2)', borderBottom:'1px solid var(--border)', textAlign: h==='Asesor'?'left':'center' }}>{h}</div>
            ))}
          </div>

          {rows.map((a,i) => {
            const npsA = calcNPS(a.prom,a.det,a.neut);
            return (
              <div key={a.id} style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) 1fr 1fr 1fr 1fr', borderBottom: i<rows.length-1?'1px solid var(--border)':'none' }}>
                <div style={{ padding:'10px 12px', fontSize:12, fontWeight:600, color:'var(--text-primary)', display:'flex', alignItems:'center', overflow:'hidden' }}>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {a.nombre.split(' ')[0]} {a.nombre.split(' ').slice(-1)[0]}
                  </span>
                </div>
                {['prom','det','neut'].map(f => (
                  <div key={f} style={{ padding:'6px 4px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <input type="number" value={a[f]} min="0"
                      onChange={e => update(a.id,f,e.target.value)}
                      style={{ width:46, padding:'6px 2px', fontSize:14, fontWeight:600, border:`1.5px solid ${fieldBorder[f]}`, borderRadius:8, textAlign:'center', background:fieldBg[f], color:'var(--text-primary)', fontFamily:'DM Mono,monospace', outline:'none' }}/>
                  </div>
                ))}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'6px 4px' }}>
                  <span style={{ fontSize:13, fontWeight:800, color:npsColor(npsA,meta) }}>{npsA!==null?npsA:'—'}</span>
                </div>
              </div>
            );
          })}

          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) 1fr 1fr 1fr 1fr', borderTop:'2px solid var(--border)', background:'var(--surface2)' }}>
            <div style={{ padding:'10px 12px', fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Total {label}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:'var(--green)', textAlign:'center' }}>{totP}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:'var(--red)', textAlign:'center' }}>{totD}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:'var(--text-secondary)', textAlign:'center' }}>{totN}</div>
            <div style={{ padding:'10px 4px', fontSize:14, fontWeight:800, color:npsColor(nps,meta), textAlign:'center' }}>{nps!==null?nps:'—'}</div>
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
      {renderCanal('V','Ventanilla',META_V)}
      {renderCanal('P','Plataforma',META_P)}
    </div>
  );
}
