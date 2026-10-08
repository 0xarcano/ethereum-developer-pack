# Guión Didáctico de Clase: Sesión 8 — Frontend Web3 (Taller de Live Coding)

> **Curso**: Blockchain: Ethereum Developer Pack 2026 (Nivel Intermedio - Avanzado)  
> **Institución**: CEDIA (Corporación Ecuatoriana para el Desarrollo de la Investigación y la Academia) & Ecuador Web3  
> **Instructor**: Paul Rodas ([@0xarcano](https://github.com/0xarcano))  
> **Tema**: Frontend Web3 — Construcción Paso a Paso desde Cero (De Vanilla Viem a React + Wagmi)  
> **Duración Total**: 4 horas (240 min)  
> **Metodología**: Live Coding guiado e interactivo basado en el *Web3 Full-Stack Development Masterclass* (Cyfrin Updraft / Patrick Collins)  
> **Enfoque**: 100% Desarrollo Frontend (Sin pruebas de smart contracts, reservadas para la sesión de QA)

---

## 🎯 Objetivos Pedagógicos

Al finalizar este taller de 4 horas, el estudiante será capaz de:
1. **Comprender la arquitectura mental de un frontend descentralizado**: Entender cómo un navegador web se comunica con una blockchain mediante llamadas JSON-RPC sin servidores de backend tradicionales ni bases de datos centralizadas.
2. **Construir una dApp desde cero absoluto con Vanilla HTML + TypeScript + Viem**: Escribir línea por línea una interfaz funcional de votación directa contra `SimpleProposalVote.sol` manipulando directamente el DOM.
3. **Manejar el estándar EIP-1193 (`window.ethereum`)**: Detectar el proveedor inyectado por la extensión de billetera y solicitar cuentas sin coste de gas.
4. **Dominar los clientes de Viem**: Saber con precisión cuándo usar `PublicClient` (consultas públicas gratuitas vía `eth_call`) y `WalletClient` (transacciones firmadas con gas vía `eth_sendTransaction`).
5. **Aplicar la regla de oro de Patrick Collins**: Simular previamente cualquier transacción con `simulateContract` antes de solicitar la firma al usuario en MetaMask para evitar transacciones fallidas y quema innecesaria de gas.
6. **Comprender por qué "Un Transaction Hash NO es un Recibo"**: Identificar el estado de una transacción en la mempool frente a su inclusión definitiva en un bloque con `waitForTransactionReceipt`.
7. **Reconocer el punto de quiebre de Vanilla JS**: Vivir en carne propia los dolores de cabeza del código imperativo (sincronización manual de DOM, listeners de cuentas, pérdida de sesión tras recargar la página).
8. **Construir la Mini-DAO completa con React 19 + Wagmi v2 + TanStack Query**: Implementar una aplicación modular multi-contrato (`GovernanceToken`, `DaoGovernor`, `CommunityTreasury`) usando hooks declarativos reactivos y feedback visual profesional para el usuario.

---

## ⏱️ Cronograma de la Sesión (4 Horas / 240 Minutos)

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PARTE 1: HORAS 1 Y 2 (120 MIN)                         │
│             De Cero a dApp con Vanilla HTML + TypeScript + Viem                 │
├─────────────────┬───────────────┬───────────────────────────────────────────────┤
│ Bloque 1A       │ 00:00 - 00:20 │ Introducción, Modelo Mental Web2 vs Web3       │
│ Bloque 1B       │ 00:20 - 00:45 │ Live Coding: HTML Mínimo y Conexión de Wallet │
│ Bloque 1C       │ 00:45 - 01:15 │ Live Coding: Viem Clientes y Lectura Onchain  │
│ Bloque 1D       │ 01:15 - 01:45 │ Live Coding: Simulación, Envío de Voto y Hash │
│ Bloque 1E       │ 01:45 - 02:00 │ Listeners Nativos y "The Pain Points"         │
├─────────────────┴───────────────┴───────────────────────────────────────────────┤
│                   ☕ RECESO DIDÁCTICO & PREGUNTAS (10 MIN)                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                           PARTE 2: HORAS 3 Y 4 (120 MIN)                         │
│             Mini-DAO Completa con React 19 + Wagmi v2 + TanStack Query          │
├─────────────────┬───────────────┬───────────────────────────────────────────────┤
│ Bloque 2A       │ 02:00 - 02:25 │ Live Coding: Setup de Wagmi y TanStack Query  │
│ Bloque 2B       │ 02:25 - 02:50 │ Live Coding: ConnectBar y useAccount          │
│ Bloque 2C       │ 02:50 - 03:20 │ Live Coding: Balance CGOV con useReadContract │
│ Bloque 2D       │ 03:20 - 03:45 │ Live Coding: Listado y Voto con useWrite      │
│ Bloque 2E       │ 03:45 - 04:00 │ Feedback de UI, Retos Prácticos y Cierre      │
└─────────────────┴───────────────┴───────────────────────────────────────────────┘
```

---

# PARTE 1: Horas 1 y 2 (00:00 - 02:00) — Vanilla HTML + TypeScript + Viem

## Bloque 1A: Introducción, Setup y el Modelo Mental (00:00 - 00:20)

### 🎙️ Guión del Instructor (Talk Track)
> *"¡Bienvenidos a la Sesión 8! Hoy es el día en que nuestros contratos inteligentes cobran vida para los usuarios comunes.*
>
> *Hasta la sesión anterior vivimos escribiendo Solidity y ejecutando scripts en la terminal. Pero ningún usuario final va a abrir una terminal y ejecutar comandos de Foundry para interactuar con una DAO. Quieren una interfaz web rápida, amigable y confiable.*
>
> *Cuando un desarrollador que viene del mundo tradicional (Web2) empieza en Web3, su primer instinto es diseñar la arquitectura habitual:*
> - *'Voy a crear un servidor en Express o FastAPI.'*
> - *'Voy a guardar los votos en PostgreSQL.'*
> - *'Voy a crear un endpoint `/api/login` para guardar usuarios con contraseñas en cookies o tokens JWT.'*
>
> *En Web3, **desechamos por completo ese modelo mental**:*
> 1. *No hay servidor de login: **tu billetera (clave pública/privada) es tu identidad universal**.*
> 2. *No hay base de datos privada: **el estado de la blockchain es la única fuente de verdad global**.*
> 3. *Para comunicarnos con la blockchain no usamos REST ni GraphQL: **usamos llamadas JSON-RPC directas a un nodo de la red**.*
>
> *Siguiendo el método de Patrick Collins en el Masterclass de Cyfrin Updraft, no vamos a empezar arrojándoles React, Next.js, Wagmi o RainbowKit. Si empezamos con esas librerías, Web3 parece una 'caja negra de magia'. Vamos a empezar abriendo un archivo HTML completamente vacío y una terminal. Escribiremos cada línea a mano."*

### 💻 Prerrequisito en Terminal (1 minuto)
Asegurarse de tener Anvil corriendo en segundo plano:
```bash
# Terminal 1: Iniciar nodo local
anvil
```
*(Anvil queda corriendo en `http://127.0.0.1:8545` con Chain ID `31337`).*

---

## Bloque 1B: Live Coding — HTML Mínimo y Conexión de Billetera (00:20 - 00:45)

### 👨‍💻 Acción del Instructor en Pantalla
> *"Abran su editor en `dapp/packages/webapp/`. Vamos a crear un archivo llamado `index.html`. Miren lo que escribo:"*

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Votación Web3 (Viem)</title>
  </head>
  <body>
    <h1>Votación de Gobernanza (Viem Puro)</h1>
    
    <!-- Botón de Conexión -->
    <button id="connectButton">Conectar Billetera</button>
    <p id="accountDisplay">Estado: Desconectado</p>

    <script type="module" src="/src/index.ts"></script>
  </body>
</html>
```

### 🎙️ Guión del Instructor
> *"Ahora abran su navegador en `http://localhost:5173/` y abran la consola de desarrollador (F12).*
>
> *Escriban en la consola:*
> ```javascript
> window.ethereum
> ```
> *¿Qué ven? Ven un objeto con métodos como `request`, `on`, `removeListener`.*
>
> *¿De dónde salió ese objeto? No lo pusimos en el HTML. Lo inyectó la extensión de MetaMask o Rabby en el navegador. Este objeto representa la especificación **EIP-1193** (Ethereum Provider JavaScript API).*
>
> *Ahora vamos a `src/index.ts` para conectar este botón."*

### 👨‍💻 Live Coding: Detectar y Conectar en `src/index.ts`

```typescript
// 1. Obtener los elementos del DOM
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const accountDisplay = document.getElementById("accountDisplay") as HTMLParagraphElement;

let currentAccount: string | null = null;

// 2. Función de conexión
async function connect(): Promise<void> {
  // ¿El usuario tiene MetaMask instalado?
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask no detectado. ¡Por favor instala una billetera Web3!");
    return;
  }

  try {
    // Solicitamos acceso a las cuentas mediante el método estándar eth_requestAccounts
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    currentAccount = accounts[0];
    console.log("Cuenta conectada:", currentAccount);

    // Actualizar la interfaz
    accountDisplay.textContent = `Conectado: ${currentAccount}`;
    connectButton.textContent = "Billetera Conectada";
    connectButton.disabled = true;
  } catch (error) {
    console.error("El usuario rechazó la conexión:", error);
  }
}

// 3. Asignar el listener al botón
connectButton.onclick = connect;
```

### 🧠 Pregunta Interactiva a la Clase
- **Instructor**: *"Hagan clic en el botón. MetaMask abre su ventana emergente pidiendo conectar la cuenta. ¿Esta acción nos cobró gas en la red?"*
- **Respuesta esperada**: *"No, fue gratis."*
- **Instructor**: *"¡Exacto! ¿Por qué? Porque conectar la billetera NO es una transacción en la blockchain. Es simplemente un permiso que el usuario le da a la página web para leer su dirección pública (su cuenta `0x...`)."*

---

## Bloque 1C: Live Coding — Viem Clientes y Lectura Onchain (00:45 - 01:15)

### 🎙️ Guión del Instructor
> *"Hasta ahora usamos `window.ethereum.request` en crudo. Funciona, pero manipular datos hexadecimales crudos en Ethereum es propenso a errores. Aquí es donde entra **Viem**.*
>
> *En los años anteriores se usaba Ethers.js. Viem es la alternativa moderna: es modular, extremadamente ligera y aprovecha TypeScript al máximo.*
>
> *Viem nos enseña una lección de diseño fundamental dividiendo la interacción en dos clientes distintos:*
> 1. *`PublicClient`: El telescopio hacia el nodo. Solo lee información pública (`eth_call`). No tiene claves privadas ni gasta gas.*
> 2. *`WalletClient`: El puente hacia la billetera del usuario. Firma transacciones y mensajes (`eth_sendTransaction`).*
>
> *Vamos a agregar `PublicClient` para consultar el estado de la propuesta de votación."*

### 👨‍💻 Live Coding: Añadiendo el HTML de Lectura en `index.html`

```html
    <hr />
    <h2>Estado de la Propuesta</h2>
    <button id="readButton">Consultar Propuesta</button>
    <p><strong>Propuesta:</strong> <span id="proposalText">Sin consultar</span></p>
    <p><strong>Votos a Favor:</strong> <span id="votesFor">0</span></p>
    <p><strong>Votos en Contra:</strong> <span id="votesAgainst">0</span></p>
    <p><strong>¿Aprobada?:</strong> <span id="isApproved">No</span></p>
```

### 👨‍💻 Live Coding: Configurando Viem y Leyendo en `src/index.ts`

```typescript
import { createPublicClient, http } from "viem";
import { anvilChain } from "./config/chains";
import { simpleProposalVoteAbi } from "./abis";
import { CONTRACTS } from "./config/contracts";

// 1. Crear el PublicClient (Telescopio de lectura)
const publicClient = createPublicClient({
  chain: anvilChain,
  transport: http("http://127.0.0.1:8545"),
});

// 2. Obtener elementos del DOM para las lecturas
const readButton = document.getElementById("readButton") as HTMLButtonElement;
const proposalText = document.getElementById("proposalText") as HTMLSpanElement;
const votesFor = document.getElementById("votesFor") as HTMLSpanElement;
const votesAgainst = document.getElementById("votesAgainst") as HTMLSpanElement;
const isApproved = document.getElementById("isApproved") as HTMLSpanElement;

// 3. Función de lectura onchain
async function readProposal(): Promise<void> {
  console.log("Leyendo contrato en:", CONTRACTS.SimpleProposalVote);

  // Ejecutamos lecturas en paralelo con Promise.all
  const [prop, vFor, vAgainst, approved] = await Promise.all([
    publicClient.readContract({
      address: CONTRACTS.SimpleProposalVote,
      abi: simpleProposalVoteAbi,
      functionName: "proposal",
    }),
    publicClient.readContract({
      address: CONTRACTS.SimpleProposalVote,
      abi: simpleProposalVoteAbi,
      functionName: "votesFor",
    }),
    publicClient.readContract({
      address: CONTRACTS.SimpleProposalVote,
      abi: simpleProposalVoteAbi,
      functionName: "votesAgainst",
    }),
    publicClient.readContract({
      address: CONTRACTS.SimpleProposalVote,
      abi: simpleProposalVoteAbi,
      functionName: "isApproved",
    }),
  ]);

  // Actualizar el DOM
  proposalText.textContent = String(prop);
  votesFor.textContent = String(vFor);
  votesAgainst.textContent = String(vAgainst);
  isApproved.textContent = approved ? "SÍ" : "NO";
}

readButton.onclick = readProposal;
```

### 🔍 Concepto Clave: ¿Qué es el ABI?
> *"Miren el parámetro `abi: simpleProposalVoteAbi`. ¿Qué pasaría si no lo pasamos? Viem daría error.  
> La EVM no almacena los nombres de las funciones en texto; almacena bytes de bytecode. El **ABI (Application Binary Interface)** es el diccionario que le dice a Viem cómo codificar el nombre `votesFor` en el selector hexadecimal de 4 bytes (`0x...`) y cómo descodificar el número `uint256` que devuelve el nodo."*

---

## Bloque 1D: Live Coding — Simulación, Envío de Voto y Ciclo de Vida de Tx (01:15 - 01:45)

### 🎙️ Guión del Instructor
> *"Ahora llegamos al momento cumbre de la Parte 1: **escribir en la blockchain**. Modificar el estado.*
>
> *Para emitir un voto no podemos usar `PublicClient`, porque `PublicClient` no puede firmar. Necesitamos un `WalletClient` que envuelva a `window.ethereum`.*
>
> *Pero antes de escribir la línea de envío, quiero que aprendan la **Regla de Oro de Patrick Collins en el Masterclass**:  
> **'NUNCA envíes una transacción sin simularla primero'**.*
>
> *¿Por qué? Porque si un usuario intenta votar dos veces, el contrato ejecutará `require(!hasVoted[msg.sender], 'Already voted')`. Si no simulamos, MetaMask se abrirá, el usuario firmará, pagará gas, y la transacción revertirá en la red minada en un bloque fallido. El usuario perderá su dinero en comisiones.*
>
> *Con `publicClient.simulateContract()`, el nodo ejecuta la función en memoria localmente. Si va a revertir, nos avisa al instante en JavaScript **sin gastar un solo centavo de gas**."*

### 👨‍💻 Live Coding: Añadiendo Botones de Voto en `index.html`

```html
    <hr />
    <h2>Emitir Voto Onchain</h2>
    <button id="voteYesButton">Votar Sí (YES)</button>
    <button id="voteNoButton">Votar No (NO)</button>
    <p id="txStatus"></p>
```

### 👨‍💻 Live Coding: Creando `WalletClient` y Función de Voto en `src/index.ts`

```typescript
import { createWalletClient, custom } from "viem";

// 1. Crear el WalletClient
const walletClient = createWalletClient({
  chain: anvilChain,
  transport: custom(window.ethereum),
});

const voteYesButton = document.getElementById("voteYesButton") as HTMLButtonElement;
const voteNoButton = document.getElementById("voteNoButton") as HTMLButtonElement;
const txStatus = document.getElementById("txStatus") as HTMLParagraphElement;

async function castVote(support: boolean): Promise<void> {
  if (!currentAccount) {
    alert("¡Primero conecta tu billetera!");
    return;
  }

  txStatus.textContent = "1. Simulando transacción...";

  try {
    // PASO 1: Simulación preventiva (Patrick's Rule)
    const { request } = await publicClient.simulateContract({
      address: CONTRACTS.SimpleProposalVote,
      abi: simpleProposalVoteAbi,
      functionName: "vote",
      args: [support],
      account: currentAccount as `0x${string}`,
    });
    console.log("Simulación exitosa, no revertirá.");

    // PASO 2: Enviar transacción firmada
    txStatus.textContent = "2. Por favor confirma en tu billetera (MetaMask)...";
    const txHash = await walletClient.writeContract(request);
    console.log("Hash de transacción transmitido:", txHash);

    // Momento crítico: ¡El hash no es el recibo!
    txStatus.textContent = `3. Transacción en mempool. Hash: ${txHash.slice(0, 10)}... Esperando minado...`;

    // PASO 3: Esperar que el bloque sea minado
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log("Recibo confirmado en bloque:", receipt.blockNumber);

    txStatus.textContent = `¡Voto confirmado en el bloque #${receipt.blockNumber}!`;

    // PASO 4: Refrescar lecturas de la UI
    await readProposal();
  } catch (error: any) {
    console.error("Fallo al votar:", error);
    txStatus.textContent = `Error: ${error?.shortMessage || error.message}`;
  }
}

