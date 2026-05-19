<?php
namespace App\Services;

use App\Models\{Asset, AssetHistory, AuditLog};
use Illuminate\Pagination\LengthAwarePaginator;

class AssetService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Asset::query()
            ->with(['owner'])
            ->withCount('workflowRequests')
            ->when($filters['search'] ?? null, fn($q,$s) =>
                $q->where('name','like',"%$s%")
                  ->orWhere('serial_number','like',"%$s%"))
            ->when($filters['status'] ?? null, fn($q,$s) =>
                $q->where('status',$s))
            ->when($filters['category'] ?? null, fn($q,$c) =>
                $q->where('category',$c))
            ->when($filters['owner_id'] ?? null, fn($q,$id) =>
                $q->where('owner_id',$id))
            ->orderBy($filters['sort'] ?? 'created_at',
                      $filters['direction'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): Asset
    {
        $asset = Asset::create($data);

        AuditLog::record('asset.created', $asset, [
            'serial_number' => $asset->serial_number,
        ]);

        return $asset->load('owner');
    }

    public function update(Asset $asset, array $data): Asset
    {
        $old = $asset->toArray();
        $asset->update($data);

        AuditLog::record('asset.updated', $asset, [], $old, $asset->fresh()->toArray());

        return $asset->refresh()->load('owner');
    }

    public function assignTo(Asset $asset, int $userId): Asset
    {
        $prevOwner = $asset->owner_id;

        $asset->update([
            'owner_id' => $userId,
            'status'   => 'in_use',
        ]);

        AssetHistory::create([
            'asset_id'         => $asset->id,
            'action'           => 'assigned',
            'actor_id'         => auth()->id(),
            'previous_owner_id'=> $prevOwner,
            'note'             => "Assigned to user ID $userId",
        ]);

        AuditLog::record('asset.assigned', $asset);

        return $asset->refresh()->load('owner');
    }

    public function delete(Asset $asset): void
    {
        AuditLog::record('asset.deleted', $asset);
        $asset->delete();   // soft delete
    }
}
