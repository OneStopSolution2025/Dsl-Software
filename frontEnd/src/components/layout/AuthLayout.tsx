import { ReactNode } from 'react';
import { Building2 } from 'lucide-react';
import { APP_NAME } from '@/utils/constants';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Building2 className="h-12 w-12 text-white" />
            <h1 className="text-4xl font-bold text-white">{APP_NAME}</h1>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};
