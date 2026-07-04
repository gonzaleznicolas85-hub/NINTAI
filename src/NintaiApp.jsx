import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  LayoutGrid, ShoppingCart, Package, Wallet, FileText, Receipt, Settings,
  Plus, Trash2, Search, X, Copy, Check, Circle, Pencil, Upload, Save, Paperclip,
} from "lucide-react";

/* ---------------------------------------------------------------------
   NINTAI — Sistema de gestión
   Paleta: sumi (tinta) / washi (papel) / hikari (acento ámbar de resina)
--------------------------------------------------------------------- */
const T = {
  ink: "#20241f",
  inkSoft: "#4b5147",
  paper: "#f2efe6",
  paperDim: "#e7e2d3",
  card: "#fbfaf5",
  line: "#d8d2bd",
  accent: "#a8461f", // sello / hanko
  accent2: "#2f5d55", // verde bosque — ganancia
  gold: "#b6862c",
};

const money = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n || 0);

const fmtDate = (d) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ------------------------- datos semilla (de tu libro contable) ------------------------- */

const SEED_PRODUCTOS = [
  { id: "p1", categoria: "Maceta", nombre: "Daichi", variante: "Mediana (12cm)", pesoGramos: 119.1, horasImpresion: 6, costoFilamento: 2382, costoLuz: 2145.36, manoObra: 0, insumos: 0, packaging: 1203, costoFinal: 5730.36, margen: 0.6, precioVenta: 10000, ganancia: 4269.64, activo: true },
  { id: "p2", categoria: "Maceta", nombre: "Daichi", variante: "Grande (17.5cm)", pesoGramos: 221, horasImpresion: 9, costoFilamento: 4420, costoLuz: 3218.04, manoObra: 0, insumos: 0, packaging: 1203, costoFinal: 8841.04, margen: 0.6, precioVenta: 16000, ganancia: 7158.96, activo: true },
  { id: "p3", categoria: "Lámpara", nombre: "Kumo", variante: "Única", pesoGramos: 434.85, horasImpresion: 10.85, costoFilamento: 8697, costoLuz: 3879.53, manoObra: 2000, insumos: 5000, packaging: 1203, costoFinal: 20779.53, margen: 0.29, precioVenta: 30000, ganancia: 9220.47, activo: true },
  { id: "p4", categoria: "Lámpara", nombre: "Hikari", variante: "Única", pesoGramos: 199.5, horasImpresion: 7.13, costoFilamento: 3990, costoLuz: 2550.59, manoObra: 2000, insumos: 5000, packaging: 1203, costoFinal: 14743.59, margen: 0.5, precioVenta: 25000, ganancia: 10256.41, activo: true },
  { id: "p5", categoria: "Lámpara", nombre: "Haku", variante: "Única", pesoGramos: 92.6, horasImpresion: 4.05, costoFilamento: 1852, costoLuz: 1448.12, manoObra: 2000, insumos: 5000, packaging: 1203, costoFinal: 11503.12, margen: 0.42, precioVenta: 18500, ganancia: 6996.88, activo: true },
  { id: "p6", categoria: "Lámpara", nombre: "Itamae", variante: "Única", pesoGramos: 212, horasImpresion: 7.4, costoFilamento: 4240, costoLuz: 2645.94, manoObra: 2000, insumos: 5000, packaging: 1203, costoFinal: 15088.94, margen: 0.36, precioVenta: 23000, ganancia: 7911.06, activo: true },
  { id: "p7", categoria: "Lámpara", nombre: "Asami", variante: "Única", pesoGramos: 119, horasImpresion: 5.3, costoFilamento: 2380, costoLuz: 1895.07, manoObra: 2000, insumos: 5000, packaging: 1203, costoFinal: 12478.07, margen: 0.39, precioVenta: 19500, ganancia: 7021.93, activo: true },
  { id: "p8", categoria: "Set Ishi", nombre: "Jarrón", variante: "Ishi", pesoGramos: 108.4, horasImpresion: 4.18, costoFilamento: 0, costoLuz: 1495.79, manoObra: 0, insumos: 0, packaging: 1203, costoFinal: 2698.79, margen: 1, precioVenta: 8500, ganancia: 5801.21, activo: true },
  { id: "p9", categoria: "Set Ishi", nombre: "Porta Vela", variante: "Ishi", pesoGramos: 18.3, horasImpresion: 0.77, costoFilamento: 366, costoLuz: 274.13, manoObra: 0, insumos: 800, packaging: 1203, costoFinal: 2643.13, margen: 1, precioVenta: 3500, ganancia: 856.87, activo: true },
  { id: "p10", categoria: "Set Ishi", nombre: "Bandeja", variante: "Ishi", pesoGramos: 46, horasImpresion: 0.93, costoFilamento: 920, costoLuz: 333.72, manoObra: 0, insumos: 0, packaging: 1203, costoFinal: 2456.72, margen: 1, precioVenta: 4500, ganancia: 2043.28, activo: true },
  { id: "p11", categoria: "Set Ishi", nombre: "Kit (vela)", variante: "Ishi", pesoGramos: 172.7, horasImpresion: 5.88, costoFilamento: 3454, costoLuz: 2103.64, manoObra: 0, insumos: 800, packaging: 1203, costoFinal: 7560.64, margen: 1.16, precioVenta: 15000, ganancia: 7439.36, activo: true },
  { id: "p12", categoria: "Set Ishi", nombre: "Caramelera", variante: "Ishi", pesoGramos: 85, horasImpresion: 3.57, costoFilamento: 1700, costoLuz: 1275.3, manoObra: 0, insumos: 0, packaging: 1203, costoFinal: 4178.3, margen: 1, precioVenta: 7000, ganancia: 2821.7, activo: true },
  { id: "p13", categoria: "Set Ishi", nombre: "Kit (tarro)", variante: "Ishi", pesoGramos: 239.4, horasImpresion: 8.68, costoFilamento: 4788, costoLuz: 3104.81, manoObra: 0, insumos: 0, packaging: 1203, costoFinal: 9095.81, margen: 1.07, precioVenta: 18000, ganancia: 8904.19, activo: true },
];

