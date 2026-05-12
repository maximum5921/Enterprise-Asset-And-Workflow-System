<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;  // ต้องมีบรรทัดนี้
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'name', 'email', 'password',
        'role_id', 'line_token', 'is_active'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'is_active'  => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role'  => $this->role->name ?? 'employee',
            'email' => $this->email,
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
