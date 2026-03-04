import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { RiHeadphoneLine, RiCloseLine } from '@remixicon/react'
import { Button } from '@/components/ui/Button'
import type { StepConfig } from '@/types/onboarding'

interface OnboardingSidebarProps {
  steps: readonly StepConfig[]
  currentStep: number
  completedSteps: Set<number>
  onStepClick: (step: number) => void
}

export function OnboardingSidebar({ steps, currentStep, completedSteps, onStepClick }: OnboardingSidebarProps) {
  return (
    <div className="hidden lg:flex w-[300px] h-screen flex-col gap-12 pt-3 pb-3 pl-3 shrink-0">
      {/* Logo */}
      <div className="pt-1.5 pl-1.5">
        <img src="/ST_LOGO.webp" alt="Superteam Talent" className="h-5" />
      </div>

      {/* Steps */}
      <div className="flex-1 pr-0.5">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={onStepClick}
        />
      </div>

      {/* Support Card */}
      <div className="bg-bg-card p-3 mx-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RiHeadphoneLine size={20} className="text-text-primary" />
            <span className="text-base font-medium text-text-primary">Complete your profile</span>
          </div>
          <Button variant="ghost" size="icon-sm">
            <RiCloseLine size={16} />
          </Button>
        </div>
        <p className="text-sm text-text-secondary">
          Profiles with 100% completion get 3x more visibility
        </p>
      </div>
    </div>
  )
}
