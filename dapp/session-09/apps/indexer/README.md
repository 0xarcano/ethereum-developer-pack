# Indexer — Sesión 9

Servicio Node.js + Viem que escucha `ProposalCreated` y `VoteCast` del `DaoGovernor` y guarda un historial local en JSON.

## On-chain vs off-chain

| On-chain | Off-chain (este indexer) |
| --- | --- |
| Reglas de voto, tokens, tesorería, resultados | Historial consultable sin re-escanear la cadena |
| Fuente de verdad | Caché / UX / notificaciones |

## Setup

```bash
# Anvil + contratos desplegados (S7)
cd dapp
pnpm install
export GOVERNOR_ADDRESS=0x...   # dirección de DaoGovernor
export RPC_URL=http://127.0.0.1:8545
pnpm --filter @mini-dao/indexer start
```

Los eventos se acumulan en `apps/indexer/data/events.json` (gitignored).

## Práctica en clase

1. Arranca Anvil y despliega la DAO.
2. Arranca el indexer.
3. Crea una propuesta y emite votos (cast, Remix o el frontend).
4. Observa logs en consola y el archivo JSON.
