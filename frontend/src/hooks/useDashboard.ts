import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })