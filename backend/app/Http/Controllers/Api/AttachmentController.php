<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Support\Facades\{Storage, Response};
use Illuminate\Support\Str;

class AttachmentController extends Controller
{
    // POST /api/v1/attachments/{type}/{id}
    public function store(Request $request, string $type, string $id): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx,xlsx|max:10240',
        ]);

        $file       = $request->file('file');
        $storedName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path       = $file->storeAs("attachments/{$type}/{$id}", $storedName, 'local');

        $attachment = Attachment::create([
            'attachable_type' => 'App\Models\\' . ucfirst($type),
            'attachable_id'   => $id,
            'original_name'   => $file->getClientOriginalName(),
            'stored_name'     => $storedName,
            'disk'            => 'local',
            'path'            => $path,
            'mime_type'       => $file->getMimeType(),
            'size'            => $file->getSize(),
            'uploaded_by'     => auth()->id(),
        ]);

        return (new AttachmentResource($attachment))->response()->setStatusCode(201);
    }

    // GET /api/v1/attachments/{id}/download
    public function download(Attachment $attachment)
    {
        abort_unless(Storage::disk($attachment->disk)->exists($attachment->path), 404);

        return Storage::disk($attachment->disk)
            ->download($attachment->path, $attachment->original_name);
    }

    // DELETE /api/v1/attachments/{id}
    public function destroy(Attachment $attachment): JsonResponse
    {
        Storage::disk($attachment->disk)->delete($attachment->path);
        $attachment->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
