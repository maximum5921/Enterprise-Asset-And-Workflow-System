<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id','action','subject_type','subject_id',
        'old_values','new_values','meta','ip_address','user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'meta'       => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ใช้งานง่าย: AuditLog::record('asset.created', $asset)
    public static function record(
        string $action,
        ?Model $subject = null,
        array  $meta    = [],
        array  $old     = [],
        array  $new     = []
    ): static {
        return static::create([
            'user_id'      => auth()->id(),
            'action'       => $action,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id'   => $subject?->getKey(),
            'old_values'   => $old ?: null,
            'new_values'   => $new ?: null,
            'meta'         => $meta ?: null,
            'ip_address'   => request()->ip(),
            'user_agent'   => request()->userAgent(),
            'created_at'   => now(),
        ]);
    }
}
