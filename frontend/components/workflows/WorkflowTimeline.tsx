import { CheckCircle, XCircle, Clock, Play, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import type { WorkflowLog } from '@/types'

const ACTION_CONFIG = {
  created:   { icon: Play,         color: 'text-blue-500',  bg: 'bg-blue-50' },
  approved:  { icon: CheckCircle,  color: 'text-green-500', bg: 'bg-green-50' },
  rejected:  { icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50' },
  completed: { icon: CheckCircle,  color: 'text-blue-600',  bg: 'bg-blue-50' },
  cancelled: { icon: AlertCircle,  color: 'text-gray-500',  bg: 'bg-gray-50' },
  commented: { icon: Clock,        color: 'text-gray-500',  bg: 'bg-gray-50' },
} as const

export default function WorkflowTimeline({ logs }: { logs: WorkflowLog[] }) {
  if (!logs.length) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timeline</p>
      <div className="space-y-2">
        {logs.map((log, i) => {
          const cfg = ACTION_CONFIG[log.action as keyof typeof ACTION_CONFIG]
            ?? { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-50' }
          const Icon = cfg.icon
          return (
            <div key={log.id} className="flex items-start gap-2.5">
              <div className={`${cfg.bg} p-1.5 rounded-full mt-0.5 flex-shrink-0`}>
                <Icon size={12} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700">
                  <span className="font-medium">{log.actor?.name ?? 'System'}</span>
                  {' '}{log.action}
                </p>
                {log.notes && <p className="text-xs text-gray-500 mt-0.5">{log.notes}</p>}
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(new Date(log.created_at), 'dd MMM HH:mm')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}