import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseLine } from '@remixicon/react'
import { useMultiStepForm } from '@/hooks/useMultiStepForm'
import { OnboardingSidebar } from '@/components/layout/OnboardingSidebar'
import { StepIdentityContact } from '@/components/onboarding/StepIdentityContact'
import { StepJobCategory } from '@/components/onboarding/StepJobCategory'
import { StepMarketStatus } from '@/components/onboarding/StepMarketStatus'
import { StepContributions } from '@/components/onboarding/StepContributions'
import { StepCommunity } from '@/components/onboarding/StepCommunity'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ONBOARDING_STEPS, ROUTES, API_ENDPOINTS } from '@/lib/constants'
import { fadeUp, DURATION, EASE_OUT } from '@/lib/motion'
import type { OnboardingData } from '@/types/onboarding'

const initialData: OnboardingData = {
  identityContact: {
    fullName: '',
    email: '',
    password: '',
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
  },
  contributions: {
    projects: [],
    bounties: [],
    portfolioUrl: '',
    description: '',
  },
  community: {
    walletAddress: '',
    detectedCommunities: [],
    referralSource: '',
    bio: '',
  },
}

function validateStep(step: number, data: OnboardingData): Record<string, string> {
  switch (step) {
    case 1: {
      const d = data.identityContact
      const errors: Record<string, string> = {}
      if (!d.fullName.trim()) errors.fullName = 'Full name is required'
      if (!d.email.trim()) errors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(d.email)) errors.email = 'Enter a valid email address'
      if (!d.password) errors.password = 'Password is required'
      else if (d.password.length < 8) errors.password = 'Must be at least 8 characters'
      if (!d.telegramHandle.trim()) errors.telegramHandle = 'Telegram handle is required'
      if (!d.basedIn) errors.basedIn = 'Please select your country'
      if (!d.githubProfile.trim()) errors.githubProfile = 'GitHub profile is required'
      return errors
    }
    case 2: {
      const d = data.jobCategory
      const errors: Record<string, string> = {}
      if (!d.primaryRole) errors.primaryRole = 'Please select a primary role'
      if (d.skills.length === 0) errors.skills = 'Add at least one skill'
      if (!d.yearsOfExperience) errors.yearsOfExperience = 'Please select experience level'
      return errors
    }
    case 3: {
      const d = data.marketStatus
      const errors: Record<string, string> = {}
      if (!d.availability) errors.availability = 'Please select your availability'
      if (!d.jobType) errors.jobType = 'Please select a job type'
      if (!d.compensationRange) errors.compensationRange = 'Please select a range'
      return errors
    }
    case 4:
      return {}
    case 5: {
      const d = data.community
      const errors: Record<string, string> = {}
      if (!d.walletAddress.trim()) errors.walletAddress = 'Wallet address is required'
      return errors
    }
    default:
      return {}
  }
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const {
    currentStep,
    formData,
    completedSteps,
    errors,
    isDirty,
    isFirstStep,
    isLastStep,
    progress,
    goToNext,
    goToPrevious,
    goToStep,
    updateStepData,
    validateCurrentStep,
  } = useMultiStepForm<OnboardingData>({ totalSteps: 5, initialData, validate: validateStep })

  const handleClose = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) return
    }
    navigate(ROUTES.HOME)
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(API_ENDPOINTS.ONBOARDING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Submission failed')
      navigate(ROUTES.HOME)
    } catch (err) {
      console.error('Onboarding submission failed:', err)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepIdentityContact
            data={formData.identityContact}
            errors={errors}
            onUpdate={d => updateStepData('identityContact', d)}
          />
        )
      case 2:
        return (
          <StepJobCategory
            data={formData.jobCategory}
            errors={errors}
            onUpdate={d => updateStepData('jobCategory', d)}
          />
        )
      case 3:
        return (
          <StepMarketStatus
            data={formData.marketStatus}
            errors={errors}
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
            errors={errors}
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
        onClick={handleClose}
        className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10"
      >
        <RiCloseLine size={18} />
      </Button>

      {/* Main Content */}
      <div className="flex-1 bg-bg-secondary overflow-y-auto">
        {/* Mobile header */}
        <div className="flex flex-col gap-3 p-4 lg:hidden">
          <div className="flex items-center">
            <img src="/ST_LOGO.webp" alt="Superteam Talent" className="h-4" />
            <span className="ml-3 text-xs text-text-muted">Step {currentStep} of 5</span>
          </div>
          <ProgressBar value={progress} size="sm" />
        </div>
        <div className="py-4 lg:py-8 px-4 md:px-8 lg:px-[180px] xl:px-[240px] flex flex-col gap-4 lg:gap-6">
          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: DURATION.fast, ease: EASE_OUT } }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Submit Error */}
          {submitError && (
            <p className="text-sm text-error text-center">{submitError}</p>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col items-end justify-center gap-3 pb-8 lg:pb-4">
            {!isFirstStep && (
              <Button variant="secondary" fullWidth onClick={goToPrevious}>
                Back
              </Button>
            )}
            <Button
              onClick={isLastStep ? handleSubmit : goToNext}
              fullWidth
              isLoading={isSubmitting}
            >
              {isLastStep ? 'Complete Setup' : `Continue to Step ${currentStep + 1}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
