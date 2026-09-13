# Mini-DAO Didáctica — Gobernanza y Tesorería

Proyecto práctico del **Ethereum Developer Pack 2026** (CEDIA / Ecuador Web3). La dApp evoluciona por sesiones desde un contrato monolítico en Remix hasta una arquitectura modular con Foundry, frontend, indexer y tests.

## Cómo recuperar un hito

El desarrollo ocurre en el branch `develop`. Cada sesión práctica queda congelada en un **tag** de Git:

| Tag | Sesión | Contenido |
| --- | --- | --- |
| `dapp/session-03` | S3 | Contrato monolítico de votación (Remix) |
| `dapp/session-05` | S5 | Token + Tesorería + Governor (Remix modular) |
| `dapp/session-07` | S7 | Migración a Foundry + script de deploy |
| `dapp/session-08` | S8 | Frontend Vite + Wagmi + Viem |
| `dapp/session-09` | S9 | Indexer Node.js de eventos |
| `dapp/session-10` | S10 | Suite de tests Foundry (versión completa) |

```bash
git fetch --tags
git checkout dapp/session-05   # ejemplo: estado al cerrar la sesión 5
```

## Estructura del monorepo

```text
dapp/
  labs/           # Solidity plano para Remix (S3–S5)
  contracts/      # Proyecto Foundry (desde S7)
  frontend/       # Vite + React + Wagmi (desde S8)
  indexer/        # Listener de eventos (desde S9)
```

## Convenciones

- Material didáctico en **español**; código, comentarios de código y commits en **inglés**.
- Onchain: reglas, tokens, votos y tesorería. Offchain: UI, metadatos e indexación.
- Cadena de práctica principal: **Anvil** (local). Sepolia es opcional en las guías de cada sesión.

## Estado actual

**Sesión 5** — sistema modular Remix en [`labs/session-05/`](./labs/session-05/).