const SEED_VENTAS = [
  { id: "v1", fecha: "2026-03-20", cliente: "Lucía Bossio", productoId: "p1", productoNombre: "Maceta Daichi Mediana", cantidad: 1, precioUnitario: 10000, total: 10000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v2", fecha: "2026-04-08", cliente: "Nicolas Villar", productoId: "p3", productoNombre: "Lámpara Kumo", cantidad: 1, precioUnitario: 25000, total: 25000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v3", fecha: "2026-04-08", cliente: "Nicolas Villar", productoId: "p4", productoNombre: "Lámpara Hikari", cantidad: 1, precioUnitario: 19500, total: 19500, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v4", fecha: "2026-04-13", cliente: "Luciano Porretta", productoId: "p13", productoNombre: "Kit (Tarro) Ishi", cantidad: 1, precioUnitario: 15000, total: 15000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v5", fecha: "2026-04-20", cliente: "Fran Murashima", productoId: "p5", productoNombre: "Lámpara Haku", cantidad: 1, precioUnitario: 18500, total: 18500, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v6", fecha: "2026-04-25", cliente: "Nico Gonzalez", productoId: "p5", productoNombre: "Lámpara Haku", cantidad: 1, precioUnitario: 18500, total: 18500, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v7", fecha: "2026-05-06", cliente: "Guille Annunzziata", productoId: "p4", productoNombre: "Lámpara Hikari", cantidad: 1, precioUnitario: 25000, total: 25000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v8", fecha: "2026-05-06", cliente: "Guille Annunzziata", productoId: "p1", productoNombre: "Maceta Daichi Mediana", cantidad: 1, precioUnitario: 10000, total: 10000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v9", fecha: "2026-05-02", cliente: "Aldi Gonzalez", productoId: "p1", productoNombre: "Maceta Daichi Mediana", cantidad: 1, precioUnitario: 10000, total: 10000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v10", fecha: "2026-05-10", cliente: "David Bastida", productoId: "p6", productoNombre: "Lámpara Itamae", cantidad: 2, precioUnitario: 19500, total: 39000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v11", fecha: "2026-05-10", cliente: "Matias Villegas", productoId: "p6", productoNombre: "Lámpara Itamae", cantidad: 2, precioUnitario: 19500, total: 39000, canal: "Instagram (Efectivo)", metodoPago: "Transferencia", estado: "Finalizado", notas: "" },
  { id: "v12", fecha: "2026-06-03", cliente: "Matias Villegas", productoId: null, productoNombre: "Urnas (a medida)", descripcionMedida: "Urnas cerámicas a medida, pack x10", cantidad: 10, precioUnitario: 23000, total: 230000, canal: "Instagram (Efectivo)", metodoPago: "Efectivo", estado: "En preparación", notas: "Pedido especial" },
];

const ESTADOS_VENTA = ["Ingresado", "En preparación", "Completado", "Entregado", "Finalizado"];
const ESTADOS_COMPLETOS = ["Entregado", "Finalizado"];

const SEED_INSUMOS = [
  { id: "i1", tipo: "Filamento", material: "PLA", color: "Negro", acabado: "Matte", marca: "Elegoo", pesoRollo: 1000, costoRollo: 25000, costoPorGramo: 25, stockRestante: 264.8 },
  { id: "i2", tipo: "Filamento", material: "PLA", color: "Blanco", acabado: "Lite", marca: "Bambu Lab", pesoRollo: 1000, costoRollo: 22000, costoPorGramo: 22, stockRestante: -39.95 },
  { id: "i3", tipo: "Filamento", material: "PLA", color: "Blanco", acabado: "Matte", marca: "Elegoo", pesoRollo: 1000, costoRollo: 25000, costoPorGramo: 25, stockRestante: -0.19 },
  { id: "i4", tipo: "Filamento", material: "PLA", color: "Beige", acabado: "Matte", marca: "Bambu Lab", pesoRollo: 1000, costoRollo: 22000, costoPorGramo: 22, stockRestante: 515.54 },
  { id: "i5", tipo: "Filamento", material: "PLA", color: "Marrón", acabado: "Matte", marca: "Elegoo", pesoRollo: 1000, costoRollo: 25000, costoPorGramo: 25, stockRestante: 0.07 },
  { id: "i6", tipo: "Filamento", material: "PLA", color: "Café con Leche", acabado: "Lite", marca: "FilAr", pesoRollo: 1000, costoRollo: 16500, costoPorGramo: 16.5, stockRestante: 1000 },
  { id: "i7", tipo: "Filamento", material: "PLA", color: "Gris", acabado: "Matte", marca: "FilAr", pesoRollo: 1000, costoRollo: 16500, costoPorGramo: 16.5, stockRestante: 693.9 },
  { id: "i8", tipo: "Filamento", material: "PLA", color: "Negro", acabado: "Matte", marca: "Bambu Lab", pesoRollo: 1000, costoRollo: 17000, costoPorGramo: 17, stockRestante: 463.7 },
];

const SEED_CANALES = [
  { id: "c1", canal: "Instagram (Efectivo)", comisionPct: 0, impuestosPct: 0, multiplicador: 1 },
  { id: "c2", canal: "Mercado Libre (Clásica)", comisionPct: 15, impuestosPct: 10, multiplicador: 1.33 },
  { id: "c3", canal: "Tiendanube", comisionPct: 2, impuestosPct: 0, multiplicador: 1.02 },
];

const SEED_COSTOS_FIJOS = {
  consumoW: 160,
  precioKwh: 203.5,
  vidaUtilHs: 4000,
  costoEquipo: 1300000,
};

/* ------------------------- API (Google Sheets vía Apps Script, u modo demo) ------------------------- */

function useApi(apiUrl) {
  const active = !!apiUrl;
  async function list(sheet) {
    if (!active) return null;
    const res = await fetch(`${apiUrl}?sheet=${sheet}`);
    return res.json();
  }
  async function create(sheet, data) {
    if (!active) return data;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sheet, action: "create", data }),
    });
    return res.json();
  }
  async function update(sheet, id, data) {
    if (!active) return data;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sheet, action: "update", id, data }),
    });
    return res.json();
  }
  async function remove(sheet, id) {
    if (!active) return true;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sheet, action: "delete", id }),
    });
    return res.json();
  }
  return { active, list, create, update, remove };
}

/* ------------------------- componentes chicos reutilizables ------------------------- */

function Hanko({ estado }) {
  const done = estado === "Finalizado" || estado === "Pagada" || estado === "Aceptado";
  const color = done ? T.accent : T.inkSoft;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        border: `1.5px solid ${color}`, color, borderRadius: 999,
        padding: "2px 10px", fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
        textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <Circle size={7} fill={done ? color : "none"} stroke={color} />
      {estado}
    </span>
  );
}

function estadoColor(estado) {
  switch (estado) {
    case "Finalizado": return T.accent;
    case "Entregado": return T.accent2;
    case "Completado": return T.gold;
    default: return T.inkSoft; // Ingresado, En preparación
  }
}

function EstadoSelect({ value, onChange }) {
  const color = estadoColor(value);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        border: `1.5px solid ${color}`, color, borderRadius: 999,
        padding: "3px 24px 3px 10px", fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
        textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace",
        background: "#fff", cursor: "pointer", appearance: "none",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><path d='M1 3l4 4 4-4' stroke='${encodeURIComponent(color)}' fill='none' stroke-width='1.5'/></svg>")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
      }}
    >
      {ESTADOS_VENTA.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 10, ...style }}>
      {children}
    </div>
  );
}

