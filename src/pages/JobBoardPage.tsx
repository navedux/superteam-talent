import { useEffect, useState, useMemo } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiMapPinLine, RiMoneyDollarCircleLine, RiTimeLine, RiBookmarkLine, RiEyeOffLine, RiBriefcaseLine, RiCheckLine } from '@remixicon/react'
import { PageShell } from '@/components/layout/PageShell'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { API_ENDPOINTS } from '@/lib/constants'
import { cn } from '@/lib/cn'
import type { Job } from '@/types/jobs'

const filterOptions: Record<string, string[]> = {
  Company: ['Helius', 'Marinade Studios', 'Jupiter', 'Tensor', 'Squads', 'Solana Foundation'],
  Category: ['Full-Time', 'Part-Time', 'Contract', 'Bounty'],
  Location: ['Remote', 'San Francisco', 'New York', 'Singapore'],
  Newest: ['Newest First', 'Oldest First'],
}

export default function JobBoardPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>(['Remote', 'Full-Time'])
  const [searchQuery, setSearchQuery] = useState('')
  const [hiddenJobs, setHiddenJobs] = useState<Set<string>>(new Set())
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    fetch(API_ENDPOINTS.JOBS)
      .then(res => res.json())
      .then((data: Job[]) => {
        setJobs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
  }

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters(prev => [...prev, filter])
    }
    setOpenDropdown(null)
  }

  const toggleDropdown = (cat: string) => {
    setOpenDropdown(prev => prev === cat ? null : cat)
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Hidden jobs
      if (hiddenJobs.has(job.id)) return false
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matches = job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.skills.some(s => s.toLowerCase().includes(q)) ||
          job.description.toLowerCase().includes(q)
        if (!matches) return false
      }
      // Active filters
      if (activeFilters.length > 0) {
        const matchesAny = activeFilters.some(f => {
          const fl = f.toLowerCase()
          return job.location.toLowerCase().includes(fl) ||
            job.type.toLowerCase() === fl ||
            job.company.toLowerCase() === fl
        })
        // If there are filters but "Newest First" or "Oldest First" are the only ones, don't filter
        const nonSortFilters = activeFilters.filter(f => f !== 'Newest First' && f !== 'Oldest First')
        if (nonSortFilters.length > 0 && !matchesAny) return false
      }
      return true
    })
  }, [jobs, searchQuery, activeFilters, hiddenJobs])

  const visibleJobs = filteredJobs.slice(0, visibleCount)
  const hasMore = visibleCount < filteredJobs.length

  const handleHide = (id: string) => {
    setHiddenJobs(prev => new Set(prev).add(id))
  }

  const handleApply = (id: string) => {
    setAppliedJobs(prev => new Set(prev).add(id))
  }

  const handleSave = (id: string) => {
    setSavedJobs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <PageShell user={user}>
      <div className="flex flex-col gap-4 px-4 md:px-8">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-text-primary tracking-[-0.36px]">Browse Open Jobs</h1>
          <p className="text-[13px] text-text-secondary tracking-[-0.078px] leading-[1.54]">
            Discover opportunities in the Solana ecosystem &middot; {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <SearchInput value={searchQuery} onValueChange={setSearchQuery} placeholder="Search by role, company, or keyword..." className="flex-1" />
            <div className="flex flex-wrap gap-2 md:gap-4">
              {Object.keys(filterOptions).map(cat => (
                <div key={cat} className="relative flex-1 md:flex-none">
                  <button
                    onClick={() => toggleDropdown(cat)}
                    className={cn(
                      'flex items-center gap-1 bg-bg-input border border-border px-3 py-2.5 text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap w-full md:w-[150px]',
                      openDropdown === cat && 'text-text-primary border-brand'
                    )}
                  >
                    {cat}
                    <RiArrowRightSLine size={14} className={cn('ml-auto transition-transform', openDropdown === cat && 'rotate-90')} />
                  </button>
                  {openDropdown === cat && (
                    <div className="absolute top-full left-0 mt-1 w-full md:w-[200px] bg-bg-card border border-border z-20 shadow-lg">
                      {filterOptions[cat].map(opt => (
                        <button
                          key={opt}
                          onClick={() => addFilter(opt)}
                          className={cn(
                            'w-full text-left px-3 py-2 text-sm hover:bg-bg-secondary transition-colors cursor-pointer',
                            activeFilters.includes(opt) ? 'text-brand' : 'text-text-secondary'
                          )}
                        >
                          {opt}
                          {activeFilters.includes(opt) && <RiCheckLine size={14} className="inline ml-2" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-text-primary tracking-[-0.084px]">Active filters:</span>
              {activeFilters.map(filter => (
                <Badge key={filter} variant="filter" onDismiss={() => removeFilter(filter)}>{filter}</Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])}>Clear All</Button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {openDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
      )}

      {/* Job Cards */}
      <div className="flex flex-col gap-4 px-4 md:px-8 pb-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-bg-secondary p-4 h-40 animate-pulse" />
          ))
        ) : filteredJobs.length === 0 ? (
          <EmptyState icon={RiBriefcaseLine} message="No jobs match your search criteria" actionLabel="Reset Filters" onAction={() => { setSearchQuery(''); setActiveFilters([]); setHiddenJobs(new Set()) }} />
        ) : (
          visibleJobs.map(job => (
            <div key={job.id} className="bg-bg-elevated p-1 flex flex-col">
              <div className="bg-bg-secondary p-3 flex flex-col gap-2.5">
                {/* Header row */}
                <div className="flex items-start gap-2.5">
                  <Avatar name={job.company} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-medium text-text-primary">{job.title}</h3>
                      {job.status && (
                        <Badge variant={job.status === 'Paid' ? 'brand' : 'outline'}>{job.status}</Badge>
                      )}
                    </div>
                    <p className="text-[13px] text-text-secondary">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleSave(job.id)} className={cn(savedJobs.has(job.id) ? 'text-brand' : 'text-text-muted', 'hidden sm:flex')} title={savedJobs.has(job.id) ? 'Unsave' : 'Save'}><RiBookmarkLine size={18} /></Button>
                    <Button variant="secondary" size="sm" className="hidden sm:flex">
                      More Info
                      <RiArrowRightSLine size={14} />
                    </Button>
                    {appliedJobs.has(job.id) ? (
                      <Button size="sm" variant="applied">
                        <RiCheckLine size={14} />
                        Applied
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleApply(job.id)}>
                        Submit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-text-secondary tracking-[-0.078px] leading-[1.54]">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {job.skills.map(skill => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center justify-between px-3 py-2 flex-wrap gap-2">
                <div className="flex items-center gap-3 md:gap-4 text-xs text-text-muted flex-wrap">
                  <span className="flex items-center gap-1">
                    <RiMapPinLine size={12} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <RiMoneyDollarCircleLine size={12} /> {job.compensation}
                  </span>
                  <span className="flex items-center gap-1">
                    <RiBriefcaseLine size={12} /> {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <RiTimeLine size={12} /> Posted {job.postedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" onClick={() => handleHide(job.id)}><RiEyeOffLine size={14} /> <span className="text-xs">Hide</span></Button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={() => setVisibleCount(prev => prev + 4)}><RiArrowLeftSLine size={20} className="text-white" /> <span className="px-1">Load More ({filteredJobs.length - visibleCount} remaining)</span> <RiArrowRightSLine size={20} className="text-text-secondary" /></Button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
