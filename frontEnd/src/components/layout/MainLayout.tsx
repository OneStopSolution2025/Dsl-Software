import { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-screen md:w-[90vw] mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
