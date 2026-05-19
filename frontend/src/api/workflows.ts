import { api } from '@/lib/axios'

export interface WorkflowFilters {
  status?: string
  type?: string
}

export const workflowsApi = {
  list: async (filters: WorkflowFilters = {}) => {
    const res = await api.get('/workflows', {
      params: filters,
    })

    return res.data
  },

  get: async (id: string) => {
    const res = await api.get(`/workflows/${id}`)
    return res.data
  },

  create: async (data: unknown) => {
    const res = await api.post('/workflows', data)
    return res.data
  },

  approve: async (id: string, notes = '') => {
    const res = await api.post(`/workflows/${id}/approve`, {
      notes,
    })

    return res.data
  },

  reject: async (id: string, reason: string) => {
    const res = await api.post(`/workflows/${id}/reject`, {
      reason,
    })

    return res.data
  },
}