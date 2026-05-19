<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'serial_number'  => $this->serial_number,
            'category'       => $this->category,
            'status'         => $this->status,
            'location'       => $this->location,
            'purchase_date'  => $this->purchase_date?->toDateString(),
            'purchase_price' => $this->purchase_price,
            'description'    => $this->description,
            'specs'          => $this->specs,
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),

            // relations (โหลดเฉพาะเมื่อ with() ถูกเรียก)
            'owner'    => $this->whenLoaded('owner', fn() => [
                'id'   => $this->owner->id,
                'name' => $this->owner->name,
            ]),
            'histories' => WorkflowResource::collection(
                $this->whenLoaded('histories')
            ),
            'attachments' => AttachmentResource::collection(
                $this->whenLoaded('attachments')
            ),
            'workflow_requests_count' => $this->whenCounted('workflowRequests'),
        ];
    }
}
