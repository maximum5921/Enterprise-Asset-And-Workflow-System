<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use HasUuids;

    protected $fillable = [
        'attachable_type','attachable_id',
        'original_name','stored_name','disk',
        'path','mime_type','size','uploaded_by',
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // helper: ดึง URL สำหรับ download
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    // helper: ขนาดไฟล์อ่านง่าย
    public function getHumanSizeAttribute(): string
    {
        $units = ['B','KB','MB','GB'];
        $i = 0;
        $size = $this->size;
        while ($size >= 1024 && $i < 3) { $size /= 1024; $i++; }
        return round($size, 1) . ' ' . $units[$i];
    }
}
