import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createPublicClient,
  http,
  parseAbiItem,
  isAddress,
} from "viem";
import { anvil } from "viem/chains";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
const storePath = join(dataDir, "events.json");

const rpcUrl = process.env.RPC_URL ?? "http://127.0.0.1:8545";
const governorAddress = process.env.GOVERNOR_ADDRESS;

if (!governorAddress || !isAddress(governorAddress)) {
  console.error("Set GOVERNOR_ADDRESS to the DaoGovernor deployment (0x…).");
  process.exit(1);
}

mkdirSync(dataDir, { recursive: true });

/** @typedef {{ proposals: object[], votes: object[], lastBlock: string }} Store */

/** @returns {Store} */
function loadStore() {
  if (!existsSync(storePath)) {
    return { proposals: [], votes: [], lastBlock: "0" };
  }
  return JSON.parse(readFileSync(storePath, "utf8"));
}

/** @param {Store} store */
function saveStore(store) {
  writeFileSync(storePath, JSON.stringify(store, null, 2) + "\n");
}

const proposalCreatedEvent = parseAbiItem(
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description, address recipient, uint256 amount, uint256 deadline)",
);
const voteCastEvent = parseAbiItem(
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
);

const client = createPublicClient({
  chain: anvil,
  transport: http(rpcUrl),
});

const store = loadStore();

console.log(`Indexer listening on ${governorAddress}`);
console.log(`RPC ${rpcUrl}`);
console.log(`Store ${storePath} (from block ${store.lastBlock})`);

client.watchContractEvent({
  address: governorAddress,
  abi: [proposalCreatedEvent],
  eventName: "ProposalCreated",
  fromBlock: BigInt(store.lastBlock),
  onLogs: (logs) => {
    for (const log of logs) {
      const args = log.args;
      const entry = {
        proposalId: args.proposalId?.toString(),
        proposer: args.proposer,
        description: args.description,
        recipient: args.recipient,
        amount: args.amount?.toString(),
        deadline: args.deadline?.toString(),
        blockNumber: log.blockNumber?.toString(),
        txHash: log.transactionHash,
      };
      store.proposals.push(entry);
      if (log.blockNumber && log.blockNumber > BigInt(store.lastBlock)) {
        store.lastBlock = log.blockNumber.toString();
      }
      console.log("[ProposalCreated]", entry.proposalId, entry.description);
    }
    saveStore(store);
  },
  onError: (err) => console.error("ProposalCreated watch error", err.message),
});

client.watchContractEvent({
  address: governorAddress,
  abi: [voteCastEvent],
  eventName: "VoteCast",
  fromBlock: BigInt(store.lastBlock),
  onLogs: (logs) => {
    for (const log of logs) {
      const args = log.args;
      const entry = {
        proposalId: args.proposalId?.toString(),
        voter: args.voter,
        support: args.support,
        weight: args.weight?.toString(),
        blockNumber: log.blockNumber?.toString(),
        txHash: log.transactionHash,
      };
      store.votes.push(entry);
      if (log.blockNumber && log.blockNumber > BigInt(store.lastBlock)) {
        store.lastBlock = log.blockNumber.toString();
      }
      console.log("[VoteCast]", entry.proposalId, entry.voter, entry.support);
    }
    saveStore(store);
  },
  onError: (err) => console.error("VoteCast watch error", err.message),
});
