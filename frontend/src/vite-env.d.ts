/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_API_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_CONTACT_PHONE_FORMATTED: string;
  readonly VITE_CONTACT_ADDRESS: string;
  readonly VITE_GOOGLE_MAPS_KEY: string;
  readonly VITE_POSTHOG_KEY: string;
  readonly VITE_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
