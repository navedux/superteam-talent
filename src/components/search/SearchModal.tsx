import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  RiSearchLine,
  RiCloseLine,
  RiArrowRightSLine,
  RiBriefcaseLine,
  RiBookOpenLine,
  RiCompassLine,
  RiFileTextLine,
  RiTimeLine,
  RiCornerDownLeftLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiHomeLine,
  RiUser3Line,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiHistoryLine,
  RiDeleteBinLine,
} from '@remixicon/react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ROUTES, API_ENDPOINTS } from '@/lib/constants'
import { cn } from '@/lib/cn'
import type { Job } from '@/types/jobs'

/* ─── Data ─── */

interface SearchResult {
  id: string
  type: 'job' | 'article' | 'page' | 'application'
  title: string
  subtitle: string
  meta?: string
  url: string
  external?: boolean
  icon?: 'job' | 'article' | 'page' | 'application'
}

// Navigation pages
const PAGES: SearchResult[] = [
  { id: 'page-home', type: 'page', title: 'Home', subtitle: 'Dashboard & notifications', url: ROUTES.HOME, icon: 'page' },
  { id: 'page-jobs', type: 'page', title: 'Job Board', subtitle: 'Browse open positions', url: ROUTES.JOBS, icon: 'page' },
  { id: 'page-apps', type: 'page', title: 'Application Tracker', subtitle: 'Track your applications', url: ROUTES.APPLICATIONS, icon: 'page' },
  { id: 'page-playbook', type: 'page', title: 'Job Playbook', subtitle: 'Career resources & guides', url: ROUTES.PLAYBOOK, icon: 'page' },
  { id: 'page-profile', type: 'page', title: 'Talent Profile', subtitle: 'Your profile & portfolio', url: ROUTES.PROFILE, icon: 'page' },
]

// Playbook articles
const ARTICLES: SearchResult[] = [
  { id: 'art-1', type: 'article', title: 'Building Proof of Work: The Key to Breaking into Web3', subtitle: 'Pre-Application', meta: '5 min read', url: 'https://superteam.fun/blog/building-proof-of-work', external: true },
  { id: 'art-2', type: 'article', title: 'Growing Your Twitter Audience in Web3', subtitle: 'Pre-Application', meta: '6 min read', url: 'https://superteam.fun/blog/growing-twitter-audience', external: true },
  { id: 'art-3', type: 'article', title: 'Building a Career as a Blockchain Developer', subtitle: 'Pre-Application', meta: '8 min read', url: 'https://superteam.fun/blog/blockchain-developer-career', external: true },
  { id: 'art-4', type: 'article', title: 'Writing a Great CV: A Guide to Standing Out', subtitle: 'Application', meta: '5 min read', url: 'https://superteam.fun/blog/great-cv-guide', external: true },
  { id: 'art-5', type: 'article', title: 'GitHub for Job-Seeking Developers', subtitle: 'Application', meta: '4 min read', url: 'https://superteam.fun/blog/github-for-developers', external: true },
  { id: 'art-6', type: 'article', title: 'How to Prepare for Interviews', subtitle: 'Interviews', meta: '7 min read', url: 'https://superteam.fun/blog/interview-preparation', external: true },
  { id: 'art-7', type: 'article', title: '30 Interview Questions to Ask', subtitle: 'Interviews', meta: '6 min read', url: 'https://superteam.fun/blog/interview-questions', external: true },
  { id: 'art-8', type: 'article', title: 'Acing the Machine Coding Interview', subtitle: 'Interviews', meta: '10 min read', url: 'https://superteam.fun/blog/machine-coding-interview', external: true },
  { id: 'art-9', type: 'article', title: 'The 10 Commandments of Salary Negotiation', subtitle: 'Negotiations', meta: '5 min read', url: 'https://superteam.fun/blog/salary-negotiation', external: true },
  { id: 'art-10', type: 'article', title: 'Web3 Salary Guide: Understanding Compensation', subtitle: 'Negotiations', meta: '8 min read', url: 'https://superteam.fun/blog/web3-salary-guide', external: true },
  { id: 'art-11', type: 'article', title: 'Understanding Token Compensation in Web3', subtitle: 'Negotiations', meta: '7 min read', url: 'https://superteam.fun/blog/token-compensation', external: true },
]

// Applications (static mock, same as ApplicationTrackerPage)
const APPLICATIONS: SearchResult[] = [
  { id: 'app-1', type: 'application', title: 'Senior UX Architect', subtitle: 'Helius · Matched Job', url: ROUTES.APPLICATIONS },
  { id: 'app-2', type: 'application', title: 'Senior UX Architect', subtitle: 'Metaplex Studios · Matched Job', url: ROUTES.APPLICATIONS },
  { id: 'app-3', type: 'application', title: 'Senior UX Architect', subtitle: 'Marinade Studios · Matched Job', url: ROUTES.APPLICATIONS },
  { id: 'app-6', type: 'application', title: 'Senior UX Architect', subtitle: 'Malik Studios · Introduced', url: ROUTES.APPLICATIONS },
  { id: 'app-8', type: 'application', title: 'Senior UX Architect', subtitle: 'Malik Studios · In Interviews', url: ROUTES.APPLICATIONS },
  { id: 'app-10', type: 'application', title: 'Senior UX Architect', subtitle: 'Metaplex Studios · Placed', url: ROUTES.APPLICATIONS },
]

