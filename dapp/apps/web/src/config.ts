import type { Address } from "viem";
import { zeroAddress, isAddress } from "viem";

function readAddress(value: string | undefined): Address | null {
  if (!value || !isAddress(value) || value === zeroAddress) return null;
  return value;
}

export const addresses = {
  token: readAddress(import.meta.env.VITE_TOKEN_ADDRESS),
  treasury: readAddress(import.meta.env.VITE_TREASURY_ADDRESS),
  governor: readAddress(import.meta.env.VITE_GOVERNOR_ADDRESS),
} as const;

export function hasContractAddresses(): boolean {
  return Boolean(addresses.token && addresses.treasury && addresses.governor);
}