voteYesButton.onclick = () => void castVote(true);
voteNoButton.onclick = () => void castVote(false);
```

### ⚠️ El Momento Didáctico Crítico: Hash vs Recibo
> *"Fíjense bien en esta distinción:*
> - *`writeContract` retorna el **Transaction Hash**.*
> - *Muchos programadores novatos cometen el error de asumir que cuando tienen el hash, la base de datos de la blockchain ya cambió. **¡Falso!** El hash solo significa que el nodo aceptó la transacción en su mempool (sala de espera).*
> - *Para asegurarnos de que el voto fue registrado, debemos llamar a `waitForTransactionReceipt({ hash })` y esperar a que los validadores incluyan la transacción en un bloque minado."*

---

## Bloque 1E: Live Coding — Listeners Nativos y "The Pain Points" (01:45 - 02:00)

### 🎙️ Guión del Instructor
> *"Nuestra dApp de votación funciona. Pero probemos algunos casos reales de usuarios:*
> 1. *Abran MetaMask y cambien a otra cuenta (Cuenta #1).*
> 2. *Miren la pantalla: el botón sigue diciendo que la Cuenta #0 está conectada.*
> 3. *Si el usuario recarga la página (F5), la aplicación olvida que estaba conectado.*
>
> *Para resolver esto con JavaScript tradicional, tenemos que agregar listeners manuales:"*

```typescript
// Escuchar cambio de cuentas en MetaMask
window.ethereum.on("accountsChanged", (accounts: string[]) => {
  if (accounts.length === 0) {
    currentAccount = null;
    accountDisplay.textContent = "Estado: Desconectado";
    connectButton.disabled = false;
  } else {
    currentAccount = accounts[0];
    accountDisplay.textContent = `Conectado: ${currentAccount}`;
    void readProposal();
  }
});

