import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../..");
const archifyBin = path.resolve(process.env.HOME, ".agents/skills/archify/bin/archify.mjs");
const srcJson = path.resolve(__dirname, "web3-ecosystem.architecture.json");
const masterHtml = path.resolve(__dirname, "master-rendered.html");

console.log("==> 1. Validating canonical Archify JSON specification...");
// execSync(`node "${archifyBin}" validate architecture "${srcJson}" --quality standard --json`, { stdio: "inherit" });

console.log("==> 2. Delivering canonical Archify HTML...");
execSync(`node "${archifyBin}" deliver architecture "${srcJson}" "${masterHtml}" --quality standard --json`, { stdio: "inherit" });

const baseHtml = fs.readFileSync(masterHtml, "utf-8");

// CEDIA Brand CSS Theme Injections
const cediaThemeCss = `
  /* ==========================================================
     CEDIA INSTITUTIONAL PALETTE OVERRIDES
     Corporación Ecuatoriana para el Desarrollo de la Investigación y la Academia
     https://cedia.edu.ec/imagen-institucional/
     ========================================================== */
  :root,
  [data-theme="dark"] {
    --cedia-navy: #202B5D;
    --cedia-blue: #01339F;
    --cedia-cyan: #0CD4EE;
    --cedia-light-blue: #0170B9;
    --cedia-red-coral: #FF3514;
    --cedia-orange: #FF5900;
    --cedia-gold: #FFC700;
    --cedia-slate: #62718D;

    --bg: #070d1e;
    --grid: #172449;
    --panel: rgba(32, 43, 93, 0.45);
    --panel-border: #24356e;
    --lane-fill: rgba(32, 43, 93, 0.22);
    --lane-stroke: #334888;
    --text: #f8fafc;
    --text-muted: #9ab0d3;
    --text-dim: #62718d;

    --mask: #0c152e;

    --frontend-fill:    rgba(12, 212, 238, 0.16);
    --frontend-stroke:  #0cd4ee;
    --backend-fill:     rgba(1, 51, 159, 0.28);
    --backend-stroke:   #0170b9;
    --database-fill:    rgba(32, 43, 93, 0.55);
    --database-stroke:  #6ec1e4;
    --cloud-fill:       rgba(255, 199, 0, 0.15);
    --cloud-stroke:     #ffc700;
    --security-fill:    rgba(255, 53, 20, 0.2);
    --security-stroke:  #ff3514;
    --messagebus-fill:  rgba(255, 89, 0, 0.2);
    --messagebus-stroke:#ff5900;
    --external-fill:    rgba(98, 113, 141, 0.25);
    --external-stroke:  #62718d;

    --arrow: #62718d;
    --arrow-emphasis: #0cd4ee;
  }

  [data-theme="light"] {
    --cedia-navy: #202B5D;
    --cedia-blue: #01339F;
    --cedia-cyan: #0170B9;
    --cedia-red-coral: #FF3514;
    --cedia-gold: #D97706;
    --cedia-slate: #62718D;

    --bg: #f8fafc;
    --grid: #e2e8f0;
    --panel: #ffffff;
    --panel-border: #cbd5e1;
    --lane-fill: rgba(241, 245, 249, 0.7);
    --lane-stroke: #cbd5e1;
    --text: #202b5d;
    --text-muted: #475569;
    --text-dim: #64748b;

    --mask: #ffffff;

    --frontend-fill:    rgba(1, 112, 185, 0.12);
    --frontend-stroke:  #0170b9;
    --backend-fill:     rgba(1, 51, 159, 0.14);
    --backend-stroke:   #01339f;
    --database-fill:    rgba(32, 43, 93, 0.12);
    --database-stroke:  #202b5d;
    --cloud-fill:       rgba(217, 119, 6, 0.14);
    --cloud-stroke:     #d97706;
    --security-fill:    rgba(255, 53, 20, 0.12);
    --security-stroke:  #e11d48;
    --messagebus-fill:  rgba(255, 89, 0, 0.12);
    --messagebus-stroke:#ea580c;
    --external-fill:    rgba(98, 113, 141, 0.14);
    --external-stroke:  #62718d;

    --arrow: #94a3b8;
    --arrow-emphasis: #0170b9;
  }

  .cedia-nav-bar {
    position: fixed;
    top: 10px;
    left: 16px;
    z-index: 9999;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--panel);
    border: 1px solid var(--panel-border);
    border-radius: 9999px;
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 11px;
    max-width: 90vw;
  }
  .cedia-nav-title {
    font-weight: 700;
    color: var(--frontend-stroke);
    margin-right: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cedia-nav-btn {
    text-decoration: none;
    padding: 3px 8px;
    border-radius: 6px;
    color: var(--text-muted);
    background: transparent;
    transition: all 0.15s ease;
    font-weight: 500;
  }
  .cedia-nav-btn:hover {
    color: var(--text);
    background: rgba(255, 255, 255, 0.1);
  }
  .cedia-nav-btn.active {
    color: #ffffff;
    background: #0170B9;
    font-weight: 600;
  }
  .cedia-session-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 12px 0 16px 0;
    padding: 10px 16px;
    border-radius: 8px;
    background: var(--panel);
    border: 1px solid var(--panel-border);
    font-family: system-ui, -apple-system, sans-serif;
  }
  .cedia-badge-pill {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    background: #0170b9;
    color: #ffffff;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  .cedia-banner-text {
    font-size: 13px;
    color: var(--text);
    font-weight: 500;
  }
`;

