export const OBSERVABILITY = {
  sentryDsn: import.meta.env.VITE_SENTRY_DSN?.trim() || null,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
} as const
