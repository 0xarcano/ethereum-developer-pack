import { useSimpleVote } from "../hooks";
import { useAccount } from "wagmi";

export function SimpleVote() {
  const { isConnected } = useAccount();
  const {
    proposal,
    votesFor,
    votesAgainst,
    isApproved,
    hasVoted,
    isLoading,
    isVoting,
    error,
    txHash,
    vote,
    refetch,
  } = useSimpleVote();

  return (
    <div className="simple-vote-card">
      <div className="section-badge">Etapa 1 · Votación Directa (Viem)</div>
      <h3>{proposal || "Cargando propuesta onchain..."}</h3>
      <p className="description">
        Interacción directa con <code>SimpleProposalVote.sol</code>. Demuestra lecturas sin gas y
        transacciones con recibo confirmado.
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
          <span className="stat-label">Aprobada</span>
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
          Transacción enviada: <code>{txHash.slice(0, 10)}...{txHash.slice(-8)}</code>
        </p>
      )}

      <div className="button-group">
        <button
          className="btn-vote-yes"
          disabled={!isConnected || hasVoted || isVoting || isLoading}
          onClick={() => void vote(true)}
        >
          {isVoting ? "Procesando..." : "Votar Sí (YES)"}
        </button>
        <button
          className="btn-vote-no"
          disabled={!isConnected || hasVoted || isVoting || isLoading}
          onClick={() => void vote(false)}
        >
          {isVoting ? "Procesando..." : "Votar No (NO)"}
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
