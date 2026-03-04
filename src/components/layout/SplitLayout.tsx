import type { ReactNode } from 'react'

interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function SplitLayout({ left, right }: SplitLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-bg-primary p-2 lg:p-3">
      {/* Left panel - hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center p-8 xl:p-[50px] relative overflow-hidden">
        <img
          src="/Login.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
        />
        {/* Dark overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">{left}</div>
      </div>
      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-bg-secondary overflow-hidden border-8 border-bg-secondary">
        {right}
      </div>
    </div>
  )
}
