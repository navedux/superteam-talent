import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RiTimeLine, RiCheckLine, RiVideoLine, RiAlertLine, RiCalendarLine, RiInformationLine, RiCloseLine, RiFileTextLine } from '@remixicon/react'
import { PageShell } from '@/components/layout/PageShell'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { TabGroup } from '@/components/ui/TabGroup'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { MessageDetailPanel } from '@/components/applications/MessageDetailPanel'
import { cn } from '@/lib/cn'
import { fadeUp, staggerContainer, listItem } from '@/lib/motion'

type ApplicationStatus = 'All' | 'Matched Job' | 'Introduced' | 'In Interviews' | 'Placed' | 'Rejected'

interface Application {
  id: string
  title: string
  company: string
  status: ApplicationStatus
  lastUpdate: string
}

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

const mockApplications: Application[] = [
  { id: '1', title: 'Senior UX Architect', company: 'Helius', status: 'Matched Job', lastUpdate: '1 day ago' },
  { id: '2', title: 'Senior UX Architect', company: 'Metaplex Studios', status: 'Matched Job', lastUpdate: '1 day ago' },
  { id: '3', title: 'Senior UX Architect', company: 'Marinade Studios', status: 'Matched Job', lastUpdate: '1 day ago' },
  { id: '4', title: 'Senior UX Architect', company: 'Metaplex Studios', status: 'Matched Job', lastUpdate: '1 day ago' },
  { id: '5', title: 'Senior UX Architect', company: 'Malik Studios', status: 'Matched Job', lastUpdate: '1 day ago' },
  { id: '6', title: 'Senior UX Architect', company: 'Malik Studios', status: 'Introduced', lastUpdate: '1 day ago' },
  { id: '7', title: 'Senior UX Architect', company: 'Malik Studios', status: 'Introduced', lastUpdate: '1 day ago' },
  { id: '8', title: 'Senior UX Architect', company: 'Malik Studios', status: 'In Interviews', lastUpdate: '1 day ago' },
  { id: '9', title: 'Senior UX Architect', company: 'Metaplex Studios', status: 'In Interviews', lastUpdate: '1 day ago' },
  { id: '10', title: 'Senior UX Architect', company: 'Metaplex Studios', status: 'Placed', lastUpdate: '1 day ago' },
  { id: '11', title: 'Senior UX Architect', company: 'Metaplex Studios', status: 'Rejected', lastUpdate: '1 day ago' },
  { id: '12', title: 'Senior UX Architect', company: 'Metaplex Studios', status: 'Rejected', lastUpdate: '1 day ago' },
]

const initialMessages: Message[] = [
  {
    id: '1',
    title: 'Interview Scheduled - Phantom Vision',
    company: 'Phantom',
    preview: 'Your interview for Senior Product Designer has been confirmed. Please book your preferred time slot.',
    time: '2h ago',
    actionLabel: 'Book Interview',
    actionType: 'brand',
    secondaryLabel: 'Confirm Now',
    urgency: 'action',
  },
  {
    id: '2',
    title: 'Design Assignment 4 - Magic Edits',
    company: 'Magic Edits',
    preview: 'Please complete the design challenge for the UI/UX Designer position. Deadline is 5 days from now.',
    time: '1d ago',
    actionLabel: 'View Assignment',
    actionType: 'brand',
    urgency: 'deadline',
  },
  {
    id: '3',
    title: 'Video Introduction Request - Software Wallet',
    company: 'Software Wallet',
    preview: 'Congratulations on your selection! Please record a video introduction and share your portfolio for the team.',
    time: '5m ago',
    actionLabel: 'Record Video',
    actionType: 'brand',
    urgency: 'action',
  },
  {
    id: '4',
    title: 'Application Received - Metaplex Studios',
    company: 'Metaplex Studios',
    preview: 'Thank you for applying to Design System Lead. We\'ll review your application and get back to you within 3-5 business days.',
    time: '3d ago',
    urgency: 'info',
  },
]

