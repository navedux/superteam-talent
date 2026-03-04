import { SplitLayout } from '@/components/layout/SplitLayout'
import { HeroStats } from '@/components/login/HeroStats'
import { LoginForm } from '@/components/login/LoginForm'

export default function LoginPage() {
  return (
    <SplitLayout
      left={<HeroStats />}
      right={<LoginForm />}
    />
  )
}
