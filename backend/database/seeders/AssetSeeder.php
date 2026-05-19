<?php
namespace Database\Seeders;

use App\Models\{Asset, User};
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        $employee = User::where('email','employee@enterprise.local')->first();

        $assets = [
            [
                'name'          => 'Dell Latitude 5540',
                'serial_number' => 'DELL-001-2024',
                'category'      => 'computer',
                'status'        => 'in_use',
                'owner_id'      => $employee->id,
                'location'      => 'Office Floor 3',
                'purchase_date' => '2024-01-15',
                'purchase_price'=> 35000,
                'specs'         => ['cpu'=>'i7-1355U','ram'=>'16GB','storage'=>'512GB SSD'],
            ],
            [
                'name'          => 'Dell UltraSharp 27"',
                'serial_number' => 'MON-001-2024',
                'category'      => 'monitor',
                'status'        => 'available',
                'location'      => 'IT Store Room',
                'purchase_date' => '2024-02-01',
                'purchase_price'=> 12000,
                'specs'         => ['size'=>'27 inch','resolution'=>'2560x1440'],
            ],
            [
                'name'          => 'HP ProLiant DL380',
                'serial_number' => 'SRV-001-2023',
                'category'      => 'server',
                'status'        => 'in_use',
                'location'      => 'Server Room B1',
                'purchase_date' => '2023-06-10',
                'purchase_price'=> 280000,
                'specs'         => ['cpu'=>'Xeon Gold 6226R','ram'=>'128GB','storage'=>'4x 1.2TB SAS'],
            ],
        ];

        foreach ($assets as $a) {
            Asset::updateOrCreate(
                ['serial_number' => $a['serial_number']],
                $a
            );
        }
    }
}
