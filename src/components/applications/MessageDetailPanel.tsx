import { useEffect, useRef } from 'react'
import {
  RiCloseLine,
  RiCheckLine,
  RiVideoLine,
  RiCalendarLine,
  RiTimeLine,

  RiFileTextLine,
  RiExternalLinkLine,
} from '@remixicon/react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Message {
  id: string
  title: string
  company: string
  preview: string
  time: string
  actionLabel?: string
  actionType?: 'brand' | 'outline'
  secondaryLabel?: string
  urgency: 'action' | 'deadline' | 'info'
}

interface MessageDetailPanelProps {
  message: Message
  onClose: () => void
  isDone: boolean
  onAction: (id: string, label: string) => void
}

const urgencyBadge: Record<Message['urgency'], { label: string; variant: 'brand' | 'error' | 'default' }> = {
  action: { label: 'Action Required', variant: 'brand' },
  deadline: { label: 'Deadline', variant: 'error' },
  info: { label: 'Info', variant: 'default' },
}

export function MessageDetailPanel({ message, onClose, isDone, onAction }: MessageDetailPanelProps) {
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

  const renderActionContent = () => {
    if (!message.actionLabel) return null

    switch (message.actionLabel) {
      case 'Book Interview':
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-text-primary">Select a Time Slot</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Mon, Mar 10 — 10:00 AM', 'Tue, Mar 11 — 2:00 PM', 'Wed, Mar 12 — 11:00 AM', 'Thu, Mar 13 — 3:00 PM'].map(slot => (
                <button
                  key={slot}
                  className="px-3 py-2.5 text-xs text-text-secondary bg-bg-card border border-border hover:border-brand/50 hover:text-text-primary transition-colors text-left cursor-pointer"
                >
                  <RiCalendarLine size={12} className="inline mr-1.5 text-brand" />
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )
      case 'View Assignment':
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-text-primary">Assignment Details</h3>
            <div className="bg-bg-card border border-border p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <RiFileTextLine size={14} className="text-brand" />
                <span className="text-sm text-text-primary">Design Challenge Brief</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Create a responsive dashboard layout for a DeFi analytics platform. Focus on data visualization,
                user flows, and accessibility. Include both desktop and mobile wireframes.
              </p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><RiTimeLine size={12} /> Due in 5 days</span>
                <span className="flex items-center gap-1"><RiFileTextLine size={12} /> PDF, Figma accepted</span>
              </div>
            </div>
          </div>
        )
      case 'Record Video':
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-text-primary">Video Introduction Guidelines</h3>
            <div className="bg-bg-card border border-border p-4 flex flex-col gap-3">
              <ul className="flex flex-col gap-2 text-xs text-text-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <RiCheckLine size={12} className="text-brand shrink-0 mt-0.5" />
                  Introduce yourself and your background (30 sec)
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckLine size={12} className="text-brand shrink-0 mt-0.5" />
                  Walk through a recent project or case study (1-2 min)
                </li>
                <li className="flex items-start gap-2">
                  <RiCheckLine size={12} className="text-brand shrink-0 mt-0.5" />
                  Share why you're excited about this role (30 sec)
                </li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <RiTimeLine size={12} /> Max 3 minutes &bull; MP4 or Loom link
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

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
          <Avatar name={message.company} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-medium text-text-primary truncate">{message.company}</h2>
            <p className="text-[13px] text-text-muted flex items-center gap-1">
              <RiTimeLine size={12} />
              {message.time}
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <RiCloseLine size={20} />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 p-4">
            {/* Title + Badge */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={urgencyBadge[message.urgency].variant}>
                  {urgencyBadge[message.urgency].label}
                </Badge>
              </div>
              <h1 className="text-xl font-medium text-text-primary tracking-[-0.36px]">{message.title}</h1>
            </div>

            {/* Message body */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-text-primary">Message</h3>
              <p className="text-[13px] text-text-primary leading-[1.7] tracking-[-0.078px]">
                {message.preview}
              </p>
            </div>

            {/* Contextual action content */}
            {!isDone && renderActionContent()}

            {/* Done state */}
            {isDone && (
              <div className="bg-green-400/10 border border-green-400/30 p-4 flex items-center gap-3">
                <RiCheckLine size={20} className="text-green-400 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-green-400">Action Completed</span>
                  <span className="text-xs text-text-secondary">This task has been marked as done</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-4 border-t border-border shrink-0">
          <div className="flex-1" />
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
          {message.actionLabel && (
            isDone ? (
              <Button size="sm" variant="applied">
                <RiCheckLine size={14} />
                Done
              </Button>
            ) : (
              <Button size="sm" onClick={() => onAction(message.id, message.actionLabel!)}>
                {message.actionLabel === 'Record Video' && <RiVideoLine size={14} />}
                {message.actionLabel === 'Book Interview' && <RiCalendarLine size={14} />}
                {message.actionLabel === 'View Assignment' && <RiExternalLinkLine size={14} />}
                {message.actionLabel}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
