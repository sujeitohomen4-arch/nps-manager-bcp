import { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';

const PROMPT = `Eres un extractor de datos de reportes Medallia BCP.
Analiza esta imagen del ranking de colaboradores y extrae los datos de cada asesor.

La tabla tiene columnas: Colaborador, n.° de registros, semanas, Total, Benchmark, Delta.
El valor "Total" tiene formato "NPS (encuestas)" por ejemplo: "83.8 (68)" significa NPS=83.8 con 68 encuestas.

Para calcular promotores, neutros y detractores a veces están visibles como porcentajes (ej: 91.2% (62) promotores, 1.5% (1) neutros, 7.4% (5) detractores).

Si los porcentajes están visibles úsalos directamente.
Si solo tienes el NPS total y el número de encuestas, estima:
- promotores = encuestas donde NPS sería ese valor (aproximación)

Devuelve SOLO un JSON válido, sin explicación, sin markdown, sin bloques de código.
Formato exacto:
[
  {
    "nombre": "Nombre Apellido",
    "canal": "V",
    "prom": 10,
    "neut": 1,
    "det": 2
  }
]

Canal: "V" para Ventanilla, "P" para Plataforma.
Si no puedes determinar el canal, usa "V" por defecto.
Si ves "PLATAFORMA" en el filtro de la imagen, todos son canal "P".
Si ves "VENTANILLA" en el filtro, todos son canal "V".
Incluye TODOS los colaboradores visibles en la imagen.`;

export default function CargaIA({ asesores, setAsesores, apiKey }) {
  const [estado, setEstado]       = useState('idle'); // idle | cargando | preview | error
  const [preview, setPreview]     = useState(null);
  const [imgBase64, setImgBase64] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [error, setError]         = useState('');
  const [aplicado, setAplicado]   = useState(false);
  const inputRef = useRef();

  const leerArchivo = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Por favor sube una imagen (JPG, PNG, WEBP).');
      setEstado('error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      setImgBase64(base64);
      setPreview(e.target.result);
      setEstado('preview');
      setAplicado(false);
      setResultado(null);
    };
    reader.readAsDataURL(file);
  };

  const analizar = async () => {
    if (!apiKey) {
      setError('Necesitas ingresar tu API Key de Anthropic en Configuración.');
      setEstado('error');
      return;
    }
    setEstado('cargando');
    setError('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imgBase64 } },
              { type: 'text', text: PROMPT }
            ]
          }]
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `Error ${res.status}`);
      }

      const data = await res.json();
      const texto = data.content[0]?.text || '';

      // Limpiar posibles backticks
      const limpio = texto.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(limpio);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('La IA no encontró asesores en la imagen. Intenta con una foto más clara.');
      }

      setResultado(parsed);
      setEstado('preview');
    } catch (e) {
      setError(e.message || 'Error al analizar la imagen.');
      setEstado('error');
    }
  };

  const aplicarDatos = () => {
    if (!resultado) return;
    setAsesores(prev => {
      const nuevos = [...prev];
      resultado.forEach(r => {
        // Busca por nombre similar (insensible a mayúsculas)
        const idx = nuevos.findIndex(a =>
          a.nombre.toLowerCase().includes(r.nombre.split(' ')[0].toLowerCase()) ||
          r.nombre.toLowerCase().includes(a.nombre.split(' ')[0].toLowerCase())
        );
        if (idx >= 0) {
          nuevos[idx] = { ...nuevos[idx], prom: r.prom, neut: r.neut, det: r.det };
        } else {
          // Asesor nuevo — agregar
          nuevos.push({
            id: Date.now() + Math.random(),
            nombre: r.nombre,
            canal: r.canal || 'V',
            prom: r.prom, neut: r.neut, det: r.det
          });
        }
      });
      return nuevos;
    });
    setAplicado(true);
  };

  const resetear = () => {
    setEstado('idle');
    setPreview(null);
    setImgBase64(null);
    setResultado(null);
    setError('');
    setAplicado(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {/* Banner principal */}
      <div style={{ background:'linear-gradient(135deg,#003DA5,#1a5bbf)', borderRadius:16, padding:'16px 18px', marginBottom:16, display:'flex', gap:14, alignItems:'flex-start', boxShadow:'0 4px 16px rgba(0,61,165,.3)' }}>
        <div style={{ background:'rgba(255,255,255,.2)', borderRadius:10, padding:8, flexShrink:0 }}>
          <Sparkles size={22} color="#FCD34D" strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:3 }}>Carga inteligente con IA</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.85)', lineHeight:1.6 }}>
            Sube una captura del ranking de Medallia y Claude extraerá los datos de todos los asesores automáticamente en segundos.
          </div>
        </div>
      </div>

      {/* Zona de subida */}
      {estado === 'idle' && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); leerArchivo(e.dataTransfer.files[0]); }}
          style={{ border:'2px dashed var(--color-border-secondary)', borderRadius:16, padding:'32px 20px', textAlign:'center', cursor:'pointer', background:'var(--color-background-secondary)', transition:'border-color .2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor='#003DA5'}
          onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border-secondary)'}
        >
          <div style={{ background:'#E8F0FB', borderRadius:'50%', width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
            <Camera size={26} color="#003DA5" strokeWidth={1.8}/>
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--color-text-primary)', marginBottom:4 }}>Sube la captura de Medallia</div>
          <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:16, lineHeight:1.5 }}>
            Arrastra la imagen aquí o toca para seleccionar<br/>JPG, PNG o WEBP de la pantalla de Ranking
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#003DA5', color:'#fff', padding:'8px 18px', borderRadius:20, fontSize:13, fontWeight:600 }}>
            <Upload size={14} strokeWidth={2}/> Seleccionar imagen
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => leerArchivo(e.target.files[0])}/>
        </div>
      )}

      {/* Preview + análisis */}
      {(estado === 'preview' || estado === 'cargando') && preview && (
        <div>
          <div style={{ position:'relative', marginBottom:12 }}>
            <img src={preview} alt="Captura Medallia" style={{ width:'100%', borderRadius:12, border:'1px solid var(--color-border-tertiary)', maxHeight:240, objectFit:'cover', objectPosition:'top' }}/>
            {estado !== 'cargando' && (
              <button onClick={resetear} style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,.5)', border:'none', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <X size={14} color="#fff" strokeWidth={2.5}/>
              </button>
            )}
          </div>

          {/* Resultados de la IA */}
          {resultado && (
            <div style={{ background:'var(--color-background-secondary)', borderRadius:12, padding:'12px 14px', marginBottom:12, border:'1px solid var(--color-border-tertiary)' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--color-text-secondary)', marginBottom:10, textTransform:'uppercase', letterSpacing:'.05em' }}>
                Datos detectados — {resultado.length} asesores
              </div>
              {resultado.map((r, i) => {
                const nps = r.prom + r.det + r.neut > 0
                  ? Math.round(((r.prom - r.det) / (r.prom + r.det + r.neut)) * 100 * 10) / 10
                  : null;
                return (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) 1fr 1fr 1fr 1fr', gap:4, alignItems:'center', padding:'6px 0', borderBottom: i < resultado.length-1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--color-text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.nombre.split(' ')[0]} {r.nombre.split(' ').slice(-1)[0]}</div>
                    <div style={{ textAlign:'center', fontSize:11, padding:'2px 6px', borderRadius:20, background:'#ECFDF5', color:'#065F46', fontWeight:700 }}>{r.prom} P</div>
                    <div style={{ textAlign:'center', fontSize:11, padding:'2px 6px', borderRadius:20, background:'#FEF3C7', color:'#92400E', fontWeight:700 }}>{r.neut} N</div>
                    <div style={{ textAlign:'center', fontSize:11, padding:'2px 6px', borderRadius:20, background:'#FEE2E2', color:'#7F1D1D', fontWeight:700 }}>{r.det} D</div>
                    <div style={{ textAlign:'center', fontSize:13, fontWeight:800, color: nps === null ? '#888' : nps >= 94 ? '#059669' : nps >= 86 ? '#D97706' : '#DC2626' }}>{nps !== null ? nps : '—'}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Botones acción */}
          {!aplicado ? (
            <div style={{ display:'flex', gap:10 }}>
              {!resultado ? (
                <button onClick={analizar} disabled={estado==='cargando'}
                  style={{ flex:1, background: estado==='cargando'?'#7FA8D6':'#003DA5', color:'#fff', border:'none', borderRadius:12, padding:'12px 16px', fontSize:14, fontWeight:700, cursor: estado==='cargando'?'wait':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {estado === 'cargando'
                    ? <><RefreshCw size={16} strokeWidth={2} style={{ animation:'spin 1s linear infinite' }}/> Analizando imagen...</>
                    : <><Sparkles size={16} strokeWidth={2}/> Analizar con IA</>
                  }
                </button>
              ) : (
                <>
                  <button onClick={aplicarDatos}
                    style={{ flex:2, background:'#003DA5', color:'#fff', border:'none', borderRadius:12, padding:'12px 16px', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <CheckCircle2 size={16} strokeWidth={2}/> Cargar estos datos
                  </button>
                  <button onClick={resetear}
                    style={{ flex:1, background:'transparent', color:'var(--color-text-secondary)', border:'1px solid var(--color-border-secondary)', borderRadius:12, padding:'12px', fontSize:13, cursor:'pointer' }}>
                    Reintentar
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ background:'#D1FAE5', borderRadius:12, padding:'14px 16px', border:'1px solid #6EE7B7', display:'flex', alignItems:'center', gap:10 }}>
              <CheckCircle2 size={20} color="#059669" strokeWidth={2}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#065F46' }}>¡Datos cargados correctamente!</div>
                <div style={{ fontSize:12, color:'#065F46', opacity:.8 }}>{resultado.length} asesores actualizados. Revisa la pestaña Datos para confirmar.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {estado === 'error' && (
        <div style={{ background:'#FEE2E2', borderRadius:12, padding:'14px 16px', border:'1px solid #FCA5A5', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
            <AlertCircle size={18} color="#DC2626" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }}/>
            <div style={{ fontSize:13, color:'#7F1D1D', lineHeight:1.5 }}>{error}</div>
          </div>
          <button onClick={resetear} style={{ background:'#DC2626', color:'#fff', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            Intentar de nuevo
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
