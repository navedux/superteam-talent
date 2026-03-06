import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { JobCard } from './JobCard'
import { RiBriefcase3Line, RiArrowRightSLine, RiSearchLine } from '@remixicon/react'
import { API_ENDPOINTS, ROUTES } from '@/lib/constants'
import { staggerContainer, listItem, fadeIn } from '@/lib/motion'
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
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-col gap-4"
              variants={fadeIn}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-bg-elevated p-4 h-24 animate-pulse" />
              ))}
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center gap-2 py-10"
              variants={fadeIn}
              initial="hidden"
              animate="show"
            >
              <RiSearchLine size={24} className="text-text-muted/40" />
              <p className="text-sm text-text-muted">No open positions right now</p>
              <p className="text-xs text-text-muted/60">Check back soon for new opportunities</p>
              <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.JOBS)} className="mt-1">
                Browse Job Board
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="jobs"
              className="flex flex-col gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {jobs.map(job => (
                <motion.div key={job.id} variants={listItem}>
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
