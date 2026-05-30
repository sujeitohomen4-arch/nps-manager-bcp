import { useState, useEffect } from 'react';
import { LayoutDashboard, PenLine, Target, Calculator, TrendingUp, Camera, Settings } from 'lucide-react';
import Dashboard    from './components/Dashboard';
import Datos        from './components/Datos';
import Prioridades  from './components/Prioridades';
import Simulador    from './components/Simulador';
import Ritmo        from './components/Ritmo';
import CargaIA      from './components/CargaIA';
import Configuracion from './components/Configuracion';
import { ASESORES_INIT, calcAgencia, META_AG, AGENCIA as AGENCIA_DEFAULT } from './utils';

const TABS = [
  { id: 'dashboard',   label: 'Inicio',   Icon: LayoutDashboard },
  { id: 'cargar',      label: 'IA',       Icon: Camera          },
  { id: 'datos',       label: 'Datos',    Icon: PenLine         },
  { id: 'prioridades', label: 'Foco',     Icon: Target          },
  { id: 'simulador',   label: 'Simular',  Icon: Calculator      },
  { id: 'ritmo',       label: 'Ritmo',    Icon: TrendingUp      },
  { id: 'config',      label: 'Config',   Icon: Settings        },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

  const [asesores, setAsesores] = useState(() => {
    try {
      const s = localStorage.getItem('nps_asesores_v2');
      return s ? JSON.parse(s) : ASESORES_INIT;
    } catch { return ASESORES_INIT; }
  });

  const [apiKey, setApiKey] = useState(() =>
    localStorage.getItem('nps_api_key') || ''
  );

  const [agencia, setAgencia] = useState(() =>
    localStorage.getItem('nps_agencia') || AGENCIA_DEFAULT
  );

  useEffect(() => {
    localStorage.setItem('nps_asesores_v2', JSON.stringify(asesores));
  }, [asesores]);

  const npsAg = calcAgencia(asesores);
  const fecha = new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });

  const npsColor = npsAg === null      ? '#fff'
    : npsAg >= META_AG     ? '#4ADE80'
    : npsAg >= META_AG - 8 ? '#FCD34D'
    : '#FCA5A5';

  const screens = {
    dashboard:   <Dashboard   asesores={asesores}/>,
    cargar:      <CargaIA     asesores={asesores} setAsesores={setAsesores} apiKey={apiKey}/>,
    datos:       <Datos       asesores={asesores} setAsesores={setAsesores}/>,
    prioridades: <Prioridades asesores={asesores}/>,
    simulador:   <Simulador   asesores={asesores}/>,
    ritmo:       <Ritmo       asesores={asesores}/>,
    config:      <Configuracion apiKey={apiKey} setApiKey={setApiKey} agencia={agencia} setAgencia={setAgencia}/>,
  };

  // Tabs en dos filas para que quepan 7
  const tabsTop    = TABS.slice(0, 4);
  const tabsBottom = TABS.slice(4);

  return (
    <div style={{ maxWidth:480, margin:'0 auto', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#003DA5 0%,#1a5bbf 100%)', padding:'14px 18px 12px', position:'sticky', top:0, zIndex:100, boxShadow:'0 4px 20px rgba(0,61,165,.35)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ background:'#F5A623', borderRadius:8, padding:'5px 10px', fontSize:13, fontWeight:800, color:'#1A1A2E', boxShadow:'0 2px 8px rgba(245,166,35,.4)' }}>›BCP›</div>
            <div>
              <div style={{ fontSize:17, fontWeight:700, color:'#fff', lineHeight:1.1 }}>NPS Manager</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', marginTop:2 }}>{agencia} · {fecha}</div>
            </div>
          </div>
          <div style={{ textAlign:'right', background:'rgba(255,255,255,.12)', borderRadius:12, padding:'8px 14px' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', marginBottom:2 }}>NPS Agencia</div>
            <div style={{ fontSize:26, fontWeight:800, color:npsColor, lineHeight:1 }}>{npsAg !== null ? npsAg : '—'}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:'16px 14px 100px', overflowY:'auto' }}>
        {screens[tab]}
      </div>

      {/* Bottom Nav — 2 filas para 7 tabs */}
      <nav style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, background:'var(--color-background-primary)', borderTop:'1px solid var(--color-border-tertiary)', zIndex:100, boxShadow:'0 -4px 20px rgba(0,61,165,.08)' }}>
        {/* Fila 1: Inicio · IA · Datos · Foco */}
        <div style={{ display:'flex', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
          {tabsTop.map(({ id, label, Icon }) => {
            const active = tab === id;
            const isIA = id === 'cargar';
            return (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex:1, padding:'8px 4px 8px', border:'none', background: isIA && active ? '#003DA5' : 'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, borderTop: active && !isIA ? '2.5px solid #003DA5' : '2.5px solid transparent', borderRadius: isIA ? '0' : '0' }}>
                <Icon size={20} color={isIA ? (active?'#fff':'#F5A623') : active?'#003DA5':'var(--color-text-tertiary)'} strokeWidth={active?2.5:1.8}/>
                <span style={{ fontSize:10, fontWeight:active?700:400, color: isIA?(active?'#fff':'#F5A623'):active?'#003DA5':'var(--color-text-tertiary)' }}>{label}</span>
              </button>
            );
          })}
        </div>
        {/* Fila 2: Simular · Ritmo · Config */}
        <div style={{ display:'flex' }}>
          {tabsBottom.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex:1, padding:'8px 4px 10px', border:'none', background:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, borderTop: active ? '2.5px solid #003DA5' : '2.5px solid transparent' }}>
                <Icon size={20} color={active?'#003DA5':'var(--color-text-tertiary)'} strokeWidth={active?2.5:1.8}/>
                <span style={{ fontSize:10, fontWeight:active?700:400, color:active?'#003DA5':'var(--color-text-tertiary)' }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
