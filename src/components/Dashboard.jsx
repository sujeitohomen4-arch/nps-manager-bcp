import { Target, Zap, Users, TrendingDown, TrendingUp } from 'lucide-react';
import Gauge from './Gauge';
import { calcNPS, calcAgencia, encNeeded, npsColor, META_V, META_P, META_AG } from '../utils';

export default function Dashboard({ asesores }) {
  const v = asesores.filter(a => a.canal === 'V');
  const p = asesores.filter(a => a.canal === 'P');
  const npsV  = calcNPS(v.reduce((s,a)=>s+a.prom,0), v.reduce((s,a)=>s+a.det,0), v.reduce((s,a)=>s+a.neut,0));
  const npsP  = calcNPS(p.reduce((s,a)=>s+a.prom,0), p.reduce((s,a)=>s+a.det,0), p.reduce((s,a)=>s+a.neut,0));
  const npsAg = calcAgencia(asesores);
  const totEnc  = asesores.reduce((s,a) => s+a.prom+a.det+a.neut, 0);
  const totProm = asesores.reduce((s,a) => s+a.prom, 0);
  const totDet  = asesores.reduce((s,a) => s+a.det,  0);

  const critico = [...asesores]
    .filter(a => { const n = calcNPS(a.prom,a.det,a.neut); return n!==null && n<(a.canal==='V'?META_V:META_P); })
    .sort((a,b) => calcNPS(a.prom,a.det,a.neut) - calcNPS(b.prom,b.det,b.neut))[0];

  const canales = [
    { label:'Ventanilla', nps:npsV, meta:META_V },
    { label:'Plataforma', nps:npsP, meta:META_P },
  ].sort((a,b) => (a.nps??999)-(b.nps??999));

  const barPct = v => v===null ? 0 : Math.max(0, Math.min(100, (v+100)/200*100));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* Alerta foco del día */}
      {critico && (
        <div style={{ background:'linear-gradient(135deg,#003DA5,#1a5bbf)', borderRadius:'var(--radius)', padding:'16px 18px', display:'flex', gap:14, alignItems:'flex-start', boxShadow:'0 4px 16px rgba(0,61,165,.3)' }}>
          <div style={{ background:'rgba(255,255,255,.2)', borderRadius:10, padding:8, flexShrink:0 }}>
            <Zap size={22} color="#FCD34D" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>Foco de hoy</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.88)', lineHeight:1.6 }}>
              Prioriza a <strong style={{ color:'#FCD34D' }}>{critico.nombre.split(' ')[0]} {critico.nombre.split(' ').slice(-1)[0]}</strong> — NPS {calcNPS(critico.prom,critico.det,critico.neut)}{' '}
              · Necesita <strong style={{ color:'#4ADE80' }}>{encNeeded(critico.prom,critico.det,critico.neut,critico.canal==='V'?META_V:META_P)}</strong> encuestas promotoras para meta
            </div>
          </div>
        </div>
      )}

      {/* Gauges */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
        {[
          { label:'NPS Agencia', val:npsAg, meta:META_AG },
          { label:'Ventanilla',  val:npsV,  meta:META_V  },
          { label:'Plataforma',  val:npsP,  meta:META_P  },
        ].map(({ label, val, meta }) => (
          <div key={label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 8px 12px', boxShadow:'var(--shadow)', textAlign:'center' }}>
            <div style={{ fontSize:10, color:'var(--text-secondary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>{label}</div>
            <Gauge value={val} meta={meta} size={82} />
          </div>
        ))}
      </div>

      {/* Fórmula */}
      <div style={{ background:'var(--bcp-blue-light)', border:'1.5px solid #C5D8F5', borderRadius:'var(--radius)', padding:'14px 16px' }}>
        <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
          <Target size={16} color="var(--bcp-blue)" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--bcp-blue)', marginBottom:3 }}>Fórmula confirmada</div>
            <div style={{ fontSize:12, color:'var(--bcp-blue)', lineHeight:1.6 }}>
              NPS Agencia = (NPS Ventanilla + NPS Plataforma) ÷ 2 · Peso <strong>50% / 50%</strong><br/>
              Trabaja siempre el canal más bajo — tiene más margen de mejora.
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'14px 12px', boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
            <Users size={14} color="var(--text-secondary)" />
            <div style={{ fontSize:11, color:'var(--text-secondary)', fontWeight:500 }}>Total enc.</div>
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)' }}>{totEnc}</div>
        </div>
        <div style={{ background:'var(--green-bg)', border:'1px solid var(--green-border)', borderRadius:'var(--radius-sm)', padding:'14px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
            <TrendingUp size={14} color="var(--green)" />
            <div style={{ fontSize:11, color:'var(--green-text)', fontWeight:500 }}>Promotores</div>
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:'var(--green)' }}>{totProm}</div>
        </div>
        <div style={{ background:'var(--red-bg)', border:'1px solid var(--red-border)', borderRadius:'var(--radius-sm)', padding:'14px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
            <TrendingDown size={14} color="var(--red)" />
            <div style={{ fontSize:11, color:'var(--red-text)', fontWeight:500 }}>Detractores</div>
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:'var(--red)' }}>{totDet}</div>
        </div>
      </div>

      {/* Canal a priorizar */}
      {npsV!==null && npsP!==null && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px', boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:14, textTransform:'uppercase', letterSpacing:'.06em' }}>Canal a priorizar hoy</div>
          {canales.map((c, i) => (
            <div key={c.label} style={{ marginBottom: i===0 ? 14 : 0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontSize:14, fontWeight: i===0 ? 700 : 500, color: i===0 ? 'var(--bcp-blue)' : 'var(--text-secondary)', display:'flex', alignItems:'center', gap:5 }}>
                  {i===0 && <Zap size={14} color="var(--bcp-orange)" strokeWidth={2.5} />}
                  {c.label}
                </span>
                <span style={{ fontSize:16, fontWeight:800, color:npsColor(c.nps,c.meta) }}>{c.nps}</span>
              </div>
              <div style={{ background:'var(--surface2)', borderRadius:20, height:10, overflow:'hidden' }}>
                <div style={{ width:`${barPct(c.nps)}%`, height:10, background:npsColor(c.nps,c.meta), borderRadius:20, transition:'width .5s' }}/>
              </div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>Meta: {c.meta}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