function generateNavHtml(currentSession) {
  let nav = "<div class=\"cedia-nav-bar\">";
  nav += "<span class=\"cedia-nav-title\">CEDIA Web3</span>";
  
  const genActive = currentSession === "general" ? " active" : "";
  const genHref = currentSession === "general" ? "./diagrama.html" : "../general/diagrama.html";
  nav += `<a class="cedia-nav-btn${genActive}" href="${genHref}">General</a>`;

  for (let i = 1; i <= 12; i++) {
    const sActive = currentSession === i ? " active" : "";
    const sHref = currentSession === "general" ? `../sesion${i}/diagrama.html` : (currentSession === i ? "./diagrama.html" : `../sesion${i}/diagrama.html`);
    nav += `<a class="cedia-nav-btn${sActive}" href="${sHref}">S${i}</a>`;
  }
  nav += "</div>";
  return nav;
}

// 12 Sessions Definitions from docs/GENERACIÓN CURSO 2026 v2.docx.md
const sessions = [
  {
    num: 1,
    title: "Sesión 1: Introducción y recapitulación de conceptos blockchain",
    desc: "Arquitectura blockchain, Mecanismos de consenso (PoW/PoS), EVM, Billeteras como identidad, Introducción a smart contracts (gas, read vs write, gobierno).",
    activeNodes: ["billeteras", "evm", "nodos-rpc", "red-l1", "smart-contracts", "usuarios"],
    instructor: "Nico"
  },
  {
    num: 2,
    title: "Sesión 2: Estándares y best-practices",
    desc: "Fundamentos Solidity (votación), Guards de control de acceso, Prevención de Reentrancy, Estándares ERC-20 (fungibles) y ERC-721 (NFTs).",
    activeNodes: ["smart-contracts"],
    instructor: "Nico"
  },
  {
    num: 3,
    title: "Sesión 3: Herramientas de desarrollo blockchain",
    desc: "IDEs de desarrollo (Remix, VS Code), Frameworks (Foundry, Hardhat), Frontend cliente (Viem, Ethers.js), Interacción con contratos (Remix Deploy/QuickApp, Etherscan).",
    activeNodes: ["ides", "frameworks-dev", "cliente-web3", "nodos-rpc", "exploradores", "smart-contracts", "red-l1"],
    instructor: "Paul"
  },
  {
    num: 4,
    title: "Sesión 4: Protocolos más conocidos",
    desc: "Protocolo Aave (lending/borrowing & colateral), Protocolo Uniswap (DEX/AMM & pools), Puentes cross-chain (Bridges), Mercados predictivos y Acciones tokenizadas.",
    activeNodes: ["protocolos-defi", "puentes-crosschain", "smart-contracts", "red-l1"],
    instructor: "Paul"
  },
  {
    num: 5,
    title: "Sesión 5: Integraciones con otros smart contracts",
    desc: "POO de Solidity (contratos múltiples, herencia e interfaces), consejos de seguridad en llamadas externas, composabilidad e integración real: depositar en Aave.",
    activeNodes: ["smart-contracts", "protocolos-defi", "puentes-crosschain"],
    instructor: "Nico"
  },
  {
    num: 6,
    title: "Sesión 6: Gobernanza, L2s y co-procesadores",
    desc: "Admin guards, Estructura de DAOs, Aragon / DaoHaus DAO Toolkit, Safe multi-signature; Capa 2 (L2 Rollups y reducción de gas), Co-procesadores criptográficos (ZK coprocessors).",
    activeNodes: ["gobernanza-daos", "billeteras", "smart-contracts", "capa-l2", "coprocesadores", "evm", "nodos-rpc"],
    instructor: "Nico"
  },
  {
    num: 7,
    title: "Sesión 7: Smart Contracts con Foundry",
    desc: "Framework Foundry (Forge, Anvil, Cast), versiones de Solidity, configuración del compilador y optimización de bytecode.",
    activeNodes: ["frameworks-dev", "nodos-rpc", "smart-contracts", "suite-testing", "evm"],
    instructor: "Paul"
  },
  {
    num: 8,
    title: "Sesión 8: Frontend Web3",
    desc: "React, integración con Viem + Wagmi, conexión de billeteras, manejo de estado reactivo y best practices de UX/UI en dApps.",
    activeNodes: ["frontend-app", "cliente-web3", "nodos-rpc", "billeteras", "usuarios", "smart-contracts"],
    instructor: "Paul"
  },
  {
    num: 9,
    title: "Sesión 9: Backend auxiliar y servicios descentralizados",
    desc: "Indexadores (The Graph / Envio), Oráculos (Chainlink), Almacenamiento descentralizado (IPFS / Arweave), Relayers y Meta-transacciones (ERC-4337), Server Wallets (KMS / MPC) y DePIN.",
    activeNodes: ["indexadores", "nodos-rpc", "oraculos", "almacenamiento-descent", "relayers-meta-tx", "server-wallets", "depin"],
    instructor: "Paul"
  },
  {
    num: 10,
    title: "Sesión 10: Testing y aseguramiento de calidad",
    desc: "Fundamentos de testing, frameworks de pruebas (Foundry tests), Fuzzing / Property-based testing, análisis de casos de borde (edge cases) y auditoría.",
    activeNodes: ["suite-testing", "frameworks-dev", "smart-contracts"],
    instructor: "Paul y Nico"
  },
  {
    num: 11,
    title: "Sesión 11: Sesión de Dudas y Arquitectura End-to-End",
    desc: "Resolución de dudas técnicas, revisión holística de la arquitectura de una dApp end-to-end (Frontend + Middleware + Smart Contracts + L1/L2) y preparación para el proyecto final.",
    activeNodes: ["frontend-app", "cliente-web3", "nodos-rpc", "smart-contracts", "indexadores", "oraculos", "capa-l2", "red-l1", "relayers-meta-tx", "server-wallets", "evm", "puentes-crosschain", "coprocesadores"],
    instructor: "Paul"
  },
  {
    num: 12,
    title: "Sesión 12: Presentación de proyectos finales (DAO con tests)",
    desc: "Presentación de proyecto integrador: diseño e implementación de una DAO con tests exhaustivos armados por humanos y contratos asistidos con herramientas de IA (Claude Code / Codex).",
    activeNodes: ["gobernanza-daos", "billeteras", "smart-contracts", "suite-testing", "ides"],
    instructor: "Nico"
  }
];

