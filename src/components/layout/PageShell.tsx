import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiMenuLine } from '@remixicon/react'
import { AppSidebar } from './AppSidebar'
import { Button } from '@/components/ui/Button'
import { UserHeader } from '@/components/home/SupportCard'
import { staggerContainer, fadeIn } from '@/lib/motion'
import type { User } from '@/types/auth'

interface PageShellProps {
  user: User | null
  children: React.ReactNode
}

export function PageShell({ user, children }: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg-secondary">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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

        <motion.div
          className="flex flex-col gap-4 border-t border-l border-r border-border overflow-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeIn}>
            <UserHeader user={user} />
          </motion.div>
          {children}
        </motion.div>
      </main>
    </div>
  )
}
