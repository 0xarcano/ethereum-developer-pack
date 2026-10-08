import { useSimpleVote } from "../hooks";
import { ConnectBar } from "./ConnectBar";

export function SimpleVote() {
  const {
    account,
    proposal,
    votesFor,
    votesAgainst,
    isApproved,
    hasVoted,
    isLoading,
    isVoting,
    isConnecting,
    error,
    txHash,
    connectWallet,
    disconnectWallet,
    vote,
    refetch,
  } = useSimpleVote();

  const isConnected = Boolean(account);

  return (
    <div className="simple-vote-card">
      <div className="card-top">
        <div className="section-badge">Votación Onchain (Viem Puro)</div>
        <ConnectBar
          account={account}
          isConnecting={isConnecting}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      </div>

      <h3>{proposal || (isLoading ? "Cargando propuesta onchain..." : "Sin propuesta cargada")}</h3>
      <p className="description">
        Interacción directa con <code>SimpleProposalVote.sol</code> usando <strong>Viem</strong> y llamadas JSON-RPC. Demuestra lectura pública sin gas, simulación previa de transacciones y confirmación en bloque.
      </p>

      <div className="stats-row">
        <div className="stat">
          <span className="stat-label">A Favor</span>
          <span className="stat-value text-green">{votesFor.toString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">En Contra</span>
          <span className="stat-value text-red">{votesAgainst.toString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">¿Aprobada?</span>
          <span className="stat-value">{isApproved ? "Sí" : "No"}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tu Voto</span>
          <span className={`stat-value ${hasVoted ? "text-red" : "text-green"}`}>
            {isConnected ? (hasVoted ? "Emitido" : "Pendiente") : "Desconectado"}
          </span>
        </div>
      </div>

      {error && <p className="error-banner">{error}</p>}
      {txHash && (
        <p className="tx-banner">
          Transacción confirmada: <code>{txHash.slice(0, 10)}...{txHash.slice(-8)}</code>
        </p>
      )}

      <div className="button-group">
        <button
          className="btn-vote-yes"
          disabled={!isConnected || hasVoted || isVoting || isLoading}
          onClick={() => void vote(true)}
        >
          {isVoting ? "Procesando firma y bloque..." : "Votar Sí (YES)"}
        </button>
        <button
          className="btn-vote-no"
          disabled={!isConnected || hasVoted || isVoting || isLoading}
          onClick={() => void vote(false)}
        >
          {isVoting ? "Procesando firma y bloque..." : "Votar No (NO)"}
        </button>
        <button
          className="btn-secondary"
          disabled={isLoading || isVoting}
          onClick={() => void refetch()}
        >
          Refrescar
        </button>
      </div>
    </div>
  );
}
