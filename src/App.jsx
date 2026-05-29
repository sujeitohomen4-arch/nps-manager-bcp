import { useState, useEffect } from 'react';
import { LayoutDashboard, PenLine, Target, Calculator, TrendingUp } from 'lucide-react';
import Dashboard   from './components/Dashboard';
import Datos       from './components/Datos';
import Prioridades from './components/Prioridades';
import Simulador   from './components/Simulador';
import Ritmo       from './components/Ritmo';
import { ASESORES_INIT, calcAgencia, META_AG, AGENCIA } from './utils';

const TABS = [
  { id: 'dashboard',   label: 'Inicio',  Icon: LayoutDashboard },
  { id: 'datos',       label: 'Datos',   Icon: PenLine         },
  { id: 'prioridades', label: 'Foco',    Icon: Target          },
  { id: 'simulador',   label: 'Simular', Icon: Calculator      },
  { id: 'ritmo',       label: 'Ritmo',   Icon: TrendingUp      },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [asesores, setAsesores] = useState(() => {
    try {
      const saved = localStorage.getItem('nps_asesores_v2');
      return saved ? JSON.parse(saved) : ASESORES_INIT;
    } catch { return ASESORES_INIT; }
  });

  useEffect(() => {
    localStorage.setItem('nps_asesores_v2', JSON.stringify(asesores));
  }, [asesores]);

  const npsAg = calcAgencia(asesores);
  const fecha = new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });

  const npsHeaderColor = npsAg === null      ? '#fff'
    : npsAg >= META_AG     ? '#4ADE80'
    : npsAg >= META_AG - 8 ? '#FCD34D'
    : '#FCA5A5';

  const screens = {
    dashboard:   <Dashboard   asesores={asesores} />,
    datos:       <Datos       asesores={asesores} setAsesores={setAsesores} />,
    prioridades: <Prioridades asesores={asesores} />,
    simulador:   <Simulador   asesores={asesores} />,
    ritmo:       <Ritmo       asesores={asesores} />,
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #003DA5 0%, #1a5bbf 100%)', padding: '16px 18px 14px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,61,165,.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--bcp-orange)', borderRadius: 8, padding: '5px 10px', fontSize: 13, fontWeight: 800, color: '#1A1A2E', letterSpacing: '.02em', boxShadow: '0 2px 8px rgba(245,166,35,.4)' }}>›BCP›</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>NPS Manager</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', lineHeight: 1.4, marginTop: 2 }}>{AGENCIA} · {fecha}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', background: 'rgba(255,255,255,.12)', borderRadius: 12, padding: '8px 14px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginBottom: 2, fontWeight: 500 }}>NPS Agencia</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: npsHeaderColor, lineHeight: 1 }}>
              {npsAg !== null ? npsAg : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: '16px 14px 90px', overflowY: 'auto' }}>
        {screens[tab]}
      </div>

      {/* ── Bottom Nav ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,61,165,.08)' }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, padding: '10px 4px 12px', border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, borderTop: active ? '2.5px solid var(--bcp-blue)' : '2.5px solid transparent', transition: 'all .15s' }}>
              <Icon size={22} color={active ? 'var(--bcp-blue)' : 'var(--text-muted)'} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? 'var(--bcp-blue)' : 'var(--text-muted)' }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
