import { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { SearchModal } from '@/components/search/SearchModal'
import { RiSearchLine } from '@remixicon/react'
import type { User } from '@/types/auth'

interface UserHeaderProps {
  user: User | null
}

export function UserHeader({ user }: UserHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  // CMD+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!user) return null

  return (
    <>
      <div className="flex items-center gap-4 p-4 overflow-hidden">
        <Avatar name={user.name} size="lg" />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h2 className="text-lg font-medium text-text-primary tracking-[-0.27px]">{user.name}</h2>
          <p className="text-sm text-text-secondary">Welcome back to Talent</p>
        </div>
        <Button variant="secondary" size="icon" onClick={() => setSearchOpen(true)} title="Search (⌘K)">
          <RiSearchLine size={20} />
        </Button>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
