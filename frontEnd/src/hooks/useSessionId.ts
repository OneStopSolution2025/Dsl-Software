import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const { sessionId } = useSelector((state: RootState) => state.session);

// Custom hook to get session ID
export const useSessionId = () => {
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  return sessionId;
};

// Utility function to get session ID for API calls
export const getSessionIdForApi = (): string | null => {
  if (typeof window !== 'undefined') {
    // Try Redux state first, then fallback to sessionStorage
    try {
      // This would need to be used within a React component or with store.getState()
      return sessionStorage.getItem('userSessionId');
    } catch {
      return sessionStorage.getItem('userSessionId');
    }
  }
  return null;
};

// Helper function to include session ID in API requests
export const createApiHeaders = (additionalHeaders?: Record<string, string>) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(sessionId && { 'X-Session-ID': sessionId }),
    ...additionalHeaders,
  };

  return headers;
};

// Example API call with session ID
export const apiCallWithSession = async (url: string, options?: RequestInit) => {
  const headers = createApiHeaders(options?.headers as Record<string, string>);

  return fetch(url, {
    ...options,
    headers,
  });
};
