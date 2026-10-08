/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
    on?: (event: string, handler: (...args: any[]) => void) => void;
    removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  };
}

interface ImportMetaEnv {
  readonly VITE_RPC_URL?: string;
  readonly VITE_SIMPLE_VOTE_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
