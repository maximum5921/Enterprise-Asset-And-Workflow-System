<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\{StoreAssetRequest, UpdateAssetRequest};
use App\Http\Resources\AssetResource;
use App\Models\Asset;
use App\Services\AssetService;
use Illuminate\Http\{JsonResponse, Request};

class AssetController extends Controller
{
    public function __construct(private AssetService $service) {}

    // GET /api/v1/assets
    public function index(Request $request): JsonResponse
    {
        $assets = $this->service->list($request->only([
            'search','status','category','owner_id',
            'sort','direction','per_page',
        ]));

        return AssetResource::collection($assets)
            ->response()
            ->setStatusCode(200);
    }

    // GET /api/v1/assets/{id}
    public function show(Asset $asset): JsonResponse
    {
        $asset->load(['owner','histories.actor','attachments']);

        return (new AssetResource($asset))
            ->response()
            ->setStatusCode(200);
    }

    // POST /api/v1/assets
    public function store(StoreAssetRequest $request): JsonResponse
    {
        $asset = $this->service->create($request->validated());

        return (new AssetResource($asset))
            ->response()
            ->setStatusCode(201);
    }

    // PUT /api/v1/assets/{id}
    public function update(UpdateAssetRequest $request, Asset $asset): JsonResponse
    {
        $asset = $this->service->update($asset, $request->validated());

        return (new AssetResource($asset))
            ->response()
            ->setStatusCode(200);
    }

    // DELETE /api/v1/assets/{id}
    public function destroy(Asset $asset): JsonResponse
    {
        $this->service->delete($asset);
        return response()->json(['message' => 'Asset deleted'], 200);
    }

    // POST /api/v1/assets/{id}/assign
    public function assign(Request $request, Asset $asset): JsonResponse
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        $asset = $this->service->assignTo($asset, $request->user_id);
        return (new AssetResource($asset))->response()->setStatusCode(200);
    }
}
