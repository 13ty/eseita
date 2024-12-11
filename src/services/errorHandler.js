import * as Sentry from "@sentry/react";

    export const initErrorReporting = () => {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [new Sentry.BrowserTracing()],
        tracesSampleRate: 1.0,
        environment: import.meta.env.MODE
      });
    };

    export const logError = (error, context = {}) => {
      Sentry.withScope((scope) => {
        Object.keys(context).forEach((key) => {
          scope.setTag(key, context[key]);
        });
        Sentry.captureException(error);
      });
    };
