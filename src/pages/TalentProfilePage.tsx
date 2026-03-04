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
  RiCheckboxCircleLine,
  RiAddLine,
  RiImageLine,
  RiPencilLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiArrowDownSLine,
} from '@remixicon/react'
import { PageShell } from '@/components/layout/PageShell'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/context/AuthContext'

const JOB_STATUS_OPTIONS = ['Actively Looking', 'Open to new jobs', 'Not looking', 'Casually browsing']
const OPEN_FOR_OPTIONS = ['Full-Time Roles', 'Part-Time Roles', 'Freelance / Contract', 'Internships']
const LOCATION_OPTIONS = ['San Francisco, CA', 'Bangalore, India', 'Remote', 'New York, USA', 'London, UK', 'Singapore']

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

  // Profile state
  const [bio, setBio] = useState('Designer who Builds | Couch Potato @NodeOpsHQ | Contributor @SuperteamTalent')
  const [location, setLocation] = useState('San Francisco, CA')
  const [roleTitle, setRoleTitle] = useState('Design Engineer')
  const [availability, setAvailability] = useState('Actively Looking')
  const [openFor, setOpenFor] = useState('Full-Time Roles')
  const [compensation, setCompensation] = useState('$170k – $210k / year')

  const [socialLinks] = useState<SocialLink[]>([
    { icon: RiGithubLine, label: 'GitHub', value: 'navedalam', url: 'https://github.com/navedalam' },
    { icon: RiLinkedinBoxLine, label: 'LinkedIn', value: 'navedalam', url: 'https://linkedin.com/in/navedalam' },
    { icon: RiMediumLine, label: 'Medium', value: '@navedalam', url: 'https://medium.com/@navedalam' },
    { icon: RiTelegramLine, label: 'Telegram', value: '@navedalam', url: 'https://t.me/navedalam' },
  ])

  const [desiredRoles, setDesiredRoles] = useState(['Product Design', 'UX Research', 'Design Systems'])
  const [communities, setCommunities] = useState(['Superteam', 'Solana Collective', 'Design DAO'])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [proudestContribution] = useState('DeFi Protocol Dashboard')
  const [contributionDetail] = useState('Open source contribution')

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)

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

  const removeRole = (role: string) => setDesiredRoles(prev => prev.filter(r => r !== role))
  const removeCommunity = (c: string) => setCommunities(prev => prev.filter(x => x !== c))

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

        {/* ── Profile Header Card ── */}
        <div className="border border-border">
          {/* Cover + Avatar */}
          <div className="h-[100px] bg-bg-primary border-b border-border relative">
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-text-muted/40">
              <RiImageLine size={24} />
              <span className="text-xs font-medium">Cover Image</span>
            </div>
            <div className="absolute -bottom-8 left-4">
              <Avatar name={user?.name ?? 'User'} size="xl" square className="border-4 border-bg-secondary w-16 h-16 text-lg" />
            </div>
          </div>

          {/* Info */}
          <div className="pt-12 px-4 pb-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-lg font-medium text-text-primary">{user?.name ?? 'Naved Alam'}</h1>
                <p className="text-[13px] text-text-secondary leading-relaxed">{bio}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)} className="shrink-0">
                <RiPencilLine size={14} />
                Edit
              </Button>
            </div>

            {/* Metadata row */}
            <div className="flex items-center gap-4 flex-wrap text-xs text-text-secondary">
              <Badge variant="success">{availability}</Badge>
              <span className="flex items-center gap-1">
                <RiMapPinLine size={12} /> {location}
              </span>
              <span className="flex items-center gap-1">
                <RiBriefcaseLine size={12} /> {openFor}
              </span>
              <span className="flex items-center gap-1">
                <RiMoneyDollarCircleLine size={12} /> {compensation}
              </span>
            </div>

            {/* Current Role */}
            <div className="flex items-center gap-2 bg-bg-secondary px-3 py-2 w-fit">
              <Avatar name="NodeOps" size="xs" />
              <span className="text-sm text-text-primary">{roleTitle}</span>
              <span className="text-xs text-text-muted">@ NodeOps</span>
            </div>
          </div>
        </div>

        {/* ── Profile Completion ── */}
        <div className="border border-border p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Profile Completion</span>
            <span className="text-sm text-text-secondary">{profileCompletion}%</span>
          </div>
          <ProgressBar value={profileCompletion} size="sm" />
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">
              <span className="text-brand font-medium">Level 1</span> — Eligible for introduction
            </span>
            <span className="text-xs text-text-muted">
              Next: <span className="text-text-secondary font-medium">Level 2 at 80%</span>
            </span>
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
              <div className="flex flex-col gap-1">
                {socialLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-bg-card transition-colors group"
                  >
                    <link.icon size={16} className="text-text-muted shrink-0" />
                    <span className="text-sm text-text-secondary flex-1">{link.label}</span>
                    <span className="text-xs text-text-muted group-hover:text-brand transition-colors">{link.value}</span>
                    <RiExternalLinkLine size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
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
                {[
                  { name: 'Alex Chen', role: 'Engineering Lead at Helius' },
                  { name: 'Sarah Kim', role: 'Product Manager at Jupiter' },
                ].map(ref => (
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
