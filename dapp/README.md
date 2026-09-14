# Mini-DAO Didáctica — Gobernanza y Tesorería

Proyecto práctico del **Ethereum Developer Pack 2026** (CEDIA / Ecuador Web3). La dApp evoluciona por sesiones desde un contrato monolítico en Remix hasta una arquitectura modular con Foundry, frontend, indexer y tests.

## Cómo recuperar un hito

El desarrollo ocurre en el branch `develop`. Cada sesión práctica queda congelada en un **tag** de Git y publicada como **Release** (con el código fuente adjunto, no solo el zip).

| Tag | Sesión | Ver código | Release |
| --- | --- | --- | --- |
| `dapp/session-03` | S3 | [árbol](https://github.com/0xarcano/ethereum-developer-pack/tree/dapp/session-03/dapp) | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-03) |
| `dapp/session-05` | S5 | [árbol](https://github.com/0xarcano/ethereum-developer-pack/tree/dapp/session-05/dapp) | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-05) |
| `dapp/session-07` | S7 | [árbol](https://github.com/0xarcano/ethereum-developer-pack/tree/dapp/session-07/dapp) | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-07) |
| `dapp/session-08` | S8 | [árbol](https://github.com/0xarcano/ethereum-developer-pack/tree/dapp/session-08/dapp) | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-08) |
| `dapp/session-09` | S9 | [árbol](https://github.com/0xarcano/ethereum-developer-pack/tree/dapp/session-09/dapp) | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-09) |
| `dapp/session-10` | S10 | [árbol](https://github.com/0xarcano/ethereum-developer-pack/tree/dapp/session-10/dapp) | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-10) |

En cada Release puedes:
- **Navegar el código** con el enlace al árbol del tag (archivos `.sol`, frontend, etc. en el repo).
- **Descargar archivos sueltos** (`.sol`, `.tsx`, guías) desde Assets, además del zip/tar automático de GitHub.

```bash
git fetch --tags
git checkout dapp/session-05   # ejemplo: estado al cerrar la sesión 5
```

## Estructura del monorepo

```text
dapp/
  contracts/       # Solidity (Remix al inicio; Foundry desde S7)
    src/
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

