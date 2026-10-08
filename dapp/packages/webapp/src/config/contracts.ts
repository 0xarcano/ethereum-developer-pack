import type { Address } from "viem";

const zero = "0x0000000000000000000000000000000000000000" as Address;

const tokenEnv = (import.meta.env.VITE_TOKEN_ADDRESS ?? import.meta.env.VITE_GOVERNANCE_TOKEN_ADDRESS) as Address | undefined;
const governorEnv = (import.meta.env.VITE_GOVERNOR_ADDRESS ?? import.meta.env.VITE_DAO_GOVERNOR_ADDRESS) as Address | undefined;
const treasuryEnv = (import.meta.env.VITE_TREASURY_ADDRESS ?? import.meta.env.VITE_COMMUNITY_TREASURY_ADDRESS) as Address | undefined;
const simpleVoteEnv = (import.meta.env.VITE_SIMPLE_VOTE_ADDRESS ?? "0x5FbDB2315678afecb367f032d93F642f64180aa3") as Address;

export const addresses = {
  token: tokenEnv,
  governor: governorEnv,
  treasury: treasuryEnv,
  simpleVote: simpleVoteEnv,
};

export const CONTRACTS = {
  GovernanceToken: tokenEnv ?? zero,
  DaoGovernor: governorEnv ?? zero,
  CommunityTreasury: treasuryEnv ?? zero,
  SimpleProposalVote: simpleVoteEnv,
};

export function hasContractAddresses(): boolean {
  return Boolean(addresses.token && addresses.governor && addresses.treasury);
}

export function hasDaoContractAddresses(): boolean {
  return hasContractAddresses();
}

export function hasSimpleVoteAddress(): boolean {
  return Boolean(addresses.simpleVote);
}
