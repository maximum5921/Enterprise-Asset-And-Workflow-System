import { useState } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { useWorkflows, useApproveWorkflow, useRejectWorkflow } from '@/hooks/useWorkflows'
import { useIsManager } from '@/stores/auth'
import { cn, WORKFLOW_STATUS_STYLES, PRIORITY_LABEL } from '@/lib/utils'
import { format } from 'date-fns'
import WorkflowForm from '@/components/workflows/WorkflowForm'
import WorkflowTimeline from '@/components/workflows/WorkflowTimeline'

const STATUS_TABS = ['','pending','approved','rejected','completed']

export default function Workflows() {
  const isManager    = useIsManager()
  const [status, setStatus]       = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [selected, setSelected]   = useState<string|null>(null)
  const [approveNote, setNote]    = useState('')
  const [rejectReason, setReason] = useState('')

  const { data, isLoading } = useWorkflows({ status })
  const approveMutation        = useApproveWorkflow()
  const rejectMutation         = useRejectWorkflow()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Workflows</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={15} /> สร้างคำขอ
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              status===s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            {s || 'ทั้งหมด'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? [...Array(4)].map((_,i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        )) : data?.data.map((wf: any) => (
          <div key={wf.id}
            className="bg-white rounded-xl border shadow-sm p-4 hover:border-blue-200 transition-colors cursor-pointer"
            onClick={() => setSelected(selected===wf.id ? null : wf.id)}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',
                    WORKFLOW_STATUS_STYLES[wf.status as keyof typeof WORKFLOW_STATUS_STYLES])}>
                    {wf.status}
                  </span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full',
                    PRIORITY_LABEL[wf.priority as keyof typeof PRIORITY_LABEL]?.style)}>
                    {PRIORITY_LABEL[wf.priority as keyof typeof PRIORITY_LABEL]?.label}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">{wf.type}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{wf.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {wf.requester.name} · {format(new Date(wf.created_at), 'dd MMM yyyy HH:mm')}
                </p>
              </div>
              <ChevronDown size={16} className={cn('text-gray-400 transition-transform mt-1',
                selected===wf.id && 'rotate-180')} />
            </div>

            {/* Expanded */}
            {selected===wf.id && (
              <div className="mt-4 pt-4 border-t space-y-3" onClick={e => e.stopPropagation()}>
                <p className="text-sm text-gray-600">{wf.reason}</p>
                {wf.asset && (
                  <div className="text-xs bg-gray-50 rounded-lg p-3 border">
                    <p className="font-medium text-gray-700">Asset: {wf.asset.name}</p>
                    <p className="text-gray-500 mt-0.5">{wf.asset.serial_number}</p>
                  </div>
                )}

                <WorkflowTimeline logs={wf.logs ?? []} />

                {/* Approve / Reject (manager only, pending only) */}
                {isManager && wf.status==='pending' && (
                  <div className="flex gap-3 pt-2">
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={approveNote}
                        onChange={e => setNote(e.target.value)}
                        placeholder="หมายเหตุการอนุมัติ (ถ้ามี)"
                        rows={2}
                        className="w-full border rounded-lg px-3 py-2 text-xs resize-none" />
                      <button
                        onClick={() => approveMutation.mutate({ id: wf.id, notes: approveNote }, { onSuccess: () => { setSelected(null); setNote('') } })}
                        disabled={approveMutation.isPending}
                        className="w-full bg-green-600 text-white rounded-lg py-2 text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                        ✓ อนุมัติ
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={rejectReason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="เหตุผลที่ปฏิเสธ (จำเป็น)"
                        rows={2}
                        className="w-full border rounded-lg px-3 py-2 text-xs resize-none" />
                      <button
                        onClick={() => rejectMutation.mutate({ id: wf.id, reason: rejectReason }, { onSuccess: () => { setSelected(null); setReason('') } })}
                        disabled={rejectMutation.isPending || !rejectReason}
                        className="w-full bg-red-600 text-white rounded-lg py-2 text-xs font-medium hover:bg-red-700 disabled:opacity-50">
                        ✕ ปฏิเสธ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && <WorkflowForm onClose={() => setShowForm(false)} />}
    </div>
  )
}