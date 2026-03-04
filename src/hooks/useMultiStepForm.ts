import { useState, useCallback } from 'react'

interface UseMultiStepFormOptions<T> {
  totalSteps: number
  initialData: T
}

export function useMultiStepForm<T extends Record<string, unknown>>({
  totalSteps,
  initialData,
}: UseMultiStepFormOptions<T>) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<T>(initialData)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const updateStepData = useCallback(<K extends keyof T>(key: K, data: T[K]) => {
    setFormData(prev => ({ ...prev, [key]: data }))
  }, [])

  const goToNext = useCallback(() => {
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  }, [currentStep, totalSteps])

  const goToPrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) setCurrentStep(step)
  }, [totalSteps])

  return {
    currentStep,
    formData,
    completedSteps,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    progress: ((currentStep - 1) / (totalSteps - 1)) * 100,
    updateStepData,
    goToNext,
    goToPrevious,
    goToStep,
  }
}
