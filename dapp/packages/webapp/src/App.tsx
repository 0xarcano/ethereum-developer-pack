import { SimpleVote } from "./components/SimpleVote";

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <p className="brand">CEDIA · Ecuador Web3</p>
        <h1>Ethereum Developer Pack — Sesión 8</h1>
        <p className="lede">
          Frontend Web3: Interacción directa con Smart Contracts mediante Viem, EIP-1193 y llamadas JSON-RPC.
        </p>
      </header>

      <main className="tab-content">
        <SimpleVote />
      </main>
    </div>
  );
}
