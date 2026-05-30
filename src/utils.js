// ── CONSTANTES ──────────────────────────────────────────────────────────────
export const META_V  = 94;
export const META_P  = 94;
export const META_AG = 94;
export const AGENCIA = 'Suc. Pichanaki';
export const DIAS_HABILES_MES = 26; // Lunes a sábado

export const ASESORES_INIT = [
  { id: 1, nombre: 'Flor Yoselyn Urbina',   canal: 'V', prom: 10, det: 0, neut: 0 },
  { id: 2, nombre: 'Alessandro Gonzales',   canal: 'V', prom: 1,  det: 0, neut: 0 },
  { id: 3, nombre: 'Melissa Bautista',      canal: 'V', prom: 17, det: 1, neut: 2 },
  { id: 4, nombre: 'Cristel W. Castro',     canal: 'V', prom: 11, det: 2, neut: 0 },
  { id: 5, nombre: 'Maricruz Pampas',       canal: 'V', prom: 7,  det: 2, neut: 0 },
  { id: 6, nombre: 'Diana Gealy Ñahuin',    canal: 'V', prom: 11, det: 4, neut: 0 },
  { id: 7, nombre: 'Jesus E. Mescua',       canal: 'P', prom: 9,  det: 0, neut: 0 },
  { id: 8, nombre: 'Milagros Ravelo',       canal: 'P', prom: 5,  det: 0, neut: 0 },
  { id: 9, nombre: 'Bricet R. Reymundo',    canal: 'P', prom: 9,  det: 1, neut: 0 },
];

// ── CÁLCULO NPS ──────────────────────────────────────────────────────────────
export const calcNPS = (p, d, n) => {
  const t = p + d + n;
  if (!t) return null;
  return +((( p - d) / t) * 100).toFixed(1);
};

// NPS Agencia = (NPS_Ventanilla + NPS_Plataforma) / 2 → peso 50/50 confirmado
export const calcAgencia = (asesores) => {
  const v = asesores.filter(a => a.canal === 'V');
  const p = asesores.filter(a => a.canal === 'P');
  const npsV = calcNPS(
    v.reduce((s,a)=>s+a.prom,0), v.reduce((s,a)=>s+a.det,0), v.reduce((s,a)=>s+a.neut,0)
  );
  const npsP = calcNPS(
    p.reduce((s,a)=>s+a.prom,0), p.reduce((s,a)=>s+a.det,0), p.reduce((s,a)=>s+a.neut,0)
  );
  if (npsV === null && npsP === null) return null;
  if (npsV === null) return npsP;
  if (npsP === null) return npsV;
  return +((npsV + npsP) / 2).toFixed(1);
};

export const encNeeded = (p, d, n, meta) => {
  const t = p + d + n;
  const cur = calcNPS(p, d, n);
  if (cur !== null && cur >= meta) return 0;
  for (let x = 1; x <= 500; x++) {
    if (+((( p + x - d) / (t + x)) * 100).toFixed(1) >= meta) return x;
  }
  return '>500';
};

export const impacto1 = (asesor, todos) => {
  const antes   = calcAgencia(todos);
  const mod     = todos.map(a => a.id === asesor.id ? { ...a, prom: a.prom + 1 } : a);
  const despues = calcAgencia(mod);
  if (antes === null || despues === null) return 0;
  return +(despues - antes).toFixed(2);
};

// ── COLORES ───────────────────────────────────────────────────────────────────
export const npsColor = (v, m) => {
  if (v === null) return 'var(--text-muted)';
  if (v >= m)     return 'var(--green)';
  if (v >= m - 8) return 'var(--amber)';
  return 'var(--red)';
};
export const npsBg = (v, m) => {
  if (v === null) return 'var(--surface2)';
  if (v >= m)     return 'var(--green-bg)';
  if (v >= m - 8) return 'var(--amber-bg)';
  return 'var(--red-bg)';
};
export const npsTextColor = (v, m) => {
  if (v === null) return 'var(--text-muted)';
  if (v >= m)     return 'var(--green-text)';
  if (v >= m - 8) return 'var(--amber-text)';
  return 'var(--red-text)';
};
export const priLabel = (v, m) => {
  if (v === null) return { txt: 'Sin datos', cls: 'muted'  };
  if (v >= m)     return { txt: 'En meta ✓', cls: 'ok'     };
  if (v >= m - 8) return { txt: 'Atención',  cls: 'warn'   };
  return              { txt: 'Prioridad',  cls: 'danger' };
};

// ── FECHAS — Lunes a Sábado ───────────────────────────────────────────────────
const esHabil = (d) => d.getDay() !== 0; // solo domingo es no hábil

export const getDiasRestantes = () => {
  const hoy = new Date();
  const fin  = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  let dias = 0;
  for (let d = new Date(hoy); d <= fin; d.setDate(d.getDate() + 1)) {
    if (esHabil(d)) dias++;
  }
  return dias;
};

export const getDiasTranscurridos = () => {
  const hoy = new Date();
  const ini  = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  let dias = 0;
  for (let d = new Date(ini); d < hoy; d.setDate(d.getDate() + 1)) {
    if (esHabil(d)) dias++;
  }
  return Math.max(dias, 1);
};
