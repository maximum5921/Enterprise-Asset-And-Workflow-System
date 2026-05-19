import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workflowsApi, type WorkflowFilters } from '@/api/workflows'

export const useWorkflows = (filters: WorkflowFilters = {}) =>
  useQuery({
    queryKey: ['workflows', filters],
    queryFn:  () => workflowsApi.list(filters),
    staleTime: 15_000,
  })

export const useWorkflow = (id: string) =>
  useQuery({
    queryKey: ['workflows', id],
    queryFn:  () => workflowsApi.get(id),
    enabled:  !!id,
  })

const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['workflows'] })
  qc.invalidateQueries({ queryKey: ['assets'] })
  qc.invalidateQueries({ queryKey: ['dashboard'] })
}

export const useCreateWorkflow = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: workflowsApi.create,
    onSuccess: () => invalidateAll(qc),
  })
}

export const useApproveWorkflow = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      workflowsApi.approve(id, notes),
    onSuccess: () => invalidateAll(qc),
  })
}

export const useRejectWorkflow = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      workflowsApi.reject(id, reason),
    onSuccess: () => invalidateAll(qc),
  })
}