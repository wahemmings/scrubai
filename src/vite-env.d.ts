
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_FUNCTIONS_URL?: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_API_KEY?: string;
  readonly VITE_ENABLE_CLOUDINARY?: string;
  readonly VITE_ENABLE_WASM_PROCESSING?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_POSTHOG_API_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