function KPI({ label, value, sub, accent }) {
  return (
    <Card style={{ padding: "18px 20px", flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: T.inkSoft, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 600, marginTop: 6, color: accent || T.ink }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: T.inkSoft, fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  border: `1px solid ${T.line}`, borderRadius: 6, padding: "7px 9px", fontSize: 13.5,
  background: "#fff", color: T.ink, outline: "none", fontFamily: "inherit",
};

const textareaStyle = { ...inputStyle, resize: "vertical", minHeight: 54, fontFamily: "inherit" };

const inputSm = { ...inputStyle, padding: "5px 7px", fontSize: 13 };

const btnPrimary = {
  background: T.ink, color: T.paper, border: "none", borderRadius: 7,
  padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
};
const btnGhost = {
  background: "transparent", color: T.ink, border: `1px solid ${T.line}`, borderRadius: 7,
  padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
};

/* ------------------------- App ------------------------- */

const NAV = [
  { id: "dashboard", label: "Reportes", icon: LayoutGrid },
  { id: "ventas", label: "Ventas", icon: ShoppingCart },
  { id: "productos", label: "Productos", icon: Package },
  { id: "finanzas", label: "Ingresos y Gastos", icon: Wallet },
  { id: "presupuestos", label: "Presupuestos", icon: FileText },
  { id: "facturacion", label: "Facturación", icon: Receipt },
  { id: "config", label: "Configuración", icon: Settings },
];

export default function NintaiApp() {
  const [tab, setTab] = useState("dashboard");
  const [apiUrl, setApiUrl] = useState("");
  const api = useApi(apiUrl);

  const [productos, setProductos] = useState(SEED_PRODUCTOS);
  const [ventas, setVentas] = useState(SEED_VENTAS);
  const [insumos, setInsumos] = useState(SEED_INSUMOS);
  const [gastos, setGastos] = useState([]);
  const [recurrentes, setRecurrentes] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [canales, setCanales] = useState(SEED_CANALES);
  const [costosFijos, setCostosFijos] = useState(SEED_COSTOS_FIJOS);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.paper, fontFamily: "'Inter', system-ui, sans-serif", color: T.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        table { border-collapse: collapse; width: 100%; font-size: 13px; }
        th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.6px; color: ${T.inkSoft}; font-weight: 700; padding: 8px 10px; border-bottom: 1.5px solid ${T.ink}; }
        td { padding: 9px 10px; border-bottom: 1px solid ${T.line}; vertical-align: middle; }
        tr:hover td { background: ${T.paperDim}40; }
        ::placeholder{ color: #9a9484; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 210, background: T.ink, color: T.paper, padding: "22px 14px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", color: T.gold, fontSize: 17 }}>忍</div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, lineHeight: 1 }}>Nintai</div>
            <div style={{ fontSize: 9.5, opacity: 0.6, letterSpacing: 1, textTransform: "uppercase" }}>Design House</div>
          </div>
        </div>
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7,
                background: active ? T.paper : "transparent", color: active ? T.ink : T.paper,
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", opacity: active ? 1 : 0.82,
              }}>
              <Icon size={16} /> {n.label}
            </button>
          );
        })}
        <div style={{ marginTop: "auto", fontSize: 10.5, opacity: 0.5, padding: "10px 8px" }}>
          {apiUrl ? "● Conectado a Google Sheets" : "○ Modo demo (datos locales)"}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: "26px 32px", overflow: "auto" }}>
        {tab === "dashboard" && <Dashboard ventas={ventas} productos={productos} gastos={gastos} />}
        {tab === "ventas" && <Ventas ventas={ventas} setVentas={setVentas} productos={productos} canales={canales} api={api} />}
        {tab === "productos" && <Productos productos={productos} setProductos={setProductos} costosFijos={costosFijos} api={api} />}
        {tab === "finanzas" && <Finanzas gastos={gastos} setGastos={setGastos} recurrentes={recurrentes} setRecurrentes={setRecurrentes} ventas={ventas} setVentas={setVentas} api={api} />}
        {tab === "presupuestos" && <Presupuestos presupuestos={presupuestos} setPresupuestos={setPresupuestos} productos={productos} api={api} />}
        {tab === "facturacion" && <Facturacion facturas={facturas} setFacturas={setFacturas} ventas={ventas} api={api} />}
        {tab === "config" && <Config apiUrl={apiUrl} setApiUrl={setApiUrl} canales={canales} setCanales={setCanales} costosFijos={costosFijos} setCostosFijos={setCostosFijos} insumos={insumos} setInsumos={setInsumos} api={api} />}
      </div>
    </div>
  );
}

/* ------------------------- Dashboard ------------------------- */

