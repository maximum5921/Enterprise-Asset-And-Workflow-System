import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { WorkflowRequest, PaginatedResponse } from '@/types'

const wfApi = {
  list: (p: Record<string,unknown>) =>
    api.get<PaginatedResponse<WorkflowRequest>>('/workflows', { params: p }).then(r=>r.data),
  get: (id: string) =>
    api.get<WorkflowRequest>(`/workflows/${id}`).then(r=>r.data),
  create: (d: Partial<WorkflowRequest>) =>
    api.post<WorkflowRequest>('/workflows', d).then(r=>r.data),
  approve: (id: string, notes: string) =>
    api.put<WorkflowRequest>(`/workflows/${id}/approve`, { notes }).then(r=>r.data),
  reject: (id: string, reason: string) =>
    api.put<WorkflowRequest>(`/workflows/${id}/reject`, { reason }).then(r=>r.data),
  complete: (id: string) =>
    api.put<WorkflowRequest>(`/workflows/${id}/complete`).then(r=>r.data),
}

export const useWorkflows = (params = {}) =>
  useQuery({
    queryKey: ['workflows', params],
    queryFn: () => wfApi.list(params),
    staleTime: 15_000,
  })

export const useWorkflow = (id: string) =>
  useQuery({
    queryKey: ['workflows', id],
    queryFn:  () => wfApi.get(id),
    enabled:  !!id,
  })

const invalidate = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['workflows'] })
  qc.invalidateQueries({ queryKey: ['assets'] })
  qc.invalidateQueries({ queryKey: ['dashboard'] })
}

export const useCreateWorkflow = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: wfApi.create,
    onSuccess: () => invalidate(qc),
  })
}

export const useApproveWorkflow = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      wfApi.approve(id, notes),
    onSuccess: () => invalidate(qc),
  })
}

export const useRejectWorkflow = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      wfApi.reject(id, reason),
    onSuccess: () => invalidate(qc),
  })
}