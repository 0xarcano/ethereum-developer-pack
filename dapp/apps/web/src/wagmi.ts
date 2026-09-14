import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { anvil } from "wagmi/chains";

export const config = createConfig({
  chains: [anvil],
  connectors: [injected()],
  transports: {
    [anvil.id]: http(import.meta.env.VITE_RPC_URL ?? "http://127.0.0.1:8545"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
