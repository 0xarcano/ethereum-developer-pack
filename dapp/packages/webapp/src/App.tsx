import { useState } from "react";
import { ConnectBar } from "./components/ConnectBar";
import { SimpleVote } from "./components/SimpleVote";
import { ProposalList } from "./components/ProposalList";
import { TokenBalance } from "./components/TokenBalance";
import { hasContractAddresses } from "./config";

type ActiveTab = "simple" | "dao";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("simple");

  return (
    <div className="page">
      <header className="hero">
        <p className="brand">CEDIA · Ecuador Web3</p>
        <h1>Ethereum Developer Pack — Sesión 8</h1>
        <p className="lede">
          Frontend Web3 Progresivo: desde interacción directa con Viem hasta gobernanza modular con Wagmi.
        </p>
        <ConnectBar />
      </header>

      {/* Selector de Etapas Pedagógicas */}
      <nav className="tab-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "simple" ? "active" : ""}`}
          onClick={() => setActiveTab("simple")}
        >
          1. Votación Simple (Viem Directo)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "dao" ? "active" : ""}`}
          onClick={() => setActiveTab("dao")}
        >
          2. Mini-DAO Modular (React + Wagmi)
        </button>
      </nav>

      {activeTab === "simple" && (
        <main className="tab-content">
          <SimpleVote />
        </main>
      )}

      {activeTab === "dao" && (
        <>
          {!hasContractAddresses() && (
            <p className="banner">
              Copia <code>.env.example</code> a <code>.env</code> y pega las direcciones desplegadas
              con <code>pnpm deploy:dao</code> (Anvil).
            </p>
          )}

          <main className="layout">
            <aside className="panel">
              <TokenBalance />
            </aside>
            <section className="panel grow">
              <h2>Propuestas de Gobernanza</h2>
              <ProposalList />
            </section>
          </main>
        </>
      )}
    </div>
  );
}