// Escuchar cambio de red
window.ethereum.on("chainChanged", () => {
  window.location.reload();
});
```

### 🥊 La Crisis del Código Imperativo ("Why Imperative Breaks")
> *"Miremos el código que acabamos de escribir en `src/index.ts` para un solo botón y una sola propuesta:*
> - *Tuvimos que escribir 15 llamadas a `document.getElementById`.*
> - *Tuvimos que manejar listeners manuales de `accountsChanged` y `chainChanged`.*
> - *Tuvimos que encadenar `Promise.all` y sincronizar los textos uno por uno.*
> - *Si tuviéramos 20 propuestas, un token ERC-20 y una tesorería, este archivo se convertiría en un monstruo inmanejable de 1,000 líneas de código espagueti.*
>
> *Aquí cerramos la Parte 1. Nos tomamos un receso de 10 minutos. Al regresar, aprenderemos cómo **Wagmi y React 19** transforman todo este código imperativo en elegantes hooks declarativos de una sola línea."*

---

# PARTE 2: Horas 3 y 4 (02:00 - 04:00) — Mini-DAO con React 19 + Wagmi v2

## Bloque 2A: Live Coding — Setup de Wagmi y TanStack Query (02:00 - 02:25)

### 🎙️ Guión del Instructor
> *"Bienvenidos a la segunda parte. Ahora pasamos a la arquitectura profesional.*
>
> *¿Qué es **Wagmi**? Wagmi ('We're All Gonna Make It') es una suite de hooks reactivos para React construida directamente sobre Viem.*
>
> *En lugar de nosotros guardar variables globales, listeners de eventos y bucles de re-consulta, Wagmi hace todo eso de forma automática utilizando **TanStack Query** (React Query).*
>
> *Vamos a configurar Wagmi paso a paso en `src/config/wagmi.ts` y envolver nuestra aplicación en `src/main.tsx`."*

### 👨‍💻 Live Coding: Configurando Wagmi en `src/config/wagmi.ts`

```typescript
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { anvilChain } from "./chains";

