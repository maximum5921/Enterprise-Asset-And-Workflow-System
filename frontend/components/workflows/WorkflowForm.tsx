import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useCreateWorkflow } from '@/hooks/useWorkflows'
import { useAssets } from '@/hooks/useAssets'

const schema = z.object({
  type:     z.enum(['borrow','repair','purchase','transfer','return']),
  title:    z.string().min(1,'กรุณากรอกหัวข้อ'),
  reason:   z.string().min(10,'กรอกเหตุผลอย่างน้อย 10 ตัวอักษร'),
  asset_id: z.string().optional(),
  priority: z.coerce.number().int().min(1).max(3).default(2),
})
type FormData = z.infer<typeof schema>

export default function WorkflowForm({ onClose }: { onClose: () => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type:'borrow', priority: 2 },
  })
  const { mutate, isPending } = useCreateWorkflow()
  const { data: assets } = useAssets({ status: 'available', per_page: 100 })
  const type = watch('type')

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-base font-semibold">สร้างคำขอใหม่</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(d => mutate(d, { onSuccess: onClose }))} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ประเภท</label>
              <select {...register('type')} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['borrow','repair','purchase','transfer','return'].map(t=>(
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select {...register('priority')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value={1}>Urgent</option>
                <option value={2}>Normal</option>
                <option value={3}>Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">หัวข้อ</label>
            <input {...register('title')} placeholder="เช่น ขอยืม MacBook Pro สำหรับงาน..."
              className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {['borrow','repair','transfer','return'].includes(type) && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Asset</label>
              <select {...register('asset_id')} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">-- เลือก Asset --</option>
                {assets?.data.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.serial_number})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">เหตุผล</label>
            <textarea {...register('reason')} rows={3} placeholder="อธิบายความจำเป็น..."
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">
              ยกเลิก
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
              {isPending ? 'กำลังส่ง...' : 'ส่งคำขอ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}