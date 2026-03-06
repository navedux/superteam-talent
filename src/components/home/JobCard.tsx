import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  RiMapPinLine,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiBookmarkLine,
  RiIndeterminateCircleLine,
} from '@remixicon/react'
import type { Job } from '@/types/jobs'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-bg-elevated p-1 flex flex-col">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-bg-secondary p-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar name={job.company} size="lg" />
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-medium text-text-primary truncate">{job.title}</h4>
            <p className="text-[13px] text-text-secondary">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="icon-sm">
            <RiBookmarkLine size={20} />
          </Button>
          <Button size="sm">Submit Profile</Button>
        </div>
      </div>

      {/* Bottom section — meta + hide */}
      <div className="flex items-center gap-4 px-1 py-1">
        <div className="flex items-center gap-4 text-xs font-medium text-text-secondary flex-wrap">
          <span className="flex items-center gap-1 p-0.5">
            <RiMapPinLine size={18} className="text-text-secondary" /> {job.location}
          </span>
          <span className="flex items-center gap-1 p-0.5">
            <RiMoneyDollarCircleLine size={18} className="text-text-secondary" /> {job.compensation}
          </span>
          <span className="flex items-center gap-1 p-0.5">
            <RiTimeLine size={18} className="text-text-secondary" /> {job.type}
          </span>
        </div>
        <div className="flex items-center gap-1 p-0.5 text-xs font-medium text-text-secondary ml-auto cursor-pointer hover:text-text-primary transition-colors">
          <RiIndeterminateCircleLine size={18} className="text-text-secondary" />
          Hide
        </div>
      </div>
    </div>
  )
}
