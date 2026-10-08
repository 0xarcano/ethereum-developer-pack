import { createPublicClient, http, type PublicClient } from "viem";
import { anvilChain } from "./chains";

export const publicClient: PublicClient = createPublicClient({
  chain: anvilChain,
  transport: http(),
});
