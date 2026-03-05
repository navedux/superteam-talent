import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { RiWallet3Line, RiLoader4Line, RiCheckboxCircleLine, RiGlobalLine } from '@remixicon/react'
import type { CommunityData } from '@/types/onboarding'

interface StepProps {
  data: CommunityData
  onUpdate: (data: CommunityData) => void
}

/* Mock Superteam community detection.
   In production this would call an API that checks on-chain data
   for membership in Superteam DAOs / multisigs / token gates. */
const SUPERTEAM_COMMUNITIES: Record<string, string[]> = {
  // Mock: wallets starting with certain prefixes map to communities
  default: ['Superteam Germany', 'Superteam India'],
}

async function detectSuperteamCommunities(wallet: string): Promise<string[]> {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 1500))
  // For demo: any valid-looking Solana address returns communities
  if (wallet.length >= 32) {
    return SUPERTEAM_COMMUNITIES.default
  }
  return []
}

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
  const [detecting, setDetecting] = useState(false)
  const [detected, setDetected] = useState(data.detectedCommunities.length > 0)

  const update = (field: keyof CommunityData, value: string | boolean | string[]) => {
    onUpdate({ ...data, [field]: value })
  }

  const handleDetect = async () => {
    if (!data.walletAddress.trim()) return
    setDetecting(true)
    setDetected(false)
    try {
      const communities = await detectSuperteamCommunities(data.walletAddress.trim())
      update('detectedCommunities', communities)
      setDetected(true)
    } catch {
      update('detectedCommunities', [])
      setDetected(true)
    } finally {
      setDetecting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-medium text-text-primary leading-[1.333]">
          Community
        </h2>
        <p className="text-base text-text-secondary tracking-[-0.176px] leading-relaxed">
          Connect your wallet to automatically detect your Superteam memberships
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Wallet address + detect */}
        <div className="flex flex-col gap-2">
          <Input
            label="Solana Wallet Address"
            required
            placeholder="e.g. 7xKX...9fGh or your .sol domain"
            value={data.walletAddress}
            onChange={e => {
              update('walletAddress', e.target.value)
              if (detected) setDetected(false)
            }}
            icon={<RiWallet3Line size={20} />}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDetect}
            disabled={detecting || !data.walletAddress.trim()}
            className="self-start"
          >
            {detecting ? (
              <>
                <RiLoader4Line size={14} className="animate-spin" />
                Detecting...
              </>
            ) : (
              'Detect Memberships'
            )}
          </Button>
        </div>

        {/* Detection results */}
        {detected && (
          <div className="flex flex-col gap-3">
            {data.detectedCommunities.length > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <RiCheckboxCircleLine size={16} className="text-success" />
                  <span className="text-sm text-success font-medium">
                    {data.detectedCommunities.length} Superteam {data.detectedCommunities.length === 1 ? 'community' : 'communities'} found
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.detectedCommunities.map(community => (
                    <div
                      key={community}
                      className="flex items-center gap-2 px-3 py-2 bg-brand/10 border border-brand/30"
                    >
                      <img src="/ST_LOGO.webp" alt="" className="h-3.5 opacity-80" />
                      <span className="text-sm font-medium text-brand">{community}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-bg-card border border-border">
                <span className="text-sm text-text-muted">
                  No Superteam community memberships found for this wallet. You can still continue — communities can be added later if you join one.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-border" />

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
