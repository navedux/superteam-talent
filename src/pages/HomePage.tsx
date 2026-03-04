import { useState } from 'react'
import { RiMenuLine, RiImageLine } from '@remixicon/react'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Button } from '@/components/ui/Button'

import { UserHeader } from '@/components/home/SupportCard'
import { ProfileSection } from '@/components/home/ProfileSection'
import { NotificationPanel } from '@/components/home/NotificationPanel'
import { JobListings } from '@/components/home/JobListings'
import { useAuth } from '@/context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg-secondary">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 ml-0 lg:ml-[272px] p-2 lg:p-3">
        {/* Mobile header bar */}
        <div className="flex items-center gap-3 p-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <RiMenuLine size={22} />
          </Button>
          <img src="/ST_LOGO.webp" alt="Superteam Talent" className="h-4" />
        </div>

        {/* Inner frame */}
        <div className="flex flex-col gap-4 border-t border-l border-r border-border overflow-hidden">
          {/* Header + Banner placeholder */}
          <div>
            <UserHeader user={user} />
            {/* Banner — empty state placeholder */}
            <div className="w-full h-[200px] border-l-4 border-r-4 border-brand overflow-hidden relative bg-bg-primary">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-muted">
                <RiImageLine size={32} />
                <span className="text-sm font-medium">Cover Image</span>
              </div>
            </div>
          </div>

          {/* Profile Section — cards + dropdowns + add experience */}
          <div className="px-4 md:px-4">
            <ProfileSection user={user} />
          </div>

          {/* Notifications */}
          <div className="px-4 md:px-4">
            <NotificationPanel />
          </div>

          {/* Job Listings */}
          <div className="px-4 md:px-4 pb-4">
            <JobListings />
          </div>
        </div>
      </main>
    </div>
  )
}
