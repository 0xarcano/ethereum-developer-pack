import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { anvil } from "../wagmi";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function ConnectBar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  if (!isConnected) {
    return (
      <button
        type="button"
        className="btn primary"
        disabled={isConnecting}
        onClick={() => connect({ connector: connectors[0] })}
      >
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </button>
    );
  }

  if (chainId !== anvil.id) {
    return (
      <button
        type="button"
        className="btn warn"
        disabled={isSwitching}
        onClick={() => switchChain({ chainId: anvil.id })}
      >
        {isSwitching ? "Switching…" : "Switch to Anvil"}
      </button>
    );
  }

  return (
    <div className="connect-bar">
      <span className="mono" title={address}>
        {shortAddress(address!)}
      </span>
      <button type="button" className="btn ghost" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
