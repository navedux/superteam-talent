import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiCloseLine, RiCheckLine, RiArrowLeftLine } from '@remixicon/react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Divider } from '@/components/ui/Divider'
import { ROUTES } from '@/lib/constants'

type View = 'login' | 'forgot' | 'forgot-sent'

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [error] = useState('')
  const [toast, setToast] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password).catch(() => {})
    navigate(ROUTES.HOME)
  }

  const handleSocialLogin = (provider: string) => {
    setToast(`${provider} login coming soon!`)
    setTimeout(() => setToast(''), 3000)
  }

  const handleForgotPassword = (e: FormEvent) => {
    e.preventDefault()
    if (forgotEmail) {
      setView('forgot-sent')
    }
  }

  // Forgot Password views
  if (view === 'forgot' || view === 'forgot-sent') {
    return (
      <div className="flex flex-col justify-between h-full p-8">
        {/* Header */}
        <div className="flex items-center">
          <img src="/ST_LOGO.webp" alt="Superteam Talent" className="h-5" />
        </div>

        {/* Center */}
        <div className="flex flex-col items-center w-full max-w-[392px] mx-auto gap-6">
          {view === 'forgot-sent' ? (
            <>
              <div className="w-12 h-12 bg-success/20 flex items-center justify-center">
                <RiCheckLine size={24} className="text-success" />
              </div>
              <div className="flex flex-col gap-3 items-center">
                <h2 className="font-heading text-2xl font-medium text-text-primary text-center">Check your email</h2>
                <p className="text-base text-text-secondary text-center leading-[1.5]">
                  We sent a password reset link to <span className="text-text-primary">{forgotEmail}</span>
                </p>
              </div>
              <Button size="lg" fullWidth onClick={() => { setView('login'); setForgotEmail('') }}>
                Back to Login
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 items-center w-full">
                <h2 className="font-heading text-2xl font-medium text-text-primary text-center">Reset Password</h2>
                <p className="text-base text-text-secondary text-center leading-[1.5]">
                  Enter your email and we'll send you a reset link
                </p>
              </div>
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-3 w-full">
                <Input
                  label="Email"
                  required
                  type="email"
                  placeholder="hello@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  icon={<RiMailLine size={20} />}
                />
                <Button type="submit" size="lg" fullWidth className="py-2.5">
                  Send Reset Link
                </Button>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <RiArrowLeftLine size={14} />
                  Back to Login
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-text-secondary tracking-[-0.084px] leading-[1.43]">&copy; 2025 SolanaHire. Built on Solana.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between h-full p-8 relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-bg-card border border-border px-4 py-2 text-sm text-text-primary z-50 flex items-center gap-2 shadow-lg">
          {toast}
          <button onClick={() => setToast('')} className="text-text-muted hover:text-text-primary cursor-pointer">
            <RiCloseLine size={14} />
          </button>
        </div>
      )}

      {/* Header - Logo */}
      <div className="flex items-center">
        <img src="/ST_LOGO.webp" alt="Superteam Talent" className="h-5" />
      </div>

      {/* Center - Form content, exactly 392px wide */}
      <div className="flex flex-col items-center w-full max-w-[392px] mx-auto gap-6">
        {/* Title Section */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-col gap-3 items-center">
            <h2 className="font-heading text-2xl font-medium text-text-primary text-center w-full">Welcome Back</h2>
            <p className="text-base text-text-secondary tracking-[-0.176px] leading-[1.5] text-center w-full">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        {/* Social Buttons - horizontal, 12px gap */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => handleSocialLogin('GitHub')}
            className="flex-1 flex items-center justify-center bg-bg-input border border-border py-2.5 shadow-input hover:bg-bg-card transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="white">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </button>
          <button
            onClick={() => handleSocialLogin('Google')}
            className="flex-1 flex items-center justify-center bg-bg-input border border-border py-2.5 shadow-input hover:bg-bg-card transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.8 10.2c0-.63-.06-1.24-.16-1.82H10v3.44h4.38a3.74 3.74 0 01-1.62 2.46v2.04h2.63A7.96 7.96 0 0017.8 10.2z" fill="#4285F4"/>
              <path d="M10 18c2.2 0 4.04-.73 5.39-1.97l-2.63-2.04c-.73.49-1.66.77-2.76.77-2.12 0-3.92-1.43-4.56-3.36H2.72v2.1A8 8 0 0010 18z" fill="#34A853"/>
              <path d="M5.44 11.4A4.8 4.8 0 015.18 10c0-.49.1-.96.26-1.4V6.5H2.72A8 8 0 002 10c0 1.29.31 2.51.72 3.5l2.72-2.1z" fill="#FBBC05"/>
              <path d="M10 5.24c1.2 0 2.27.41 3.11 1.22l2.33-2.33C14.03 2.84 12.2 2 10 2a8 8 0 00-7.28 4.5l2.72 2.1C6.08 6.67 7.88 5.24 10 5.24z" fill="#EA4335"/>
            </svg>
          </button>
        </div>

        {/* OR Divider */}
        <Divider text="or" className="w-full" />

        {/* Form Fields - 12px gap between email and password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <Input
            label="Email"
            type="text"
            placeholder="hello@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<RiMailLine size={20} />}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={<RiLockLine size={20} />}
            rightIcon={
              showPassword
                ? <RiEyeOffLine size={20} onClick={() => setShowPassword(false)} />
                : <RiEyeLine size={20} onClick={() => setShowPassword(true)} />
            }
          />

          {error && <p className="text-sm text-error">{error}</p>}

          {/* Keep logged in + Forgot password — same row */}
          <div className="flex items-center justify-between">
            <Checkbox
              label="Keep me logged in"
              checked={keepLoggedIn}
              onChange={e => setKeepLoggedIn(e.target.checked)}
            />
            <button
              type="button"
              onClick={() => setView('forgot')}
              className="text-sm font-medium text-brand tracking-[-0.084px] leading-[1.43] hover:underline cursor-pointer whitespace-nowrap"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button — padding 10px, Space Grotesk 18px */}
          <Button type="submit" size="lg" fullWidth isLoading={isLoading} className="py-2.5">
            Login
          </Button>

          {/* Sign Up Row — space_between, 12px gap */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-text-secondary tracking-[-0.084px] leading-[1.43]">
              Don&apos;t have an account?
            </span>
            <Button
              type="button"
              variant="brand-muted"
              size="sm"
              className="px-1.5 py-1.5"
              onClick={() => navigate(ROUTES.ONBOARDING)}
            >
              Register
            </Button>
          </div>
        </form>
      </div>

      {/* Footer — centered, 12px gap between rows */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap justify-center text-sm tracking-[-0.084px] leading-[1.43]">
          <span className="text-text-secondary">By continuing, you agree to our</span>
          <span className="text-brand cursor-pointer hover:underline">Terms of Service</span>
          <span className="text-text-secondary">and</span>
          <span className="text-brand cursor-pointer hover:underline">Privacy Policy</span>
        </div>
        <p className="text-sm text-text-secondary tracking-[-0.084px] leading-[1.43]">&copy; 2025 SolanaHire. Built on Solana.</p>
      </div>
    </div>
  )
}