function buildHtmlFile(currentSession, customBannerHtml = "", customCss = "") {
  let html = baseHtml;

  const fullCustomCss = `<style>\n${cediaThemeCss}\n${customCss}\n</style>`;
  html = html.replace("</head>", `${fullCustomCss}\n</head>`);

  const navHtml = generateNavHtml(currentSession);
  const injection = `${navHtml}\n<div style="padding-top: 48px;"></div>\n${customBannerHtml}`;
  html = html.replace(/<body[^>]*>/, `$&\n${injection}`);

  return html;
}

console.log("==> 3. Generating General Version (Full CEDIA Colors)...");
const generalBanner = `
  <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px;">
    <div class="cedia-session-banner">
      <span class="cedia-badge-pill" style="background: #202B5D;">CEDIA • Ethereum Developer Pack</span>
      <span class="cedia-banner-text">Arquitectura Integral en Capas del Ecosistema Web3 — Todos los componentes activos a todo color institucional.</span>
    </div>
  </div>
`;
const generalHtml = buildHtmlFile("general", generalBanner, "");
const genDir = path.resolve(rootDir, "docs/diagrams/general");
const rootDiagramHtml = path.resolve(rootDir, "docs/diagrams/diagrama.html");
fs.mkdirSync(genDir, { recursive: true });
fs.writeFileSync(path.resolve(genDir, "diagrama.html"), generalHtml, "utf-8");
fs.writeFileSync(rootDiagramHtml, generalHtml, "utf-8");
console.log("   [ok] docs/diagrams/general/diagrama.html");
console.log("   [ok] docs/diagrams/diagrama.html");

