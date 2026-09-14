# Sesión 8 — Frontend Web3

Esta carpeta contiene **solo** el código del hito de la sesión 8: contratos Foundry + `apps/web` (Vite, React, Wagmi, Viem).

## Setup

```bash
git checkout session-08
cd .. && pnpm install
cp apps/web/.env.example apps/web/.env   # pegar direcciones del deploy
pnpm --filter @mini-dao/web dev
```

Detalle: [`apps/web/README.md`](./apps/web/README.md) y [`contracts/README.md`](./contracts/README.md).
