# Frontend WebApp — Mini-DAO Didáctica

Proyecto frontend del **Ethereum Developer Pack 2026** (CEDIA / Ecuador Web3).

Organizado según la estructura estándar de repositorios Web3 con **React 19**, **Viem**, **Wagmi v2** y **TanStack Query**.

## Estructura del Proyecto

```text
webapp/
├── public/                  # Recursos estáticos (favicon, iconos)
├── index.html               # Punto de entrada estándar de la dApp
├── src/
│   ├── components/          # Componentes de la interfaz
│   │   ├── ConnectBar.tsx   # Barra de conexión de billetera (Wagmi)
│   │   ├── SimpleVote.tsx   # Etapa 1: Votación Directa (Viem en React)
│   │   ├── TokenBalance.tsx # Balance de tokens CGOV
│   │   └── ProposalList.tsx # Listado de propuestas y votación DAO
│   ├── hooks/               # Hooks personalizados para Viem y Wagmi
│   │   ├── useSimpleVote.ts # Hook con Viem puro (readContract, writeContract, waitForTransactionReceipt)
│   │   └── useTokenBalance.ts # Hook para balance CGOV
│   ├── config/              # Configuración de Viem y Wagmi
│   │   ├── chains.ts        # Definición de red Anvil (chain 31337)
│   │   ├── viem.ts          # PublicClient de Viem
│   │   ├── wagmi.ts         # Wagmi config con conectores inyectados
│   │   ├── contracts.ts     # Direcciones y validaciones
│   │   └── index.ts         # Re-export de configuración
│   ├── abis/                # Archivos JSON de los ABIs de los contratos
│   │   ├── SimpleProposalVote.json
│   │   ├── GovernanceToken.json
│   │   ├── DaoGovernor.json
│   │   ├── CommunityTreasury.json
│   │   └── index.ts
│   ├── App.tsx              # Componente principal con selector de etapas
│   ├── main.tsx             # Montaje de React y providers
│   └── index.css            # Estilos globales
├── package.json
└── tsconfig.json
```

## Estructura del Taller (4 Horas / 240 Minutos)

1. **Parte 1: Horas 1 y 2 (00:00 - 02:00) — Fundamentos con HTML + TS + Viem (`index.html` y `src/index.ts`)**:
   - Live coding guiado paso a paso, inspirado en la *"Sección 1: HTML/JS - Buy Me A Coffee"* del Masterclass de Patrick Collins (Cyfrin Updraft).
   - Sin frameworks ni abstracciones: manipulando directamente el DOM con IDs nativos.
   - Demuestra la interacción directa con `SimpleProposalVote.sol`:
     - Inspección de `window.ethereum` (EIP-1193) y conexión de billetera con `walletClient.requestAddresses()`.
     - Lecturas públicas con `publicClient.readContract()` sin coste de gas (`eth_call`).
     - **Regla de oro de Patrick Collins**: Simulación previa con `publicClient.simulateContract()` para prevenir reverts y evitar gastar gas en vano.
     - Escritura con `walletClient.writeContract()` (`txHash` en mempool).
     - **Diferencia crítica**: El hash no es el recibo; espera explícita del bloque con `publicClient.waitForTransactionReceipt()`.
     - "The Pain Points": Las limitaciones y dolores de cabeza del código imperativo.

2. **Parte 2: Horas 3 y 4 (02:00 - 04:00) — Mini-DAO Modular con React 19 + Wagmi v2 (`/`)**:
   - Construcción paso a paso de los componentes declarativos y caché reactivo con TanStack Query.
   - Gobernanza completa multi-contrato: `GovernanceToken`, `DaoGovernor` y `CommunityTreasury`.
   - Hooks reactivos de Wagmi (`useAccount`, `useReadContract`, `useWriteContract`, `useWaitForTransactionReceipt`).
   - Feedback visual profesional: `isPending`, `isConfirming` e `isConfirmed`.
   - Accesible en desarrollo en: [http://localhost:5173/](http://localhost:5173/).

## Ejecución

Desde la raíz de `dapp/`:

```bash
# Iniciar frontend
pnpm dev
```

La aplicación correrá en [http://localhost:5173](http://localhost:5173).
