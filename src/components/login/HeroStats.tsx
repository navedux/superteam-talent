import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/motion'

export function HeroStats() {
  const stats = [
    { value: '2,000+', label: 'Active Jobs' },
    { value: '2,000', label: 'Hiring Partner' },
    { value: '2,000', label: 'Placements' },
  ]

  return (
    <motion.div
      className="flex flex-col gap-6 w-full max-w-[472px]"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.h1 variants={fadeUp} className="font-heading text-3xl xl:text-[42px] font-medium leading-[1.1] text-text-primary">
        Your Portal Into The Solana Ecosystem
      </motion.h1>

      <motion.p variants={fadeUp} className="text-base text-text-secondary leading-[1.5] tracking-[-0.176px]">
        A talent platform that helps you discover, apply and fast track your career on chain
      </motion.p>

      {/* Stats - gap 24px between items, gap 12px between number and label */}
      <motion.div variants={fadeUp} className="flex flex-col gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-3 w-full max-w-[448px]">
            <span className="font-heading text-3xl xl:text-[42px] font-medium text-brand leading-none">{stat.value}</span>
            <span className="text-base font-medium text-text-secondary tracking-[-0.176px] leading-[1.5]">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
