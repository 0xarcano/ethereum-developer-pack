import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { anvil } from "wagmi/chains";

export function ConnectBar() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];
  const wrongNetwork = isConnected && chainId !== anvil.id;

  return (
    <div className="connect">
      {!isConnected ? (
        <button
          type="button"
          disabled={!injected || isPending}
          onClick={() => injected && connect({ connector: injected })}
        >
          {isPending ? "Connecting…" : "Connect wallet"}
        </button>
      ) : (
        <div className="connect-row">
          <span className="mono">
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </span>
          {wrongNetwork && <span className="warn">Switch MetaMask to Anvil (chain 31337)</span>}
          <button type="button" className="ghost" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      )}
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}
