<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\{BelongsTo,HasMany,MorphMany};

class Asset extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'name','serial_number','category','status',
        'owner_id','location','purchase_date',
        'purchase_price','description','specs',
    ];

    protected $casts = [
        'specs'         => 'array',
        'purchase_date' => 'date',
        'purchase_price'=> 'decimal:2',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(AssetHistory::class)->latest();
    }

    public function workflowRequests(): HasMany
    {
        return $this->hasMany(WorkflowRequest::class);
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    // Scope สำหรับ filter
    public function scopeAvailable($q)
    {
        return $q->where('status', 'available');
    }

    public function scopeByCategory($q, string $category)
    {
        return $q->where('category', $category);
    }
}
