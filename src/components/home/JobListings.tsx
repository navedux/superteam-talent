import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { JobCard } from './JobCard'
import { RiBriefcase3Line, RiArrowRightSLine } from '@remixicon/react'
import { API_ENDPOINTS, ROUTES } from '@/lib/constants'
import type { Job } from '@/types/jobs'

export function JobListings() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API_ENDPOINTS.JOBS)
      .then(res => res.json())
      .then((data: Job[]) => {
        setJobs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="border border-border">
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <RiBriefcase3Line size={24} className="text-brand shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-base font-medium text-text-primary">Open Ecosystem Positions</h3>
            <p className="text-[13px] text-text-secondary">Featured opportunities in the Solana ecosystem</p>
          </div>
          <Button size="sm" onClick={() => navigate(ROUTES.JOBS)}>
            View All Listings
            <RiArrowRightSLine size={18} />
          </Button>
        </div>

        {/* Job Cards */}
        <div className="flex flex-col gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-bg-elevated p-4 h-24 animate-pulse" />
            ))
          ) : (
            jobs.map(job => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  )
}
