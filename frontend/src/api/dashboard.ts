import { api } from '@/lib/axios'

export const dashboardApi = {
  get: async () => {
    const res = await api.get('/dashboard')
    return res.data
  },
}