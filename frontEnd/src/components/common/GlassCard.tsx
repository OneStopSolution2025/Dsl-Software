import { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}

export const GlassCard = ({ children, className, strong = false }: GlassCardProps) => {
  return (
    <div
      className={clsx(
        strong ? 'glass-card-strong' : 'glass-card',
        className
      )}
    >
      {children}
    </div>
  );
};
