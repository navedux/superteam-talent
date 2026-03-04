export function HeroStats() {
  const stats = [
    { value: '2,000+', label: 'Active Jobs' },
    { value: '2,000', label: 'Hiring Partner' },
    { value: '2,000', label: 'Placements' },
  ]

  return (
    <div className="flex flex-col gap-6 w-full max-w-[472px]">
      <h1 className="font-heading text-3xl xl:text-[42px] font-medium leading-[1.1] text-text-primary">
        Your Portal Into The Solana Ecosystem
      </h1>

      <p className="text-base text-text-secondary leading-[1.5] tracking-[-0.176px]">
        A talent platform that helps you discover, apply and fast track your career on chain
      </p>

      {/* Stats - gap 24px between items, gap 12px between number and label */}
      <div className="flex flex-col gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-3 w-full max-w-[448px]">
            <span className="font-heading text-3xl xl:text-[42px] font-medium text-brand leading-none">{stat.value}</span>
            <span className="text-base font-medium text-text-secondary tracking-[-0.176px] leading-[1.5]">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
