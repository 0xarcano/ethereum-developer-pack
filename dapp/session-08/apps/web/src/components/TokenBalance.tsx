import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { governanceTokenAbi } from "../abis";
import { addresses } from "../config";

export function TokenBalance() {
  const { address, isConnected } = useAccount();
  const token = addresses.token;

  const { data, isLoading, error, refetch } = useReadContract({
    address: token ?? undefined,
    abi: governanceTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(isConnected && token && address) },
  });

  if (!isConnected) {
    return <p className="muted">Connect a wallet to see your CGOV balance.</p>;
  }

  if (!token) {
    return <p className="warn">Set VITE_TOKEN_ADDRESS in .env</p>;
  }

  return (
    <div className="balance">
      <h2>Your CGOV</h2>
      {isLoading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error.message}</p>}
      {data !== undefined && (
        <p className="balance-value">
          <span className="mono">{formatEther(data as bigint)}</span> CGOV
        </p>
      )}
      <button type="button" className="ghost" onClick={() => refetch()}>
        Refresh
      </button>
    </div>
  );
}
