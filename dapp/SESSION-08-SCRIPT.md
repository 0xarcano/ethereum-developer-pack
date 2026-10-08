# Guión Didáctico de Clase: Sesión 8 — Frontend Web3 (Taller de Live Coding)

> **Curso**: Blockchain: Ethereum Developer Pack 2026 (Nivel Intermedio - Avanzado)  
> **Institución**: CEDIA (Corporación Ecuatoriana para el Desarrollo de la Investigación y la Academia) & Ecuador Web3  
> **Instructor**: Paul Rodas ([@0xarcano](https://github.com/0xarcano))  
> **Tema**: Frontend Web3 — Interacción Directa con Smart Contracts (TypeScript + Viem + EIP-1193)  
> **Duración Total**: 4 horas (240 min)  
> **Metodología**: Live Coding guiado e interactivo basado en el *Web3 Full-Stack Development Masterclass* (Cyfrin Updraft / Patrick Collins)  
> **Enfoque**: 100% Desarrollo Frontend (Sin pruebas de smart contracts, reservadas para la sesión de QA)

---

## 🎯 Objetivos Pedagógicos

Al finalizar este taller intensivo de 4 horas, el estudiante será capaz de:
1. **Comprender la arquitectura mental de un frontend descentralizado**: Entender cómo un navegador web se comunica con una blockchain mediante llamadas JSON-RPC sin servidores de backend tradicionales ni bases de datos centralizadas.
2. **Construir una dApp desde cero con HTML + TypeScript + Viem**: Escribir línea por línea una interfaz funcional de votación directa contra `SimpleProposalVote.sol`.
3. **Manejar el estándar EIP-1193 (`window.ethereum`)**: Detectar proveedores inyectados en el navegador (MetaMask, Rabby), gestionar permisos de cuentas y responder dinámicamente a eventos de desconexión y cambio de red.
4. **Dominar los clientes de Viem**: Saber con precisión cuándo usar `PublicClient` (consultas públicas gratuitas vía `eth_call`) y `WalletClient` (transacciones firmadas con gas vía `eth_sendTransaction`).
5. **Aplicar la regla de oro de Patrick Collins**: Simular previamente cualquier transacción con `simulateContract` antes de solicitar la firma al usuario en MetaMask para evitar transacciones fallidas y quema innecesaria de gas.
6. **Comprender por qué "Un Transaction Hash NO es un Recibo"**: Identificar el estado de una transacción en la mempool frente a su inclusión definitiva en un bloque con `waitForTransactionReceipt`.
7. **Escuchar eventos onchain en tiempo real**: Suscribirse a eventos `VoteCast` emitidos por el contrato para actualizar automáticamente el estado del frontend.
8. **Decodificar errores de reversión y diagnóstico de gas**: Atrapar errores personalizados de Solidity (`require`, `revert`) y presentar mensajes claros y accionables al usuario.

---

## ⏱️ Cronograma de la Sesión (4 Horas / 240 Minutos)

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      TALLER LIVE CODING: VIEM & WEB3 FRONTEND                    │
│             De Cero a dApp Completa con HTML + TypeScript + Viem Puro           │
├─────────────────┬───────────────┬───────────────────────────────────────────────┤
│ Bloque 1        │ 00:00 - 00:30 │ Introducción, Modelo Mental Web2 vs Web3       │
│ Bloque 2        │ 00:30 - 01:05 │ Setup de Proyecto y EIP-1193 (window.ethereum)│
│ Bloque 3        │ 01:05 - 01:45 │ PublicClient: Lecturas Onchain y ABI Parsing   │
├─────────────────┴───────────────┴───────────────────────────────────────────────┤
│                   ☕ RECESO DIDÁCTICO & PREGUNTAS (15 MIN)                       │
├─────────────────┬───────────────┬───────────────────────────────────────────────┤
│ Bloque 4        │ 02:00 - 02:40 │ WalletClient, Firma y Simulación Preventiva   │
│ Bloque 5        │ 02:40 - 03:15 │ Mempool, Recibos de Bloque y Ciclo de Vida Tx │
│ Bloque 6        │ 03:15 - 03:45 │ Eventos Onchain en Vivo (watchContractEvent)   │
│ Bloque 7        │ 03:45 - 04:00 │ Manejo de Edge Cases, Retos Prácticos y Cierre│
└─────────────────┴───────────────┴───────────────────────────────────────────────┘
```

---

# BLOQUE 1: Introducción, Setup y el Modelo Mental Web3 (00:00 - 00:30)

### 🎙️ Guión del Instructor (Talk Track)
> *"¡Bienvenidos a la Sesión 8! Hoy es el día en que nuestros contratos inteligentes cobran vida para los usuarios comunes.*
>
> *Hasta la sesión anterior vivimos escribiendo Solidity y ejecutando scripts en la terminal. Pero ningún usuario final va a abrir una terminal y ejecutar comandos de Foundry para interactuar con una aplicación. Quieren una interfaz web rápida, amigable y confiable.*
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
> *Siguiendo el método de Patrick Collins en el Masterclass de Cyfrin Updraft, no vamos a empezar arrojando capas complejas de abstracción que escondan cómo funciona la red. Vamos a ver exactamente cómo viaja cada paquete JSON-RPC desde el navegador hasta el nodo EVM."*

### 💻 Prerrequisito en Terminal
Asegurarse de tener Anvil corriendo en segundo plano:
```bash
# Terminal 1: Iniciar nodo local Anvil
anvil
```
*(Anvil queda corriendo en `http://127.0.0.1:8545` con Chain ID `31337`).*

En otra terminal, desplegamos el contrato de votación didáctica:
```bash
# Terminal 2: Desplegar SimpleProposalVote
cd dapp
pnpm deploy:vote
```

---

# BLOQUE 2: Setup y el Estándar EIP-1193 (`window.ethereum`) (00:30 - 01:05)

### 👨‍💻 Acción del Instructor en Pantalla
> *"Abran su editor en `dapp/packages/webapp/`. Miren la estructura de nuestro `index.html`:"*

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Votación Onchain (Viem Puro)</title>
  </head>
  <body>
    <h1>Votación de Gobernanza (Viem Puro)</h1>
    
    <!-- Botón de Conexión de Billetera -->
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
> *¿Qué ven? Ven un objeto JavaScript con métodos como `request`, `on`, `removeListener`.*
>
> *¿De dónde salió ese objeto? No lo pusimos en el HTML. Lo inyectó la extensión de MetaMask o Rabby en el navegador. Este objeto representa la especificación **EIP-1193** (Ethereum Provider JavaScript API).*
>
> *Ahora vamos a implementar la conexión de billetera en TypeScript."*

### 👨‍💻 Live Coding: Detectar y Conectar Billetera

```typescript
// 1. Obtener elementos del DOM
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const accountDisplay = document.getElementById("accountDisplay") as HTMLParagraphElement;

let currentAccount: string | null = null;

// 2. Función de conexión según EIP-1193
async function connect(): Promise<void> {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask no detectado. ¡Por favor instala una billetera Web3!");
    return;
  }

  try {
    // Solicitamos acceso a las cuentas mediante eth_requestAccounts
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

connectButton.onclick = connect;
```

### 🧠 Pregunta Interactiva a la Clase
- **Instructor**: *"Hagan clic en el botón. MetaMask abre su ventana emergente pidiendo conectar la cuenta. ¿Esta acción nos cobró gas en la red?"*
- **Respuesta esperada**: *"No, fue completamente gratis."*
- **Instructor**: *"¡Exacto! ¿Por qué? Porque conectar la billetera NO es una transacción en la blockchain. Es simplemente un permiso que el usuario le otorga a la página web para leer su dirección pública (su cuenta `0x...`)."*

---

# BLOQUE 3: Viem en Profundidad — `PublicClient` y Lectura Onchain (01:05 - 01:45)

### 🎙️ Guión del Instructor
> *"Hasta ahora usamos `window.ethereum.request` en crudo. Funciona, pero manipular llamadas RPC y datos hexadecimales manualmente es propenso a errores. Aquí es donde entra **Viem**.*
>
> *Viem es la librería TypeScript estándar moderna del ecosistema Ethereum: es modular, ultraligera, con tipado estricto de ABIs y de altísimo rendimiento.*
>
> *Viem define una separación fundamental de responsabilidades:*
> 1. *`PublicClient`: El telescopio hacia el nodo. Solo realiza llamadas de lectura (`eth_call`). No posee claves privadas ni gasta gas.*
> 2. *`WalletClient`: El puente hacia la billetera del usuario. Firma transacciones y mensajes con gas (`eth_sendTransaction`).*
>
> *Vamos a crear un `PublicClient` y leer los datos de `SimpleProposalVote.sol`."*

### 👨‍💻 Live Coding: Lecturas Públicas sin Gas con Viem

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

// 2. Elementos del DOM para mostrar resultados
const proposalText = document.getElementById("proposalText") as HTMLSpanElement;
const votesFor = document.getElementById("votesFor") as HTMLSpanElement;
const votesAgainst = document.getElementById("votesAgainst") as HTMLSpanElement;
const isApproved = document.getElementById("isApproved") as HTMLSpanElement;

// 3. Función de lectura paralela con Promise.all
async function readProposal(): Promise<void> {
  console.log("Leyendo contrato en:", CONTRACTS.SimpleProposalVote);

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

  // Actualizar la interfaz
  proposalText.textContent = String(prop);
  votesFor.textContent = String(vFor);
  votesAgainst.textContent = String(vAgainst);
  isApproved.textContent = approved ? "SÍ" : "NO";
}
```

### 🔍 Concepto Clave: ¿Qué es el ABI?
> *"Miren el parámetro `abi: simpleProposalVoteAbi`. ¿Qué pasaría si no lo pasamos? Viem daría error de compilación.  
> La EVM no almacena los nombres de las funciones en texto claro; solo ejecuta bytecode. El **ABI (Application Binary Interface)** es el diccionario que le dice a Viem cómo codificar el nombre `votesFor` en el selector hexadecimal de 4 bytes (`0x...`) y cómo decodificar el número `uint256` que devuelve el nodo."*

---

# RECESO DIDÁCTICO & PREGUNTAS (01:45 - 02:00)

---

# BLOQUE 4: `WalletClient`, Cuentas y la Regla de Oro de Simulación (02:00 - 02:40)

### 🎙️ Guión del Instructor
> *"Ahora llegamos al paso decisivo: **escribir en la blockchain**. Modificar el estado persistente.*
>
> *Para emitir un voto no podemos usar `PublicClient`, porque `PublicClient` no puede firmar transacciones. Necesitamos un `WalletClient` que envuelva el proveedor de `window.ethereum`.*
>
> *Pero antes de disparar la transacción, presten atención a la **Regla de Oro de Patrick Collins en el Masterclass**:  
> **'NUNCA envíes una transacción sin simularla primero'**.*
>
> *¿Por qué? Porque si un usuario intenta votar dos veces, el contrato ejecutará `require(!hasVoted[msg.sender], 'Already voted')`. Si no simulamos, MetaMask se abrirá, el usuario firmará, pagará gas, y la transacción revertirá en la red tras ser minada en un bloque fallido. El usuario habrá quemado dinero en comisiones por un error evitable.*
>
> *Con `publicClient.simulateContract()`, el nodo ejecuta la función en memoria localmente. Si va a revertir, nos avisa al instante en JavaScript **sin gastar un solo centavo de gas**."*

### 👨‍💻 Live Coding: Creando `WalletClient` y Simulación Preventiva

```typescript
import { createWalletClient, custom } from "viem";

// 1. Crear el WalletClient usando el proveedor inyectado
const walletClient = createWalletClient({
  chain: anvilChain,
  transport: custom(window.ethereum),
});

const txStatus = document.getElementById("txStatus") as HTMLParagraphElement;

async function castVote(support: boolean): Promise<void> {
  if (!currentAccount) {
    alert("¡Primero conecta tu billetera!");
    return;
  }

  txStatus.textContent = "1. Simulando transacción...";

  try {
    // PASO 1: Simulación preventiva (Patrick Collins' Rule)
    const { request } = await publicClient.simulateContract({
      address: CONTRACTS.SimpleProposalVote,
      abi: simpleProposalVoteAbi,
      functionName: "vote",
      args: [support],
      account: currentAccount as `0x${string}`,
    });
    console.log("Simulación exitosa, no revertirá.");

    // PASO 2: Enviar transacción firmada a la red
    txStatus.textContent = "2. Por favor confirma la firma en tu billetera...";
    const txHash = await walletClient.writeContract(request);
    console.log("Hash de transacción transmitido:", txHash);

    txStatus.textContent = `3. Transacción en mempool. Hash: ${txHash.slice(0, 10)}... Esperando bloque...`;
```

---

# BLOQUE 5: Mempool vs Inclusión en Bloque — "Un Hash NO es un Recibo" (02:40 - 03:15)

### 🎙️ Guión del Instructor
> *"Fíjense bien en esta distinción crítica:*
> - *`walletClient.writeContract()` retorna el **Transaction Hash**.*
> - *Muchos programadores cometen el grave error de asumir que cuando tienen el hash, el estado en la blockchain ya cambió. **¡Falso!** El hash solo significa que el nodo aceptó la transacción en su mempool (sala de espera).*
> - *Para asegurarnos de que el voto fue registrado de forma inmutable, debemos llamar a `waitForTransactionReceipt({ hash })` y esperar a que los validadores incluyan la transacción en un bloque minado."*

### 👨‍💻 Live Coding: Espera del Recibo de Transacción

```typescript
    // PASO 3: Esperar que el bloque sea minado con el recibo de la transacción
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log("Recibo confirmado en el bloque:", receipt.blockNumber);

    txStatus.textContent = `¡Voto confirmado en el bloque #${receipt.blockNumber}!`;

    // PASO 4: Refrescar la interfaz con el nuevo estado onchain
    await readProposal();
  } catch (error: any) {
    console.error("Fallo al votar:", error);
    txStatus.textContent = `Error: ${error?.shortMessage || error.message}`;
  }
}
```

---

# BLOQUE 6: Eventos Onchain en Vivo (`watchContractEvent`) (03:15 - 03:45)

### 🎙️ Guión del Instructor
> *"En una aplicación real, muchas personas pueden estar votando al mismo tiempo desde distintas partes del mundo. No podemos obligar al usuario a hacer clic en 'Refrescar' cada 5 segundos.*
>
> *Solidity emite eventos indexados: `emit VoteCast(msg.sender, support)`.*
>
> *Viem nos ofrece la función `watchContractEvent`, que establece una suscripción reactiva a los logs del nodo. En cuanto un nuevo bloque contiene un evento de nuestro contrato, Viem ejecuta nuestro callback y actualiza la pantalla automáticamente."*

### 👨‍💻 Live Coding: Escucha de Eventos en Tiempo Real

```typescript
// Suscripción reactiva a eventos VoteCast
const unwatch = publicClient.watchContractEvent({
  address: CONTRACTS.SimpleProposalVote,
  abi: simpleProposalVoteAbi,
  eventName: "VoteCast",
  onLogs: (logs) => {
    for (const log of logs) {
      console.log("¡Nuevo voto detectado en la red!", log);
    }
    // Refrescar automáticamente el contador de votos
    void readProposal();
  },
});
```

---

# BLOQUE 7: Manejo de Edge Cases, Retos Prácticos y Cierre (03:45 - 04:00)

### 🎙️ Guión del Instructor
> *"Para tener un frontend de calidad de producción, debemos prepararnos para los edge cases que ocurren cuando los usuarios interactúan con billeteras:*
> 1. *El usuario cambia de cuenta en MetaMask (`accountsChanged`).*
> 2. *El usuario cambia de red a una no soportada (`chainChanged`).*
> 3. *El usuario rechaza la firma en el popup.*
> 4. *El contrato revierte porque la cuenta ya había votado previamente.*
>
> *Miren cómo escuchamos estos eventos nativos de EIP-1193:"*

```typescript
// Detectar cambio de cuentas
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

// Detectar cambio de red
window.ethereum.on("chainChanged", () => {
  window.location.reload();
});
```

### 🏋️ Retos Asíncronos para los Estudiantes

1. **Reto 1 (Lectura Dinámica)**:
   - Agregar un campo de texto `<input id="proposalAddress">` para que el usuario pueda ingresar la dirección de cualquier contrato `SimpleProposalVote` desplegado en Anvil y consultar sus resultados.
2. **Reto 2 (Estimación de Gas)**:
   - Antes de votar, invocar `publicClient.estimateContractGas(...)` y mostrar en pantalla los gas units estimados requeridos para la transacción.
3. **Reto 3 (Historial de Votantes)**:
   - Usar `publicClient.getContractEvents(...)` para consultar todos los eventos `VoteCast` históricos desde el bloque 0 y renderizar una lista con las direcciones de todos los votantes y su sentido de voto.

---

## 📋 Resumen de Comandos de la Sesión

```bash
# 1. Iniciar la blockchain local Anvil
anvil

# 2. Desplegar contrato didáctico SimpleProposalVote
pnpm deploy:vote

# 3. Iniciar el servidor web de desarrollo
pnpm dev

# Acceso en el navegador:
# http://localhost:5173/
```
