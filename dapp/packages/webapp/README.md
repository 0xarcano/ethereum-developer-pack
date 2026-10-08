# Frontend WebApp — Votación Onchain con Viem

Proyecto frontend del **Ethereum Developer Pack 2026** (CEDIA / Ecuador Web3).

Desarrollado con **TypeScript**, **Viem** y **React** enfocado en interacción directa contra contratos EVM sin capas intermedias complejas.

## Estructura del Proyecto

```text
webapp/
├── public/                  # Recursos estáticos
├── index.html               # Punto de entrada estándar
├── src/
│   ├── components/          # Componentes de interfaz
│   │   ├── ConnectBar.tsx   # Barra de conexión con proveedor EIP-1193
│   │   └── SimpleVote.tsx   # Panel de votación directa onchain
│   ├── hooks/               # Hooks de integración Web3
│   │   └── useSimpleVote.ts # Hook con Viem puro (readContract, simulateContract, writeContract, waitForTransactionReceipt)
│   ├── config/              # Configuración de red y clientes
│   │   ├── chains.ts        # Definición de red Anvil (chain 31337)
│   │   ├── viem.ts          # PublicClient de Viem
│   │   ├── contracts.ts     # Direcciones de contratos
│   │   └── index.ts         # Re-export de configuración
│   ├── abis/                # Archivos JSON de ABIs
│   │   ├── SimpleProposalVote.json
│   │   └── index.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Montaje de React
│   └── index.css            # Estilos globales
├── package.json
└── tsconfig.json
```

## Estructura del Taller (4 Horas / 240 Minutos)

El taller sigue la metodología práctica del *Web3 Full-Stack Development Masterclass* de Cyfrin Updraft / Patrick Collins:

1. **Bloque 1: Modelo Mental Web3 vs Web2**: Llamadas JSON-RPC a nodos EVM sin servidores ni bases de datos tradicionales.
2. **Bloque 2: Estándar EIP-1193 (`window.ethereum`)**: Detección de billeteras (MetaMask, Rabby), permisos de cuentas con `eth_requestAccounts`.
3. **Bloque 3: `PublicClient` de Viem**: Lecturas paralelas sin gas con `readContract` y resolución de ABIs.
4. **Bloque 4: `WalletClient` y Simulación Preventiva**: Aplicación estricta de la Regla de Oro (`simulateContract`) para garantizar que la transacción no revertirá antes de solicitar la firma.
5. **Bloque 5: Mempool vs Recibo**: Demostración de por qué el hash de transacción no es un recibo y sincronización con `waitForTransactionReceipt`.
6. **Bloque 6: Eventos Onchain en Vivo**: Suscripción reactiva a logs de eventos con `watchContractEvent`.
7. **Bloque 7: Edge Cases y Resiliencia**: Manejo de cambios de red, desconexiones y reversiones controladas.

## Comandos de Ejecución

Desde la raíz del repositorio:

```bash
# 1. Iniciar blockchain local Anvil
anvil

# 2. Desplegar contrato didáctico
cd dapp
pnpm deploy:vote

# 3. Iniciar el servidor web de desarrollo
pnpm dev
```

La aplicación se servirá en [http://localhost:5173](http://localhost:5173).