// Creamos la configuración central de Wagmi
export const wagmiConfig = createConfig({
  chains: [anvilChain],
  connectors: [
    injected(), // Conector para billeteras de navegador (MetaMask, Rabby)
  ],
  transports: {
    [anvilChain.id]: http(), // Transporte RPC hacia Anvil
  },
});
```

### 👨‍💻 Live Coding: Envolviendo la App en `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./config/wagmi";
import App from "./App";
import "./index.css";

// Cliente de TanStack Query para gestionar caché y re-validaciones
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

### 🧠 Pregunta Pedagógica
- **Instructor**: *"¿Por qué necesitamos `QueryClientProvider`?"*
- **Explicación**: *"Porque la blockchain es un estado asíncrono externo. TanStack Query se encarga de guardar en caché las lecturas, invalidar el caché cuando emitimos un voto y evitar hacer llamadas RPC repetidas e innecesarias."*

---

## Bloque 2B: Live Coding — ConnectBar y `useAccount` (02:25 - 02:50)

### 🎙️ Guión del Instructor
> *"¿Recuerdan las 25 líneas que nos tomó en `src/index.ts` manejar `window.ethereum.request`, `accountsChanged` y el texto del botón? Miren cómo lo resolvemos en Wagmi con el hook `useAccount` y `useConnect`."*

