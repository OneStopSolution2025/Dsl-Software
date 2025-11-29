import { useMemo } from 'react';
import clsx from 'clsx';

interface PasswordStrengthMeterProps {
  password: string;
}

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'excellent';

interface StrengthConfig {
  label: string;
  color: string;
  bars: number;
  textColor: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = useMemo(() => {
    if (!password) return null;

    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let level: StrengthLevel;
    if (score <= 2) level = 'weak';
    else if (score <= 4) level = 'medium';
    else if (score <= 5) level = 'strong';
    else level = 'excellent';

    return { level, score };
  }, [password]);

  if (!strength) return null;

  const strengthConfig: Record<StrengthLevel, StrengthConfig> = {
    weak: {
      label: 'Weak password',
      color: 'bg-red-500',
      bars: 1,
      textColor: 'text-red-600',
    },
    medium: {
      label: 'Medium strength',
      color: 'bg-amber-500',
      bars: 3,
      textColor: 'text-amber-600',
    },
    strong: {
      label: 'Strong password',
      color: 'bg-emerald-500',
      bars: 4,
      textColor: 'text-emerald-600',
    },
    excellent: {
      label: 'Excellent!',
      color: 'bg-teal-500',
      bars: 5,
      textColor: 'text-teal-600',
    },
  };

  const config = strengthConfig[strength.level];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bars */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className={clsx(
              'h-1 flex-1 rounded-full transition-all duration-300',
              bar <= config.bars ? config.color : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Strength label */}
      <p className={clsx('text-xs font-medium', config.textColor)}>
        {config.label}
      </p>

      {/* Tips for improvement */}
      {strength.level !== 'excellent' && (
        <ul className="text-xs text-gray-500 space-y-1">
          {password.length < 8 && <li>• Use at least 8 characters</li>}
          {!/[A-Z]/.test(password) && <li>• Add uppercase letters</li>}
          {!/[0-9]/.test(password) && <li>• Include numbers</li>}
          {!/[^a-zA-Z0-9]/.test(password) && <li>• Add special characters (!@#$%)</li>}
        </ul>
      )}
    </div>
  );
};
