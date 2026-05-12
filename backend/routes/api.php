<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\WorkflowController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::get('health', fn() => response()->json(['status' => 'ok']));

    Route::prefix('auth')->group(function () {
        Route::post('login',    [AuthController::class, 'login']);
        Route::post('register', [AuthController::class, 'register']);

        Route::middleware('auth:api')->group(function () {
            Route::get('me',        [AuthController::class, 'me']);
            Route::post('refresh',  [AuthController::class, 'refresh']);
            Route::post('logout',   [AuthController::class, 'logout']);
        });
    });

    Route::middleware('auth:api')->group(function () {
        Route::apiResource('assets', AssetController::class)->only(['index','show']);
        Route::apiResource('workflows', WorkflowController::class)->only(['index','show','store']);

        Route::middleware('role:admin,manager')->group(function () {
            Route::put('workflows/{id}/approve', [WorkflowController::class, 'approve']);
            Route::put('workflows/{id}/reject',  [WorkflowController::class, 'reject']);
            Route::apiResource('assets', AssetController::class)->only(['store','update','destroy']);
        });

        Route::middleware('role:admin')->group(function () {
            Route::apiResource('users', UserController::class);
        });
    });
});
