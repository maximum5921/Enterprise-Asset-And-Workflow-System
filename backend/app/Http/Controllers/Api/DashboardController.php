<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Asset, WorkflowRequest, AuditLog, User};
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        // cache 5 นาที เพื่อลด query
        $stats = Cache::remember('dashboard.stats', 300, function () {
            return [
                'assets' => [
                    'total'       => Asset::count(),
                    'available'   => Asset::where('status','available')->count(),
                    'in_use'      => Asset::where('status','in_use')->count(),
                    'maintenance' => Asset::where('status','maintenance')->count(),
                    'retired'     => Asset::where('status','retired')->count(),
                    'by_category' => Asset::selectRaw('category, count(*) as count')
                                        ->groupBy('category')
                                        ->get(),
                ],
                'workflows' => [
                    'pending'   => WorkflowRequest::where('status','pending')->count(),
                    'approved'  => WorkflowRequest::where('status','approved')->count(),
                    'rejected'  => WorkflowRequest::where('status','rejected')->count(),
                    'completed' => WorkflowRequest::where('status','completed')->count(),
                    'by_type'   => WorkflowRequest::selectRaw('type, count(*) as count')
                                        ->groupBy('type')
                                        ->get(),
                ],
                'users' => [
                    'total'  => User::count(),
                    'active' => User::where('is_active',true)->count(),
                ],
                'recent_workflows' => WorkflowRequest::with(['requester','asset'])
                    ->latest()->limit(5)->get(),
                'recent_logs' => AuditLog::with('user')
                    ->latest()->limit(10)->get(),
            ];
        });

        return response()->json($stats);
    }
}
