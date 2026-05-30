import { useState } from 'react';
import { Plus, Minus, Calculator, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { calcNPS, calcAgencia, npsColor, META_V, META_P, META_AG } from '../utils';

export default function Simulador({ asesores }) {
  const [extrasP, setExtrasP] = useState(() => Object.fromEntries(asesores.map(a=>[a.id,0])));
  const [extrasD, setExtrasD] = useState(() => Object.fromEntries(asesores.map(a=>[a.id,0])));

  // Filas modificadas con extras aplicados
  const modRows = asesores.map(a => ({
    ...a,
    prom: a.prom + (extrasP[a.id]||0),
    det:  a.det  + (extrasD[a.id]||0),
  }));

  const totalExtraP = Object.values(extrasP).reduce((s,v)=>s+(v||0),0);
  const totalExtraD = Object.values(extrasD).reduce((s,v)=>s+(v||0),0);

  const v  = asesores.filter(a=>a.canal==='V');
  const p  = asesores.filter(a=>a.canal==='P');
  const vM = modRows.filter(a=>a.canal==='V');
  const pM = modRows.filter(a=>a.canal==='P');
  const sum = (arr,f) => arr.reduce((s,a)=>s+a[f],0);

  const npsVA  = calcNPS(sum(v,'prom'),  sum(v,'det'),  sum(v,'neut'));
  const npsPA  = calcNPS(sum(p,'prom'),  sum(p,'det'),  sum(p,'neut'));
  const npsAgA = calcAgencia(asesores);
  const npsVD  = calcNPS(sum(vM,'prom'), sum(vM,'det'), sum(vM,'neut'));
  const npsPD  = calcNPS(sum(pM,'prom'), sum(pM,'det'), sum(pM,'neut'));
  const npsAgD = calcAgencia(modRows);
  const alcanza = npsAgD!==null && npsAgD>=META_AG;

  // Impacto individual por asesor con los extras aplicados
  const impactoIndividual = (a) => {
    const npsAntes   = calcNPS(a.prom, a.det, a.neut);
    const modA       = modRows.find(r=>r.id===a.id);
    const npsDespues = calcNPS(modA.prom, modA.det, modA.neut);
    if (npsAntes===null || npsDespues===null) return null;
    return +(npsDespues - npsAntes).toFixed(1);
  };

  const incP = id => setExtrasP(e=>({...e,[id]:(e[id]||0)+1}));
  const decP = id => setExtrasP(e=>({...e,[id]:Math.max(0,(e[id]||0)-1)}));
  const incD = id => setExtrasD(e=>({...e,[id]:(e[id]||0)+1}));
  const decD = id => setExtrasD(e=>({...e,[id]:Math.max(0,(e[id]||0)-1)}));

  const KpiCard = ({l,v:val,m,after}) => (
    <div style={{ background:after&&val!==null&&val>=m?'var(--green-bg)':'var(--surface)', borderRadius:'var(--radius-sm)', padding:'10px', border:`1px solid ${after&&val!==null&&val>=m?'var(--green-border)':'var(--border)'}`, textAlign:'center' }}>
      <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3, fontWeight:500 }}>{l}</div>
      <div style={{ fontSize:18, fontWeight:800, color:npsColor(val,m) }}>{val!==null?val:'—'}</div>
    </div>
  );

  const CountCtrl = ({ val, onInc, onDec, color }) => (
    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
      <button onClick={onDec} style={{ width:26, height:26, border:`1.5px solid var(--border)`, borderRadius:7, background:'var(--surface)', color:'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Minus size={13} strokeWidth={2.5}/>
      </button>
      <span style={{ fontFamily:'DM Mono,monospace', fontSize:14, fontWeight:800, color, minWidth:20, textAlign:'center' }}>{val}</span>
      <button onClick={onInc} style={{ width:26, height:26, border:`1.5px solid ${color}`, borderRadius:7, background:color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Plus size={13} strokeWidth={2.5}/>
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px', marginBottom:14, boxShadow:'var(--shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <Calculator size={18} color="var(--bcp-blue)" strokeWidth={2}/>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Simulador de escenarios</div>
        </div>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>
          Agrega promotores o detractores y ve el impacto en tiempo real
        </div>

        {/* Header columnas */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.8fr) 1fr 1fr 1fr', gap:4, marginBottom:6 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)' }}>Asesor</div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textAlign:'center' }}>NPS actual</div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--green)', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:3 }}>
            <TrendingUp size={11} strokeWidth={2.5}/> +Promotor
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--red)', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:3 }}>
            <TrendingDown size={11} strokeWidth={2.5}/> +Detractor
          </div>
        </div>

        {asesores.map(a => {
          const nps   = calcNPS(a.prom, a.det, a.neut);
          const meta  = a.canal==='V'?META_V:META_P;
          const delta = impactoIndividual(a);
          const epVal = extrasP[a.id]||0;
          const edVal = extrasD[a.id]||0;
          const hayCambio = epVal>0 || edVal>0;
          const cC = a.canal==='V'?{bg:'#EBF4FF',color:'#1E40AF'}:{bg:'#ECFDF5',color:'#065F46'};

          return (
            <div key={a.id} style={{ background: hayCambio?'#F8FAFF':'var(--surface2)', border:`1px solid ${hayCambio?'#C5D8F5':'var(--border)'}`, borderRadius:'var(--radius-sm)', padding:'10px 10px', marginBottom:8 }}>
              <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.8fr) 1fr 1fr 1fr', gap:4, alignItems:'center' }}>
                {/* Nombre */}
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {a.nombre.split(' ')[0]} {a.nombre.split(' ').slice(-1)[0]}
                  </div>
                  <span style={{ fontSize:10, padding:'1px 6px', borderRadius:20, fontWeight:700, background:cC.bg, color:cC.color }}>{a.canal==='V'?'Vent.':'Plat.'}</span>
                </div>
                {/* NPS actual + variación */}
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:16, fontWeight:800, color:npsColor(nps,meta) }}>{nps!==null?nps:'—'}</div>
                  {hayCambio && delta!==null && (
                    <div style={{ fontSize:11, fontWeight:700, color:delta>0?'var(--green)':delta<0?'var(--red)':'var(--text-muted)' }}>
                      {delta>0?'+':''}{delta}
                    </div>
                  )}
                </div>
                {/* +Promotor */}
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <CountCtrl val={epVal} onInc={()=>incP(a.id)} onDec={()=>decP(a.id)} color="var(--green)"/>
                </div>
                {/* +Detractor */}
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <CountCtrl val={edVal} onInc={()=>incD(a.id)} onDec={()=>decD(a.id)} color="var(--red)"/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Antes */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:8 }}>
        <KpiCard l="Ventanilla antes" v={npsVA}  m={META_V}  />
        <KpiCard l="Plataforma antes" v={npsPA}  m={META_P}  />
        <KpiCard l="Agencia antes"    v={npsAgA} m={META_AG} />
      </div>

      <div style={{ textAlign:'center', margin:'8px 0', fontSize:13, color:'var(--bcp-blue)', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
        <ChevronDown size={16} strokeWidth={2.5}/>
        {totalExtraP>0 && <span style={{ color:'var(--green)' }}>+{totalExtraP} promotores</span>}
        {totalExtraP>0 && totalExtraD>0 && <span style={{ color:'var(--text-muted)' }}>·</span>}
        {totalExtraD>0 && <span style={{ color:'var(--red)' }}>+{totalExtraD} detractores</span>}
        {totalExtraP===0 && totalExtraD===0 && <span style={{ color:'var(--text-muted)' }}>sin cambios</span>}
        <ChevronDown size={16} strokeWidth={2.5}/>
      </div>

      {/* Después */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
        <KpiCard l="Ventanilla nueva" v={npsVD}  m={META_V}  after/>
        <KpiCard l="Plataforma nueva" v={npsPD}  m={META_P}  after/>
        <KpiCard l="Agencia nueva"    v={npsAgD} m={META_AG} after/>
      </div>

      {/* Veredicto */}
      <div style={{ background:alcanza?'var(--green-bg)':'var(--red-bg)', borderRadius:'var(--radius)', padding:'14px 16px', border:`1.5px solid ${alcanza?'var(--green-border)':'var(--red-border)'}`, fontSize:13, color:alcanza?'var(--green-text)':'var(--red-text)', fontWeight:600, lineHeight:1.6 }}>
        {totalExtraP===0 && totalExtraD===0
          ? 'Usa los botones + para simular promotores o detractores por asesor.'
          : alcanza
            ? `✓ Con esos cambios, la agencia llega a ${npsAgD} — ¡meta alcanzada!`
            : `Con esos cambios la agencia quedaría en ${npsAgD}. Faltan ${+(META_AG-(npsAgD??0)).toFixed(1)} pts para meta.`
        }
      </div>
    </div>
  );
}