### 👨‍💻 Live Coding: Creando `src/components/ConnectBar.tsx`

```tsx
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectBar() {
  // Wagmi maneja automáticamente si la billetera está conectada y quién es
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="connect-bar">
        <span>Conectado: <code>{address.slice(0, 6)}...{address.slice(-4)}</code></span>
        <button onClick={() => disconnect()}>Desconectar</button>
      </div>
    );
  }

  return (
    <div className="connect-bar">
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          Conectar {connector.name}
        </button>
      ))}
    </div>
  );
}
```

*Ventajas inmediatas que nota el estudiante*:
- Si cambias de cuenta en MetaMask, `address` se actualiza al instante.
- Si recargas la página (F5), la sesión persiste automáticamente sin código extra.

---

## Bloque 2C: Live Coding — Balance CGOV con `useReadContract` (02:50 - 03:20)

### 🎙️ Guión del Instructor
> *"Ahora entramos a la Mini-DAO. En nuestra DAO, los votos no valen 1 voto por persona; es una gobernanza ponderada por tokens. Si tienes 100 CGOV, tienes 100 votos.*
>
> *Vamos a crear un componente `TokenBalance.tsx` que consulte el balance del usuario contra `GovernanceToken.sol` usando `useReadContract`."*

### 👨‍💻 Live Coding: `src/components/TokenBalance.tsx`