/* ─── Category config ─── */

const categoryConfig: Record<SearchResult['type'], { label: string; Icon: typeof RiBriefcaseLine }> = {
  page: { label: 'Pages', Icon: RiCompassLine },
  job: { label: 'Jobs', Icon: RiBriefcaseLine },
  article: { label: 'Playbook', Icon: RiBookOpenLine },
  application: { label: 'Applications', Icon: RiFileTextLine },
}

const RECENT_KEY = 'st-recent-searches'
const MAX_RECENT = 5

/* ─── Component ─── */

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [jobs, setJobs] = useState<Job[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load jobs
  useEffect(() => {
    fetch(API_ENDPOINTS.JOBS)
      .then(r => r.json())
      .then((data: Job[]) => setJobs(data))
      .catch(() => {})
  }, [])

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {}
  }, [open])

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Convert jobs to SearchResults
  const jobResults: SearchResult[] = useMemo(() => {
    return jobs.map(j => ({
      id: `job-${j.id}`,
      type: 'job' as const,
      title: j.title,
      subtitle: j.company,
      meta: `${j.location} · ${j.compensation}`,
      url: `${ROUTES.JOBS}?q=${encodeURIComponent(j.title)}`,
    }))
  }, [jobs])

  // Filtered + ranked results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    const allItems = [...PAGES, ...jobResults, ...ARTICLES, ...APPLICATIONS]

    return allItems
      .map(item => {
        const titleMatch = item.title.toLowerCase().includes(q)
        const subtitleMatch = item.subtitle.toLowerCase().includes(q)
        const metaMatch = item.meta?.toLowerCase().includes(q) ?? false

        // Score: title match = 3, subtitle = 2, meta = 1
        let score = 0
        if (titleMatch) score += 3
        if (subtitleMatch) score += 2
        if (metaMatch) score += 1

        // Only apply bonuses if there's a base match
        if (score > 0) {
          // Boost pages (always useful for navigation)
          if (item.type === 'page') score += 1
          // Starts-with bonus
          if (item.title.toLowerCase().startsWith(q)) score += 2
        }

        return { ...item, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
  }, [query, jobResults])

  // Group results by type for display
  const grouped = useMemo(() => {
    const groups: { type: SearchResult['type']; label: string; items: SearchResult[] }[] = []
    const order: SearchResult['type'][] = ['page', 'job', 'article', 'application']

    for (const type of order) {
      const items = results.filter(r => r.type === type)
      if (items.length > 0) {
        groups.push({ type, label: categoryConfig[type].label, items })
      }
    }
    return groups
  }, [results])

  // Flat list for keyboard navigation
  const flatResults = useMemo(() => grouped.flatMap(g => g.items), [grouped])

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Save recent search
  const saveRecent = useCallback((term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }, [recentSearches])

  const clearRecent = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_KEY)
  }, [])

  // Navigate to a result
  const handleSelect = useCallback((result: SearchResult) => {
    if (query.trim()) saveRecent(query.trim())
    onClose()

    if (result.external) {
      window.open(result.url, '_blank', 'noopener,noreferrer')
    } else {
      navigate(result.url)
    }
  }, [query, saveRecent, onClose, navigate])

  // Handle recent search click
  const handleRecentClick = useCallback((term: string) => {
    setQuery(term)
    inputRef.current?.focus()
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && flatResults[activeIndex]) {
      e.preventDefault()
      handleSelect(flatResults[activeIndex])
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  const showRecent = !query && recentSearches.length > 0
  const showQuickLinks = !query && !showRecent
  const showResults = query.trim().length > 0
  const noResults = showResults && flatResults.length === 0

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] sm:pt-[16vh] px-4"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-[600px] bg-bg-secondary border border-border shadow-2xl flex flex-col overflow-hidden max-h-[70vh]">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <RiSearchLine size={20} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search jobs, articles, pages..."
            className="flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-muted outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="text-text-muted hover:text-text-primary cursor-pointer p-0.5"
            >
              <RiCloseLine size={18} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 border border-border text-[10px] text-text-muted font-mono">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {/* Quick links (no query, no recent) */}
          {showQuickLinks && (
            <div className="p-2">
              <div className="px-3 py-2">
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">Quick Navigation</span>
              </div>
              {PAGES.map((page, i) => (
                <QuickLinkItem
                  key={page.id}
                  result={page}
                  active={false}
                  onClick={() => handleSelect(page)}
                />
              ))}
            </div>
          )}

          {/* Recent searches */}
          {showRecent && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">Recent Searches</span>
                <button
                  onClick={clearRecent}
                  className="text-[11px] text-text-muted hover:text-text-primary cursor-pointer flex items-center gap-1"
                >
                  <RiDeleteBinLine size={11} />
                  Clear
                </button>
              </div>
              {recentSearches.map(term => (
                <button
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-bg-card transition-colors cursor-pointer"
                >
                  <RiHistoryLine size={16} className="text-text-muted shrink-0" />
                  <span className="text-sm text-text-secondary">{term}</span>
                  <RiArrowRightSLine size={14} className="ml-auto text-text-muted" />
                </button>
              ))}

              <div className="border-t border-border mt-2 pt-2">
                <div className="px-3 py-2">
                  <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">Quick Navigation</span>
                </div>
                {PAGES.map(page => (
                  <QuickLinkItem
                    key={page.id}
                    result={page}
                    active={false}
                    onClick={() => handleSelect(page)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {showResults && !noResults && (
            <div className="p-2">
              {grouped.map(group => {
                const { Icon } = categoryConfig[group.type]
                return (
                  <div key={group.type}>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Icon size={13} className="text-text-muted" />
                      <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{group.label}</span>
                      <span className="text-[11px] text-text-muted/60">{group.items.length}</span>
                    </div>
                    {group.items.map(item => {
                      const globalIdx = flatResults.indexOf(item)
                      return (
                        <ResultItem
                          key={item.id}
                          result={item}
                          query={query}
                          active={globalIdx === activeIndex}
                          index={globalIdx}
                          onClick={() => handleSelect(item)}
                          onHover={() => setActiveIndex(globalIdx)}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div className="flex flex-col items-center gap-3 py-12 px-4">
              <RiSearchLine size={32} className="text-text-muted/30" />
              <div className="text-center">
                <p className="text-sm text-text-secondary">No results for &quot;{query}&quot;</p>
                <p className="text-xs text-text-muted mt-1">Try searching for jobs, articles, or page names</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-bg-primary/50">
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="flex items-center gap-0.5">
              <kbd className="inline-flex items-center justify-center w-4 h-4 bg-white/5 border border-border text-[9px] font-mono"><RiArrowUpLine size={9} /></kbd>
              <kbd className="inline-flex items-center justify-center w-4 h-4 bg-white/5 border border-border text-[9px] font-mono"><RiArrowDownLine size={9} /></kbd>
            </span>
            Navigate
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <kbd className="inline-flex items-center justify-center h-4 px-1 bg-white/5 border border-border text-[9px] font-mono"><RiCornerDownLeftLine size={9} /></kbd>
            Select
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <kbd className="inline-flex items-center justify-center h-4 px-1 bg-white/5 border border-border text-[9px] font-mono">ESC</kbd>
            Close
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Quick Link Item ─── */

const pageIcons: Record<string, typeof RiHomeLine> = {
  'Home': RiHomeLine,
  'Job Board': RiBriefcaseLine,
  'Application Tracker': RiFileTextLine,
  'Job Playbook': RiBookOpenLine,
  'Talent Profile': RiUser3Line,
}

function QuickLinkItem({ result, active, onClick }: {
  result: SearchResult
  active: boolean
  onClick: () => void
}) {
  const Icon = pageIcons[result.title] ?? RiCompassLine

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer',
        active ? 'bg-bg-card' : 'hover:bg-bg-card'
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 bg-white/5 border border-border shrink-0">
        <Icon size={16} className="text-text-muted" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-text-primary">{result.title}</span>
        <span className="text-xs text-text-muted truncate">{result.subtitle}</span>
      </div>
      <RiArrowRightSLine size={16} className="text-text-muted/40 shrink-0" />
    </button>
  )
}

/* ─── Search Result Item ─── */

function ResultItem({ result, query, active, index, onClick, onHover }: {
  result: SearchResult
  query: string
  active: boolean
  index: number
  onClick: () => void
  onHover: () => void
}) {
  const typeIcon = {
    job: RiBriefcaseLine,
    article: RiBookOpenLine,
    page: RiCompassLine,
    application: RiFileTextLine,
  }
  const Icon = typeIcon[result.type]

  return (
    <button
      data-index={index}
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer',
        active ? 'bg-bg-card' : 'hover:bg-bg-card/50'
      )}
    >
      {result.type === 'job' ? (
        <Avatar name={result.subtitle} size="sm" square />
      ) : (
        <div className="flex items-center justify-center w-8 h-8 bg-white/5 border border-border shrink-0">
          <Icon size={15} className="text-text-muted" />
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm text-text-primary truncate">
          <HighlightMatch text={result.title} query={query} />
        </span>
        <div className="flex items-center gap-2 text-xs text-text-muted truncate">
          <span className="truncate">
            <HighlightMatch text={result.subtitle} query={query} />
          </span>
          {result.meta && (
            <>
              <span className="text-text-muted/30">·</span>
              <span className="shrink-0">{result.meta}</span>
            </>
          )}
        </div>
      </div>

      {active && (
        <div className="flex items-center gap-1 shrink-0">
          <kbd className="inline-flex items-center justify-center h-5 px-1.5 bg-white/5 border border-border text-[10px] text-text-muted font-mono">
            <RiCornerDownLeftLine size={10} />
          </kbd>
        </div>
      )}
      {result.external && !active && (
        <Badge variant="default" className="text-[10px] shrink-0">External</Badge>
      )}
    </button>
  )
}

/* ─── Highlight matching text ─── */

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-brand font-medium">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}
