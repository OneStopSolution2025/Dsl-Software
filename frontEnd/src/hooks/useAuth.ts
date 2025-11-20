import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import {
  fetchUserProfileStart,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
  logout,
} from '@/store/slices/authSlice';
import { resetStepper } from '@/store/slices/stepperSlice';
import { clearFiles } from '@/store/slices/filesSlice';
import { clearSession } from '@/store/slices/sessionSlice';
import apiService from '@/services/api.service';
import { User } from '@/types/auth.types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, token, user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Fetch user profile when token exists but no user data
  const fetchUserProfile = async () => {
    if (!token) return;

    dispatch(fetchUserProfileStart());

    try {
      const userData = await apiService.auth.getUserProfile();
      dispatch(fetchUserProfileSuccess(userData));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user profile';
      dispatch(fetchUserProfileFailure(message));
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear all app state before logging out
    dispatch(resetStepper());
    dispatch(clearFiles());
    dispatch(clearSession()); // Clear session on logout

    dispatch(logout());
    navigate('/login');
  };

  // Check authentication on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');

    if (storedToken && !user && !loading) {
      // Token exists but no user data, fetch profile
      fetchUserProfile();
    } else if (!storedToken) {
      // No token, redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [token, user, loading, navigate]);

  return {
    isAuthenticated,
    user,
    loading,
    fetchUserProfile,
    handleLogout,
  };
};
