import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {  clearSession, initializeSession } from '@/store/slices/sessionSlice';
import { clearFiles } from '@/store/slices/filesSlice';

export const useSessionManager = () => {
  const dispatch = useDispatch();
  

  useEffect(() => {

    // Initialize session if none exists
    dispatch(initializeSession());

    // Handle tab close/logout cleanup
    const handleBeforeUnload = () => {
      // Clear session when tab is closed
      dispatch(clearSession());
      dispatch(clearFiles());
    };

    const handleUnload = () => {
      // Additional cleanup if needed
      dispatch(clearSession());
      dispatch(clearFiles());
    };

    // Add event listeners for cleanup
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [dispatch]);
};
