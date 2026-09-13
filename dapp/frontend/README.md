# Frontend Mini-DAO (Sesión 8)

Interfaz React + Vite + Wagmi + Viem para conectar billetera, ver balance `CGOV` y votar propuestas onchain.

## Requisitos

1. Contratos desplegados en Anvil (`forge script ... DeployDAO`).
2. MetaMask (u otra injected wallet) con red Anvil (`chainId` 31337, RPC `http://127.0.0.1:8545`).
3. Node 20+ y pnpm.

## Configuración

```bash
cd dapp
pnpm install
cp frontend/.env.example frontend/.env
# Completa las tres direcciones impresas por DeployDAO
```

Sincronizar ABIs tras cambiar Solidity:

```bash
cd contracts && forge build
pnpm --filter @mini-dao/frontend sync:abis
```

## Desarrollo

```bash
pnpm --filter @mini-dao/frontend dev
```

## Flujo UX didáctico

1. **Connect Wallet** → si la red no es Anvil → **Switch to Anvil**.
2. Lectura reactiva del balance con `useReadContract`.
3. Listado de propuestas (`proposalCount` + `proposals(id)`).
4. Botones **Yes** / **No** con estado pendiente propio hasta confirmación (`useWriteContract` + `useWaitForTransactionReceipt`).
