import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'
import type { AuthResponse } from '@/types'

const schema = z.object({
  email:    z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})
type LoginForm = z.infer<typeof schema>

export default function Login() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore(s => s.setAuth)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: LoginForm) =>
      api.post<AuthResponse>('/auth/login', data).then(r => r.data),
    onSuccess: ({ user, access_token }) => {
      setAuth(user, access_token)
      navigate('/dashboard', { replace: true })
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border shadow-sm p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">ลงชื่อเข้าใช้</h1>
        <p className="text-sm text-gray-500 mb-6">Enterprise Asset System</p>

        <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input {...register('email')} type="email" placeholder="admin@enterprise.local"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input {...register('password')} type="password" placeholder="••••••••"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">
              อีเมลหรือรหัสผ่านไม่ถูกต้อง
            </p>
          )}

          <button type="submit" disabled={isPending}
            className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {isPending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  )
}