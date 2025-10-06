import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { STEPS } from '@/utils/constants';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export const StepIndicator = () => {
  const { currentStep, completedSteps } = useSelector((state: RootState) => state.stepper);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                    isActive &&
                      'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40 scale-110',
                    isCompleted && !isActive && 'bg-accent-green text-white',
                    !isActive && !isCompleted && 'bg-white/20 border-2 border-neutral-300 text-neutral-500'
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={clsx(
                    'mt-2 text-xs font-medium text-center max-w-[80px]',
                    isActive ? 'text-primary-600' : 'text-neutral-600'
                  )}
                >
                  {step.name}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mb-6">
                  <div
                    className={clsx(
                      'h-full transition-all duration-300',
                      isCompleted ? 'bg-accent-green' : 'bg-neutral-300'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
