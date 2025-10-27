import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}
export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center space-x-2 relative">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-lg font-bold transition-colors duration-300',
              {
                // Active step: transparent background, text color for magic
                'bg-transparent text-magic-foreground': index === currentStep,
                // Completed step: solid background and contrasting text
                'bg-primary text-primary-foreground': index < currentStep,
                // Future step: bordered with standard text color
                'bg-background border-2 border-ink text-ink': index > currentStep,
              }
            )}
          >
            {index === currentStep && (
              <motion.div
                layoutId="step-indicator-active"
                className="absolute inset-0 rounded-full bg-magic"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{index + 1}</span>
          </div>
          <span
            className={cn(
              'hidden md:block font-display text-xl transition-colors duration-300 relative z-10',
              index === currentStep ? 'text-primary font-bold pr-4' : 'text-ink'
            )}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}