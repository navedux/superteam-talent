import { Input } from '@/components/ui/Input'
import { RiLinksLine, RiFileTextLine } from '@remixicon/react'
import type { ContributionsData } from '@/types/onboarding'

interface StepProps {
  data: ContributionsData
  onUpdate: (data: ContributionsData) => void
}

export function StepContributions({ data, onUpdate }: StepProps) {
  const update = (field: keyof ContributionsData, value: string | string[]) => {
    onUpdate({ ...data, [field]: value })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-medium text-text-primary leading-[1.333]">
          Your contributions
        </h2>
        <p className="text-base text-text-secondary tracking-[-0.176px] leading-relaxed">
          Showcase your work and projects in the Solana ecosystem
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Projects"
          optional
          placeholder="e.g. DeFi protocol, NFT marketplace (comma separated)"
          value={data.projects.join(', ')}
          onChange={e => update('projects', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          icon={<RiFileTextLine size={20} />}
        />
        <Input
          label="Bounties Completed"
          optional
          placeholder="e.g. Superteam Earn, Solana Bounties (comma separated)"
          value={data.bounties.join(', ')}
          onChange={e => update('bounties', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          icon={<RiFileTextLine size={20} />}
        />
        <Input
          label="Portfolio URL"
          optional
          placeholder="https://yourportfolio.com"
          value={data.portfolioUrl}
          onChange={e => update('portfolioUrl', e.target.value)}
          icon={<RiLinksLine size={20} />}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-primary tracking-[-0.084px]">
            Description <span className="text-text-secondary font-normal">(Optional)</span>
          </label>
          <textarea
            placeholder="Tell us about your contributions and impact..."
            value={data.description}
            onChange={e => update('description', e.target.value)}
            rows={4}
            className="w-full bg-bg-input border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted shadow-input tracking-[-0.084px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors duration-150 resize-none font-body"
          />
        </div>
      </div>
    </div>
  )
}
