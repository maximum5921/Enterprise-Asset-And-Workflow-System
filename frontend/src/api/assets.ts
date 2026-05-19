import { api } from '@/lib/axios'
import type { Asset, PaginatedResponse } from '@/types'

export interface AssetFilters {
  search?: string
  status?: string
  category?: string
  page?: number
  per_page?: number
}

export const assetsApi = {
  list: (filters: AssetFilters) =>
    api.get<PaginatedResponse<Asset>>('/assets', { params: filters })
       .then(r => r.data),

  get: (id: string) =>
    api.get<Asset>(`/assets/${id}`).then(r => r.data),

  create: (data: Partial<Asset>) =>
    api.post<Asset>('/assets', data).then(r => r.data),

  update: (id: string, data: Partial<Asset>) =>
    api.put<Asset>(`/assets/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/assets/${id}`),

  assign: (id: string, userId: number) =>
    api.post<Asset>(`/assets/${id}/assign`, { user_id: userId })
       .then(r => r.data),
}