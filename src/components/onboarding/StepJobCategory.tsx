import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RiBriefcaseLine } from '@remixicon/react'
import type { JobCategoryData } from '@/types/onboarding'

interface StepProps {
  data: JobCategoryData
  errors?: Record<string, string>
  onUpdate: (data: JobCategoryData) => void
}

const roleOptions = [
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'smart-contract', label: 'Smart Contract Developer' },
  { value: 'design', label: 'UI/UX Designer' },
  { value: 'product', label: 'Product Manager' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'community', label: 'Community Manager' },
  { value: 'content', label: 'Content Creator' },
  { value: 'other', label: 'Other' },
]

const experienceOptions = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
]

export function StepJobCategory({ data, errors = {}, onUpdate }: StepProps) {
  const update = (field: keyof JobCategoryData, value: string | string[]) => {
    onUpdate({ ...data, [field]: value })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-medium text-text-primary leading-[1.333]">
          What do you do?
        </h2>
        <p className="text-base text-text-secondary tracking-[-0.176px] leading-relaxed">
          Help us match you with the right opportunities
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Select
          label="Primary Role"
          required
          placeholder="Select your primary role"
          options={roleOptions}
          value={data.primaryRole}
          onChange={e => update('primaryRole', e.target.value)}
          error={errors.primaryRole}
        />
        <Select
          label="Secondary Role"
          optional
          placeholder="Select a secondary role"
          options={roleOptions}
          value={data.secondaryRole}
          onChange={e => update('secondaryRole', e.target.value)}
        />
        <Input
          label="Skills"
          required
          placeholder="e.g. React, Solana, Rust (comma separated)"
          value={data.skills.join(', ')}
          onChange={e => update('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          icon={<RiBriefcaseLine size={20} />}
          error={errors.skills}
        />
        <Select
          label="Years of Experience"
          required
          placeholder="Select experience range"
          options={experienceOptions}
          value={data.yearsOfExperience}
          onChange={e => update('yearsOfExperience', e.target.value)}
          error={errors.yearsOfExperience}
        />
      </div>
    </div>
  )
}
