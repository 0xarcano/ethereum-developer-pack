# Mini-DAO Didáctica — Estructura Estándar de Repositorio

Proyecto práctico del **Ethereum Developer Pack 2026** (CEDIA / Ecuador Web3). La dApp evoluciona por sesiones desde un contrato monolítico en Remix hasta una arquitectura modular con Foundry, frontend y pruebas completas.

## Cómo recuperar un hito

El desarrollo ocurre en el branch `develop`. Cada sesión práctica queda congelada en un **tag** de Git:

| Tag | Sesión | Contenido |
| --- | --- | --- |
| `dapp/session-03` | S3 | Contrato monolítico de votación (Remix) |
| `dapp/session-05` | S5 | Token + Tesorería + Governor (Remix modular) |
| `dapp/session-07` | S7 | Migración a Foundry + script de deploy |
| `dapp/session-08` | S8 | Frontend Web3: Interacción directa con Viem y EIP-1193 |
| `dapp/session-09` | S9 | Indexer Node.js de eventos |
| `dapp/session-10` | S10 | Suite de tests Foundry (versión completa) |

```bash
git fetch --tags
git checkout dapp/session-08   # estado al cerrar la sesión 8
```

## Estructura Estándar del Repositorio

```text
dapp/
├── .gitignore
├── README.md
├── package.json                 # Configuración de workspaces (pnpm)
├── foundry.toml                 # Configuración global de Foundry
├── packages/
│   ├── contracts/               # Proyecto de Foundry
│   │   ├── lib/                 # Dependencias de Solidity (forge-std)
│   │   ├── src/                 # Contratos inteligentes (.sol)
│   │   │   ├── SimpleProposalVote.sol  # Contrato didáctico monolítico (S3 / S8)
│   │   │   ├── GovernanceToken.sol     # Token ERC-20 de gobernanza
│   │   │   ├── CommunityTreasury.sol   # Bóveda de fondos ETH
│   │   │   └── DaoGovernor.sol         # Gobernador con votación ponderada
│   │   ├── test/                # Pruebas en Solidity
│   │   │   └── DeploySmoke.t.sol       # Tests de despliegue y cableado
│   │   ├── script/              # Scripts de despliegue (Solidity)
│   │   │   ├── DeploySimpleVote.s.sol  # Deploy para Sesión 8 en Anvil
│   │   │   └── DeployDAO.s.sol         # Deploy de la Mini-DAO completa
│   │   └── foundry.toml         # Configuración específica de Foundry
│   │
│   └── webapp/                  # Proyecto Frontend (TypeScript + Viem + React)
│       ├── public/              # Recursos estáticos
│       ├── src/
│       │   ├── components/      # Componentes de interfaz (SimpleVote, ConnectBar)
│       │   ├── hooks/           # Hook useSimpleVote (Viem puro)
│       │   ├── config/          # Configuración de Viem (clientes, cadenas, contratos)
│       │   └── abis/            # Archivos JSON de los ABIs sincronizados
│       ├── package.json
│       └── tsconfig.json
├── scripts/                     # Utilidades (sync-abis.mjs)
└── SESSION-08-SCRIPT.md         # Guión pedagógico de clase para Sesión 8 (Metodología Masterclass)
```

## Convenciones

- Material didáctico y guiones en **español**; código, contratos, comentarios y commits en **inglés**.
- Onchain: reglas, tokens, votos y tesorería en `packages/contracts/`.
- Offchain: UI y hooks en `packages/webapp/`.
- Cadena de práctica principal: **Anvil** local (`http://127.0.0.1:8545`, chain id `31337`).

## Comandos Rápidos

```bash
# 1. Iniciar blockchain local Anvil
anvil

# 2. Desplegar contratos (desde la raíz de dapp/)
pnpm deploy:vote   # Despliega SimpleProposalVote
pnpm deploy:dao    # Despliega la Mini-DAO completa

# 3. Correr la suite de pruebas de Foundry
pnpm test:contracts
# o directamente: forge test

# 4. Iniciar la aplicación web
pnpm dev           # http://localhost:5173
```
