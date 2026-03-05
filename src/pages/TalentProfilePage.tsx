import { useState, useEffect, useRef } from 'react'
import {
  RiMapPinLine,
  RiBriefcaseLine,
  RiMoneyDollarCircleLine,
  RiGithubLine,
  RiLinkedinBoxLine,
  RiMediumLine,
  RiTelegramLine,
  RiFileTextLine,
  RiDownloadLine,
  RiAddLine,
  RiImageLine,
  RiPencilLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiArrowDownSLine,
  RiLockLine,
  RiTwitterXLine,
  RiGlobalLine,
  RiCameraLine,
  RiUserSettingsLine,
} from '@remixicon/react'
import { PageShell } from '@/components/layout/PageShell'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/context/AuthContext'

const JOB_STATUS_OPTIONS = ['Actively Looking', 'Open to new jobs', 'Not looking', 'Casually browsing']

const statusBadgeVariant = (status: string): 'success' | 'brand' | 'error' | 'default' => {
  switch (status) {
    case 'Actively Looking': return 'success'
    case 'Open to new jobs': return 'brand'
    case 'Not looking': return 'error'
    case 'Casually browsing': return 'default'
    default: return 'default'
  }
}
const OPEN_FOR_OPTIONS = ['Full-Time Roles', 'Part-Time Roles', 'Freelance / Contract', 'Internships']
const LOCATION_OPTIONS = [
  'Remote',
  'San Francisco, CA', 'New York, USA', 'Austin, TX', 'Los Angeles, CA', 'Miami, FL', 'Chicago, IL', 'Seattle, WA', 'Denver, CO', 'Boston, MA',
  'London, UK', 'Berlin, Germany', 'Paris, France', 'Amsterdam, Netherlands', 'Lisbon, Portugal', 'Zurich, Switzerland', 'Dublin, Ireland',
  'Bangalore, India', 'Mumbai, India', 'Delhi, India', 'Hyderabad, India',
  'Singapore', 'Hong Kong', 'Tokyo, Japan', 'Seoul, South Korea', 'Dubai, UAE', 'Tel Aviv, Israel',
  'Sydney, Australia', 'Melbourne, Australia',
  'Toronto, Canada', 'Vancouver, Canada',
  'São Paulo, Brazil', 'Buenos Aires, Argentina', 'Mexico City, Mexico',
  'Lagos, Nigeria', 'Nairobi, Kenya', 'Cape Town, South Africa',
]
const COMPENSATION_OPTIONS = [
  '$50k – $80k / year',
  '$80k – $120k / year',
  '$120k – $170k / year',
  '$170k – $210k / year',
  '$210k – $300k / year',
  '$300k+ / year',
]

/* ─── Default Profile Data ───
   Update these values to change what shows on the profile.
   They also serve as initial values before user edits. */
const PROFILE_DEFAULTS = {
  bio: 'Designer who Builds | Couch Potato @NodeOpsHQ | Contributor @SuperteamTalent',
  roleTitle: 'Design Engineer',
  company: 'NodeOps',
  availability: 'Actively Looking',
  openFor: 'Full-Time Roles',
  location: 'San Francisco, CA',
  compensation: '$170k – $210k / year',
  desiredRoles: ['Product Design', 'UX Research', 'Design Systems'],
  communities: ['Superteam', 'Solana Collective', 'Design DAO'],
  proudestContribution: 'DeFi Protocol Dashboard',
  contributionDetail: 'Open source contribution',
  socials: [
    { icon: 'x' as const, label: 'X', value: '@navedalam', url: 'https://x.com/navedalam' },
    { icon: 'linkedin' as const, label: 'LinkedIn', value: 'navedalam', url: 'https://linkedin.com/in/navedalam' },
    { icon: 'github' as const, label: 'GitHub', value: 'navedalam', url: 'https://github.com/navedalam' },
    { icon: 'telegram' as const, label: 'Telegram', value: '@navedalam', url: 'https://t.me/navedalam' },
    { icon: 'medium' as const, label: 'Medium', value: '@navedalam', url: 'https://medium.com/@navedalam' },
  ],
  references: [
    { name: 'Alex Chen', role: 'Engineering Lead at Helius' },
    { name: 'Sarah Kim', role: 'Product Manager at Jupiter' },
  ],
}