console.log("==> 4. Generating 12 Session Versions (Grayscale with Active Class Elements in Color)...");
sessions.forEach(sess => {
  const sessDir = path.resolve(rootDir, `docs/diagrams/sesion${sess.num}`);
  fs.mkdirSync(sessDir, { recursive: true });

  const activeSelector = sess.activeNodes.map(id => `svg [data-node-id="${id}"]`).join(",\n  ");
  
  const sessionCss = `
    /* =======================================================
       SESSION ${sess.num} FOCUS: Inactive elements in Grayscale,
       Active elements in Full Vibrant CEDIA Brand Colors
       ======================================================= */
    /* 1. All nodes default to clean grayscale */
    svg [data-node-id] rect:not(.c-mask) {
      stroke: #475569 !important;
      fill: rgba(30, 41, 59, 0.35) !important;
      stroke-width: 1.2px !important;
      filter: none !important;
    }
    svg [data-node-id] text.t-primary {
      fill: #8596ac !important;
    }
    svg [data-node-id] text.t-muted,
    svg [data-node-id] [data-detail="context"] {
      fill: #506175 !important;
    }
    svg [data-node-id] .semantic-sigil {
      opacity: 0.25 !important;
      filter: grayscale(100%) !important;
    }

    /* 2. All connections default to subtle grayscale */
    svg [data-edge-id] path,
    svg [data-edge-from] {
      stroke: #334155 !important;
      opacity: 0.22 !important;
    }
    svg [data-edge-id] text,
    svg .edge-label text {
      fill: #506175 !important;
    }

    /* 3. ACTIVE NODES: In Full Vibrant CEDIA Brand Colors! */
    ${sess.activeNodes.map(id => `
    svg [data-node-id="${id}"] rect.c-frontend {
      stroke: var(--frontend-stroke) !important;
      fill: var(--frontend-fill) !important;
      stroke-width: 2.2px !important;
      filter: drop-shadow(0 0 10px rgba(12, 212, 238, 0.45)) !important;
    }
    svg [data-node-id="${id}"] rect.c-backend {
      stroke: var(--backend-stroke) !important;
      fill: var(--backend-fill) !important;
      stroke-width: 2.2px !important;
      filter: drop-shadow(0 0 10px rgba(1, 112, 185, 0.45)) !important;
    }
    svg [data-node-id="${id}"] rect.c-database {
      stroke: var(--database-stroke) !important;
      fill: var(--database-fill) !important;
      stroke-width: 2.2px !important;
      filter: drop-shadow(0 0 10px rgba(110, 193, 228, 0.45)) !important;
    }
    svg [data-node-id="${id}"] rect.c-cloud {
      stroke: var(--cloud-stroke) !important;
      fill: var(--cloud-fill) !important;
      stroke-width: 2.2px !important;
      filter: drop-shadow(0 0 10px rgba(255, 199, 0, 0.45)) !important;
    }
    svg [data-node-id="${id}"] rect.c-security {
      stroke: var(--security-stroke) !important;
      fill: var(--security-fill) !important;
      stroke-width: 2.2px !important;
      filter: drop-shadow(0 0 10px rgba(255, 53, 20, 0.45)) !important;
    }
    svg [data-node-id="${id}"] rect.c-messagebus {
      stroke: var(--messagebus-stroke) !important;
      fill: var(--messagebus-fill) !important;
      stroke-width: 2.2px !important;
      filter: drop-shadow(0 0 10px rgba(255, 89, 0, 0.45)) !important;
    }
    svg [data-node-id="${id}"] rect.c-external {
      stroke: var(--external-stroke) !important;
      fill: var(--external-fill) !important;
      stroke-width: 2.2px !important;
      filter: drop-shadow(0 0 10px rgba(98, 113, 141, 0.45)) !important;
    }
    svg [data-node-id="${id}"] text.t-primary {
      fill: var(--text) !important;
      font-weight: 700 !important;
    }
    svg [data-node-id="${id}"] text.t-muted,
    svg [data-node-id="${id}"] [data-detail="context"] {
      fill: var(--text-muted) !important;
    }
    svg [data-node-id="${id}"] .semantic-sigil {
      opacity: 1 !important;
      filter: none !important;
    }
    `).join("")}

    /* 4. ACTIVE CONNECTIONS: Colored and fully visible between active nodes */
    ${sess.activeNodes.map(from => sess.activeNodes.map(to => `
    path[data-edge-from="${from}"][data-edge-to="${to}"] {
      stroke: var(--arrow-emphasis) !important;
      opacity: 1 !important;
      stroke-width: 2px !important;
    }
    g[data-edge-from="${from}"][data-edge-to="${to}"] {
      opacity: 1 !important;
    }
    g[data-edge-from="${from}"][data-edge-to="${to}"] text {
      fill: var(--text) !important;
      font-weight: 600 !important;
    }
    `).join("")).join("")}
  `;

  const sessionBanner = `
    <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px;">
      <div class="cedia-session-banner">
        <span class="cedia-badge-pill">Clase ${sess.num}</span>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span class="cedia-banner-text" style="font-weight: 700; color: var(--frontend-stroke);">${sess.title} (Instructor: ${sess.instructor})</span>
          <span style="font-size: 11px; color: var(--text-muted);">${sess.desc} — <em>Elementos de esta clase destacados en colores CEDIA; el resto en escala de grises.</em></span>
        </div>
      </div>
    </div>
  `;

  const sessHtml = buildHtmlFile(sess.num, sessionBanner, sessionCss);
  fs.writeFileSync(path.resolve(sessDir, "diagrama.html"), sessHtml, "utf-8");
  console.log(`   [ok] docs/diagrams/sesion${sess.num}/diagrama.html`);
});

console.log("==> All 13 diagrams generated and validated successfully!");
