import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase.js';

/* ═══════════════════════════════════════════════════════════
   AberBorges CRM — Sistema de gestión de obras
   Aberturas Borges · con Planilla de Medición integrada
═══════════════════════════════════════════════════════════ */

const LOGO_B64 = "data:image/jpeg;base64,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";

const BRAND  = "ABERBORGES CRM";
const ACCENT = "#00b4d8";
const BG     = "#090e18";
const CARD   = "#0d1626";
const BORDER = "#162035";

const ROLES = {
  vendedor:       { key:"vendedor",       label:"Medidor",        icon:"📐",  pin:"",     color:ACCENT,    sinPin:true },
  fabrica:        { key:"fabrica",        label:"Fabricación",    icon:"🏗️", pin:"",     color:"#fb923c", sinPin:true },
  presupuestador: { key:"presupuestador", label:"Presupuesto",    icon:"💰",  pin:"7777", color:"#34d399" },
  deudores:       { key:"deudores",       label:"Deudores",       icon:"💳",  pin:"7777", color:"#f43f5e" },
  admin:          { key:"admin",          label:"Administrador",  icon:"⚙️",  pin:"7777", color:"#f59e0b" },
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

// ── Service Worker para modo offline ──
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}

// Hora uruguaya (UTC-3)
const UY_OFFSET = -3 * 60;
const nowUY = () => {
  const d = new Date();
  return new Date(d.getTime() + (UY_OFFSET - (-d.getTimezoneOffset())) * 60000);
};
const today = () => {
  const d = nowUY();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const nowTimeUY = () => {
  const d = nowUY();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
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
      {id:"cat_int", label:"Catalana Interior", desc:"Cajón y enrollador al interior del muro."},
      {id:"cat_ext", label:"Catalana Exterior", desc:"Cajón y enrollador al exterior del muro."},
      {id:"cat_sol", label:"Solapado",           desc:"Cajón exterior lateral, enrollador sobresale."},
    ],
  },
  {
    id:"mampara_std", label:"Mampara Standard",     icon:"🚿", categoria:"mampara",
    configs:[{id:"mamp_std", label:"Standard",  desc:"Sistema con perfiles de aluminio, placa acrílica."}],
  },
  {
    id:"mampara_f1",  label:"Mampara Frontal F1",  icon:"🚿", categoria:"mampara",
    configs:[{id:"mamp_f1", label:"F1 — 1 fija + 1 corrediza", desc:"Una hoja fija y una corrediza."}],
  },
  {
    id:"mampara_l",   label:"Mampara en L",         icon:"🚿", categoria:"mampara",
    configs:[
      {id:"mamp_l_fc", label:"Fija + Corrediza", desc:"Un lateral fijo y el frontal corredizo."},
      {id:"mamp_l_cc", label:"2 Corredizas",     desc:"Ambos lados corredizos."},
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

  // ── PUERTA BATIENTE ──────────────────────────────────────
  if (tipoId === "puerta_batiente") {
    const doble   = configId?.startsWith("pb2h");
    const ext     = configId?.endsWith("_ext");
    const izq     = configId?.includes("hi") || configId?.includes("_i_");
    const bisLeft = ext ? !izq : izq;

    const Hoja = ({gx, gw, gy, gh, bL, exterior}) => {
      // Pivot point
      const px = bL ? gx : gx+gw;
      const py = gy;
      // Arc endpoint — punto final del arco de barrido
      const ax = bL ? gx+gw : gx;
      const ay = gy + gh * 0.85;
      // Color del arco
      const arcColor = exterior ? "#e2e8f0" : "#60a5fa";
      return <>
        <Glass x={gx} y={gy} rw={gw} rh={gh}/>
        {/* Arco de barrido */}
        <path
          d={`M ${px},${py} L ${ax},${py} A ${gw},${gh} 0 0,${bL?1:0} ${px},${ay}`}
          stroke={arcColor} strokeWidth={1.2}
          strokeDasharray={exterior?"none":"5,3"}
          fill={arcColor+"18"}/>
        {/* Bisagras */}
        <rect x={px-2} y={gy+gh*0.15} width={4} height={6} rx={1} fill={GS+"cc"}/>
        <rect x={px-2} y={gy+gh*0.70} width={4} height={6} rx={1} fill={GS+"cc"}/>
        {/* Manija */}
        <rect x={bL?gx+gw-8:gx+2} y={gy+gh*0.44} width={7} height={gh*0.12} rx={2.5} fill={GS+"bb"}/>
      </>;
    };

    const lbl = doble
      ? (ext?"Ext. 2 hojas":"Int. 2 hojas")
      : (ext?(izq?"Ext. Izq":"Ext. Der"):(izq?"Int. Izq":"Int. Der"));

    return <svg width={w} height={h}>
      <Cajon/>
      <rect x={0} y={fy} width={fw} height={fh} rx={1} fill={AL} stroke={FR} strokeWidth={2.5}/>
      {doble
        ?<>
          <Hoja gx={fx(2)} gw={fx(46)} gy={fy2(2)} gh={fh*0.96} bL={true}  exterior={ext}/>
          <Hoja gx={fx(52)} gw={fx(46)} gy={fy2(2)} gh={fh*0.96} bL={false} exterior={ext}/>
        </>
        :<Hoja gx={fx(2)} gw={fx(96)} gy={fy2(2)} gh={fh*0.96} bL={bisLeft} exterior={ext}/>
      }
      <text x={fw/2} y={h-1} textAnchor="middle" fontSize={6}
        fill={ext?"#e2e8f0aa":"#60a5faaa"} fontWeight="600">{lbl}</text>
    </svg>;
  }

  // ── PUERTA MEDIO VIDRIO ───────────────────────────────────
  if (tipoId === "puerta_mv") {
    const ext     = configId?.endsWith("_ext");
    const izq     = configId?.includes("_i_") || configId?.includes("hi");
    const bisLeft = ext ? !izq : izq;
    const gx=fx(2), gw=fx(96), gy=fy2(2), gh=fh*0.96;
    const midY = gy + gh*0.5;
    const px  = bisLeft ? gx : gx+gw;
    const ax  = bisLeft ? gx+gw : gx;
    const arcColor = ext ? "#e2e8f0" : "#60a5fa";
    return <svg width={w} height={h}>
      <Cajon/>
      <rect x={0} y={fy} width={fw} height={fh} rx={1} fill={AL} stroke={FR} strokeWidth={2.5}/>
      {/* Mitad superior — vidrio */}
      <Glass x={gx} y={gy} rw={gw} rh={gh*0.5}/>
      <DiagX x={gx} y={gy} rw={gw} rh={gh*0.5}/>
      {/* Mitad inferior — panel opaco con lamas */}
      <rect x={gx} y={midY} width={gw} height={gh*0.5} fill={AL+"cc"} stroke={GS+"88"} strokeWidth={1.2}/>
      <Lamas x={gx+2} y={midY+3} rw={gw-4} rh={gh*0.5-6} n={5}/>
      {/* Arco de barrido */}
      <path d={`M ${px},${gy} L ${ax},${gy} A ${gw},${gh} 0 0,${bisLeft?1:0} ${px},${gy+gh*0.82}`}
        stroke={arcColor} strokeWidth={1.2}
        strokeDasharray={ext?"none":"5,3"}
        fill={arcColor+"15"}/>
      {/* Bisagras */}
      <rect x={px-2} y={gy+gh*0.12} width={4} height={6} rx={1} fill={GS+"cc"}/>
      <rect x={px-2} y={gy+gh*0.68} width={4} height={6} rx={1} fill={GS+"cc"}/>
      {/* Manija */}
      <rect x={bisLeft?gx+gw-8:gx+2} y={gy+gh*0.42} width={7} height={gh*0.12} rx={2.5} fill={GS+"bb"}/>
      <text x={fw/2} y={h-1} textAnchor="middle" fontSize={6}
        fill={ext?"#e2e8f0aa":"#60a5faaa"} fontWeight="600">
        {ext?(izq?"Ext. Izq":"Ext. Der"):(izq?"Int. Izq":"Int. Der")}
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
  // ── MAMPARA DE BAÑO ──────────────────────────────────────
  if (tipoId === "mampara_f1" || tipoId === "mampara_std") {
    // Vista frontal: marco exterior, paño fijo izquierda, paño corredizo derecha, guías
    const bw = fw;
    const bh = h;
    const frameT = 3;  // grosor marco
    const midX = bw * 0.50; // divisor central
    const guiaH = bh * 0.06;
    const glassColor = "#7dd3fc22";
    const glassStroke = "#7dd3fc66";
    return (
      <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        {/* Marco exterior */}
        <rect x={0} y={0} width={bw} height={bh} fill="none" stroke={AL} strokeWidth={frameT} rx={1}/>
        {/* Paño fijo - izquierda */}
        <rect x={frameT} y={frameT} width={midX - frameT*1.5} height={bh - guiaH - frameT*2}
          fill={glassColor} stroke={glassStroke} strokeWidth={1}/>
        {/* Paño corredizo - derecha */}
        <rect x={midX + frameT*0.5} y={frameT} width={bw - midX - frameT*1.5} height={bh - guiaH - frameT*2}
          fill={glassColor} stroke={glassStroke} strokeWidth={1.5} strokeDasharray="0"/>
        {/* Perfil central (divisor) */}
        <rect x={midX - frameT*0.5} y={frameT} width={frameT} height={bh - guiaH - frameT*2}
          fill={AL} stroke={FR} strokeWidth={0.5}/>
        {/* Guía inferior */}
        <rect x={frameT} y={bh - guiaH - frameT} width={bw - frameT*2} height={guiaH}
          fill={AL} stroke={FR} strokeWidth={0.8}/>
        {/* Rodamientos guía inferior */}
        <circle cx={bw * 0.25} cy={bh - guiaH/2 - frameT} r={guiaH*0.35} fill={FR} stroke={GS} strokeWidth={0.6}/>
        <circle cx={bw * 0.45} cy={bh - guiaH/2 - frameT} r={guiaH*0.35} fill={FR} stroke={GS} strokeWidth={0.6}/>
        {/* Flecha corredizo */}
        <text x={midX + (bw-midX)/2} y={bh*0.5} textAnchor="middle" fontSize={8} fill={GS}>←</text>
        {/* Label tipo */}
        <text x={bw/2} y={bh - 1} textAnchor="middle" fontSize={6} fill={GS} fontWeight="600">
          {tipoId==="mampara_f1"?"F1":"Std"}
        </text>
      </svg>
    );
  }

  if (tipoId !== "catalana") return <svg width={w} height={h}>
    <Frame/>
    <rect x={fx(4)} y={fy2(4)} width={fx(92)} height={fh*0.90}
      fill={GL+"55"} stroke={GS+"55"} strokeWidth={1}/>
    <Lamas x={fx(4)} y={fy2(4)} rw={fx(92)} rh={fh*0.90} n={6}/>
    <DiagSingle x={fx(4)} y={fy2(4)} rw={fx(92)} rh={fh*0.90}/>
  </svg>;

  // ── PERSIANA CATALANA — imagen técnica embebida ─────────
  // Imagen 1111x840 | Exterior: 0-310 | Interior: 335-645 | Solapado: 650-1111
  const DATA_URI_CAT = "data:image/png;base64,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";

  if (configId === "cat_ext") {
    return (
      <svg width={w} height={h} viewBox="0 0 310 700" preserveAspectRatio="xMidYMid meet">
        <image href={DATA_URI_CAT} x="0" y="0" width="1111" height="840"/>
      </svg>
    );
  }

  if (configId === "cat_int") {
    return (
      <svg width={w} height={h} viewBox="335 0 310 700" preserveAspectRatio="xMidYMid meet">
        <image href={DATA_URI_CAT} x="0" y="0" width="1111" height="840"/>
      </svg>
    );
  }

  // cat_sol — Por fuera de la mucheta
  return (
    <svg width={w} height={h} viewBox="650 0 461 700" preserveAspectRatio="xMidYMid meet">
      <image href={DATA_URI_CAT} x="0" y="0" width="1111" height="840"/>
    </svg>
  );
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

  // Nombre
  if (f.tipo==="mampara_std") {
    parts.push(`${f.num}) Mampara Estándar de Aluminio con Acrílico`);
  } else if (f.tipo==="persiana") {
    parts.push(`${f.num}) Persiana Catalana`);
  } else {
    parts.push(`${f.num}) ${t?.label||"?"}${c?" "+c.label:""}`);
  }

  // Medidas según tipo
  if (f.tipo==="mampara_l") {
    // Mampara en L: frontal × lateral × alto
    parts.push(`F${f.anchoFrontal||"?"}×L${f.anchoLat||"?"}×H${f.alto||"?"}cm`);
  } else if (f.paredIrregular && (f.anchoSup||f.anchoInf)) {
    // Pared irregular: sup / inf × alto
    parts.push(`Sup ${f.anchoSup||"?"}cm / Inf ${f.anchoInf||"?"}cm × ${f.alto||"?"}cm`);
  } else if (f.ancho||f.anchoSup||f.alto) {
    // Normal
    const w = f.ancho||f.anchoSup||"?";
    parts.push(`${w}×${f.alto||"?"}cm`);
  }

  if (f.cantidad && f.cantidad!=="1") parts.push(`×${f.cantidad}`);
  if (f.serie) parts.push(f.serie + (f.divisor?" c/divisor":"") + (f.monoblock?" c/Monoblock":""));

  // Mampara std — acrílico
  if (f.tipo==="mampara_std") {
    if (f.mamAcriColor) parts.push(`Acrílico ${f.mamAcriColor}`);
    if (f.mamAcriDiseno) parts.push(f.mamAcriDiseno);
    if (f.mamColor) parts.push(`Marco ${f.mamColor}`);
  }
  // Mampara f1/l — color
  if (f.tipo==="mampara_f1"||f.tipo==="mampara_l") {
    if (f.mamColor) parts.push(f.mamColor);
    if (f.mamDiseno) parts.push(f.mamDiseno);
  }
  // Persiana — lama y cajón
  if (f.tipo==="persiana") {
    if (f.catLama) parts.push(`Lama de ${f.catLama}`);
    if (f.catColor) parts.push(f.catColor);
    if (f.alto) { const cm=parseFloat(f.alto); if(cm) parts.push(`Cajón ${cm<=160?"15.5":"18.5"}cm`); }
  }

  if (f.relleno) { const r=RELLENOS.find(r=>r.id===f.relleno); if(r) parts.push(r.label); }
  if (f.color && !["mampara_std","mampara_f1","mampara_l","persiana"].includes(f.tipo)) parts.push(f.color);
  const vt = vidrioTexto(f.vidrio); if (vt) parts.push(vt);
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

      lineas.push(`*${aberturaResumen(a)}*`);

      // Descripción técnica de serie (sin repetir vidrio)
      if (a.serie && SERIE_DESC[a.serie]) {
        lineas.push(`   📌 ${SERIE_DESC[a.serie]}`);
      }

      // Detalle de persiana catalana o monoblock — lama y color
      if (a.tipo==="persiana" || a.monoblock) {
        const detalles = [];
        if (a.catLama) detalles.push(`Lama de ${a.catLama}`);
        if (a.catColor) detalles.push(`Color ${a.catColor}`);
        if (detalles.length>0) lineas.push(`   🏠 ${detalles.join(" · ")}`);
      }

      // Precio combinado ventana + monoblock — sin desglose
      if (precio>0 || precioMono>0) {
        const precioUnitario = precio + precioMono;
        lineas.push(`   💲 $${Number(precioUnitario).toLocaleString("es-UY")} × ${cant} = *$${Number(precioUnitario*cant).toLocaleString("es-UY")}*`);
      }
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

  // Cargar datos al iniciar y re-sincronizar al volver online
  useEffect(()=>{
    cargarDatos();
    // Cuando vuelve internet, sincronizar automáticamente
    const onOnline = () => {
      console.log("Conexión recuperada — sincronizando...");
      cargarDatos();
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  },[]);

  // ── localStorage para modo offline ──
  const LS_CLIENTES = "ab_clientes";
  const LS_AGENDA   = "ab_agenda";
  const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} };
  const lsGet = (key) => { try { const d=localStorage.getItem(key); return d?JSON.parse(d):null; } catch(e){ return null; } };

  const cargarDatos = async () => {
    // 1. Mostrar datos locales inmediatamente
    const localCls = lsGet(LS_CLIENTES);
    const localAg  = lsGet(LS_AGENDA);
    if (localCls && localCls.length > 0) { setClientes(localCls); setDbReady(true); }
    if (localAg  && localAg.length  > 0)   setAgenda(localAg);

    // 2. Sincronizar con Supabase — MERGE inteligente
    try {
      const [{ data: cls, error: e1 }, { data: ag, error: e2 }] = await Promise.all([
        supabase.from('clientes').select('*').order('num_cliente'),
        supabase.from('agenda').select('*').order('created_at'),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;

      // MERGE: combinar Supabase + local, local gana cuando Supabase no tiene el registro
      const remCls = (cls||[]).map(r => r.data).filter(Boolean);
      const mergedCls = localCls && localCls.length > 0
        ? (() => {
            // Empezar con Supabase como base
            const mapaRemoto = {};
            remCls.forEach(c => mapaRemoto[c.id] = c);
            // Agregar/sobreescribir con locales que no están en Supabase
            localCls.forEach(c => { if (!mapaRemoto[c.id]) mapaRemoto[c.id] = c; });
            return Object.values(mapaRemoto).sort((a,b)=>(a.numCliente||0)-(b.numCliente||0));
          })()
        : remCls;

      if (mergedCls.length > 0) {
        setClientes(mergedCls);
        lsSet(LS_CLIENTES, mergedCls);
        // Subir a Supabase los que faltan
        const idsRemoto = new Set(remCls.map(c=>c.id));
        const faltanEnSupabase = mergedCls.filter(c => !idsRemoto.has(c.id));
        if (faltanEnSupabase.length > 0) {
          await supabase.from('clientes').upsert(
            faltanEnSupabase.map(c => ({ id: c.id, num_cliente: c.numCliente, data: c })),
            { onConflict: 'id' }
          );
        }
      }

      const remAg = (ag||[]).map(r => r.data).filter(Boolean);
      const localAg2 = lsGet(LS_AGENDA);
      const mergedAg = localAg2 && localAg2.length > 0
        ? (() => {
            const mapaRem = {};
            remAg.forEach(v => mapaRem[v.id] = v);
            localAg2.forEach(v => { if (!mapaRem[v.id]) mapaRem[v.id] = v; });
            return Object.values(mapaRem);
          })()
        : remAg;
      if (mergedAg.length > 0) { setAgenda(mergedAg); lsSet(LS_AGENDA, mergedAg); }

      setDbReady(true);
    } catch(e) {
      console.error('Sin conexión — usando datos locales');
      setDbReady(true);
    }
  };

  // Guardar UN cliente (localStorage + Supabase)
  const persistCliente = async (cliente) => {
    // Siempre guardar local primero
    setClientes(prev => {
      const nuevos = prev.find(c=>c.id===cliente.id)
        ? prev.map(c=>c.id===cliente.id?cliente:c)
        : [...prev, cliente];
      lsSet(LS_CLIENTES, nuevos);
      return nuevos;
    });
    // Luego intentar Supabase
    try {
      const { error } = await supabase.from('clientes').upsert(
        { id: cliente.id, num_cliente: cliente.numCliente, data: cliente },
        { onConflict: 'id' }
      );
      if (error) throw error;
    } catch(e) { console.error('Sin internet — guardado local:', e); }
  };

  // Guardar lista completa (localStorage + Supabase)
  const persistClientes = async (nuevos) => {
    setClientes(nuevos);
    lsSet(LS_CLIENTES, nuevos);
    if (nuevos.length === 0) return;
    try {
      const { error } = await supabase.from('clientes').upsert(
        nuevos.map(c => ({ id: c.id, num_cliente: c.numCliente, data: c })),
        { onConflict: 'id' }
      );
      if (error) throw error;
    } catch(e) { console.error('Sin internet — guardado local:', e); }
  };

  const deleteCliente = async (id) => {
    const nuevos = clientes.filter(c => c.id !== id);
    setClientes(nuevos);
    lsSet(LS_CLIENTES, nuevos);
    try { await supabase.from('clientes').delete().eq('id', id); }
    catch(e) { console.error('Error eliminando:', e); }
  };

  const saveAgenda = async (nuevaAgenda) => {
    setAgenda(nuevaAgenda);
    lsSet(LS_AGENDA, nuevaAgenda);
    try {
      await supabase.from('agenda').delete().neq('id','__none__');
      if (nuevaAgenda.length > 0) {
        await supabase.from('agenda').insert(
          nuevaAgenda.map(v => ({ id: String(v.id), data: v }))
        );
      }
    } catch(e) { console.error('Sin internet — agenda guardada local:', e); }
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
        <div style={{...S.hRight,flexWrap:"wrap",gap:6,justifyContent:"flex-end"}}>
          {view==="lista"&&(
            <button style={S.ghostBtn} onClick={()=>setView("agenda")}>📅 Agenda</button>
          )}
          {view==="lista"&&(
            <button style={{...S.ghostBtn,borderColor:"#34d39955",color:"#34d399"}}
              onClick={()=>setView("obras")}>📦 Obras</button>
          )}
          {view==="lista"&&(role==="presupuestador"||role==="admin"||role==="deudores")&&(
            <button style={{...S.ghostBtn,borderColor:"#f43f5e55",color:"#f43f5e"}}
              onClick={()=>setView("deudores")}>💳 Deudores</button>
          )}
          {view==="lista"&&(role==="vendedor"||role==="admin"||role==="presupuestador")&&(
            <button style={S.primaryBtn} onClick={()=>{
              setSelected({id:"n"+Date.now(),numCliente:Math.max(0,...clientes.map(c=>c.numCliente||0))+1,
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
          onSelect={c=>{setSelected(c);setView("detalle");}}
          onUpdate={async u=>{setClientes(prev=>prev.map(c=>c.id===u.id?u:c));await persistCliente(u);}}
          showToast={showToast}/>
      )}
      {view==="obras"&&(
        <ObrasActivasView
          clientes={clientes}
          onSelect={c=>{setSelected(c);setView("detalle");}}
          onUpdate={async u=>{setClientes(prev=>prev.map(c=>c.id===u.id?u:c));await persistCliente(u);}}
          onBack={()=>setView("lista")}
          showToast={showToast}/>
      )}
      {(view==="lista"&&role==="deudores")||(view==="deudores")?(
        <DeudoresView showToast={showToast}/>
      ):null}
      {view==="lista"&&role!=="fabrica"&&role!=="deudores"&&(
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
          onUpdateCliente={async updated=>{
            setClientes(prev=>prev.map(c=>c.id===updated.id?{...c,...updated}:c));
            await persistCliente({...clientes.find(c=>c.id===updated.id),...updated});
          }}
          showToast={showToast}/>
      )}
      {view==="deudores"&&(
        <DeudoresView showToast={showToast}/>
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
            // Actualizar lista sin reinicializar DetailView (no hacer setSelected)
            setClientes(prev=>prev.map(c=>c.id===u.id?u:c));
            // Actualizar selected en background para que si vuelve a la lista esté actualizado
            setSelected(prev=>prev?.id===u.id?u:prev);
            await persistCliente(u);
            showToast("Guardado ✓");
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
  const [editandoId, setEditandoId]   = useState(null);

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
  const noEstaba        = id => onSave(agenda.map(v=>v.id===id?{...v,noEstaba:true,realizada:false}:v));
  const editarVisita    = (id, changes) => onSave(agenda.map(v=>v.id===id?{...v,...changes}:v));
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
          {v.nota&&<div style={{color:"#475569",fontSize:11,fontStyle:"italic",marginTop:3}}>📝 "{v.nota}"</div>}
          {v.noEstaba&&<div style={{color:"#f59e0b",fontSize:11,fontWeight:700,marginTop:3}}>⚠️ Cliente no estaba</div>}
          {editandoId===v.id?(
            <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
              <div style={{display:"flex",gap:6}}>
                <div style={{flex:1}}>
                  <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:2}}>NUEVA FECHA</label>
                  <input type="date" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:7,padding:"7px 8px",color:"#e2e8f0",fontSize:13,outline:"none"}}
                    defaultValue={v.fecha} id={`ef_${v.id}`}/>
                </div>
                <div style={{flex:1}}>
                  <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:2}}>NUEVA HORA</label>
                  <input type="time" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:7,padding:"7px 8px",color:"#e2e8f0",fontSize:13,outline:"none"}}
                    defaultValue={v.hora} id={`eh_${v.id}`}/>
                </div>
              </div>
              <input style={{background:"#090e18",border:"1px solid #1a2845",borderRadius:7,padding:"7px 8px",color:"#e2e8f0",fontSize:13,outline:"none"}}
                placeholder="Nota (opcional)" defaultValue={v.nota||""} id={`en_${v.id}`}/>
              <div style={{display:"flex",gap:6}}>
                <button style={{flex:2,background:"#00b4d8",color:"#090e18",border:"none",borderRadius:7,padding:"9px",fontWeight:700,fontSize:12,cursor:"pointer"}}
                  onClick={()=>{
                    const f=document.getElementById(`ef_${v.id}`)?.value||v.fecha;
                    const h=document.getElementById(`eh_${v.id}`)?.value||v.hora;
                    const n=document.getElementById(`en_${v.id}`)?.value||"";
                    editarVisita(v.id,{fecha:f,hora:h,nota:n,noEstaba:false});
                    setEditandoId(null);
                  }}>✓ Guardar cambios</button>
                <button style={{flex:1,background:"transparent",border:"1px solid #334155",borderRadius:7,padding:"9px",color:"#64748b",fontSize:12,cursor:"pointer"}}
                  onClick={()=>setEditandoId(null)}>Cancelar</button>
              </div>
            </div>
          ):(
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              {v.clienteTelefono&&(
                <a href={`https://wa.me/598${v.clienteTelefono.replace(/\D/g,"")}?text=${encodeURIComponent(`Hola ${v.clienteNombre||""}, te confirmo la visita de hoy a las ${v.hora} hs. Saludos, Aberturas Borges.`)}`}
                  target="_blank" rel="noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:5,background:"#0d2b22",color:"#25d366",border:"1px solid #128c7e55",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,textDecoration:"none"}}>
                  💬 WA
                </a>
              )}
              {!v.realizada&&<button style={{background:"#052e1c",border:"1px solid #10b98155",color:"#34d399",borderRadius:8,padding:"5px 9px",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>marcarVisitada(v.id)}>✅ Realizada</button>}
              {v.realizada&&<button style={{background:"transparent",border:"1px solid #1e2535",color:"#64748b",borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}} onClick={()=>desmarcar(v.id)}>↩ Desmarcar</button>}
              <button style={{background:"#1a1a0a",border:"1px solid #854d0e",color:"#fbbf24",borderRadius:8,padding:"5px 9px",fontSize:11,fontWeight:600,cursor:"pointer"}}
                onClick={()=>noEstaba(v.id)}>👻 No estaba</button>
              <button style={{background:"#0a1a2a",border:"1px solid #1e40af",color:"#60a5fa",borderRadius:8,padding:"5px 9px",fontSize:11,fontWeight:600,cursor:"pointer"}}
                onClick={()=>setEditandoId(v.id)}>✏️ Editar</button>
              <button style={{background:"transparent",border:"1px solid #450a0a",color:"#f87171",borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}} onClick={()=>eliminar(v.id)}>✕</button>
            </div>
          )}
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

          {/* Resultados de búsqueda — click para seleccionar y cargar en formulario */}
          {searchTel&&clientesFiltrados.length>0&&(
            <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:12,marginTop:6,overflow:"hidden"}}>
              {clientesFiltrados.slice(0,5).map((c,i)=>(
                <div key={c.id}
                  style={{padding:"12px 14px",borderBottom:i<Math.min(clientesFiltrados.length,5)-1?"1px solid #0c1525":"none",cursor:"pointer",transition:"background 0.15s",background:form.clienteId===c.id?"#0a2a1a":"transparent"}}
                  onClick={()=>{setForm(p=>({...p,clienteId:c.id}));setModo("nueva");}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontWeight:700,color:form.clienteId===c.id?"#34d399":"#f1f5f9",fontSize:14}}>{c.nombre}</div>
                    {form.clienteId===c.id&&<span style={{color:"#34d399",fontSize:11,fontWeight:700}}>✓ Seleccionado</span>}
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:3,flexWrap:"wrap"}}>
                    {c.telefono&&<span style={{color:"#00b4d8",fontSize:13}}>📞 {c.telefono}</span>}
                    {c.direccion&&<span style={{color:"#64748b",fontSize:12}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</span>}
                  </div>
                  {agenda.filter(v=>v.clienteId===c.id&&!v.realizada).length>0&&(
                    <div style={{marginTop:4}}>
                      {agenda.filter(v=>v.clienteId===c.id&&!v.realizada).sort((a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora)).slice(0,2).map(v=>(
                        <div key={v.id} style={{fontSize:11,color:"#94a3b8",marginTop:1}}>
                          📅 {v.fecha.split("-").reverse().join("/")} {v.hora}hs{v.nota?` — "${v.nota}"` :""}
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

            {/* SELECTOR CLIENTE — usa el buscador superior, autocompletado */}
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Cliente * — buscá arriba por teléfono o nombre</label>
              <select style={{width:"100%",background:"#090e18",border:`1px solid ${form.clienteId?"#00b4d8":"#1a2845"}`,borderRadius:9,padding:"10px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                value={form.clienteId} onChange={e=>{setForm(p=>({...p,clienteId:e.target.value}));setErr("");}}>
                <option value="">— seleccionar cliente —</option>
                {(searchTel?clientesFiltrados:[...clientes]).sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(c=>(
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
function ObrasActivasView({ clientes, onSelect, onUpdate, onBack, showToast }) {
  const fmtF = d => { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };
  const TIPOS_LABEL = {corrediza:"Ventana Corrediza",proyectante:"Ventana Proyectante",batiente:"Ventana Batiente",puerta_corrediza:"Puerta Corrediza",puerta_batiente:"Puerta Batiente",fijo:"Paño Fijo",mampara_std:"Mampara Estándar",mampara_f1:"Mampara F1",mampara_l:"Mampara en L",persiana:"Persiana Catalana"};

  const obras = clientes
    .filter(c=>(c.status==="aprobado"||c.status==="en_produccion")&&(c.aberturas||[]).length>0)
    .sort((a,b)=>(a.nombre||"").localeCompare(b.nombre||""));

  const ObraCard = ({c}) => {
    const [expandida, setExpandida] = useState(false);
    const [seleccionadas, setSeleccionadas] = useState({});
    const aberturas=(c.aberturas||[]).filter(a=>(c.estadosAb||{})[a.id]!=="cancelada");
    const entregadas=aberturas.filter(a=>(c.entregasAb||{})[a.id]);
    const pendientes=aberturas.filter(a=>!(c.entregasAb||{})[a.id]);
    const pct=aberturas.length>0?Math.round(entregadas.length/aberturas.length*100):0;

    const marcarEntregadas=async()=>{
      const selIds=Object.keys(seleccionadas).filter(k=>seleccionadas[k]);
      if(!selIds.length){showToast("Seleccioná al menos una","err");return;}
      const nuevasEntregas={...(c.entregasAb||{})};
      const aEntregarAhora=[];
      aberturas.forEach(a=>{if(seleccionadas[a.id]){nuevasEntregas[a.id]={fecha:today(),hora:nowTimeUY()};aEntregarAhora.push(a);}});
      const todasEntregadas=aberturas.every(a=>nuevasEntregas[a.id]);
      const actualizado={...c,entregasAb:nuevasEntregas,status:todasEntregadas?"entregado":c.status,...(todasEntregadas&&!c.fechaCompletada?{fechaCompletada:today()}:{})};
      await onUpdate(actualizado);
      setSeleccionadas({});
      showToast(todasEntregadas?"✅ Obra completada":"Entrega registrada ✓");
      if(c.telefono){
        const pendientesRest=aberturas.filter(a=>!nuevasEntregas[a.id]);
        const lineas=[`📦 *ENTREGA — Aberturas Borges*`,`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,`👤 *${c.nombre}*`,`📅 ${fmtF(today())} · ${nowTimeUY()}hs`,``,`✅ *Entregado hoy:*`,...aEntregarAhora.map(a=>`   • ${TIPOS_LABEL[a.tipo]||a.tipo} · ${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm · ×${a.cantidad||1}${a.color?` · ${a.color}`:""}${a.serie?` · ${a.serie}`:""}`),...(pendientesRest.length>0?[``,`⏳ *Pendiente:*`,...pendientesRest.map(a=>`   • ${TIPOS_LABEL[a.tipo]||a.tipo} · ${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm · ×${a.cantidad||1}`)]:[]),``,todasEntregadas?`🎉 ¡Obra completada!`:``,`🇺🇾 *ABERTURAS BORGES* 🇺🇾`,`Celular: 099225599 - 098856475`].filter(Boolean);
        window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(lineas.join("\n"))}`,"_blank");
      }
    };

    return (
      <div style={{background:"#0d1626",border:`1px solid ${pct===100?"#34d39966":ACCENT+"44"}`,borderRadius:14,padding:"14px 16px",marginBottom:10}}>
        <div style={{cursor:"pointer"}} onClick={()=>setExpandida(v=>!v)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div><div style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>{c.nombre}</div>
              {c.direccion&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>}
              {c.telefono&&<div style={{fontSize:12,color:ACCENT,marginTop:2}}>📞 {c.telefono}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,fontWeight:700,color:pct===100?"#34d399":ACCENT,background:(pct===100?"#34d399":ACCENT)+"22",borderRadius:99,padding:"3px 10px",marginBottom:4}}>
                {pct===100?"✅ Completo":`${entregadas.length}/${aberturas.length} entregadas`}
              </div>
              <div style={{fontSize:11,color:"#475569"}}>{expandida?"▲":"▼"}</div>
            </div>
          </div>
          <div style={{height:6,background:"#162035",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#34d399":`linear-gradient(90deg,${ACCENT},#34d399)`,borderRadius:99,transition:"width 0.5s"}}/>
          </div>
          <div style={{fontSize:11,color:"#475569",marginTop:4}}>{pct}% entregado · {pendientes.length} pendiente{pendientes.length!==1?"s":""}</div>
        </div>
        {expandida&&(
          <div style={{marginTop:14}}>
            <div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:8,textTransform:"uppercase"}}>Marcá lo que entregás ahora:</div>
            {aberturas.map(a=>{
              const entrega=(c.entregasAb||{})[a.id];
              return (
                <label key={a.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",marginBottom:6,background:entrega?"#052e1c":seleccionadas[a.id]?"#0a2a1a":"#090e18",border:`1px solid ${entrega?"#34d39955":seleccionadas[a.id]?"#34d39888":"#162035"}`,borderRadius:10,cursor:entrega?"default":"pointer"}}>
                  <input type="checkbox" checked={!!entrega||!!seleccionadas[a.id]} disabled={!!entrega} onChange={()=>!entrega&&setSeleccionadas(p=>({...p,[a.id]:!p[a.id]}))} style={{accentColor:"#34d399",width:16,height:16,flexShrink:0,marginTop:2}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:entrega?"#34d399":"#e2e8f0"}}>{a.num}. {TIPOS_LABEL[a.tipo]||a.tipo}</div>
                    <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{a.tipo==="mampara_l"?`F${a.anchoFrontal||"?"}×L${a.anchoLat||"?"}×H${a.alto||"?"}cm`:`${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm`} · ×{a.cantidad||1}{a.color?` · ${a.color}`:""}{a.serie?` · ${a.serie}`:""}</div>
                    {entrega&&<div style={{fontSize:11,color:"#34d39988",marginTop:3}}>✓ Entregada {fmtF(entrega.fecha)}{entrega.hora?` · ${entrega.hora}hs`:""}</div>}
                  </div>
                </label>
              );
            })}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
              {pendientes.length>0&&(
                <button style={{background:"#25d366",color:"#000",border:"none",borderRadius:10,padding:"13px 0",fontWeight:800,fontSize:14,cursor:"pointer",opacity:Object.values(seleccionadas).some(v=>v)?1:0.5}}
                  onClick={marcarEntregadas}>💬 Registrar entrega y avisar por WhatsApp</button>
              )}
              <button style={{background:"transparent",border:`1px solid ${ACCENT}44`,color:ACCENT,borderRadius:10,padding:"9px 0",fontSize:13,cursor:"pointer"}} onClick={()=>onSelect(c)}>Ver ficha completa →</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{padding:"14px 14px 40px",maxWidth:520,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button style={{background:"none",border:"none",color:ACCENT,fontSize:24,cursor:"pointer"}} onClick={onBack}>←</button>
        <div style={{fontWeight:800,fontSize:18,color:"#f1f5f9"}}>📦 Obras activas</div>
        <div style={{marginLeft:"auto",fontSize:12,color:"#64748b"}}>{obras.length} obra{obras.length!==1?"s":""}</div>
      </div>
      {obras.length===0&&<div style={{textAlign:"center",color:"#334155",padding:"60px 20px",fontSize:14}}>No hay obras activas.<br/><span style={{fontSize:12,color:"#1e2a3a"}}>Aparecerán cuando un presupuesto sea aprobado.</span></div>}
      {obras.map(c=><ObraCard key={c.id} c={c}/>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEUDORES — gestión de deudas, pagos y recordatorios
// ═══════════════════════════════════════════════════════════
function DeudoresView({ showToast }) {
  const [deudores, setDeudores]         = useState([]);
  const [vista, setVista]               = useState("lista");
  const [seleccionado, setSeleccionado] = useState(null);
  const [cargando, setCargando]         = useState(true);
  const deudoresRef = useRef([]);  // siempre tiene el valor más reciente

  const emptyDeudor = () => ({
    id:"d"+Date.now(), nombre:"", telefono:"", direccion:"", localidad:"",
    moneda:"UYU", concepto:"", total:"", pagos:[],
    fechaVencimiento:"", notas:"", creadoEn:today(),
  });

  useEffect(()=>{
    const cargar = async () => {
      try {
        const {data, error} = await supabase.from('deudores').select('*').order('created_at');
        if(error) throw error;
        const lista = (data||[]).map(r=>r.data).filter(Boolean);
        deudoresRef.current = lista;
        setDeudores(lista);
      } catch(e){ console.error('Error cargando deudores:',e); }
      setCargando(false);
    };
    cargar();
  },[]);

  // Siempre usa deudoresRef para evitar closures viejos
  const persistir = async (nuevos) => {
    deudoresRef.current = nuevos;
    setDeudores([...nuevos]);
    try {
      const rows = nuevos.map(d => ({ id: String(d.id), data: d }));
      const { error } = await supabase
        .from('deudores')
        .upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('Supabase deudores error:', error.message, error.code);
        // Si la tabla no existe, mostramos instrucción
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          showToast("⚠️ Crear tabla 'deudores' en Supabase (ver instrucciones)", "err");
        } else {
          showToast("Error al guardar: " + error.message, "err");
        }
      }
    } catch(e) {
      console.error('Error guardando deudores:', e);
      showToast("Error al guardar — revisá la conexión", "err");
    }
  };

  const guardar = async (d) => {
    const actual = deudoresRef.current;
    const nuevos = actual.find(x=>x.id===d.id)
      ? actual.map(x=>x.id===d.id?d:x)
      : [...actual, d];
    await persistir(nuevos);
    setSeleccionado({...d});
    setVista("detalle");
    showToast("Guardado ✓");
    // Recargar desde Supabase para confirmar persistencia
    try {
      const {data} = await supabase.from('deudores').select('*').order('created_at');
      if(data){
        const lista = data.map(r=>r.data).filter(Boolean);
        deudoresRef.current = lista;
        setDeudores(lista);
      }
    } catch(e){}
  };

  const eliminar = async (id) => {
    if(!window.confirm("¿Eliminar este deudor?")) return;
    const nuevos = deudoresRef.current.filter(d=>d.id!==id);
    await persistir(nuevos);
    try { await supabase.from('deudores').delete().eq('id',String(id)); } catch(e){}
    setVista("lista");
    showToast("Eliminado","err");
  };

  const fmtM = (n, moneda) => {
    if(!n&&n!==0) return "—";
    const num = Number(n).toLocaleString("es-UY");
    return moneda==="USD" ? `USD ${num}` : `$${num}`;
  };
  const fmtF = d => { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };

  // ── Detalle de un deudor ──
  const DetalleDeudor = () => {
    const [f, setF] = useState(()=>seleccionado||emptyDeudor());
    const [nuevoPago, setNuevoPago] = useState({monto:"",fecha:today(),nota:""});
    const fRef = useRef(f);

    // Sincronizar si cambia el seleccionado
    useEffect(()=>{
      if(seleccionado){setF({...seleccionado});fRef.current={...seleccionado};}
    },[seleccionado?.id]);

    const totalPagado = (f.pagos||[]).reduce((s,p)=>s+(parseFloat(p.monto)||0),0);
    const saldo = (parseFloat(f.total)||0) - totalPagado;
    const pct = f.total ? Math.min(100,Math.round(totalPagado/(parseFloat(f.total)||1)*100)) : 0;

    const cambiarF = (campo, val) => {
      setF(prev=>{ const n={...prev,[campo]:val}; fRef.current=n; return n; });
    };

    const agregarPago = async () => {
      if(!nuevoPago.monto){showToast("Ingresá el monto","err");return;}
      const pago = {...nuevoPago, id:Date.now(), moneda:fRef.current.moneda||"UYU"};
      const actualizado = {...fRef.current, pagos:[...(fRef.current.pagos||[]),pago]};
      fRef.current = actualizado;
      setF({...actualizado});
      await guardar(actualizado);
      setNuevoPago({monto:"",fecha:today(),nota:""});
    };

    const enviarEstadoCuenta = () => {
      if(!f.telefono){showToast("Sin teléfono","err");return;}
      const pagosHist = (f.pagos||[]).map(p=>`   • ${fmtF(p.fecha)} — ${fmtM(p.monto,p.moneda||f.moneda)}${p.nota?` (${p.nota})`:""}`).join("\n");
      const msg=[
        `💳 *Estado de cuenta — Aberturas Borges*`,
        `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
        `👤 *${f.nombre}*`,
        f.concepto?`📋 ${f.concepto}`:"",
        ``,
        `💰 Total: *${fmtM(f.total,f.moneda)}*`,
        `📥 Cobrado: *${fmtM(totalPagado,f.moneda)}*`,
        `⏳ Saldo pendiente: *${fmtM(Math.max(0,saldo),f.moneda)}*`,
        (f.pagos||[]).length>0?`\n📋 *Historial de pagos:*\n${pagosHist}`:"",
        f.fechaVencimiento?`\n📅 Fecha de cobro: ${fmtF(f.fechaVencimiento)}`:"",
        ``,
        `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
        `🏦 *Datos para transferencia bancaria*`,
        `A nombre de: *Aberturas Borges SAS*`,
        ``,
        `🇺🇾 En *pesos uruguayos*:`,
        `   Cuenta: 110874315-00001`,
        ``,
        `🇺🇸 En *dólares (USD)*:`,
        `   Cuenta: 110874315-00002`,
        ``,
        `📲 _Una vez realizada la transferencia, por favor enviá el comprobante de pago._`,
        `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
        `🇺🇾 *ABERTURAS BORGES* 🇺🇾`,
        `Celular: 099225599 - 098856475`,
      ].filter(Boolean).join("\n");
      window.open(`https://wa.me/598${f.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`,"_blank");
    };

    const inp = {width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:9,padding:"9px 12px",color:"#e2e8f0",fontSize:14,outline:"none",boxSizing:"border-box"};
    const lbl = {fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"};

    return (
      <div style={{padding:"14px 14px 40px",maxWidth:520,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <button style={{background:"none",border:"none",color:ACCENT,fontSize:24,cursor:"pointer"}} onClick={()=>setVista("lista")}>←</button>
          <div style={{fontWeight:800,fontSize:17,color:"#f1f5f9",flex:1}}>{f.nombre||"Nuevo deudor"}</div>
          <button style={{background:"transparent",border:"1px solid #450a0a",color:"#f87171",borderRadius:8,padding:"5px 10px",fontSize:12,cursor:"pointer"}}
            onClick={()=>eliminar(f.id)}>🗑</button>
        </div>

        {/* Datos */}
        <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{fontWeight:800,color:"#f1f5f9",fontSize:15,marginBottom:12}}>👤 Datos del deudor</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Nombre *</label>
              <input style={inp} value={f.nombre} onChange={e=>cambiarF("nombre",e.target.value)} placeholder="Juan Pérez"/>
            </div>
            <div>
              <label style={lbl}>Teléfono</label>
              <input style={inp} type="tel" value={f.telefono||""} onChange={e=>cambiarF("telefono",e.target.value)} placeholder="099..."/>
            </div>
            <div>
              <label style={lbl}>Moneda</label>
              <select style={{...inp,padding:"8px 12px"}} value={f.moneda||"UYU"} onChange={e=>cambiarF("moneda",e.target.value)}>
                <option value="UYU">$ Pesos uruguayos</option>
                <option value="USD">USD Dólares</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Dirección</label>
              <input style={inp} value={f.direccion||""} onChange={e=>cambiarF("direccion",e.target.value)} placeholder="Calle 123"/>
            </div>
            <div>
              <label style={lbl}>Localidad</label>
              <input style={inp} value={f.localidad||""} onChange={e=>cambiarF("localidad",e.target.value)} placeholder="Mercedes"/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Concepto</label>
              <input style={inp} value={f.concepto||""} onChange={e=>cambiarF("concepto",e.target.value)} placeholder="Aberturas, ventanas, trabajo..."/>
            </div>
            <div>
              <label style={lbl}>Total deuda</label>
              <input style={inp} type="number" value={f.total||""} onChange={e=>cambiarF("total",e.target.value)} placeholder="0"/>
            </div>
            <div>
              <label style={lbl}>📅 Fecha de cobro</label>
              <input style={{...inp,padding:"8px 10px"}} type="date" value={f.fechaVencimiento||""} onChange={e=>cambiarF("fechaVencimiento",e.target.value)}/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Notas</label>
              <textarea style={{...inp,resize:"none",height:56}} value={f.notas||""} onChange={e=>cambiarF("notas",e.target.value)} placeholder="Observaciones..."/>
            </div>
          </div>
          <button style={{background:ACCENT,color:"#090e18",border:"none",borderRadius:9,padding:"11px 0",fontWeight:800,fontSize:14,cursor:"pointer",width:"100%"}}
            onClick={()=>guardar({...fRef.current})}>💾 Guardar datos</button>
        </div>

        {/* Resumen financiero */}
        {f.total&&(
          <div style={{background:"#060c14",border:"1px solid #00b4d833",borderRadius:14,padding:14,marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[["Total",fmtM(f.total,f.moneda),"#e2e8f0"],["Cobrado",fmtM(totalPagado,f.moneda),"#34d399"],["Saldo",fmtM(Math.max(0,saldo),f.moneda),saldo>0?"#f59e0b":"#34d399"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                  <div style={{fontWeight:900,fontSize:15,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{height:6,background:"#162035",borderRadius:99,overflow:"hidden",marginBottom:6}}>
              <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${ACCENT},#34d399)`,borderRadius:99,transition:"width 0.5s"}}/>
            </div>
            <div style={{textAlign:"right",fontSize:11,color:"#475569",marginBottom:8}}>{pct}% cobrado</div>
            {f.fechaVencimiento&&(()=>{
              const [y,m,d2]=f.fechaVencimiento.split("-").map(Number);
              const dias=Math.ceil((new Date(y,m-1,d2)-nowUY())/86400000);
              return <div style={{fontSize:12,fontWeight:700,color:dias<=0?"#ef4444":dias<=3?"#f59e0b":"#94a3b8",marginBottom:8}}>
                📅 Cobro: {fmtF(f.fechaVencimiento)} {dias===0?"¡Hoy!":dias<0?`⚠️ Vencido hace ${Math.abs(dias)}d`:`en ${dias}d`}
              </div>;
            })()}
            <button style={{width:"100%",background:"#0d2b22",color:"#25d366",border:"1px solid #25d36655",borderRadius:9,padding:"11px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}
              onClick={enviarEstadoCuenta}>💬 Enviar estado de cuenta por WhatsApp</button>
          </div>
        )}

        {/* Registrar pago */}
        <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{fontWeight:800,color:"#f1f5f9",fontSize:15,marginBottom:12}}>💳 Registrar pago</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <label style={lbl}>Monto ({f.moneda||"UYU"})</label>
              <input style={inp} type="number" value={nuevoPago.monto} onChange={e=>setNuevoPago(p=>({...p,monto:e.target.value}))} placeholder="0"/>
            </div>
            <div>
              <label style={lbl}>Fecha</label>
              <input style={{...inp,padding:"8px 10px"}} type="date" value={nuevoPago.fecha} onChange={e=>setNuevoPago(p=>({...p,fecha:e.target.value}))}/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Descripción</label>
              <input style={inp} value={nuevoPago.nota||""} onChange={e=>setNuevoPago(p=>({...p,nota:e.target.value}))} placeholder="Adelanto, seña, saldo..."/>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:2,background:ACCENT,color:"#090e18",border:"none",borderRadius:9,padding:"11px 0",fontWeight:800,fontSize:14,cursor:"pointer",opacity:nuevoPago.monto?1:0.4}}
              disabled={!nuevoPago.monto} onClick={agregarPago}>+ Registrar</button>
            <button style={{flex:1,background:"#0d2b22",color:"#25d366",border:"1px solid #25d36655",borderRadius:9,padding:"11px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}
              onClick={()=>{
                const mp=parseFloat(nuevoPago.monto)||0;
                const ns=Math.max(0,(parseFloat(f.total)||0)-(totalPagado+mp));
                const msg=[`💳 *Pago recibido — Aberturas Borges*`,`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,`👤 *${f.nombre}*`,`📅 ${fmtF(nuevoPago.fecha)}`,``,mp>0?`✅ *${nuevoPago.nota||"Pago"}: ${fmtM(mp,f.moneda)}*`:"",`💰 Total: ${fmtM(f.total,f.moneda)}`,`📥 Cobrado: ${fmtM(totalPagado+mp,f.moneda)}`,`⏳ Saldo: *${fmtM(ns,f.moneda)}*`,``,`🇺🇾 *ABERTURAS BORGES* 🇺🇾`,`Celular: 099225599 - 098856475`].filter(Boolean).join("\n");
                if(f.telefono) window.open(`https://wa.me/598${f.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`,"_blank");
                else showToast("Sin teléfono","err");
              }}>💬 WA</button>
          </div>
        </div>

        {/* Historial pagos */}
        {(f.pagos||[]).length>0&&(
          <div style={{background:"#0d1626",border:"1px solid #162035",borderRadius:14,padding:16}}>
            <div style={{fontWeight:800,color:"#f1f5f9",fontSize:15,marginBottom:12}}>📋 Historial de pagos</div>
            {[...(f.pagos||[])].reverse().map((p,i)=>(
              <div key={p.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #0c1525"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:"#34d399"}}>{fmtM(p.monto,p.moneda||f.moneda)}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{p.nota||"Pago"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>{fmtF(p.fecha)}</div>
                  <button style={{marginTop:4,background:"transparent",border:"1px solid #450a0a",color:"#f87171",borderRadius:6,padding:"2px 8px",fontSize:11,cursor:"pointer"}}
                    onClick={()=>{
                      if(!window.confirm("¿Eliminar este pago?"))return;
                      const actualizado={...fRef.current,pagos:(fRef.current.pagos||[]).filter(pp=>pp.id!==p.id)};
                      fRef.current=actualizado;setF({...actualizado});guardar(actualizado);
                    }}>✕</button>
                </div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"1px solid #162035"}}>
              <span style={{color:"#94a3b8",fontWeight:700}}>Total cobrado</span>
              <span style={{color:"#34d399",fontWeight:900,fontSize:17}}>{fmtM(totalPagado,f.moneda)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Lista ──
  const conSaldo = deudores.filter(d=>{
    const p=(d.pagos||[]).reduce((s,p)=>s+(parseFloat(p.monto)||0),0);
    return (parseFloat(d.total)||0)-p>0;
  });
  const saldados = deudores.filter(d=>{
    const p=(d.pagos||[]).reduce((s,p)=>s+(parseFloat(p.monto)||0),0);
    return d.total&&(parseFloat(d.total)||0)-p<=0;
  });

  if((vista==="detalle"||vista==="nuevo")&&seleccionado) return <DetalleDeudor/>;

  return (
    <div style={{padding:"14px 14px 40px",maxWidth:520,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontWeight:800,fontSize:18,color:"#f1f5f9"}}>💳 Deudores</div>
        <button style={{background:"#f43f5e",color:"#fff",border:"none",borderRadius:10,padding:"9px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}
          onClick={()=>{setSeleccionado(emptyDeudor());setVista("nuevo");}}>+ Nuevo</button>
      </div>

      {cargando&&<div style={{textAlign:"center",color:"#475569",padding:"40px 0"}}>Cargando...</div>}
      {!cargando&&deudores.length===0&&(
        <div style={{textAlign:"center",color:"#334155",padding:"60px 20px",fontSize:14,lineHeight:1.8}}>
          <div style={{fontSize:40,marginBottom:12}}>💳</div>
          No hay deudores registrados.<br/>
          <span style={{fontSize:13}}>Tocá "+ Nuevo" para agregar uno.</span>
        </div>
      )}

      {conSaldo.length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:800,color:"#f43f5e",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>
            ⚠️ Con saldo pendiente ({conSaldo.length})
          </div>
          {conSaldo.sort((a,b)=>(a.fechaVencimiento||"9999")>(b.fechaVencimiento||"9999")?1:-1).map(d=>{
            const pagado=(d.pagos||[]).reduce((s,p)=>s+(parseFloat(p.monto)||0),0);
            const saldo=(parseFloat(d.total)||0)-pagado;
            const fmtM2=(n,m)=>m==="USD"?`USD ${Number(n).toLocaleString("es-UY")}`:`$${Number(n).toLocaleString("es-UY")}`;
            const venc=d.fechaVencimiento;
            let diasLabel="";
            if(venc){const [y,m,d2]=venc.split("-").map(Number);const dias=Math.ceil((new Date(y,m-1,d2)-nowUY())/86400000);diasLabel=dias===0?"¡Hoy!":dias<0?`⚠️ Vencida hace ${Math.abs(dias)}d`:dias<=3?`¡En ${dias}d!`:`en ${dias}d`;}
            return (
              <div key={d.id} style={{background:"#0d1626",border:"1px solid #f43f5e33",borderRadius:14,padding:"14px 16px",marginBottom:8,cursor:"pointer"}}
                onClick={()=>{setSeleccionado({...d});setVista("detalle");}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:15,color:"#f1f5f9"}}>{d.nombre}</div>
                    {d.direccion&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>📍 {d.direccion}{d.localidad?`, ${d.localidad}`:""}</div>}
                    {d.telefono&&<div style={{fontSize:12,color:ACCENT,marginTop:2}}>📞 {d.telefono}</div>}
                    {d.concepto&&<div style={{fontSize:12,color:"#94a3b8",marginTop:2,fontStyle:"italic"}}>{d.concepto}</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:900,fontSize:17,color:"#f43f5e"}}>{fmtM2(saldo,d.moneda)}</div>
                    <div style={{fontSize:10,color:"#475569"}}>saldo</div>
                  </div>
                </div>
                {venc&&<div style={{marginTop:8,fontSize:12,fontWeight:700,color:diasLabel.includes("Vencida")?"#ef4444":diasLabel.includes("¡")?"#f59e0b":"#94a3b8"}}>📅 {fmtF(venc)} — {diasLabel}</div>}
              </div>
            );
          })}
        </div>
      )}

      {saldados.length>0&&(
        <div>
          <div style={{fontSize:11,fontWeight:800,color:"#34d399",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>
            ✅ Pagados ({saldados.length})
          </div>
          {saldados.map(d=>(
            <div key={d.id} style={{background:"#0d1626",border:"1px solid #34d39933",borderRadius:14,padding:"12px 16px",marginBottom:8,cursor:"pointer",opacity:0.7}}
              onClick={()=>{setSeleccionado({...d});setVista("detalle");}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontWeight:700,color:"#f1f5f9"}}>{d.nombre}</div>
                  {d.concepto&&<div style={{fontSize:12,color:"#64748b"}}>{d.concepto}</div>}
                </div>
                <div style={{fontWeight:700,color:"#34d399",fontSize:14}}>✅ Pagado</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function FabricaListView({ clientes, onSelect, onUpdate, showToast }) {
  const [vista, setVista] = useState("fabricar"); // "fabricar" | "activas"
  const fmtF = d => { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };
  const TIPOS_LABEL = {corrediza:"Ventana Corrediza",proyectante:"Ventana Proyectante",batiente:"Ventana Batiente",puerta_corrediza:"Puerta Corrediza",puerta_batiente:"Puerta Batiente",fijo:"Paño Fijo",mampara_std:"Mampara Estándar",mampara_f1:"Mampara F1",mampara_l:"Mampara en L",persiana:"Persiana Catalana"};

  const enFab = clientes.filter(c=>c.status==="aprobado"||c.status==="en_produccion");
  const activas = clientes.filter(c=>(c.status==="aprobado"||c.status==="en_produccion")&&(c.aberturas||[]).length>0);

  const urgentes    = enFab.filter(c=>!c.fechaEntrega).sort((a,b)=>(a.nombre||"").localeCompare(b.nombre||""));
  const programadas = enFab.filter(c=>!!c.fechaEntrega).sort((a,b)=>a.fechaEntrega.localeCompare(b.fechaEntrega));

  const diasRest = fecha => {
    if(!fecha) return null;
    const [y,m,d] = fecha.split("-").map(Number);
    return Math.ceil((new Date(y,m-1,d) - nowUY()) / 86400000);
  };

  // ── Card simple para lista de fabricar ──
  const FabCard = ({c}) => {
    const sm = STATUS_META[c.status]||{};
    const nAb = (c.aberturas||[]).reduce((s,a)=>s+(parseInt(a.cantidad)||0),0);
    const dias = diasRest(c.fechaEntrega);
    const dc = dias===null?ACCENT:dias<=3?"#ef4444":dias<=7?"#f59e0b":"#34d399";
    return (
      <div style={{background:"#0d1626",border:`1px solid ${sm.color||ACCENT}33`,borderRadius:14,padding:"14px 16px",marginBottom:10,cursor:"pointer",borderLeft:`3px solid ${sm.color||ACCENT}`}}
        onClick={()=>onSelect(c)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>{c.nombre}</div>
            {c.direccion&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>}
            {c.telefono&&<div style={{fontSize:12,color:ACCENT,marginTop:2}}>📞 {c.telefono}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,fontWeight:700,color:sm.color||ACCENT,background:(sm.color||ACCENT)+"22",borderRadius:99,padding:"3px 10px",marginBottom:4}}>{sm.icon} {sm.label}</div>
            {nAb>0&&<div style={{fontSize:11,color:"#94a3b8"}}>🪟 {nAb} abertura{nAb!==1?"s":""}</div>}
          </div>
        </div>
        {c.fechaEntrega&&(
          <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8,background:dc+"15",border:`1px solid ${dc}44`,borderRadius:8,padding:"6px 10px"}}>
            <span>📅</span>
            <span style={{fontWeight:700,color:dc,fontSize:13}}>Entrega: {fmtF(c.fechaEntrega)}</span>
            {dias!==null&&<span style={{fontSize:11,color:dc,marginLeft:"auto"}}>{dias===0?"¡Hoy!":dias<0?`${Math.abs(dias)}d vencida`:`${dias}d`}</span>}
          </div>
        )}
        {(c.aberturas||[]).filter(a=>(c.estadosAb||{})[a.id]!=="cancelada").slice(0,2).map((ab,i)=>{
          const entrega=(c.entregasAb||{})[ab.id];
          const t=TIPOS.find(t=>t.id===ab.tipo);
          return <div key={i} style={{fontSize:11,color:entrega?"#34d39988":"#475569",marginTop:4}}>
            {entrega?"✓":"·"} {t?.label||ab.tipo} {ab.ancho||ab.anchoSup||"?"}×{ab.alto||"?"}cm ×{ab.cantidad||1}
          </div>;
        })}
        {(c.aberturas||[]).length>2&&<div style={{fontSize:11,color:"#334155",marginTop:2}}>+ {(c.aberturas||[]).length-2} más...</div>}
      </div>
    );
  };

  // ── Card de obra activa con entregas parciales ──
  const ObraActivaCard = ({c}) => {
    const [expandida, setExpandida] = useState(false);
    const [seleccionadas, setSeleccionadas] = useState({});
    const aberturas = (c.aberturas||[]).filter(a=>(c.estadosAb||{})[a.id]!=="cancelada");
    const entregadas = aberturas.filter(a=>(c.entregasAb||{})[a.id]);
    const pendientes = aberturas.filter(a=>!(c.entregasAb||{})[a.id]);
    const pct = aberturas.length>0 ? Math.round(entregadas.length/aberturas.length*100) : 0;

    const marcarEntregadas = async () => {
      const selIds = Object.keys(seleccionadas).filter(k=>seleccionadas[k]);
      if(!selIds.length){showToast("Seleccioná al menos una abertura","err");return;}
      const nuevasEntregas = {...(c.entregasAb||{})};
      const aEntregarAhora = [];
      aberturas.forEach(a=>{
        if(seleccionadas[a.id]){
          nuevasEntregas[a.id] = {fecha:today(), hora:nowTimeUY()};
          aEntregarAhora.push(a);
        }
      });
      const todasEntregadas = aberturas.every(a=>nuevasEntregas[a.id]);
      const actualizado = {...c, entregasAb:nuevasEntregas,
        status: todasEntregadas?"entregado":c.status,
        ...(todasEntregadas&&!c.fechaCompletada?{fechaCompletada:today()}:{})
      };
      onUpdate&&await onUpdate(actualizado);
      setSeleccionadas({});
      showToast(todasEntregadas?"✅ Obra completada":"Entrega registrada ✓");

      // WA con detalle de entrega
      if(c.telefono){
        const pendientesRest = aberturas.filter(a=>!nuevasEntregas[a.id]);
        const lineas = [
          `📦 *ENTREGA — Aberturas Borges*`,
          `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
          `👤 *${c.nombre}*`,
          `📅 ${fmtF(today())} · ${nowTimeUY()}hs`,
          ``,
          `✅ *Aberturas entregadas hoy:*`,
          ...aEntregarAhora.map(a=>`   • ${TIPOS_LABEL[a.tipo]||a.tipo} · ${a.tipo==="mampara_l"?`F${a.anchoFrontal||"?"}×L${a.anchoLat||"?"}×H${a.alto||"?"}cm`:`${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm`} · ×${a.cantidad||1}${a.color?` · ${a.color}`:""}${a.serie?` · ${a.serie}`:""}`),
          ``,
          ...(pendientesRest.length>0?[
            `⏳ *Pendiente de entrega:*`,
            ...pendientesRest.map(a=>`   • ${TIPOS_LABEL[a.tipo]||a.tipo} · ${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm · ×${a.cantidad||1}`),
            ``
          ]:[]),
          todasEntregadas?`🎉 *¡Obra completada!* Gracias por elegirnos.`:``,
          `🇺🇾 *ABERTURAS BORGES* 🇺🇾`,
          `Celular: 099225599 - 098856475`,
        ].filter(l=>l!==undefined);
        window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(lineas.join("\n"))}`,"_blank");
      }
    };

    return (
      <div style={{background:"#0d1626",border:`1px solid ${pct===100?"#34d39966":ACCENT+"44"}`,borderRadius:14,padding:"14px 16px",marginBottom:10}}>
        <div style={{cursor:"pointer"}} onClick={()=>setExpandida(v=>!v)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>{c.nombre}</div>
              {c.direccion&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>📍 {c.direccion}{c.localidad?`, ${c.localidad}`:""}</div>}
              {c.telefono&&<div style={{fontSize:12,color:ACCENT,marginTop:2}}>📞 {c.telefono}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,fontWeight:700,color:pct===100?"#34d399":ACCENT,background:(pct===100?"#34d399":ACCENT)+"22",borderRadius:99,padding:"3px 10px",marginBottom:4}}>
                {pct===100?"✅ Completo":`${entregadas.length}/${aberturas.length} entregadas`}
              </div>
              <div style={{fontSize:11,color:"#475569"}}>{expandida?"▲ cerrar":"▼ detalles"}</div>
            </div>
          </div>
          <div style={{height:6,background:"#162035",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#34d399":`linear-gradient(90deg,${ACCENT},#34d399)`,borderRadius:99,transition:"width 0.5s"}}/>
          </div>
          <div style={{fontSize:11,color:"#475569",marginTop:4}}>{pct}% entregado · {pendientes.length} pendiente{pendientes.length!==1?"s":""}</div>
        </div>

        {expandida&&(
          <div style={{marginTop:14}}>
            <div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              Marcá lo que entregás hoy:
            </div>
            {aberturas.map(a=>{
              const entrega=(c.entregasAb||{})[a.id];
              const esEspera=(c.estadosAb||{})[a.id]==="en_espera";
              return (
                <label key={a.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",marginBottom:6,
                  background:entrega?"#052e1c":seleccionadas[a.id]?"#0a2a1a":esEspera?"#2d1a00":"#090e18",
                  border:`1px solid ${entrega?"#34d39955":seleccionadas[a.id]?"#34d39888":esEspera?"#f59e0b44":"#162035"}`,
                  borderRadius:10,cursor:entrega?"default":"pointer"}}>
                  <input type="checkbox"
                    checked={!!entrega||!!seleccionadas[a.id]}
                    disabled={!!entrega}
                    onChange={()=>!entrega&&setSeleccionadas(p=>({...p,[a.id]:!p[a.id]}))}
                    style={{accentColor:"#34d399",width:16,height:16,flexShrink:0,marginTop:2}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:entrega?"#34d399":esEspera?"#f59e0b":"#e2e8f0"}}>
                      {a.num}. {TIPOS_LABEL[a.tipo]||a.tipo}
                      {esEspera&&<span style={{fontSize:10,color:"#f59e0b",marginLeft:6}}>⏳ para después</span>}
                    </div>
                    <div style={{fontSize:12,color:"#64748b",marginTop:2}}>
                      {a.tipo==="mampara_l"?`F${a.anchoFrontal||"?"}×L${a.anchoLat||"?"}×H${a.alto||"?"}cm`:`${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm`} · ×{a.cantidad||1}
                      {a.color?` · ${a.color}`:""}{a.serie?` · ${a.serie}`:""}
                      {a.monoblock?" · +Monoblock":""}
                    </div>
                    {entrega&&<div style={{fontSize:11,color:"#34d39988",marginTop:3,fontWeight:600}}>✓ Entregada {fmtF(entrega.fecha)}{entrega.hora?` · ${entrega.hora}hs`:""}</div>}
                  </div>
                </label>
              );
            })}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              {pendientes.length>0&&(
                <>
                  <button style={{flex:1,background:"#0d1626",border:`1px solid ${ACCENT}66`,color:ACCENT,borderRadius:10,padding:"12px 0",fontWeight:700,fontSize:13,cursor:"pointer",
                    opacity:Object.values(seleccionadas).some(v=>v)?1:0.4}}
                    onClick={async()=>{
                      const selIds=Object.keys(seleccionadas).filter(k=>seleccionadas[k]);
                      if(!selIds.length){showToast("Seleccioná al menos una abertura","err");return;}
                      const nuevasEntregas={...(c.entregasAb||{})};
                      aberturas.forEach(a=>{if(seleccionadas[a.id])nuevasEntregas[a.id]={fecha:today(),hora:nowTimeUY()};});
                      const todasEntregadas=aberturas.every(a=>nuevasEntregas[a.id]);
                      const actualizado={...c,entregasAb:nuevasEntregas,status:todasEntregadas?"entregado":c.status,...(todasEntregadas&&!c.fechaCompletada?{fechaCompletada:today()}:{})};
                      onUpdate&&await onUpdate(actualizado);
                      setSeleccionadas({});
                      showToast(todasEntregadas?"✅ Obra completada":"Entrega registrada ✓");
                    }}>
                    ✓ Registrar entrega
                  </button>
                  <button style={{flex:1,background:"#0d2b22",border:"1px solid #25d36655",color:"#25d366",borderRadius:10,padding:"12px 0",fontWeight:700,fontSize:13,cursor:"pointer",
                    opacity:Object.values(seleccionadas).some(v=>v)?1:0.4}}
                    onClick={()=>{
                      const selIds=Object.keys(seleccionadas).filter(k=>seleccionadas[k]);
                      if(!selIds.length){showToast("Seleccioná al menos una abertura","err");return;}
                      const aEntregarAhora=aberturas.filter(a=>seleccionadas[a.id]);
                      const pendientesRest=aberturas.filter(a=>!seleccionadas[a.id]&&!(c.entregasAb||{})[a.id]);
                      const lineas=[
                        `📦 *ENTREGA — Aberturas Borges*`,`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
                        `👤 *${c.nombre}*`,`📅 ${fmtF(today())} · ${nowTimeUY()}hs`,``,
                        `✅ *Aberturas entregadas hoy:*`,
                        ...aEntregarAhora.map(a=>`   • ${TIPOS_LABEL[a.tipo]||a.tipo} · ${a.tipo==="mampara_l"?`F${a.anchoFrontal||"?"}×L${a.anchoLat||"?"}×H${a.alto||"?"}cm`:`${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm`} · ×${a.cantidad||1}${a.color?` · ${a.color}`:""}${a.serie?` · ${a.serie}`:""}`),
                        ``,
                        ...(pendientesRest.length>0?[`⏳ *Pendiente de entrega:*`,...pendientesRest.map(a=>`   • ${TIPOS_LABEL[a.tipo]||a.tipo} · ${a.ancho||a.anchoSup||"?"}×${a.alto||"?"}cm · ×${a.cantidad||1}`),``]:[]),
                        `🇺🇾 *ABERTURAS BORGES* 🇺🇾`,`Celular: 099225599 - 098856475`,
                      ].filter(l=>l!==undefined);
                      if(c.telefono) window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(lineas.join("\n"))}`,"_blank");
                      else showToast("Cliente sin teléfono","err");
                    }}>
                    💬 Avisar por WA
                  </button>
                </>
              )}
              <button style={{flex:pendientes.length>0?0:1,background:"transparent",border:`1px solid ${ACCENT}44`,color:ACCENT,borderRadius:10,padding:"9px 12px",fontSize:12,cursor:"pointer"}}
                onClick={()=>onSelect(c)}>Ver ficha →</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{padding:"12px 12px 40px",maxWidth:520,margin:"0 auto"}}>

      {/* Toggle Fabricar / Obras activas */}
      <div style={{display:"flex",gap:6,marginBottom:16,background:"#0d1626",border:"1px solid #162035",borderRadius:12,padding:4}}>
        {[["fabricar","🔧 Fabricar"],["activas","📦 Obras activas"]].map(([k,l])=>(
          <button key={k} style={{flex:1,background:vista===k?ACCENT:"transparent",color:vista===k?"#090e18":"#64748b",border:"none",borderRadius:9,padding:"9px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}
            onClick={()=>setVista(k)}>{l}</button>
        ))}
      </div>

      {/* ── VISTA FABRICAR ── */}
      {vista==="fabricar"&&(
        <>
          {enFab.length===0&&(
            <div style={{textAlign:"center",color:"#334155",padding:"60px 0",fontSize:15}}>
              No hay obras para fabricar.<br/>
              <span style={{fontSize:13,color:"#1e2a3a"}}>Aparecerán cuando se apruebe un presupuesto.</span>
            </div>
          )}
          {urgentes.length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:800,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                🔴 Para fabricar ya <span style={{background:"#ef444422",color:"#ef4444",borderRadius:99,padding:"1px 8px",fontSize:11}}>{urgentes.length}</span>
              </div>
              {urgentes.map(c=><FabCard key={c.id} c={c}/>)}
            </div>
          )}
          {programadas.length>0&&(
            <div>
              <div style={{fontSize:12,fontWeight:800,color:"#34d399",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                📅 Con fecha de entrega <span style={{background:"#34d39922",color:"#34d399",borderRadius:99,padding:"1px 8px",fontSize:11}}>{programadas.length}</span>
              </div>
              {programadas.map(c=><FabCard key={c.id} c={c}/>)}
            </div>
          )}
        </>
      )}

      {/* ── VISTA OBRAS ACTIVAS ── */}
      {vista==="activas"&&(
        <>
          {activas.length===0&&(
            <div style={{textAlign:"center",color:"#334155",padding:"60px 0",fontSize:15}}>
              Sin obras activas.<br/>
              <span style={{fontSize:13,color:"#1e2a3a"}}>Aparecerán cuando haya aberturas para entregar.</span>
            </div>
          )}
          {activas.map(c=><ObraActivaCard key={c.id} c={c}/>)}
        </>
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
// ── Tarjeta de obra individual dentro de un cliente ──
function ObraMiniCard({obra, canM, canF, onUpdate, onDelete, clienteNombre, clienteTelefono, showToast}) {
  const [expandida, setExpandida] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({titulo:obra.titulo,descripcion:obra.descripcion||"",fecha:obra.fecha,monto:obra.monto||""});
  const fmtF = d => { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };
  const fmtM = n => n?`$${Number(n).toLocaleString("es-UY")}`:"—";

  const STATUS_OBRA = [
    {id:"pendiente",   label:"⏳ Pendiente",    color:"#f59e0b"},
    {id:"en_proceso",  label:"🔧 En proceso",   color:ACCENT},
    {id:"completada",  label:"✅ Completada",   color:"#34d399"},
    {id:"cancelada",   label:"❌ Cancelada",    color:"#ef4444"},
  ];
  const st = STATUS_OBRA.find(s=>s.id===obra.status)||STATUS_OBRA[0];

  const guardar = () => {
    onUpdate({...obra,...form});
    setEditando(false);
    showToast("Obra guardada ✓");
  };

  const enviarWA = () => {
    if(!clienteTelefono) return;
    const msg = [
      `📋 *Obra: ${obra.titulo}*`,
      `▬▬▬▬▬▬▬▬▬▬▬▬`,
      `👤 *${clienteNombre}*`,
      `📅 ${fmtF(obra.fecha)}`,
      obra.descripcion?`📝 ${obra.descripcion}`:"",
      obra.monto?`💰 *Presupuesto: ${fmtM(obra.monto)}*`:"",
      `Estado: ${st.label}`,
      ``,
      `🇺🇾 *ABERTURAS BORGES* 🇺🇾`,
      `Celular: 099225599 - 098856475`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/598${clienteTelefono.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`,"_blank");
  };

  return (
    <div style={{background:"#0d1626",border:`1px solid ${st.color}44`,borderRadius:14,marginBottom:10,overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}
        onClick={()=>setExpandida(v=>!v)}>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:15,color:"#f1f5f9"}}>{obra.titulo}</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{fmtF(obra.fecha)}</div>
          {obra.descripcion&&<div style={{fontSize:12,color:"#94a3b8",marginTop:2,fontStyle:"italic"}}>"{obra.descripcion}"</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <span style={{fontSize:11,fontWeight:700,color:st.color,background:st.color+"22",borderRadius:99,padding:"2px 9px"}}>{st.label}</span>
          {obra.monto&&<span style={{fontSize:12,fontWeight:700,color:"#34d399"}}>{fmtM(obra.monto)}</span>}
          <span style={{fontSize:10,color:"#334155"}}>{expandida?"▲":"▼"}</span>
        </div>
      </div>

      {/* Detalle expandido */}
      {expandida&&(
        <div style={{borderTop:"1px solid #0c1525",padding:"14px 16px"}}>
          {editando ? (
            <div>
              <div style={{marginBottom:8}}>
                <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:3,textTransform:"uppercase"}}>Título</label>
                <input style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"}}
                  value={form.titulo} onChange={e=>setForm(p=>({...p,titulo:e.target.value}))}/>
              </div>
              <div style={{marginBottom:8}}>
                <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:3,textTransform:"uppercase"}}>Descripción</label>
                <textarea style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:13,outline:"none",resize:"none",height:72,boxSizing:"border-box"}}
                  value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))} placeholder="Detalle de la obra..."/>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{flex:1}}>
                  <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:3,textTransform:"uppercase"}}>Fecha</label>
                  <input type="date" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"}}
                    value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))}/>
                </div>
                <div style={{flex:1}}>
                  <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:3,textTransform:"uppercase"}}>Monto ($)</label>
                  <input type="number" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"}}
                    value={form.monto} onChange={e=>setForm(p=>({...p,monto:e.target.value}))} placeholder="0"/>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={{...S.primaryBtn,flex:2,fontSize:13}} onClick={guardar}>✓ Guardar</button>
                <button style={{...S.ghostBtn,flex:1,fontSize:13}} onClick={()=>setEditando(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              {/* Cambiar estado */}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:"#475569",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Estado</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {STATUS_OBRA.map(s=>(
                    <button key={s.id}
                      style={{fontSize:11,fontWeight:700,padding:"5px 10px",borderRadius:8,cursor:"pointer",
                        background:obra.status===s.id?s.color+"22":"transparent",
                        color:obra.status===s.id?s.color:"#475569",
                        border:`1px solid ${obra.status===s.id?s.color+"66":"#1e2535"}`}}
                      onClick={()=>onUpdate({...obra,status:s.id})}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas */}
              {canM&&(
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:"#475569",marginBottom:4,textTransform:"uppercase"}}>Notas de la obra</div>
                  <textarea style={{width:"100%",background:"#090e18",border:"1px solid #162035",borderRadius:8,padding:"8px 10px",color:"#94a3b8",fontSize:12,outline:"none",resize:"none",height:60,boxSizing:"border-box"}}
                    placeholder="Anotaciones, materiales, pendientes..."
                    value={obra.notas||""}
                    onChange={e=>onUpdate({...obra,notas:e.target.value})}/>
                </div>
              )}

              {/* Botones */}
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {(canM||canF)&&<button style={{...S.ghostBtn,fontSize:12,padding:"6px 10px"}} onClick={()=>setEditando(true)}>✏️ Editar</button>}
                {clienteTelefono&&<button style={{background:"#0d2b22",color:"#25d366",border:"1px solid #128c7e55",borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={enviarWA}>💬 WA</button>}
                <button style={{background:"transparent",border:"1px solid #450a0a",color:"#f87171",borderRadius:8,padding:"6px 10px",fontSize:12,cursor:"pointer"}} onClick={onDelete}>🗑</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailView({cliente,role,agenda,onSaveAgenda,onUpdate,onDelete,showToast}){
  const [c,setC]=useState(cliente);
  const [tab,setTab]=useState("info");
  const [newPago,setNewPago]=useState({monto:"",fecha:today(),nota:""});
  const [showDel,setShowDel]=useState(false);
  const [lightbox,setLightbox]=useState(null);
  const [selector,setSelector]=useState(null);
  const fileRef=useRef();
  const cRef=useRef(c);

  // Solo reinicializar cuando se abre un cliente DIFERENTE (cambia el id)
  // No reinicializar cuando se guarda (eso causaba perder los datos en edición)
  useEffect(()=>{
    if(cliente.id !== cRef.current.id) {
      setC(cliente);
      cRef.current = cliente;
    }
  },[cliente.id]);

  const save=updated=>{
    const latest={...cRef.current,...updated};
    cRef.current=latest;
    setC(latest);
    onUpdate(latest);
  };

  const saveStatus = (nuevoStatus) => {
    const extras = nuevoStatus==="entregado"&&!cRef.current.fechaCompletada
      ? {fechaCompletada:today()} : {};
    save({status:nuevoStatus,...extras});
  };


  // ── manejo de aberturas ──
  const setAb = (abId,campo,val,extra={}) => {
    setC(prev=>{
      const nuevas=(prev.aberturas||[]).map(a=>a.id===abId?{...a,[campo]:val,...(campo==="tipo"?{config:"",serie:"",relleno:""}:{}),...extra}:a);
      const updated={...prev,aberturas:nuevas};
      cRef.current=updated;
      return updated;
    });
  };
  const addAb = () => {
    setC(prev=>{
      const nuevas=[...(prev.aberturas||[]),{...emptyRow((prev.aberturas||[]).length+1)}];
      const updated={...prev,aberturas:nuevas};
      cRef.current=updated;
      return updated;
    });
  };
  const delAb = (abId) => {
    setC(prev=>{
      const nuevas=(prev.aberturas||[]).filter(a=>a.id!==abId).map((a,i)=>({...a,num:i+1}));
      const updated={...prev,aberturas:nuevas};
      cRef.current=updated;
      return updated;
    });
  };
  const guardarObra = (extra={}) => {
    // Lee siempre de cRef para tener el valor más reciente
    const latest = cRef.current;
    save({
      aberturas:    latest.aberturas,
      notas:        latest.notas,
      obsModo:      latest.obsModo,
      fechaMedicion:latest.fechaMedicion,
      ...extra
    });
  };

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
    {key:"info",   label:"Datos",     show:canM},
    {key:"fab",    label:"🏗️ Fabr.",  show:role==="fabrica"||role==="admin"||c.status==="aprobado"||c.status==="en_produccion"},
    {key:"obra",   label:"Obra",      show:canM},
    {key:"obras",  label:`📋${(c.obras||[]).length>0?" ("+c.obras.length+")":""}`, show:canM||canF},
    {key:"agenda", label:"📅",        show:canM},
    {key:"fotos",  label:`📷${(c.fotos||[]).length>0?" ("+c.fotos.length+")":""}`, show:canM||role==="fabrica"},
    {key:"presup", label:"Presup.",   show:canF},
    {key:"pagos",  label:"Pagos",     show:canF},
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

      {/* TAB OBRAS MÚLTIPLES */}
      {tab==="obras"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,marginTop:12}}>
            <div style={S.cardTitle}>📋 Obras del cliente</div>
            {(canM||canF)&&(
              <button style={{...S.primaryBtn,fontSize:12,padding:"7px 12px"}}
                onClick={()=>{
                  const nueva={
                    id:"ob"+Date.now(),
                    titulo:"Nueva obra",
                    fecha:today(),
                    descripcion:"",
                    status:"pendiente",
                    aberturas:[],
                    monto:"",
                    notas:"",
                    entregasAb:{},
                  };
                  save({obras:[...(c.obras||[]),nueva]});
                  showToast("Obra agregada ✓");
                }}>+ Nueva obra</button>
            )}
          </div>

          {(!c.obras||c.obras.length===0)&&(
            <div style={{...S.card,textAlign:"center",color:"#475569",padding:"30px 16px"}}>
              <div style={{fontSize:32,marginBottom:8}}>📋</div>
              <div style={{fontWeight:700,color:"#64748b",marginBottom:4}}>Sin obras registradas</div>
              <div style={{fontSize:13,color:"#334155"}}>Usá este tab para clientes que te van pidiendo diferentes trabajos en momentos distintos.</div>
            </div>
          )}

          {(c.obras||[]).map((obra,idx)=>(
            <ObraMiniCard key={obra.id}
              obra={obra}
              canM={canM} canF={canF}
              onUpdate={obraActualizada=>{
                const obras=(c.obras||[]).map(o=>o.id===obraActualizada.id?obraActualizada:o);
                save({obras});
              }}
              onDelete={()=>{
                if(!window.confirm("¿Eliminar esta obra?"))return;
                const obras=(c.obras||[]).filter(o=>o.id!==obra.id);
                save({obras});
              }}
              clienteNombre={c.nombre}
              clienteTelefono={c.telefono}
              showToast={showToast}
            />
          ))}
        </div>
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
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={S.cardTitle}>💰 Precio por abertura</div>
              </div>
              <div style={{fontSize:12,color:"#475569",marginBottom:12}}>
                Marcá el estado de cada abertura. Solo las ✅ Confirmadas se suman al total.
              </div>
              {(c.aberturas||[]).map((a,i)=>{
                const precio      = parseFloat((c.preciosAb||{})[a.id])||0;
                const precioMono  = parseFloat((c.preciosMono||{})[a.id])||0;
                const cant        = parseInt(a.cantidad)||1;
                const subtotalAb  = precio*cant;
                const subtotalMono= precioMono*cant;
                const subtotal    = subtotalAb+subtotalMono;
                const estadoAb    = (c.estadosAb||{})[a.id]||"sin_decidir";

                const ESTADOS_AB = [
                  {id:"confirmada",  label:"✅ Confirmada",   color:"#34d399", bg:"#052e1c", border:"#34d39955"},
                  {id:"en_espera",   label:"⏳ Para después", color:"#f59e0b", bg:"#2d1a00", border:"#f59e0b55"},
                  {id:"cancelada",   label:"❌ Cancelada",    color:"#ef4444", bg:"#1a0505", border:"#ef444455"},
                  {id:"sin_decidir", label:"⬜ Sin decidir",  color:"#475569", bg:"transparent", border:"#162035"},
                ];
                const estadoActual = ESTADOS_AB.find(e=>e.id===estadoAb)||ESTADOS_AB[3];

                const recalcTotal = (nuevosAb, nuevosMono, nuevosEstados) => {
                  return (c.aberturas||[]).reduce((s,ab)=>{
                    const est=(nuevosEstados||c.estadosAb||{})[ab.id]||"sin_decidir";
                    if(est==="cancelada"||est==="en_espera") return s;
                    const p  = parseFloat(nuevosAb[ab.id])||0;
                    const pm = parseFloat(nuevosMono[ab.id])||0;
                    return s+(p+pm)*(parseInt(ab.cantidad)||1);
                  },0);
                };

                return (
                  <div key={a.id} style={{borderBottom:`1px solid #0c1525`,padding:"12px 0",
                    opacity:estadoAb==="cancelada"?0.45:estadoAb==="en_espera"?0.7:1}}>

                    {/* Descripción + selector estado */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
                      <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.4,flex:1}}>
                        <b style={{color:"#e2e8f0"}}>{i+1})</b> {aberturaResumen(a)}
                      </div>
                      <select
                        style={{background:estadoActual.bg,border:`1px solid ${estadoActual.border}`,
                          color:estadoActual.color,borderRadius:8,padding:"5px 8px",fontSize:11,
                          fontWeight:700,cursor:"pointer",outline:"none",flexShrink:0}}
                        value={estadoAb}
                        onChange={e=>{
                          const nuevosEstados={...(c.estadosAb||{}),[a.id]:e.target.value};
                          const total=recalcTotal(c.preciosAb||{}, c.preciosMono||{}, nuevosEstados);
                          setC(prev=>({...prev,estadosAb:nuevosEstados,monto:String(total)}));
                        }}>
                        {ESTADOS_AB.map(est=>(
                          <option key={est.id} value={est.id}>{est.label}</option>
                        ))}
                      </select>
                    </div>

                    {estadoAb==="en_espera"&&<div style={{fontSize:11,color:"#f59e0b",background:"#2d1a00",border:"1px solid #f59e0b33",borderRadius:7,padding:"4px 10px",marginBottom:6,display:"inline-block"}}>⏳ Se fabricará en una segunda etapa</div>}
                    {estadoAb==="cancelada"&&<div style={{fontSize:11,color:"#ef4444",background:"#1a0505",border:"1px solid #ef444433",borderRadius:7,padding:"4px 10px",marginBottom:6,display:"inline-block"}}>❌ No incluida en este presupuesto</div>}

                    {/* Precio abertura */}
                    {estadoAb!=="cancelada"&&(
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:a.monoblock?8:0}}>
                        <div style={{flex:1}}>
                          <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:3}}>Precio unitario ($)</label>
                          <input type="number" style={{width:"100%",background:"#090e18",border:"1px solid #1a2845",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                            placeholder="0"
                            value={(c.preciosAb||{})[a.id]||""}
                            onChange={e=>{
                              const nuevos={...(c.preciosAb||{}),[a.id]:e.target.value};
                              const total=recalcTotal(nuevos, c.preciosMono||{}, c.estadosAb||{});
                              setC(prev=>({...prev,preciosAb:nuevos,monto:String(total)}));
                            }}/>
                        </div>
                        <div style={{fontSize:12,color:"#64748b",paddingTop:16}}>× {cant}</div>
                        <div style={{minWidth:76,textAlign:"right",paddingTop:16}}>
                          <div style={{fontSize:10,color:"#475569",marginBottom:2}}>Subtotal</div>
                          <div style={{fontWeight:700,color:subtotalAb>0?"#34d399":"#334155",fontSize:13}}>{subtotalAb>0?fmtMoney(subtotalAb):"—"}</div>
                        </div>
                      </div>
                    )}

                    {/* Precio monoblock */}
                    {a.monoblock&&estadoAb!=="cancelada"&&(
                      <div style={{display:"flex",gap:8,alignItems:"center",background:"#fb923c0a",border:"1px solid #fb923c22",borderRadius:8,padding:"8px",marginBottom:8}}>
                        <div style={{flex:1}}>
                          <label style={{fontSize:10,color:"#fb923c",display:"block",marginBottom:3}}>📦 Precio unitario Monoblock ($)</label>
                          <input type="number" style={{width:"100%",background:"#090e18",border:"1px solid #fb923c44",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:14,outline:"none"}}
                            placeholder="0"
                            value={(c.preciosMono||{})[a.id]||""}
                            onChange={e=>{
                              const nuevos={...(c.preciosMono||{}),[a.id]:e.target.value};
                              const total=recalcTotal(c.preciosAb||{}, nuevos, c.estadosAb||{});
                              setC(prev=>({...prev,preciosMono:nuevos,monto:String(total)}));
                            }}/>
                        </div>
                        <div style={{fontSize:12,color:"#fb923c88",paddingTop:16}}>× {cant}</div>
                        <div style={{minWidth:76,textAlign:"right",paddingTop:16}}>
                          <div style={{fontSize:10,color:"#fb923c88",marginBottom:2}}>Subtotal mono</div>
                          <div style={{fontWeight:700,color:subtotalMono>0?"#fb923c":"#334155",fontSize:13}}>{subtotalMono>0?fmtMoney(subtotalMono):"—"}</div>
                        </div>
                      </div>
                    )}

                    {/* Total combinado ventana+monoblock */}
                    {a.monoblock&&subtotal>0&&estadoAb!=="cancelada"&&(
                      <div style={{textAlign:"right",marginTop:2,fontSize:12,color:"#94a3b8"}}>
                        Total ventana+monoblock: <b style={{color:"#34d399"}}>{fmtMoney(subtotal)} × {cant} = {fmtMoney(subtotal*cant)}</b>
                      </div>
                    )}

                    {/* Comparativas */}
                    {estadoAb!=="cancelada"&&(()=>{
                      const variantes=(c.variantesAb||{})[a.id]||[];
                      return (
                        <div style={{marginTop:8,background:"#0a1a2e",border:"1px solid #a78bfa33",borderRadius:10,padding:"10px 12px"}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#a78bfa",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            📊 Comparativas de precio
                            <button style={{background:"#a78bfa22",border:"1px solid #a78bfa44",color:"#a78bfa",borderRadius:7,padding:"3px 9px",fontSize:11,cursor:"pointer"}}
                              onClick={()=>{
                                const nv={...(c.variantesAb||{}),[a.id]:[...variantes,{id:Date.now(),desc:"",precio:""}]};
                                setC(p=>({...p,variantesAb:nv}));
                              }}>+ Agregar</button>
                          </div>
                          {variantes.length===0&&<div style={{fontSize:11,color:"#334155",lineHeight:1.5}}>Ej: <i>"Sin monoblock → $6.400"</i> · <i>"Color bronce → $7.100"</i></div>}
                          {variantes.map((v,vi)=>(
                            <div key={v.id} style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                              <input style={{flex:2,background:"#090e18",border:"1px solid #2d2d5e",borderRadius:7,padding:"7px 8px",color:"#e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box"}}
                                placeholder="Sin monoblock / Color bronce..."
                                value={v.desc}
                                onChange={e=>{
                                  const nv=variantes.map((vv,j)=>j===vi?{...vv,desc:e.target.value}:vv);
                                  setC(p=>({...p,variantesAb:{...(p.variantesAb||{}),[a.id]:nv}}));
                                }}/>
                              <div style={{position:"relative",flex:1}}>
                                <span style={{position:"absolute",left:7,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#475569"}}>$</span>
                                <input type="number" style={{width:"100%",background:"#090e18",border:"1px solid #2d2d5e",borderRadius:7,padding:"7px 7px 7px 18px",color:"#e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box"}}
                                  placeholder="0" value={v.precio}
                                  onChange={e=>{
                                    const nv=variantes.map((vv,j)=>j===vi?{...vv,precio:e.target.value}:vv);
                                    setC(p=>({...p,variantesAb:{...(p.variantesAb||{}),[a.id]:nv}}));
                                  }}/>
                              </div>
                              {v.precio&&<span style={{fontSize:11,color:"#64748b",whiteSpace:"nowrap"}}>×{cant}={fmtMoney((parseFloat(v.precio)||0)*cant)}</span>}
                              <button style={{background:"transparent",border:"1px solid #450a0a",color:"#f87171",borderRadius:6,padding:"5px 7px",fontSize:11,cursor:"pointer",flexShrink:0}}
                                onClick={()=>{
                                  const nv=variantes.filter((_,j)=>j!==vi);
                                  setC(p=>({...p,variantesAb:{...(p.variantesAb||{}),[a.id]:nv}}));
                                }}>✕</button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}

              {/* Total o modo comparativo */}
              {(()=>{
                const tieneComparativas=(c.aberturas||[]).some(a=>((c.variantesAb||{})[a.id]||[]).some(v=>v.desc||v.precio));
                const guardarTodo=()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb,preciosMono:c.preciosMono,variantesAb:c.variantesAb,estadosAb:c.estadosAb});
                return tieneComparativas?(
                  <div style={{marginTop:12,background:"#0a1a2e",border:"1px solid #a78bfa55",borderRadius:12,padding:"14px"}}>
                    <div style={{fontWeight:800,color:"#a78bfa",fontSize:14,marginBottom:6}}>📊 Modo comparativo activo</div>
                    <div style={{fontSize:12,color:"#64748b",marginBottom:12,lineHeight:1.5}}>No se muestra total para no confundir al cliente. Borrá las comparativas para volver al modo normal.</div>
                    <button style={{...S.waBtn,width:"100%"}}
                      onClick={()=>{guardarTodo();window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${buildWA({...c,modoComparativo:true})}`,"_blank");}}>
                      💬 Enviar comparativa por WhatsApp
                    </button>
                  </div>
                ):(
                  <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",marginTop:4,borderTop:`1px solid ${BORDER}`}}>
                    <span style={{fontWeight:800,color:"#e2e8f0",fontSize:15}}>Total</span>
                    <span style={{fontWeight:900,color:ACCENT,fontSize:20}}>{fmtMoney(c.monto)}</span>
                  </div>
                );
              })()}
              <button style={{...S.primaryBtn,width:"100%",marginTop:12}}
                onClick={()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb,preciosMono:c.preciosMono,variantesAb:c.variantesAb,estadosAb:c.estadosAb})}>
                Guardar ✓
              </button>
            </div>
          )}
          {c.obsModo==="escribir" && c.notas && (
            <div style={S.card}><div style={S.cardTitle}>📝 Notas de medición</div><Nota title="Detalle" text={c.notas}/></div>
          )}
          <Blk title="📝 Observaciones y plazos" onSave={()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb,preciosMono:c.preciosMono,variantesAb:c.variantesAb,estadosAb:c.estadosAb})}>
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
          {c.monto&&(()=>{
            const tieneComparativas=(c.aberturas||[]).some(a=>((c.variantesAb||{})[a.id]||[]).some(v=>v.desc||v.precio));
            const guardarTodo=()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb,preciosMono:c.preciosMono,variantesAb:c.variantesAb,estadosAb:c.estadosAb});
            return !tieneComparativas&&(
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
                <button style={S.waBtn}
                  onClick={()=>{guardarTodo();window.open(`https://wa.me/598${c.telefono.replace(/\D/g,"")}?text=${buildWA(c)}`,"_blank");}}>
                  💬 Enviar presupuesto por WhatsApp
                </button>
                <button style={{...S.ghostBtn,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px 0",border:"1px solid #1e3a5f",color:"#60a5fa"}}
                  onClick={()=>{guardarTodo();generarWordPresupuesto(c);}}>
                  📄 Generar documento Word
                </button>
                <button style={{...S.ghostBtn,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px 0",border:`1px solid ${ACCENT}55`,color:ACCENT}}
                  onClick={()=>setTab("agenda")}>
                  📅 Agendar visita de rectificación
                </button>
              </div>
            );
          })()}
          {c.status==="medido"&&c.monto&&<Btn label="📤 Marcar como enviado al cliente" color="#a78bfa" textColor={BG} onClick={()=>save({presupuesto:c.presupuesto,monto:c.monto,preciosAb:c.preciosAb,preciosMono:c.preciosMono,variantesAb:c.variantesAb,estadosAb:c.estadosAb,status:"presupuestado"})}/>}

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
          <Field label="Fecha de medición" value={c.fechaMedicion||""} onChange={v=>{setC(p=>{const u={...p,fechaMedicion:v};cRef.current=u;return u;});}} type="date"/>
          <FieldText label="Detalle de la obra" value={c.notas||""} onChange={v=>{
            setC(p=>{const u={...p,notas:v};cRef.current=u;return u;});
          }} rows={9}
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
              ["ventana","puerta","especial","catalana","mampara"].map(cat=>(
                <div key={cat} style={{marginBottom:18}}>
                  <div style={S.catLbl}>{cat==="ventana"?"🪟 Ventanas":cat==="puerta"?"🚪 Puertas":cat==="catalana"?"🪟 Persianas Catalanas":cat==="mampara"?"🚿 Mamparas de Baño":"⬛ Especiales"}</div>
                  <div style={S.tiposGrid}>
                    {TIPOS.filter(t=>t.categoria===cat).map(t=>(
                      <button key={t.id} style={S.tipoCard} onClick={()=>{
                        if(t.configs.length===1){setAb(selector.rowId,"tipo",t.id,{config:t.configs[0].id});setSelector(null);}
                        else{setAb(selector.rowId,"tipo",t.id);setSelector({rowId:selector.rowId,step:"config",tipoId:t.id});}
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
          {["mampara_f1","mampara_std","mampara_l"].includes(ab.tipo)?(
            // Mampara: un solo ancho (pared pareja) o sup+inf (pared irregular)
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
              {/* Toggle pared pareja / irregular */}
              <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,
                color:ab.paredIrregular?"#f59e0b":"#64748b",
                background:ab.paredIrregular?"#f59e0b10":"transparent",
                border:`1px solid ${ab.paredIrregular?"#f59e0b44":BORDER}`,
                borderRadius:7,padding:"5px 9px",alignSelf:"flex-start"}}>
                <input type="checkbox" checked={!!ab.paredIrregular}
                  onChange={e=>setAb(ab.id,"paredIrregular",e.target.checked)}
                  style={{accentColor:"#f59e0b",width:13,height:13}}/>
                Pared irregular (ancho sup ≠ inf)
              </label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {ab.paredIrregular?(
                  <>
                    <div style={{flex:1,minWidth:80}}>
                      <label style={S.miniLbl}>Ancho Sup. (cm)</label>
                      <input style={S.dimInput} type="number" step="0.5" value={ab.anchoSup||""} onChange={e=>setAb(ab.id,"anchoSup",e.target.value)} placeholder="0"/>
                    </div>
                    <div style={{flex:1,minWidth:80}}>
                      <label style={S.miniLbl}>Ancho Inf. (cm)</label>
                      <input style={S.dimInput} type="number" step="0.5" value={ab.anchoInf||""} onChange={e=>setAb(ab.id,"anchoInf",e.target.value)} placeholder="0"/>
                    </div>
                  </>
                ):(
                  <div style={{flex:2,minWidth:80}}>
                    <label style={S.miniLbl}>Ancho (cm)</label>
                    <input style={S.dimInput} type="number" step="0.5" value={ab.anchoSup||""} onChange={e=>setAb(ab.id,"anchoSup",e.target.value,{anchoInf:e.target.value})} placeholder="0"/>
                  </div>
                )}
                <div style={{flex:1,minWidth:70}}>
                  <label style={S.miniLbl}>Alto (cm)</label>
                  <input style={S.dimInput} type="number" step="0.5" value={ab.alto} onChange={e=>setAb(ab.id,"alto",e.target.value)} placeholder="0"/>
                </div>
                <div style={{width:60}}>
                  <label style={S.miniLbl}>Cant.</label>
                  <input style={{...S.dimInput,textAlign:"center"}} type="number" min="1" value={ab.cantidad} onChange={e=>setAb(ab.id,"cantidad",e.target.value)}/>
                </div>
              </div>
              {ab.paredIrregular&&ab.anchoSup&&ab.anchoInf&&Math.abs(parseFloat(ab.anchoSup)-parseFloat(ab.anchoInf))>1&&(
                <div style={{fontSize:11,color:"#f59e0b",background:"#f59e0b15",border:"1px solid #f59e0b44",borderRadius:7,padding:"5px 9px"}}>
                  ⚠️ Diferencia de {Math.abs(parseFloat(ab.anchoSup)-parseFloat(ab.anchoInf)).toFixed(1)}cm — verificar pared
                </div>
              )}
            </div>
          ):(
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
          )}

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
              {!["persiana","fijo","celosia","catalana","mampara_f1","mampara_std","mampara_l"].includes(ab.tipo)&&ab.tipo&&(
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

          {/* ── Campos Mampara de Baño ── */}
          {["mampara_f1","mampara_std","mampara_l"].includes(ab.tipo)&&(
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
              {/* Mampara en L: ancho lateral adicional */}
              {ab.tipo==="mampara_l"&&(
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:80}}>
                    <label style={S.miniLbl}>Ancho frontal (cm)</label>
                    <input style={S.dimInput} type="number" step="0.5" value={ab.anchoSup||""} onChange={e=>setAb(ab.id,"anchoSup",e.target.value,{anchoInf:e.target.value})} placeholder="0"/>
                  </div>
                  <div style={{flex:1,minWidth:80}}>
                    <label style={S.miniLbl}>Ancho lateral (cm)</label>
                    <input style={S.dimInput} type="number" step="0.5" value={ab.anchoLat||""} onChange={e=>setAb(ab.id,"anchoLat",e.target.value)} placeholder="0"/>
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:120}}>
                  <label style={S.miniLbl}>Color / Terminación</label>
                  {ab.tipo==="mampara_std"?(
                    <div style={{...S.dimInput,color:"#94a3b8",fontSize:13,display:"flex",alignItems:"center"}}>Anodizado</div>
                  ):(
                    <select style={S.sel} value={ab.mamColor||""} onChange={e=>setAb(ab.id,"mamColor",e.target.value)}>
                      <option value="">— color —</option>
                      <option value="Anodizado">Anodizado</option>
                      <option value="Blanco">Blanco</option>
                      <option value="Bronce">Bronce</option>
                      <option value="Brillante">Brillante</option>
                      <option value="Champagne">Champagne</option>
                      <option value="Negro">Negro</option>
                    </select>
                  )}
                </div>
                {ab.tipo==="mampara_f1"&&(
                  <div style={{flex:1,minWidth:120}}>
                    <label style={S.miniLbl}>Diseño</label>
                    <select style={S.sel} value={ab.mamDiseno||""} onChange={e=>setAb(ab.id,"mamDiseno",e.target.value)}>
                      <option value="">— diseño —</option>
                      <option value="Curvo">Curvo</option>
                      <option value="Recto">Recto</option>
                    </select>
                  </div>
                )}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{flex:1,minWidth:120}}>
                  <label style={S.miniLbl}>Vidrio / Panel</label>
                  {ab.tipo==="mampara_std"?(
                    <div style={{...S.dimInput,color:"#94a3b8",fontSize:13,display:"flex",alignItems:"center"}}>Acrílico</div>
                  ):(
                    <select style={S.sel} value={ab.mamVidrio||""} onChange={e=>setAb(ab.id,"mamVidrio",e.target.value)}>
                      <option value="">— vidrio —</option>
                      <option value="Templado 6mm">Templado 6mm</option>
                      <option value="Acrílico">Acrílico</option>
                    </select>
                  )}
                </div>
                {(ab.tipo==="mampara_f1"||ab.tipo==="mampara_l")&&(
                  <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,
                    color:ab.mamToallero?"#38bdf8":"#64748b",background:ab.mamToallero?"#38bdf815":"transparent",
                    border:`1px solid ${ab.mamToallero?"#38bdf844":BORDER}`,borderRadius:7,padding:"7px 10px",marginTop:16,flex:1}}>
                    <input type="checkbox" checked={!!ab.mamToallero} onChange={e=>setAb(ab.id,"mamToallero",e.target.checked)} style={{accentColor:"#38bdf8",width:14,height:14}}/>
                    Con toallero
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Color + Vidrio — solo aberturas de aluminio */}
          {ab.tipo&&ab.tipo!=="catalana"&&!["mampara_f1","mampara_std","mampara_l"].includes(ab.tipo)&&(
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
                {["mampara_f1","mampara_std"].includes(ab.tipo)
                  ? `↑${ab.anchoSup||"?"}cm ↓${ab.anchoInf||"?"}cm × ${ab.alto||"?"}cm · cant: ${ab.cantidad||1}`
                  : `${ab.ancho||"?"} x ${ab.alto||"?"} cm · cant: ${ab.cantidad||1}`}
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
              ):["mampara_f1","mampara_std","mampara_l"].includes(ab.tipo)?(
                <div style={{color:"#94a3b8"}}>
                  {ab.mamColor&&<span>{ab.mamColor}</span>}
                  {ab.mamDiseno&&<span> · {ab.mamDiseno}</span>}
                  {ab.mamVidrio&&<span> · {ab.mamVidrio}</span>}
                  {ab.mamToallero&&<span style={{color:"#38bdf8"}}> · 🧴 Con toallero</span>}
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
  splashBrand:{fontSize:26,fontWeight:900,color:"#f1f5f9",letterSpacing:"1px"},
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

  tabs:{display:"flex",borderBottom:`1px solid ${BORDER}`,marginTop:14,overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"},
  tab:{flex:"0 0 auto",background:"none",border:"none",borderBottom:"2px solid transparent",padding:"9px 7px",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"},

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