const columns: ApplicationStatus[] = ['Matched Job', 'Introduced', 'In Interviews', 'Placed', 'Rejected']

const statusColors: Record<ApplicationStatus, string> = {
  'All': '',
  'Matched Job': 'text-brand',
  'Introduced': 'text-blue-400',
  'In Interviews': 'text-yellow-400',
  'Placed': 'text-green-400',
  'Rejected': 'text-red-400',
}

const statusBg: Record<ApplicationStatus, string> = {
  'All': '',
  'Matched Job': 'bg-brand/5',
  'Introduced': 'bg-blue-400/5',
  'In Interviews': 'bg-yellow-400/5',
  'Placed': 'bg-green-400/5',
  'Rejected': 'bg-red-400/5',
}

const statusTooltips: Record<ApplicationStatus, string> = {
  'All': '',
  'Matched Job': 'Jobs matched to your profile by our team',
  'Introduced': 'Your profile has been shared with the hiring team',
  'In Interviews': 'You are actively interviewing for this role',
  'Placed': 'Congratulations! You have been placed in this role',
  'Rejected': 'Unfortunately this application was not successful',
}

const urgencyConfig: Record<Message['urgency'], { border: string; icon: typeof RiAlertLine; iconColor: string }> = {
  action: { border: 'border-l-brand', icon: RiAlertLine, iconColor: 'text-brand' },
  deadline: { border: 'border-l-brand', icon: RiCalendarLine, iconColor: 'text-brand' },
  info: { border: 'border-l-brand', icon: RiInformationLine, iconColor: 'text-brand' },
}

