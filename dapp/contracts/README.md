# Contratos — Sesión 5

La Mini-DAO deja de ser un monolito: el poder de voto vive en un **token ERC-20**, los fondos en una **tesorería**, y la lógica de propuestas en un **governor**.

## Archivos

| Contrato | Rol |
| --- | --- |
| [`src/GovernanceToken.sol`](./src/GovernanceToken.sol) | ERC-20 mínimo (membresía / peso de voto) |
| [`src/CommunityTreasury.sol`](./src/CommunityTreasury.sol) | Bóveda de ETH; solo el governor puede `release` |
| [`src/DaoGovernor.sol`](./src/DaoGovernor.sol) | Propuestas, votos ponderados, ejecución |
| [`src/SimpleProposalVote.sol`](./src/SimpleProposalVote.sol) | Referencia de la sesión 3 (sigue disponible) |

## Objetivo didáctico

Ver cómo un contrato llama a otro en la EVM, el control de acceso entre contratos y un flujo de gobernanza con peso = `balanceOf`.

## Orden de despliegue en Remix

1. Compila los tres contratos nuevos (`^0.8.24`).
2. **Deploy `GovernanceToken`** con:
   - `initialHolder`: tu cuenta
   - `initialSupply`: p. ej. `1000000000000000000000000` (1_000_000e18)
3. **Deploy `CommunityTreasury`** (sin argumentos).
4. **Deploy `DaoGovernor`** con:
   - `token_`: dirección del token
   - `treasury_`: dirección de la tesorería
   - `votingPeriod_`: p. ej. `300` (5 minutos en segundos) para demos
   - `quorumVotes_`: p. ej. `100000000000000000000000` (100_000e18)
5. En la tesorería llama `setGovernor(direcciónDelGovernor)` **una sola vez**.
6. Fondea la tesorería: envía ETH (campo *Value* en Remix) a la dirección de `CommunityTreasury`.
7. Opcional: `transfer` del token a otras cuentas para que voten con distinto peso.

## Flujo de práctica

1. `createProposal("Pago taller", recipient, amountWei)`
2. Con cuentas que tengan CGOV: `vote(proposalId, true/false)`
3. Espera a que pase el `deadline` (en Remix VM puedes avanzar el tiempo en *Deploy & Run* → *Increase time* / *mine*, según entorno).
4. `execute(proposalId)` → la tesorería envía ETH al recipient.

## Ideas de seguridad (preview de S10)

- Solo el governor puede vaciar la tesorería.
- Un address no puede votar dos veces en la misma propuesta.
- La ejecución marca `executed` **antes** de llamar a `release` (checks-effects-interactions).
