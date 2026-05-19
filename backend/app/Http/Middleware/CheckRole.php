<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        if (!in_array($user->role->name ?? '', $roles)) {
            return response()->json([
                'error'    => 'Forbidden',
                'required' => $roles,
                'current'  => $user->role->name ?? 'none',
            ], 403);
        }

        return $next($request);
    }
}
