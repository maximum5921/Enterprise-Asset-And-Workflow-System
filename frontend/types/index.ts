export interface User {
  id: number
  name: string
  email: string
  role: Role
  is_active: boolean
  created_at: string
}

export interface Role {
  id: number
  name: 'admin' | 'manager' | 'employee'
  display_name: string
}

export interface Asset {
  id: string
  name: string
  serial_number: string
  category: 'computer'|'monitor'|'server'|'printer'|'equipment'|'other'
  status: 'available'|'in_use'|'maintenance'|'retired'
  location: string | null
  purchase_date: string | null
  purchase_price: number | null
  description: string | null
  specs: Record<string, string> | null
  owner: Pick<User,'id'|'name'> | null
  workflow_requests_count?: number
  created_at: string
}

export interface WorkflowRequest {
  id: string
  type: 'borrow'|'repair'|'purchase'|'transfer'|'return'
  status: 'pending'|'approved'|'rejected'|'completed'|'cancelled'
  title: string
  reason: string
  notes: string | null
  priority: 1|2|3
  requester: Pick<User,'id'|'name'|'email'>
  approver: Pick<User,'id'|'name'> | null
  asset: Asset | null
  logs?: WorkflowLog[]
  attachments?: Attachment[]
  attachments_count?: number
  approved_at: string | null
  created_at: string
}

export interface WorkflowLog {
  id: number
  action: string
  actor: Pick<User,'id'|'name'> | null
  notes: string | null
  created_at: string
}

export interface Attachment {
  id: string
  original_name: string
  mime_type: string
  size: number
  human_size: string
  url: string
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}