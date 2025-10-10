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
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
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
