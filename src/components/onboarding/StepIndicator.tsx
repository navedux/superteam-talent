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
    <div className="flex flex-col gap-8" /* Pencil: gap 32 between step items */>
      {steps.map((step) => {
        const isActive = step.id === currentStep
        const isCompleted = completedSteps.has(step.id)

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              'flex flex-col gap-1 text-left pr-6 border-r-2 transition-colors cursor-pointer',
              isActive
                ? 'border-brand'
                : isCompleted
                  ? 'border-success'
                  : 'border-transparent'
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
                isActive ? 'text-text-primary' : 'text-text-secondary'
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
