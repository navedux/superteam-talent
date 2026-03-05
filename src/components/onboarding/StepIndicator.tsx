import { cn } from '@/lib/cn'
import { RiCheckLine } from '@remixicon/react'
import type { StepConfig } from '@/types/onboarding'

interface StepIndicatorProps {
  steps: readonly StepConfig[]
  currentStep: number
  completedSteps: Set<number>
  onStepClick: (step: number) => void
}

export function StepIndicator({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-8">
      {steps.map((step) => {
        const isActive = step.id === currentStep
        const isCompleted = completedSteps.has(step.id)
        const isReachable = isActive || isCompleted

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            disabled={!isReachable}
            className={cn(
              'flex flex-col gap-1 text-left pr-6 border-r-2 transition-colors',
              isActive
                ? 'border-brand cursor-pointer'
                : isCompleted
                  ? 'border-success cursor-pointer'
                  : 'border-transparent cursor-not-allowed opacity-50'
            )}
          >
            <span
              className={cn(
                'text-sm font-medium tracking-[-0.084px] flex items-center gap-2',
                isActive ? 'text-brand' : isCompleted ? 'text-success' : 'text-text-muted'
              )}
            >
              {isCompleted && <RiCheckLine size={14} />}
              {step.label}
            </span>
            <span
              className={cn(
                'text-sm font-medium',
                isActive ? 'text-text-primary' : isCompleted ? 'text-text-secondary' : 'text-text-muted'
              )}
            >
              {step.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}
