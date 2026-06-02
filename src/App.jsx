import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase.js';

/* ═══════════════════════════════════════════════════════════
   AberBorges CRM — Sistema de gestión de obras
   Aberturas Borges · con Planilla de Medición integrada
═══════════════════════════════════════════════════════════ */

const LOGO_B64 = "data:image/jpeg;base64,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";

const BRAND  = "AberBorges";
const ACCENT = "#00b4d8";
const BG     = "#090e18";
const CARD   = "#0d1626";
const BORDER = "#162035";

const ROLES = {
  vendedor:       { key:"vendedor",       label:"Medidor",        icon:"📐",  pin:"",     color:ACCENT,    sinPin:true },
  fabrica:        { key:"fabrica",        label:"Fabricación",    icon:"🏗️", pin:"",     color:"#fb923c", sinPin:true },
  presupuestador: { key:"presupuestador", label:"Presupuesto",    icon:"💰",  pin:"1212", color:"#34d399" },
  admin:          { key:"admin",          label:"Administrador",  icon:"⚙️",  pin:"1212", color:"#f59e0b" },
};

const STATUS_META = {
  nuevo:         { label:"Pendiente medición",        color:"#f59e0b", icon:"📞" },
  medido:        { label:"Para presupuestar",          color:ACCENT,   icon:"📏" },
  presupuestado: { label:"En espera de respuesta",     color:"#a78bfa", icon:"⏳" },
  aprobado:      { label:"Aprobado para fabricación",  color:"#34d399", icon:"✅" },
  cancelado:     { label:"Presupuesto cancelado",      color:"#ef4444", icon:"❌" },
  en_produccion: { label:"En producción",              color:"#fb923c", icon:"🔧" },
  entregado:     { label:"Entregado",                  color:"#64748b", icon:"📦" },
};

// ─── AGENDA ─────────────────────────────────────────────
const fmt      = d => { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };
const fmtMoney = n => n ? `$${Number(n).toLocaleString("es-AR")}` : "—";
const today    = () => new Date().toISOString().split("T")[0];
const calcSaldo = c => {
  if (!c.monto) return null;
  return (parseFloat(c.monto)||0) - (c.pagos||[]).reduce((s,p)=>s+(parseFloat(p.monto)||0),0);
};

// ─────────── TIPOS DE ABERTURAS ───────────
// ── TIPOS DE ABERTURAS ────────────────────────────────────
const TIPOS = [
  {
    id:"corrediza", label:"Corrediza", icon:"🪟", categoria:"ventana",
    configs:[
      {id:"c2h2r",label:"2 hojas / 2 rieles",desc:"La más común. Ambas hojas corren sobre 2 rieles."},
      {id:"c3h3r",label:"3 hojas / 3 rieles",desc:"Cada hoja tiene su riel propio."},
      {id:"c3h2r",label:"3 hojas / 2 rieles",desc:"Hoja fija central, dos móviles en 2 rieles."},
      {id:"c4h2r",label:"4 hojas / 2 rieles",desc:"Dos hojas por riel, se solapan."},
      {id:"c4h4r",label:"4 hojas / 4 rieles",desc:"Máxima apertura, cada hoja en su riel."},
    ],
  },
  {
    id:"proyectante", label:"Proyectante / Banderola", icon:"🔲", categoria:"ventana",
    configs:[
      {id:"p1h",label:"1 hoja",   desc:"Abre hacia afuera por la parte superior."},
      {id:"p2h",label:"2 hojas",  desc:"Dos paños que proyectan."},
    ],
  },
  {
    id:"batiente", label:"Batiente / Abrir", icon:"🪟", categoria:"ventana",
    configs:[
      {id:"b1hd",label:"1 hoja derecha",   desc:"Abre con bisagras a la derecha."},
      {id:"b1hi",label:"1 hoja izquierda", desc:"Abre con bisagras a la izquierda."},
      {id:"b2h", label:"2 hojas francesa", desc:"Dos hojas que abren al centro."},
    ],
  },
  {
    id:"puerta_corrediza", label:"Puerta Corrediza", icon:"🚪", categoria:"puerta",
    configs:[
      {id:"pc1h",   label:"1 hoja",           desc:"Una hoja corre sobre riel."},
      {id:"pc2h",   label:"2 hojas",          desc:"Dos hojas que se deslizan."},
      {id:"pc2h2r", label:"2 hojas / 2 rieles",desc:"Cada hoja en su riel."},
    ],
  },
  {
    id:"puerta_batiente", label:"Puerta Batiente", icon:"🚪", categoria:"puerta",
    configs:[
      {id:"pb1hd_int",label:"1 hoja der. · Interior", desc:"Abre hacia adentro, bisagras derecha. Vista desde exterior."},
      {id:"pb1hi_int",label:"1 hoja izq. · Interior", desc:"Abre hacia adentro, bisagras izquierda. Vista desde exterior."},
      {id:"pb1hd_ext",label:"1 hoja der. · Exterior", desc:"Abre hacia afuera, bisagras derecha. Vista desde exterior."},
      {id:"pb1hi_ext",label:"1 hoja izq. · Exterior", desc:"Abre hacia afuera, bisagras izquierda. Vista desde exterior."},
      {id:"pb2h_int",  label:"2 hojas · Interior",    desc:"Doble hoja abre hacia adentro."},
      {id:"pb2h_ext",  label:"2 hojas · Exterior",    desc:"Doble hoja abre hacia afuera."},
    ],
  },
  {
    id:"puerta_mv", label:"Puerta Medio Vidrio", icon:"🚪", categoria:"puerta",
    configs:[
      {id:"pmv_d_int",label:"1 hoja der. · Interior", desc:"Medio vidrio, abre adentro, bisagras derecha."},
      {id:"pmv_i_int",label:"1 hoja izq. · Interior", desc:"Medio vidrio, abre adentro, bisagras izquierda."},
      {id:"pmv_d_ext",label:"1 hoja der. · Exterior", desc:"Medio vidrio, abre afuera, bisagras derecha."},
      {id:"pmv_i_ext",label:"1 hoja izq. · Exterior", desc:"Medio vidrio, abre afuera, bisagras izquierda."},
    ],
  },
  {
    id:"persiana", label:"Persiana Monoblock", icon:"⬛", categoria:"especial",
    configs:[
      {id:"per_manual",   label:"Manual",           desc:"Accionada a mano con cinta o eje."},
      {id:"per_electrica",label:"Eléctrica",         desc:"Con motor y control."},
    ],
  },
  {
    id:"fijo", label:"Paño Fijo", icon:"⬜", categoria:"especial",
    configs:[{id:"fijo1",label:"Sin apertura",desc:"Solo vidrio, no abre."}],
  },
  {
    id:"celosia", label:"Celosía / Tejido", icon:"◫", categoria:"especial",
    configs:[
      {id:"cel1",label:"Corrediza",desc:""},
      {id:"cel2",label:"Fija",     desc:""},
    ],
  },
  {
    id:"catalana", label:"Persiana Catalana", icon:"🪟", categoria:"catalana",
    configs:[
      {id:"cat_ext", label:"Catalana Exterior", desc:"Cajón y enrollador al exterior del muro."},
      {id:"cat_int", label:"Catalana Interior", desc:"Cajón y enrollador al interior del muro."},
      {id:"cat_sol", label:"Solapado",           desc:"Cajón exterior lateral, enrollador sobresale."},
    ],
  },
];

// ─────────── SVG ILUSTRACIONES ───────────
// ── SVG ILUSTRACIONES ─────────────────────────────────────
function AberturaSVG({ tipoId, configId, w=90, h=70, monoblock=false }) {
  // Monoblock: cajón naranja arriba, ventana ocupa parte inferior
  const cajH = monoblock ? Math.round(h * 0.18) : 0;
  const fy   = cajH;          // frame top Y
  const fh   = h - cajH;     // frame height
  const fw   = w;

  // helpers
  const fx  = p => (p / 100) * fw;
  const fy2 = p => fy + (p / 100) * fh;

  // palette — clean technical style
  const FR  = "#1e3a5f";   // frame stroke
  const GL  = ACCENT+"20"; // glass fill
  const GS  = ACCENT;      // glass stroke / lines
  const AL  = "#12223a";   // aluminium fill
  const DG  = ACCENT+"70"; // diagonal lines
  const AR  = ACCENT;      // arrows
  const MC  = "#fb923c";   // monoblock / exterior arc

  // ── shared primitives ──────────────────────────────────

  // outer frame
  const Frame = () => (
    <rect x={0} y={fy} width={fw} height={fh} rx={1}
      fill={AL} stroke={FR} strokeWidth={2.5}/>
  );

  // glass pane
  const Glass = ({x,y,rw,rh}) => (
    <rect x={x} y={y} width={rw} height={rh} fill={GL} stroke={GS} strokeWidth={1.4}/>
  );

  // X diagonals — the catalog style
  const DiagX = ({x,y,rw,rh}) => <>
    <line x1={x}    y1={y}    x2={x+rw} y2={y+rh} stroke={DG} strokeWidth={1.1}/>
    <line x1={x+rw} y1={y}    x2={x}    y2={y+rh} stroke={DG} strokeWidth={1.1}/>
  </>;

  // single diagonal (top-left to bottom-right only, like catalog for some types)
  const DiagSingle = ({x,y,rw,rh,fromRight}) => fromRight
    ? <line x1={x+rw} y1={y} x2={x} y2={y+rh} stroke={DG} strokeWidth={1.1}/>
    : <line x1={x}    y1={y} x2={x+rw} y2={y+rh} stroke={DG} strokeWidth={1.1}/>;

  // horizontal slide arrows ← →
  const SlideArrows = ({cx,cy}) => <>
    <line x1={cx-fw*0.13} y1={cy} x2={cx+fw*0.13} y2={cy} stroke={AR} strokeWidth={1.2}/>
    <polygon points={`${cx-fw*0.13},${cy} ${cx-fw*0.08},${cy-fh*0.025} ${cx-fw*0.08},${cy+fh*0.025}`} fill={AR}/>
    <polygon points={`${cx+fw*0.13},${cy} ${cx+fw*0.08},${cy-fh*0.025} ${cx+fw*0.08},${cy+fh*0.025}`} fill={AR}/>
  </>;

  // monoblock cajón
  const Cajon = () => monoblock ? <>
    <rect x={0} y={0} width={fw} height={cajH} rx={1} fill={AL} stroke={MC} strokeWidth={1.5}/>
    {[0.3,0.55,0.8].map((f,i)=>(
      <line key={i} x1={4} y1={cajH*f} x2={fw-4} y2={cajH*f} stroke={MC+"55"} strokeWidth={0.8}/>
    ))}
    <rect x={fw*0.37} y={1.5} width={fw*0.26} height={cajH*0.3} rx={1} fill={MC} opacity={0.5}/>
  </> : null;

  // lamas panel (for persiana, puerta ciega, etc.)
  const Lamas = ({x,y,rw,rh,n=7}) => <>
    {Array.from({length:n},(_,i)=>{
      const lh = rh/n;
      return <rect key={i} x={x} y={y+i*lh} width={rw} height={lh-1} rx={0.5}
        fill={i%2===0?AL+"cc":AL+"88"} stroke={GS+"44"} strokeWidth={0.7}/>;
    })}
  </>;

  // ── CORREDIZA ─────────────────────────────────────────
  // Like catalog: panels with X diagonals, slide arrows, rail at bottom
  if (tipoId === "corrediza") {
    const px3=3, pw2=46, pw3=30, pw4=22;
    let panels = [];

    const Panel = ({x,pw,overlap}) => {
      const gx=fx(x), gy=fy2(3), gw=fx(pw), gh=fh*0.92;
      return <>
        <Glass x={gx} y={gy} rw={gw} rh={gh}/>
        <DiagX x={gx} y={gy} rw={gw} rh={gh}/>
      </>;
    };
    const FixedPanel = ({x,pw}) => {
      const gx=fx(x), gy=fy2(3), gw=fx(pw), gh=fh*0.92;
      return <>
        <rect x={gx} y={gy} width={gw} height={gh} fill={GL+"55"} stroke={GS+"55"} strokeWidth={1} strokeDasharray="3,2"/>
      </>;
    };

    if (configId==="c2h2r") {
      panels=[<Panel key={0} x={2} pw={47}/>,<Panel key={1} x={51} pw={47}/>];
    } else if (configId==="c3h3r") {
      panels=[<Panel key={0} x={2} pw={30}/>,<Panel key={1} x={34} pw={30}/>,<Panel key={2} x={66} pw={30}/>];
    } else if (configId==="c3h2r") {
      panels=[<Panel key={0} x={2} pw={30}/>,<FixedPanel key={1} x={34} pw={30}/>,<Panel key={2} x={66} pw={30}/>];
    } else if (configId==="c4h2r") {
      panels=[0,24,50,74].map((x,i)=><Panel key={i} x={x+1} pw={22}/>);
    } else {
      panels=[0,24,50,74].map((x,i)=><Panel key={i} x={x+1} pw={22}/>);
    }

    return <svg width={w} height={h}>
      <Cajon/>
      <Frame/>
      {panels}
      <line x1={0} y1={fy2(97)} x2={fw} y2={fy2(97)} stroke={GS+"44"} strokeWidth={2}/>
      <SlideArrows cx={fw/2} cy={fy2(55)}/>
    </svg>;
  }

  // ── PROYECTANTE / BANDEROLA ────────────────────────────
  // Catalog: single diagonal from top-left hinge, arc at bottom showing opening
  if (tipoId === "proyectante") {
    const two = configId === "p2h";
    const Hoja = ({gx,gw,gy,gh}) => <>
      <Glass x={gx} y={gy} rw={gw} rh={gh}/>
      {/* diagonal from top hinge corner to bottom opposite */}
      <line x1={gx} y1={gy} x2={gx+gw} y2={gy+gh} stroke={DG} strokeWidth={1.1}/>
      {/* pivot line at top */}
      <line x1={gx} y1={gy} x2={gx+gw} y2={gy} stroke={AR} strokeWidth={2}/>
      {/* opening arc at bottom */}
      <path d={`M${gx},${gy+gh} A${gw},${gh*0.6} 0 0,0 ${gx+gw},${gy+gh*0.55}`}
        stroke={AR+"88"} strokeWidth={1.1} strokeDasharray="3,2" fill="none"/>
    </>;
    return <svg width={w} height={h}>
      <Cajon/><Frame/>
      {two
        ?<><Hoja gx={fx(2)} gw={fx(46)} gy={fy2(3)} gh={fh*0.92}/>
            <Hoja gx={fx(52)} gw={fx(46)} gy={fy2(3)} gh={fh*0.92}/></>
        :<Hoja gx={fx(3)} gw={fx(94)} gy={fy2(3)} gh={fh*0.92}/>
      }
    </svg>;
  }

  // ── BATIENTE VENTANA — vista desde ADENTRO ─────────────
  // Catalog: X diagonals, arc showing inward opening, hinge marks
  if (tipoId === "batiente") {
    const doble   = configId === "b2h";
    const bisIzq  = configId === "b1hd"; // hoja derecha → bisagra izquierda

    const Hoja = ({gx,gw,gy,gh,bisLeft}) => {
      // arc opens inward (bottom sweeps in)
      const arcPath = bisLeft
        ? `M${gx+gw},${gy+gh*0.92} A${gw*0.95},${gh*0.92} 0 0,1 ${gx},${gy+gh*0.46}`
        : `M${gx},${gy+gh*0.92} A${gw*0.95},${gh*0.92} 0 0,0 ${gx+gw},${gy+gh*0.46}`;
      const pivX = bisLeft ? gx : gx+gw;
      return <>
        <Glass x={gx} y={gy} rw={gw} rh={gh}/>
        <DiagX x={gx} y={gy} rw={gw} rh={gh}/>
        <path d={arcPath} stroke={AR+"77"} strokeWidth={1.1} strokeDasharray="4,2" fill="none"/>
        {/* hinge marks */}
        <rect x={pivX-1.5} y={gy+gh*0.15} width={3} height={gh*0.1} rx={0.5} fill={GS+"99"}/>
        <rect x={pivX-1.5} y={gy+gh*0.72} width={3} height={gh*0.1} rx={0.5} fill={GS+"99"}/>
        {/* handle */}
        <rect x={bisLeft?gx+gw-6:gx+2} y={gy+gh*0.44} width={5} height={gh*0.12} rx={1.5} fill={GS+"bb"}/>
      </>;
    };

    return <svg width={w} height={h}>
      <Cajon/><Frame/>
      {doble
        ?<><Hoja gx={fx(2)} gw={fx(46)} gy={fy2(3)} gh={fh*0.92} bisLeft/>
            <Hoja gx={fx(52)} gw={fx(46)} gy={fy2(3)} gh={fh*0.92} bisLeft={false}/></>
        :<Hoja gx={fx(3)} gw={fx(94)} gy={fy2(3)} gh={fh*0.92} bisLeft={bisIzq}/>
      }
      <text x={fw/2} y={h-1} textAnchor="middle" fontSize={6} fill={AR+"88"} fontWeight="600">
        {doble?"2 hojas":bisIzq?"Derecha":"Izquierda"}
      </text>
    </svg>;
  }

  // ── PUERTA CORREDIZA ──────────────────────────────────
  if (tipoId === "puerta_corrediza") {
    const one = configId === "pc1h";
    return <svg width={w} height={h}>
      <Cajon/>
      <rect x={0} y={fy} width={fw} height={fh} rx={1} fill={AL} stroke={FR} strokeWidth={2.5}/>
      {one ? <>
        <Glass x={fx(3)} y={fy2(2)} rw={fx(94)} rh={fh*0.96}/>
        <DiagX x={fx(3)} y={fy2(2)} rw={fx(94)} rh={fh*0.96}/>
      </> : <>
        <Glass x={fx(2)} y={fy2(2)} rw={fx(46)} rh={fh*0.96}/>
        <DiagX x={fx(2)} y={fy2(2)} rw={fx(46)} rh={fh*0.96}/>
        <Glass x={fx(52)} y={fy2(2)} rw={fx(46)} rh={fh*0.96}/>
        <DiagX x={fx(52)} y={fy2(2)} rw={fx(46)} rh={fh*0.96}/>
      </>}
      <line x1={0} y1={fy2(97)} x2={fw} y2={fy2(97)} stroke={GS+"44"} strokeWidth={2.5}/>
      <SlideArrows cx={fw/2} cy={fy2(50)}/>
    </svg>;
  }

  // ── PUERTA BATIENTE — vista desde AFUERA ──────────────
  // Interior (empuja): arco punteado azul arriba
  // Exterior (tira):   arco sólido naranja abajo
  if (tipoId === "puerta_batiente") {
    const doble    = configId?.startsWith("pb2h");
    const ext      = configId?.endsWith("_ext");
    const izq      = configId?.includes("hi");
    // bisLeft: izq+int→false, der+int→true, izq+ext→true, der+ext→false
    const bisLeft  = ext ? izq : !izq;

    const Hoja = ({gx,gw,gy,gh,bL,exterior}) => {
      const arcPath = exterior
        ? (bL
          ? `M${gx+gw},${gy+gh*0.92} A${gw},${gh*0.92} 0 0,0 ${gx},${gy+gh*0.46}`
          : `M${gx},${gy+gh*0.92} A${gw},${gh*0.92} 0 0,1 ${gx+gw},${gy+gh*0.46}`)
        : (bL
          ? `M${gx+gw},${gy+gh*0.1} A${gw*0.92},${gh*0.88} 0 0,1 ${gx},${gy+gh*0.5}`
          : `M${gx},${gy+gh*0.1} A${gw*0.92},${gh*0.88} 0 0,0 ${gx+gw},${gy+gh*0.5}`);
      const pivX = bL ? gx : gx+gw;
      return <>
        <Glass x={gx} y={gy} rw={gw} rh={gh}/>
        <DiagX x={gx} y={gy} rw={gw} rh={gh}/>
        <path d={arcPath}
          stroke={exterior ? MC : AR+"77"}
          strokeWidth={exterior ? 1.6 : 1.1}
          strokeDasharray={exterior ? "none" : "4,2"}
          fill={exterior ? MC+"0d" : "none"}/>
        <rect x={pivX-1.5} y={gy+gh*0.18} width={3} height={gh*0.09} rx={0.5} fill={GS+"99"}/>
        <rect x={pivX-1.5} y={gy+gh*0.73} width={3} height={gh*0.09} rx={0.5} fill={GS+"99"}/>
        <rect x={bL?gx+gw-7:gx+2} y={gy+gh*0.43} width={6} height={gh*0.14} rx={2} fill={GS+"bb"}/>
      </>;
    };

    const lbl = doble
      ? (ext?"↗ Ext 2h":"↙ Int 2h")
      : (ext?(izq?"↗ Ext Izq":"↗ Ext Der"):(izq?"↙ Int Izq":"↙ Int Der"));

    return <svg width={w} height={h}>
      <Cajon/>
      <rect x={0} y={fy} width={fw} height={fh} rx={1} fill={AL} stroke={FR} strokeWidth={2.5}/>
      {doble
        ?<><Hoja gx={fx(2)} gw={fx(46)} gy={fy2(2)} gh={fh*0.96} bL exterior={ext}/>
            <Hoja gx={fx(52)} gw={fx(46)} gy={fy2(2)} gh={fh*0.96} bL={false} exterior={ext}/></>
        :<Hoja gx={fx(2)} gw={fx(96)} gy={fy2(2)} gh={fh*0.96} bL={bisLeft} exterior={ext}/>
      }
      <text x={fw/2} y={h-1} textAnchor="middle" fontSize={6}
        fill={ext?MC+"99":AR+"88"} fontWeight="600">{lbl}</text>
    </svg>;
  }

  // ── PUERTA MEDIO VIDRIO ───────────────────────────────
  // Top half: glass with X diagonal; bottom half: lamas
  if (tipoId === "puerta_mv") {
    const ext     = configId?.endsWith("_ext");
    const izq     = configId?.includes("_i_");
    const bisLeft = ext ? izq : !izq;
    const gx=fx(2), gw=fx(96), gy=fy2(2), gh=fh*0.96;
    const midY = gy + gh*0.48;
    const arcPath = ext
      ? (bisLeft
        ? `M${gx+gw},${gy+gh*0.92} A${gw},${gh*0.92} 0 0,0 ${gx},${gy+gh*0.46}`
        : `M${gx},${gy+gh*0.92} A${gw},${gh*0.92} 0 0,1 ${gx+gw},${gy+gh*0.46}`)
      : (bisLeft
        ? `M${gx+gw},${gy+gh*0.08} A${gw*0.92},${gh*0.88} 0 0,1 ${gx},${gy+gh*0.5}`
        : `M${gx},${gy+gh*0.08} A${gw*0.92},${gh*0.88} 0 0,0 ${gx+gw},${gy+gh*0.5}`);
    const pivX = bisLeft ? gx : gx+gw;
    return <svg width={w} height={h}>
      <Cajon/>
      <rect x={0} y={fy} width={fw} height={fh} rx={1} fill={AL} stroke={FR} strokeWidth={2.5}/>
      {/* top glass */}
      <Glass x={gx} y={gy} rw={gw} rh={gh*0.48}/>
      <DiagX x={gx} y={gy} rw={gw} rh={gh*0.48}/>
      {/* bottom lamas */}
      <rect x={gx} y={midY} width={gw} height={gh*0.52} fill={AL+"aa"} stroke={GS+"88"} strokeWidth={1.2}/>
      <Lamas x={gx+1} y={midY+2} rw={gw-2} rh={gh*0.52-4} n={6}/>
      {/* opening arc */}
      <path d={arcPath} stroke={ext?MC:AR+"77"} strokeWidth={ext?1.6:1.1}
        strokeDasharray={ext?"none":"4,2"} fill={ext?MC+"0d":"none"}/>
      <rect x={pivX-1.5} y={gy+gh*0.15} width={3} height={gh*0.08} rx={0.5} fill={GS+"99"}/>
      <rect x={pivX-1.5} y={gy+gh*0.72} width={3} height={gh*0.08} rx={0.5} fill={GS+"99"}/>
      <rect x={bisLeft?gx+gw-7:gx+2} y={gy+gh*0.4} width={6} height={gh*0.12} rx={2} fill={GS+"bb"}/>
      <text x={fw/2} y={h-1} textAnchor="middle" fontSize={6}
        fill={ext?MC+"99":AR+"88"} fontWeight="600">
        {ext?(izq?"↗ Ext Izq":"↗ Ext Der"):(izq?"↙ Int Izq":"↙ Int Der")}
      </text>
    </svg>;
  }

  // ── PERSIANA MONOBLOCK ────────────────────────────────
  // Always shows built-in cajón at top
  if (tipoId === "persiana") {
    const cajHP = Math.round(h*0.2);
    return <svg width={w} height={h}>
      {/* cajón integrado */}
      <rect x={0} y={0} width={fw} height={cajHP} rx={1} fill={AL} stroke={MC} strokeWidth={1.5}/>
      {[0.3,0.6,0.85].map((f,i)=>(
        <line key={i} x1={4} y1={cajHP*f} x2={fw-4} y2={cajHP*f} stroke={MC+"55"} strokeWidth={0.8}/>
      ))}
      <rect x={fw*0.37} y={2} width={fw*0.26} height={cajHP*0.28} rx={1} fill={MC} opacity={0.5}/>
      {/* frame */}
      <rect x={0} y={cajHP} width={fw} height={h-cajHP} rx={1} fill={AL} stroke={FR} strokeWidth={2}/>
      {/* lamas */}
      <Lamas x={fx(4)} y={cajHP+4} rw={fx(92)} rh={h-cajHP-8} n={7}/>
      {/* diagonal across lamas */}
      <line x1={fx(4)} y1={cajHP+4} x2={fx(96)} y2={h-4} stroke={DG} strokeWidth={1}/>
      <text x={fw/2} y={h-1} textAnchor="middle" fontSize={6} fill={MC+"88"}>
        {configId==="per_electrica"?"⚡ Eléctrica":"Manual"}
      </text>
    </svg>;
  }

  // ── PAÑO FIJO ─────────────────────────────────────────
  if (tipoId === "fijo") {
    const gx=fx(4), gy=fy2(4), gw=fx(92), gh=fh*0.90;
    return <svg width={w} height={h}>
      <Cajon/><Frame/>
      <Glass x={gx} y={gy} rw={gw} rh={gh}/>
      <DiagX x={gx} y={gy} rw={gw} rh={gh}/>
    </svg>;
  }

  // ── CELOSÍA ───────────────────────────────────────────
  if (tipoId !== "catalana") return <svg width={w} height={h}>
    <Frame/>
    <rect x={fx(4)} y={fy2(4)} width={fx(92)} height={fh*0.90}
      fill={GL+"55"} stroke={GS+"55"} strokeWidth={1}/>
    <Lamas x={fx(4)} y={fy2(4)} rw={fx(92)} rh={fh*0.90} n={6}/>
    <DiagSingle x={fx(4)} y={fy2(4)} rw={fx(92)} rh={fh*0.90}/>
  </svg>;

  // ── PERSIANA CATALANA ─────────────────────────────────
  // Dimensiones base
  const cajonW = fw * 0.32;   // ancho del cajón circular
  const cajonH = h  * 0.38;   // alto cajón
  const frameW = fw * 0.12;   // ancho perfil lateral
  const lH     = h  * 0.55;   // altura lamas colgantes
  const lY     = cajonH;      // arrancan debajo del cajón
  const nLamas  = 5;

  // Función lamas colgantes
  const CatLamas = ({x, lw}) => Array.from({length: nLamas}, (_,i) => {
    const ly = lY + i * (lH / nLamas);
    return <rect key={i} x={x} y={ly} width={lw} height={lH/nLamas - 1}
      fill={AL} stroke={FR} strokeWidth={0.6} rx={0.5}/>;
  });

  // Cajón circular (sección transversal)
  const BoxCircle = ({cx, cy}) => <>
    <rect x={cx - cajonW/2} y={cy} width={cajonW} height={cajonH*0.85}
      fill={AL} stroke={FR} strokeWidth={1} rx={2}/>
    <circle cx={cx} cy={cy + cajonH*0.42} r={cajonH*0.22}
      fill="none" stroke={GS} strokeWidth={1.2} strokeDasharray="2,2"/>
    <circle cx={cx} cy={cy + cajonH*0.42} r={cajonH*0.09}
      fill={FR} stroke={GS} strokeWidth={0.8}/>
  </>;

  // Perfil de muro (línea vertical)
  const Muro = ({x}) => <rect x={x} y={0} width={frameW} height={h}
    fill={AL} stroke={FR} strokeWidth={1}/>;

  if (configId === "cat_ext") {
    // Cajón exterior: cajón encima del muro, lamas bajan por fuera
    const muroX = fw * 0.35;
    const cajCX = muroX - cajonW * 0.5;
    return <svg width={w} height={h} style={{overflow:"visible"}}>
      <Muro x={muroX}/>
      <BoxCircle cx={cajCX} cy={0}/>
      <CatLamas x={cajCX - cajonW/2} lw={cajonW}/>
      <text x={fw/2} y={h-2} textAnchor="middle" fontSize={7} fill={GS} fontWeight="600">Exterior</text>
    </svg>;
  }

  if (configId === "cat_int") {
    // Cajón interior: cajón dentro del vano del muro
    const muroX = fw * 0.15;
    const cajCX = muroX + frameW + cajonW * 0.5 + fw*0.05;
    return <svg width={w} height={h} style={{overflow:"visible"}}>
      <Muro x={muroX}/>
      <BoxCircle cx={cajCX} cy={0}/>
      <CatLamas x={cajCX - cajonW/2} lw={cajonW}/>
      <text x={fw/2} y={h-2} textAnchor="middle" fontSize={7} fill={GS} fontWeight="600">Interior</text>
    </svg>;
  }

  // cat_sol — Solapado: cajón lateral sobresaliente
  const muroX2 = fw * 0.30;
  const cajCX2 = fw * 0.75;
  return <svg width={w} height={h} style={{overflow:"visible"}}>
    <Muro x={muroX2}/>
    <rect x={cajCX2 - cajonW*0.5} y={h*0.05} width={cajonW} height={cajonH*0.85}
      fill={AL} stroke={FR} strokeWidth={1} rx={2} strokeDasharray="3,2"/>
    <circle cx={cajCX2} cy={h*0.05 + cajonH*0.42} r={cajonH*0.22}
      fill="none" stroke={GS} strokeWidth={1.2} strokeDasharray="2,2"/>
    <circle cx={cajCX2} cy={h*0.05 + cajonH*0.42} r={cajonH*0.09}
      fill={FR} stroke={GS} strokeWidth={0.8}/>
    <CatLamas x={muroX2 + frameW} lw={cajonW * 0.85}/>
    <text x={fw/2} y={h-2} textAnchor="middle" fontSize={7} fill={GS} fontWeight="600">Solapado</text>
  </svg>;
}

