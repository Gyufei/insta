// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

// Use environment variable for DSN to allow switching Sentry accounts without code changes.
// In the browser, only variables prefixed with NEXT_PUBLIC_ are available.
const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://d76f76cf9282d4721587388fba6c0840@o4508368229498880.ingest.de.sentry.io/4508368267378768';

Sentry.init({
  dsn: SENTRY_DSN,

  // Disable Sentry reporting in local development
  enabled: process.env.NODE_ENV === 'production',
  // enabled: true,

  // Add optional integrations for additional features
  // integrations: [Sentry.replayIntegration()],
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
