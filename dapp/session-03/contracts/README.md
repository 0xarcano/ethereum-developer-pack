# Contratos — Sesión 3

Primer prototipo de la Mini-DAO: un contrato monolítico de votación para practicar en **Remix IDE**.

## Archivo

- [`src/SimpleProposalVote.sol`](./src/SimpleProposalVote.sol)

## Objetivo didáctico

Familiarizarse con compilación, despliegue, cuentas locales, gas y la diferencia entre **lecturas** (view) y **escrituras** (transactions).

## Cómo usar en Remix

1. Abre [Remix](https://remix.ethereum.org).
2. Crea un archivo `SimpleProposalVote.sol` y pega el contenido de `src/SimpleProposalVote.sol` (o abre el repo con el plugin de Remix).
3. Compila con Solidity `0.8.24` (o compatible `^0.8.24`).
4. En **Deploy & Run Transactions**:
   - Environment: `Remix VM` (local).
   - Deploy con un texto de propuesta, por ejemplo: `"¿Aprobar presupuesto CEDIA?"`.
5. Cambia de cuenta en el selector de cuentas y llama `vote(true)` o `vote(false)`.
6. Observa `votesFor`, `votesAgainst`, `hasVoted` y `isApproved` (llamadas de solo lectura, sin gastar gas de red).

## API

| Función | Tipo | Descripción |
| --- | --- | --- |
| `vote(bool support)` | write | Un voto por dirección |
| `isApproved()` | view | `true` si `votesFor > votesAgainst` |
| `proposal` / `votesFor` / `votesAgainst` | view | Estado público |

## Próximo paso

En la sesión 5 el monolito se divide en token de gobernanza, tesorería y governor.
