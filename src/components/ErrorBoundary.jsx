import React from 'react';
    import { ErrorBoundary } from 'react-error-boundary';
    import { logError } from '../services/errorHandler';

    function ErrorFallback({ error, resetErrorBoundary }) {
      return (
        <div role="alert">
          <p>Something went wrong:</p>
          <pre>{error.message}</pre>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      );
    }

    export function AppErrorBoundary({ children }) {
      const handleError = (error, info) => {
        logError(error, { 
          component: info.componentStack 
        });
      };

      return (
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onError={handleError}
        >
          {children}
        </ErrorBoundary>
      );
    }
