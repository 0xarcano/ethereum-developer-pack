import type { Address } from "viem";

const simpleVoteEnv = (import.meta.env.VITE_SIMPLE_VOTE_ADDRESS ?? "0x5FbDB2315678afecb367f032d93F642f64180aa3") as Address;

export const addresses = {
  simpleVote: simpleVoteEnv,
};

export const CONTRACTS = {
  SimpleProposalVote: simpleVoteEnv,
};

export function hasSimpleVoteAddress(): boolean {
  return Boolean(addresses.simpleVote);
}
