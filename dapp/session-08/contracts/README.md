# Contratos — Foundry (desde Sesión 7)

Proyecto Foundry sobre el mismo `src/` de las sesiones 3 y 5. Compilación, scripts de deploy y tests viven aquí.

## Estructura

```text
contracts/
  src/           # SimpleProposalVote, GovernanceToken, CommunityTreasury, DaoGovernor
  script/        # DeployDAO.s.sol
  test/          # pruebas (smoke en S7; suite completa en S10)
  lib/forge-std/ # dependencia Foundry
  foundry.toml
```

## Requisitos

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`)

## Comandos

```bash
cd dapp/session-08/contracts
forge build
forge test
```

### Deploy local con Anvil

```bash
# Terminal 1
anvil

# Terminal 2
cd dapp/session-08/contracts
forge script script/DeployDAO.s.sol:DeployDAO \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

La clave anterior es la cuenta #0 por defecto de Anvil (solo para demos locales).

El script imprime las direcciones de `GovernanceToken`, `CommunityTreasury` y `DaoGovernor`. Guárdalas para el frontend (sesión 8).

## Artefactos

Tras `forge build`, los ABI/bytecode quedan en `out/<Contract>.sol/<Contract>.json`.

## Remix (sesiones 3–5)

Sigue pudiendo abrir los `.sol` de `src/` en Remix. Foundry no es obligatorio para esas demos en clase.
