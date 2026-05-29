# NPS Manager — BCP Suc. Pichanaki

App de gestión de NPS para equipos de agencia BCP.

## Qué hace
- Dashboard con NPS Agencia, Ventanilla y Plataforma en tiempo real
- Ingreso manual de encuestas por asesor (promotores / detractores / neutros)
- Motor de prioridades: quién tiene más impacto en el NPS de agencia hoy
- Simulador: ¿qué pasa si ingresan X encuestas más?
- Ritmo diario: proyección al cierre del mes

## Fórmula confirmada
```
NPS Agencia = (NPS Ventanilla + NPS Plataforma) / 2
```
Peso 50% / 50%. Siempre trabaja el canal más bajo.

## Instalar y correr localmente

```bash
npm install
npm start
```

## Deploy en Vercel

### Opción 1 — Desde GitHub (recomendado)
1. Sube esta carpeta a un repositorio GitHub
2. Entra a [vercel.com](https://vercel.com) → New Project
3. Importa el repositorio
4. Framework: **Create React App**
5. Build command: `npm run build`
6. Output directory: `build`
7. → Deploy

### Opción 2 — Vercel CLI
```bash
npm install -g vercel
vercel
```

## Personalizar
- Metas: editar `META_V`, `META_P`, `META_AG` en `src/utils.js`
- Asesores: editar `ASESORES_INIT` en `src/utils.js`
- Agencia: editar `AGENCIA` en `src/utils.js`
