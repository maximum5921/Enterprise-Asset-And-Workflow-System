import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useAssets, useDeleteAsset } from '@/hooks/useAssets'
import { useIsAdmin } from '@/stores/auth'
import { cn, ASSET_STATUS_STYLES } from '@/lib/utils'
import AssetForm from '@/components/assets/AssetForm'

const CATEGORIES = ['','computer','monitor','server','printer','equipment','other']
const STATUSES   = ['','available','in_use','maintenance','retired']

export default function Assets() {
  const isAdmin = useIsAdmin()
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ search:'', status:'', category:'', page:1 })

  const { data, isLoading } = useAssets(filters)
  const deleteMutation = useDeleteAsset()

  const set = (key: string, val: string) =>
    setFilters(f => ({ ...f, [key]: val, page: 1 }))

  return (
    <div className="p-6 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            ทั้งหมด {data?.total ?? 0} รายการ
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={15} /> เพิ่ม Asset
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="ค้นหาชื่อหรือ Serial Number..."
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => set('search', e.target.value)} />
        </div>
        <select className="border rounded-lg px-3 py-2 text-sm text-gray-600"
          onChange={e => set('status', e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Status'}</option>)}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm text-gray-600"
          onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Category'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['ชื่อ Asset','Category','Serial Number','สถานะ','เจ้าของ',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_,i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((_,j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.data.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/assets/${asset.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600">
                      {asset.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-gray-600">{asset.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                      {asset.serial_number}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full font-medium border',
                      ASSET_STATUS_STYLES[asset.status]
                    )}>
                      {asset.status.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {asset.owner?.name ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/assets/${asset.id}`}
                        className="text-xs text-blue-600 hover:underline">ดู</Link>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (confirm(`ลบ ${asset.name} ?`))
                              deleteMutation.mutate(asset.id)
                          }}
                          className="text-xs text-red-500 hover:underline">ลบ</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-xs text-gray-500">
              หน้า {data.current_page} จาก {data.last_page}
            </p>
            <div className="flex gap-2">
              <button disabled={data.current_page === 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                className="text-xs px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-100">
                ← ก่อนหน้า
              </button>
              <button disabled={data.current_page === data.last_page}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                className="text-xs px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-100">
                ถัดไป →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && <AssetForm onClose={() => setShowForm(false)} />}

    </div>
  )
}