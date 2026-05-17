import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useCreateAsset, useUpdateAsset } from '@/hooks/useAssets'
import type { Asset } from '@/types'

const schema = z.object({
  name:           z.string().min(1, 'กรุณากรอกชื่อ'),
  serial_number:  z.string().min(1, 'กรุณากรอก Serial Number'),
  category:       z.enum(['computer','monitor','server','printer','equipment','other']),
  status:         z.enum(['available','in_use','maintenance','retired']).optional(),
  location:       z.string().optional(),
  purchase_price: z.coerce.number().optional(),
  description:    z.string().optional(),
})
type AssetFormData = z.infer<typeof schema>

interface Props {
  asset?: Asset
  onClose: () => void
}

export default function AssetForm({ asset, onClose }: Props) {
  const createMutation = useCreateAsset()
  const updateMutation = useUpdateAsset()
  const isEdit = !!asset

  const { register, handleSubmit, formState: { errors } } = useForm<AssetFormData>({
    resolver: zodResolver(schema),
    defaultValues: asset ?? { status: 'available' },
  })

  const onSubmit = (data: AssetFormData) => {
    const mutation = isEdit
      ? updateMutation.mutate({ id: asset!.id, data }, { onSuccess: onClose })
      : createMutation.mutate(data, { onSuccess: onClose })
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-base font-semibold">{isEdit ? 'แก้ไข' : 'เพิ่ม'} Asset</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ชื่อ Asset</label>
              <input {...register('name')} className="w-full border rounded-lg px-3 py-2 text-sm" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Serial Number</label>
              <input {...register('serial_number')} className="w-full border rounded-lg px-3 py-2 text-sm" />
              {errors.serial_number && <p className="text-red-500 text-xs mt-1">{errors.serial_number.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select {...register('category')} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['computer','monitor','server','printer','equipment','other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select {...register('status')} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['available','in_use','maintenance','retired'].map(s => (
                  <option key={s} value={s}>{s.replace('_',' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
            <input {...register('location')} placeholder="เช่น Office Floor 3"
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ราคา (บาท)</label>
            <input {...register('purchase_price')} type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">
              ยกเลิก
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {isPending ? 'กำลังบันทึก...' : isEdit ? 'อัปเดต' : 'สร้าง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}