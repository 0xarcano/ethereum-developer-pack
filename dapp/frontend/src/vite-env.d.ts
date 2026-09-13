/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOKEN_ADDRESS: string;
  readonly VITE_TREASURY_ADDRESS: string;
  readonly VITE_GOVERNOR_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
