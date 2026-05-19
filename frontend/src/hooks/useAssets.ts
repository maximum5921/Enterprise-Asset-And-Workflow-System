import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetsApi, type AssetFilters } from '@/api/assets'
import type { Asset } from '@/types'

export const assetKeys = {
  all:     ['assets'] as const,
  lists:   () => [...assetKeys.all, 'list'] as const,
  list:    (f: AssetFilters) => [...assetKeys.lists(), f] as const,
  details: () => [...assetKeys.all, 'detail'] as const,
  detail:  (id: string) => [...assetKeys.details(), id] as const,
}

export const useAssets = (filters: AssetFilters = {}) =>
  useQuery({
    queryKey: assetKeys.list(filters),
    queryFn:  () => assetsApi.list(filters),
    staleTime: 30_000,
  })

export const useAsset = (id: string) =>
  useQuery({
    queryKey: assetKeys.detail(id),
    queryFn:  () => assetsApi.get(id),
    enabled:  !!id,
  })

export const useCreateAsset = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assetsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: assetKeys.lists() }),
  })
}

export const useUpdateAsset = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Asset> }) =>
      assetsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: assetKeys.lists() })
      qc.invalidateQueries({ queryKey: assetKeys.detail(id) })
    },
  })
}

export const useDeleteAsset = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assetsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: assetKeys.lists() }),
  })
}

export const useAssignAsset = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: number }) =>
      assetsApi.assign(id, userId),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: assetKeys.lists() })
      qc.invalidateQueries({ queryKey: assetKeys.detail(id) })
    },
  })
}