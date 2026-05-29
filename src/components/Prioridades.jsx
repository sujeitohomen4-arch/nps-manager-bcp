import { Zap, Target, TrendingUp, AlertCircle } from 'lucide-react';
import Badge from './Badge';
import { calcNPS, encNeeded, impacto1, npsColor, META_V, META_P } from '../utils';

export default function Prioridades({ asesores }) {
  const conImpacto = asesores.map(a => {
    const nps  = calcNPS(a.prom,a.det,a.neut);
    const meta = a.canal==='V'?META_V:META_P;
    const imp  = impacto1(a,asesores);
    const need = (a.prom+a.det+a.neut)>0 ? encNeeded(a.prom,a.det,a.neut,meta) : '—';
    return {...a,nps,meta,imp,need};
  }).sort((a,b) => {
    const rank = x => x.nps===null?3:x.nps<x.meta?0:x.nps<x.meta+5?1:2;
    if(rank(a)!==rank(b)) return rank(a)-rank(b);
    return (a.nps??999)-(b.nps??999);
  });
  const maxImp = Math.max(...conImpacto.map(a=>a.imp),0.01);

  return (
    <div>
      <div style={{ background:'var(--bcp-blue-light)', border:'1.5px solid #C5D8F5', borderRadius:'var(--radius)', padding:'14px 16px', marginBottom:16, display:'flex', gap:10, alignItems:'flex-start' }}>
        <Target size={18} color="var(--bcp-blue)" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }}/>
        <div style={{ fontSize:13, color:'var(--bcp-blue)', lineHeight:1.6 }}>
          <strong>Regla de oro:</strong> Con peso 50/50, trabaja el canal más bajo. Dentro del canal, el asesor con NPS más bajo tiene más margen de mejora.
        </div>
      </div>

      {conImpacto.map((a,i) => {
        const esPrioridad = a.nps!==null && a.nps<a.meta;
        const barW = Math.round((a.imp/maxImp)*100);
        const canalStyle = a.canal==='V'
          ? { bg:'#EBF4FF', color:'#1E40AF' }
          : { bg:'#ECFDF5', color:'#065F46' };
        const borderColor = esPrioridad && i<2 ? 'var(--red-border)' : 'var(--border)';
        const accentColor = npsColor(a.nps,a.meta);

        return (
          <div key={a.id} style={{ background:'var(--surface)', border:`1px solid ${borderColor}`, borderLeft:`4px solid ${accentColor}`, borderRadius:`0 var(--radius) var(--radius) 0`, padding:'14px 16px', marginBottom:10, boxShadow:'var(--shadow)' }}>

            {/* Fila nombre */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)', flex:1, minWidth:90, display:'flex', alignItems:'center', gap:6 }}>
                {i===0 && <Zap size={15} color="var(--bcp-orange)" strokeWidth={2.5}/>}
                {a.nombre.split(' ')[0]} {a.nombre.split(' ').slice(-1)[0]}
              </div>
              <span style={{ fontSize:11, padding:'3px 9px', borderRadius:20, fontWeight:700, background:canalStyle.bg, color:canalStyle.color }}>
                {a.canal==='V'?'Ventanilla':'Plataforma'}
              </span>
              <Badge v={a.nps} m={a.meta}/>
            </div>

            {/* KPIs */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
              <div style={{ background:'var(--surface2)', borderRadius:'var(--radius-sm)', padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3, fontWeight:500 }}>NPS actual</div>
                <div style={{ fontSize:20, fontWeight:800, color:accentColor }}>{a.nps!==null?a.nps:'—'}</div>
              </div>
              <div style={{ background:'var(--surface2)', borderRadius:'var(--radius-sm)', padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3, fontWeight:500 }}>Meta</div>
                <div style={{ fontSize:20, fontWeight:800, color:'var(--bcp-blue)' }}>{a.meta}</div>
              </div>
              <div style={{ background:a.need===0?'var(--green-bg)':'var(--bcp-blue-light)', borderRadius:'var(--radius-sm)', border:`1px solid ${a.need===0?'var(--green-border)':'#C5D8F5'}`, padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3, fontWeight:500 }}>Faltantes</div>
                <div style={{ fontSize:20, fontWeight:800, color:a.need===0?'var(--green)':'var(--bcp-blue)' }}>
                  {a.need===0?'✓':a.need}
                </div>
              </div>
            </div>

            {/* Barra impacto */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginBottom:5, fontWeight:500 }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <TrendingUp size={12} strokeWidth={2}/> Impacto en agencia por +1 promotor
                </span>
                <span style={{ fontWeight:700, color:'var(--bcp-blue)', fontSize:13 }}>+{a.imp} pts</span>
              </div>
              <div style={{ background:'var(--surface2)', borderRadius:20, height:7, overflow:'hidden' }}>
                <div style={{ width:`${barW}%`, height:7, background:`linear-gradient(90deg,var(--bcp-blue),#5B8DEF)`, borderRadius:20, transition:'width .4s' }}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
