import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { AppRoutes } from '@/routes';
import { useSessionManager } from '@/hooks/useSessionManager';
import { ResetOnPageLoad } from '@/components/common/ResetOnPageLoad';

function AppContent() {
  // Initialize session management within Redux Provider context
  useSessionManager();

  return (
    <>
      <ResetOnPageLoad />
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#065f46',
              border: '1px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#991b1b',
              border: '1px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              background: '#ffffff',
              color: '#0f766e',
              border: '1px solid #14b8a6',
            },
            iconTheme: {
              primary: '#14b8a6',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
