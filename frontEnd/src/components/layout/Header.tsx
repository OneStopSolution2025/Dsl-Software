import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { APP_NAME } from '@/utils/constants';
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
    <header className="bg-white border-b border-neutral-200 shadow-sm h-[8vh]">
      <div className="container flex items-center h-full mx-auto px-4">
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-neutral-900">{APP_NAME}</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(user.username)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-neutral-700">
                    {user.username}
                  </span>
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
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
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