function Dashboard({ ventas, productos, gastos }) {
  const finalizadas = ventas.filter((v) => ESTADOS_COMPLETOS.includes(v.estado));
  const totalVentas = finalizadas.reduce((a, v) => a + v.total, 0);
  const totalGastos = gastos.reduce((a, g) => a + Number(g.monto || 0), 0);

  const gananciaPorVenta = (v) => {
    const p = productos.find((p) => p.id === v.productoId);
    if (!p) return 0;
    return (v.total || 0) - (p.costoFinal || 0) * (v.cantidad || 1);
  };
  const gananciaTotal = finalizadas.reduce((a, v) => a + gananciaPorVenta(v), 0) - totalGastos;
  const ticketProm = finalizadas.length ? totalVentas / finalizadas.length : 0;

  const porMes = useMemo(() => {
    const map = {};
    finalizadas.forEach((v) => {
      const key = v.fecha?.slice(0, 7) || "s/f";
      map[key] = (map[key] || 0) + v.total;
    });
    return Object.entries(map).sort().map(([mes, total]) => ({ mes, total }));
  }, [finalizadas]);

  const porProducto = useMemo(() => {
    const map = {};
    finalizadas.forEach((v) => {
      const key = v.productoNombre || "Otro";
      map[key] = (map[key] || 0) + v.total;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([nombre, total]) => ({ nombre, total }));
  }, [finalizadas]);

  const porCanal = useMemo(() => {
    const map = {};
    finalizadas.forEach((v) => { map[v.canal] = (map[v.canal] || 0) + v.total; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [finalizadas]);

  const colors = [T.accent, T.accent2, T.gold, T.inkSoft];

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, margin: "0 0 4px" }}>Reportes</h1>
      <p style={{ color: T.inkSoft, marginTop: 0, marginBottom: 20, fontSize: 13.5 }}>Métricas visuales de tu emprendimiento, al día.</p>

      <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
        <KPI label="Ventas totales" value={money(totalVentas)} sub={`${finalizadas.length} pedidos entregados/finalizados`} />
        <KPI label="Ganancia neta" value={money(gananciaTotal)} accent={T.accent2} sub="Ventas − costo − gastos" />
        <KPI label="Gastos registrados" value={money(totalGastos)} sub="Ingresos y gastos" />
        <KPI label="Ticket promedio" value={money(ticketProm)} sub="Por pedido finalizado" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Ventas por mes</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={porMes}>
              <CartesianGrid stroke={T.line} vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: T.inkSoft }} axisLine={{ stroke: T.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.inkSoft }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => money(v)} />
              <Tooltip formatter={(v) => money(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.line}` }} />
              <Line type="monotone" dataKey="total" stroke={T.accent} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Ventas por canal</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={porCanal} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {porCanal.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => money(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Productos más vendidos ($)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={porProducto}>
            <CartesianGrid stroke={T.line} vertical={false} />
            <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: T.inkSoft }} axisLine={{ stroke: T.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.inkSoft }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => money(v)} />
            <Tooltip formatter={(v) => money(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.line}` }} />
            <Bar dataKey="total" fill={T.accent2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ------------------------- Ventas ------------------------- */

const BLANK_VENTA_FORM = {
  fecha: new Date().toISOString().slice(0, 10), cliente: "", productoId: "", cantidad: 1,
  canal: "", metodoPago: "Transferencia", estado: "Ingresado",
  color: "", colorTulipa: "", colorBase: "", descripcionMedida: "", notas: "",
  comprobanteNombre: "", comprobanteUrl: "",
};

function Ventas({ ventas, setVentas, productos, canales, api }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...BLANK_VENTA_FORM, canal: canales[0]?.canal || "" });
  const [q, setQ] = useState("");

  const filtered = ventas.filter((v) => (v.cliente + v.productoNombre).toLowerCase().includes(q.toLowerCase()));
  const productoSel = productos.find((p) => p.id === form.productoId);
  const esLampara = productoSel?.categoria === "Lámpara";
  const esAMedida = form.productoId === "";

  function abrirNueva() {
    setEditingId(null);
    setForm({ ...BLANK_VENTA_FORM, canal: canales[0]?.canal || "" });
    setShowForm(true);
  }

  function abrirEdicion(v) {
    setEditingId(v.id);
    setForm({ ...BLANK_VENTA_FORM, ...v });
    setShowForm(true);
  }

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, comprobanteNombre: file.name, comprobanteUrl: reader.result }));
    reader.readAsDataURL(file);
  }

  async function guardar() {
    const producto = productos.find((p) => p.id === form.productoId);
    const precioUnitario = producto?.precioVenta || form.precioUnitario || 0;
    const cantidad = Number(form.cantidad);
    const base = {
      ...form, cantidad,
      productoNombre: producto ? `${producto.categoria} ${producto.nombre} ${producto.variante}` : (form.descripcionMedida || "Producto a medida"),
      precioUnitario, total: precioUnitario * cantidad,
    };
    if (editingId) {
      const actualizada = { ...base, id: editingId };
      setVentas((list) => list.map((x) => (x.id === editingId ? actualizada : x)));
      if (api.active) await api.update("Ventas", editingId, { ...actualizada, comprobanteUrl: undefined });
    } else {
      const nueva = { ...base, id: uid() };
      setVentas((v) => [nueva, ...v]);
      if (api.active) await api.create("Ventas", { ...nueva, comprobanteUrl: undefined });
    }
    setShowForm(false);
    setEditingId(null);
  }

  async function cambiarEstado(v, estado) {
    setVentas((list) => list.map((x) => (x.id === v.id ? { ...x, estado } : x)));
    if (api.active) await api.update("Ventas", v.id, { estado });
  }

  async function remove(id) {
    setVentas((list) => list.filter((v) => v.id !== id));
    if (api.active) await api.remove("Ventas", id);
  }

  return (
    <div>
      <Header title="Ventas" subtitle="Registrá y seguí el flujo de dinero de cada pedido.">
        <button style={btnPrimary} onClick={abrirNueva}><Plus size={15} /> Nueva venta</button>
      </Header>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0" }}>
        <Search size={15} color={T.inkSoft} />
        <input style={{ ...inputStyle, flex: 1, maxWidth: 280 }} placeholder="Buscar cliente o producto..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {showForm && (
        <Card style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{editingId ? "Editar venta" : "Nueva venta"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Field label="Fecha"><input type="date" style={inputStyle} value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} /></Field>
            <Field label="Cliente"><input style={inputStyle} value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Nombre del cliente" /></Field>
            <Field label="Producto">
              <select style={inputStyle} value={form.productoId} onChange={(e) => setForm({ ...form, productoId: e.target.value })}>
                <option value="">A medida / otro</option>
                {productos.map((p) => <option key={p.id} value={p.id}>{p.categoria} {p.nombre} {p.variante} — {money(p.precioVenta)}</option>)}
              </select>
            </Field>

            {esAMedida ? (
              <Field label="Descripción del producto a medida">
                <input style={inputStyle} value={form.descripcionMedida} onChange={(e) => setForm({ ...form, descripcionMedida: e.target.value })} placeholder="Ej: Urnas cerámicas, pack x10" />
              </Field>
            ) : esLampara ? (
              <>
                <Field label="Color de tulipa"><input style={inputStyle} value={form.colorTulipa} onChange={(e) => setForm({ ...form, colorTulipa: e.target.value })} placeholder="Ej: Blanco" /></Field>
                <Field label="Color de base"><input style={inputStyle} value={form.colorBase} onChange={(e) => setForm({ ...form, colorBase: e.target.value })} placeholder="Ej: Negro" /></Field>
              </>
            ) : (
              <Field label="Color"><input style={inputStyle} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Ej: Marrón" /></Field>
            )}

            <Field label="Cantidad"><input type="number" min={1} style={inputStyle} value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} /></Field>
            <Field label="Canal">
              <select style={inputStyle} value={form.canal} onChange={(e) => setForm({ ...form, canal: e.target.value })}>
                {canales.map((c) => <option key={c.id}>{c.canal}</option>)}
              </select>
            </Field>
            <Field label="Método de pago">
              <select style={inputStyle} value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}>
                <option>Transferencia</option><option>Efectivo</option><option>Mercado Pago</option>
              </select>
            </Field>
            <Field label="Estado">
              <select style={inputStyle} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {ESTADOS_VENTA.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Comprobante de pago">
              <label style={{ ...btnGhost, justifyContent: "center", cursor: "pointer" }}>
                <Upload size={14} /> {form.comprobanteNombre ? form.comprobanteNombre : "Subir archivo"}
                <input type="file" accept="image/*,application/pdf" onChange={onFile} style={{ display: "none" }} />
              </label>
            </Field>
          </div>

          <div style={{ marginTop: 12 }}>
            <Field label="Comentarios">
              <textarea style={textareaStyle} value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} placeholder="Notas sobre este pedido..." />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={btnPrimary} onClick={guardar}>{editingId ? "Guardar cambios" : "Guardar venta"}</button>
            <button style={btnGhost} onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</button>
          </div>
        </Card>
      )}

      <Card style={{ overflow: "auto" }}>
        <table>
          <thead><tr><th>Fecha</th><th>Cliente</th><th>Producto</th><th>Color</th><th>Cant.</th><th>Total</th><th>Canal</th><th>Comprob.</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td>{fmtDate(v.fecha)}</td>
                <td style={{ fontWeight: 600 }}>{v.cliente}</td>
                <td>{v.productoNombre}{v.notas && <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>{v.notas}</div>}</td>
                <td style={{ fontSize: 12, color: T.inkSoft }}>
                  {v.colorTulipa || v.colorBase ? `Tulipa: ${v.colorTulipa || "-"} · Base: ${v.colorBase || "-"}` : (v.color || "—")}
                </td>
                <td>{v.cantidad}</td>
                <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(v.total)}</td>
                <td style={{ fontSize: 12, color: T.inkSoft }}>{v.canal}</td>
                <td>
                  {v.comprobanteUrl
                    ? <a href={v.comprobanteUrl} target="_blank" rel="noreferrer" style={{ color: T.accent2 }}><Paperclip size={14} /></a>
                    : <span style={{ color: T.line }}><Paperclip size={14} /></span>}
                </td>
                <td><EstadoSelect value={v.estado} onChange={(estado) => cambiarEstado(v, estado)} /></td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button onClick={() => abrirEdicion(v)} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft, marginRight: 8 }}><Pencil size={14} /></button>
                  <button onClick={() => remove(v.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ------------------------- Productos ------------------------- */

function Productos({ productos, setProductos, costosFijos, api }) {
  const [showForm, setShowForm] = useState(false);
  const costoHora = costosFijos.costoEquipo / costosFijos.vidaUtilHs + (costosFijos.consumoW / 1000) * costosFijos.precioKwh;
  const [form, setForm] = useState({ categoria: "Lámpara", nombre: "", variante: "", pesoGramos: 0, costoGramoFilamento: 20, horasImpresion: 0, manoObra: 0, insumos: 0, packaging: 1203, margen: 0.5 });

  const calc = useMemo(() => {
    const costoFilamento = Number(form.pesoGramos) * Number(form.costoGramoFilamento);
    const costoLuz = Number(form.horasImpresion) * costoHora;
    const costoFinal = costoFilamento + costoLuz + Number(form.manoObra) + Number(form.insumos) + Number(form.packaging);
    const precioVenta = Math.round((costoFinal * (1 + Number(form.margen))) / 100) * 100;
    return { costoFilamento, costoLuz, costoFinal, precioVenta, ganancia: precioVenta - costoFinal };
  }, [form, costoHora]);

  async function addProducto() {
    const nuevo = { id: uid(), ...form, costoFilamento: calc.costoFilamento, costoLuz: calc.costoLuz, costoFinal: calc.costoFinal, precioVenta: calc.precioVenta, ganancia: calc.ganancia, activo: true };
    setProductos((p) => [nuevo, ...p]);
    if (api.active) await api.create("Productos", nuevo);
    setShowForm(false);
  }

  return (
    <div>
      <Header title="Productos" subtitle="Precios de venta y costos detallados de cada diseño.">
        <button style={btnPrimary} onClick={() => setShowForm(true)}><Plus size={15} /> Nuevo producto</button>
      </Header>

      {showForm && (
        <Card style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.inkSoft, marginBottom: 10 }}>Costo por hora de impresión calculado ({money(costoHora)}) según amortización de equipo + consumo eléctrico en Configuración.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <Field label="Categoría"><input style={inputStyle} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} /></Field>
            <Field label="Nombre"><input style={inputStyle} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Hikari" /></Field>
            <Field label="Variante"><input style={inputStyle} value={form.variante} onChange={(e) => setForm({ ...form, variante: e.target.value })} placeholder="Ej: Única" /></Field>
            <Field label="Peso (g)"><input type="number" style={inputStyle} value={form.pesoGramos} onChange={(e) => setForm({ ...form, pesoGramos: e.target.value })} /></Field>
            <Field label="Costo / gramo filamento"><input type="number" style={inputStyle} value={form.costoGramoFilamento} onChange={(e) => setForm({ ...form, costoGramoFilamento: e.target.value })} /></Field>
            <Field label="Horas de impresión"><input type="number" style={inputStyle} value={form.horasImpresion} onChange={(e) => setForm({ ...form, horasImpresion: e.target.value })} /></Field>
            <Field label="Mano de obra"><input type="number" style={inputStyle} value={form.manoObra} onChange={(e) => setForm({ ...form, manoObra: e.target.value })} /></Field>
            <Field label="Insumos (rosca, cable, etc)"><input type="number" style={inputStyle} value={form.insumos} onChange={(e) => setForm({ ...form, insumos: e.target.value })} /></Field>
            <Field label="Packaging"><input type="number" style={inputStyle} value={form.packaging} onChange={(e) => setForm({ ...form, packaging: e.target.value })} /></Field>
            <Field label="Margen deseado (0.5 = 50%)"><input type="number" step="0.05" style={inputStyle} value={form.margen} onChange={(e) => setForm({ ...form, margen: e.target.value })} /></Field>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 14, padding: "12px 14px", background: T.paperDim, borderRadius: 8, fontSize: 13 }}>
            <div>Costo final: <b style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(calc.costoFinal)}</b></div>
            <div>Precio sugerido: <b style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.accent }}>{money(calc.precioVenta)}</b></div>
            <div>Ganancia: <b style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.accent2 }}>{money(calc.ganancia)}</b></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={btnPrimary} onClick={addProducto}>Guardar producto</button>
            <button style={btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </Card>
      )}

      <Card style={{ overflow: "auto" }}>
        <div style={{ fontSize: 11.5, color: T.inkSoft, padding: "10px 14px 0" }}>La tabla es editable: hacé clic en cualquier celda para corregir precios o costos.</div>
        <table>
          <thead><tr><th>Categoría</th><th>Nombre</th><th>Variante</th><th>Peso (g)</th><th>Hs</th><th>Costo final</th><th>Precio</th><th>Ganancia</th><th>Margen %</th><th></th></tr></thead>
          <tbody>
            {productos.map((p) => (
              <ProductoRow key={p.id} p={p} onChange={(campo, valor) => updateProducto(p.id, campo, valor)} onDelete={() => deleteProducto(p.id)} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  async function updateProducto(id, campo, valor) {
    setProductos((list) => list.map((p) => {
      if (p.id !== id) return p;
      const num = ["pesoGramos", "horasImpresion", "costoFinal", "precioVenta", "margen"].includes(campo) ? Number(valor) : valor;
      const actualizado = { ...p, [campo]: num };
      if (campo === "costoFinal" || campo === "precioVenta") {
        actualizado.ganancia = actualizado.precioVenta - actualizado.costoFinal;
      }
      if (api.active) api.update("Productos", id, actualizado);
      return actualizado;
    }));
  }

  async function deleteProducto(id) {
    setProductos((list) => list.filter((p) => p.id !== id));
    if (api.active) await api.remove("Productos", id);
  }
}

function ProductoRow({ p, onChange, onDelete }) {
  const cell = (campo, type = "text") => (
    <input
      type={type}
      value={p[campo]}
      onChange={(e) => onChange(campo, e.target.value)}
      style={{ ...inputSm, width: type === "number" ? 78 : "100%", border: "1px solid transparent", background: "transparent" }}
      onFocus={(e) => (e.target.style.border = `1px solid ${T.line}`, e.target.style.background = "#fff")}
      onBlur={(e) => (e.target.style.border = "1px solid transparent", e.target.style.background = "transparent")}
    />
  );
  return (
    <tr>
      <td>{cell("categoria")}</td>
      <td style={{ fontWeight: 600 }}>{cell("nombre")}</td>
      <td>{cell("variante")}</td>
      <td>{cell("pesoGramos", "number")}</td>
      <td>{cell("horasImpresion", "number")}</td>
      <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{cell("costoFinal", "number")}</td>
      <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{cell("precioVenta", "number")}</td>
      <td style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.accent2 }}>{money(p.ganancia)}</td>
      <td>{cell("margen", "number")}</td>
      <td><button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft }}><Trash2 size={14} /></button></td>
    </tr>
  );
}

