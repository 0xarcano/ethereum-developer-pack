# Sesión 3 — Primer prototipo en Remix

## Objetivo

Crear el núcleo de gobernanza más básico posible: un contrato único con una propuesta fija, un voto por dirección y contadores a favor / en contra.

## Archivo

- [`SimpleProposalVote.sol`](./SimpleProposalVote.sol)

## Flujo en Remix

1. Abre [Remix IDE](https://remix.ethereum.org) y crea el archivo con el contenido del contrato.
2. Compila con Solidity `0.8.24` (o compatible `^0.8.24`).
3. En **Deploy & Run Transactions**, elige el entorno *Remix VM*.
4. Despliega pasando un texto de propuesta, por ejemplo: `"Fondos para workshop CEDIA"`.
5. Lee las variables públicas `proposal`, `votesFor`, `votesAgainst` (llamadas de solo lectura, sin gas de escritura).
6. Ejecuta `vote(true)` desde la cuenta actual.
7. Cambia de cuenta en la lista de cuentas virtuales e intenta votar de nuevo.
8. Observa el consumo de gas en la consola y el evento `VoteCast`.
9. Llama `isApproved()` para ver si la propuesta ya gana.

## Ideas para discutir en clase

- Diferencia entre **lectura** (view) y **escritura** (transacción que cambia estado).
- Por qué `require(!hasVoted[msg.sender])` evita el doble voto.
- Limitaciones: un voto = una dirección (sin peso por tokens), una sola propuesta, sin tesorería.
