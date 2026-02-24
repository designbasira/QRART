import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/components/auth/auth-provider'
import { AuthGuard } from '@/components/auth/auth-guard'
import { RoleGuard } from '@/components/auth/role-guard'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'

// Public pages
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { ScanPage } from '@/pages/scan'

// Auth pages
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { AuthCallbackPage } from '@/pages/auth-callback'

// User pages
import { UserDashboardPage } from '@/pages/user/dashboard'
import { UserDesignsPage } from '@/pages/user/designs'
import { UserDesignDetailPage } from '@/pages/user/design-detail'
import { UserIntegrationsPage } from '@/pages/user/integrations'
import { UserSettingsPage } from '@/pages/user/settings'
import { UserSubscriptionPage } from '@/pages/user/subscription'
import { DesignStudioPage } from '@/pages/user/design-studio'
import { PodPage } from '@/pages/user/pod'
import { EtsyPage } from '@/pages/user/etsy'

// Admin pages
import { AdminDashboardPage } from '@/pages/admin/dashboard'
import { AdminDesignsPage } from '@/pages/admin/designs'
import { AdminDesignDetailPage } from '@/pages/admin/design-detail'
import { AdminUsersPage } from '@/pages/admin/users'
import { AdminCreatePage } from '@/pages/admin/create'

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/scan/:id" element={<ScanPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Auth routes (login/signup) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* User dashboard (protected) */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/user" element={<UserDashboardPage />} />
            <Route path="/user/designs" element={<UserDesignsPage />} />
            <Route path="/user/designs/:id" element={<UserDesignDetailPage />} />
            <Route path="/user/integrations" element={<UserIntegrationsPage />} />
            <Route path="/user/settings" element={<UserSettingsPage />} />
            <Route path="/user/subscription" element={<UserSubscriptionPage />} />
            <Route path="/user/studio" element={<DesignStudioPage />} />
            <Route path="/user/pod" element={<PodPage />} />
            <Route path="/user/etsy" element={<EtsyPage />} />
          </Route>
        </Route>

        {/* Admin dashboard (protected + admin role) */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard role="admin" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/designs" element={<AdminDesignsPage />} />
              <Route path="/admin/designs/:id" element={<AdminDesignDetailPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/create" element={<AdminCreatePage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
