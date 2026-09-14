# Mini-DAO Didáctica — Gobernanza y Tesorería

Proyecto práctico del **Ethereum Developer Pack 2026** (CEDIA / Ecuador Web3). La dApp evoluciona por sesiones desde un contrato monolítico en Remix hasta una arquitectura modular con Foundry, frontend, indexer y tests.

## Cómo recuperar un hito

El desarrollo ocurre en el branch `develop` (versión completa). Cada sesión práctica queda congelada en un **branch** `session-XX` y un **tag** `dapp/session-XX` con la misma estructura de carpetas estándar (no hay una carpeta por sesión).

| Branch / Tag | Sesión | Contenido |
| --- | --- | --- |
| `session-03` / `dapp/session-03` | S3 | Contrato monolítico de votación (Remix) |
| `session-05` / `dapp/session-05` | S5 | Token + Tesorería + Governor (Remix modular) |
| `session-07` / `dapp/session-07` | S7 | Migración a Foundry + script de deploy |
| `session-08` / `dapp/session-08` | S8 | Frontend Vite + Wagmi + Viem |
| `session-09` / `dapp/session-09` | S9 | Indexer Node.js de eventos |
| `session-10` / `dapp/session-10` | S10 | Suite de tests Foundry (versión completa) |

```bash
git checkout session-05          # estado al cerrar la sesión 5
# o bien:
git checkout dapp/session-05     # mismo snapshot vía tag
```

## Estructura del monorepo

En todos los branches/tags el código vive en las mismas rutas estándar:

```text
dapp/
  contracts/       # Solidity (Remix al inicio; Foundry desde S7)
    src/           # contratos
    script/        # desde S7
    test/          # desde S7 (suite completa en S10)
  apps/
    web/           # Vite + React + Wagmi (desde S8)
    indexer/       # Listener de eventos (desde S9)
  scripts/         # utilidades (sync-abis)
```

## Convenciones

- Material didáctico en **español**; código, comentarios de código y commits en **inglés**.
- Onchain: reglas, tokens, votos y tesorería. Offchain: UI e indexación.
- Cadena de práctica principal: **Anvil** (local). Sepolia es opcional en las guías de cada sesión.

## Estado actual

**Sesión 10** — suite de tests Foundry en [`contracts/test/`](./contracts/test/). Versión completa del ciclo didáctico.

