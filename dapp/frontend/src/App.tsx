import { ConnectBar } from "./components/ConnectBar";
import { ProposalList } from "./components/ProposalList";
import { TokenBalance } from "./components/TokenBalance";

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <p className="brand">CEDIA · Ecuador Web3</p>
        <h1>Mini-DAO</h1>
        <p className="lede">Gobernanza tokenizada y tesorería onchain — sesión 8.</p>
        <ConnectBar />
      </header>
      <main className="layout">
        <TokenBalance />
        <section className="panel grow">
          <h2>Proposals</h2>
          <ProposalList />
        </section>
      </main>
    </div>
  );
}
