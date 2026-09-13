# Sesión 5 — Modularidad, token y tesorería

## Objetivo

Transformar el monolito de la sesión 3 en tres contratos que colaboran: poder de voto (ERC-20), bóveda de ETH y gobernanza que ejecuta pagos.

## Contratos

| Archivo | Rol |
| --- | --- |
| [`GovernanceToken.sol`](./GovernanceToken.sol) | ERC-20 didáctico (`CGOV`) |
| [`CommunityTreasury.sol`](./CommunityTreasury.sol) | Tesorería ETH; solo el governor puede `release` |
| [`DaoGovernor.sol`](./DaoGovernor.sol) | Propuestas, voto ponderado, `execute` permissionless |

## Orden de despliegue en Remix

1. Compila con OpenZeppelin (Remix: *File explorer → npm → `@openzeppelin/contracts`* o import GitHub).
2. Despliega `GovernanceToken(initialHolder, initialSupply)` — por ejemplo `1000e18` al instructor.
3. Despliega `CommunityTreasury` (sin argumentos).
4. Despliega `DaoGovernor(token, treasury, votingPeriod, quorumVotes)`:
   - `votingPeriod`: segundos (ej. `600` = 10 min en VM).
   - `quorumVotes`: unidades de token (ej. `100e18`).
5. En la tesorería llama `setGovernor(address del DaoGovernor)` **una sola vez**.
6. Fondea la tesorería enviando ETH (campo *Value* + botón *Transact* / `receive`).
7. Transfiere tokens `CGOV` a las cuentas que votarán.
8. `createProposal`, `vote`, espera el deadline (en Remix VM puedes minar bloques / avanzar tiempo si usas cheatcodes locales; en VM simple usa un `votingPeriod` corto) y `execute`.

## Ideas para discutir en clase

- Llamadas entre contratos: Governor → Treasury (`release`).
- Patrón **Checks-Effects-Interactions** y `nonReentrant` en `execute`.
- Control de acceso: `onlyGovernor` vs ejecución permissionless de propuestas aprobadas.
- Limitación didáctica: el peso usa `balanceOf` al momento del voto (no snapshot / ERC20Votes).
