import Badge from './Badge';
import { calcNPS, calcAgencia, npsColor, META_V, META_P, META_AG, getDiasRestantes, getDiasTranscurridos, DIAS_HABILES_MES } from '../utils';

export default function Ritmo({ asesores }) {
  const diasRestantes     = getDiasRestantes();
  const diasTranscurridos = getDiasTranscurridos();

  const v = asesores.filter(a => a.canal === 'V');
  const p = asesores.filter(a => a.canal === 'P');
  const sum = (arr, f) => arr.reduce((s, a) => s + a[f], 0);

  const npsVActual  = calcNPS(sum(v,'prom'), sum(v,'det'), sum(v,'neut'));
  const npsPActual  = calcNPS(sum(p,'prom'), sum(p,'det'), sum(p,'neut'));
  const npsAg       = calcAgencia(asesores);
  const totProm     = asesores.reduce((s, a) => s + a.prom, 0);
  const encV        = v.reduce((s,a) => s + a.prom + a.det + a.neut, 0);
  const encP        = p.reduce((s,a) => s + a.prom + a.det + a.neut, 0);

  const promXdia = diasTranscurridos > 0 ? +(totProm / diasTranscurridos).toFixed(1) : 0;

  // Proyección al cierre: simula NPS de agencia con promotores proyectados
  const proyectar = () => {
    const totPromV    = sum(v,'prom');
    const extraPromV  = Math.round(promXdia * diasRestantes * (totPromV / Math.max(totProm, 1)));
    const newNpsV     = calcNPS(totPromV + extraPromV, sum(v,'det'), sum(v,'neut'));
    const newNpsP     = npsPActual;
    if (newNpsV === null || newNpsP === null) return null;
    return +((newNpsV + newNpsP) / 2).toFixed(1);
  };
  const npsAgProyectado = proyectar();
  const enCamino        = npsAgProyectado !== null && npsAgProyectado >= META_AG;

  // Promotores por día necesarios para llegar a meta
  const promsNecesarios = () => {
    if (npsAg === null || diasRestantes === 0) return 0;
    if (npsAg >= META_AG) return 0;
    // Necesito subir ambos canales proporcionalmente
    return Math.max(0, Math.ceil((META_AG - npsAg) / 1.5));
  };
  const promNecHoy = promsNecesarios();

  return (
    <div>
      {/* Proyección */}
      <div style={{ background: enCamino ? 'var(--green-bg)' : 'var(--red-bg)', border: `1px solid ${enCamino ? '#B7EDD8' : '#FCA5A5'}`, borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: enCamino ? 'var(--green-text)' : 'var(--red-text)', marginBottom: 4 }}>
          {enCamino ? '✓ A este ritmo alcanzas la meta' : '⚠ A este ritmo no alcanzas la meta'}
        </div>
        <div style={{ fontSize: 12, color: enCamino ? 'var(--green-text)' : 'var(--red-text)', lineHeight: 1.6 }}>
          Proyección al cierre del mes:{' '}
          <strong>NPS {npsAgProyectado !== null ? npsAgProyectado : '—'}</strong>
          {!enCamino && npsAgProyectado !== null && ` — faltan ${+(META_AG - npsAgProyectado).toFixed(1)} pts`}
        </div>
      </div>

      {/* KPIs de ritmo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Días hábiles restantes</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--bcp-blue)', lineHeight: 1 }}>{diasRestantes}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>de {DIAS_HABILES_MES} del mes</div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Ritmo actual</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>{promXdia}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>promotores / día hábil</div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>NPS agencia hoy</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: npsColor(npsAg, META_AG), lineHeight: 1 }}>{npsAg !== null ? npsAg : '—'}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>meta: {META_AG}</div>
        </div>

        <div style={{ background: promNecHoy > 0 ? 'var(--amber-bg)' : 'var(--green-bg)', border: `1px solid ${promNecHoy > 0 ? '#FDE68A' : '#B7EDD8'}`, borderRadius: 'var(--radius)', padding: '12px 14px' }}>
          <div style={{ fontSize: 10, color: promNecHoy > 0 ? 'var(--amber-text)' : 'var(--green-text)', marginBottom: 2 }}>Necesitas hoy</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: promNecHoy > 0 ? 'var(--amber)' : 'var(--green)', lineHeight: 1 }}>
            {promNecHoy > 0 ? promNecHoy : '✓'}
          </div>
          <div style={{ fontSize: 10, color: promNecHoy > 0 ? 'var(--amber-text)' : 'var(--green-text)', marginTop: 2 }}>
            {promNecHoy > 0 ? 'promotores / día' : 'Ya en meta'}
          </div>
        </div>
      </div>

      {/* Estado por canal */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.04em' }}>Estado por canal</div>
        {[
          { label: 'Ventanilla', nps: npsVActual, meta: META_V, enc: encV },
          { label: 'Plataforma', nps: npsPActual, meta: META_P, enc: encP },
        ].map((c, i) => (
          <div key={c.label} style={{ marginBottom: i === 0 ? 14 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.enc} enc.</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: npsColor(c.nps, c.meta) }}>{c.nps !== null ? c.nps : '—'}</span>
                <Badge v={c.nps} m={c.meta} />
              </div>
            </div>
            <div style={{ background: '#EDF2FB', borderRadius: 20, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${c.nps !== null ? Math.max(0, Math.min(100, (c.nps + 100) / 200 * 100)) : 0}%`, height: 8, background: npsColor(c.nps, c.meta), borderRadius: 20, transition: 'width .5s' }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Meta: {c.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
