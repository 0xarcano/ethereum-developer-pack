# Mini-DAO Didáctica — Gobernanza y Tesorería

Proyecto práctico del **Ethereum Developer Pack 2026** (CEDIA / Ecuador Web3). Cada sesión del curso tiene **su propia carpeta** con el código que corresponde a ese punto del temario.

## Carpetas por sesión

| Carpeta | Sesión | Contenido | Branch |
| --- | --- | --- | --- |
| [`session-03/`](./session-03/) | S3 | Contrato monolítico de votación (Remix) | `session-03` |
| [`session-05/`](./session-05/) | S5 | Token + Tesorería + Governor | `session-05` |
| [`session-07/`](./session-07/) | S7 | Foundry + script de deploy | `session-07` |
| [`session-08/`](./session-08/) | S8 | Frontend Vite + Wagmi + Viem | `session-08` |
| [`session-09/`](./session-09/) | S9 | Indexer Node.js de eventos | `session-09` |
| [`session-10/`](./session-10/) | S10 | Suite de tests Foundry (versión completa) | `session-10` |

En el branch `develop` están **todas** las carpetas. Cada branch `session-XX` contiene **solo** la carpeta de esa sesión.

```bash
git fetch origin
git checkout session-05          # solo el código de la sesión 5
cd dapp/session-05
```

Tags y Releases (con código adjunto):

| Tag | Release |
| --- | --- |
| `dapp/session-03` | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-03) |
| `dapp/session-05` | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-05) |
| `dapp/session-07` | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-07) |
| `dapp/session-08` | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-08) |
| `dapp/session-09` | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-09) |
| `dapp/session-10` | [release](https://github.com/0xarcano/ethereum-developer-pack/releases/tag/dapp/session-10) |

## Convenciones

- Material didáctico en **español**; código, comentarios de código y commits en **inglés**.
- Onchain: reglas, tokens, votos y tesorería. Offchain: UI e indexación.
- Cadena de práctica principal: **Anvil** (local).
