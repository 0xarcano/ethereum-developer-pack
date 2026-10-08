import type { Address } from "viem";

interface ConnectBarProps {
  account: Address | null;
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
}

export function ConnectBar({
  account,
  isConnecting,
  onConnect,
  onDisconnect,
}: ConnectBarProps) {
  const isConnected = Boolean(account);

  return (
    <div className="connect">
      {!isConnected ? (
        <button
          type="button"
          disabled={isConnecting}
          onClick={() => void onConnect()}
        >
          {isConnecting ? "Conectando…" : "Conectar Billetera"}
        </button>
      ) : (
        <div className="connect-row">
          <span className="mono">
            {account?.slice(0, 6)}…{account?.slice(-4)}
          </span>
          <button type="button" className="ghost" onClick={onDisconnect}>
            Desconectar
          </button>
        </div>
      )}
    </div>
  );
}