export default function ApplicationTrackerPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<ApplicationStatus>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set())
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  // Compute real tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      'All': mockApplications.length,
      'Matched Job': 0,
      'Introduced': 0,
      'In Interviews': 0,
      'Placed': 0,
      'Rejected': 0,
    }
    mockApplications.forEach(app => {
      if (app.status !== 'All') counts[app.status]++
    })
    return counts
  }, [])

  // Filter applications by search query
  const filteredApplications = useMemo(() => {
    return mockApplications.filter(app => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!app.title.toLowerCase().includes(q) && !app.company.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [searchQuery])

  // Filter columns shown based on active tab
  const visibleColumns = activeTab === 'All' ? columns : columns.filter(c => c === activeTab)

  const handleMarkAllRead = () => {
    setReadMessages(new Set(messages.map(m => m.id)))
  }

  const handleMessageAction = (msgId: string, _actionLabel: string) => {
    setCompletedActions(prev => new Set(prev).add(msgId))
    setReadMessages(prev => new Set(prev).add(msgId))
  }

  const handleDismissMessage = (msgId: string) => {
    setMessages(prev => prev.filter(m => m.id !== msgId))
  }

  return (
    <PageShell user={user}>
      <motion.div variants={fadeUp} className="flex flex-col gap-4 px-4 md:px-8">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-text-primary tracking-[-0.36px]">Open Applications</h1>
          <p className="text-[13px] text-text-secondary tracking-[-0.078px] leading-[1.54]">
            Track your application progress through each stage
          </p>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <TabGroup
            tabs={[
              { label: 'All', value: 'All', count: tabCounts['All'] },
              ...columns.map(col => ({ label: col, value: col, count: tabCounts[col] }))
            ]}
            activeTab={activeTab}
            onChange={(v) => setActiveTab(v as ApplicationStatus)}
            className="flex-1"
          />
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search by company or keyword..."
            className="w-full lg:w-[280px]"
          />
        </div>

        <p className="text-xs text-text-muted">
          {activeTab === 'All' ? `Showing all ${filteredApplications.length} applications` : `Showing ${visibleColumns.length > 0 ? filteredApplications.filter(a => a.status === activeTab).length : 0} ${activeTab.toLowerCase()} applications`}
        </p>
      </motion.div>

      {/* Kanban Board */}
      <motion.div variants={fadeUp} className="px-4 md:px-8 pb-4">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className={cn(
          'grid gap-3',
          activeTab === 'All'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
            : 'grid-cols-1 max-w-[400px]'
        )}>
          {visibleColumns.map(col => {
            const colApps = filteredApplications.filter(a => a.status === col)
            return (
              <motion.div key={col} variants={listItem} className={cn('flex flex-col gap-3 p-2', statusBg[col])}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-sm font-medium', statusColors[col])}>{col}</span>
                    <div className="relative group">
                      <RiInformationLine size={14} className="text-text-muted cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-bg-card border border-border text-xs text-text-secondary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                        {statusTooltips[col]}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-card" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted">{colApps.length}</span>
                </div>
                {colApps.length === 0 ? (
                  <div className="bg-bg-card/50 border border-dashed border-border p-4 flex flex-col items-center gap-2">
                    <RiFileTextLine size={20} className="text-text-muted/40" />
                    <p className="text-xs text-text-muted">No applications</p>
                  </div>
                ) : (
                  colApps.map(app => (
                    <div key={app.id} className="bg-bg-card p-3 flex flex-col gap-2 border border-border hover:border-brand/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <Avatar name={app.company} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{app.title}</p>
                          <p className="text-xs text-text-secondary truncate">{app.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <RiTimeLine size={12} />
                        <span>{app.lastUpdate}</span>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Message Center */}
      <motion.div variants={fadeUp} className="px-4 md:px-8 pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-medium text-text-primary">Message Center</h3>
              <p className="text-[13px] text-text-secondary">Updates and action items for your applications</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-brand hover:text-brand">Mark All Read</Button>
              <span className="text-xs text-text-muted hidden sm:inline">{messages.length} messages</span>
            </div>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-4">
            {messages.length === 0 ? (
              <EmptyState icon={RiCheckLine} message="All caught up! No pending messages." />
            ) : (
              messages.map(msg => {
                const uc = urgencyConfig[msg.urgency]
                const UrgencyIcon = uc.icon
                const isRead = readMessages.has(msg.id)
                const isDone = completedActions.has(msg.id)
                return (
                  <motion.div key={msg.id} variants={listItem} className={cn('bg-bg-secondary border-l-4 p-3 flex flex-col gap-2.5 transition-opacity', uc.border, isRead && 'opacity-60')}>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-1">
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <RiCheckLine size={14} className="text-green-400 shrink-0" />
                          ) : (
                            <UrgencyIcon size={14} className={cn(uc.iconColor, 'shrink-0')} />
                          )}
                          <h4 className="text-sm font-medium text-text-primary">{msg.title}</h4>
                        </div>
                        <p className="text-[13px] text-text-secondary leading-[1.54]">{msg.preview}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <span className="flex items-center gap-1 text-xs text-green-400 whitespace-nowrap">
                            <RiCheckLine size={12} />
                            Done
                          </span>
                        ) : (
                          <span className="text-xs text-text-muted whitespace-nowrap">{msg.time}</span>
                        )}
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDismissMessage(msg.id)} title="Dismiss"><RiCloseLine size={14} /></Button>
                      </div>
                    </div>
                    {msg.actionLabel && (
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <Button size="sm" variant="applied">
                            <RiCheckLine size={14} />
                            Done
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={msg.actionType === 'brand' ? 'primary' : 'secondary'}
                            onClick={() => setSelectedMessage(msg)}
                          >
                            {msg.actionLabel === 'Record Video' && <RiVideoLine size={14} />}
                            {msg.actionLabel === 'Book Interview' && <RiCheckLine size={14} />}
                            {msg.actionLabel}
                          </Button>
                        )}
                        {msg.secondaryLabel && !isDone && (
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="text-sm text-text-secondary hover:text-text-primary cursor-pointer"
                          >
                            {msg.secondaryLabel}
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </div>
      </motion.div>
      {selectedMessage && (
        <MessageDetailPanel
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          isDone={completedActions.has(selectedMessage.id)}
          onAction={(id, label) => {
            handleMessageAction(id, label)
            setSelectedMessage(null)
          }}
        />
      )}
    </PageShell>
  )
}
