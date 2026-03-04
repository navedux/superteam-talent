import { Select } from '@/components/ui/Select'
import type { MarketStatusData } from '@/types/onboarding'

interface StepProps {
  data: MarketStatusData
  onUpdate: (data: MarketStatusData) => void
}

const availabilityOptions = [
  { value: 'immediately', label: 'Immediately' },
  { value: '2-weeks', label: 'In 2 weeks' },
  { value: '1-month', label: 'In 1 month' },
  { value: '3-months', label: 'In 3 months' },
  { value: 'not-looking', label: 'Not actively looking' },
]

const jobTypeOptions = [
  { value: 'full-time', label: 'Full-Time' },
  { value: 'part-time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'bounty', label: 'Bounty / Freelance' },
  { value: 'any', label: 'Open to anything' },
]

const compensationOptions = [
  { value: '0-50k', label: '$0 - $50k' },
  { value: '50k-100k', label: '$50k - $100k' },
  { value: '100k-150k', label: '$100k - $150k' },
  { value: '150k-200k', label: '$150k - $200k' },
  { value: '200k+', label: '$200k+' },
]

export function StepMarketStatus({ data, onUpdate }: StepProps) {
  const update = (field: keyof MarketStatusData, value: string) => {
    onUpdate({ ...data, [field]: value })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-medium text-text-primary leading-[1.333]">
          Your market status
        </h2>
        <p className="text-base text-text-secondary tracking-[-0.176px] leading-relaxed">
          Let companies know your availability and expectations
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Select
          label="Availability"
          required
          placeholder="When can you start?"
          options={availabilityOptions}
          value={data.availability}
          onChange={e => update('availability', e.target.value)}
        />
        <Select
          label="Preferred Job Type"
          required
          placeholder="What type of work are you looking for?"
          options={jobTypeOptions}
          value={data.jobType}
          onChange={e => update('jobType', e.target.value)}
        />
        <Select
          label="Expected Compensation"
          required
          placeholder="Select your compensation range"
          options={compensationOptions}
          value={data.compensationRange}
          onChange={e => update('compensationRange', e.target.value)}
        />
      </div>
    </div>
  )
}
