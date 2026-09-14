# Frontend Web — Sesión 8

Interfaz Vite + React + Wagmi/Viem para conectar billetera, ver balance CGOV y votar propuestas en Anvil.

## Requisitos

1. Contratos desplegados (sesión 7): `anvil` + `forge script … --broadcast`
2. Node 20+ y pnpm

## Setup

```bash
cd dapp
pnpm install
cp apps/web/.env.example apps/web/.env
# Pega las direcciones impresas por DeployDAO
pnpm --filter @mini-dao/web dev
```

Tras recompilar contratos:

```bash
cd dapp/contracts && forge build
cd .. && pnpm sync-abis
```

## Qué practicar

- Ciclo de vida de transacciones: pending → confirmación → error
- Lecturas reactivas (`useReadContract`) vs escrituras (`useWriteContract`)
- Detección de red (Anvil chain id `31337`)
