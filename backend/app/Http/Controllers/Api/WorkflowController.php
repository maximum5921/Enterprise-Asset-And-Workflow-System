<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkflowRequest;
use App\Http\Resources\WorkflowResource;
use App\Models\WorkflowRequest;
use App\Services\WorkflowService;
use Illuminate\Http\{JsonResponse, Request};

class WorkflowController extends Controller
{
    public function __construct(private WorkflowService $service) {}

    // GET /api/v1/workflows
    public function index(Request $request): JsonResponse
    {
        $workflows = $this->service->list($request->only([
            'status','type','requester_id','per_page',
        ]));

        return WorkflowResource::collection($workflows)
            ->response()
            ->setStatusCode(200);
    }

    // GET /api/v1/workflows/{id}
    public function show(WorkflowRequest $workflow): JsonResponse
    {
        $workflow->load(['requester','approver','asset','logs.actor','attachments']);
        return (new WorkflowResource($workflow))->response();
    }

    // POST /api/v1/workflows
    public function store(StoreWorkflowRequest $request): JsonResponse
    {
        $workflow = $this->service->create($request->validated());
        return (new WorkflowResource($workflow))->response()->setStatusCode(201);
    }

    // PUT /api/v1/workflows/{id}/approve
    public function approve(Request $request, WorkflowRequest $workflow): JsonResponse
    {
        $request->validate(['notes' => 'nullable|string|max:500']);

        try {
            $workflow = $this->service->approve($workflow, $request->notes ?? '');
            return (new WorkflowResource($workflow))->response();
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // PUT /api/v1/workflows/{id}/reject
    public function reject(Request $request, WorkflowRequest $workflow): JsonResponse
    {
        $request->validate(['reason' => 'required|string|max:500']);

        try {
            $workflow = $this->service->reject($workflow, $request->reason);
            return (new WorkflowResource($workflow))->response();
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // PUT /api/v1/workflows/{id}/complete
    public function complete(WorkflowRequest $workflow): JsonResponse
    {
        $workflow = $this->service->complete($workflow);
        return (new WorkflowResource($workflow))->response();
    }
}
