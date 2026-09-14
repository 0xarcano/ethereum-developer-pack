import { ConnectBar } from "./components/ConnectBar";
import { ProposalList } from "./components/ProposalList";
import { TokenBalance } from "./components/TokenBalance";
import { hasContractAddresses } from "./config";

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <p className="brand">CEDIA · Ecuador Web3</p>
        <h1>Mini-DAO</h1>
        <p className="lede">Token governance and on-chain treasury — session 8.</p>
        <ConnectBar />
      </header>

      {!hasContractAddresses() && (
        <p className="banner">
          Copy <code>.env.example</code> to <code>.env</code> and paste addresses from{" "}
          <code>forge script</code> (Anvil).
        </p>
      )}

      <main className="layout">
        <aside className="panel">
          <TokenBalance />
        </aside>
        <section className="panel grow">
          <h2>Proposals</h2>
          <ProposalList />
        </section>
      </main>
    </div>
  );
}
