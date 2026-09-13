#!/usr/bin/env node
/**
 * Copies Foundry ABIs into the frontend package.
 * Run from repo: `node dapp/scripts/sync-abis.mjs` or `pnpm --filter @mini-dao/frontend sync:abis`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractsOut = path.join(__dirname, "..", "contracts", "out");
const dest = path.join(__dirname, "..", "frontend", "src", "abis");

fs.mkdirSync(dest, { recursive: true });

const names = ["DaoGovernor", "GovernanceToken", "CommunityTreasury"];
for (const name of names) {
  const artifactPath = path.join(contractsOut, `${name}.sol`, `${name}.json`);
  if (!fs.existsSync(artifactPath)) {
    console.error(`Missing artifact: ${artifactPath}. Run forge build first.`);
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  fs.writeFileSync(path.join(dest, `${name}.json`), JSON.stringify({ abi: artifact.abi }, null, 2));
  console.log(`synced ${name}`);
}
