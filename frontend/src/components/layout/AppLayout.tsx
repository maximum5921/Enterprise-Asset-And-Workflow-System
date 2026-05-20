import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore, useIsAdmin } from '@/stores/auth'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  emoji: '📊' },
  { to: '/assets',     label: 'Assets',     emoji: '📦' },
  { to: '/workflows',  label: 'Workflows',  emoji: '🔄' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const user     = useAuthStore(s => s.user)
  const logout   = useAuthStore(s => s.logout)
  const isAdmin  = useIsAdmin()

  // pending badge
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data),
    refetchInterval: 30_000,
  })
  const pendingCount: number = stats?.workflows?.pending ?? 0

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {})
    logout()
    navigate('/login', { replace: true })
  }

  const navStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px', borderRadius: 8, marginBottom: 2,
    textDecoration: 'none', fontSize: 13,
    background: isActive ? '#eff6ff' : 'transparent',
    color: isActive ? '#1d4ed8' : '#6b7280',
    fontWeight: isActive ? 500 : 400,
    transition: 'all .15s',
  })

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #f3f4f6',
        display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: 16, borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🏢
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Enterprise</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{user?.role?.display_name}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 8 }}>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => navStyle(isActive)}>
              <span>{item.emoji}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.to === '/workflows' && pendingCount > 0 && (
                <span style={{ fontSize: 10, fontWeight: 600, background: '#dc2626',
                  color: '#fff', borderRadius: 99, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div style={{ height: 1, background: '#f3f4f6', margin: '8px 0' }} />
              <NavLink to="/users" style={({ isActive }) => navStyle(isActive)}>
                <span>👥</span> Users
              </NavLink>
              <NavLink to="/audit-logs" style={({ isActive }) => navStyle(isActive)}>
                <span>📋</span> Audit Log
              </NavLink>
            </>
          )}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: 12, borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#dbeafe',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: '#1d4ed8', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#111827', margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 10, color: '#9ca3af', margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '6px 8px', border: 'none', borderRadius: 6, fontSize: 12,
            background: 'transparent', color: '#9ca3af', cursor: 'pointer', textAlign: 'left',
          }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#fef2f2'; b.style.color = '#dc2626' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'transparent'; b.style.color = '#9ca3af' }}>
            🚪 ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', background: '#f9fafb' }}>
        <Outlet />
      </main>
    </div>
  )
}
