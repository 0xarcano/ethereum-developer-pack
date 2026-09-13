import type { Address } from "viem";

function requiredAddress(value: string | undefined, label: string): Address {
  if (!value || !/^0x[a-fA-F0-9]{40}$/.test(value)) {
    console.warn(`Missing or invalid ${label}. Set it in .env after DeployDAO.`);
    return "0x0000000000000000000000000000000000000000";
  }
  return value as Address;
}

export const addresses = {
  token: requiredAddress(import.meta.env.VITE_TOKEN_ADDRESS, "VITE_TOKEN_ADDRESS"),
  treasury: requiredAddress(import.meta.env.VITE_TREASURY_ADDRESS, "VITE_TREASURY_ADDRESS"),
  governor: requiredAddress(import.meta.env.VITE_GOVERNOR_ADDRESS, "VITE_GOVERNOR_ADDRESS"),
} as const;