function VidrioSelector({ value, onChange }) {
  // value = { tipo, mm, lam, dvh1, dvh2, dvh3 }
  const v = value || { tipo:"", mm:"", lam:"", dvh1:"", dvh2:"", dvh3:"" };
  const set = (k, val) => onChange({ ...v, [k]: val });

  const vidrioLabel = () => {
    if (!v.tipo) return "";
    if (v.tipo === "simple")   return `Simple ${v.mm||""}mm`.trim();
    if (v.tipo === "laminado") return `Laminado ${v.lam||""}`.trim();
    if (v.tipo === "dvh")      return `DVH ${v.dvh1||"?"}+${v.dvh2||"?"}+${v.dvh3||"?"}`;
    if (v.tipo === "sin")      return "Sin vidrio";
    return "";
  };

  return (
    <div style={{minWidth:160}}>
      <select style={S.sel} value={v.tipo} onChange={e=>set("tipo",e.target.value)}>
        <option value="">— vidrio —</option>
        <option value="simple">Vidrio Simple</option>
        <option value="laminado">Laminado</option>
        <option value="dvh">DVH (doble)</option>
        <option value="sin">Sin vidrio</option>
      </select>

      {v.tipo === "simple" && (
        <select style={{...S.sel,marginTop:4}} value={v.mm} onChange={e=>set("mm",e.target.value)}>
          <option value="">— mm —</option>
          {["4","5","6","8"].map(m=><option key={m} value={m}>{m} mm</option>)}
        </select>
      )}

      {v.tipo === "laminado" && (
        <select style={{...S.sel,marginTop:4}} value={v.lam} onChange={e=>set("lam",e.target.value)}>
          <option value="">— composición —</option>
          <option value="3+3">3+3</option>
          <option value="4+4">4+4</option>
        </select>
      )}

      {v.tipo === "dvh" && (
        <div style={{display:"flex",alignItems:"center",gap:3,marginTop:4}}>
          <input style={{...S.minInput}} type="number" min="1" placeholder="4" value={v.dvh1} onChange={e=>set("dvh1",e.target.value)}/>
          <span style={{color:"#475569",fontSize:12,fontWeight:700}}>+</span>
          <input style={{...S.minInput}} type="number" min="1" placeholder="9" value={v.dvh2} onChange={e=>set("dvh2",e.target.value)}/>
          <span style={{color:"#475569",fontSize:12,fontWeight:700}}>+</span>
          <input style={{...S.minInput}} type="number" min="1" placeholder="5" value={v.dvh3} onChange={e=>set("dvh3",e.target.value)}/>
        </div>
      )}

      {v.tipo && v.tipo !== "sin" && (
        <div style={{fontSize:10,color:ACCENT,marginTop:3,fontWeight:600}}>{vidrioLabel()}</div>
      )}
    </div>
  );
}

const vidrioTexto = v => {
  if (!v || !v.tipo) return "";
  if (v.tipo === "simple")   return `Vidrio Simple${v.mm?` de ${v.mm}mm`:""}`;
  if (v.tipo === "laminado") return `Vidrio Laminado${v.lam?` ${v.lam}`:""}`;
  if (v.tipo === "dvh")      return `DVH ${v.dvh1||"?"}+${v.dvh2||"?"}+${v.dvh3||"?"}`;
  if (v.tipo === "sin")      return "Sin vidrio";
  return "";
};

// ─────────── SERIES / LÍNEAS ───────────
// ── SERIES / LÍNEAS POR TIPO ──────────────────────────────
// Corredizas tienen sus propias series + opción de divisor
// Puertas, batientes, fijos, proyectantes, tabaqueras → Serie 30, A78L, A78
const SERIES_CORREDIZA = ["Serie 20","Serie 25","A78","A78L"];
const SERIES_GENERAL   = ["Serie 30","A78","A78L"];

const seriesPorTipo = tipo => {
  if (tipo === "corrediza" || tipo === "puerta_corrediza") return SERIES_CORREDIZA;
  if (["batiente","puerta_batiente","puerta_mv","fijo","proyectante"].includes(tipo)) return SERIES_GENERAL;
  return [];
};

// ─────────── DISEÑO DE HOJA (RELLENOS) ───────────
const RELLENOS = [
  { id:"ciega",      label:"Ciega",              desc:"Toda aluminio, sin vidrio" },
  { id:"v_entero",   label:"Vidrio entero",       desc:"Toda la hoja en vidrio" },
  { id:"mitad",      label:"Mitad y mitad",       desc:"Mitad vidrio / mitad aluminio" },
  { id:"v_arriba",   label:"Vidrio pequeño arriba",desc:"Pequeño vidrio en la parte superior" },
  { id:"div_vv",     label:"Dividida V+V",        desc:"Vidrio arriba y vidrio abajo separados" },
];

function RellenoSVG({ id, w=72, h=90 }) {
  const px = v => (v/100)*w;
  const py = v => (v/100)*h;
  const marco = {stroke:"#1e3a5f",strokeWidth:2,fill:"#0a1e30"};
  const vidrio = {fill:ACCENT+"22",stroke:ACCENT,strokeWidth:1.5};
  const alum   = {fill:"#1a2e48",stroke:"#2a4060",strokeWidth:1};
  // marco exterior
  const M = () => <rect x={px(5)} y={py(2)} width={px(90)} height={py(96)} rx={3} {...marco}/>;
  // interior útil: x=10, y=6, w=80, h=88
  const ix=px(10), iy=py(6), iw=px(80), ih=py(88);

  if (id==="ciega") return (
    <svg width={w} height={h}>
      <M/>
      <rect x={ix} y={iy} width={iw} height={ih} rx={1} {...alum}/>
      {/* textura líneas horizontales aluminio */}
      {[20,35,50,65,80].map(p=>(
        <line key={p} x1={ix} y1={py(p)} x2={ix+iw} y2={py(p)} stroke="#2a4060" strokeWidth={0.8}/>
      ))}
      <text x={px(50)} y={py(97)} textAnchor="middle" fontSize={6.5} fill="#475569">Ciega</text>
    </svg>
  );

  if (id==="v_entero") return (
    <svg width={w} height={h}>
      <M/>
      <rect x={ix} y={iy} width={iw} height={ih} rx={1} {...vidrio}/>
      {/* reflejo vidrio */}
      <line x1={ix+px(8)} y1={iy+py(3)} x2={ix+px(8)} y2={iy+ih-py(3)} stroke={ACCENT+"55"} strokeWidth={2}/>
      <text x={px(50)} y={py(97)} textAnchor="middle" fontSize={6.5} fill={ACCENT+"99"}>Vidrio entero</text>
    </svg>
  );

  if (id==="mitad") return (
    <svg width={w} height={h}>
      <M/>
      {/* vidrio arriba */}
      <rect x={ix} y={iy} width={iw} height={ih*0.5} rx={1} {...vidrio}/>
      <line x1={ix+px(8)} y1={iy+py(3)} x2={ix+px(8)} y2={iy+ih*0.5-py(2)} stroke={ACCENT+"55"} strokeWidth={1.5}/>
      {/* división */}
      <rect x={ix} y={iy+ih*0.5} width={iw} height={py(2)} fill={ACCENT} opacity={0.5}/>
      {/* aluminio abajo */}
      <rect x={ix} y={iy+ih*0.5+py(2)} width={iw} height={ih*0.5-py(2)} rx={1} {...alum}/>
      {[60,72].map(p=>(
        <line key={p} x1={ix} y1={py(p)} x2={ix+iw} y2={py(p)} stroke="#2a4060" strokeWidth={0.8}/>
      ))}
      <text x={px(50)} y={py(97)} textAnchor="middle" fontSize={6.5} fill={ACCENT+"99"}>½ V / ½ Al</text>
    </svg>
  );

  if (id==="v_arriba") return (
    <svg width={w} height={h}>
      <M/>
      {/* vidrio pequeño arriba ~25% */}
      <rect x={ix} y={iy} width={iw} height={ih*0.25} rx={1} {...vidrio}/>
      <line x1={ix+px(8)} y1={iy+py(2)} x2={ix+px(8)} y2={iy+ih*0.25-py(1)} stroke={ACCENT+"55"} strokeWidth={1.5}/>
      {/* división */}
      <rect x={ix} y={iy+ih*0.25} width={iw} height={py(2)} fill={ACCENT} opacity={0.5}/>
      {/* aluminio resto */}
      <rect x={ix} y={iy+ih*0.25+py(2)} width={iw} height={ih*0.75-py(2)} rx={1} {...alum}/>
      {[45,57,69,81].map(p=>(
        <line key={p} x1={ix} y1={py(p)} x2={ix+iw} y2={py(p)} stroke="#2a4060" strokeWidth={0.8}/>
      ))}
      <text x={px(50)} y={py(97)} textAnchor="middle" fontSize={6.5} fill={ACCENT+"99"}>V pequeño</text>
    </svg>
  );

  if (id==="div_vv") return (
    <svg width={w} height={h}>
      <M/>
      {/* vidrio arriba ~45% */}
      <rect x={ix} y={iy} width={iw} height={ih*0.45} rx={1} {...vidrio}/>
      <line x1={ix+px(8)} y1={iy+py(2)} x2={ix+px(8)} y2={iy+ih*0.45-py(1)} stroke={ACCENT+"55"} strokeWidth={1.5}/>
      {/* franja aluminio central */}
      <rect x={ix} y={iy+ih*0.45} width={iw} height={ih*0.1} rx={0} {...alum}/>
      {/* vidrio abajo ~45% */}
      <rect x={ix} y={iy+ih*0.55} width={iw} height={ih*0.45} rx={1} {...vidrio}/>
      <line x1={ix+px(8)} y1={iy+ih*0.55+py(1)} x2={ix+px(8)} y2={iy+ih-py(2)} stroke={ACCENT+"55"} strokeWidth={1.5}/>
      <text x={px(50)} y={py(97)} textAnchor="middle" fontSize={6.5} fill={ACCENT+"99"}>V+V dividida</text>
    </svg>
  );

  return <svg width={w} height={h}><rect x={px(5)} y={py(2)} width={px(90)} height={py(96)} rx={3} fill="#0a1e30" stroke="#1e3a5f" strokeWidth={2}/></svg>;
}

