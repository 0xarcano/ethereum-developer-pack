import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "../config";
import { governanceTokenAbi } from "../abis";

export function useTokenBalance() {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.GovernanceToken,
    abi: governanceTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return {
    balance: (data as bigint | undefined) ?? 0n,
    isLoading,
    refetch,
  };
}
