import { Clock, TrendingUp, Target, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import Badge from './Badge';
import { calcNPS, calcAgencia, npsColor, META_V, META_P, META_AG, getDiasRestantes, getDiasTranscurridos, DIAS_HABILES_MES } from '../utils';

export default function Ritmo({ asesores }) {
  const diasRestantes     = getDiasRestantes();
  const diasTranscurridos = getDiasTranscurridos();
  const v = asesores.filter(a=>a.canal==='V'), p = asesores.filter(a=>a.canal==='P');
  const sum = (arr,f) => arr.reduce((s,a)=>s+a[f],0);
  const npsVActual = calcNPS(sum(v,'prom'),sum(v,'det'),sum(v,'neut'));
  const npsPActual = calcNPS(sum(p,'prom'),sum(p,'det'),sum(p,'neut'));
  const npsAg      = calcAgencia(asesores);
  const totProm    = asesores.reduce((s,a)=>s+a.prom,0);
  const encV       = v.reduce((s,a)=>s+a.prom+a.det+a.neut,0);
  const encP       = p.reduce((s,a)=>s+a.prom+a.det+a.neut,0);
  const promXdia   = diasTranscurridos>0 ? +(totProm/diasTranscurridos).toFixed(1) : 0;

  const proyectar = () => {
    const totPromV   = sum(v,'prom');
    const extraPromV = Math.round(promXdia*diasRestantes*(totPromV/Math.max(totProm,1)));
    const newNpsV    = calcNPS(totPromV+extraPromV,sum(v,'det'),sum(v,'neut'));
    if(newNpsV===null||npsPActual===null) return null;
    return +((newNpsV+npsPActual)/2).toFixed(1);
  };
  const npsAgProy = proyectar();
  const enCamino  = npsAgProy!==null && npsAgProy>=META_AG;
  const promNec   = npsAg!==null && npsAg<META_AG && diasRestantes>0
    ? Math.max(0,Math.ceil((META_AG-npsAg)/1.5)) : 0;

  const KpiBox = ({ icon:Icon, iconColor, label, value, sub, bg, border, valueColor }) => (
    <div style={{ background:bg||'var(--surface)', border:`1px solid ${border||'var(--border)'}`, borderRadius:'var(--radius)', padding:'14px 16px', boxShadow:'var(--shadow)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
        <Icon size={15} color={iconColor||'var(--text-secondary)'} strokeWidth={2}/>
        <div style={{ fontSize:11, color:'var(--text-secondary)', fontWeight:500 }}>{label}</div>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color:valueColor||'var(--text-primary)', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* Proyección banner */}
      <div style={{ background:enCamino?'linear-gradient(135deg,#059669,#10b981)':'linear-gradient(135deg,#DC2626,#ef4444)', borderRadius:'var(--radius)', padding:'16px 18px', boxShadow:enCamino?'0 4px 16px rgba(5,150,105,.3)':'0 4px 16px rgba(220,38,38,.3)' }}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
          <div style={{ background:'rgba(255,255,255,.2)', borderRadius:10, padding:8, flexShrink:0 }}>
            {enCamino ? <CheckCircle2 size={22} color="#fff" strokeWidth={2}/> : <AlertTriangle size={22} color="#fff" strokeWidth={2}/>}
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>
              {enCamino?'A este ritmo alcanzas la meta':'A este ritmo no alcanzas la meta'}
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.9)', lineHeight:1.6 }}>
              Proyección al cierre:{' '}
              <strong style={{ color:'#fff', fontSize:16 }}>NPS {npsAgProy!==null?npsAgProy:'—'}</strong>
              {!enCamino && npsAgProy!==null && ` — faltan ${+(META_AG-npsAgProy).toFixed(1)} puntos`}
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <KpiBox icon={Calendar}    iconColor="var(--bcp-blue)"  label="Días hábiles restantes" value={diasRestantes}          sub={`de ${DIAS_HABILES_MES} del mes`}  valueColor="var(--bcp-blue)"/>
        <KpiBox icon={TrendingUp}  iconColor="var(--green)"     label="Ritmo actual"            value={promXdia}               sub="promotores / día hábil"            valueColor="var(--green)"/>
        <KpiBox icon={Target}      iconColor={npsColor(npsAg,META_AG)} label="NPS agencia hoy"  value={npsAg!==null?npsAg:'—'} sub={`meta: ${META_AG}`}               valueColor={npsColor(npsAg,META_AG)}/>
        <KpiBox icon={Clock}       iconColor={promNec>0?'var(--amber)':'var(--green)'} label="Necesitas por día" value={promNec>0?promNec:'✓'} sub={promNec>0?'promotores / día':'Ya en meta'} valueColor={promNec>0?'var(--amber)':'var(--green)'} bg={promNec>0?'var(--amber-bg)':'var(--green-bg)'} border={promNec>0?'var(--amber-border)':'var(--green-border)'}/>
      </div>

      {/* Estado por canal */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px', boxShadow:'var(--shadow)' }}>
        <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:14, textTransform:'uppercase', letterSpacing:'.06em' }}>Estado por canal</div>
        {[
          { label:'Ventanilla', nps:npsVActual, meta:META_V, enc:encV },
          { label:'Plataforma', nps:npsPActual, meta:META_P, enc:encP },
        ].map((c,i) => (
          <div key={c.label} style={{ marginBottom:i===0?14:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{c.label}</span>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>{c.enc} enc.</span>
                <span style={{ fontSize:16, fontWeight:800, color:npsColor(c.nps,c.meta) }}>{c.nps!==null?c.nps:'—'}</span>
                <Badge v={c.nps} m={c.meta}/>
              </div>
            </div>
            <div style={{ background:'var(--surface2)', borderRadius:20, height:10, overflow:'hidden' }}>
              <div style={{ width:`${c.nps!==null?Math.max(0,Math.min(100,(c.nps+100)/200*100)):0}%`, height:10, background:npsColor(c.nps,c.meta), borderRadius:20, transition:'width .5s' }}/>
            </div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>Meta: {c.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
