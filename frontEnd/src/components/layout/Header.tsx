import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { resetState } from '@/store';

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, handleLogout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Get state to check if there's any data
  const { uploadedFiles, serverFileIds } = useSelector((state: RootState) => state.files);
  const { currentStep } = useSelector((state: RootState) => state.stepper);
  const { markers } = useSelector((state: RootState) => state.markers);
  const { data, images } = useSelector((state: RootState) => state.form);

  useIdleTimer();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasActiveData = () => {
    return (
      uploadedFiles.length > 0 ||
      serverFileIds.length > 0 ||
      currentStep > 1 ||
      markers.length > 0 ||
      (data && Object.keys(data).length > 0) ||
      Object.keys(images).length > 0
    );
  };

  const handleLogoClick = () => {
    if (hasActiveData()) {
      setShowResetDialog(true);
    } else {
      navigate('/');
    }
  };

  const handleConfirmReset = () => {
    // Reset all state except auth
    dispatch(resetState());
    setShowResetDialog(false);
    navigate('/');
  };

  const handleCancelReset = () => {
    setShowResetDialog(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 h-16">
      <div className="container flex items-center h-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleLogoClick}
          >
            <img 
              src="/images/brand-green.png" 
              alt="Rapid Reportz" 
              className="h-10 w-auto"
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:bg-teal-700 transition-colors">
                    {getInitials(user.username)}
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </span>
                    <span className="text-xs text-gray-500">View Profile</span>
                  </div>
                  <svg 
                    className="hidden md:block h-4 w-4 text-gray-400 group-hover:text-gray-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Manage your account</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            // Add profile navigation here if needed
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <User className="h-4 w-4 text-gray-400" />
                          <span>My Profile</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg 
                    className="h-6 w-6 text-amber-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Are you sure?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Your modified data will be deleted and it will start from the first step.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleCancelReset}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmReset}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Yes, Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
