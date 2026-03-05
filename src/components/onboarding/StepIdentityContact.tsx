import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RiMailLine, RiAtLine, RiUserLine, RiLockLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react'
import { cn } from '@/lib/cn'
import type { IdentityContactData } from '@/types/onboarding'

interface StepProps {
  data: IdentityContactData
  errors?: Record<string, string>
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

function getPasswordStrength(pw: string): 'weak' | 'medium' | 'strong' {
  if (pw.length < 8) return 'weak'
  const hasUpper = /[A-Z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw)
  const score = [hasUpper, hasNumber, hasSpecial, pw.length >= 12].filter(Boolean).length
  if (score >= 3) return 'strong'
  return 'medium'
}

export function StepIdentityContact({ data, errors = {}, onUpdate }: StepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const update = (field: keyof IdentityContactData, value: string) => {
    onUpdate({ ...data, [field]: value })
  }

  const strength = data.password ? getPasswordStrength(data.password) : null

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Full Name"
          required
          placeholder="John Doe"
          value={data.fullName}
          onChange={e => update('fullName', e.target.value)}
          icon={<RiUserLine size={20} />}
          error={errors.fullName}
        />
        <Input
          label="Email"
          required
          placeholder="hello@example.com"
          type="email"
          value={data.email}
          onChange={e => update('email', e.target.value)}
          icon={<RiMailLine size={20} />}
          error={errors.email}
        />
        <div className="flex flex-col gap-1">
          <Input
            label="Set Password"
            required
            placeholder="Min. 8 characters"
            type={showPassword ? 'text' : 'password'}
            value={data.password}
            onChange={e => update('password', e.target.value)}
            icon={<RiLockLine size={20} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
              </button>
            }
            error={errors.password}
          />
          {strength && !errors.password && (
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden">
                <div className={cn(
                  'h-full rounded-full transition-all duration-300',
                  strength === 'weak' && 'w-1/3 bg-error',
                  strength === 'medium' && 'w-2/3 bg-warning',
                  strength === 'strong' && 'w-full bg-success',
                )} />
              </div>
              <span className={cn(
                'text-xs',
                strength === 'weak' && 'text-error',
                strength === 'medium' && 'text-warning',
                strength === 'strong' && 'text-success',
              )}>
                {strength === 'weak' ? 'Weak' : strength === 'medium' ? 'Medium' : 'Strong'}
              </span>
            </div>
          )}
        </div>
        <Input
          label="Telegram Handle"
          required
          placeholder="@username"
          value={data.telegramHandle}
          onChange={e => update('telegramHandle', e.target.value)}
          icon={<RiAtLine size={20} />}
          error={errors.telegramHandle}
        />
        <div className="sm:col-span-2">
          <Select
            label="Based In"
            required
            placeholder="Select your country"
            options={countryOptions}
            value={data.basedIn}
            onChange={e => update('basedIn', e.target.value)}
            error={errors.basedIn}
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
          error={errors.githubProfile}
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
