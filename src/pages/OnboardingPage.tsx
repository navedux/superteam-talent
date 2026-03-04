import { useNavigate } from 'react-router'
import { RiCloseLine } from '@remixicon/react'
import { useMultiStepForm } from '@/hooks/useMultiStepForm'
import { OnboardingSidebar } from '@/components/layout/OnboardingSidebar'
import { StepIdentityContact } from '@/components/onboarding/StepIdentityContact'
import { StepJobCategory } from '@/components/onboarding/StepJobCategory'
import { StepMarketStatus } from '@/components/onboarding/StepMarketStatus'
import { StepContributions } from '@/components/onboarding/StepContributions'
import { StepCommunity } from '@/components/onboarding/StepCommunity'
import { Button } from '@/components/ui/Button'
import { ONBOARDING_STEPS, ROUTES, API_ENDPOINTS } from '@/lib/constants'
import type { OnboardingData } from '@/types/onboarding'

const initialData: OnboardingData = {
  identityContact: {
    fullName: '',
    email: '',
    telegramHandle: '',
    basedIn: '',
    twitterHandle: '',
    linkedinProfile: '',
    githubProfile: '',
    superteamEarnProfile: '',
  },
  jobCategory: {
    primaryRole: '',
    secondaryRole: '',
    skills: [],
    yearsOfExperience: '',
  },
  marketStatus: {
    availability: '',
    jobType: '',
    compensationRange: '',
    startDate: '',
  },
  contributions: {
    projects: [],
    bounties: [],
    portfolioUrl: '',
    description: '',
  },
  community: {
    superteamMember: false,
    localChapter: '',
    referralSource: '',
    bio: '',
  },
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const {
    currentStep,
    formData,
    completedSteps,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    goToStep,
    updateStepData,
  } = useMultiStepForm<OnboardingData>({ totalSteps: 5, initialData })

  const handleSubmit = async () => {
    try {
      await fetch(API_ENDPOINTS.ONBOARDING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } catch (err) {
      console.error('Onboarding submission failed:', err)
    }
    navigate(ROUTES.HOME)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepIdentityContact
            data={formData.identityContact}
            onUpdate={d => updateStepData('identityContact', d)}
          />
        )
      case 2:
        return (
          <StepJobCategory
            data={formData.jobCategory}
            onUpdate={d => updateStepData('jobCategory', d)}
          />
        )
      case 3:
        return (
          <StepMarketStatus
            data={formData.marketStatus}
            onUpdate={d => updateStepData('marketStatus', d)}
          />
        )
      case 4:
        return (
          <StepContributions
            data={formData.contributions}
            onUpdate={d => updateStepData('contributions', d)}
          />
        )
      case 5:
        return (
          <StepCommunity
            data={formData.community}
            onUpdate={d => updateStepData('community', d)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-bg-primary p-0 lg:p-3">
      {/* Sidebar */}
      <OnboardingSidebar
        steps={ONBOARDING_STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(ROUTES.HOME)}
        className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10"
      >
        <RiCloseLine size={18} />
      </Button>

      {/* Main Content */}
      <div className="flex-1 bg-bg-secondary overflow-y-auto">
        {/* Mobile header */}
        <div className="flex items-center p-4 lg:hidden">
          <img src="/ST_LOGO.webp" alt="Superteam Talent" className="h-4" />
          <span className="ml-3 text-xs text-text-muted">Step {currentStep} of 5</span>
        </div>
        <div className="py-4 lg:py-8 px-4 md:px-8 lg:px-[180px] xl:px-[240px] flex flex-col gap-4 lg:gap-6">
          {/* Step Content */}
          <div>
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col items-end justify-center gap-3 pb-8 lg:pb-4">
            {!isFirstStep && (
              <Button variant="secondary" size="lg" fullWidth onClick={goToPrevious}>
                Back
              </Button>
            )}
            <Button
              size="lg"
              onClick={isLastStep ? handleSubmit : goToNext}
              fullWidth
            >
              {isLastStep ? 'Complete Setup' : `Continue to Step ${currentStep + 1}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
