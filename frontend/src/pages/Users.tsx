import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { User } from '@/types'

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  admin:    { bg: '#fef2f2', color: '#dc2626' },
  manager:  { bg: '#fffbeb', color: '#d97706' },
  employee: { bg: '#f0fdf4', color: '#059669' },
}

export default function Users() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [search, setSearch]     = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => api.get('/users', { params: { search, per_page: 50 } }).then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.put(`/users/${id}`, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const users: User[] = data?.data ?? []

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>Users</h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>ทั้งหมด {data?.total ?? 0} คน</p>
        </div>
        <button onClick={() => { setEditUser(null); setShowForm(true) }} style={{
          background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8,
          padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>+ เพิ่ม User</button>
      </div>

      <input placeholder="ค้นหาชื่อหรืออีเมล..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12, width: '100%', maxWidth: 360, border: '1px solid #e5e7eb',
          borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', display: 'block' }} />

      <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
              {['ชื่อ', 'อีเมล', 'Role', 'สถานะ', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px',
                  fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? [...Array(4)].map((_, i) => (
              <tr key={i}><td colSpan={5} style={{ padding: '12px 16px' }}>
                <div style={{ height: 14, background: '#f3f4f6', borderRadius: 4, width: '60%' }} />
              </td></tr>
            )) : users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dbeafe',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600, color: '#1d4ed8', flexShrink: 0 }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 99,
                    background: ROLE_STYLE[user.role?.name]?.bg ?? '#f3f4f6',
                    color: ROLE_STYLE[user.role?.name]?.color ?? '#374151' }}>
                    {user.role?.display_name ?? user.role?.name}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => toggleActive.mutate({ id: user.id, is_active: !user.is_active })}
                    style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 99,
                      border: 'none', cursor: 'pointer',
                      background: user.is_active ? '#f0fdf4' : '#fef2f2',
                      color: user.is_active ? '#059669' : '#dc2626' }}>
                    {user.is_active ? '● Active' : '● Inactive'}
                  </button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditUser(user); setShowForm(true) }}
                      style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      แก้ไข
                    </button>
                    <button onClick={() => { if (confirm(`ลบ ${user.name}?`)) deleteMutation.mutate(user.id) }}
                      style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <UserForm user={editUser} onClose={() => { setShowForm(false); setEditUser(null) }} />}
    </div>
  )
}

function UserForm({ user, onClose }: { user: User | null; onClose: () => void }) {
  const qc = useQueryClient()
  const isEdit = !!user
  const [form, setForm] = useState({
    name: user?.name ?? '', email: user?.email ?? '',
    password: '', role: user?.role?.name ?? 'employee',
  })
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: (data: typeof form) =>
      isEdit
        ? api.put(`/users/${user!.id}`, data).then(r => r.data)
        : api.post('/users', { ...data, password_confirmation: data.password }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); onClose() },
    onError: (err: any) => setError(err?.response?.data?.message ?? 'เกิดข้อผิดพลาด'),
  })

  const inp = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
    padding: '8px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }
  const lbl = { display: 'block', fontSize: 12, fontWeight: 500 as const, color: '#374151', marginBottom: 4 }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{isEdit ? 'แก้ไข' : 'เพิ่ม'} User</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>×</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); setError(''); mutation.mutate(form) }}
          style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={lbl}>ชื่อ-นามสกุล *</label>
            <input style={inp} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" /></div>
          <div><label style={lbl}>อีเมล *</label>
            <input style={inp} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@company.com" /></div>
          <div><label style={lbl}>{isEdit ? 'รหัสผ่านใหม่ (ปล่อยว่างถ้าไม่เปลี่ยน)' : 'รหัสผ่าน *'}</label>
            <input style={inp} type="password" required={!isEdit} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" /></div>
          <div><label style={lbl}>Role</label>
            <select style={inp} value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select></div>
          {error && <p style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', padding: '8px 12px', borderRadius: 6, margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, padding: 9, fontSize: 13, cursor: 'pointer', background: '#fff' }}>ยกเลิก</button>
            <button type="submit" disabled={mutation.isPending} style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: mutation.isPending ? 0.6 : 1 }}>
              {mutation.isPending ? 'กำลังบันทึก...' : isEdit ? 'อัปเดต' : 'สร้าง'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