```tsx
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS } from "../config/contracts";
import { governanceTokenAbi } from "../abis";

export function TokenBalance() {
  const { address, isConnected } = useAccount();

  // Hook declarativo de lectura
  const { data: rawBalance, isLoading } = useReadContract({
    address: CONTRACTS.GovernanceToken,
    abi: governanceTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && Boolean(address),
    },
  });

  const formattedBalance = rawBalance ? formatUnits(rawBalance, 18) : "0";

  return (
    <div className="balance-card">
      <h3>Tu Poder de Voto</h3>
      {isLoading ? (
        <p>Consultando saldo onchain...</p>
      ) : (
        <p className="balance-amount">{formattedBalance} <strong>CGOV</strong></p>
      )}
    </div>
  );
}
```

*Punto clave*: Si `address` cambia porque el alumno cambió de cuenta en MetaMask, Wagmi invalida la consulta anterior y consulta el balance de la nueva cuenta en segundo plano sin una sola línea de código manual.

---

## Bloque 2D: Live Coding — Listado y Votación con `useWriteContract` (03:20 - 03:45)

### 🎙️ Guión del Instructor
> *"Ahora construyamos el corazón de la dApp: `ProposalList.tsx`. Aquí interactuamos con `DaoGovernor.sol`.*
>
> *Veamos cómo Wagmi gestiona el ciclo de vida de la transacción con dos hooks sincronizados:*
> 1. *`useWriteContract`: Dispara la transacción en MetaMask y nos devuelve el hash.*
> 2. *`useWaitForTransactionReceipt`: Vigila el hash hasta que el bloque sea confirmado.*

