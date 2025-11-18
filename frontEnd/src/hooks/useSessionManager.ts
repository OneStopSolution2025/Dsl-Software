import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {  clearSession, initializeSession } from '@/store/slices/sessionSlice';
import { clearFiles } from '@/store/slices/filesSlice';

export const useSessionManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize or restore session on mount (login or page refresh)
    dispatch(initializeSession());

    // Note: We DON'T clear session on beforeunload/unload anymore
    // sessionStorage automatically clears when ALL tabs are closed
    // This allows the session to persist across page refreshes
    
    // Only clear on component unmount (app logout)
    return () => {
      // Cleanup happens naturally when user logs out via handleLogout in useAuth
    };
  }, [dispatch]);

  return {
    clearSession: () => {
      dispatch(clearSession());
      dispatch(clearFiles());
    },
  };
};
