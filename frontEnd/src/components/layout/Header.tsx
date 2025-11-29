import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { useIdleTimer } from '@/hooks/useIdleTimer';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, handleLogout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  useIdleTimer();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 h-16">
      <div className="container flex items-center h-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/')}
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
    </header>
  );
};
