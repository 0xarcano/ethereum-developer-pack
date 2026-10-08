import { useState, useEffect, useCallback } from "react";
import { createWalletClient, custom, type WalletClient, type Address } from "viem";
import { publicClient, CONTRACTS, anvilChain } from "../config";
import { simpleProposalVoteAbi } from "../abis";

export interface SimpleVoteState {
  account: Address | null;
  proposal: string;
  votesFor: bigint;
  votesAgainst: bigint;
  isApproved: boolean;
  hasVoted: boolean;
  isLoading: boolean;
  isVoting: boolean;
  isConnecting: boolean;
  error: string | null;
  txHash: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  vote: (support: boolean) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useSimpleVote(): SimpleVoteState {
  const [account, setAccount] = useState<Address | null>(null);
  const [proposal, setProposal] = useState<string>("");
  const [votesFor, setVotesFor] = useState<bigint>(0n);
  const [votesAgainst, setVotesAgainst] = useState<bigint>(0n);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Read proposal and user voting status
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

      if (account) {
        const voted = await publicClient.readContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "hasVoted",
          args: [account],
        });
        setHasVoted(voted as boolean);
      } else {
        setHasVoted(false);
      }
    } catch (err) {
      console.error("Error reading SimpleProposalVote:", err);
      setError("No se pudo leer el contrato. Verifica que Anvil y el contrato estén activos.");
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Connect wallet via native window.ethereum (EIP-1193)
  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("No se detectó billetera Web3 (MetaMask/Rabby).");
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts[0]) {
        setAccount(accounts[0] as Address);
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err?.message ?? "Error conectando billetera.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setHasVoted(false);
  }, []);

  // Listen to EIP-1193 account & chain changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setHasVoted(false);
      } else {
        setAccount(accounts[0] as Address);
      }
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);

    // Check if already authorized
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accs: any) => {
        if (accs && accs[0]) {
          setAccount(accs[0] as Address);
        }
      })
      .catch(console.error);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  // Cast vote with Patrick Collins' Golden Rule: simulate first!
  const vote = useCallback(
    async (support: boolean) => {
      if (typeof window === "undefined" || !window.ethereum || !account) {
        setError("Conecta tu billetera primero.");
        return;
      }

      setIsVoting(true);
      setError(null);
      setTxHash(null);

      try {
        const walletClient: WalletClient = createWalletClient({
          chain: anvilChain,
          transport: custom(window.ethereum),
        });

        // Step 1: Simulate transaction prevention
        const { request } = await publicClient.simulateContract({
          address: CONTRACTS.SimpleProposalVote,
          abi: simpleProposalVoteAbi,
          functionName: "vote",
          args: [support],
          account,
        });

        // Step 2: Transmit signed transaction
        const hash = await walletClient.writeContract(request);
        setTxHash(hash);

        // Step 3: Wait for transaction receipt in block
        await publicClient.waitForTransactionReceipt({ hash });

        // Step 4: Refresh UI
        await refetch();
      } catch (err: any) {
        console.error("Error casting vote:", err);
        setError(err?.shortMessage ?? err?.message ?? "Error al votar");
      } finally {
        setIsVoting(false);
      }
    },
    [account, refetch]
  );

  return {
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
  };
}
