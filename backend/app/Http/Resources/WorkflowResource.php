<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AssetResource;
use App\Http\Resources\WorkflowLogResource;
use App\Http\Resources\AttachmentResource;


class WorkflowResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'             => $this->id,
            'type'           => $this->type,
            'status'         => $this->status,
            'title'          => $this->title,
            'reason'         => $this->reason,
            'notes'          => $this->notes,
            'priority'       => $this->priority,
            'requested_date' => $this->requested_date?->toDateString(),
            'approved_at'    => $this->approved_at?->toISOString(),
            'completed_at'   => $this->completed_at?->toISOString(),
            'created_at'     => $this->created_at?->toISOString(),

            'requester' => $this->whenLoaded('requester', fn() => [
                'id'   => $this->requester->id,
                'name' => $this->requester->name,
                'email'=> $this->requester->email,
            ]),
            'approver' => $this->whenLoaded('approver', fn() => [
                'id'   => $this->approver->id,
                'name' => $this->approver->name,
            ]),
            'asset' => $this->whenLoaded('asset', fn() =>
                new AssetResource($this->asset)
            ),
            'logs'        => WorkflowLogResource::collection($this->whenLoaded('logs')),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'attachments_count' => $this->whenCounted('attachments'),
        ];
    }
}
