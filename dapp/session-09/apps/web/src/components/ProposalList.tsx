import { useState } from "react";
import { formatEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { daoGovernorAbi } from "../abis";
import { addresses } from "../config";

type ProposalView = {
  description: string;
  recipient: `0x${string}`;
  amount: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  deadline: bigint;
  executed: boolean;
};

function VoteButtons({ proposalId }: { proposalId: bigint }) {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cast = (support: boolean) => {
    if (!addresses.governor) return;
    reset();
    writeContract({
      address: addresses.governor,
      abi: daoGovernorAbi,
      functionName: "vote",
      args: [proposalId, support],
    });
  };

  return (
    <div className="vote-actions">
      <button type="button" disabled={!isConnected || isPending || confirming} onClick={() => cast(true)}>
        For
      </button>
      <button
        type="button"
        className="ghost"
        disabled={!isConnected || isPending || confirming}
        onClick={() => cast(false)}
      >
        Against
      </button>
      {isPending && <span className="muted">Confirm in wallet…</span>}
      {confirming && <span className="muted">Waiting for confirmation…</span>}
      {isSuccess && <span className="ok">Vote confirmed</span>}
      {error && <span className="error">{error.message}</span>}
    </div>
  );
}

function ProposalCard({ id }: { id: bigint }) {
  const { data, isLoading, error } = useReadContract({
    address: addresses.governor ?? undefined,
    abi: daoGovernorAbi,
    functionName: "proposals",
    args: [id],
  });

  if (isLoading) return <li className="muted">Loading proposal #{id.toString()}…</li>;
  if (error || !data) return <li className="error">Failed to load #{id.toString()}</li>;

  // wagmi returns tuple for public mapping getter
  const tuple = data as unknown as [
    string,
    `0x${string}`,
    bigint,
    bigint,
    bigint,
    bigint,
    boolean,
  ];
  const proposal: ProposalView = {
    description: tuple[0],
    recipient: tuple[1],
    amount: tuple[2],
    votesFor: tuple[3],
    votesAgainst: tuple[4],
    deadline: tuple[5],
    executed: tuple[6],
  };

  const total = proposal.votesFor + proposal.votesAgainst;
  const forPct = total === 0n ? 0 : Number((proposal.votesFor * 1000n) / total) / 10;
  const againstPct = total === 0n ? 0 : 100 - forPct;
  const open = !proposal.executed && Date.now() / 1000 <= Number(proposal.deadline);

  return (
    <li className="proposal">
      <header>
        <h3>
          #{id.toString()} — {proposal.description || "(empty)"}
        </h3>
        <span className="tag">{proposal.executed ? "Executed" : open ? "Open" : "Ended"}</span>
      </header>
      <p className="muted">
        Pay {formatEther(proposal.amount)} ETH →{" "}
        <span className="mono">
          {proposal.recipient.slice(0, 6)}…{proposal.recipient.slice(-4)}
        </span>
      </p>
      <div className="bars" aria-label="Vote progress">
        <div className="bar for" style={{ width: `${forPct}%` }} title={`For ${forPct}%`} />
        <div className="bar against" style={{ width: `${againstPct}%` }} title={`Against ${againstPct}%`} />
      </div>
      <p className="mono small">
        For {formatEther(proposal.votesFor)} · Against {formatEther(proposal.votesAgainst)}
      </p>
      {open && <VoteButtons proposalId={id} />}
    </li>
  );
}

export function ProposalList() {
  const governor = addresses.governor;
  const { data: count, isLoading, error, refetch } = useReadContract({
    address: governor ?? undefined,
    abi: daoGovernorAbi,
    functionName: "proposalCount",
    query: { enabled: Boolean(governor) },
  });

  const [maxShow] = useState(20);

  if (!governor) {
    return <p className="warn">Set VITE_GOVERNOR_ADDRESS in .env after deploying with Foundry.</p>;
  }

  if (isLoading) return <p className="muted">Loading proposals…</p>;
  if (error) return <p className="error">{error.message}</p>;

  const n = Number(count ?? 0n);
  if (n === 0) {
    return (
      <div>
        <p className="muted">No proposals yet. Create one with cast/forge or Remix.</p>
        <button type="button" className="ghost" onClick={() => refetch()}>
          Refresh
        </button>
      </div>
    );
  }

  const ids: bigint[] = [];
  const start = Math.max(1, n - maxShow + 1);
  for (let i = n; i >= start; i--) ids.push(BigInt(i));

  return (
    <div>
      <div className="list-head">
        <p className="muted">{n} proposal(s)</p>
        <button type="button" className="ghost" onClick={() => refetch()}>
          Refresh
        </button>
      </div>
      <ul className="proposals">
        {ids.map((id) => (
          <ProposalCard key={id.toString()} id={id} />
        ))}
      </ul>
    </div>
  );
}
