import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiMenuLine, RiImageLine } from '@remixicon/react'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Button } from '@/components/ui/Button'

import { UserHeader } from '@/components/home/SupportCard'
import { ProfileSection } from '@/components/home/ProfileSection'
import { NotificationPanel } from '@/components/home/NotificationPanel'
import { JobListings } from '@/components/home/JobListings'
import { useAuth } from '@/context/AuthContext'
import { staggerContainer, fadeUp, fadeIn } from '@/lib/motion'

/* ─────────────────────────────────────────────────────────
 * HOME PAGE — ANIMATION STORYBOARD
 *
 *    0ms   Page mounts, stagger container begins
 *   40ms   UserHeader fades in (quick, no movement)
 *  120ms   Banner image fades up
 *  200ms   Profile section slides up
 *  280ms   Notification panel slides up
 *  360ms   Job listings slides up
 *
 * Style: Subtle & professional — 10px rise, 350ms ease-out
 * ───────────────────────────────────────────────────────── */

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

        {/* Inner frame — staggered entrance */}
        <motion.div
          className="flex flex-col gap-4 border-t border-l border-r border-border overflow-hidden"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Header + Banner placeholder */}
          <div>
            <motion.div variants={fadeIn}>
              <UserHeader user={user} />
            </motion.div>
            {/* Banner — empty state placeholder */}
            <motion.div
              variants={fadeUp}
              className="w-full h-[200px] border-l-4 border-r-4 border-brand overflow-hidden relative bg-bg-primary"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-muted">
                <RiImageLine size={32} />
                <span className="text-sm font-medium">Cover Image</span>
              </div>
            </motion.div>
          </div>

          {/* Profile Section */}
          <motion.div variants={fadeUp} className="px-4 md:px-4">
            <ProfileSection user={user} />
          </motion.div>

          {/* Notifications */}
          <motion.div variants={fadeUp} className="px-4 md:px-4">
            <NotificationPanel />
          </motion.div>

          {/* Job Listings */}
          <motion.div variants={fadeUp} className="px-4 md:px-4 pb-4">
            <JobListings />
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
