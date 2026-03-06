import { useEffect, useRef } from 'react'
import {
  RiCloseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiBriefcaseLine,
  RiTimeLine,
  RiBookmarkLine,
  RiCheckLine,
} from '@remixicon/react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { Job } from '@/types/jobs'

interface JobDetailPanelProps {
  job: Job
  onClose: () => void
  applied: boolean
  saved: boolean
  onApply: (id: string) => void
  onSave: (id: string) => void
}

export function JobDetailPanel({ job, onClose, applied, saved, onApply, onSave }: JobDetailPanelProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 animate-[fadeIn_150ms_ease-out]" />

      {/* Panel */}
      <div className="relative w-full max-w-[520px] h-full max-h-screen bg-bg-secondary border-l border-border flex flex-col overflow-hidden animate-[slideInRight_200ms_ease-out]">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border shrink-0">
          <Avatar name={job.company} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-medium text-text-primary truncate">{job.company}</h2>
            <p className="text-[13px] text-text-muted">
              <RiTimeLine size={12} className="inline mr-1" />
              Posted {job.postedAt}
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <RiCloseLine size={20} />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 p-4">
            {/* Title */}
            <h1 className="text-xl font-medium text-text-primary tracking-[-0.36px]">{job.title}</h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-brand flex-wrap">
              <span className="flex items-center gap-1.5">
                <RiMapPinLine size={14} /> {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <RiMoneyDollarCircleLine size={14} /> {job.compensation}
              </span>
              <span className="flex items-center gap-1.5">
                <RiBriefcaseLine size={14} /> {job.type}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-text-primary">Skills</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {job.skills.map(skill => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-text-primary">About this role</h3>
              <p className="text-[13px] text-text-primary leading-[1.7] tracking-[-0.078px]">
                {job.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-4 border-t border-border shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSave(job.id)}
            className={cn(saved ? 'text-brand' : 'text-text-muted')}
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <RiBookmarkLine size={20} />
          </Button>
          <div className="flex-1" />
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
          {applied ? (
            <Button size="sm" variant="applied">
              <RiCheckLine size={14} />
              Applied
            </Button>
          ) : (
            <Button size="sm" onClick={() => onApply(job.id)}>
              Submit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
