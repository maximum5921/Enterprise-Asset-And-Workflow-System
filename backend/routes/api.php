<?php
use App\Http\Controllers\Api\{
    AuthController, AssetController,
    WorkflowController, UserController,
    DashboardController, AttachmentController, AuditLogController
};
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public
    Route::get('health', fn() => response()->json(['status'=>'ok','time'=>now()]));
    Route::prefix('auth')->group(function () {
        Route::post('login',    [AuthController::class,'login']);
        Route::post('register', [AuthController::class,'register']);
    });

    // Protected
    Route::middleware('auth:api')->group(function () {

        Route::prefix('auth')->group(function () {
            Route::get('me',       [AuthController::class,'me']);
            Route::post('refresh', [AuthController::class,'refresh']);
            Route::post('logout',  [AuthController::class,'logout']);
        });

        // Dashboard (ทุก role)
        Route::get('dashboard/stats', [DashboardController::class,'stats']);

        // Assets
        Route::get ('assets',         [AssetController::class,'index']);
        Route::get ('assets/{asset}', [AssetController::class,'show']);

        Route::middleware('role:admin,manager')->group(function () {
            Route::post  ('assets',              [AssetController::class,'store']);
            Route::put   ('assets/{asset}',      [AssetController::class,'update']);
            Route::delete('assets/{asset}',      [AssetController::class,'destroy']);
            Route::post  ('assets/{asset}/assign',[AssetController::class,'assign']);
        });

        // Workflows
        Route::get ('workflows',           [WorkflowController::class,'index']);
        Route::get ('workflows/{workflow}',[WorkflowController::class,'show']);
        Route::post('workflows',           [WorkflowController::class,'store']);

        Route::middleware('role:admin,manager')->group(function () {
            Route::put('workflows/{workflow}/approve', [WorkflowController::class,'approve']);
            Route::put('workflows/{workflow}/reject',  [WorkflowController::class,'reject']);
            Route::put('workflows/{workflow}/complete',[WorkflowController::class,'complete']);
        });

        // File Upload (polymorphic)
        Route::post  ('attachments/{type}/{id}',  [AttachmentController::class,'store']);
        Route::delete('attachments/{attachment}', [AttachmentController::class,'destroy']);
        Route::get   ('attachments/{attachment}/download', [AttachmentController::class,'download']);

        // Users (admin only)
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('users', UserController::class);
            Route::get('audit-logs', [AuditLogController::class,'index']);
        });
    });
});