### 👨‍💻 Live Coding: `src/components/ProposalList.tsx`

```tsx
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "../config/contracts";
import { daoGovernorAbi } from "../abis";

export function ProposalList() {
  // 1. Leer el contador de propuestas
  const { data: proposalCount } = useReadContract({
    address: CONTRACTS.DaoGovernor,
    abi: daoGovernorAbi,
    functionName: "proposalCount",
  });

  // 2. Hook para escribir el voto
  const { writeContract, data: txHash, isPending } = useWriteContract();

  // 3. Hook para vigilar la inclusión en el bloque
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  function submitVote(proposalId: bigint, support: boolean) {
    writeContract({
      address: CONTRACTS.DaoGovernor,
      abi: daoGovernorAbi,
      functionName: "vote",
      args: [proposalId, support],
    });
  }

  return (
    <div className="proposals-container">
      <h3>Propuestas Activas (Total: {proposalCount ? proposalCount.toString() : "0"})</h3>

      <div className="proposal-card">
        <h4>Propuesta #1: Financiamiento Hackathon CEDIA 2026</h4>
        
        {/* Feedback visual del estado de la transacción */}
        {isPending && <p className="banner-pending">Esperando confirmación en MetaMask...</p>}
        {isConfirming && <p className="banner-confirming">Transacción en mempool. Minando bloque...</p>}
        {isConfirmed && <p className="banner-success">¡Voto confirmado exitosamente onchain!</p>}

        <div className="action-buttons">
          <button 
            disabled={isPending || isConfirming} 
            onClick={() => submitVote(1n, true)}
          >
            Votar A Favor
          </button>
          <button 
            disabled={isPending || isConfirming} 
            onClick={() => submitVote(1n, false)}
          >
            Votar En Contra
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Bloque 2E: Feedback Visual, Retos Formativos y Cierre (03:45 - 04:00)

### 🎙️ Guión del Instructor
> *"Fíjense en la elegancia de lo que logramos:*
> - *Manejamos tres estados visuales que toda dApp profesional exige:*
>   1. *`isPending`: Modal de MetaMask abierto.*
>   2. *`isConfirming`: Hash emitido, esperando minado en bloque.*
>   3. *`isConfirmed`: Minado exitoso, UI re-validada.*
> *Para cerrar, repasemos la conexión con la tesorería (`CommunityTreasury`): cuando una propuesta alcanza el quórum y finaliza su plazo, cualquier miembro puede llamar a `execute(...)` en el gobernador, y la tesorería transferirá los fondos en ETH al beneficiario."*

### 👨‍💻 Live Coding: Ejecución sobre la Tesorería en `src/components/ProposalList.tsx`

```tsx
// Ejecución de propuesta aprobada (liberación de fondos en CommunityTreasury)
function executeProposal(proposalId: bigint) {
  writeContract({
    address: CONTRACTS.DaoGovernor,
    abi: daoGovernorAbi,
    functionName: "execute",
    args: [proposalId],
  });
}
```
*Explicación para la clase*:
- `DaoGovernor.execute` verifica que `block.timestamp > deadline` y que `votesFor > votesAgainst`.
- Luego realiza una llamada externa a `CommunityTreasury.release(recipient, amount)` transfiriendo el ETH de la tesorería comunitaria al beneficiario.
- Toda la transacción se inicia y rastrea desde el frontend mediante el mismo patrón `writeContract` + `useWaitForTransactionReceipt`.

### 🏋️ Retos Asíncronos para los Estudiantes (Inspirados en Cyfrin Updraft)

1. **Reto 1 (Frontend Básico — Viem Directo)**:
   - En `index.html`, agregar un campo de texto `<input id="proposalAddress">` para que el usuario pueda escribir dinámicamente cualquier dirección de contrato de votación desplegado en Anvil y consultar sus votos.

2. **Reto 2 (UX / UI Intermedio — React + Wagmi)**:
   - En `TokenBalance.tsx`, agregar un botón de *"Refresh Balance"* usando el método `refetch()` que retorna `useReadContract`.

3. **Reto 3 (Gobernanza Avanzada — React + Wagmi)**:
   - Crear un componente modal `CreateProposalModal.tsx` con un formulario para que los usuarios con más de 100 CGOV puedan invocar la función `propose(address recipient, uint256 amount, string memory description)` en `DaoGovernor`.

---

## 📋 Resumen Rápido de Comandos para la Clase

```bash
# 1. Iniciar el nodo local Anvil
anvil

# 2. Desplegar contratos (desde la raíz de dapp/)
pnpm deploy:vote    # Despliega SimpleProposalVote para la Parte 1
pnpm deploy:dao     # Despliega la Mini-DAO completa para la Parte 2

# 3. Iniciar el servidor web de desarrollo
pnpm dev

# Acceder a la dApp en desarrollo:
# http://localhost:5173/
```
