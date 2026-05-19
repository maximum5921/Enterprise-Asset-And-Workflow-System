<?php
namespace App\Services;

use App\Models\{WorkflowRequest, WorkflowLog, AuditLog, Asset, User};
use App\Jobs\SendWorkflowNotification;

class WorkflowService
{
    public function list(array $filters)
    {
        return WorkflowRequest::query()
            ->with(['requester','approver','asset'])
            ->withCount('attachments')
            ->when($filters['status'] ?? null, fn($q,$s) =>
                $q->where('status',$s))
            ->when($filters['type'] ?? null, fn($q,$t) =>
                $q->where('type',$t))
            ->when($filters['requester_id'] ?? null, fn($q,$id) =>
                $q->where('requester_id',$id))
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): WorkflowRequest
    {
        $req = WorkflowRequest::create([
            ...$data,
            'requester_id' => auth()->id(),
            'status'       => 'pending',
        ]);

        WorkflowLog::create([
            'workflow_request_id' => $req->id,
            'action'   => 'created',
            'actor_id' => auth()->id(),
            'notes'    => 'Request submitted',
        ]);

        AuditLog::record('workflow.created', $req);

        // แจ้ง manager ทุกคน (async via queue)
        SendWorkflowNotification::dispatch($req, 'created')
            ->onQueue('notifications');

        return $req->load(['requester','asset']);
    }

    public function approve(WorkflowRequest $req, string $notes = ''): WorkflowRequest
    {
        throw_unless($req->isPending(),
            Exception::class, 'Only pending requests can be approved.');

        $req->update([
            'status'      => 'approved',
            'approver_id' => auth()->id(),
            'approved_at' => now(),
            'notes'       => $notes,
        ]);

        WorkflowLog::create([
            'workflow_request_id' => $req->id,
            'action'   => 'approved',
            'actor_id' => auth()->id(),
            'notes'    => $notes,
        ]);

        // ถ้าเป็น borrow → update asset status
        if ($req->type === 'borrow' && $req->asset) {
            $req->asset->update([
                'status'   => 'in_use',
                'owner_id' => $req->requester_id,
            ]);
        }

        // ถ้าเป็น repair → update asset status
        if ($req->type === 'repair' && $req->asset) {
            $req->asset->update(['status' => 'maintenance']);
        }

        AuditLog::record('workflow.approved', $req);

        SendWorkflowNotification::dispatch($req, 'approved')
            ->onQueue('notifications');

        return $req->refresh()->load(['requester','approver','asset']);
    }

    public function reject(WorkflowRequest $req, string $reason): WorkflowRequest
    {
        throw_unless($req->isPending(),
            Exception::class, 'Only pending requests can be rejected.');

        $req->update([
            'status'      => 'rejected',
            'approver_id' => auth()->id(),
            'notes'       => $reason,
        ]);

        WorkflowLog::create([
            'workflow_request_id' => $req->id,
            'action'   => 'rejected',
            'actor_id' => auth()->id(),
            'notes'    => $reason,
        ]);

        AuditLog::record('workflow.rejected', $req);

        SendWorkflowNotification::dispatch($req, 'rejected')
            ->onQueue('notifications');

        return $req->refresh();
    }

    public function complete(WorkflowRequest $req): WorkflowRequest
    {
        $req->update([
            'status'       => 'completed',
            'completed_at' => now(),
        ]);

        // คืน asset กลับถ้าเป็น borrow
        if ($req->type === 'borrow' && $req->asset) {
            $req->asset->update([
                'status'   => 'available',
                'owner_id' => null,
            ]);
        }

        WorkflowLog::create([
            'workflow_request_id' => $req->id,
            'action'   => 'completed',
            'actor_id' => auth()->id(),
        ]);

        AuditLog::record('workflow.completed', $req);

        return $req->refresh();
    }
}