/* ------------------------- Finanzas (dos pestañas: Gastos / Ingresos) ------------------------- */

function editableCellProps(style = {}) {
  return {
    style: { ...inputSm, width: "100%", border: "1px solid transparent", background: "transparent", ...style },
    onFocus: (e) => { e.target.style.border = `1px solid ${T.line}`; e.target.style.background = "#fff"; },
    onBlur: (e) => { e.target.style.border = "1px solid transparent"; e.target.style.background = "transparent"; },
  };
}

function GastoRow({ g, onChange, onDelete }) {
  const cell = (campo, type = "text") => (
    <input type={type} value={g[campo]} onChange={(e) => onChange(campo, e.target.value)} {...editableCellProps({ width: type === "number" ? 100 : "100%" })} />
  );
  return (
    <tr>
      <td>{cell("fecha", "date")}</td>
      <td>{cell("categoria")}</td>
      <td>{cell("descripcion")}</td>
      <td>{cell("tipo")}</td>
      <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{cell("monto", "number")}</td>
      <td><button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft }}><Trash2 size={14} /></button></td>
    </tr>
  );
}

function RecurrenteRow({ r, onChange, onDelete }) {
  const cell = (campo, type = "text") => (
    <input type={type} value={r[campo]} onChange={(e) => onChange(campo, e.target.value)} {...editableCellProps({ width: type === "number" ? 100 : "100%" })} />
  );
  return (
    <tr>
      <td style={{ fontWeight: 600 }}>{cell("concepto")}</td>
      <td>{cell("frecuencia")}</td>
      <td>{cell("proximoPago", "date")}</td>
      <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{cell("monto", "number")}</td>
      <td><button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft }}><Trash2 size={14} /></button></td>
    </tr>
  );
}

function IngresoRow({ v, onChange }) {
  return (
    <tr>
      <td>{fmtDate(v.fecha)}</td>
      <td style={{ fontWeight: 600 }}>{v.cliente}</td>
      <td>{v.productoNombre}</td>
      <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        <input type="number" value={v.total} onChange={(e) => onChange({ total: Number(e.target.value) })} {...editableCellProps({ width: 100 })} />
      </td>
      <td>
        <select value={v.metodoPago} onChange={(e) => onChange({ metodoPago: e.target.value })} {...editableCellProps({ width: 130 })}>
          <option>Transferencia</option><option>Efectivo</option><option>Mercado Pago</option>
        </select>
      </td>
      <td style={{ fontSize: 12, color: T.inkSoft }}>{v.canal}</td>
      <td><EstadoSelect value={v.estado} onChange={(estado) => onChange({ estado })} /></td>
    </tr>
  );
}

function Finanzas({ gastos, setGastos, recurrentes, setRecurrentes, ventas, setVentas, api }) {
  const [subtab, setSubtab] = useState("gastos");
  const [gForm, setGForm] = useState({ fecha: new Date().toISOString().slice(0, 10), categoria: "Insumos", descripcion: "", monto: "", tipo: "Variable" });
  const [rForm, setRForm] = useState({ concepto: "", monto: "", frecuencia: "Mensual", proximoPago: new Date().toISOString().slice(0, 10), categoria: "Servicio" });

  const totalIngresos = ventas.reduce((a, v) => a + Number(v.total || 0), 0);
  const totalGastos = gastos.reduce((a, g) => a + Number(g.monto || 0), 0);
  const totalRecurrentes = recurrentes.reduce((a, r) => a + Number(r.monto || 0), 0);

  async function addGasto() {
    const nuevo = { id: uid(), ...gForm, monto: Number(gForm.monto) };
    setGastos((g) => [nuevo, ...g]);
    if (api.active) await api.create("Gastos", nuevo);
    setGForm({ ...gForm, descripcion: "", monto: "" });
  }
  async function addRecurrente() {
    const nuevo = { id: uid(), ...rForm, monto: Number(rForm.monto), activo: true };
    setRecurrentes((r) => [nuevo, ...r]);
    if (api.active) await api.create("GastosRecurrentes", nuevo);
    setRForm({ ...rForm, concepto: "", monto: "" });
  }
  async function delGasto(id) { setGastos((g) => g.filter((x) => x.id !== id)); if (api.active) await api.remove("Gastos", id); }
  async function delRecurrente(id) { setRecurrentes((r) => r.filter((x) => x.id !== id)); if (api.active) await api.remove("GastosRecurrentes", id); }

  function updateGasto(id, campo, valor) {
    setGastos((list) => list.map((g) => {
      if (g.id !== id) return g;
      const actualizado = { ...g, [campo]: campo === "monto" ? Number(valor) : valor };
      if (api.active) api.update("Gastos", id, actualizado);
      return actualizado;
    }));
  }
  function updateRecurrente(id, campo, valor) {
    setRecurrentes((list) => list.map((r) => {
      if (r.id !== id) return r;
      const actualizado = { ...r, [campo]: campo === "monto" ? Number(valor) : valor };
      if (api.active) api.update("GastosRecurrentes", id, actualizado);
      return actualizado;
    }));
  }
  function updateIngreso(id, campos) {
    setVentas((list) => list.map((v) => {
      if (v.id !== id) return v;
      const actualizado = { ...v, ...campos };
      if (api.active) api.update("Ventas", id, actualizado);
      return actualizado;
    }));
  }

  return (
    <div>
      <Header title="Ingresos y Gastos" subtitle="Flujo de caja sin complicaciones." />

      <div style={{ display: "flex", gap: 14, margin: "18px 0" }}>
        <KPI label="Ingresos por ventas" value={money(totalIngresos)} accent={T.accent2} />
        <KPI label="Gastos registrados" value={money(totalGastos + totalRecurrentes)} accent={T.accent} />
        <KPI label="Saldo" value={money(totalIngresos - totalGastos - totalRecurrentes)} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button style={subtab === "gastos" ? btnPrimary : btnGhost} onClick={() => setSubtab("gastos")}>Gastos</button>
        <button style={subtab === "ingresos" ? btnPrimary : btnGhost} onClick={() => setSubtab("ingresos")}>Ingresos</button>
      </div>

      {subtab === "gastos" && (
        <>
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
              <Field label="Fecha"><input type="date" style={inputStyle} value={gForm.fecha} onChange={(e) => setGForm({ ...gForm, fecha: e.target.value })} /></Field>
              <Field label="Categoría">
                <select style={inputStyle} value={gForm.categoria} onChange={(e) => setGForm({ ...gForm, categoria: e.target.value })}>
                  <option>Insumos</option><option>Filamento</option><option>Herramientas</option><option>Envíos</option><option>Marketing</option><option>Otro</option>
                </select>
              </Field>
              <Field label="Descripción"><input style={inputStyle} value={gForm.descripcion} onChange={(e) => setGForm({ ...gForm, descripcion: e.target.value })} placeholder="Ej: rollo PLA negro" /></Field>
              <Field label="Monto"><input type="number" style={inputStyle} value={gForm.monto} onChange={(e) => setGForm({ ...gForm, monto: e.target.value })} /></Field>
              <Field label="Tipo">
                <select style={inputStyle} value={gForm.tipo} onChange={(e) => setGForm({ ...gForm, tipo: e.target.value })}><option>Variable</option><option>Fijo</option></select>
              </Field>
              <button style={btnPrimary} onClick={addGasto}><Plus size={15} /> Agregar</button>
            </div>
          </Card>
          <Card style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 11.5, color: T.inkSoft, padding: "10px 14px 0" }}>Hacé clic en cualquier celda para editarla.</div>
            <table>
              <thead><tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Tipo</th><th>Monto</th><th></th></tr></thead>
              <tbody>
                {gastos.length === 0 && <tr><td colSpan={6} style={{ color: T.inkSoft, textAlign: "center", padding: 24 }}>Todavía no cargaste gastos.</td></tr>}
                {gastos.map((g) => (
                  <GastoRow key={g.id} g={g} onChange={(campo, valor) => updateGasto(g.id, campo, valor)} onDelete={() => delGasto(g.id)} />
                ))}
              </tbody>
            </table>
          </Card>

          <div style={{ marginTop: 26, marginBottom: 10, fontWeight: 700, fontFamily: "'Fraunces', serif", fontSize: 16 }}>Gastos y pagos recurrentes</div>
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
              <Field label="Concepto"><input style={inputStyle} value={rForm.concepto} onChange={(e) => setRForm({ ...rForm, concepto: e.target.value })} placeholder="Ej: Alquiler taller" /></Field>
              <Field label="Monto"><input type="number" style={inputStyle} value={rForm.monto} onChange={(e) => setRForm({ ...rForm, monto: e.target.value })} /></Field>
              <Field label="Frecuencia">
                <select style={inputStyle} value={rForm.frecuencia} onChange={(e) => setRForm({ ...rForm, frecuencia: e.target.value })}><option>Mensual</option><option>Anual</option><option>Semanal</option></select>
              </Field>
              <Field label="Próximo pago"><input type="date" style={inputStyle} value={rForm.proximoPago} onChange={(e) => setRForm({ ...rForm, proximoPago: e.target.value })} /></Field>
              <button style={btnPrimary} onClick={addRecurrente}><Plus size={15} /> Agregar</button>
            </div>
          </Card>
          <Card style={{ overflow: "hidden" }}>
            <table>
              <thead><tr><th>Concepto</th><th>Frecuencia</th><th>Próximo pago</th><th>Monto</th><th></th></tr></thead>
              <tbody>
                {recurrentes.length === 0 && <tr><td colSpan={5} style={{ color: T.inkSoft, textAlign: "center", padding: 24 }}>Sin pagos recurrentes cargados (alquiler, suscripciones, etc).</td></tr>}
                {recurrentes.map((r) => (
                  <RecurrenteRow key={r.id} r={r} onChange={(campo, valor) => updateRecurrente(r.id, campo, valor)} onDelete={() => delRecurrente(r.id)} />
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {subtab === "ingresos" && (
        <Card style={{ overflow: "auto" }}>
          <div style={{ fontSize: 11.5, color: T.inkSoft, padding: "10px 14px 0" }}>Todos los ingresos vienen de tus ventas cargadas. Podés corregir el monto, el método de pago o el estado acá mismo.</div>
          <table>
            <thead><tr><th>Fecha</th><th>Cliente</th><th>Producto</th><th>Monto</th><th>Método de pago</th><th>Canal</th><th>Estado</th></tr></thead>
            <tbody>
              {ventas.length === 0 && <tr><td colSpan={7} style={{ color: T.inkSoft, textAlign: "center", padding: 24 }}>Todavía no hay ventas cargadas.</td></tr>}
              {ventas.map((v) => (
                <IngresoRow key={v.id} v={v} onChange={(campos) => updateIngreso(v.id, campos)} />
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

/* ------------------------- Presupuestos ------------------------- */

function Presupuestos({ presupuestos, setPresupuestos, productos, api }) {
  const [cliente, setCliente] = useState("");
  const [items, setItems] = useState([]);
  const [sel, setSel] = useState(productos[0]?.id || "");
  const [cant, setCant] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  function addItem() {
    const p = productos.find((p) => p.id === sel);
    if (!p) return;
    setItems((it) => [...it, { productoId: p.id, nombre: `${p.categoria} ${p.nombre} ${p.variante}`, cantidad: Number(cant), precioUnitario: p.precioVenta }]);
  }
  function removeItem(i) { setItems((it) => it.filter((_, idx) => idx !== i)); }
  const total = items.reduce((a, it) => a + it.cantidad * it.precioUnitario, 0);

  async function guardar() {
    if (!cliente || items.length === 0) return;
    const nuevo = { id: uid(), fecha: new Date().toISOString().slice(0, 10), cliente, items: JSON.stringify(items), total, validoHasta: "", estado: "Enviado", notas: "" };
    setPresupuestos((p) => [nuevo, ...p]);
    if (api.active) await api.create("Presupuestos", nuevo);
    setCliente(""); setItems([]);
  }

  function textoWhatsapp(p, itemsArr) {
    const lines = itemsArr.map((it) => `• ${it.cantidad}x ${it.nombre} — ${money(it.precioUnitario)}`);
    return `Presupuesto Nintai — ${p.cliente}\n${lines.join("\n")}\n\nTotal: ${money(p.total)}\n¡Gracias por elegirnos! 忍`;
  }

  function copiar(p) {
    const arr = JSON.parse(p.items);
    navigator.clipboard?.writeText(textoWhatsapp(p, arr));
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <Header title="Presupuestos" subtitle="Armado y envío en segundos." />

      <Card style={{ padding: 18, margin: "18px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>
          <Field label="Cliente"><input style={inputStyle} value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nombre del cliente" /></Field>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "end", marginBottom: 14 }}>
          <Field label="Producto">
            <select style={{ ...inputStyle, minWidth: 260 }} value={sel} onChange={(e) => setSel(e.target.value)}>
              {productos.map((p) => <option key={p.id} value={p.id}>{p.categoria} {p.nombre} {p.variante} — {money(p.precioVenta)}</option>)}
            </select>
          </Field>
          <Field label="Cant."><input type="number" min={1} style={{ ...inputStyle, width: 70 }} value={cant} onChange={(e) => setCant(e.target.value)} /></Field>
          <button style={btnGhost} onClick={addItem}><Plus size={15} /> Agregar ítem</button>
        </div>

        {items.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.line}`, fontSize: 13.5 }}>
                <span>{it.cantidad}× {it.nombre}</span>
                <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <b style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(it.cantidad * it.precioUnitario)}</b>
                  <X size={13} style={{ cursor: "pointer" }} onClick={() => removeItem(i)} />
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, fontWeight: 700 }}>
              <span>Total</span><span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(total)}</span>
            </div>
          </div>
        )}
        <button style={btnPrimary} onClick={guardar} disabled={!cliente || !items.length}>Generar presupuesto</button>
      </Card>

      <Card style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {presupuestos.length === 0 && <tr><td colSpan={5} style={{ color: T.inkSoft, textAlign: "center", padding: 24 }}>Todavía no armaste presupuestos.</td></tr>}
            {presupuestos.map((p) => (
              <tr key={p.id}>
                <td>{fmtDate(p.fecha)}</td><td style={{ fontWeight: 600 }}>{p.cliente}</td>
                <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(p.total)}</td>
                <td><Hanko estado={p.estado} /></td>
                <td>
                  <button style={btnGhost} onClick={() => copiar(p)}>
                    {copiedId === p.id ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar texto</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ------------------------- Facturación ------------------------- */

function Facturacion({ facturas, setFacturas, ventas, api }) {
  const [ventaId, setVentaId] = useState("");
  const [cuit, setCuit] = useState("");
  const [tipo, setTipo] = useState("Factura C");

  async function generar() {
    const v = ventas.find((x) => x.id === ventaId);
    if (!v) return;
    const nueva = {
      id: uid(), fecha: new Date().toISOString().slice(0, 10), cliente: v.cliente, cuit, tipo, ventaId: v.id,
      items: JSON.stringify([{ nombre: v.productoNombre, cantidad: v.cantidad, precioUnitario: v.precioUnitario }]),
      subtotal: v.total, impuestos: 0, total: v.total, estado: "Emitida",
    };
    setFacturas((f) => [nueva, ...f]);
    if (api.active) await api.create("Facturas", nueva);
    setVentaId(""); setCuit("");
  }

  return (
    <div>
      <Header title="Facturación" subtitle="Generá el comprobante a partir de una venta ya cargada." />

      <Card style={{ padding: 18, margin: "18px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="Venta">
            <select style={inputStyle} value={ventaId} onChange={(e) => setVentaId(e.target.value)}>
              <option value="">Elegí una venta...</option>
              {ventas.map((v) => <option key={v.id} value={v.id}>{fmtDate(v.fecha)} — {v.cliente} — {v.productoNombre} — {money(v.total)}</option>)}
            </select>
          </Field>
          <Field label="CUIT / DNI cliente"><input style={inputStyle} value={cuit} onChange={(e) => setCuit(e.target.value)} placeholder="Opcional" /></Field>
          <Field label="Tipo">
            <select style={inputStyle} value={tipo} onChange={(e) => setTipo(e.target.value)}><option>Factura C</option><option>Recibo</option><option>Factura A</option></select>
          </Field>
          <button style={btnPrimary} onClick={generar} disabled={!ventaId}><Plus size={15} /> Emitir</button>
        </div>
        <p style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 10, marginBottom: 0 }}>
          Para facturación electrónica válida ante AFIP necesitás emitirla desde el portal de ARCA/AFIP o un facturador homologado; esta app genera el comprobante interno y lo deja listo para copiar a tu sistema de facturación.
        </p>
      </Card>

      <Card style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Fecha</th><th>Cliente</th><th>Tipo</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>
            {facturas.length === 0 && <tr><td colSpan={5} style={{ color: T.inkSoft, textAlign: "center", padding: 24 }}>Sin comprobantes emitidos todavía.</td></tr>}
            {facturas.map((f) => (
              <tr key={f.id}>
                <td>{fmtDate(f.fecha)}</td><td style={{ fontWeight: 600 }}>{f.cliente}</td><td>{f.tipo}</td>
                <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(f.total)}</td>
                <td><Hanko estado={f.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ------------------------- Configuración ------------------------- */

const COSTO_FIJO_LABELS = {
  consumoW: { label: "Consumo promedio (W)", id: "cf-consumoW" },
  precioKwh: { label: "Precio kWh (factura)", id: "cf-precioKwh" },
  vidaUtilHs: { label: "Vida útil impresora (hs)", id: "cf-vidaUtilHs" },
  costoEquipo: { label: "Costo del equipo ($)", id: "cf-costoEquipo" },
};

function CanalRow({ c, onChange, onDelete }) {
  const cell = (campo, type = "text") => (
    <input type={type} value={c[campo]} onChange={(e) => onChange(campo, e.target.value)} {...editableCellProps({ width: type === "number" ? 90 : "100%" })} />
  );
  return (
    <tr>
      <td style={{ fontWeight: 600 }}>{cell("canal")}</td>
      <td>{cell("comisionPct", "number")}%</td>
      <td>{cell("impuestosPct", "number")}%</td>
      <td>x{cell("multiplicador", "number")}</td>
      <td><button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft }}><Trash2 size={14} /></button></td>
    </tr>
  );
}

function InsumoRow({ i, onChange, onDelete }) {
  const cell = (campo, type = "text") => (
    <input type={type} value={i[campo]} onChange={(e) => onChange(campo, e.target.value)} {...editableCellProps({ width: type === "number" ? 90 : "100%" })} />
  );
  return (
    <tr>
      <td>{cell("color")}</td>
      <td>{cell("acabado")}</td>
      <td>{cell("marca")}</td>
      <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{cell("costoPorGramo", "number")}</td>
      <td style={{ color: Number(i.stockRestante) < 0 ? T.accent : T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>{cell("stockRestante", "number")} g</td>
      <td><button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft }}><Trash2 size={14} /></button></td>
    </tr>
  );
}

function Config({ apiUrl, setApiUrl, canales, setCanales, costosFijos, setCostosFijos, insumos, setInsumos, api }) {
  const [tmp, setTmp] = useState(apiUrl);

  function updateCosto(campo, valor) {
    const num = Number(valor);
    setCostosFijos((c) => ({ ...c, [campo]: num }));
    if (api.active) {
      const meta = COSTO_FIJO_LABELS[campo];
      api.update("CostosFijos", meta.id, { concepto: meta.label, valor: num });
    }
  }

  function updateCanal(id, campo, valor) {
    setCanales((list) => list.map((c) => {
      if (c.id !== id) return c;
      const actualizado = { ...c, [campo]: ["comisionPct", "impuestosPct", "multiplicador"].includes(campo) ? Number(valor) : valor };
      if (api.active) api.update("CanalesPrecios", id, actualizado);
      return actualizado;
    }));
  }
  function addCanal() {
    const nuevo = { id: uid(), canal: "Nuevo canal", comisionPct: 0, impuestosPct: 0, multiplicador: 1 };
    setCanales((list) => [...list, nuevo]);
    if (api.active) api.create("CanalesPrecios", nuevo);
  }
  function deleteCanal(id) {
    setCanales((list) => list.filter((c) => c.id !== id));
    if (api.active) api.remove("CanalesPrecios", id);
  }

  function updateInsumo(id, campo, valor) {
    setInsumos((list) => list.map((i) => {
      if (i.id !== id) return i;
      const actualizado = { ...i, [campo]: ["costoPorGramo", "stockRestante"].includes(campo) ? Number(valor) : valor };
      if (api.active) api.update("Insumos", id, actualizado);
      return actualizado;
    }));
  }
  function addInsumo() {
    const nuevo = { id: uid(), tipo: "Filamento", material: "PLA", color: "Nuevo color", acabado: "Matte", marca: "", pesoRollo: 1000, costoRollo: 0, costoPorGramo: 0, stockRestante: 1000 };
    setInsumos((list) => [...list, nuevo]);
    if (api.active) api.create("Insumos", nuevo);
  }
  function deleteInsumo(id) {
    setInsumos((list) => list.filter((i) => i.id !== id));
    if (api.active) api.remove("Insumos", id);
  }

  return (
    <div>
      <Header title="Configuración" subtitle="Conectá tu Google Sheet como backend y editá tus parámetros." />

      <Card style={{ padding: 18, margin: "18px 0" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Backend en Google Sheets</div>
        <p style={{ fontSize: 13, color: T.inkSoft, marginTop: 0 }}>
          Pegá acá la URL de tu Apps Script Web App (ver instrucciones en el código Code.gs que te entregué). Mientras esté vacío, la app funciona en modo demo con datos locales.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder="https://script.google.com/macros/s/AKfycb.../exec" value={tmp} onChange={(e) => setTmp(e.target.value)} />
          <button style={btnPrimary} onClick={() => setApiUrl(tmp)}>Conectar</button>
          {apiUrl && <button style={btnGhost} onClick={() => { setApiUrl(""); setTmp(""); }}>Desconectar</button>}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>Canales y precios</div>
            <button style={btnGhost} onClick={addCanal}><Plus size={14} /> Canal</button>
          </div>
          <table>
            <thead><tr><th>Canal</th><th>Comisión</th><th>Impuestos</th><th>Multiplicador</th><th></th></tr></thead>
            <tbody>
              {canales.map((c) => (
                <CanalRow key={c.id} c={c} onChange={(campo, valor) => updateCanal(c.id, campo, valor)} onDelete={() => deleteCanal(c.id)} />
              ))}
            </tbody>
          </table>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Costos fijos</div>
          <table>
            <tbody>
              {Object.entries(COSTO_FIJO_LABELS).map(([campo, meta]) => (
                <tr key={campo}>
                  <td>{meta.label}</td>
                  <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    <input type="number" value={costosFijos[campo]} onChange={(e) => updateCosto(campo, e.target.value)} {...editableCellProps({ width: 120 })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card style={{ padding: 18, marginTop: 16, overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>Insumos y stock de filamento</div>
          <button style={btnGhost} onClick={addInsumo}><Plus size={14} /> Insumo</button>
        </div>
        <table>
          <thead><tr><th>Color</th><th>Acabado</th><th>Marca</th><th>$/gramo</th><th>Stock restante</th><th></th></tr></thead>
          <tbody>
            {insumos.map((i) => (
              <InsumoRow key={i.id} i={i} onChange={(campo, valor) => updateInsumo(i.id, campo, valor)} onDelete={() => deleteInsumo(i.id)} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Header({ title, subtitle, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, margin: "0 0 4px" }}>{title}</h1>
        {subtitle && <p style={{ color: T.inkSoft, marginTop: 0, fontSize: 13.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
