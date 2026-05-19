<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AttachmentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'original_name' => $this->original_name,
            'mime_type'     => $this->mime_type,
            'size'          => $this->size,
            'human_size'    => $this->human_size,  // accessor จาก Model
            'url'           => Storage::disk($this->disk)->url($this->path),
            'uploaded_by'   => $this->whenLoaded('uploader', fn() => [
                'id'   => $this->uploader->id,
                'name' => $this->uploader->name,
            ]),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
