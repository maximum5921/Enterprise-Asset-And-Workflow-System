<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class WorkflowLog extends Model
{
    use HasUuids;

    protected $fillable = [
        'workflow_request_id',
        'user_id',
        'action',
        'comment',
    ];

    public $incrementing = false;

    protected $keyType = 'string';

    public function workflow()
    {
        return $this->belongsTo(WorkflowRequest::class, 'workflow_request_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