// ─────────── SELECTOR DE RELLENO ───────────
function RellenoSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const sel = RELLENOS.find(r=>r.id===value);
  return (
    <>
      <button style={{...S.tipoBtn,minWidth:76}} onClick={()=>setOpen(true)}>
        {sel ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <RellenoSVG id={sel.id} w={52} h={66}/>
            <div style={{fontSize:9,color:ACCENT,fontWeight:700,textAlign:"center",lineHeight:1.2,maxWidth:80}}>{sel.label}</div>
          </div>
        ) : (
          <div style={{padding:"8px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{fontSize:18,opacity:0.3}}>＋</div>
            <div style={{fontSize:9,color:"#475569",textAlign:"center"}}>Diseño hoja</div>
          </div>
        )}
      </button>
      {open && (
        <div style={S.overlay} onClick={()=>setOpen(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={S.modalTitle}>Diseño de la hoja</div>
              <button style={{background:"none",border:"none",color:"#64748b",fontSize:22,cursor:"pointer"}} onClick={()=>setOpen(false)}>✕</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
              {RELLENOS.map(r=>(
                <button key={r.id}
                  style={{...S.tipoCard, minWidth:100, border:`1px solid ${value===r.id?ACCENT:BORDER}`,
                    background:value===r.id?ACCENT+"15":BG}}
                  onClick={()=>{ onChange(r.id); setOpen(false); }}>
                  <RellenoSVG id={r.id} w={72} h={90}/>
                  <div style={{fontSize:11,fontWeight:700,color:value===r.id?ACCENT:"#e2e8f0",marginTop:6,textAlign:"center"}}>{r.label}</div>
                  <div style={{fontSize:9,color:"#64748b",textAlign:"center",marginTop:2,lineHeight:1.3,maxWidth:110}}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────── FILA VACÍA DE MEDICIÓN ───────────
const emptyRow = n => ({
  id: Date.now()+Math.random(), num:n,
  tipo:"", config:"",
  ancho:"", alto:"", cantidad:"1",
  serie:"", divisor:false, monoblock:false,
  color:"", relleno:"",
  vidrio:{ tipo:"", mm:"", lam:"", dvh1:"", dvh2:"", dvh3:"" },
  observaciones:"",
  preciosMono:{},
});

// Texto resumido de una abertura para WhatsApp / impresión
const aberturaResumen = (f) => {
  const t = TIPOS.find(t=>t.id===f.tipo);
  const c = t?.configs.find(c=>c.id===f.config);
  const parts = [];
  parts.push(`${f.num}) ${t?.label||"?"}${c?" "+c.label:""}`);
  if (f.ancho||f.alto) parts.push(`${f.ancho||"?"}x${f.alto||"?"}cm`);
  if (f.cantidad && f.cantidad!=="1") parts.push(`x${f.cantidad}`);
  if (f.serie) parts.push(f.serie + (f.divisor?" c/divisor":"") + (f.monoblock?" c/Monoblock":""));
  if (f.relleno) { const r=RELLENOS.find(r=>r.id===f.relleno); if(r) parts.push(r.label); }
  if (f.color) parts.push(f.color);
  const vt = vidrioTexto(f.vidrio); if (vt) parts.push(vt);
  if (f.tipo==="persiana" && f.alto) {
    const cm = parseFloat(f.alto);
    if (cm) parts.push(`Cajón ${cm<=160?"15.5":"18.5"}cm`);
  }
  if (f.observaciones) parts.push(`(${f.observaciones})`);
  return parts.join(" · ");
};

// ─────────── DATOS DEMO ───────────
const DEMO = [
  { id:"c1", numCliente:1001, nombre:"María González", telefono:"3515551234",
    direccion:"Av. Colón 1240 piso 3", localidad:"Córdoba Capital",
    fechaLlamado:"2026-05-15", fechaMedicion:"2026-05-20", creadoEn:"2026-05-15",
    status:"aprobado", obsModo:"describir",
    observaciones:"Reforma urgente antes de junio.",
    notas:"",
    aberturas:[
      { id:1, num:1, tipo:"corrediza", config:"c2h2r", ancho:"120", alto:"110", cantidad:"2",
        serie:"Serie 25", divisor:false, color:"Anodizado", relleno:"",
        vidrio:{tipo:"dvh",mm:"",lam:"",dvh1:"4",dvh2:"9",dvh3:"5"}, observaciones:"Dormitorios" },
      { id:2, num:2, tipo:"corrediza", config:"c3h2r", ancho:"180", alto:"120", cantidad:"1",
        serie:"A78", divisor:true, color:"Anodizado", relleno:"",
        vidrio:{tipo:"dvh",mm:"",lam:"",dvh1:"4",dvh2:"9",dvh3:"5"}, observaciones:"Living" },
    ],
    presupuesto:"3 ventanas corredizas con DVH. Incluye colocación y sellado. Plazo: 15 días.",
    monto:"285000", pagos:[{id:1,monto:"142500",fecha:"2026-05-22",nota:"Seña 50%"}], fotos:["f1","f2"] },

  { id:"c2", numCliente:1002, nombre:"Roberto Sánchez", telefono:"3514449876",
    direccion:"Bv. San Juan 540", localidad:"Villa Allende",
    fechaLlamado:"2026-05-18", fechaMedicion:"2026-05-25", creadoEn:"2026-05-18",
    status:"presupuestado", obsModo:"describir",
    observaciones:"Casa nueva. Todo aluminio.",
    notas:"",
    aberturas:[
      { id:1, num:1, tipo:"corrediza", config:"c2h2r", ancho:"90", alto:"100", cantidad:"4",
        serie:"Serie 20", divisor:false, color:"Blanco", relleno:"",
        vidrio:{tipo:"simple",mm:"4",lam:"",dvh1:"",dvh2:"",dvh3:""}, observaciones:"Dormitorios" },
      { id:2, num:2, tipo:"puerta_batiente", config:"pb1hd_ext", ancho:"90", alto:"210", cantidad:"1",
        serie:"A78L", divisor:false, color:"Negro Pintado", relleno:"mitad",
        vidrio:{tipo:"dvh",mm:"",lam:"",dvh1:"4",dvh2:"9",dvh3:"4"}, observaciones:"Entrada principal" },
      { id:3, num:3, tipo:"persiana", config:"per_manual", ancho:"150", alto:"180", cantidad:"1",
        serie:"", divisor:false, color:"Blanco", relleno:"",
        vidrio:{tipo:"",mm:"",lam:"",dvh1:"",dvh2:"",dvh3:""}, observaciones:"" },
    ],
    presupuesto:"Paquete aberturas casa nueva. Plazo: 20 días.",
    monto:"520000", pagos:[], fotos:["f3"] },

  { id:"c3", numCliente:1003, nombre:"Claudia Ferreyra", telefono:"3516667890",
    direccion:"Ruta 9 km 14 lote 22", localidad:"Mendiolaza",
    fechaLlamado:"2026-05-26", creadoEn:"2026-05-26",
    status:"nuevo", obsModo:"", observaciones:"Remodelación de cocina.",
    notas:"", aberturas:[], presupuesto:"", monto:"", pagos:[], fotos:[] },

  { id:"c4", numCliente:1004, nombre:"Jorge Mansilla", telefono:"3513332211",
    direccion:"Calle Lima 88", localidad:"Río Ceballos",
    fechaLlamado:"2026-05-10", fechaMedicion:"2026-05-13", creadoEn:"2026-05-10",
    status:"en_produccion", obsModo:"escribir",
    observaciones:"Obra con fecha límite.",
    notas:"• 1 puerta entrada 90x210 DVH línea A78L\n• 2 ventanas living 150x120 DVH + persiana roller\n• Color blanco",
    aberturas:[],
    presupuesto:"Puerta + 2 ventanas con persiana. Colocación incluida.",
    monto:"410000", pagos:[{id:2,monto:"205000",fecha:"2026-05-14",nota:"50% adelanto"},{id:3,monto:"100000",fecha:"2026-05-20",nota:"Parcial"}], fotos:["f4"] },

  { id:"c5", numCliente:1005, nombre:"Ana Paz Romero", telefono:"3517778899",
    direccion:"Av. Rafael Núñez 3300", localidad:"Córdoba Capital",
    fechaLlamado:"2026-05-05", fechaMedicion:"2026-05-08", creadoEn:"2026-05-05",
    status:"entregado", obsModo:"escribir", observaciones:"Cliente recurrente.",
    notas:"3 ventanas de repuesto por rotura.",
    aberturas:[],
    presupuesto:"3 ventanas de repuesto. Colocación incluida.",
    monto:"95000", pagos:[{id:4,monto:"95000",fecha:"2026-05-09",nota:"Pago total"}], fotos:[] },
];

// Descripción técnica por serie (solo 20 y 25)
const SERIE_DESC = {
  "Serie 20": "con Cubetas, Cierre Lara, Rodamientos de Nylon.",
  "Serie 25": "con Cubetas, Cierre Lara, Rodamientos con Rulemán para una mejor durabilidad y deslizamiento.",
};

function buildWA(c) {
  const lineas=[];

  lineas.push(`🏡 *PRESUPUESTO — Aberturas Borges*`);
  lineas.push(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);
  lineas.push(`👤 *${c.nombre}* (N°${c.numCliente})`);
  if (c.direccion) lineas.push(`📍 ${c.direccion}${c.localidad?", "+c.localidad:""}`);
  if (c.fechaMedicion) lineas.push(`📐 Medición: ${fmt(c.fechaMedicion)}`);
  lineas.push("");

  if (c.obsModo==="describir" && (c.aberturas||[]).length>0) {
    lineas.push(`🪟 *Detalle de aberturas:*`);
    lineas.push("");
    c.aberturas.forEach((a,i)=>{
      const precio     = parseFloat((c.preciosAb||{})[a.id])||0;
      const precioMono = parseFloat((c.preciosMono||{})[a.id])||0;
      const cant       = parseInt(a.cantidad)||1;

      lineas.push(`*${i+1}) ${aberturaResumen(a)}*`);

      // Descripción técnica de serie (sin repetir vidrio)
      if (a.serie && SERIE_DESC[a.serie]) {
        lineas.push(`   📌 ${SERIE_DESC[a.serie]}`);
      }

      // Precio — sin subtotal
      if (precio>0) lineas.push(`   💲 ${fmtMoney(precio)} × ${cant} = *${fmtMoney(precio*cant)}*`);
      if (precioMono>0) lineas.push(`   📦 Monoblock: ${fmtMoney(precioMono)} × ${cant} = *${fmtMoney(precioMono*cant)}*`);
      lineas.push("");
    });
  } else if (c.notas) {
    lineas.push(`📋 *Detalle:*`);
    lineas.push(c.notas);
    lineas.push("");
  }

  if (c.presupuesto) { lineas.push(`📝 ${c.presupuesto}`); lineas.push(""); }
  lineas.push(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);
  lineas.push(`💰 *Total: ${fmtMoney(c.monto)}*`);
  lineas.push("");
  lineas.push(`🙏 _Gracias por elegirnos._`);
  lineas.push(`🏠 _Aberturas Borges — Hacemos las Aberturas de Tu Hogar_`);
  return encodeURIComponent(lineas.join("\n"));
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [role,setRole]         = useState(null);
  const [pin,setPin]           = useState("");
  const [pinRole,setPinRole]   = useState(null);
  const [pinErr,setPinErr]     = useState(false);
  const [clientes,setClientes] = useState([]);
  const [agenda,setAgenda]     = useState([]);
  const [dbReady,setDbReady]   = useState(false);
  const [view,setView]         = useState("lista");
  const [selected,setSelected] = useState(null);
  const [search,setSearch]     = useState("");
  const [filterSt,setFilterSt] = useState("todos");
  const [toast,setToast]       = useState(null);

  // Cargar datos de Supabase al iniciar
  useEffect(()=>{
    cargarDatos();
  },[]);

  const cargarDatos = async () => {
    try {
      const [{ data: cls }, { data: ag }] = await Promise.all([
        supabase.from('clientes').select('*').order('num_cliente'),
        supabase.from('agenda').select('*').order('created_at'),
      ]);
      if (cls) setClientes(cls.map(r => r.data));
      if (ag)  setAgenda(ag.map(r => r.data));
      setDbReady(true);
    } catch(e) {
      console.error('Error cargando datos:', e);
      setClientes(DEMO);
      setDbReady(true);
    }
  };

  const persistClientes = async (nuevos) => {
    setClientes(nuevos);
    try {
      // Upsert todos los clientes
      await supabase.from('clientes').upsert(
        nuevos.map(c => ({ id: c.id, num_cliente: c.numCliente, data: c }))
      );
    } catch(e) { console.error('Error guardando clientes:', e); }
  };

  const deleteCliente = async (id) => {
    const nuevos = clientes.filter(c => c.id !== id);
    setClientes(nuevos);
    try { await supabase.from('clientes').delete().eq('id', id); }
    catch(e) { console.error('Error eliminando:', e); }
  };

  const saveAgenda = async (nuevaAgenda) => {
    setAgenda(nuevaAgenda);
    try {
      // Borrar y reinsertar agenda
      await supabase.from('agenda').delete().neq('id','__none__');
      if (nuevaAgenda.length > 0) {
        await supabase.from('agenda').insert(
          nuevaAgenda.map(v => ({ id: String(v.id), data: v }))
        );
      }
    } catch(e) { console.error('Error guardando agenda:', e); }
  };

  const showToast = (msg,type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),2600); };
  if (!role) {
    if (pinRole === "__agenda__") {
      return (
        <AgendaPublica
          agenda={agenda}
          clientes={clientes}
          onSave={saveAgenda}
          onBack={()=>setPinRole(null)}
          onAddCliente={async nuevo=>{
            const nuevos=[...clientes, nuevo];
            await persistClientes(nuevos);
          }}
        />
      );
    }
    if (pinRole) {
      const r = ROLES[pinRole];
      return (
        <div style={S.center}>
          <img src={LOGO_B64} style={S.pinLogo} alt="AberBorges"/>
          <div style={S.pinBox}>
            <button style={S.ghostBtn} onClick={()=>{setPinRole(null);setPinErr(false);setPin("");}}>← Volver</button>
            <div style={{fontSize:38,marginBottom:6}}>{r.icon}</div>
            <div style={S.pinTitle}>{r.label}</div>
            <div style={S.pinSub}>Ingresá tu PIN de acceso</div>
            <div style={S.pinDots}>
              {[0,1,2,3].map(i=><div key={i} style={{...S.dot,background:pin.length>i?r.color:BORDER}}/>)}
            </div>
            {pinErr&&<div style={S.pinErr}>PIN incorrecto</div>}
            <div style={S.numpad}>
              {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n,i)=>(
                <button key={i} style={n===""?S.numEmpty:S.numBtn} disabled={n===""} onClick={()=>{
                  if(n==="⌫"){setPin(p=>p.slice(0,-1));setPinErr(false);}
                  else if(pin.length<4) setPin(p=>p+n);
                }}>{n}</button>
              ))}
            </div>
            <button style={{...S.primaryBtn,width:"100%",opacity:pin.length===4?1:0.35,background:r.color,color:BG}}
              disabled={pin.length!==4} onClick={()=>{
                if(pin===ROLES[pinRole].pin){setRole(pinRole);setPinErr(false);setPin("");}
                else{setPinErr(true);setPin("");}
              }}>Entrar →</button>
          </div>
        </div>
      );
    }
    return (
      <div style={{...S.center, justifyContent:"flex-start", paddingTop:30, overflowY:"auto", minHeight:"100vh"}}>
        <div style={S.splashWrap}>
          <img src={LOGO_B64} style={S.splashLogo} alt="AberBorges"/>
          <div style={S.splashDivider}/>
          <div style={S.splashBrand}>{BRAND}</div>
          <div style={S.splashSub}>Sistema de gestión de obra</div>
          <div style={S.splashCreator}>Creada por Emanuel Borges</div>
          <div style={{color:"#1e2a3a",fontSize:10,marginTop:4,letterSpacing:"0.04em"}}>
            Última actualización: 02/06/2026 — 01:30 hs
          </div>
        </div>

        <div style={S.roleList}>
          {/* BOTÓN AGENDA — sin PIN */}
          {(()=>{
            const hoy = new Date().toISOString().split("T")[0];
            const pendientes = agenda.filter(v=>!v.realizada && v.fecha<=hoy).length;
            const proximas   = agenda.filter(v=>!v.realizada && v.fecha>hoy).length;
            return (
              <button style={{...S.roleRow, borderColor:`${ACCENT}55`, background:`${ACCENT}10`}}
                onClick={()=>setPinRole("__agenda__")}>
                <div style={{...S.rolePip, background:ACCENT}}/>
                <span style={{fontSize:22}}>📅</span>
                <span style={{...S.roleRowLabel, color:ACCENT}}>Agenda</span>
                <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
                  {pendientes>0&&(
                    <span style={{background:"#ef4444",color:"#fff",fontSize:11,fontWeight:800,
                      borderRadius:99,padding:"2px 8px",minWidth:22,textAlign:"center"}}>
                      {pendientes}
                    </span>
                  )}
                  {proximas>0&&(
                    <span style={{background:ACCENT,color:"#090e18",fontSize:11,fontWeight:800,
                      borderRadius:99,padding:"2px 8px",minWidth:22,textAlign:"center"}}>
                      {proximas}
                    </span>
                  )}
                  <span style={{color:ACCENT,fontSize:20}}>›</span>
                </div>
              </button>
            );
          })()}

          {Object.values(ROLES).map(r=>{
            // Badge para Presupuesto — clientes con status "medido" (para presupuestar)
            const badge = r.key==="presupuestador"
              ? clientes.filter(c=>c.status==="medido"||c.status==="para_presupuestar").length
              : r.key==="fabrica"
              ? clientes.filter(c=>c.status==="aprobado"||c.status==="en_produccion").length
              : 0;
            return (
              <button key={r.key} style={S.roleRow} onClick={()=>{
                if(r.sinPin){ setRole(r.key); }
                else { setPinRole(r.key); }
              }}>
                <div style={{...S.rolePip,background:r.color}}/>
                <span style={{fontSize:22}}>{r.icon}</span>
                <span style={S.roleRowLabel}>{r.label}</span>
                <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
                  {badge>0&&(
                    <span style={{background:r.color,color:"#090e18",fontSize:11,fontWeight:800,
                      borderRadius:99,padding:"2px 8px",minWidth:22,textAlign:"center"}}>
                      {badge}
                    </span>
                  )}
                  <span style={{color:"#1e2a3a",fontSize:20}}>›</span>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{color:"#1a2540",fontSize:11,marginTop:16,marginBottom:30}}>Cada rol tiene su propio PIN</div>
      </div>
    );
  }

  // Pantalla de carga
  if (!dbReady) {
    return (
      <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
        <img src={LOGO_B64} style={{width:90,height:90,borderRadius:20,objectFit:"cover",marginBottom:20,boxShadow:`0 0 30px ${ACCENT}44`}} alt="AB"/>
        <div style={{color:ACCENT,fontWeight:800,fontSize:18,marginBottom:8}}>AberBorges CRM</div>
        <div style={{color:"#475569",fontSize:14}}>Cargando datos...</div>
        <div style={{marginTop:20,width:40,height:40,border:`3px solid ${BORDER}`,borderTop:`3px solid ${ACCENT}`,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }
  const filtered = clientes
    .filter(c=>{
      if(filterSt!=="todos"&&c.status!==filterSt) return false;
      if(!search) return true;
      const q=search.toLowerCase();
      return c.nombre?.toLowerCase().includes(q)||c.telefono?.includes(q)||
             c.direccion?.toLowerCase().includes(q)||String(c.numCliente).includes(q);
    })
    .sort((a,b)=>b.numCliente-a.numCliente);
  const counts = Object.keys(STATUS_META).reduce((acc,s)=>{acc[s]=clientes.filter(c=>c.status===s).length;return acc;},{});
  const roleMeta = ROLES[role];

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;} input,textarea,select{font-family:inherit;}
        @media print { .no-print{display:none!important;} body{background:white!important;} }
      `}</style>

      {toast&&(
        <div style={{...S.toast,background:toast.type==="ok"?"#052e1c":"#450a0a",borderColor:toast.type==="ok"?"#22c55e":"#ef4444"}}>
          {toast.type==="ok"?"✓ ":"✗ "}{toast.msg}
        </div>
      )}

      <header style={S.header} className="no-print">
        <div style={S.hLeft}>
          {view!=="lista"&&<button style={S.backBtn} onClick={()=>{setView("lista");setSelected(null);}}>‹</button>}
          <img src={LOGO_B64} style={S.headerLogo} alt="AB"/>
          <div>
            <div style={S.headerBrand}>{BRAND}</div>
            <div style={{...S.headerRole,color:roleMeta.color}}>{roleMeta.icon} {roleMeta.label}</div>
          </div>
        </div>
        <div style={S.hRight}>
          {view==="lista"&&(
            <button style={{...S.ghostBtn,fontSize:13,padding:"8px 12px"}}
              onClick={()=>setView("agenda")}>📅 Agenda</button>
          )}
          {view==="lista"&&(role==="vendedor"||role==="admin")&&(
            <button style={{...S.primaryBtn,background:ACCENT,color:BG}} onClick={()=>{
              setSelected({id:"n"+Date.now(),numCliente:Math.max(...clientes.map(c=>c.numCliente))+1,
                nombre:"",telefono:"",direccion:"",localidad:"",fechaLlamado:today(),
                observaciones:"",notas:"",obsModo:"",aberturas:[],presupuesto:"",monto:"",status:"nuevo",
                creadoEn:today(),pagos:[],fotos:[]});
              setView("nuevo");
            }}>+ Nuevo</button>
          )}
          <button style={S.ghostBtn} onClick={()=>{setRole(null);setPinRole(null);}}>Salir</button>
        </div>
      </header>

      {view==="lista"&&role==="fabrica"&&(
        <FabricaListView
          clientes={clientes}
          onSelect={c=>{setSelected(c);setView("detalle");}}/>
      )}
      {view==="lista"&&role!=="fabrica"&&(
        <ListView role={role} filtered={filtered} counts={counts} clientes={clientes}
          search={search} setSearch={setSearch} filterSt={filterSt} setFilterSt={setFilterSt}
          onSelect={c=>{setSelected(c);setView("detalle");}}
          agenda={agenda}/>
      )}
      {view==="agenda"&&(
        <AgendaView
          agenda={agenda} clientes={clientes}
          onSave={saveAgenda}
          onBack={()=>setView("lista")}
          onVerCliente={c=>{setSelected(c);setView("detalle");}}
          showToast={showToast}/>
      )}
      {view==="nuevo"&&(
        <NewView cliente={selected}
          onSave={async data=>{
            const ex=clientes.find(c=>c.id===data.id);
            const nuevos=ex?clientes.map(c=>c.id===data.id?data:c):[...clientes,data];
            await persistClientes(nuevos);
            setView("lista"); showToast(`Cliente #${data.numCliente} guardado`);
          }}
          onCancel={()=>setView("lista")}/>
      )}
      {view==="detalle"&&selected&&(
        <DetailView cliente={selected} role={role}
          agenda={agenda} onSaveAgenda={saveAgenda}
          onUpdate={async u=>{
            const nuevos=clientes.map(c=>c.id===u.id?u:c);
            await persistClientes(nuevos);
            setSelected(u); showToast("Guardado ✓");
          }}
          onDelete={async id=>{
            await deleteCliente(id);
            setView("lista"); showToast("Eliminado","err");
          }}
          showToast={showToast}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LISTA
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// AGENDA DE VISITAS
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// AGENDA PÚBLICA — sin PIN
// ═══════════════════════════════════════════════════════════
function AgendaPublica({ agenda, clientes, onSave, onBack, onAddCliente }) {
  const ahora   = new Date();
  const hoy     = ahora.toISOString().split("T")[0];
  const manana  = new Date(ahora.getTime()+86400000).toISOString().split("T")[0];
  const [modo, setModo]               = useState("ver"); // "ver"|"nueva"|"cliente"
  const [form, setForm]               = useState({ clienteId:"", fecha:hoy, hora:"09:00", nota:"" });
  const [formCliente, setFormCliente] = useState({ nombre:"", telefono:"", direccion:"", localidad:"" });
  const [searchTel, setSearchTel]     = useState("");
  const [err, setErr]                 = useState("");

  const visitasHoy    = agenda.filter(v=>v.fecha===hoy&&!v.realizada).sort((a,b)=>a.hora.localeCompare(b.hora));
  const visitasManana = agenda.filter(v=>v.fecha===manana&&!v.realizada).sort((a,b)=>a.hora.localeCompare(b.hora));
  const proximas      = agenda.filter(v=>v.fecha>manana&&!v.realizada).sort((a,b)=>(a.fecha+a.hora).localeCompare(b.fecha+b.hora)).slice(0,5);
  const pasadas       = agenda.filter(v=>v.fecha<hoy&&!v.realizada).sort((a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora));
  const realizadas    = agenda.filter(v=>v.realizada).sort((a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora));

  // Buscar clientes por teléfono o nombre
  const clientesFiltrados = searchTel
    ? clientes.filter(c=>c.telefono?.includes(searchTel)||c.nombre?.toLowerCase().includes(searchTel.toLowerCase()))
    : clientes;

  const guardarCliente = () => {
    if (!formCliente.nombre||!formCliente.telefono) { setErr("Nombre y teléfono son obligatorios"); return; }
    const nuevo = {
      id:"n"+Date.now(), numCliente:Math.max(0,...clientes.map(c=>c.numCliente||0))+1,
      ...formCliente, fechaLlamado:hoy, creadoEn:hoy,
      status:"nuevo", obsModo:"", notas:"", presupuesto:"", monto:"", pagos:[], fotos:[], aberturas:[]
    };
    onAddCliente&&onAddCliente(nuevo);
    setFormCliente({ nombre:"", telefono:"", direccion:"", localidad:"" });
    setForm(p=>({...p,clienteId:nuevo.id}));
    setModo("nueva"); setErr("");
  };
  const fmtFecha = d => { if(!d) return ""; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };

  const agregar = () => {
    if (!form.clienteId) { setErr("Seleccioná un cliente"); return; }
    if (!form.fecha)     { setErr("Ingresá la fecha"); return; }
    const c = clientes.find(cl=>cl.id===form.clienteId)||{};
    const nueva = {
      ...form, id: Date.now(),
      clienteNombre:    c.nombre||"",
      clienteTelefono:  c.telefono||"",
      clienteDireccion: (c.direccion||"")+(c.localidad?`, ${c.localidad}`:""),
    };
    onSave([...agenda, nueva]);
    setForm({ clienteId:"", fecha:hoy, hora:"09:00", nota:"" });
    setErr(""); setModo("ver");
  };

  const eliminar        = id => onSave(agenda.filter(v=>v.id!==id));
  const marcarVisitada  = id => onSave(agenda.map(v=>v.id===id?{...v,realizada:true}:v));
  const desmarcar       = id => onSave(agenda.map(v=>v.id===id?{...v,realizada:false}:v));
  const [verRealizadas, setVerRealizadas] = useState(false);

  const Burbuja = ({ v }) => {
    const dt=new Date(v.fecha+"T"+v.hora);
    const diffMin=Math.floor((dt-ahora)/60000);
    const pasada=diffMin<0;
    const urgente=!pasada&&diffMin<=60;
    const bColor=urgente?"#ef4444":pasada?"#334155":"#00b4d8";
    const bgColor=urgente?"#1a0a0a":pasada?"#0a0e18":"#0d1626";
    const border=urgente?"#ef444466":pasada?"#1e2535":"#00b4d844";
    return (
      <div style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-end",opacity:pasada?0.5:1}}>
        <div style={{width:38,height:38,background:"#0c2233",borderRadius:"50%",border:`2px solid ${bColor}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🕐</div>
        <div style={{background:bgColor,border:`1px solid ${border}`,borderRadius:"18px 18px 18px 4px",padding:"10px 14px",flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontWeight:800,color:bColor,fontSize:15}}>{v.hora} hs</span>
            {urgente&&<span style={{background:"#ef444422",color:"#ef4444",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,border:"1px solid #ef444444"}}>{diffMin<=0?"Ahora":"En "+diffMin+" min"}</span>}
            {pasada&&<span style={{background:"#1e253588",color:"#475569",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Pasada</span>}
          </div>
          {v.clienteNombre&&<div style={{fontWeight:700,color:"#f1f5f9",fontSize:14,marginBottom:3}}>{v.clienteNombre}</div>}
          {v.clienteTelefono&&<a href={`tel:${v.clienteTelefono}`} style={{display:"block",color:"#00b4d8",fontSize:13,marginBottom:2,textDecoration:"none"}}>📞 {v.clienteTelefono}</a>}
          {v.clienteDireccion&&<div style={{color:"#64748b",fontSize:12,marginBottom:2}}>📍 {v.clienteDireccion}</div>}
          {v.nota&&<div style={{color:"#475569",fontSize:11,fontStyle:"italic",marginTop:3}}>"{v.nota}"</div>}
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            {v.clienteTelefono&&(
              <a href={`https://wa.me/598${v.clienteTelefono.replace(/\D/g,"")}?text=${encodeURIComponent(`Hola ${v.clienteNombre||""}, te confirmo la visita de hoy a las ${v.hora} hs. Saludos, Aberturas Borges.`)}`}
                target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:5,background:"#0d2b22",color:"#25d366",border:"1px solid #128c7e55",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,textDecoration:"none"}}>
                💬 WhatsApp
              </a>
            )}
            {!v.realizada && (
              <button style={{background:"#052e1c",border:"1px solid #10b98155",color:"#34d399",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>marcarVisitada(v.id)}>✓ Realizada</button>
            )}
            {v.realizada && (
              <button style={{background:"transparent",border:"1px solid #1e2535",color:"#64748b",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer"}} onClick={()=>desmarcar(v.id)}>↩ Desmarcar</button>
            )}
            <button style={{background:"transparent",border:"1px solid #450a0a",color:"#f87171",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer"}} onClick={()=>eliminar(v.id)}>✕ Quitar</button>
          </div>
        </div>
      </div>
    );
  };

  const noHayNada=visitasHoy.length===0&&visitasManana.length===0&&proximas.length===0&&pasadas.length===0&&realizadas.length===0;

  return (
    <div style={{minHeight:"100vh",background:"#090e18",fontFamily:"'DM Sans','Segoe UI',sans-serif",paddingBottom:40}}>
      <header style={{background:"#0d1626",borderBottom:"1px solid #162035",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button style={{background:"none",border:"none",color:"#00b4d8",fontSize:26,cursor:"pointer",padding:"0 4px",lineHeight:1}} onClick={onBack}>‹</button>
          <div style={{fontSize:22,color:"#00b4d8"}}>⬡</div>
          <div>
            <div style={{fontWeight:900,fontSize:17,color:"#f1f5f9"}}>Agenda</div>
            <div style={{fontSize:11,color:"#475569"}}>Aberturas Borges</div>
          </div>
        </div>
        <button style={{background:modo!=="ver"?"#1e2535":"#00b4d8",color:modo!=="ver"?"#64748b":"#090e18",border:`1px solid ${modo!=="ver"?"#2d3748":"#00b4d8"}`,borderRadius:10,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer"}}
          onClick={()=>{setModo(modo!=="ver"?"ver":"nueva");setErr("");}}>
          {modo!=="ver"?"✕ Cancelar":"+ Nueva visita"}
        </button>
      </header>

      <div style={{padding:"16px 16px 0",maxWidth:500,margin:"0 auto"}}>

        {/* BUSCADOR SIEMPRE VISIBLE */}
        <div style={{marginBottom:16}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16,color:"#475569"}}>🔍</span>
            <input type="tel" style={{width:"100%",background:"#0d1626",border:`1px solid ${searchTel?"#00b4d8":"#162035"}`,borderRadius:12,padding:"11px 12px 11px 38px",color:"#e2e8f0",fontSize:14,outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}}
              placeholder="Buscar cliente por teléfono o nombre..."
              value={searchTel}
              onChange={e=>{setSearchTel(e.target.value);setForm(p=>({...p,clienteId:""}));}}/>
            {searchTel&&(
              <button style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#475569",fontSize:18,cursor:"pointer",lineHeight:1}}
                onClick={()=>{setSearchTel("");setForm(p=>({...p,clienteId:""}));}}>✕</button>
            )}
          </div>

          {/* Resultados de búsqueda */}
          {searchTel&&clientesFiltrados.length>0&&(
            <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:12,marginTop:6,overflow:"hidden"}}>
              {clientesFiltrados.slice(0,5).map((c,i)=>(
                <div key={c.id} style={{padding:"12px 14px",borderBottom:i<clientesFiltrados.length-1?"1px solid #0c1525":"none"}}>
                  <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14}}>{c.nombre}</div>
                  <div style={{display:"flex",gap:12,marginTop:4,flexWrap:"wrap"}}>
                    {c.telefono&&<span style={{color:"#00b4d8",fontSize:13}}>📞 {c.telefono}</span>}
                    {c.direccion&&<span style={{color:"#64748b",fontSize:12}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</span>}
                  </div>
                  {/* Visitas de este cliente */}
                  {agenda.filter(v=>v.clienteId===c.id).length>0&&(
                    <div style={{marginTop:6}}>
                      {agenda.filter(v=>v.clienteId===c.id).sort((a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora)).slice(0,3).map(v=>(
                        <div key={v.id} style={{fontSize:11,color:v.realizada?"#34d399":"#94a3b8",marginTop:2}}>
                          {v.realizada?"✅":"📅"} {v.fecha.split("-").reverse().join("/")} {v.hora}hs
                          {v.nota?` — "${v.nota}"` :""}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {searchTel&&clientesFiltrados.length===0&&(
            <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:12,padding:"12px 14px",marginTop:6,color:"#475569",fontSize:13}}>
              No se encontró ningún cliente con ese teléfono.
            </div>
          )}
        </div>

        {/* FORMULARIO NUEVO CLIENTE */}
        {modo==="cliente"&&(
          <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:14,padding:"16px",marginBottom:16}}>
            <div style={{fontWeight:800,fontSize:15,color:"#f1f5f9",marginBottom:14}}>👤 Nuevo cliente</div>
            {[["Nombre *","nombre","text","Juan Pérez"],["Teléfono *","telefono","tel","09X XXX XXX"],["Dirección","direccion","text","Calle y número"],["Localidad","localidad","text","Montevideo"]].map(([lbl,key,type,ph])=>(
              <div key={key} style={{marginBottom:10}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</label>
                <input type={type} style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                  placeholder={ph} value={formCliente[key]||""} onChange={e=>setFormCliente(p=>({...p,[key]:e.target.value}))}/>
              </div>
            ))}
            {err&&<div style={{color:"#f87171",fontSize:13,marginBottom:10}}>⚠️ {err}</div>}
            <div style={{display:"flex",gap:10}}>
              <button style={{flex:1,background:"transparent",border:"1px solid #1e2535",borderRadius:10,padding:"11px 0",color:"#64748b",fontWeight:600,fontSize:13,cursor:"pointer"}} onClick={()=>{setModo("nueva");setErr("");}}>← Volver</button>
              <button style={{flex:2,background:"#00b4d8",color:"#090e18",border:"none",borderRadius:10,padding:"11px 0",fontWeight:800,fontSize:14,cursor:"pointer"}} onClick={guardarCliente}>Crear cliente ›</button>
            </div>
          </div>
        )}

        {modo==="nueva"&&(
          <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:14,padding:"16px",marginBottom:16}}>
            <div style={{fontWeight:800,fontSize:15,color:"#f1f5f9",marginBottom:14}}>➕ Agendar visita</div>

            {/* BUSCADOR POR TELÉFONO */}
            <div style={{marginBottom:10}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Buscar por teléfono o nombre</label>
              <input type="tel" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                placeholder="09X XXX XXX o nombre..." value={searchTel} onChange={e=>{setSearchTel(e.target.value);setForm(p=>({...p,clienteId:""}));}}/>
            </div>

            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Cliente *</label>
              <select style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                value={form.clienteId} onChange={e=>{setForm(p=>({...p,clienteId:e.target.value}));setErr("");}}>
                <option value="">— seleccionar cliente —</option>
                {[...clientesFiltrados].sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(c=>(
                  <option key={c.id} value={c.id}>#{c.numCliente} — {c.nombre} {c.telefono?`· ${c.telefono}`:""}</option>
                ))}
              </select>
              <button style={{marginTop:8,background:"transparent",border:"1px solid #00b4d844",borderRadius:8,padding:"6px 12px",color:"#00b4d8",fontSize:12,fontWeight:600,cursor:"pointer"}}
                onClick={()=>{setModo("cliente");setErr("");}}>
                + Crear nuevo cliente
              </button>
            </div>
            {form.clienteId&&(()=>{
              const c=clientes.find(cl=>cl.id===form.clienteId);
              if(!c) return null;
              return (
                <div style={{background:"#090e18",border:"1px solid #162035",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
                  <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14}}>{c.nombre}</div>
                  {c.telefono&&<div style={{color:"#00b4d8",fontSize:13,marginTop:2}}>📞 {c.telefono}</div>}
                  {c.direccion&&<div style={{color:"#64748b",fontSize:12,marginTop:1}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>}
                </div>
              );
            })()}
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <div style={{flex:1}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Fecha *</label>
                <input type="date" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                  value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))}/>
              </div>
              <div style={{flex:1}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Hora *</label>
                <input type="time" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                  value={form.hora} onChange={e=>setForm(p=>({...p,hora:e.target.value}))}/>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Nota (opcional)</label>
              <input style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                placeholder="Llevar metro, confirmar antes..." value={form.nota} onChange={e=>setForm(p=>({...p,nota:e.target.value}))}/>
            </div>
            {err&&<div style={{color:"#f87171",fontSize:13,marginBottom:10}}>⚠️ {err}</div>}
            <button style={{background:"#00b4d8",color:"#090e18",border:"none",borderRadius:10,padding:"12px 0",fontWeight:800,fontSize:14,cursor:"pointer",width:"100%"}} onClick={agregar}>
              Guardar visita ✓
            </button>
          </div>
        )}
        {noHayNada&&modo==="ver"?(
          <div style={{textAlign:"center",color:"#334155",padding:"60px 0",fontSize:15}}>
            No hay visitas agendadas.<br/>
            <span style={{fontSize:13,color:"#1e2a3a"}}>Tocá "+ Nueva visita" para agregar.</span>
          </div>
        ):(
          <>
            {visitasHoy.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"#00b4d8",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>📅 Hoy — {fmtFecha(hoy)} ({visitasHoy.length})</div>
                {visitasHoy.map(v=><Burbuja key={v.id} v={v}/>)}
              </div>
            )}
            {visitasManana.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>📌 Mañana — {fmtFecha(manana)} ({visitasManana.length})</div>
                {visitasManana.map(v=><Burbuja key={v.id} v={v}/>)}
              </div>
            )}
            {proximas.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>Próximas visitas</div>
                {proximas.map(v=>(
                  <div key={v.id} style={{background:"#0d1626",border:"1px solid #162035",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14}}>{fmtFecha(v.fecha)} — {v.hora} hs</div>
                      {v.clienteNombre&&<div style={{color:"#94a3b8",fontSize:13,marginTop:2}}>{v.clienteNombre}</div>}
                      {v.clienteTelefono&&<div style={{color:"#00b4d8",fontSize:12,marginTop:2}}>📞 {v.clienteTelefono}</div>}
                      {v.clienteDireccion&&<div style={{color:"#64748b",fontSize:12,marginTop:1}}>📍 {v.clienteDireccion}</div>}
                    </div>
                    <button style={{background:"transparent",border:"1px solid #450a0a",color:"#f87171",borderRadius:8,padding:"4px 8px",fontSize:11,cursor:"pointer",flexShrink:0,marginLeft:8}} onClick={()=>eliminar(v.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* REALIZADAS */}
            {pasadas.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>
                  ⚠️ Visitas pasadas sin realizar ({pasadas.length})
                </div>
                {pasadas.map(v=><Burbuja key={v.id} v={v}/>)}
              </div>
            )}

            {realizadas.length>0&&(
              <div style={{marginBottom:20}}>
                <button style={{display:"flex",alignItems:"center",gap:8,background:"transparent",border:"none",cursor:"pointer",padding:"0 0 10px"}} onClick={()=>setVerRealizadas(v=>!v)}>
                  <div style={{fontSize:12,fontWeight:700,color:"#34d399",textTransform:"uppercase",letterSpacing:"0.07em"}}>
                    ✅ Realizadas ({realizadas.length})
                  </div>
                  <span style={{color:"#475569",fontSize:14}}>{verRealizadas?"▲":"▼"}</span>
                </button>
                {verRealizadas&&realizadas.map(v=>(
                  <div key={v.id} style={{background:"#052e1c22",border:"1px solid #10b98133",borderRadius:12,padding:"12px 14px",marginBottom:8,opacity:0.7}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontWeight:700,color:"#34d399",fontSize:13}}>✅ {fmtFecha(v.fecha)} — {v.hora} hs</div>
                        {v.clienteNombre&&<div style={{color:"#94a3b8",fontSize:13,marginTop:2}}>{v.clienteNombre}</div>}
                        {v.clienteTelefono&&<div style={{color:"#475569",fontSize:12,marginTop:1}}>📞 {v.clienteTelefono}</div>}
                      </div>
                      <button style={{background:"transparent",border:"1px solid #1e2535",color:"#64748b",borderRadius:8,padding:"4px 8px",fontSize:11,cursor:"pointer",flexShrink:0,marginLeft:8}} onClick={()=>desmarcar(v.id)}>↩</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AgendaView({ agenda, clientes, onSave, onBack, onVerCliente, showToast }) {
  const [form, setForm] = useState({ clienteId:"", fecha:today(), hora:"09:00", nota:"" });
  const [modo, setModo] = useState("ver"); // "ver" | "nueva"

  const ahora = new Date();
  const fmtFecha = d => { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };

  // Ordenar por fecha+hora
  const ordenada = [...agenda].sort((a,b)=> (a.fecha+a.hora).localeCompare(b.fecha+b.hora));
  const proximas = ordenada.filter(v => new Date(v.fecha+"T"+v.hora) >= ahora);
  const pasadas  = ordenada.filter(v => new Date(v.fecha+"T"+v.hora) <  ahora);

  // Alerta: visitas en las próximas 24hs
  const hoy = new Date();
  const en24hs = proximas.filter(v => {
    const d = new Date(v.fecha+"T"+v.hora);
    return (d - hoy) <= 24*60*60*1000;
  });

  const agregar = () => {
    if (!form.clienteId || !form.fecha || !form.hora) { showToast("Completá cliente, fecha y hora","err"); return; }
    const c = clientes.find(cl=>cl.id===form.clienteId)||{};
    const nueva = { 
      ...form, 
      id: Date.now(),
      clienteNombre: c.nombre||"",
      clienteTelefono: c.telefono||"",
      clienteDireccion: (c.direccion||"")+(c.localidad?`, ${c.localidad}`:""),
    };
    onSave([...agenda, nueva]);
    setForm({ clienteId:"", fecha:today(), hora:"09:00", nota:"" });
    setModo("ver");
    showToast("Visita agendada ✓");
  };

  const eliminar = id => { onSave(agenda.filter(v=>v.id!==id)); showToast("Visita eliminada","err"); };

  const VisitaCard = ({ v, pasada }) => {
    const c = clientes.find(cl=>cl.id===v.clienteId) || {};
    const dt = new Date(v.fecha+"T"+v.hora);
    const diffMs = dt - ahora;
    const diffMin = Math.floor(diffMs / 60000);
    const urgent = !pasada && diffMin <= 60 && diffMin >= 0;
    const muyUrgente = !pasada && diffMin <= 60 && diffMin >= 0;

    return (
      <div style={{...S.card, borderColor: muyUrgente?"#ef4444":pasada?"#1e2535":BORDER, opacity:pasada?0.6:1}}>
        {muyUrgente && (
          <div style={{background:"#450a0a",borderRadius:8,padding:"6px 10px",marginBottom:10,fontSize:12,color:"#fca5a5",fontWeight:700}}>
            ⚠️ ¡En {diffMin <= 0 ? "este momento":"menos de "+diffMin+" min"}!
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>{c.nombre||"Cliente no encontrado"}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>#{c.numCliente}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:700,color:ACCENT,fontSize:14}}>📅 {fmtFecha(v.fecha)}</div>
            <div style={{fontWeight:800,color:"#f1f5f9",fontSize:18}}>🕐 {v.hora}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"12px 20px",flexWrap:"wrap",fontSize:13,color:"#94a3b8",marginBottom:8}}>
          {c.telefono && <span>📞 <b style={{color:"#f1f5f9"}}>{c.telefono}</b></span>}
          {c.direccion && <span>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</span>}
        </div>
        {v.nota && <div style={{fontSize:13,color:"#64748b",fontStyle:"italic",marginBottom:8}}>"{v.nota}"</div>}
        <div style={{display:"flex",gap:8,marginTop:4}}>
          {c.id && <button style={{...S.primaryBtn,fontSize:12,padding:"7px 14px"}} onClick={()=>onVerCliente(c)}>Ver cliente</button>}
          {c.telefono && <button style={{...S.waBtn,flex:1,padding:"7px 0",fontSize:12}} onClick={()=>window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(`Hola ${c.nombre}, te recuerdo que tengo una visita programada para el ${fmtFecha(v.fecha)} a las ${v.hora}. Saludos, Aberturas Borges.`)}`)}>💬 WhatsApp</button>}
          <button style={{...S.ghostBtn,fontSize:12,padding:"7px 12px",color:"#f87171",borderColor:"#450a0a"}} onClick={()=>eliminar(v.id)}>✕</button>
        </div>
      </div>
    );
  };

  return (
    <div style={S.page}>
      {en24hs.length > 0 && (
        <div style={{background:"#2d1a00",border:"1px solid #f59e0b55",borderRadius:14,padding:"12px 16px",marginTop:12,marginBottom:4}}>
          <div style={{fontWeight:800,color:"#f59e0b",fontSize:14,marginBottom:6}}>⚠️ Visitas en las próximas 24 horas</div>
          {en24hs.map(v=>{
            const c=clientes.find(cl=>cl.id===v.clienteId)||{};
            return <div key={v.id} style={{fontSize:13,color:"#fcd34d",marginBottom:4}}>🕐 {v.hora} — <b>{c.nombre||"?"}</b> — 📞 {c.telefono||"?"} — 📍 {c.direccion||"?"}</div>;
          })}
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"14px 0 8px"}}>
        <div style={{fontWeight:800,fontSize:17,color:"#f1f5f9"}}>📅 Agenda de visitas</div>
        <button style={{...S.primaryBtn,background:ACCENT,color:BG}} onClick={()=>setModo(modo==="nueva"?"ver":"nueva")}>
          {modo==="nueva"?"✕ Cancelar":"+ Nueva visita"}
        </button>
      </div>

      {modo==="nueva" && (
        <div style={S.card}>
          <div style={S.cardTitle}>➕ Agendar visita</div>
          <div style={{marginBottom:12}}>
            <label style={S.lbl}>Cliente *</label>
            <select style={S.sel} value={form.clienteId} onChange={e=>setForm(p=>({...p,clienteId:e.target.value}))}>
              <option value="">— seleccionar cliente —</option>
              {[...clientes].sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(c=>(
                <option key={c.id} value={c.id}>#{c.numCliente} — {c.nombre} ({c.localidad||c.direccion||""})</option>
              ))}
            </select>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            <div style={{flex:1}}>
              <label style={S.lbl}>Fecha *</label>
              <input style={S.inp} type="date" value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))}/>
            </div>
            <div style={{flex:1}}>
              <label style={S.lbl}>Hora *</label>
              <input style={S.inp} type="time" value={form.hora} onChange={e=>setForm(p=>({...p,hora:e.target.value}))}/>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={S.lbl}>Nota (opcional)</label>
            <input style={S.inp} placeholder="Ej: traer metro, confirmar por WhatsApp..." value={form.nota} onChange={e=>setForm(p=>({...p,nota:e.target.value}))}/>
          </div>
          {form.clienteId && (()=>{
            const c=clientes.find(cl=>cl.id===form.clienteId);
            if(!c) return null;
            return (
              <div style={{background:BG,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
                <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>Datos del cliente seleccionado:</div>
                <div style={{fontWeight:700,color:"#f1f5f9"}}>{c.nombre}</div>
                <div style={{fontSize:13,color:ACCENT}}>📞 {c.telefono}</div>
                <div style={{fontSize:13,color:"#64748b"}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>
              </div>
            );
          })()}
          <button style={{...S.primaryBtn,width:"100%"}} onClick={agregar}>Guardar visita ✓</button>
        </div>
      )}

      {proximas.length > 0 && (
        <div>
          <div style={{fontSize:12,fontWeight:700,color:ACCENT,textTransform:"uppercase",letterSpacing:"0.06em",margin:"16px 0 8px"}}>📌 Próximas visitas ({proximas.length})</div>
          {proximas.map(v=><VisitaCard key={v.id} v={v}/>)}
        </div>
      )}

      {pasadas.length > 0 && (
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.06em",margin:"16px 0 8px"}}>Visitas pasadas ({pasadas.length})</div>
          {pasadas.map(v=><VisitaCard key={v.id} v={v} pasada/>)}
        </div>
      )}

      {agenda.length === 0 && modo!=="nueva" && (
        <div style={S.empty}>No hay visitas agendadas.<br/>Tocá "+ Nueva visita" para agregar.</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FABRICA LIST VIEW — dos secciones: urgentes y con fecha
// ═══════════════════════════════════════════════════════════
function FabricaListView({ clientes, onSelect }) {
  const hoy = new Date().toISOString().split("T")[0];

  // Solo clientes en estado aprobado o en_produccion
  const enFab = clientes.filter(c=>c.status==="aprobado"||c.status==="en_produccion");

  // Sin fecha de entrega = para fabricar ya
  const urgentes = enFab
    .filter(c=>!c.fechaEntrega)
    .sort((a,b)=>(a.nombre||"").localeCompare(b.nombre||""));

  // Con fecha de entrega = programadas, ordenadas por fecha
  const programadas = enFab
    .filter(c=>!!c.fechaEntrega)
    .sort((a,b)=>a.fechaEntrega.localeCompare(b.fechaEntrega));

  const fmtFecha = d => { if(!d) return ""; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };

  const diasRestantes = fecha => {
    if(!fecha) return null;
    const diff = Math.ceil((new Date(fecha+"T00:00:00") - new Date()) / 86400000);
    return diff;
  };

  const Card = ({c}) => {
    const sm = STATUS_META[c.status]||{};
    const nAb = (c.aberturas||[]).reduce((s,a)=>s+(parseInt(a.cantidad)||0),0);
    const dias = diasRestantes(c.fechaEntrega);
    const diasColor = dias===null?ACCENT : dias<=3?"#ef4444" : dias<=7?"#f59e0b" : "#34d399";

    return (
      <div style={{background:"#0d1626",border:`1px solid ${sm.color||ACCENT}33`,borderRadius:14,
        padding:"14px 16px",marginBottom:10,cursor:"pointer",borderLeft:`3px solid ${sm.color||ACCENT}`}}
        onClick={()=>onSelect(c)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>{c.nombre}</div>
            {c.direccion&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>}
            {c.telefono&&<div style={{fontSize:12,color:ACCENT,marginTop:2}}>📞 {c.telefono}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,fontWeight:700,color:sm.color||ACCENT,background:(sm.color||ACCENT)+"22",
              borderRadius:99,padding:"3px 10px",marginBottom:4}}>
              {sm.icon} {sm.label}
            </div>
            {nAb>0&&<div style={{fontSize:11,color:"#94a3b8"}}>🪟 {nAb} abertura{nAb!==1?"s":""}</div>}
          </div>
        </div>
        {c.fechaEntrega&&(
          <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8,
            background:diasColor+"15",border:`1px solid ${diasColor}44`,borderRadius:8,padding:"6px 10px"}}>
            <span style={{fontSize:13}}>📅</span>
            <span style={{fontWeight:700,color:diasColor,fontSize:13}}>
              Entrega: {fmtFecha(c.fechaEntrega)}
            </span>
            {dias!==null&&(
              <span style={{fontSize:11,color:diasColor,marginLeft:"auto"}}>
                {dias===0?"¡Hoy!":dias<0?`${Math.abs(dias)}d vencida`:`${dias}d`}
              </span>
            )}
          </div>
        )}
        {(c.aberturas||[]).slice(0,2).map((ab,i)=>{
          const t=TIPOS.find(t=>t.id===ab.tipo);
          return (
            <div key={i} style={{fontSize:11,color:"#475569",marginTop:4}}>
              · {t?.label||ab.tipo} {ab.ancho&&ab.alto?`${ab.ancho}×${ab.alto}cm`:""} {ab.cantidad>1?`×${ab.cantidad}`:""}
            </div>
          );
        })}
        {(c.aberturas||[]).length>2&&(
          <div style={{fontSize:11,color:"#334155",marginTop:2}}>
            + {(c.aberturas||[]).length-2} más...
          </div>
        )}
      </div>
    );
  };

  const empty = enFab.length===0;

  return (
    <div style={{padding:"12px 12px 40px",maxWidth:500,margin:"0 auto"}}>
      {empty&&(
        <div style={{textAlign:"center",color:"#334155",padding:"60px 0",fontSize:15}}>
          No hay obras para fabricar.<br/>
          <span style={{fontSize:13,color:"#1e2a3a"}}>Aparecerán aquí cuando se apruebe un presupuesto.</span>
        </div>
      )}

      {/* URGENTES — sin fecha */}
      {urgentes.length>0&&(
        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,fontWeight:800,color:"#ef4444",textTransform:"uppercase",
            letterSpacing:"0.07em",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            🔴 Para fabricar ya
            <span style={{background:"#ef444422",color:"#ef4444",borderRadius:99,
              padding:"1px 8px",fontSize:11}}>{urgentes.length}</span>
          </div>
          {urgentes.map(c=><Card key={c.id} c={c}/>)}
        </div>
      )}

      {/* PROGRAMADAS — con fecha */}
      {programadas.length>0&&(
        <div>
          <div style={{fontSize:12,fontWeight:800,color:"#34d399",textTransform:"uppercase",
            letterSpacing:"0.07em",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            📅 Con fecha de entrega
            <span style={{background:"#34d39922",color:"#34d399",borderRadius:99,
              padding:"1px 8px",fontSize:11}}>{programadas.length}</span>
          </div>
          {programadas.map(c=><Card key={c.id} c={c}/>)}
        </div>
      )}
    </div>
  );
}

function ListView({role,filtered,counts,clientes,search,setSearch,filterSt,setFilterSt,onSelect,agenda}){
  const activos=clientes.filter(c=>c.status!=="entregado").length;
  const pagado=clientes.reduce((s,c)=>(c.pagos||[]).reduce((ps,p)=>ps+(parseFloat(p.monto)||0),s),0);
  const sf=role==="presupuestador"||role==="admin";
  return (
    <div style={S.page}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {[["Clientes",clientes.length,"#f1f5f9"],["Activos",activos,ACCENT],
          ["En curso",(counts.aprobado||0)+(counts.en_produccion||0),"#34d399"],
          sf?["Cobrado",fmtMoney(pagado),"#34d399"]:["Pendientes",counts.nuevo||0,"#f59e0b"]
        ].map(([l,v,c])=>(
          <div key={l} style={S.kpi}>
            <div style={{...S.kpiN,color:c,fontSize:typeof v==="string"?12:20}}>{v}</div>
            <div style={S.kpiL}>{l}</div>
          </div>
        ))}
      </div>
      <div style={S.pipeline}>
        {Object.entries(STATUS_META).map(([k,v])=>(
          <div key={k} style={S.pipeItem} onClick={()=>setFilterSt(filterSt===k?"todos":k)}>
            <div style={{...S.pipeDot,background:filterSt===k?v.color:CARD,borderColor:v.color,
              boxShadow:filterSt===k?`0 0 10px ${v.color}88`:"none"}}>{counts[k]||0}</div>
            <div style={{fontSize:13,marginTop:2}}>{v.icon}</div>
          </div>
        ))}
      </div>
      <div style={S.searchBox}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span>
        <input style={S.searchInput} placeholder="Nombre, teléfono, #cliente..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {search&&<button style={{...S.ghostBtn,position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",padding:"2px 6px",fontSize:12}} onClick={()=>setSearch("")}>✕</button>}
      </div>
      {filterSt!=="todos"&&(
        <div style={{...S.activeFilt,borderColor:STATUS_META[filterSt].color,color:STATUS_META[filterSt].color}}>
          {STATUS_META[filterSt].icon} {STATUS_META[filterSt].label}
          <button style={{...S.ghostBtn,marginLeft:8,fontSize:11,padding:"2px 8px"}} onClick={()=>setFilterSt("todos")}>✕ quitar</button>
        </div>
      )}
      <div style={{paddingBottom:40}}>
        {filtered.length===0
          ? <div style={S.empty}>{search?"Sin resultados":"No hay clientes en este estado"}</div>
          : filtered.map(c=><ClientCard key={c.id} c={c} role={role} onClick={()=>onSelect(c)}/>)
        }
      </div>
    </div>
  );
}

function ClientCard({c,role,onClick}){
  const sm=STATUS_META[c.status];
  const saldo=(role==="presupuestador"||role==="admin")?calcSaldo(c):null;
  const pagado=(c.pagos||[]).reduce((s,p)=>s+(parseFloat(p.monto)||0),0);
  const pct=c.monto?Math.min(100,(pagado/(parseFloat(c.monto)||1))*100):0;
  const nf=(c.fotos||[]).length;
  const nAb=(c.aberturas||[]).reduce((s,a)=>s+(parseInt(a.cantidad)||0),0);
  return (
    <div style={S.clientCard} onClick={onClick}>
      <div style={{...S.cardBar,background:sm.color}}/>
      <div style={S.cardContent}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div style={S.cardNum}>#{c.numCliente}</div>
          <span style={{...S.badge,background:sm.color+"18",color:sm.color,borderColor:sm.color+"44"}}>{sm.icon} {sm.label}</span>
        </div>
        <div style={S.cardName}>{c.nombre}</div>
        <div style={S.cardAddr}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>
        <div style={S.cardMeta}>
          <span>📞 {c.telefono}</span>
          {c.fechaMedicion&&<span>📏 {fmt(c.fechaMedicion)}</span>}
          {nAb>0&&<span style={{color:ACCENT}}>🪟 {nAb}</span>}
          {nf>0&&<span style={{color:"#a78bfa"}}>📷 {nf}</span>}
          {saldo!==null&&c.monto&&["aprobado","en_produccion","entregado"].includes(c.status)&&<span style={{fontWeight:700,color:saldo===0?"#34d399":saldo>0?"#f59e0b":ACCENT}}>
            {saldo===0?"✅ Saldado":saldo>0?`Debe ${fmtMoney(saldo)}`:`A favor ${fmtMoney(Math.abs(saldo))}`}
          </span>}
        </div>
        {saldo!==null&&c.monto&&["aprobado","en_produccion","entregado"].includes(c.status)&&(
          <div style={S.progressWrap}><div style={{...S.progressBar,width:`${pct}%`}}/></div>
        )}
      </div>
      <div style={{display:"flex",alignItems:"center",padding:"0 14px",color:"#1e2a3a",fontSize:22}}>›</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NUEVO CLIENTE
// ═══════════════════════════════════════════════════════════
function NewView({cliente,onSave,onCancel}){
  const [f,setF]=useState(cliente);
  const ok=f.nombre&&f.telefono;
  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.cardTitle}>➕ Nuevo cliente</div>
        <Field label="Nombre completo *" value={f.nombre} onChange={v=>setF(p=>({...p,nombre:v}))} placeholder="Juan Pérez"/>
        <Field label="Teléfono *" value={f.telefono} onChange={v=>setF(p=>({...p,telefono:v}))} type="tel" placeholder="3515550000"/>
        <Field label="Dirección de obra" value={f.direccion} onChange={v=>setF(p=>({...p,direccion:v}))} placeholder="Av. Colón 1240"/>
        <Field label="Localidad / Barrio" value={f.localidad} onChange={v=>setF(p=>({...p,localidad:v}))} placeholder="Córdoba"/>
        <Field label="Fecha del llamado" value={f.fechaLlamado} onChange={v=>setF(p=>({...p,fechaLlamado:v}))} type="date"/>
        <FieldText label="Lo que pidió por teléfono" value={f.observaciones} onChange={v=>setF(p=>({...p,observaciones:v}))} rows={3} placeholder="Descripción inicial..."/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:14}}>
          <button style={S.ghostBtn} onClick={onCancel}>Cancelar</button>
          <button style={{...S.primaryBtn,opacity:ok?1:0.35}} disabled={!ok} onClick={()=>onSave(f)}>Crear cliente ›</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DETALLE (con planilla de medición integrada)
// ═══════════════════════════════════════════════════════════
function DetailView({cliente,role,agenda,onSaveAgenda,onUpdate,onDelete,showToast}){
  const [c,setC]=useState(cliente);
  const [tab,setTab]=useState("info");
  const [newPago,setNewPago]=useState({monto:"",fecha:today(),nota:""});
  const [showDel,setShowDel]=useState(false);
  const [lightbox,setLightbox]=useState(null);
  const [selector,setSelector]=useState(null);
  const fileRef=useRef();

  useEffect(()=>setC(cliente),[cliente]);
  const save=updated=>{onUpdate({...c,...updated});setC(p=>({...p,...updated}));};

  const saveStatus = async (nuevoStatus) => {
    const updated = {...c, status: nuevoStatus};
    setC(updated);
    try {
      const { error } = await supabase.from('clientes').update({ data: updated }).eq('id', c.id);
      if (error) throw error;
      onUpdate(updated);
      showToast("Estado actualizado ✓");
    } catch(e) {
      console.error('Error actualizando estado:', e);
      showToast("Error al guardar","err");
      setC(c);
    }
  };


  // ── manejo de aberturas (planilla) ──
  const setAb = (abId,campo,val) => {
    const nuevas=(c.aberturas||[]).map(a=>a.id===abId?{...a,[campo]:val,...(campo==="tipo"?{config:"",serie:"",relleno:""}:{})}:a);
    setC(p=>({...p,aberturas:nuevas}));
  };
  const addAb = () => {
    const nuevas=[...(c.aberturas||[]), {...emptyRow((c.aberturas||[]).length+1)}];
    setC(p=>({...p,aberturas:nuevas}));
  };
  const delAb = (abId) => {
    const nuevas=(c.aberturas||[]).filter(a=>a.id!==abId).map((a,i)=>({...a,num:i+1}));
    setC(p=>({...p,aberturas:nuevas}));
  };
  const guardarObra = (extra={}) => save({ aberturas:c.aberturas, notas:c.notas, obsModo:c.obsModo, fechaMedicion:c.fechaMedicion, ...extra });

  const agregarPago=()=>{
    if(!newPago.monto) return;
    save({pagos:[...(c.pagos||[]),{...newPago,id:Date.now()}]});
    setNewPago({monto:"",fecha:today(),nota:""});showToast("Pago registrado ✓");
  };

  // Fotos — guardadas como base64
  const handleFoto=e=>{
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=ev=>{
      const nuevaFoto = { id:Date.now(), data:ev.target.result, nombre:file.name, fecha:today() };
      const fotos=[...(c.fotos||[]).filter(f=>typeof f==="object"), nuevaFoto];
      save({fotos}); showToast("Foto agregada ✓");
    };
    r.readAsDataURL(file); e.target.value="";
  };
  const eliminarFoto = (id) => {
    const fotos=(c.fotos||[]).filter(f=>f.id!==id);
    save({fotos}); showToast("Foto eliminada","err");
  };

  const sm=STATUS_META[c.status];
  const canF=role==="presupuestador"||role==="admin";
  const canM=role==="vendedor"||role==="admin"||role==="presupuestador";
  const canP=role==="fabrica"||role==="admin";
  const saldo=calcSaldo(c);
  const pagado=(c.pagos||[]).reduce((s,p)=>s+(parseFloat(p.monto)||0),0);
  const pct=c.monto?Math.min(100,(pagado/(parseFloat(c.monto)||1))*100):0;
  const stepK=Object.keys(STATUS_META);
  const stepIdx=stepK.indexOf(c.status);
  const totalAb=(c.aberturas||[]).reduce((s,a)=>s+(parseInt(a.cantidad)||0),0);

  const TABS=[
    {key:"info",   label:"Datos",        show:canM},
    {key:"fab",    label:"🏗️ Fabricar",  show:role==="fabrica"||role==="admin"||c.status==="aprobado"||c.status==="en_produccion"},
    {key:"obra",   label:"Obra",         show:canM},
    {key:"agenda", label:"📅 Agenda",    show:canM},
    {key:"fotos",  label:`Fotos${(c.fotos||[]).length>0?" ("+c.fotos.length+")":""}`, show:canM||role==="fabrica"},
    {key:"presup", label:"Presupuesto",  show:canF},
    {key:"pagos",  label:"Pagos",        show:canF},
  ].filter(t=>t.show);

  return (
    <div style={S.page}>
      {lightbox&&(
        <div style={S.lightOverlay} onClick={()=>setLightbox(null)}>
          <img src={lightbox} style={S.lightImg} alt="foto"/>
          <button style={S.lightClose} onClick={()=>setLightbox(null)}>✕</button>
        </div>
      )}

      {/* CABECERA */}
      <div style={S.detHead}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={S.cardNum}>#{c.numCliente}</div>
          <span style={{...S.badge,background:sm.color+"18",color:sm.color,borderColor:sm.color+"44"}}>{sm.icon} {sm.label}</span>
        </div>
        <div style={S.detName}>{c.nombre}</div>
        <div style={S.detSub}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>
        <div style={S.detMeta}>
          <span>📞 {c.telefono}</span><span>📅 {fmt(c.creadoEn)}</span>
          {c.fechaMedicion&&<span>📏 {fmt(c.fechaMedicion)}</span>}
        </div>
        {canF&&c.monto&&(
          <div style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748b",marginBottom:4}}>
              <span>Cobrado: {fmtMoney(pagado)}</span>
              <span style={{color:saldo===0?"#34d399":"#f59e0b"}}>Saldo: {fmtMoney(Math.max(0,saldo||0))}</span>
            </div>
            <div style={S.progressWrap}><div style={{...S.progressBar,width:`${pct}%`}}/></div>
            <div style={{fontSize:11,color:"#334155",textAlign:"right",marginTop:2}}>Total: {fmtMoney(c.monto)}</div>
          </div>
        )}
        <div style={S.steps}>
          {stepK.map((k,i)=>{
            const v=STATUS_META[k];const done=i<=stepIdx;
            return(
              <div key={k} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{...S.stepDot,background:done?v.color:CARD,borderColor:done?v.color:BORDER,
                  boxShadow:i===stepIdx?`0 0 8px ${v.color}`:""}}>{done&&i<stepIdx?"✓":v.icon.replace(/\uFE0F/g,"")}</div>
                {i<stepK.length-1&&<div style={{height:2,flex:1,background:i<stepIdx?v.color:BORDER}}/>}
              </div>
            );
          })}
        </div>
        <button style={S.waBtn} onClick={()=>window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${buildWA(c)}`,"_blank")}>
          <span style={{fontSize:18}}>💬</span>
          {c.presupuesto?"Enviar presupuesto por WhatsApp":"Abrir WhatsApp"}
        </button>
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {TABS.map(t=>(
          <button key={t.key} style={{...S.tab,color:tab===t.key?"#f1f5f9":"#475569",
            borderBottomColor:tab===t.key?sm.color:"transparent"}} onClick={()=>setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* TAB DATOS */}
      {tab==="info"&&(
        <div>
          <Blk title="📋 Datos del cliente" onSave={()=>save({})}>
            {canM?(
              <><Field label="Nombre" value={c.nombre} onChange={v=>setC(p=>({...p,nombre:v}))}/><Field label="Teléfono" value={c.telefono} onChange={v=>setC(p=>({...p,telefono:v}))} type="tel"/><Field label="Dirección" value={c.direccion} onChange={v=>setC(p=>({...p,direccion:v}))}/><Field label="Localidad" value={c.localidad} onChange={v=>setC(p=>({...p,localidad:v}))}/></>
            ):(
              <IG items={[["Nombre",c.nombre],["Teléfono",c.telefono],["Dirección",c.direccion],["Localidad",c.localidad||"—"]]}/>
            )}
            {c.observaciones&&<Nota title="Observaciones" text={c.observaciones}/>}
          </Blk>

          {/* FLUJO DE ESTADO MANUAL */}
          <div style={S.card}>
            <div style={S.cardTitle}>📊 Estado de la obra</div>
            {(role==="admin"||role==="presupuestador")?(
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                {[
                  {s:"nuevo",         label:"📞 Pendiente medición",       color:"#f59e0b"},
                  {s:"medido",        label:"📏 Para presupuestar",         color:ACCENT},
                  {s:"presupuestado", label:"⏳ En espera de respuesta",    color:"#a78bfa"},
                  {s:"aprobado",      label:"✅ Aprobado para fabricación", color:"#34d399"},
                  {s:"cancelado",     label:"❌ Presupuesto cancelado",     color:"#ef4444"},
                  {s:"en_produccion", label:"🔧 En producción",             color:"#fb923c"},
                  {s:"entregado",     label:"📦 Entregado",                 color:"#64748b"},
                ].map(opt=>(
                  <button key={opt.s}
                    style={{border:`2px solid ${c.status===opt.s?opt.color:"#1e2535"}`,
                      borderRadius:10,padding:"11px 14px",fontWeight:700,fontSize:13,
                      cursor:"pointer",textAlign:"left",
                      background:c.status===opt.s?opt.color+"22":"transparent",
                      color:c.status===opt.s?opt.color:"#475569"}}
                    onClick={()=>saveStatus(opt.s)}>
                    {opt.label}
                    {c.status===opt.s&&<span style={{float:"right",fontSize:11}}>← actual</span>}
                  </button>
                ))}
              </div>
            ):(
              <div style={{marginTop:10,padding:"14px",background:BG,borderRadius:12,border:`1px solid ${BORDER}`}}>
                <div style={{fontSize:20,marginBottom:6}}>{sm.icon}</div>
                <div style={{fontWeight:700,color:sm.color,fontSize:15}}>{sm.label}</div>
                <div style={{fontSize:12,color:"#475569",marginTop:4}}>Solo Presupuesto o Administrador pueden cambiar el estado.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB FABRICAR — solo fábrica */}
      {tab==="fab"&&(
        <div>
          {/* Info básica del cliente */}
          <div style={S.card}>
            <div style={S.cardTitle}>🏗️ Orden de fabricación</div>
            <IG items={[["Cliente",c.nombre],["Dirección",c.direccion||"—"],["Teléfono",c.telefono||"—"]]}/>

            {/* Fecha de entrega */}
            <div style={{marginTop:10}}>
              <label style={S.lbl}>📅 Fecha de entrega</label>
              <input type="date" style={S.inp}
                value={c.fechaEntrega||""}
                onChange={e=>setC(p=>({...p,fechaEntrega:e.target.value}))}/>
            </div>
            <button style={{...S.primaryBtn,marginTop:12}} onClick={()=>save({fechaEntrega:c.fechaEntrega})}>Guardar fecha ✓</button>
          </div>

          {/* Estado de producción */}
          <div style={S.card}>
            <div style={S.cardTitle}>Estado de fabricación</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {s:"aprobado",      label:"⏳ Pendiente de inicio",  color:"#34d399"},
                {s:"en_produccion", label:"🔧 En proceso",           color:"#fb923c"},
                {s:"entregado",     label:"📦 Terminada y entregada", color:"#94a3b8"},
              ].map(opt=>(
                <button key={opt.s}
                  style={{border:`2px solid ${c.status===opt.s?opt.color:"#1e2535"}`,borderRadius:10,
                    padding:"11px 14px",fontWeight:700,fontSize:13,cursor:"pointer",textAlign:"left",
                    background:c.status===opt.s?opt.color+"22":"transparent",
                    color:c.status===opt.s?opt.color:"#475569"}}
                  onClick={()=>save({status:opt.s})}>
                  {opt.label}
                  {c.status===opt.s&&<span style={{float:"right",fontSize:11}}>← actual</span>}
                </button>
              ))}
            </div>
            {c.fechaEntrega&&<div style={{fontSize:13,color:"#64748b",marginTop:10}}>📅 Entrega: <b style={{color:"#f1f5f9"}}>{c.fechaEntrega.split("-").reverse().join("/")}</b></div>}
          </div>

          {/* Aberturas a fabricar */}
          {c.obsModo==="describir" && (c.aberturas||[]).length>0 ? (
            <div style={S.card}>
              <div style={S.cardTitle}>📐 Aberturas ({(c.aberturas||[]).reduce((s,a)=>s+(parseInt(a.cantidad)||0),0)})</div>
              {(c.aberturas||[]).map(ab=>{
                const t=TIPOS.find(t=>t.id===ab.tipo);
                const cfg=t?.configs.find(cc=>cc.id===ab.config);
                const cajon=ab.tipo==="persiana"&&ab.alto?(parseFloat(ab.alto)<=160?"Cajón 15.5cm":"Cajón 18.5cm"):null;
                return (
                  <div key={ab.id} style={{borderBottom:`1px solid #0c1525`,padding:"12px 0",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{fontWeight:900,color:ACCENT,fontSize:16,minWidth:24}}>{ab.num}</div>
                    {t&&<AberturaSVG tipoId={ab.tipo} configId={ab.config} w={56} h={46} monoblock={!!ab.monoblock}/>}
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14}}>{t?.label}{cfg?` · ${cfg.label}`:""}</div>
                      <div style={{color:"#94a3b8",fontSize:13,marginTop:2}}>
                        {ab.ancho||"?"}x{ab.alto||"?"}cm · cant: {ab.cantidad||1}
                        {ab.serie?` · ${ab.serie}${ab.divisor?" c/divisor":""}` :""}
                      </div>
                      {ab.color&&<div style={{color:"#64748b",fontSize:12}}>Color: {ab.color}</div>}
                      {(()=>{const vt=vidrioTexto(ab.vidrio);return vt?<div style={{color:"#64748b",fontSize:12}}>Vidrio: {vt}</div>:null;})()}
                      {ab.relleno&&<div style={{color:"#64748b",fontSize:12}}>Diseño: {RELLENOS.find(r=>r.id===ab.relleno)?.label||""}</div>}
                      {cajon&&<div style={{color:"#fb923c",fontWeight:700,fontSize:12}}>📦 {cajon}</div>}
                      {ab.observaciones&&<div style={{color:"#475569",fontStyle:"italic",fontSize:11}}>"{ab.observaciones}"</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : c.notas ? (
            <div style={S.card}>
              <div style={S.cardTitle}>📋 Detalle de la obra</div>
              <Nota title="Medición" text={c.notas}/>
            </div>
          ) : (
            <div style={{...S.empty,paddingTop:20}}>Sin medición cargada todavía.</div>
          )}
        </div>
      )}

      {/* TAB OBRA — con toggle Escribir / Describir */}
      {tab==="obra"&&(
        <ObraTab
          c={c} setC={setC} canM={canM}
          setAb={setAb} addAb={addAb} delAb={delAb}
          selector={selector} setSelector={setSelector}
          totalAb={totalAb}
          onGuardar={guardarObra}
          canP={canP} save={save}
        />
      )}

      {/* TAB AGENDA */}
      {tab==="agenda"&&(
        <div style={S.card}>
          <div style={S.cardTitle}>📅 Visitas para este cliente</div>
          {(() => {
            const visitas = (agenda||[]).filter(v=>v.clienteId===c.id).sort((a,b)=>(a.fecha+a.hora).localeCompare(b.fecha+b.hora));
            const ahora = new Date();
            return (
              <>
                {visitas.length===0 && <div style={{color:"#334155",fontSize:13,textAlign:"center",padding:"16px 0"}}>Sin visitas agendadas para este cliente.</div>}
                {visitas.map(v=>{
                  const pasada = new Date(v.fecha+"T"+v.hora) < ahora;
                  const dt = new Date(v.fecha+"T"+v.hora);
                  const diffMin = Math.floor((dt-ahora)/60000);
                  const urgente = !pasada && diffMin<=60 && diffMin>=0;
                  return (
                    <div key={v.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${BORDER}`,opacity:pasada?0.5:1}}>
                      <div>
                        <div style={{fontWeight:700,color:urgente?"#ef4444":pasada?"#64748b":"#f1f5f9",fontSize:15}}>
                          {urgente?"⚠️ ":""}{v.hora} hs — {v.fecha.split("-").reverse().join("/")}
                        </div>
                        {v.nota&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>{v.nota}</div>}
                        <div style={{fontSize:12,color:"#475569",marginTop:2}}>📍 {c.direccion} · 📞 {c.telefono}</div>
                      </div>
                      <button style={{...S.ghostBtn,fontSize:11,padding:"5px 10px",color:"#f87171",borderColor:"#450a0a"}}
                        onClick={()=>onSaveAgenda&&onSaveAgenda((agenda||[]).filter(vv=>vv.id!==v.id))}>✕</button>
                    </div>
                  );
                })}
                <button style={{...S.primaryBtn,marginTop:14,width:"100%",background:ACCENT,color:BG}}
                  onClick={()=>{
                    const nueva={id:Date.now(),clienteId:c.id,fecha:today(),hora:"09:00",nota:""};
                    onSaveAgenda&&onSaveAgenda([...(agenda||[]),nueva]);
                    showToast("Visita agregada — editá fecha y hora en la Agenda ✓");
                  }}>+ Agendar visita para hoy</button>
              </>
            );
          })()}
        </div>
      )}

      {/* TAB FOTOS */}
      {tab==="fotos"&&(
        <Blk title="📷 Fotos de la obra">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleFoto}/>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button style={S.fotoBtn} onClick={()=>{fileRef.current.setAttribute("capture","environment");fileRef.current.click();}}>📷 Cámara</button>
            <button style={{...S.fotoBtn,background:"#1a2845"}} onClick={()=>{fileRef.current.removeAttribute("capture");fileRef.current.click();}}>🖼️ Galería</button>
          </div>
          <div style={S.fotoGrid}>
            {(c.fotos||[]).filter(f=>typeof f==="object"&&f.data).map((f)=>(
              <div key={f.id} style={{...S.fotoThumb,position:"relative"}}>
                <img src={f.data} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:6,cursor:"pointer"}}
                  alt="obra" onClick={()=>setLightbox(f.data)}/>
                <button
                  style={{position:"absolute",top:3,right:3,background:"#ef444499",border:"none",
                    borderRadius:"50%",width:22,height:22,color:"#fff",fontSize:13,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}
                  onClick={e=>{e.stopPropagation();eliminarFoto(f.id);}}>
                  ✕
                </button>
                {f.fecha&&<div style={{position:"absolute",bottom:0,left:0,right:0,background:"#000000aa",
                  fontSize:9,color:"#94a3b8",textAlign:"center",padding:"2px 0",borderRadius:"0 0 6px 6px"}}>
                  {f.fecha.split("-").reverse().join("/")}
                </div>}
              </div>
            ))}
            {(c.fotos||[]).filter(f=>typeof f==="object"&&f.data).length===0&&(
              <div style={{color:"#1e2a3a",fontSize:13,textAlign:"center",padding:"20px 0",gridColumn:"span 3"}}>
                Sin fotos. Usá los botones para agregar.
              </div>
            )}
          </div>
        </Blk>
      )}

      {/* TAB PRESUPUESTO */}
      {tab==="presup"&&canF&&(
        <div>
          {/* Botón editar medición desde presupuesto */}
          <div style={{...S.card,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14}}>📐 Medición</div>
              <div style={{fontSize:12,color:"#475569",marginTop:2}}>
                {c.obsModo==="describir"?(c.aberturas||[]).length+" aberturas cargadas":c.notas?"Descripción cargada":"Sin medición"}
              </div>
            </div>
            <button style={{background:"#1a2845",border:"1px solid #2a3f5f",borderRadius:10,padding:"8px 14px",
              color:ACCENT,fontWeight:700,fontSize:13,cursor:"pointer"}}
              onClick={()=>setTab("obra")}>
              ✏️ Editar
            </button>
          </div>

          {/* PRECIOS UNITARIOS POR ABERTURA */}
          {c.obsModo==="describir" && (c.aberturas||[]).length>0 && (
            <div style={S.card}>
              <div style={S.cardTitle}>💰 Precio por abertura</div>
              <div style={{fontSize:12,color:"#475569",marginBottom:12}}>Ingresá el precio unitario de cada ítem. El total se calcula automáticamente.</div>
              {(c.aberturas||[]).map((a,i)=>{
                const precio      = parseFloat((c.preciosAb||{})[a.id])||0;
                const precioMono  = parseFloat((c.preciosMono||{})[a.id])||0;
                const cant        = parseInt(a.cantidad)||1;
                const subtotalAb  = precio*cant;
                const subtotalMono= precioMono*cant;
                const subtotal    = subtotalAb+subtotalMono;

                const recalcTotal = (nuevosAb, nuevosMono) => {
                  return (c.aberturas||[]).reduce((s,ab)=>{
                    const p  = parseFloat(nuevosAb[ab.id])||0;
                    const pm = parseFloat(nuevosMono[ab.id])||0;
                    return s+(p+pm)*(parseInt(ab.cantidad)||1);
                  },0);
                };

                return (
                  <div key={a.id} style={{borderBottom:`1px solid #0c1525`,padding:"12px 0"}}>
                    <div style={{fontSize:13,color:"#94a3b8",marginBottom:8,lineHeight:1.4}}>
                      <b style={{color:"#e2e8f0"}}>{i+1})</b> {aberturaResumen(a)}
                    </div>

                    {/* Precio abertura */}
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:a.monoblock?8:0}}>
                      <div style={{flex:1}}>
                        <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:3}}>
                          Precio unitario abertura ($)
                        </label>
                        <input type="number" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                          placeholder="0"
                          value={(c.preciosAb||{})[a.id]||""}
                          onChange={e=>{
                            const nuevos={...(c.preciosAb||{}),[a.id]:e.target.value};
                            const total=recalcTotal(nuevos, c.preciosMono||{});
                            setC(prev=>({...prev,preciosAb:nuevos,monto:String(total)}));
                          }}/>
                      </div>
                      <div style={{fontSize:12,color:"#64748b",paddingTop:16}}>× {cant}</div>
                      <div style={{minWidth:76,textAlign:"right",paddingTop:16}}>
                        <div style={{fontSize:10,color:"#475569",marginBottom:2}}>Subtotal</div>
                        <div style={{fontWeight:700,color:subtotalAb>0?"#34d399":"#334155",fontSize:13}}>
                          {subtotalAb>0?fmtMoney(subtotalAb):"—"}
                        </div>
                      </div>
                    </div>

                    {/* Precio monoblock — solo si tiene monoblock */}
                    {a.monoblock&&(
                      <div style={{display:"flex",gap:8,alignItems:"center",
                        background:"#fb923c0a",border:"1px solid #fb923c22",borderRadius:8,padding:"8px"}}>
                        <div style={{flex:1}}>
                          <label style={{fontSize:10,color:"#fb923c",display:"block",marginBottom:3}}>
                            📦 Precio unitario Monoblock ($)
                          </label>
                          <input type="number" style={{width:"100%",background:"#090e18",border:"1px solid #fb923c44",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                            placeholder="0"
                            value={(c.preciosMono||{})[a.id]||""}
                            onChange={e=>{
                              const nuevos={...(c.preciosMono||{}),[a.id]:e.target.value};
                              const total=recalcTotal(c.preciosAb||{}, nuevos);
                              setC(prev=>({...prev,preciosMono:nuevos,monto:String(total)}));
                            }}/>
                        </div>
                        <div style={{fontSize:12,color:"#fb923c88",paddingTop:16}}>× {cant}</div>
                        <div style={{minWidth:76,textAlign:"right",paddingTop:16}}>
                          <div style={{fontSize:10,color:"#fb923c88",marginBottom:2}}>Subtotal</div>
                          <div style={{fontWeight:700,color:subtotalMono>0?"#fb923c":"#334155",fontSize:13}}>
                            {subtotalMono>0?fmtMoney(subtotalMono):"—"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Total item si tiene monoblock */}
                    {a.monoblock&&subtotal>0&&(
                      <div style={{textAlign:"right",marginTop:6,fontSize:12,color:"#94a3b8"}}>
                        Total ítem: <b style={{color:"#34d399"}}>{fmtMoney(subtotal)}</b>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",marginTop:4,borderTop:`1px solid ${BORDER}`}}>
                <span style={{fontWeight:800,color:"#e2e8f0",fontSize:15}}>Total</span>
                <span style={{fontWeight:900,color:ACCENT,fontSize:20}}>{fmtMoney(c.monto)}</span>
              </div>
              <button style={{...S.primaryBtn,width:"100%",marginTop:12}}
                onClick={()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb,preciosMono:c.preciosMono})}>
                Guardar precios ✓
              </button>
            </div>
          )}
          {c.obsModo==="escribir" && c.notas && (
            <div style={S.card}><div style={S.cardTitle}>📝 Notas de medición</div><Nota title="Detalle" text={c.notas}/></div>
          )}
          <Blk title="📝 Observaciones y plazos" onSave={()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb})}>
            <FieldText label="Notas del presupuesto" value={c.presupuesto||""} onChange={v=>setC(p=>({...p,presupuesto:v}))} rows={3} placeholder="Plazo de entrega, condiciones, etc..."/>
            {c.obsModo!=="describir"&&<Field label="Monto total ($)" value={c.monto||""} onChange={v=>setC(p=>({...p,monto:v}))} type="number" placeholder="0"/>}
          </Blk>
          {c.monto&&(
            <div style={S.resumen}>
              {[["Total",fmtMoney(c.monto),"#e2e8f0"],["Cobrado",fmtMoney(pagado),"#34d399"]].map(([l,v,col])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:14}}>
                  <span style={{color:"#64748b"}}>{l}</span><span style={{color:col,fontWeight:700}}>{v}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",borderTop:`1px solid ${BORDER}`,marginTop:6}}>
                <span style={{fontWeight:800,color:"#e2e8f0"}}>Saldo</span>
                <span style={{fontWeight:900,fontSize:20,color:saldo<=0?"#34d399":"#f59e0b"}}>{fmtMoney(Math.max(0,saldo||0))}</span>
              </div>
            </div>
          )}
          {c.presupuesto&&c.monto&&(
            <button style={{...S.waBtn,marginTop:10}} onClick={()=>window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${buildWA(c)}`,"_blank")}>💬 Enviar presupuesto por WhatsApp</button>
          )}
          {c.status==="medido"&&c.monto&&<Btn label="📤 Marcar como enviado al cliente" color="#a78bfa" textColor={BG} onClick={()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb,preciosMono:c.preciosMono,status:"presupuestado"})}/>}

          {/* Botones de seguimiento — aparecen cuando hay presupuesto cargado */}
          {c.monto&&(
            <div style={{...S.card}}>
              <div style={S.cardTitle}>📋 Seguimiento del presupuesto</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
                {[
                  {s:"presupuestado", label:"⏳ En espera de respuesta", color:"#a78bfa"},
                  {s:"aprobado",      label:"✅ Aprobado para hacer",    color:"#34d399"},
                  {s:"cancelado",     label:"❌ Presupuesto cancelado",  color:"#ef4444"},
                ].map(opt=>(
                  <button key={opt.s}
                    style={{border:`2px solid ${c.status===opt.s?opt.color:"#1e2535"}`,borderRadius:10,
                      padding:"10px 14px",fontWeight:700,fontSize:13,cursor:"pointer",textAlign:"left",
                      background:c.status===opt.s?opt.color+"22":"transparent",
                      color:c.status===opt.s?opt.color:"#475569"}}
                    onClick={()=>save({status:opt.s})}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB PAGOS */}
      {tab==="pagos"&&canF&&(
        <div>
          <Blk title="💳 Registrar pago / adelanto">
            <Field label="Monto ($)" value={newPago.monto} onChange={v=>setNewPago(p=>({...p,monto:v}))} type="number" placeholder="0"/>
            <Field label="Fecha" value={newPago.fecha} onChange={v=>setNewPago(p=>({...p,fecha:v}))} type="date"/>
            <Field label="Descripción" value={newPago.nota} onChange={v=>setNewPago(p=>({...p,nota:v}))} placeholder="Seña, adelanto, saldo..."/>
            <button style={{...S.primaryBtn,width:"100%",marginTop:8,opacity:newPago.monto?1:0.35}} disabled={!newPago.monto} onClick={agregarPago}>+ Registrar</button>
          </Blk>
          {(c.pagos||[]).length>0?(
            <Blk title="Historial de pagos">
              {[...c.pagos].reverse().map(p=>(
                <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid #0c1525`}}>
                  <div><div style={{fontWeight:700,fontSize:16,color:"#34d399"}}>{fmtMoney(p.monto)}</div>{p.nota&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>{p.nota}</div>}</div>
                  <div style={{fontSize:12,color:"#475569"}}>{fmt(p.fecha)}</div>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",borderTop:`1px solid ${BORDER}`,marginTop:6}}>
                <span style={{color:"#94a3b8",fontWeight:700}}>Total cobrado</span>
                <span style={{color:"#34d399",fontWeight:900,fontSize:18}}>{fmtMoney(pagado)}</span>
              </div>
            </Blk>
          ):<div style={S.empty}>Sin pagos registrados.</div>}
        </div>
      )}

      {(role==="admin"||role==="presupuestador")&&(
        <div style={{paddingBottom:40}}>
          {!showDel
            ?<button style={{background:"transparent",color:"#f87171",border:`1px solid #450a0a`,borderRadius:10,padding:"10px 16px",fontWeight:600,fontSize:14,cursor:"pointer",width:"100%"}} onClick={()=>setShowDel(true)}>Eliminar cliente</button>
            :<div style={{background:"#1a0a0a",border:`1px solid #450a0a`,borderRadius:12,padding:16}}>
              <p style={{color:"#fca5a5",margin:"0 0 12px"}}>¿Seguro que eliminás a <b>{c.nombre}</b>?</p>
              <div style={{display:"flex",gap:10}}>
                <button style={S.ghostBtn} onClick={()=>setShowDel(false)}>Cancelar</button>
                <button style={{...S.primaryBtn,background:"#ef4444"}} onClick={()=>onDelete(c.id)}>Sí, eliminar</button>
              </div>
            </div>
          }
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB OBRA — Escribir (texto libre) o Describir (planilla)
// ═══════════════════════════════════════════════════════════
function ObraTab({ c, setC, canM, setAb, addAb, delAb, selector, setSelector, totalAb, onGuardar, canP, save }){
  const modo = c.obsModo || "";

  // Si no es canM → solo lectura
  if (!canM) {
    return (
      <div>
        {c.fechaMedicion && <div style={{...S.card}}><IG items={[["Fecha medición",fmt(c.fechaMedicion)]]}/></div>}
        {modo==="describir" && (c.aberturas||[]).length>0 ? (
          <div style={S.card}>
            <div style={S.cardTitle}>📐 Aberturas medidas ({totalAb})</div>
            <PlanillaReadOnly aberturas={c.aberturas}/>
          </div>
        ) : modo==="escribir" && c.notas ? (
          <div style={S.card}><div style={S.cardTitle}>📝 Medición</div><Nota title="Detalle" text={c.notas}/></div>
        ) : (
          <div style={S.empty}>Sin medición cargada todavía.</div>
        )}
        {canP&&c.status==="aprobado"&&<Btn label="🔧 Iniciar producción" color="#fb923c" textColor={BG} onClick={()=>save({status:"en_produccion"})}/>}
        {canP&&c.status==="en_produccion"&&<Btn label="📦 Marcar como entregado" color="#64748b" onClick={()=>save({status:"entregado"})}/>}
      </div>
    );
  }

  // Selección de modo inicial
  if (!modo) {
    return (
      <div style={S.card}>
        <div style={S.cardTitle}>📏 ¿Cómo querés cargar la medición?</div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
          <button style={S.modoCard} onClick={()=>setC(p=>({...p,obsModo:"escribir"}))}>
            <div style={{fontSize:32}}>✏️</div>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>Escribir</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Texto libre, anotás todo a mano como en un cuaderno.</div>
            </div>
            <span style={{color:ACCENT,fontSize:20}}>›</span>
          </button>
          <button style={S.modoCard} onClick={()=>{setC(p=>({...p,obsModo:"describir",aberturas:(p.aberturas&&p.aberturas.length)?p.aberturas:[emptyRow(1)]}));}}>
            <div style={{fontSize:32}}>📐</div>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>Describir</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Planilla profesional: cada abertura con tipo, medidas, serie, vidrio y más.</div>
            </div>
            <span style={{color:ACCENT,fontSize:20}}>›</span>
          </button>
        </div>
      </div>
    );
  }

  // MODO ESCRIBIR
  if (modo === "escribir") {
    return (
      <div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={S.cardTitle} >✏️ Medición (texto libre)</div>
            <button style={{...S.ghostBtn,fontSize:11,padding:"4px 10px"}} onClick={()=>setC(p=>({...p,obsModo:""}))}>Cambiar modo</button>
          </div>
          <Field label="Fecha de medición" value={c.fechaMedicion||""} onChange={v=>setC(p=>({...p,fechaMedicion:v}))} type="date"/>
          <FieldText label="Detalle de la obra" value={c.notas||""} onChange={v=>setC(p=>({...p,notas:v}))} rows={9}
            placeholder={"Anotá todo lo que quiere el cliente:\n• Tipo de aberturas y medidas\n• Línea / serie\n• Color, vidrio\n• Detalles especiales"}/>
          <button style={{...S.primaryBtn,marginTop:14}} onClick={()=>onGuardar(c.status==="nuevo"?{status:"medido"}:{})}>Guardar medición ✓</button>
        </div>
      </div>
    );
  }

  // MODO DESCRIBIR — PLANILLA
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"14px 0 6px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={S.cardTitle} >📐 Planilla de medición</div>
          <button style={{...S.ghostBtn,fontSize:11,padding:"4px 10px"}} onClick={()=>setC(p=>({...p,obsModo:""}))}>Cambiar modo</button>
        </div>
        <button style={S.btnAdd} onClick={addAb}>+ Abertura</button>
      </div>

      <div style={S.card}>
        <Field label="Fecha de medición" value={c.fechaMedicion||""} onChange={v=>setC(p=>({...p,fechaMedicion:v}))} type="date"/>
      </div>

      {/* Lista de aberturas en formato tarjeta (mobile-friendly) */}
      {(c.aberturas||[]).map(ab=>(
        <AberturaCard key={ab.id} ab={ab} setAb={setAb} delAb={delAb} onPick={()=>setSelector({rowId:ab.id,step:"tipo"})}/>
      ))}

      <div style={S.totales}>
        <div style={S.totalItem}>
          <span style={S.totalLbl}>Total aberturas</span>
          <span style={{...S.totalVal,color:ACCENT}}>{totalAb}</span>
        </div>
        <div style={S.totalItem}>
          <span style={S.totalLbl}>Ítems</span>
          <span style={{...S.totalVal,color:"#a78bfa"}}>{(c.aberturas||[]).length}</span>
        </div>
      </div>

      <div style={{display:"flex",gap:10,marginTop:12}}>
        <button style={{...S.btnAdd,flex:1}} onClick={addAb}>+ Agregar abertura</button>
        <button style={{...S.primaryBtn,flex:1}} onClick={()=>onGuardar(c.status==="nuevo"?{status:"medido"}:{})}>Guardar ✓</button>
      </div>

      {/* MODAL SELECTOR TIPO */}
      {selector&&(
        <div style={S.overlay} onClick={()=>setSelector(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={S.modalTitle}>{selector.step==="tipo"?"Tipo de abertura":"Configuración"}</div>
              <button style={{background:"none",border:"none",color:"#64748b",fontSize:22,cursor:"pointer"}} onClick={()=>setSelector(null)}>✕</button>
            </div>
            {selector.step==="tipo" ? (
              ["ventana","puerta","especial","catalana"].map(cat=>(
                <div key={cat} style={{marginBottom:18}}>
                  <div style={S.catLbl}>{cat==="ventana"?"🪟 Ventanas":cat==="puerta"?"🚪 Puertas":cat==="catalana"?"🪟 Persianas Catalanas":"⬛ Especiales"}</div>
                  <div style={S.tiposGrid}>
                    {TIPOS.filter(t=>t.categoria===cat).map(t=>(
                      <button key={t.id} style={S.tipoCard} onClick={()=>{
                        setAb(selector.rowId,"tipo",t.id);
                        if(t.configs.length===1){setAb(selector.rowId,"config",t.configs[0].id);setSelector(null);}
                        else setSelector({rowId:selector.rowId,step:"config",tipoId:t.id});
                      }}>
                        <AberturaSVG tipoId={t.id} configId={t.configs[0].id} w={82} h={66}/>
                        <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",marginTop:6,textAlign:"center"}}>{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>
                {(() => {
                  const t=TIPOS.find(t=>t.id===selector.tipoId); if(!t) return null;
                  return (
                    <div style={S.tiposGrid}>
                      {t.configs.map(cfg=>(
                        <button key={cfg.id} style={{...S.tipoCard,minWidth:115}} onClick={()=>{
                          setAb(selector.rowId,"tipo",t.id);
                          setAb(selector.rowId,"config",cfg.id);
                          setSelector(null);
                        }}>
                          <AberturaSVG tipoId={t.id} configId={cfg.id} w={92} h={74}/>
                          <div style={{fontSize:11,fontWeight:700,color:ACCENT,marginTop:6,textAlign:"center"}}>{cfg.label}</div>
                          {cfg.desc&&<div style={{fontSize:9,color:"#64748b",textAlign:"center",marginTop:2,lineHeight:1.3,maxWidth:115}}>{cfg.desc}</div>}
                        </button>
                      ))}
                    </div>
                  );
                })()}
                <button style={{...S.ghostBtn,marginTop:14}} onClick={()=>setSelector({...selector,step:"tipo"})}>← Cambiar tipo</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tarjeta de una abertura (modo describir) ──
function AberturaCard({ ab, setAb, delAb, onPick }){
  const t = TIPOS.find(t=>t.id===ab.tipo);
  const c = t?.configs.find(c=>c.id===ab.config);
  const esPuerta = ab.tipo==="puerta_batiente"||ab.tipo==="puerta_mv"||ab.tipo==="puerta_corrediza";
  const esCorr   = ab.tipo==="corrediza"||ab.tipo==="puerta_corrediza";
  const series   = seriesPorTipo(ab.tipo);
  const cajonAlert = ab.tipo==="persiana" && ab.alto ? (parseFloat(ab.alto)<=160?"15.5 cm":"18.5 cm") : null;
  const cajonBig = ab.tipo==="persiana" && ab.alto && parseFloat(ab.alto)>160;

  return (
    <div style={S.abCard}>
      <div style={{display:"flex",gap:10}}>
        <div style={{fontWeight:900,fontSize:18,color:ACCENT,minWidth:24}}>{ab.num}</div>
        <div style={{flex:1}}>
          {/* Tipo */}
          <button style={{...S.tipoBtn,marginBottom:8}} onClick={onPick}>
            {t ? (
              <div style={{display:"flex",alignItems:"center",gap:10,width:"100%"}}>
                <AberturaSVG tipoId={ab.tipo} configId={ab.config} w={64} h={50} monoblock={!!ab.monoblock}/>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:13,color:ACCENT,fontWeight:700}}>{t.label}</div>
                  {c&&<div style={{fontSize:11,color:"#64748b"}}>{c.label}</div>}
                </div>
                <span style={{marginLeft:"auto",color:"#475569",fontSize:11}}>cambiar ›</span>
              </div>
            ):(
              <div style={{padding:"10px",display:"flex",alignItems:"center",gap:8,width:"100%"}}>
                <span style={{fontSize:20,opacity:0.4}}>＋</span>
                <span style={{fontSize:13,color:"#64748b"}}>Seleccionar tipo de abertura</span>
              </div>
            )}
          </button>

          {/* Medidas */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            <div style={{flex:1,minWidth:80}}>
              <label style={S.miniLbl}>Ancho (cm)</label>
              <input style={S.dimInput} type="number" step="1" value={ab.ancho} onChange={e=>setAb(ab.id,"ancho",e.target.value)} placeholder="0"/>
            </div>
            <div style={{flex:1,minWidth:80}}>
              <label style={S.miniLbl}>Alto (cm)</label>
              <input style={S.dimInput} type="number" step="1" value={ab.alto} onChange={e=>setAb(ab.id,"alto",e.target.value)} placeholder="0"/>
            </div>
            <div style={{width:70}}>
              <label style={S.miniLbl}>Cant.</label>
              <input style={{...S.dimInput,textAlign:"center"}} type="number" min="1" value={ab.cantidad} onChange={e=>setAb(ab.id,"cantidad",e.target.value)}/>
            </div>
          </div>

          {/* Alerta cajón persiana */}
          {cajonAlert&&(
            <div style={{background:cajonBig?"#2d1a00":"#0a1e30",border:`1px solid ${cajonBig?"#f59e0b66":ACCENT+"44"}`,borderRadius:7,padding:"6px 10px",marginBottom:8}}>
              <span style={{fontWeight:800,color:cajonBig?"#f59e0b":ACCENT,fontSize:12}}>📦 Cajón {cajonAlert}</span>
              <span style={{color:"#94a3b8",fontSize:11,marginLeft:6}}>(alto {parseFloat(ab.alto).toFixed(0)}cm {cajonBig?"› 160":"≤ 160"})</span>
            </div>
          )}

          {/* Serie + divisor */}
          {series.length>0&&(
            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{flex:1,minWidth:120}}>
                <label style={S.miniLbl}>Línea / Serie</label>
                <select style={S.sel} value={ab.serie} onChange={e=>setAb(ab.id,"serie",e.target.value)}>
                  <option value="">— serie —</option>
                  {series.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {esCorr&&(
                <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,
                  color:ab.divisor?ACCENT:"#64748b",background:ab.divisor?ACCENT+"15":"transparent",
                  border:`1px solid ${ab.divisor?ACCENT+"44":BORDER}`,borderRadius:7,padding:"7px 10px",marginTop:16}}>
                  <input type="checkbox" checked={!!ab.divisor} onChange={e=>setAb(ab.id,"divisor",e.target.checked)} style={{accentColor:ACCENT,width:14,height:14}}/>
                  Con divisor
                </label>
              )}
              {/* Monoblock — disponible para ventanas y puertas (no para persiana ni fijo) */}
              {!["persiana","fijo","celosia","catalana"].includes(ab.tipo)&&ab.tipo&&(
                <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,
                  color:ab.monoblock?"#fb923c":"#64748b",background:ab.monoblock?"#fb923c15":"transparent",
                  border:`1px solid ${ab.monoblock?"#fb923c44":BORDER}`,borderRadius:7,padding:"7px 10px",marginTop:8}}>
                  <input type="checkbox" checked={!!ab.monoblock} onChange={e=>setAb(ab.id,"monoblock",e.target.checked)} style={{accentColor:"#fb923c",width:14,height:14}}/>
                  Con Monoblock
                </label>
              )}
            </div>
          )}

          {/* Diseño hoja (solo puertas) */}
          {esPuerta&&(
            <div style={{marginBottom:8}}>
              <label style={S.miniLbl}>Diseño de hoja</label>
              <RellenoSelector value={ab.relleno} onChange={v=>setAb(ab.id,"relleno",v)}/>
            </div>
          )}

          {/* ── Campos Persiana Catalana ── */}
          {ab.tipo==="catalana"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:120}}>
                  <label style={S.miniLbl}>Color</label>
                  <select style={S.sel} value={ab.catColor||""} onChange={e=>setAb(ab.id,"catColor",e.target.value)}>
                    <option value="">— color —</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Negro">Negro</option>
                    <option value="Madera">Madera</option>
                    <option value="Testa Di Moro">Testa Di Moro</option>
                    <option value="Gris Plata">Gris Plata</option>
                  </select>
                </div>
                <div style={{flex:1,minWidth:100}}>
                  <label style={S.miniLbl}>Cajón</label>
                  <select style={S.sel} value={ab.catCajon||""} onChange={e=>setAb(ab.id,"catCajon",e.target.value)}>
                    <option value="">— cajón —</option>
                    <option value="165">165</option>
                    <option value="180">180</option>
                    <option value="200">200</option>
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:120}}>
                  <label style={S.miniLbl}>Tipo de lama</label>
                  <select style={S.sel} value={ab.catLama||""} onChange={e=>setAb(ab.id,"catLama",e.target.value)}>
                    <option value="">— lama —</option>
                    <option value="Aluminio">Aluminio</option>
                    {(ab.catColor==="Blanco"||!ab.catColor)&&<option value="PVC">PVC (solo Blanca)</option>}
                  </select>
                </div>
                <div style={{flex:1,minWidth:120}}>
                  <label style={S.miniLbl}>Enrollador (desde adentro)</label>
                  <select style={S.sel} value={ab.catEnrollador||""} onChange={e=>setAb(ab.id,"catEnrollador",e.target.value)}>
                    <option value="">— lado —</option>
                    <option value="Izquierda">Izquierda</option>
                    <option value="Derecha">Derecha</option>
                  </select>
                </div>
              </div>
              {parseFloat(ab.ancho)>200&&(
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{flex:1}}>
                    <label style={S.miniLbl}>Paño</label>
                    <select style={S.sel} value={ab.catPano||"entero"} onChange={e=>setAb(ab.id,"catPano",e.target.value)}>
                      <option value="entero">Entero</option>
                      <option value="dividido">Dividido</option>
                    </select>
                  </div>
                  <div style={{fontSize:11,color:"#f59e0b",background:"#f59e0b15",border:"1px solid #f59e0b44",borderRadius:7,padding:"6px 10px",marginTop:16,flex:1}}>
                    ⚠️ Ancho &gt; 200cm — verificar paño dividido
                  </div>
                </div>
              )}
              {ab.catLama==="PVC"&&ab.catColor&&ab.catColor!=="Blanco"&&(
                <div style={{fontSize:12,color:"#ef4444",background:"#ef444415",border:"1px solid #ef444444",borderRadius:7,padding:"6px 10px"}}>
                  ⚠️ Lama PVC solo disponible en color Blanco
                </div>
              )}
            </div>
          )}

          {/* Color + Vidrio — solo aberturas de aluminio */}
          {ab.tipo&&ab.tipo!=="catalana"&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            <div style={{flex:1,minWidth:120}}>
              <label style={S.miniLbl}>Color</label>
              <select style={S.sel} value={ab.color} onChange={e=>setAb(ab.id,"color",e.target.value)}>
                <option value="">— color —</option>
                <option value="Anodizado">Anodizado</option>
                <option value="Blanco">Blanco</option>
                <option value="Negro Anodi">Negro Anodi</option>
                <option value="Negro Pintado">Negro Pintado</option>
                <option value="Madera">Madera</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div style={{flex:1,minWidth:150}}>
              <label style={S.miniLbl}>Vidrio</label>
              <VidrioSelector value={ab.vidrio} onChange={v=>setAb(ab.id,"vidrio",v)}/>
            </div>
          </div>
          )}

          {/* Observaciones */}
          <div>
            <label style={S.miniLbl}>Observaciones</label>
            <input style={{...S.dimInput,width:"100%"}} placeholder="Notas de esta abertura..." value={ab.observaciones} onChange={e=>setAb(ab.id,"observaciones",e.target.value)}/>
          </div>
        </div>

        <button style={S.delBtn} onClick={()=>delAb(ab.id)}>✕</button>
      </div>
    </div>
  );
}

// ── Planilla solo lectura (presupuestador/fábrica) ──
function PlanillaReadOnly({ aberturas }){
  return (
    <div>
      {aberturas.map(ab=>{
        const t=TIPOS.find(t=>t.id===ab.tipo);
        const c=t?.configs.find(c=>c.id===ab.config);
        const cajon = ab.tipo==="persiana"&&ab.alto ? (parseFloat(ab.alto)<=160?"15.5cm":"18.5cm") : null;
        return (
          <div key={ab.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:`1px solid #0c1525`,alignItems:"flex-start"}}>
            <div style={{fontWeight:900,color:ACCENT,fontSize:15,minWidth:20}}>{ab.num}</div>
            {t&&<AberturaSVG tipoId={ab.tipo} configId={ab.config} w={56} h={46} monoblock={!!ab.monoblock}/>}
            <div style={{flex:1,fontSize:13,color:"#c8d6e5",lineHeight:1.6}}>
              <div style={{fontWeight:700,color:"#f1f5f9"}}>{t?.label}{c?` · ${c.label}`:""}</div>
              <div style={{color:"#94a3b8"}}>
                {ab.ancho||"?"} x {ab.alto||"?"} cm · cant: {ab.cantidad||1}
                {ab.serie?` · ${ab.serie}${ab.divisor?" c/divisor":""}`:""}
              </div>
              {ab.tipo==="catalana"?(
                <div style={{color:"#94a3b8"}}>
                  {ab.catColor&&<span>{ab.catColor}</span>}
                  {ab.catLama&&<span> · Lama {ab.catLama}</span>}
                  {ab.catCajon&&<span> · Cajón {ab.catCajon}</span>}
                  {ab.catEnrollador&&<span> · Enrollador {ab.catEnrollador}</span>}
                  {ab.catPano==="dividido"&&<span style={{color:"#f59e0b",fontWeight:700}}> · DIVIDIDO</span>}
                  {ab.catLama==="PVC"&&ab.catColor!=="Blanco"&&<span style={{color:"#ef4444"}}> ⚠️ PVC solo Blanco</span>}
                </div>
              ):(
                <div style={{color:"#94a3b8"}}>
                  {ab.color?`${ab.color}`:""}
                  {(()=>{const vt=vidrioTexto(ab.vidrio);return vt?` · ${vt}`:"";})()}
                  {ab.relleno?` · ${RELLENOS.find(r=>r.id===ab.relleno)?.label||""}`:""}
                </div>
              )}
              {cajon&&<div style={{color:"#fb923c",fontWeight:700,fontSize:12}}>📦 Cajón {cajon}</div>}
              {ab.observaciones&&<div style={{color:"#64748b",fontStyle:"italic"}}>"{ab.observaciones}"</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MICRO COMPONENTES ──
const Field = ({label,value,onChange,type="text",placeholder=""}) => (
  <div style={{marginBottom:12}}>
    <label style={S.lbl}>{label}</label>
    <input style={S.inp} type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
  </div>
);
const FieldText = ({label,value,onChange,rows=4,placeholder=""}) => (
  <div style={{marginBottom:12}}>
    <label style={S.lbl}>{label}</label>
    <textarea style={{...S.inp,resize:"vertical",fontFamily:"inherit",lineHeight:1.7}} rows={rows} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
  </div>
);
const IG = ({items}) => (
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
    {items.map(([k,v])=><div key={k} style={{background:BG,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:10,color:"#334155",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>{k}</div><div style={{fontSize:14,color:"#e2e8f0",fontWeight:600}}>{v}</div></div>)}
  </div>
);
const Nota = ({title,text}) => (
  <div style={{background:BG,border:`1px solid ${BORDER}`,borderRadius:10,padding:"12px",marginTop:8}}>
    <div style={{fontSize:11,fontWeight:700,color:"#334155",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{title}</div>
    <div style={{fontSize:14,color:"#94a3b8",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{text}</div>
  </div>
);
const Blk = ({title,children,onSave}) => (
  <div style={S.card}>
    <div style={S.cardTitle}>{title}</div>
    {children}
    {onSave&&<button style={{...S.primaryBtn,marginTop:14}} onClick={onSave}>Guardar ✓</button>}
  </div>
);
const Btn = ({label,color,textColor="#fff",onClick}) => (
  <button style={{display:"block",width:"100%",border:"none",borderRadius:12,padding:"13px 0",fontWeight:800,fontSize:14,cursor:"pointer",marginTop:10,background:color,color:textColor}} onClick={onClick}>{label}</button>
);

// ═══════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════
const S = {
  app:    {minHeight:"100vh",background:BG,color:"#c8d6e5",fontFamily:"'DM Sans','Segoe UI',sans-serif",paddingBottom:60},
  page:   {padding:"14px 14px 0",maxWidth:760,margin:"0 auto"},

  header: {background:CARD,borderBottom:`1px solid ${BORDER}`,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:20},
  hLeft:  {display:"flex",alignItems:"center",gap:10},
  headerLogo:{width:36,height:36,borderRadius:8,objectFit:"cover",border:`1px solid ${BORDER}`},
  headerBrand:{fontWeight:900,fontSize:17,color:"#f1f5f9",letterSpacing:"-0.5px"},
  headerRole:{fontSize:11,fontWeight:600,marginTop:1},
  hRight: {display:"flex",gap:8},
  backBtn:{background:"none",border:"none",color:ACCENT,fontSize:28,cursor:"pointer",padding:"0 4px",lineHeight:1},

  toast:{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,padding:"10px 22px",borderRadius:10,border:"1px solid",fontSize:14,fontWeight:700,color:"#f1f5f9",whiteSpace:"nowrap"},

  center:{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'DM Sans','Segoe UI',sans-serif"},
  splashWrap:{textAlign:"center",marginBottom:36},
  splashLogo:{width:130,height:130,borderRadius:24,objectFit:"cover",boxShadow:`0 0 40px ${ACCENT}44`,marginBottom:16},
  splashDivider:{width:60,height:2,background:`linear-gradient(90deg,transparent,${ACCENT},transparent)`,margin:"0 auto 12px"},
  splashBrand:{fontSize:32,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1px"},
  splashSub:{color:"#475569",fontSize:13,marginTop:4},
  splashCreator:{color:"#334155",fontSize:11,marginTop:6,letterSpacing:"0.05em"},
  demoPill:{display:"inline-block",marginTop:12,padding:"4px 14px",borderRadius:99,background:`${ACCENT}18`,border:`1px solid ${ACCENT}44`,color:ACCENT,fontSize:12,fontWeight:700},
  roleList:{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:8},
  roleRow:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",color:"#e2e8f0",width:"100%"},
  rolePip:{width:10,height:10,borderRadius:"50%",flexShrink:0},
  roleRowLabel:{fontWeight:700,fontSize:15},

  pinLogo:{width:80,height:80,borderRadius:18,objectFit:"cover",marginBottom:16,boxShadow:`0 0 24px ${ACCENT}44`},
  pinBox:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:20,padding:24,width:"100%",maxWidth:320,display:"flex",flexDirection:"column",alignItems:"center"},
  pinTitle:{fontWeight:900,fontSize:20,color:"#f1f5f9",marginBottom:2},
  pinSub:{color:"#475569",fontSize:13,marginBottom:20},
  pinDots:{display:"flex",gap:14,marginBottom:8},
  dot:{width:14,height:14,borderRadius:"50%",border:`2px solid ${BORDER}`,transition:"background 0.15s"},
  pinErr:{color:"#f87171",fontSize:13,marginBottom:8},
  numpad:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,width:"100%",marginBottom:10},
  numBtn:{background:"#131f30",border:`1px solid ${BORDER}`,borderRadius:12,padding:"16px 0",fontSize:22,fontWeight:700,color:"#f1f5f9",cursor:"pointer"},
  numEmpty:{background:"transparent",border:"none",cursor:"default"},

  kpi:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"12px 6px",textAlign:"center"},
  kpiN:{fontWeight:900,letterSpacing:"-0.5px"},
  kpiL:{fontSize:10,color:"#475569",marginTop:2,textTransform:"uppercase",letterSpacing:"0.05em"},

  pipeline:{display:"flex",alignItems:"center",background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"12px 8px",marginBottom:12,overflowX:"auto",gap:0},
  pipeItem:{display:"flex",flexDirection:"column",alignItems:"center",flex:1,cursor:"pointer",gap:3},
  pipeDot:{width:28,height:28,borderRadius:"50%",border:"2px solid",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:"#f1f5f9",transition:"all 0.2s"},

  activeFilt:{margin:"0 0 10px",padding:"8px 14px",borderRadius:10,border:"1px solid",fontSize:13,fontWeight:700,display:"flex",alignItems:"center"},
  searchBox:{position:"relative",marginBottom:12},
  searchInput:{width:"100%",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 36px",color:"#e2e8f0",fontSize:14,outline:"none",boxSizing:"border-box"},

  clientCard:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,marginBottom:8,cursor:"pointer",display:"flex",overflow:"hidden"},
  cardBar:{width:4,flexShrink:0},
  cardContent:{flex:1,padding:"13px 12px"},
  cardNum:{fontWeight:900,fontSize:12,color:ACCENT,background:"#0a1e30",borderRadius:6,padding:"2px 8px",display:"inline-block"},
  cardName:{fontWeight:800,fontSize:16,color:"#f1f5f9",margin:"6px 0 3px"},
  cardAddr:{fontSize:12,color:"#475569",marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
  cardMeta:{display:"flex",flexWrap:"wrap",gap:"3px 14px",fontSize:12,color:"#64748b"},
  badge:{fontSize:11,fontWeight:700,borderRadius:99,padding:"3px 10px",border:"1px solid",whiteSpace:"nowrap"},
  progressWrap:{height:3,background:BORDER,borderRadius:99,marginTop:8,overflow:"hidden"},
  progressBar:{height:"100%",background:`linear-gradient(90deg,${ACCENT},#34d399)`,borderRadius:99,transition:"width 0.5s"},
  empty:{textAlign:"center",color:"#1e2a3a",padding:"50px 0",fontSize:14},

  detHead:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:"18px 16px"},
  detName:{fontWeight:900,fontSize:24,color:"#f1f5f9",letterSpacing:"-0.8px",margin:"8px 0 4px"},
  detSub:{fontSize:13,color:"#475569",marginBottom:8},
  detMeta:{display:"flex",flexWrap:"wrap",gap:"4px 16px",fontSize:13,color:"#64748b"},
  steps:{display:"flex",alignItems:"center",marginTop:16},
  stepDot:{width:22,height:22,borderRadius:"50%",border:"2px solid",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0,transition:"all 0.3s"},
  waBtn:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",marginTop:14,padding:"12px 0",background:"#0d2b22",color:"#25d366",border:"1px solid #128c7e55",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer"},

  tabs:{display:"flex",borderBottom:`1px solid ${BORDER}`,marginTop:14,overflowX:"auto"},
  tab:{flex:1,background:"none",border:"none",borderBottom:"2px solid transparent",padding:"11px 4px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"},

  card:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"16px",marginBottom:12,marginTop:12},
  cardTitle:{fontWeight:800,fontSize:15,color:"#f1f5f9",marginBottom:14},
  lbl:{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"},
  miniLbl:{display:"block",fontSize:10,fontWeight:700,color:"#475569",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.04em"},
  inp:{width:"100%",background:BG,border:`1px solid #1a2845`,borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none",boxSizing:"border-box"},

  resumen:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"14px 16px",marginTop:4},

  modoCard:{display:"flex",alignItems:"center",gap:14,background:BG,border:`1px solid ${BORDER}`,borderRadius:14,padding:"16px",cursor:"pointer",width:"100%"},

  abCard:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"14px",marginBottom:10},

  fotoBtn:{display:"flex",alignItems:"center",gap:6,background:"#131f30",color:"#94a3b8",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 16px",fontWeight:600,fontSize:13,cursor:"pointer"},
  fotoGrid:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8},
  fotoThumb:{aspectRatio:"1",borderRadius:10,overflow:"hidden",cursor:"pointer",position:"relative",background:"#131f30"},

  lightOverlay:{position:"fixed",inset:0,background:"#000000ee",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
  lightImg:{maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"},
  lightClose:{position:"fixed",top:20,right:20,background:"#1e2a3a",border:"none",color:"#f1f5f9",fontSize:18,borderRadius:"50%",width:38,height:38,cursor:"pointer"},

  // ── compartidos con la planilla ──
  tipoBtn:{background:"none",border:`1px solid ${BORDER}`,borderRadius:10,padding:"6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",width:"100%"},
  dimInput:{background:BG,border:`1px solid ${BORDER}`,borderRadius:7,padding:"8px 9px",color:"#e2e8f0",fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"},
  minInput:{background:BG,border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 4px",color:"#e2e8f0",fontSize:12,outline:"none",width:40,textAlign:"center"},
  sel:{background:BG,border:`1px solid ${BORDER}`,borderRadius:7,padding:"8px 6px",color:"#e2e8f0",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"},
  delBtn:{background:"transparent",border:`1px solid #450a0a`,color:"#f87171",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,alignSelf:"flex-start"},

  totales:{display:"flex",gap:12,justifyContent:"flex-end",marginTop:14,paddingTop:12,borderTop:`1px solid ${BORDER}`},
  totalItem:{background:BG,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 16px",textAlign:"center",minWidth:110},
  totalLbl:{display:"block",fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4},
  totalVal:{display:"block",fontSize:20,fontWeight:900},

  overlay:{position:"fixed",inset:0,background:"#000000cc",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:12},
  modal:{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"20px 20px 0 0",padding:"20px 16px",width:"100%",maxWidth:700,maxHeight:"90vh",overflowY:"auto"},
  modalTitle:{fontWeight:800,fontSize:17,color:"#f1f5f9"},
  catLbl:{fontSize:12,fontWeight:700,color:ACCENT,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10},
  tiposGrid:{display:"flex",flexWrap:"wrap",gap:10,marginBottom:6},
  tipoCard:{background:BG,border:`1px solid ${BORDER}`,borderRadius:12,padding:"10px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",minWidth:100},

  primaryBtn:{background:ACCENT,color:BG,border:"none",borderRadius:10,padding:"11px 20px",fontWeight:800,fontSize:14,cursor:"pointer"},
  ghostBtn:{background:"transparent",color:"#64748b",border:`1px solid ${BORDER}`,borderRadius:10,padding:"9px 14px",fontWeight:600,fontSize:13,cursor:"pointer"},
  btnAdd:{background:"#0d2b22",color:"#25d366",border:"1px solid #128c7e55",borderRadius:10,padding:"10px 14px",fontWeight:700,fontSize:13,cursor:"pointer"},
};
