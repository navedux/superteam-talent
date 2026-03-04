import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { RiGlobalLine } from '@remixicon/react'
import type { CommunityData } from '@/types/onboarding'

interface StepProps {
  data: CommunityData
  onUpdate: (data: CommunityData) => void
}

const chapterOptions = [
  { value: 'india', label: 'India' },
  { value: 'turkey', label: 'Turkey' },
  { value: 'germany', label: 'Germany' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'philippines', label: 'Philippines' },
  { value: 'none', label: 'Not a member' },
]

const referralOptions = [
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'friend', label: 'Friend / Referral' },
  { value: 'superteam', label: 'Superteam Community' },
  { value: 'discord', label: 'Discord' },
  { value: 'event', label: 'Event / Hackathon' },
  { value: 'search', label: 'Google Search' },
  { value: 'other', label: 'Other' },
]

export function StepCommunity({ data, onUpdate }: StepProps) {
  const update = (field: keyof CommunityData, value: string | boolean) => {
    onUpdate({ ...data, [field]: value })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-medium text-text-primary leading-[1.333]">
          Community
        </h2>
        <p className="text-base text-text-secondary tracking-[-0.176px] leading-relaxed">
          Tell us about your connection to the Solana community
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Checkbox
          label="I am a Superteam member"
          checked={data.superteamMember}
          onChange={e => update('superteamMember', e.target.checked)}
        />

        <Select
          label="Local Chapter"
          optional
          placeholder="Select your local chapter"
          options={chapterOptions}
          value={data.localChapter}
          onChange={e => update('localChapter', e.target.value)}
        />

        <Select
          label="How did you hear about us?"
          optional
          placeholder="Select referral source"
          options={referralOptions}
          value={data.referralSource}
          onChange={e => update('referralSource', e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-primary tracking-[-0.084px]">
            Bio <span className="text-text-secondary font-normal">(Optional)</span>
          </label>
          <textarea
            placeholder="Tell us about yourself and your interest in Solana..."
            value={data.bio}
            onChange={e => update('bio', e.target.value)}
            rows={4}
            className="w-full bg-bg-input border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted shadow-input tracking-[-0.084px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors duration-150 resize-none font-body"
          />
        </div>

        <Input
          label="Website"
          optional
          placeholder="https://yoursite.com"
          value=""
          icon={<RiGlobalLine size={20} />}
          readOnly
        />
      </div>
    </div>
  )
}
