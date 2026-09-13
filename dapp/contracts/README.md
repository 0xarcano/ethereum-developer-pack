# Contratos Foundry — Mini-DAO

Migración profesional de los contratos de las sesiones 3–5 a Foundry.

## Requisitos

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`)
- Submódulos del repo: `git submodule update --init --recursive`

## Comandos

```bash
cd dapp/contracts
forge build
forge test
```

## Despliegue local con Anvil

```bash
# Terminal A
anvil

# Terminal B — usa la primera clave privada de Anvil (solo local)
cd dapp/contracts
forge script script/DeployDAO.s.sol:DeployDAO \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

El script:

1. Despliega `GovernanceToken` y acuña el supply al deployer.
2. Despliega `CommunityTreasury`.
3. Despliega `DaoGovernor` y asigna permisos en la tesorería.
4. Fondea la tesorería con 10 ETH.

Las direcciones se imprimen en consola. Los artefactos (ABI + bytecode) quedan en `out/` para el frontend (sesión 8).

## Layout

```text
src/
  GovernanceToken.sol
  CommunityTreasury.sol
  DaoGovernor.sol
script/
  DeployDAO.s.sol
test/
  DeploySmoke.t.sol   # humo S7; suite completa en S10
```
