<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkflowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->check();
    }

    public function rules(): array
    {
        return [
            'type'           => 'required|in:borrow,repair,purchase,transfer,return',
            'title'          => 'required|string|max:150',
            'reason'         => 'required|string|max:1000',
            'asset_id'       => 'nullable|exists:assets,id',
            'priority'       => 'sometimes|integer|in:1,2,3',
            'requested_date' => 'nullable|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in'    => 'ประเภทคำขอต้องเป็น borrow, repair, purchase, transfer หรือ return',
            'asset_id.exists' => 'ไม่พบ asset ที่ระบุในระบบ',
            'requested_date.after_or_equal' => 'วันที่ขอต้องไม่ใช่อดีต',
        ];
    }
}
