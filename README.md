# Nintai — Sistema de gestión

App web para el taller de decoración impresa en 3D **Nintai**: facturación,
ventas, productos, ingresos y gastos, gastos recurrentes, reportes y
presupuestos. Backend en Google Sheets (opcional; funciona en modo demo sin él).

## Probar en tu computadora

```bash
npm install
npm run dev
```

Abrí la URL que te muestra la terminal (por defecto `http://localhost:5173`).

## Publicar gratis (elegí uno)

### Opción A — Vercel
1. Subí esta carpeta a un repositorio de GitHub (o usá `vercel` CLI directo desde acá).
2. Entrá a [vercel.com](https://vercel.com) → **Add New Project** → importá el repo.
3. Vercel detecta Vite automáticamente (Build Command: `npm run build`, Output: `dist`). Deploy.
4. Te da una URL tipo `nintai.vercel.app`.

CLI directa, sin GitHub:
```bash
npm install -g vercel
vercel --prod
```

### Opción B — Netlify
1. Subí la carpeta a GitHub, o arrastrá la carpeta `dist` (después de correr `npm run build`)
   directamente a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Si conectás el repo: Build command `npm run build`, Publish directory `dist`.

## Conectar el backend real (Google Sheets)

1. Adentro de la carpeta `backend-google-sheets/` está `Code.gs`.
2. Creá una Google Sheet nueva → Extensiones → Apps Script → pegá todo `Code.gs`.
3. Ejecutá la función `setup` una vez (crea todas las hojas y encabezados).
4. Implementar → Nueva implementación → Aplicación web → Ejecutar como "Yo",
   acceso "Cualquier usuario". Copiá la URL `/exec`.
5. En la app publicada, andá a **Configuración** y pegá esa URL en "Backend en
   Google Sheets" → Conectar.

Desde ese momento cada venta, gasto, producto o presupuesto que cargues en la
web se guarda en tu planilla de Google Sheets.

## Estructura del proyecto

```
src/
  NintaiApp.jsx     ← toda la app (dashboard, ventas, productos, finanzas...)
  main.jsx          ← punto de entrada de React
  index.css         ← reset mínimo
backend-google-sheets/
  Code.gs           ← backend Apps Script (API sobre Google Sheets)
```

## Datos precargados

La app viene con los datos reales de tu libro contable actual (productos,
ventas históricas, insumos/filamentos, canales de venta y costos fijos) para
que la veas funcionando desde el primer minuto. Podés editar o borrar todo
libremente una vez conectada a tu Google Sheet.
