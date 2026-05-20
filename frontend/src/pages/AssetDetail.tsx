import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { ASSET_STATUS_STYLES } from '@/lib/utils'
import { useIsAdmin } from '@/stores/auth'
import AssetForm from '@/components/assets/AssetForm'
import type { Asset, Attachment } from '@/types'

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>()
  const qc      = useQueryClient()
  const isAdmin = useIsAdmin()
  const [showEdit, setShowEdit]     = useState(false)
  const [uploading, setUploading]   = useState(false)

  const { data: asset, isLoading } = useQuery<Asset & { attachments?: Attachment[] }>({
    queryKey: ['assets', id],
    queryFn: () => api.get(`/assets/${id}`).then(r => r.data),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: (attachId: string) => api.delete(`/attachments/${attachId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets', id] }),
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    await api.post(`/attachments/asset/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['assets', id] })
    setUploading(false)
  }

  if (isLoading) return (
    <div style={{ padding: 24 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ height: 60, background: '#f3f4f6', borderRadius: 10, marginBottom: 10 }} />
      ))}
    </div>
  )

  if (!asset) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: '#9ca3af', marginBottom: 8 }}>ไม่พบ Asset</p>
      <Link to="/assets" style={{ color: '#2563eb', fontSize: 13 }}>← กลับไปหน้า Assets</Link>
    </div>
  )

  const card = (label: string, value: string | number | null | undefined) => (
    <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 10, padding: '12px 16px' }}>
      <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#111827', margin: 0 }}>{value ?? '—'}</p>
    </div>
  )

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb + Header */}
      <div style={{ marginBottom: 16 }}>
        <Link to="/assets" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Assets</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: '0 0 6px' }}>{asset.name}</h2>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99,
                border: '1px solid #e5e7eb', textTransform: 'capitalize' }}
                className={ASSET_STATUS_STYLES[asset.status]}>
                {asset.status.replace('_', ' ')}
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'capitalize' }}>{asset.category}</span>
            </div>
          </div>
          {isAdmin && (
            <button onClick={() => setShowEdit(true)} style={{
              background: '#fff', color: '#374151', border: '1px solid #e5e7eb',
              borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer',
            }}>แก้ไข</button>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginBottom: 16 }}>
        {card('Serial Number', asset.serial_number)}
        {card('เจ้าของ', asset.owner?.name)}
        {card('สถานที่', asset.location)}
        {card('วันที่ซื้อ', asset.purchase_date)}
        {card('ราคา', asset.purchase_price ? `฿${Number(asset.purchase_price).toLocaleString()}` : null)}
      </div>

      {/* Specs */}
      {asset.specs && Object.keys(asset.specs).length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 8px', textTransform: 'uppercase' }}>Specifications</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries(asset.specs).map(([k, v]) => (
              <div key={k}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{k}: </span>
                <span style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {asset.description && (
        <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase' }}>หมายเหตุ</p>
          <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{asset.description}</p>
        </div>
      )}

      {/* Attachments */}
      <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f9fafb',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0 }}>ไฟล์แนบ</p>
          <label style={{
            background: '#eff6ff', color: '#2563eb', borderRadius: 6, padding: '5px 10px',
            fontSize: 12, cursor: 'pointer', fontWeight: 500,
          }}>
            {uploading ? 'กำลังอัปโหลด...' : '+ แนบไฟล์'}
            <input type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={handleUpload}
              style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>

        {!asset.attachments || asset.attachments.length === 0 ? (
          <p style={{ padding: '20px 16px', color: '#9ca3af', fontSize: 13, textAlign: 'center' }}>
            ยังไม่มีไฟล์แนบ
          </p>
        ) : (
          <div style={{ padding: '8px 16px' }}>
            {asset.attachments.map((att: Attachment) => (
              <div key={att.id} style={{ display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid #f9fafb' }}>
                <div style={{ width: 32, height: 32, background: '#f3f4f6', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {att.mime_type.startsWith('image/') ? '🖼️' : '📄'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {att.original_name}
                  </p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{att.human_size}</p>
                </div>
                <a href={att.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', flexShrink: 0 }}>
                  ดาวน์โหลด
                </a>
                {isAdmin && (
                  <button onClick={() => deleteMutation.mutate(att.id)}
                    style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                    ลบ
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showEdit && <AssetForm asset={asset} onClose={() => setShowEdit(false)} />}
    </div>
  )
}
