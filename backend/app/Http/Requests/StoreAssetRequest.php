<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->user()?->role->name === 'admin';
    }

    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:100',
            'serial_number'  => 'required|string|max:100|unique:assets',
            'category'       => 'required|in:computer,monitor,server,printer,equipment,other',
            'status'         => 'sometimes|in:available,in_use,maintenance,retired',
            'owner_id'       => 'nullable|exists:users,id',
            'location'       => 'nullable|string|max:100',
            'purchase_date'  => 'nullable|date|before_or_equal:today',
            'purchase_price' => 'nullable|numeric|min:0',
            'description'    => 'nullable|string|max:1000',
            'specs'          => 'nullable|array',
            'specs.*'        => 'string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'serial_number.unique'  => 'Serial number นี้มีในระบบแล้ว',
            'category.in'           => 'Category ต้องเป็น computer, monitor, server, printer, equipment หรือ other',
            'purchase_date.before_or_equal' => 'วันที่ซื้อต้องไม่เกินวันนี้',
        ];
    }
}
