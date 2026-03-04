import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Agentation } from 'agentation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import LoginPage from '@/pages/LoginPage'
import OnboardingPage from '@/pages/OnboardingPage'
import HomePage from '@/pages/HomePage'
import JobBoardPage from '@/pages/JobBoardPage'
import ApplicationTrackerPage from '@/pages/ApplicationTrackerPage'
import JobPlaybookPage from '@/pages/JobPlaybookPage'
import TalentProfilePage from '@/pages/TalentProfilePage'
import { ROUTES } from '@/lib/constants'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.JOBS}
        element={
          <ProtectedRoute>
            <JobBoardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APPLICATIONS}
        element={
          <ProtectedRoute>
            <ApplicationTrackerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PLAYBOOK}
        element={
          <ProtectedRoute>
            <JobPlaybookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <TalentProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Agentation />
      </AuthProvider>
    </BrowserRouter>
  )
}
