import { defineChain } from "viem";
import { anvil as wagmiAnvil } from "wagmi/chains";

export const anvilChain = defineChain({
  ...wagmiAnvil,
  id: 31337,
  name: "Anvil Localnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
});
