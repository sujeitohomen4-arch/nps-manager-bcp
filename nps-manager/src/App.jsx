import { useState, useEffect } from 'react';
import Dashboard    from './components/Dashboard';
import Datos        from './components/Datos';
import Prioridades  from './components/Prioridades';
import Simulador    from './components/Simulador';
import Ritmo        from './components/Ritmo';
import { ASESORES_INIT, calcAgencia, META_AG, AGENCIA } from './utils';

const TABS = [
  { id: 'dashboard',    label: 'Inicio',   icon: '🏠' },
  { id: 'datos',        label: 'Datos',    icon: '✏️' },
  { id: 'prioridades',  label: 'Foco',     icon: '🎯' },
  { id: 'simulador',    label: 'Simular',  icon: '🧮' },
  { id: 'ritmo',        label: 'Ritmo',    icon: '📈' },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

  const [asesores, setAsesores] = useState(() => {
    try {
      const saved = localStorage.getItem('nps_asesores_v2');
      return saved ? JSON.parse(saved) : ASESORES_INIT;
    } catch {
      return ASESORES_INIT;
    }
  });

  useEffect(() => {
    localStorage.setItem('nps_asesores_v2', JSON.stringify(asesores));
  }, [asesores]);

  const npsAg = calcAgencia(asesores);
  const fecha = new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });

  const npsHeaderColor = npsAg === null ? '#fff'
    : npsAg >= META_AG      ? '#5FF4C0'
    : npsAg >= META_AG - 8  ? '#FCD34D'
    : '#FCA5A5';

  const screens = {
    dashboard:   <Dashboard   asesores={asesores} />,
    datos:       <Datos       asesores={asesores} setAsesores={setAsesores} />,
    prioridades: <Prioridades asesores={asesores} />,
    simulador:   <Simulador   asesores={asesores} />,
    ritmo:       <Ritmo       asesores={asesores} />,
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* ── Header ── */}
      <div style={{ background: 'var(--bcp-blue)', padding: '14px 16px 12px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,61,165,.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--bcp-orange)', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 700, color: '#1A1A2E', letterSpacing: '.02em' }}>›BCP›</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1 }}>NPS Manager</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)', lineHeight: 1.4, marginTop: 1 }}>{AGENCIA} · {fecha}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)', marginBottom: 1 }}>NPS Agencia</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: npsHeaderColor, lineHeight: 1 }}>
              {npsAg !== null ? npsAg : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: '14px 14px 80px', overflowY: 'auto' }}>
        {screens[tab]}
      </div>

      {/* ── Bottom Nav ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', zIndex: 100 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '8px 4px 10px', border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              borderTop: tab === t.id ? '2px solid var(--bcp-blue)' : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? 'var(--bcp-blue)' : 'var(--text-muted)' }}>
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
