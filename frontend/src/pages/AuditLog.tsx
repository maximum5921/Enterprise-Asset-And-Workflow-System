import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

const ACTION_STYLE: Record<string, string> = {
  'asset.created':     '#dcfce7',
  'asset.updated':     '#fef9c3',
  'asset.deleted':     '#fee2e2',
  'asset.assigned':    '#dbeafe',
  'workflow.created':  '#f3e8ff',
  'workflow.approved': '#dcfce7',
  'workflow.rejected': '#fee2e2',
  'workflow.completed':'#dbeafe',
  'user.login':        '#f1f5f9',
}

export default function AuditLog() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => api.get('/audit-logs', { params: { page, per_page: 20 } }).then(r => r.data),
  })

  const logs = data?.data ?? []

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>Audit Log</h2>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>ประวัติการกระทำทั้งหมดในระบบ</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 12, overflow: 'hidden' }}>
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #f9fafb',
              display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, background: '#f3f4f6', borderRadius: 4, width: '40%', marginBottom: 6 }} />
                <div style={{ height: 10, background: '#f3f4f6', borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          ))
        ) : logs.length === 0 ? (
          <p style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>ยังไม่มี log</p>
        ) : logs.map((log: any) => (
          <div key={log.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f9fafb',
            display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {/* Icon */}
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: ACTION_STYLE[log.action] ?? '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {log.action?.startsWith('asset') ? '📦' :
               log.action?.startsWith('workflow') ? '🔄' :
               log.action?.startsWith('user') ? '👤' : '📝'}
            </div>
            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0 }}>
                    {log.user?.name ?? 'System'}
                    <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>
                      {log.action?.replace('.', ' ')}
                    </span>
                  </p>
                  {log.meta && Object.keys(log.meta).length > 0 && (
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>
                      {JSON.stringify(log.meta).slice(0, 80)}
                    </p>
                  )}
                  {log.ip_address && (
                    <p style={{ fontSize: 11, color: '#d1d5db', margin: '2px 0 0' }}>IP: {log.ip_address}</p>
                  )}
                </div>
                <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {new Date(log.created_at).toLocaleString('th-TH', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 16px', borderTop: '1px solid #f3f4f6', background: '#f9fafb' }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              หน้า {data.current_page} / {data.last_page}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ fontSize: 12, padding: '4px 12px', border: '1px solid #e5e7eb',
                  borderRadius: 6, cursor: 'pointer', background: '#fff', opacity: page === 1 ? 0.4 : 1 }}>
                ← ก่อนหน้า
              </button>
              <button disabled={page === data.last_page} onClick={() => setPage(p => p + 1)}
                style={{ fontSize: 12, padding: '4px 12px', border: '1px solid #e5e7eb',
                  borderRadius: 6, cursor: 'pointer', background: '#fff',
                  opacity: page === data.last_page ? 0.4 : 1 }}>
                ถัดไป →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
