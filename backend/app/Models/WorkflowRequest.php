<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo,HasMany,MorphMany};

class WorkflowRequest extends Model
{
    use HasUuids;

    protected $fillable = [
        'type','status','requester_id','asset_id',
        'approver_id','title','reason','notes',
        'priority','requested_date','approved_at','completed_at',
    ];

    protected $casts = [
        'approved_at'    => 'datetime',
        'completed_at'   => 'datetime',
        'requested_date' => 'date',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(WorkflowLog::class)->latest();
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function scopePending($q)
    {
        return $q->where('status', 'pending');
    }
}
