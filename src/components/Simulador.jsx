import { useState } from 'react';
import { Plus, Minus, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { calcNPS, calcAgencia, npsColor, META_V, META_P, META_AG } from '../utils';

export default function Simulador({ asesores }) {
  const [extras, setExtras] = useState(() => Object.fromEntries(asesores.map(a=>[a.id,0])));
  const modRows    = asesores.map(a => ({...a, prom:a.prom+(extras[a.id]||0)}));
  const totalExtra = Object.values(extras).reduce((s,v)=>s+(v||0),0);
  const v  = asesores.filter(a=>a.canal==='V'), p  = asesores.filter(a=>a.canal==='P');
  const vM = modRows.filter(a=>a.canal==='V'),  pM = modRows.filter(a=>a.canal==='P');
  const sum = (arr,f) => arr.reduce((s,a)=>s+a[f],0);

  const npsVA = calcNPS(sum(v,'prom'),sum(v,'det'),sum(v,'neut'));
  const npsPA = calcNPS(sum(p,'prom'),sum(p,'det'),sum(p,'neut'));
  const npsAgA= calcAgencia(asesores);
  const npsVD = calcNPS(sum(vM,'prom'),sum(vM,'det'),sum(vM,'neut'));
  const npsPD = calcNPS(sum(pM,'prom'),sum(pM,'det'),sum(pM,'neut'));
  const npsAgD= calcAgencia(modRows);
  const meta  = npsAgD!==null && npsAgD>=META_AG;

  const KpiCard = ({l,v:val,m,after}) => (
    <div style={{ background:after&&val!==null&&val>=m?'var(--green-bg)':'var(--surface)', borderRadius:'var(--radius-sm)', padding:'10px 10px', border:`1px solid ${after&&val!==null&&val>=m?'var(--green-border)':'var(--border)'}`, textAlign:'center' }}>
      <div style={{ fontSize:10,color:'var(--text-muted)',marginBottom:3,fontWeight:500 }}>{l}</div>
      <div style={{ fontSize:18,fontWeight:800,color:npsColor(val,m) }}>{val!==null?val:'—'}</div>
    </div>
  );

  return (
    <div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px', marginBottom:14, boxShadow:'var(--shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <Calculator size={18} color="var(--bcp-blue)" strokeWidth={2}/>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>¿Qué pasa si ingresan más encuestas?</div>
        </div>

        {asesores.map(a => {
          const nps  = calcNPS(a.prom,a.det,a.neut);
          const meta = a.canal==='V'?META_V:META_P;
          const cC = a.canal==='V'?{bg:'#EBF4FF',color:'#1E40AF'}:{bg:'#ECFDF5',color:'#065F46'};
          const ex = extras[a.id]||0;
          return (
            <div key={a.id} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, padding:'10px 12px', background:'var(--surface2)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
              <div style={{ flex:1, fontSize:12, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:70 }}>
                {a.nombre.split(' ')[0]} {a.nombre.split(' ').slice(-1)[0]}
              </div>
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:20, fontWeight:700, flexShrink:0, background:cC.bg, color:cC.color }}>{a.canal}</span>
              <span style={{ fontSize:12, fontWeight:700, color:npsColor(nps,meta), minWidth:34, textAlign:'right' }}>{nps!==null?nps:'—'}</span>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <button onClick={()=>setExtras(e=>({...e,[a.id]:Math.max(0,(e[a.id]||0)-1)}))}
                  style={{ width:28, height:28, border:'1.5px solid var(--border)', borderRadius:8, background:'var(--surface)', color:'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Minus size={14} strokeWidth={2.5}/>
                </button>
                <span style={{ fontFamily:'DM Mono,monospace', fontSize:15, fontWeight:800, color:'var(--bcp-blue)', minWidth:24, textAlign:'center' }}>{ex}</span>
                <button onClick={()=>setExtras(e=>({...e,[a.id]:(e[a.id]||0)+1}))}
                  style={{ width:28, height:28, border:'1.5px solid var(--bcp-blue)', borderRadius:8, background:'var(--bcp-blue)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Plus size={14} strokeWidth={2.5}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
        <KpiCard l="Ventanilla antes" v={npsVA}  m={META_V}  />
        <KpiCard l="Plataforma antes" v={npsPA}  m={META_P}  />
        <KpiCard l="Agencia antes"    v={npsAgA} m={META_AG} />
      </div>

      <div style={{ textAlign:'center', margin:'8px 0', fontSize:13, color:'var(--bcp-blue)', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
        <ChevronDown size={16} strokeWidth={2.5}/>
        +{totalExtra} encuestas promotoras
        <ChevronDown size={16} strokeWidth={2.5}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
        <KpiCard l="Ventanilla nueva" v={npsVD}  m={META_V}  after/>
        <KpiCard l="Plataforma nueva" v={npsPD}  m={META_P}  after/>
        <KpiCard l="Agencia nueva"    v={npsAgD} m={META_AG} after/>
      </div>

      <div style={{ background:meta?'var(--green-bg)':'var(--red-bg)', borderRadius:'var(--radius)', padding:'14px 16px', border:`1.5px solid ${meta?'var(--green-border)':'var(--red-border)'}`, fontSize:13, color:meta?'var(--green-text)':'var(--red-text)', fontWeight:600, lineHeight:1.6 }}>
        {totalExtra===0
          ? 'Usa los botones + para simular encuestas promotoras adicionales por asesor.'
          : meta
            ? `✓ Con esas ${totalExtra} encuestas extra, la agencia llega a ${npsAgD} — ¡meta alcanzada!`
            : `Con ${totalExtra} encuestas extra la agencia quedaría en ${npsAgD}. Faltan ${+(META_AG-(npsAgD??0)).toFixed(1)} pts para meta. Agrega más a los asesores en rojo.`
        }
      </div>
    </div>
  );
}
