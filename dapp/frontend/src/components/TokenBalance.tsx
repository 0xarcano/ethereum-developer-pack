import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { governanceTokenAbi } from "../abis";
import { addresses } from "../config";

export function TokenBalance() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useReadContract({
    address: addresses.token,
    abi: governanceTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(isConnected && address) },
  });

  if (!isConnected) {
    return <p className="muted">Connect to see your CGOV balance.</p>;
  }

  return (
    <div className="panel">
      <h2>Governance token</h2>
      <p className="balance">
        {isLoading || balance === undefined ? "…" : `${formatEther(balance as bigint)} CGOV`}
      </p>
      <p className="muted small">Voting weight equals your token balance at vote time.</p>
    </div>
  );
}
