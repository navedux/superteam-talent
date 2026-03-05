import { useState, useCallback, useRef } from 'react'

interface UseMultiStepFormOptions<T> {
  totalSteps: number
  initialData: T
  validate?: (step: number, data: T) => Record<string, string>
}

export function useMultiStepForm<T extends Record<string, unknown>>({
  totalSteps,
  initialData,
  validate,
}: UseMultiStepFormOptions<T>) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<T>(initialData)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const initialDataRef = useRef(initialData)

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialDataRef.current)

  const updateStepData = useCallback(<K extends keyof T>(key: K, data: T[K]) => {
    setFormData(prev => ({ ...prev, [key]: data }))
    setErrors({})
  }, [])

  const validateCurrentStep = useCallback(() => {
    if (!validate) return true
    const stepErrors = validate(currentStep, formData as T)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return false
    }
    setErrors({})
    return true
  }, [currentStep, validate, formData])

  const goToNext = useCallback(() => {
    if (validate) {
      const stepErrors = validate(currentStep, formData as T)
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors)
        return false
      }
    }
    setErrors({})
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    return true
  }, [currentStep, totalSteps, validate, formData])

  const goToPrevious = useCallback(() => {
    setErrors({})
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    if (step < 1 || step > totalSteps) return
    // Only allow completed steps or current step
    if (completedSteps.has(step) || step === currentStep) {
      setErrors({})
      setCurrentStep(step)
    }
  }, [totalSteps, completedSteps, currentStep])

  return {
    currentStep,
    formData,
    completedSteps,
    errors,
    isDirty,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    progress: ((currentStep - 1) / (totalSteps - 1)) * 100,
    updateStepData,
    validateCurrentStep,
    goToNext,
    goToPrevious,
    goToStep,
  }
}
