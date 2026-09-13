import { useEffect, useState } from "react";
import { formatEther, zeroAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { daoGovernorAbi } from "../abis";
import { addresses } from "../config";

type ProposalTuple = readonly [
  string,
  `0x${string}`,
  bigint,
  bigint,
  bigint,
  bigint,
  boolean,
];

function VoteButtons({ proposalId }: { proposalId: number }) {
  const { isConnected } = useAccount();
  const [pendingSide, setPendingSide] = useState<"for" | "against" | null>(null);
  const { writeContract, data: hash, error, reset, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess || error) {
      setPendingSide(null);
    }
  }, [isSuccess, error]);

  const busy = isPending || isConfirming || pendingSide !== null;

  function vote(support: boolean) {
    setPendingSide(support ? "for" : "against");
    reset();
    writeContract({
      address: addresses.governor,
      abi: daoGovernorAbi,
      functionName: "vote",
      args: [BigInt(proposalId), support],
    });
  }

  return (
    <div className="vote-row">
      <button
        type="button"
        className="btn primary"
        disabled={!isConnected || busy}
        onClick={() => vote(true)}
      >
        {pendingSide === "for" && busy ? "Voting yes…" : "Yes"}
      </button>
      <button
        type="button"
        className="btn danger"
        disabled={!isConnected || busy}
        onClick={() => vote(false)}
      >
        {pendingSide === "against" && busy ? "Voting no…" : "No"}
      </button>
      {error ? <p className="error">{error.message.split("\n")[0]}</p> : null}
      {isSuccess ? <p className="ok">Vote confirmed</p> : null}
    </div>
  );
}

function ProposalCard({ proposalId }: { proposalId: number }) {
  const { data } = useReadContract({
    address: addresses.governor,
    abi: daoGovernorAbi,
    functionName: "proposals",
    args: [BigInt(proposalId)],
  });

  if (!data) return null;
  const [description, recipient, amount, votesFor, votesAgainst, deadline, executed] =
    data as ProposalTuple;

  const forVotes = Number(formatEther(votesFor));
  const againstVotes = Number(formatEther(votesAgainst));
  const total = forVotes + againstVotes;
  const forPct = total === 0 ? 0 : (forVotes / total) * 100;

  return (
    <article className="proposal">
      <header>
        <h3>
          #{proposalId} — {description}
        </h3>
        <span className={executed ? "badge done" : "badge open"}>
          {executed ? "Executed" : "Open"}
        </span>
      </header>
      <dl className="meta">
        <div>
          <dt>Recipient</dt>
          <dd className="mono">{recipient}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>{formatEther(amount)} ETH</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{new Date(Number(deadline) * 1000).toLocaleString()}</dd>
        </div>
      </dl>
      <div className="bar" aria-label="Vote progress">
        <div className="bar-for" style={{ width: `${forPct}%` }} />
      </div>
      <p className="muted small">
        For {forVotes.toFixed(2)} · Against {againstVotes.toFixed(2)}
      </p>
      {!executed ? <VoteButtons proposalId={proposalId} /> : null}
    </article>
  );
}

export function ProposalList() {
  const configured = addresses.governor !== zeroAddress;
  const { data: count } = useReadContract({
    address: addresses.governor,
    abi: daoGovernorAbi,
    functionName: "proposalCount",
    query: { enabled: configured },
  });

  if (!configured) {
    return (
      <p className="muted">
        Set <code>VITE_GOVERNOR_ADDRESS</code> (and token/treasury) in <code>.env</code> after{" "}
        <code>DeployDAO</code>.
      </p>
    );
  }

  const n = count === undefined ? 0 : Number(count);
  if (n === 0) {
    return <p className="muted">No proposals yet. Create one with cast or a script.</p>;
  }

  return (
    <div className="proposals">
      {Array.from({ length: n }, (_, i) => n - i).map((id) => (
        <ProposalCard key={id} proposalId={id} />
      ))}
    </div>
  );
}
