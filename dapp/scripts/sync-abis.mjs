import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "packages", "contracts", "out");
const destDir = join(root, "packages", "webapp", "src", "abis");

mkdirSync(destDir, { recursive: true });

const contracts = ["GovernanceToken", "DaoGovernor", "CommunityTreasury", "SimpleProposalVote"];

for (const name of contracts) {
  const artifactPath = join(outDir, `${name}.sol`, `${name}.json`);
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  writeFileSync(join(destDir, `${name}.json`), JSON.stringify({ abi: artifact.abi }, null, 2) + "\n");
  console.log(`synced ${name}`);
}
