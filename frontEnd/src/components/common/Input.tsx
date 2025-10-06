import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  glass?: boolean;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, glass = false, className, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={clsx(
            'block text-sm font-medium mb-2',
            glass ? 'text-white' : 'text-neutral-700'
          )}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-3 rounded-lg text-base transition-all duration-200',
              glass
                ? 'glass-input'
                : 'border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10',
              rightIcon && 'pr-12', // Add right padding for icon
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className={clsx(
            'mt-1 text-sm',
            glass ? 'text-white/70' : 'text-neutral-500'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
