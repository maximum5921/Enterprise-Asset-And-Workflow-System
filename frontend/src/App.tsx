import { Routes, Route, Navigate } from 'react-router-dom'

import { useAuthStore } from '@/stores/auth'

import AppLayout from '@/components/layout/AppLayout'

import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Assets from '@/pages/Assets'
import AssetDetail from '@/pages/AssetDetail'
import Workflows from '@/pages/Workflows'
import Users from '@/pages/Users'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  return isAuthenticated
    ? <>{children}</>
    : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = useAuthStore(
    s => s.user?.role?.name === 'admin'
  )

  return isAdmin
    ? <>{children}</>
    : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="assets"
          element={<Assets />}
        />

        <Route
          path="assets/:id"
          element={<AssetDetail />}
        />

        <Route
          path="workflows"
          element={<Workflows />}
        />

        <Route
          path="users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  )
}