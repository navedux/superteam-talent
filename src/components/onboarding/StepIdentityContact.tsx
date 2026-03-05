import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RiMailLine, RiAtLine, RiUserLine, RiLockLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react'
import type { IdentityContactData } from '@/types/onboarding'

interface StepProps {
  data: IdentityContactData
  onUpdate: (data: IdentityContactData) => void
}

const countryOptions = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'germany', label: 'Germany' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'turkey', label: 'Turkey' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'other', label: 'Other' },
]

export function StepIdentityContact({ data, onUpdate }: StepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const update = (field: keyof IdentityContactData, value: string) => {
    onUpdate({ ...data, [field]: value })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-medium text-text-primary leading-[1.333]">
          Let's start with the basics
        </h2>
        <p className="text-base text-text-secondary tracking-[-0.176px] leading-relaxed">
          Tell us about yourself so companies can find and contact you
        </p>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Full Name"
          required
          placeholder="John Doe"
          value={data.fullName}
          onChange={e => update('fullName', e.target.value)}
          icon={<RiUserLine size={20} />}
        />
        <Input
          label="Email"
          required
          placeholder="hello@example.com"
          type="email"
          value={data.email}
          onChange={e => update('email', e.target.value)}
          icon={<RiMailLine size={20} />}
        />
        <Input
          label="Set Password"
          required
          placeholder="Min. 8 characters"
          type={showPassword ? 'text' : 'password'}
          value={data.password}
          onChange={e => update('password', e.target.value)}
          icon={<RiLockLine size={20} />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-muted hover:text-text-primary transition-colors">
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          }
        />
        <Input
          label="Telegram Handle"
          required
          placeholder="@username"
          value={data.telegramHandle}
          onChange={e => update('telegramHandle', e.target.value)}
          icon={<RiAtLine size={20} />}
        />
        <div className="col-span-2">
          <Select
            label="Based In"
            required
            placeholder="Select your country"
            options={countryOptions}
            value={data.basedIn}
            onChange={e => update('basedIn', e.target.value)}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-2xl font-medium text-text-primary">Social Links</h3>
        <p className="text-base text-text-secondary tracking-[-0.176px]">
          Add your professional profiles to enhance your visibility
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Twitter (X) Handle"
          optional
          placeholder="@username"
          value={data.twitterHandle}
          onChange={e => update('twitterHandle', e.target.value)}
          icon={<RiAtLine size={20} />}
        />
        <Input
          label="LinkedIn Profile"
          optional
          placeholder="linkedin.com/in/username"
          value={data.linkedinProfile}
          onChange={e => update('linkedinProfile', e.target.value)}
          icon={<RiAtLine size={20} />}
        />
        <Input
          label="GitHub Profile"
          required
          placeholder="github.com/username"
          value={data.githubProfile}
          onChange={e => update('githubProfile', e.target.value)}
          icon={<RiAtLine size={20} />}
        />
        <Input
          label="Superteam Earn Profile"
          optional
          placeholder="earn.superteam.fun/@username"
          value={data.superteamEarnProfile}
          onChange={e => update('superteamEarnProfile', e.target.value)}
          icon={<RiAtLine size={20} />}
        />
      </div>
    </div>
  )
}