const SOCIAL_ICONS = {
  x: RiTwitterXLine,
  linkedin: RiLinkedinBoxLine,
  github: RiGithubLine,
  telegram: RiTelegramLine,
  medium: RiMediumLine,
} as const

interface SocialLink {
  icon: typeof RiGithubLine
  label: string
  value: string
  url: string
}

interface PortfolioItem {
  id: string
  title: string
}

export default function TalentProfilePage() {
  const { user } = useAuth()

  // Profile state — seeded from PROFILE_DEFAULTS (edit the object above to change defaults)
  const [bio, setBio] = useState(PROFILE_DEFAULTS.bio)
  const [location, setLocation] = useState(PROFILE_DEFAULTS.location)
  const [roleTitle, setRoleTitle] = useState(PROFILE_DEFAULTS.roleTitle)
  const [availability, setAvailability] = useState(PROFILE_DEFAULTS.availability)
  const [openFor, setOpenFor] = useState(PROFILE_DEFAULTS.openFor)
  const [compensation, setCompensation] = useState(PROFILE_DEFAULTS.compensation)

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    PROFILE_DEFAULTS.socials.map(s => ({
      icon: SOCIAL_ICONS[s.icon],
      label: s.label,
      value: s.value,
      url: s.url,
    }))
  )

  const [desiredRoles, setDesiredRoles] = useState(PROFILE_DEFAULTS.desiredRoles)
  const [communities, setCommunities] = useState(PROFILE_DEFAULTS.communities)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const proudestContribution = PROFILE_DEFAULTS.proudestContribution
  const contributionDetail = PROFILE_DEFAULTS.contributionDetail

  // Modals & dropdowns
  const [editOpen, setEditOpen] = useState(false)
  const [addSocialOpen, setAddSocialOpen] = useState(false)
  const [updateMenuOpen, setUpdateMenuOpen] = useState(false)
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false)
  const updateMenuRef = useRef<HTMLDivElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // Cover & avatar state
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Close update menu on outside click
  useEffect(() => {
    if (!updateMenuOpen) return
    const handle = (e: MouseEvent) => {
      if (updateMenuRef.current && !updateMenuRef.current.contains(e.target as Node)) setUpdateMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [updateMenuOpen])

  // Save toast
  const [showSaved, setShowSaved] = useState(false)

  const handleSave = () => {
    setEditOpen(false)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  const addPortfolioItem = () => {
    const id = String(Date.now())
    setPortfolio(prev => [...prev, { id, title: `Project ${prev.length + 1}` }])
  }

  const removePortfolioItem = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id))
  }

  const profileCompletion = 70

  return (
    <PageShell user={user}>
      {/* Save Toast */}
      {showSaved && (
        <div className="fixed top-4 right-4 z-50 bg-success text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
          <RiCheckLine size={16} />
          Changes saved
        </div>
      )}

      <div className="flex flex-col gap-6 px-4 md:px-8 pb-8">

        {/* ── Profile Completion ── */}
        <div className="border border-border p-5 flex flex-col gap-4">
          {/* Top row: title + current level badge */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-text-primary">Profile Completion</span>
              <span className="text-xs text-text-muted">Complete your profile to increase visibility</span>
            </div>
            <Badge variant="brand">Eligible for Introduction</Badge>
          </div>

          {/* Progress bar with percentage */}
          <div className="flex items-center gap-3">
            <ProgressBar value={profileCompletion} size="sm" className="flex-1" />
            <span className="text-sm font-medium text-brand">{profileCompletion}%</span>
          </div>

          {/* Level steps */}
          <div className="grid grid-cols-3 gap-2">
            {/* Level 1 — completed */}
            <div className="flex items-center gap-2 px-3 py-2 bg-brand/10 border border-brand/30">
              <span className="text-xs font-medium text-brand flex-1">
                Level 1 → Eligible for Introduction
              </span>
              <RiCheckLine size={14} className="text-brand shrink-0" />
            </div>
            {/* Level 2 — next */}
            <div className="flex items-center gap-2 px-3 py-2 bg-brand/5 border border-brand/20">
              <span className="text-xs font-medium text-brand/70 flex-1">
                Next &bull; Level 2 (80%) → Eligible for [Benefit]
              </span>
            </div>
            {/* Level 3 — locked */}
            <div className="flex items-center gap-2 px-3 py-2 bg-bg-card border border-border">
              <span className="text-xs text-text-muted flex-1">
                Level 3 (100%) → Eligible for Talent Spotlight
              </span>
              <RiLockLine size={14} className="text-text-muted shrink-0" />
            </div>
          </div>
        </div>

        {/* ── Profile Header Card ── */}
        <div className="flex flex-col">
          {/* Info banner */}
          <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-brand/5 border-l-2 border-l-brand border-r-2 border-r-brand">
            <p className="text-[13px] text-brand leading-relaxed">
              This is your Superteam Talent profile, keep it up to date to get matched with the right teams and track your interview progress across the ecosystem.
            </p>
          </div>

          {/* Cover + Avatar */}
          <div className="relative">
            {coverUrl ? (
              <div className="h-[200px] border-l-2 border-l-brand border-r-2 border-r-brand overflow-hidden">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-[200px] bg-bg-primary flex items-center justify-center gap-2 text-text-muted/40 border-l-2 border-l-brand border-r-2 border-r-brand">
                <RiImageLine size={32} />
                <span className="text-sm font-medium">Cover Image</span>
              </div>
            )}
            {/* Avatar */}
            <div className="absolute -bottom-10 left-5">
              {avatarUrl ? (
                <div className="w-20 h-20 border-4 border-bg-card overflow-hidden shrink-0">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <Avatar name={user?.name ?? 'User'} size="xl" square className="border-4 border-bg-card w-20 h-20 text-xl" />
              )}
            </div>
            {/* Update dropdown */}
            <div className="absolute bottom-0 right-5 translate-y-1/2" ref={updateMenuRef}>
              <Button variant="secondary" size="sm" onClick={() => setUpdateMenuOpen(p => !p)}>
                <RiPencilLine size={14} />
                Update
                <RiArrowDownSLine size={14} />
              </Button>
              {updateMenuOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-bg-card border border-border shadow-lg z-10">
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors cursor-pointer"
                    onClick={() => { coverInputRef.current?.click(); setUpdateMenuOpen(false) }}
                  >
                    <RiCameraLine size={16} />
                    Update Cover
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors cursor-pointer"
                    onClick={() => { avatarInputRef.current?.click(); setUpdateMenuOpen(false) }}
                  >
                    <RiUserSettingsLine size={16} />
                    Update Avatar
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors cursor-pointer border-t border-border"
                    onClick={() => { setEditOpen(true); setUpdateMenuOpen(false) }}
                  >
                    <RiPencilLine size={16} />
                    Edit Profile
                  </button>
                </div>
              )}
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0]
                if (file) setCoverUrl(URL.createObjectURL(file))
                e.target.value = ''
              }} />
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0]
                if (file) setAvatarUrl(URL.createObjectURL(file))
                e.target.value = ''
              }} />
            </div>
          </div>

          {/* Info */}
          <div className="pt-14 pb-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-lg font-medium text-text-primary">{user?.name ?? 'Naved Alam'}</h1>
                <p className="text-[13px] text-text-secondary leading-relaxed">{bio}</p>
              </div>

              {/* Current Role — right aligned */}
              <div className="flex items-center gap-3 bg-bg-secondary px-3 py-3 shrink-0">
                <Avatar name={PROFILE_DEFAULTS.company} size="sm" square />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-text-primary">{roleTitle}</span>
                  <span className="text-xs text-text-muted">{PROFILE_DEFAULTS.company}</span>
                </div>
              </div>
            </div>

            {/* Metadata row — click any item to edit inline */}
            <div className="flex items-center gap-3 flex-wrap text-xs text-text-secondary">
              <InlineSelect
                value={availability}
                onChange={setAvailability}
                options={JOB_STATUS_OPTIONS}
                render={v => <Badge variant={statusBadgeVariant(v)}>{v}</Badge>}
              />
              <InlineSelect
                value={location}
                onChange={setLocation}
                options={LOCATION_OPTIONS}
                icon={<RiMapPinLine size={12} />}
                searchable
              />
              <InlineSelect
                value={openFor}
                onChange={setOpenFor}
                options={OPEN_FOR_OPTIONS}
                icon={<RiBriefcaseLine size={12} />}
              />
              <InlineSelectWithCustom
                value={compensation}
                onChange={setCompensation}
                options={COMPENSATION_OPTIONS}
                icon={<RiMoneyDollarCircleLine size={12} />}
                placeholder="e.g. $150k – $200k / year"
              />
            </div>
          </div>
        </div>

        {/* ── Two Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column */}
          <div className="flex flex-col gap-6">

            {/* Desired Roles */}
            <SectionCard title="Desired Roles">
              <div className="flex flex-wrap gap-2">
                {desiredRoles.map(role => (
                  <Badge key={role} variant="default">{role}</Badge>
                ))}
              </div>
            </SectionCard>

            {/* Socials */}
            <SectionCard title="Socials">
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-card border border-border transition-colors group"
                  >
                    <link.icon size={16} className="text-text-muted group-hover:text-text-primary shrink-0" />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary">{link.value}</span>
                  </a>
                ))}
                <button
                  onClick={() => setAddSocialOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-dashed border-brand/40 hover:border-brand transition-colors cursor-pointer group"
                >
                  <RiAddLine size={16} className="text-brand/60 group-hover:text-brand" />
                  <span className="text-sm text-brand/60 group-hover:text-brand">Add Link</span>
                </button>
              </div>
            </SectionCard>

            {/* Communities */}
            <SectionCard title="Communities">
              <div className="flex flex-wrap gap-2">
                {communities.map(c => (
                  <Badge key={c} variant="default">{c}</Badge>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Resume */}
            <SectionCard title="Resume / CV">
              <div className="flex flex-col gap-3">
                {/* Resume preview thumbnail */}
                <button
                  onClick={() => setResumePreviewOpen(true)}
                  className="w-full h-[320px] bg-white overflow-hidden border border-border hover:border-brand/50 transition-colors cursor-pointer group relative"
                >
                  {/* Scaled-down real resume content — clipped to show top portion */}
                  <div className="w-full h-full pointer-events-none">
                    <div className="w-full scale-[0.62] origin-top" style={{ width: '161%', marginLeft: '-30.5%' }}>
                      <div className="px-8 py-6 space-y-4 text-gray-800 text-left">
                        <div className="space-y-0.5">
                          <h4 className="text-2xl font-bold text-gray-900">Naved Alam</h4>
                          <p className="text-sm text-gray-500">Design Engineer &bull; San Francisco, CA</p>
                          <p className="text-xs text-gray-400">navedalam@email.com &bull; github.com/navedalam &bull; linkedin.com/in/navedalam</p>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="space-y-1.5">
                          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Summary</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">Design Engineer with 5+ years of experience building high-quality web applications and design systems. Passionate about bridging design and engineering to create delightful user experiences.</p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Experience</h5>
                          <div className="space-y-1">
                            <div className="flex justify-between"><span className="text-sm font-semibold text-gray-800">Design Engineer</span><span className="text-xs text-gray-400">2023 – Present</span></div>
                            <p className="text-xs text-gray-500">NodeOps</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside"><li>Led design system development serving 12+ product teams</li><li>Built responsive dashboard UI handling 100k+ daily users</li></ul>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between"><span className="text-sm font-semibold text-gray-800">Frontend Developer</span><span className="text-xs text-gray-400">2021 – 2023</span></div>
                            <p className="text-xs text-gray-500">Superteam</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside"><li>Developed DeFi protocol dashboard with real-time data</li></ul>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Skills</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Next.js', 'Solana', 'Design Systems', 'Web3'].map(s => (
                              <span key={s} className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Fade-out at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                      <RiExternalLinkLine size={14} />
                      Click to preview
                    </span>
                  </div>
                </button>
                {/* File info row */}
                <div className="flex items-center gap-3 p-3 bg-bg-secondary">
                  <RiFileTextLine size={18} className="text-brand shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">Naved_Alam_Resume.pdf</p>
                    <p className="text-xs text-text-muted">Uploaded 3 days ago</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" title="Download">
                    <RiDownloadLine size={16} />
                  </Button>
                </div>
              </div>
            </SectionCard>

            {/* Portfolio */}
            <SectionCard title="Portfolio">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={addPortfolioItem}
                  className="h-[90px] bg-bg-secondary border border-dashed border-brand/40 hover:border-brand flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors group"
                >
                  <RiAddLine size={20} className="text-brand/60 group-hover:text-brand" />
                  <span className="text-xs text-text-muted">Add Work</span>
                </button>
                {portfolio.map(item => (
                  <div key={item.id} className="h-[90px] bg-bg-secondary border border-border flex flex-col items-center justify-center gap-1.5 relative group">
                    <RiImageLine size={18} className="text-brand/50" />
                    <span className="text-xs text-text-secondary">{item.title}</span>
                    <button
                      onClick={() => removePortfolioItem(item.id)}
                      className="absolute top-1 right-1 p-0.5 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <RiDeleteBinLine size={10} />
                    </button>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 2 - portfolio.length) }).map((_, i) => (
                  <div key={`e-${i}`} className="h-[90px] bg-bg-secondary border border-border flex items-center justify-center">
                    <RiImageLine size={18} className="text-text-muted/20" />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Proudest Contribution */}
            <SectionCard title="Proudest Solana Contribution">
              <div className="flex items-center gap-3 p-3 bg-bg-secondary">
                <Avatar name="Solana" size="sm" className="bg-brand/20" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{proudestContribution}</p>
                  <p className="text-xs text-text-muted">{contributionDetail}</p>
                </div>
              </div>
            </SectionCard>

            {/* References */}
            <SectionCard title="References">
              <div className="flex flex-col gap-2">
                {PROFILE_DEFAULTS.references.map(ref => (
                  <div key={ref.name} className="flex items-center gap-3 p-3 bg-bg-secondary">
                    <Avatar name={ref.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{ref.name}</p>
                      <p className="text-xs text-text-muted">{ref.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Add Social Link Modal */}
      {addSocialOpen && (
        <AddSocialModal
          onAdd={(link) => {
            setSocialLinks(prev => [...prev, link])
            setAddSocialOpen(false)
          }}
          onClose={() => setAddSocialOpen(false)}
        />
      )}

      {/* Resume Preview Modal */}
      {resumePreviewOpen && (
        <ResumePreviewModal onClose={() => setResumePreviewOpen(false)} />
      )}

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfileModal
          data={{ bio, location, roleTitle, availability, openFor, compensation, desiredRoles, communities }}
          onSave={(d) => {
            setBio(d.bio)
            setLocation(d.location)
            setRoleTitle(d.roleTitle)
            setAvailability(d.availability)
            setOpenFor(d.openFor)
            setCompensation(d.compensation)
            setDesiredRoles(d.desiredRoles)
            setCommunities(d.communities)
            handleSave()
          }}
          onClose={() => setEditOpen(false)}
        />
      )}
    </PageShell>
  )
}

/* ─── Section Card ─── */

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/* ─── Resume Preview Modal ─── */

function ResumePreviewModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-2xl bg-white flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border">
          <div className="flex items-center gap-2">
            <RiFileTextLine size={18} className="text-brand" />
            <span className="text-sm font-medium text-text-primary">Naved_Alam_Resume.pdf</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" title="Download">
              <RiDownloadLine size={16} />
            </Button>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1.5">
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        {/* Full resume preview */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-12 py-10 space-y-6 text-gray-800">
            {/* Name & Contact */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Naved Alam</h1>
              <p className="text-sm text-gray-500">Design Engineer &bull; San Francisco, CA</p>
              <p className="text-xs text-gray-400">navedalam@email.com &bull; github.com/navedalam &bull; linkedin.com/in/navedalam</p>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Summary */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Summary</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Design Engineer with 5+ years of experience building high-quality web applications and design systems. Passionate about bridging design and engineering to create delightful user experiences. Active contributor to the Solana ecosystem.
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Experience</h2>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-gray-800">Design Engineer</h3>
                  <span className="text-xs text-gray-400">2023 – Present</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">NodeOps</p>
                <ul className="text-sm text-gray-600 space-y-0.5 list-disc list-inside">
                  <li>Led design system development serving 12+ product teams</li>
                  <li>Built responsive dashboard UI handling 100k+ daily users</li>
                  <li>Reduced component library bundle size by 40%</li>
                </ul>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-gray-800">Frontend Developer</h3>
                  <span className="text-xs text-gray-400">2021 – 2023</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Superteam</p>
                <ul className="text-sm text-gray-600 space-y-0.5 list-disc list-inside">
                  <li>Developed DeFi protocol dashboard with real-time data</li>
                  <li>Implemented wallet integration and transaction flows</li>
                </ul>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Next.js', 'Solana', 'Design Systems', 'Web3'].map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-sm">{skill}</span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Education</h2>
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">B.S. Computer Science</h3>
                  <p className="text-xs text-gray-500">Stanford University</p>
                </div>
                <span className="text-xs text-gray-400">2017 – 2021</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Add Social Link Modal ─── */

const SOCIAL_PLATFORM_OPTIONS = [
  { key: 'x', label: 'X (Twitter)', icon: RiTwitterXLine, prefix: 'https://x.com/' },
  { key: 'linkedin', label: 'LinkedIn', icon: RiLinkedinBoxLine, prefix: 'https://linkedin.com/in/' },
  { key: 'github', label: 'GitHub', icon: RiGithubLine, prefix: 'https://github.com/' },
  { key: 'telegram', label: 'Telegram', icon: RiTelegramLine, prefix: 'https://t.me/' },
  { key: 'medium', label: 'Medium', icon: RiMediumLine, prefix: 'https://medium.com/@' },
  { key: 'other', label: 'Other', icon: RiGlobalLine, prefix: '' },
]

function AddSocialModal({ onAdd, onClose }: {
  onAdd: (link: SocialLink) => void
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [platform, setPlatform] = useState(SOCIAL_PLATFORM_OPTIONS[0])
  const [handle, setHandle] = useState('')
  const [customUrl, setCustomUrl] = useState('')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = () => {
    if (!handle.trim()) return
    const url = platform.key === 'other' ? customUrl.trim() : `${platform.prefix}${handle.trim()}`
    onAdd({
      icon: platform.icon,
      label: platform.label,
      value: platform.key === 'other' ? handle.trim() : (platform.key === 'medium' ? `@${handle.trim()}` : handle.trim()),
      url,
    })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-sm bg-bg-secondary border border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium text-text-primary">Add Social Link</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
          {/* Platform selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">Platform</label>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_PLATFORM_OPTIONS.map(opt => {
                const Icon = opt.icon
                const selected = platform.key === opt.key
                return (
                  <button
                    key={opt.key}
                    onClick={() => setPlatform(opt)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors cursor-pointer ${
                      selected
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-border bg-bg-card text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Icon size={14} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Handle input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">
              {platform.key === 'other' ? 'Label' : 'Username / Handle'}
            </label>
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder={platform.key === 'other' ? 'e.g. My Website' : 'e.g. navedalam'}
              className="w-full px-3 py-2 bg-bg-card border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand transition-colors"
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              autoFocus
            />
          </div>

          {/* Custom URL for "Other" */}
          {platform.key === 'other' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted">URL</label>
              <input
                type="url"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-bg-card border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand transition-colors"
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              />
            </div>
          )}

          {/* Preview */}
          {handle.trim() && (
            <div className="flex items-center gap-2 px-3 py-2 bg-bg-card border border-border">
              <platform.icon size={16} className="text-text-muted" />
              <span className="text-sm text-text-secondary">
                {platform.key === 'medium' ? `@${handle.trim()}` : handle.trim()}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!handle.trim() || (platform.key === 'other' && !customUrl.trim())}>
            Add Link
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ─── Edit Profile Modal ─── */

interface EditData {
  bio: string
  location: string
  roleTitle: string
  availability: string
  openFor: string
  compensation: string
  desiredRoles: string[]
  communities: string[]
}

function EditProfileModal({ data, onSave, onClose }: {
  data: EditData
  onSave: (data: EditData) => void
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<EditData>(data)
  const [newRole, setNewRole] = useState('')
  const [newCommunity, setNewCommunity] = useState('')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const update = <K extends keyof EditData>(field: K, value: EditData[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const addRole = () => {
    if (newRole.trim() && !form.desiredRoles.includes(newRole.trim())) {
      update('desiredRoles', [...form.desiredRoles, newRole.trim()])
      setNewRole('')
    }
  }

  const addCommunity = () => {
    if (newCommunity.trim() && !form.communities.includes(newCommunity.trim())) {
      update('communities', [...form.communities, newCommunity.trim()])
      setNewCommunity('')
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-lg bg-bg-secondary border border-border flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium text-text-primary">Edit Profile</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto">
          {/* About */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">About</span>
            <FieldTextarea label="Bio" value={form.bio} onChange={v => update('bio', v)} />
            <FieldInput label="Role Title" value={form.roleTitle} onChange={v => update('roleTitle', v)} />
            <FieldInput label="Compensation" value={form.compensation} onChange={v => update('compensation', v)} />
          </div>

          <div className="border-t border-border" />

          {/* Preferences */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Preferences</span>
            <FieldSelect label="Availability" value={form.availability} onChange={v => update('availability', v)} options={JOB_STATUS_OPTIONS} />
            <FieldSelect label="Open For" value={form.openFor} onChange={v => update('openFor', v)} options={OPEN_FOR_OPTIONS} />
            <FieldSelect label="Location" value={form.location} onChange={v => update('location', v)} options={LOCATION_OPTIONS} />
          </div>

          <div className="border-t border-border" />

          {/* Desired Roles */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Desired Roles</span>
            <div className="flex flex-wrap gap-2">
              {form.desiredRoles.map(r => (
                <span key={r} className="flex items-center gap-1 bg-white/8 text-text-secondary text-xs px-2 py-1">
                  {r}
                  <button onClick={() => update('desiredRoles', form.desiredRoles.filter(x => x !== r))} className="text-text-muted hover:text-red-400 cursor-pointer">
                    <RiCloseLine size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRole()}
                placeholder="Add a role..."
                className="bg-bg-input border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand flex-1"
              />
              <Button size="sm" variant="secondary" onClick={addRole}>Add</Button>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Communities */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Communities</span>
            <div className="flex flex-wrap gap-2">
              {form.communities.map(c => (
                <span key={c} className="flex items-center gap-1 bg-white/8 text-text-secondary text-xs px-2 py-1">
                  {c}
                  <button onClick={() => update('communities', form.communities.filter(x => x !== c))} className="text-text-muted hover:text-red-400 cursor-pointer">
                    <RiCloseLine size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newCommunity}
                onChange={e => setNewCommunity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCommunity()}
                placeholder="Add a community..."
                className="bg-bg-input border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand flex-1"
              />
              <Button size="sm" variant="secondary" onClick={addCommunity}>Add</Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => onSave(form)}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

/* ─── Form Fields ─── */

function FieldInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-input border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand transition-colors"
      />
    </div>
  )
}

function FieldTextarea({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={2}
        className="w-full bg-bg-input border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand transition-colors resize-none"
      />
    </div>
  )
}

function FieldSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-bg-input border border-border px-3 py-2 text-sm text-text-primary cursor-pointer outline-none focus:border-brand transition-colors"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <RiArrowDownSLine size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>
    </div>
  )
}

/* ─── Inline Editable Components ─── */

function InlineSelect({ value, onChange, options, icon, render, searchable }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  icon?: React.ReactNode
  render?: (v: string) => React.ReactNode
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery('') }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus()
  }, [open, searchable])

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setQuery('') }}
        className="flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
      >
        {render ? render(value) : <>{icon} {value}</>}
        <RiArrowDownSLine size={12} className="text-text-muted" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-bg-card border border-border shadow-lg z-30 min-w-[220px]">
          {searchable && (
            <div className="p-1.5 border-b border-border">
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-bg-input border border-border px-2 py-1.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
              />
            </div>
          )}
          <div className="max-h-[200px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-text-muted">No results</div>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); setQuery('') }}
                  className={`w-full text-left px-3 py-2 text-xs cursor-pointer transition-colors ${opt === value ? 'text-brand bg-brand/10' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'}`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function InlineSelectWithCustom({ value, onChange, options, icon, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  icon?: React.ReactNode
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setCustom(false) }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (custom) inputRef.current?.focus()
  }, [custom])

  const saveCustom = () => {
    if (draft.trim()) onChange(draft.trim())
    setCustom(false)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
      >
        {icon} {value}
        <RiArrowDownSLine size={12} className="text-text-muted" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-bg-card border border-border shadow-lg z-30 min-w-[200px]">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); setCustom(false) }}
              className={`w-full text-left px-3 py-2 text-xs cursor-pointer transition-colors ${opt === value ? 'text-brand bg-brand/10' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'}`}
            >
              {opt}
            </button>
          ))}
          <div className="border-t border-border">
            {custom ? (
              <div className="flex items-center gap-1 p-2">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveCustom(); if (e.key === 'Escape') { setCustom(false) } }}
                  placeholder={placeholder}
                  className="bg-bg-input border border-border px-2 py-1 text-xs text-text-primary outline-none focus:border-brand flex-1 min-w-0"
                />
                <button onClick={saveCustom} className="text-brand text-xs font-medium px-1.5 py-1 hover:bg-brand/10 cursor-pointer">
                  Set
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setDraft(value); setCustom(true) }}
                className="w-full text-left px-3 py-2 text-xs text-text-muted hover:text-brand hover:bg-bg-secondary cursor-pointer flex items-center gap-1"
              >
                <RiPencilLine size={10} /> Custom amount...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
