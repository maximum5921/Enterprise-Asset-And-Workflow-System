import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, GitMerge, Users, LogOut } from 'lucide-react'
import { useAuthStore, useIsAdmin } from '@/stores/auth'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assets',    icon: Package,         label: 'Assets' },
  { to: '/workflows', icon: GitMerge,        label: 'Workflows' },
]

export default function AppLayout() {
  const navigate  = useNavigate()
  const user      = useAuthStore(s => s.user)
  const logout    = useAuthStore(s => s.logout)
  const isAdmin   = useIsAdmin()

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {})
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-sm font-semibold text-gray-900">Enterprise System</h1>
          <p className="text-xs text-gray-500 mt-0.5">{user?.role.display_name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100')}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/users" className={({ isActive }) =>
              cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100')}>
              <Users size={16} /> Users
            </NavLink>
          )}
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-2 px-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
              {user?.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={14} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}