import { ReactNode } from 'react';
import { AuthSidebar } from '@/components/auth/AuthSidebar';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Features (Desktop Only) */}
      <AuthSidebar />

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on mobile/tablet) */}
          <div className="lg:hidden text-center mb-8" onClick={()=>navigate('/')}>
            <img 
              src="/images/brand-green.png" 
              alt="Rapid Reportz" 
              className="h-16 mx-auto mb-4 cursor-pointer"
            />
            {/* <h1 className="text-2xl font-bold text-gray-900">
              Rapid Reportz
            </h1> */}
          </div>

          {/* Auth Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
};
