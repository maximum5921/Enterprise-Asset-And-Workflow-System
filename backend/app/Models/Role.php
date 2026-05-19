<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];
}
