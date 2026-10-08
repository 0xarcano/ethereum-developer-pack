import { useState, useEffect, useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { publicClient, CONTRACTS, anvilChain } from "../config";
import { simpleProposalVoteAbi } from "../abis";

export interface SimpleVoteState {
  proposal: string;
  votesFor: bigint;
  votesAgainst: bigint;
  isApproved: boolean;
  hasVoted: boolean;
  isLoading: boolean;
  isVoting: boolean;
  error: string | null;
  txHash: string | null;
  vote: (support: boolean) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useSimpleVote(): SimpleVoteState {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [proposal, setProposal] = useState<string>("");
  const [votesFor, setVotesFor] = useState<bigint>(0n);
  const [votesAgainst, setVotesAgainst] = useState<bigint>(0n);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prop, vFor, vAgainst, approved] = await Promise.all([
        publicClient.readContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "proposal",
        }),
        publicClient.readContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "votesFor",
        }),
        publicClient.readContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "votesAgainst",
        }),
        publicClient.readContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "isApproved",
        }),
      ]);

      setProposal(prop as string);
      setVotesFor(vFor as bigint);
      setVotesAgainst(vAgainst as bigint);
      setIsApproved(approved as boolean);

      if (address) {
        const voted = await publicClient.readContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "hasVoted",
          args: [address],
        });
        setHasVoted(voted as boolean);
      } else {
        setHasVoted(false);
      }
    } catch (err) {
      console.error("Error reading SimpleProposalVote:", err);
      setError("No se pudo leer el contrato. Verifica que Anvil esté activo.");
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const vote = useCallback(
    async (support: boolean) => {
      if (!walletClient || !address) {
        setError("Conecta tu billetera primero.");
        return;
      }

      setIsVoting(true);
      setError(null);
      setTxHash(null);

      try {
        const hash = await walletClient.writeContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "vote",
          args: [support],
          chain: anvilChain,
          account: address,
        });

        setTxHash(hash);

        // Esperar recibo de la transacción
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === "success") {
          await refetch();
        } else {
          setError("La transacción fue revertida en la EVM.");
        }
      } catch (err) {
        console.error("Error casting vote:", err);
        setError((err as Error).message || "Fallo al enviar el voto.");
      } finally {
        setIsVoting(false);
      }
    },
    [walletClient, address, refetch]
  );

  return {
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
  };
}
