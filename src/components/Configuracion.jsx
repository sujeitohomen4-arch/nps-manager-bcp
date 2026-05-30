import { useState } from 'react';
import { Settings, Key, Eye, EyeOff, Save, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Configuracion({ apiKey, setApiKey, agencia, setAgencia }) {
  const [keyInput, setKeyInput]   = useState(apiKey || '');
  const [showKey, setShowKey]     = useState(false);
  const [saved, setSaved]         = useState(false);
  const [agInput, setAgInput]     = useState(agencia || 'Suc. Pichanaki');

  const guardar = () => {
    setApiKey(keyInput.trim());
    setAgencia(agInput.trim());
    localStorage.setItem('nps_api_key', keyInput.trim());
    localStorage.setItem('nps_agencia', agInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,#003DA5,#1a5bbf)', borderRadius:16, padding:'16px 18px', marginBottom:20, display:'flex', gap:12, alignItems:'center', boxShadow:'0 4px 16px rgba(0,61,165,.3)' }}>
        <div style={{ background:'rgba(255,255,255,.2)', borderRadius:10, padding:8 }}>
          <Settings size={20} color="#fff" strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:2 }}>Configuración</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.8)' }}>API Key y datos de tu agencia</div>
        </div>
      </div>

      {/* API Key */}
      <div style={{ background:'var(--color-background-primary)', border:'1px solid var(--color-border-tertiary)', borderRadius:16, padding:'16px', marginBottom:14, boxShadow:'0 1px 4px rgba(0,61,165,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <Key size={16} color="#003DA5" strokeWidth={2}/>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--color-text-primary)' }}>API Key de Anthropic</div>
        </div>
        <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:12, lineHeight:1.6 }}>
          Necesaria para la carga inteligente desde foto. Se guarda solo en tu dispositivo, nunca sale de aquí.
        </div>

        <div style={{ position:'relative', marginBottom:10 }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="sk-ant-api03-..."
            style={{ width:'100%', padding:'10px 44px 10px 12px', fontSize:13, border:'1.5px solid var(--color-border-secondary)', borderRadius:10, background:'var(--color-background-secondary)', color:'var(--color-text-primary)', fontFamily:'DM Mono,monospace', outline:'none' }}
          />
          <button onClick={() => setShowKey(!showKey)}
            style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--color-text-secondary)', padding:4 }}>
            {showKey ? <EyeOff size={16} strokeWidth={2}/> : <Eye size={16} strokeWidth={2}/>}
          </button>
        </div>

        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color:'#003DA5', textDecoration:'none', marginBottom:4 }}>
          <ExternalLink size={12} strokeWidth={2}/> Obtener API Key en console.anthropic.com
        </a>

        <div style={{ fontSize:11, color:'var(--color-text-secondary)', marginTop:6, padding:'8px 10px', background:'var(--color-background-secondary)', borderRadius:8, lineHeight:1.5 }}>
          Costo estimado: <strong>~$0.002 por imagen</strong> analizada. Muy bajo.
        </div>
      </div>

      {/* Agencia */}
      <div style={{ background:'var(--color-background-primary)', border:'1px solid var(--color-border-tertiary)', borderRadius:16, padding:'16px', marginBottom:16, boxShadow:'0 1px 4px rgba(0,61,165,.07)' }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--color-text-primary)', marginBottom:10 }}>Nombre de agencia</div>
        <input
          type="text"
          value={agInput}
          onChange={e => setAgInput(e.target.value)}
          placeholder="Suc. Pichanaki"
          style={{ width:'100%', padding:'10px 12px', fontSize:14, border:'1.5px solid var(--color-border-secondary)', borderRadius:10, background:'var(--color-background-secondary)', color:'var(--color-text-primary)', outline:'none' }}
        />
      </div>

      {/* Guardar */}
      <button onClick={guardar}
        style={{ width:'100%', background: saved ? '#059669' : '#003DA5', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background .3s' }}>
        {saved
          ? <><CheckCircle2 size={18} strokeWidth={2}/> ¡Guardado!</>
          : <><Save size={18} strokeWidth={2}/> Guardar configuración</>
        }
      </button>
    </div>
  );
}
