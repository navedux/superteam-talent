import { useState, useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  RiMapPinLine,
  RiArrowDownSLine,
  RiCloseLine,
  RiPencilLine,
  RiBriefcaseLine,
} from '@remixicon/react'
import type { User } from '@/types/auth'

const JOB_STATUS_OPTIONS = ['Open to new jobs', 'Actively looking', 'Not looking', 'Casually browsing']
const OPEN_FOR_OPTIONS = ['Full-Time Roles', 'Part-Time Roles', 'Freelance / Contract', 'Internships', 'Any']
const LOCATION_OPTIONS = ['Bangalore, India', 'Mumbai, India', 'Delhi, India', 'Remote', 'San Francisco, USA', 'New York, USA', 'London, UK', 'Singapore']

interface ProfileSectionProps {
  user: User | null
}

interface EditFormData {
  name: string
  title: string
  location: string
  jobStatus: string
  openFor: string
  telegramHandle: string
  twitterHandle: string
  linkedinUrl: string
  githubUrl: string
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [jobStatus, setJobStatus] = useState('Open to new jobs')
  const [openFor, setOpenFor] = useState('Full-Time Roles')
  const [location, setLocation] = useState(user?.location || 'Bangalore, India')
  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState<EditFormData>({
    name: '',
    title: '',
    location: '',
    jobStatus: '',
    openFor: '',
    telegramHandle: '',
    twitterHandle: '',
    linkedinUrl: '',
    githubUrl: '',
  })

  useEffect(() => {
    if (editOpen && user) {
      setEditData({
        name: user.name || '',
        title: user.title || '',
        location: user.location || location,
        jobStatus,
        openFor,
        telegramHandle: user.telegramHandle || '',
        twitterHandle: user.twitterHandle || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || '',
      })
    }
  }, [editOpen, user, jobStatus, openFor, location])

  if (!user) return null

  const handleSave = () => {
    setJobStatus(editData.jobStatus)
    setOpenFor(editData.openFor)
    setLocation(editData.location)
    setEditOpen(false)
  }

  const statusColor = jobStatus === 'Actively looking' ? 'success' : jobStatus === 'Not looking' ? 'error' : 'brand'

  return (
    <>
      <div className="border border-border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <Avatar name={user.name} size="xl" square />
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-lg font-medium text-text-primary tracking-[-0.2px] truncate">{user.name}</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant={statusColor}>{jobStatus}</Badge>
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <RiBriefcaseLine size={12} />
                {openFor}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <RiMapPinLine size={12} />
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)} className="shrink-0">
          <RiPencilLine size={14} />
          Edit
        </Button>
      </div>

      {/* Edit Details Modal */}
      {editOpen && (
        <EditDetailsModal
          data={editData}
          onChange={setEditData}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  )
}

/* ─── Edit Details Modal ─── */

function EditDetailsModal({ data, onChange, onSave, onClose }: {
  data: EditFormData
  onChange: (data: EditFormData) => void
  onSave: () => void
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const update = (field: keyof EditFormData, value: string) => {
    onChange({ ...data, [field]: value })
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
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto">
          {/* Personal Info */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Personal Info</span>
            <ModalField label="Full Name" value={data.name} onChange={v => update('name', v)} />
            <ModalField label="Title / Role" value={data.title} onChange={v => update('title', v)} placeholder="e.g. Full-Stack Developer" />
          </div>

          <div className="border-t border-border" />

          {/* Job Preferences */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Job Preferences</span>
            <ModalSelect label="Job Status" value={data.jobStatus} onChange={v => update('jobStatus', v)} options={JOB_STATUS_OPTIONS} />
            <ModalSelect label="Open For" value={data.openFor} onChange={v => update('openFor', v)} options={OPEN_FOR_OPTIONS} />
            <ModalSelect label="Based In" value={data.location} onChange={v => update('location', v)} options={LOCATION_OPTIONS} />
          </div>

          <div className="border-t border-border" />

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Social Links</span>
            <ModalField label="Telegram" value={data.telegramHandle} onChange={v => update('telegramHandle', v)} placeholder="@username" />
            <ModalField label="Twitter / X" value={data.twitterHandle} onChange={v => update('twitterHandle', v)} placeholder="@username" />
            <ModalField label="LinkedIn" value={data.linkedinUrl} onChange={v => update('linkedinUrl', v)} placeholder="https://linkedin.com/in/..." />
            <ModalField label="GitHub" value={data.githubUrl} onChange={v => update('githubUrl', v)} placeholder="https://github.com/..." />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared Sub-components ─── */

function ModalField({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
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

function ModalSelect({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (val: string) => void
  options: string[]
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
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <RiArrowDownSLine size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>
    </div>
  )
}
